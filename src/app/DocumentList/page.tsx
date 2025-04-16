import { withAuth } from "@workos-inc/authkit-nextjs";
import DocumentListClient from "./DocumentListClient";
import { redirect } from "next/navigation";

export default async function DocumentListPage() {
  try {
    const { user } = await withAuth({
      ensureSignedIn: true,
    });

    if (!user?.id) {
      redirect("/login");
    }

    return <DocumentListClient userId={user.id} />;
  } catch (error) {
    redirect("/login");
  }
}
