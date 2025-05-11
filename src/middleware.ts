import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  try {
    // Handle AuthKit authentication
    const authkitHandler = authkitMiddleware();
    const authkitResponse = await authkitHandler(request, event);
    
    if (!authkitResponse || authkitResponse.status !== 200) {
      return authkitResponse || NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Create Supabase client
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // Refresh session if expired
    await supabase.auth.getSession();

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Match against the pages
export const config = {
  matcher: [
    "/",
    "/responsePage/:path*",
    "/api/:path*",
    "/account",
    "/instruments",
    "/api/files/upload-doc",
    "/User",
    "/DocumentList",
  ],
};