"use client";

import { usePathname } from "next/navigation";
import Header from "../user/header";
import Footer from "../user/footer";

const pathsNotToShowHeaders = ["/auth", "/super-admin"];

function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const showHeader = !pathsNotToShowHeaders.some((currentPath) =>
    pathName.startsWith(currentPath)
  );

  return (
    <div className="min-h-screen">
      {showHeader && <Header />}
      <main>{children}</main>
      {showHeader && <Footer />}
    </div>
  );
}

export default CommonLayout;
