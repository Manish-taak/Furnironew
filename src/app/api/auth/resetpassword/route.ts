import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // In a real application, you might invalidate the token here
  return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
}
