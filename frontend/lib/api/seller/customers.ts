import { apiGet } from "@/lib/api/client";
import type { PaginatedResponse } from "@/types/api/pagination";
import type {
  ListSellerCustomersParams,
  SellerCustomerDetail,
  SellerCustomerListItem,
} from "@/types/seller/customer";

function buildQuery(params: ListSellerCustomersParams): string {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.page) q.set("page", String(params.page));
  if (params.page_size) q.set("page_size", String(params.page_size));
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function listCustomers(
  params: ListSellerCustomersParams = {},
): Promise<PaginatedResponse<SellerCustomerListItem>> {
  return apiGet<PaginatedResponse<SellerCustomerListItem>>(
    `/api/v1/seller/customers${buildQuery(params)}`,
  );
}

export function getCustomer(key: string): Promise<SellerCustomerDetail> {
  return apiGet<SellerCustomerDetail>(
    `/api/v1/seller/customers/${encodeURIComponent(key)}`,
  );
}
