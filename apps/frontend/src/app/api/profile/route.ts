
import { mockProfile } from "@/mocks/profile.mock";
import { NextResponse } from "next/server";

export async function GET() {
  return  NextResponse.json({
    success:true,
    message:"Profile fetched successfully",
    mockProfile
  })
}