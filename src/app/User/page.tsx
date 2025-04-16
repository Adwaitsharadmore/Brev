import { withAuth } from "@workos-inc/authkit-nextjs";
import UserDashboardClient from "./UserDashboardClient";
import { redirect } from "next/navigation";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role?: string;
  permissions?: string[];
}

// Server Component
export default async function UserDashboard() {
  try {
    const { user, role, permissions } = await withAuth({
      ensureSignedIn: true,
    });

    const userData: UserData = {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      id: user?.id || "",
      role: role || undefined,
      permissions: permissions || undefined,
    };

    return <UserDashboardClient userData={userData} />;
  } catch (error) {
    // Redirect to login if authentication fails
    redirect("/login");
  }
}
