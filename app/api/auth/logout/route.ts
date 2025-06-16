import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create the response
    const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });

    // Clear the token cookie
    response.cookies.set({
      name: "token",
      value: "",
      maxAge: -1, // Immediately expire the cookie
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
