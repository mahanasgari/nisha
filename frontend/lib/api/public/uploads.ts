import { apiPostForm } from "@/lib/api/upload";
import type { MediaUploadResponse } from "@/types/public/upload";

type UploadAuthOptions = {
  /** Prefer customer JWT when both seller and customer sessions exist. */
  preferCustomer?: boolean;
};

export function uploadPublicFile(
  file: File,
  options?: UploadAuthOptions,
): Promise<MediaUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiPostForm<MediaUploadResponse>("/api/v1/public/uploads/files", form, true, {
    preferCustomerAuth: options?.preferCustomer,
  });
}

export function uploadPublicImage(
  file: File,
  options?: UploadAuthOptions,
): Promise<MediaUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiPostForm<MediaUploadResponse>("/api/v1/public/uploads/images", form, true, {
    preferCustomerAuth: options?.preferCustomer,
  });
}

export function uploadPublicVideo(
  file: File,
  options?: UploadAuthOptions,
): Promise<MediaUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiPostForm<MediaUploadResponse>("/api/v1/public/uploads/videos", form, true, {
    preferCustomerAuth: options?.preferCustomer,
  });
}

export function uploadGuestFile(file: File): Promise<MediaUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiPostForm<MediaUploadResponse>("/api/v1/public/uploads/guest/files", form, false);
}

export function uploadGuestImage(file: File): Promise<MediaUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiPostForm<MediaUploadResponse>("/api/v1/public/uploads/guest/images", form, false);
}
