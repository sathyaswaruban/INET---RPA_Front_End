// /api/user-task-history/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

function formatIST(date: Date) {
  const ist = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return ist.toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:mm:ss"
}


export async function GET() {
  try {
    const history = await prisma.user_task_history.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Convert createdAt to IST for each record
    const dataWithIST = history.map((item) => ({
      ...item,
      createdAt: formatIST(item.createdAt)
    }));

    // Return the modified version
    return NextResponse.json({ success: true, data: dataWithIST });
  } catch (error) {
    console.error("Fetch history failed", error);
    return NextResponse.json({ success: false, error: "DB Fetch Failed" }, { status: 500 });
  }
}

