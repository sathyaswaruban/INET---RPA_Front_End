// /api/user-task-history/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET() {
  try {
    const history = await prisma.user_task_history.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Fetch history failed", error);
    return NextResponse.json({ success: false, error: "DB Fetch Failed" }, { status: 500 });
  }
}
