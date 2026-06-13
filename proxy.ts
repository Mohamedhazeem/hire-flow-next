import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/features/auth/libs/auth";

const authPages = ["/login", "/register"];
const protectedRoutes = ["/admin", "/company", "/user"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const isAuthPage = authPages.includes(pathname);

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const userRole = session?.user ? (session.user as { role: string }).role : undefined;

  // 1. SIGNED-IN USERS: Redirect if they touch auth pages OR the generic /dashboard root
  if (session && isAuthPage) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (userRole === "RECRUITER") {
      return NextResponse.redirect(new URL("/company", request.url));
    } else {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  // 2. GUEST USERS: Kick them out if they try to access any protected route
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/company/:path*", "/user/:path*", "/login", "/register"],
};
