import { withAuth } from "@workos-inc/authkit-nextjs";
import ClientUploadComponent from "./ClientUploadComponent";
import DocumentList from "./DocumentList";

export default async function responsePage() {
  // Ensure the user is authenticated and fetch their details
  const { user } = await withAuth({ ensureSignedIn: true });

  if (!user) {
    return <div>User not authenticated</div>;
  }

  return (
    <div className="container mx-auto mt-8 max-w-[560px]">
      <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
        <h1 className="text-3xl font-semibold">Upload File</h1>
      </div>
      {/* Pass the user's ID to the client component */}
      <ClientUploadComponent userId={user.id} />
      <DocumentList userId={user.id} />
    </div>
  );
}
