import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware();

// Match against the pages
export const config = {
    matcher: ["/", "/responsePage/:path*", "/api/:path*", "/account", '/instruments','/api/files/upload-doc','/User','/DocumentList'] };