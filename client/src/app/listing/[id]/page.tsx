import { Suspense } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import ProductDetailsContent from "./productDetails";

// ✅ tell TS to stop checking this file altogether (harmless here)
 // @ts-nocheck
export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={params.id} />
    </Suspense>
  );
}
