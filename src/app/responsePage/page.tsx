// This file remains a Server Component (no "use client" directive)
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Import only what's needed for server rendering
import { withAuth } from "@workos-inc/authkit-nextjs";

// Use dynamic import with ssr: false for the client component
const ClientResponseContent = dynamic(
  () => import("./ClientResponseContent"),
  { ssr: false } // This ensures the component only renders on the client
);

// Server component
const ResponsePage = async () => {
  // Authentication handled on the server side
  const authProps = await withAuth({ ensureSignedIn: true });

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Button asChild size="sm" variant="secondary">
        <Link href="/account">View account</Link>
      </Button>
      <ClientResponseContent {...authProps} />
    </Suspense>
  );
};

export default ResponsePage;
