import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log(req, "data")
  try {
    // Clear the token from cookies by setting an expired cookie
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });

    // Set cookie to expire immediately
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error) {
    console.error("Failed to logout user:", error);
    return NextResponse.json({ success: false, error: "Failed to logout user" }, { status: 500 });
  }
}
