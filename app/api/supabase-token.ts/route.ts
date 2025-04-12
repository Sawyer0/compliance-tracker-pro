import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseToken = jwt.sign({ sub: userId }, SUPABASE_JWT_SECRET, {
    expiresIn: "1h",
  });

  return NextResponse.json({ token: supabaseToken });
}
