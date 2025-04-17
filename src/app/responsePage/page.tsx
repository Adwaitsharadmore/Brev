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
        <Link href="/User">View account</Link>
      </Button>
      
      <ClientResponseContent {...authProps} />
    </Suspense>
  );
};

export default ResponsePage;
// import { withAuth } from "@workos-inc/authkit-nextjs";
// import ClientUploadComponent from "./ClientUploadComponent";
// import DocumentList from "./DocumentList";

// export default async function responsePage() {
//   // Ensure the user is authenticated and fetch their details
//   const { user } = await withAuth({ ensureSignedIn: true });

//   if (!user) {
//     return <div>User not authenticated</div>;
//   }

//   return (
//     <div className="container mx-auto mt-8 max-w-[560px]">
//       <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
//         <h1 className="text-3xl font-semibold">Upload File</h1>
//       </div>
//       {/* Pass the user's ID to the client component */}
//       <ClientUploadComponent userId={user.id} />
//       <DocumentList userId={user.id} />
//     </div>
//   );
// }
