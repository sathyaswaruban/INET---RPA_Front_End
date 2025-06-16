import { successResponse } from "@/lib/response";
import { NextResponse } from "next/server";

export async function GET() {
  const message = "nextjs api route is working";
  return NextResponse.json(successResponse(message));
}
