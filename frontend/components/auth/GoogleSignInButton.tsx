"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const GIS_SCRIPT = "https://accounts.google.com/gsi/client";

type GoogleSignInButtonProps = {
  onCredential: (idToken: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup" | "redirect";
            auto_select?: boolean;
            context?: string;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
              locale?: string;
            },
          ) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

function loadGisScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("gis")), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("gis"));
    document.head.appendChild(script);
  });
}

export function GoogleSignInButton({
  onCredential,
  disabled = false,
  className,
}: GoogleSignInButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";
  const hostRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;

    void (async () => {
      try {
        // Google is unreachable from many Iranian connections without a VPN, and a filtered
        // request can hang instead of failing. Give up quietly so the email form stays the
        // only option instead of showing an error to everyone.
        await Promise.race([
          loadGisScript(),
          new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("gis timeout")), 8000)),
        ]);
        // Wait one frame so the host div is mounted (Strict Mode safe).
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (cancelled || !hostRef.current || !window.google?.accounts?.id) return;
        hostRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: async (response) => {
            const token = response.credential;
            if (!token) return;
            setBusy(true);
            try {
              // The parent form shows any error from here.
              await onCredentialRef.current(token);
            } catch {
              // Already reported by the parent.
            } finally {
              setBusy(false);
            }
          },
        });
        const width = Math.min(360, Math.max(240, hostRef.current.clientWidth || 320));
        window.google.accounts.id.renderButton(hostRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width,
          locale: "fa",
        });
        if (!cancelled) setGisReady(true);
      } catch {
        // Script blocked or slow: leave the button hidden.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (!clientId) {
    return null;
  }

  return (
    <div className={cn(gisReady && "space-y-3", className)}>
      <div
        ref={hostRef}
        className={cn(
          "flex w-full justify-center overflow-hidden",
          gisReady && "min-h-11",
          (disabled || busy) && "pointer-events-none opacity-60",
        )}
        aria-busy={busy}
      />
      {gisReady ? (
        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-foreground-muted">یا با رمز عبور</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      ) : null}
    </div>
  );
}
