import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prismaClient";
import { getCurrentUser } from "@/lib/auth";
import { Roles } from "@/constants/enumdata";

export async function POST(request: Request) {
  const RolesData = Roles;

  try {
    // Verify the current user is an admin
    const currentUser = await getCurrentUser();
    // console.log("currentUser", currentUser);
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    if (currentUser.role !== RolesData.ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized - Admin privileges required" }, { status: 403 });
    }

    // Proceed with registration if user is admin
    const { email, password, name, role } = await request.json();

    // Validate inputs
    if (!email || !password || !name || !role) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
