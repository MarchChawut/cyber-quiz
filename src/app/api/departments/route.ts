import { NextResponse } from "next/server";
import { departmentOptions } from "@/data/departmentOptions"; // ✅ นำเข้าจากไฟล์แยก

export async function GET() {
  return NextResponse.json(departmentOptions, { status: 200 });
}
