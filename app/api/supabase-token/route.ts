import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseToken = jwt.sign(
      {
        sub: userId,
        role: "authenticated",
        clerk_user_id: userId,
      },
      SUPABASE_JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return NextResponse.json({ token: supabaseToken });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
