"use client";

import { useRouter } from "next/navigation";
import * as productsApi from "@/lib/api/seller/products";
import { paths } from "@/lib/auth/paths";
import { useToast } from "@/contexts/ToastContext";
import { NewProductComposer } from "@/components/seller/NewProductComposer";
import type { ProductCreate } from "@/types/seller/product";

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();

  async function handlePublish(data: ProductCreate, mode: "list" | "edit") {
    const product = await productsApi.createProduct(data);
    toast.success("محصول منتشر شد");
    if (mode === "edit") {
      router.push(paths.seller.productEdit(product.id));
      return product;
    }
    router.push(paths.seller.products);
    return product;
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-1 sm:py-2">
      <NewProductComposer onPublish={handlePublish} />
    </div>
  );
}
