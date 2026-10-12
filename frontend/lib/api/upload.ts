import { apiRequest, type ApiRequestOptions } from "@/lib/api/client";

export function apiPostForm<T>(
  path: string,
  formData: FormData,
  auth = false,
  options?: Pick<ApiRequestOptions, "preferCustomerAuth">,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: formData,
    auth,
    preferCustomerAuth: options?.preferCustomerAuth,
  });
}
