import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

function formatIST(date: Date) {
  const ist = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return ist.toISOString().slice(0, 19).replace("T", " ");
}


export async function GET() {
  try {
    const history = await prisma.user_task_history.findMany({
      orderBy: { createdAt: "desc" },
    });

    const dataWithIST = history.map((item) => ({
      ...item,
      createdAt: formatIST(item.createdAt)
    }));

    return NextResponse.json({ success: true, data: dataWithIST });
  } catch (error) {
    console.error("Fetch history failed", error);
    return NextResponse.json({ success: false, error: "DB Fetch Failed" }, { status: 500 });
  }
}

