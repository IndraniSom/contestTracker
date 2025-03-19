import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Get token from cookies

  console.log("Middleware running...");
  console.log("Token:", token);

  if (!token) {
    console.log("No token found! Redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("User authenticated! Proceeding...");
  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/contests/:path*"], // Protect these routes
};
