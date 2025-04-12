import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const user = await currentUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.emailAddresses[0].emailAddress,
    name: `${user.firstName} ${user.lastName}`,
    role: user.publicMetadata.role || "user",
  };
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

