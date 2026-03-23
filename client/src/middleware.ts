import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
  "/auth/register",
  "/auth/login",
  "/",
  "/about",
  "/contact",
  "/listing",
  "/listing/:path*",
];

const userRoutes = ["/home", "/cart", "/checkout", "/account"];
const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shopping-web-3jr0.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
const BACKEND_URL = `${API_BASE_URL}/api`;

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
  
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const { role } = payload as { role: string };


    const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";

    if (isAdmin && userRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/super-admin", request.url));
    }

    if (!isAdmin && superAdminRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Token expired or invalid:", err);

    // Attempt to refresh access token
    try {
      const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (refreshResponse.ok) {
        // Token refreshed successfully — continue request
        return NextResponse.next();
      }
    } catch (refreshErr) {
      console.error("Refresh token failed:", refreshErr);
    }

    // If refresh fails — clear cookies and redirect to login
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

// Middleware runs on all non-static, non-API routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)",
  ],
};
