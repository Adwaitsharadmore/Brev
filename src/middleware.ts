import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  try {
    // Log the request path for debugging
    console.log("Middleware processing request for path:", request.nextUrl.pathname);

    // Handle AuthKit authentication
    const authkitHandler = authkitMiddleware();
    console.log("AuthKit handler created");

    try {
      const authkitResponse = await authkitHandler(request, event);
      console.log("AuthKit response status:", authkitResponse?.status);
      
      if (!authkitResponse || authkitResponse.status !== 200) {
        console.log("AuthKit authentication failed");
        return authkitResponse || NextResponse.json(
          { error: "Authentication failed" },
          { status: 401 }
        );
      }
    } catch (authError: any) {
      console.error("AuthKit error:", authError);
      return NextResponse.json(
        { error: "Authentication error", details: authError?.message || "Unknown error" },
        { status: 500 }
      );
    }

    // Create Supabase client
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    try {
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
      console.log("Supabase session refreshed successfully");
    } catch (supabaseError: any) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json(
        { error: "Database error", details: supabaseError?.message || "Unknown error" },
        { status: 500 }
      );
    }

    return response;
  } catch (error: any) {
    console.error("Middleware error:", error);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error?.message || "Unknown error",
        path: request.nextUrl.pathname
      },
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