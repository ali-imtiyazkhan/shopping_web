import { Suspense } from "react";
import SuperAdminManageProductPage from "./SuperAdminManager.productPage";

export default function AddProductPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <SuperAdminManageProductPage />
    </Suspense>
  );
}
