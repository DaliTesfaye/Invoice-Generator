import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for the JWT token in cookies
  const token = request.cookies.get("jwt")?.value;

  // If there's no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token exists, proceed to the requested route
  return NextResponse.next();
}

// Specify the protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/clients/:path*",
    "/invoices/:path*",
  ],
};
