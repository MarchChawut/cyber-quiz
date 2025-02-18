import { NextResponse } from "next/server";
import { rankOptions } from "@/data/rankOptions"; // ✅ นำเข้าจากไฟล์แยก

export async function GET() {
  return NextResponse.json(rankOptions, { status: 200 });
}
