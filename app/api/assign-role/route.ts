import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST() {
  const { userId } = await auth(); 

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses?.[0]?.emailAddress ?? "";

  let role = "user";

  if (email.endsWith("@yourcompany.com")) {
    role = "admin";
  }

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: { role },
  });

  return new Response(`Assigned role: ${role}`, { status: 200 });
}
