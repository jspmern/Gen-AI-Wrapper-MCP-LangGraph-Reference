 
import { mockPendingApprovals } from "@/mocks/approval.mock";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
     mockPendingApprovals,
    message:"Pending approvals fetched successfully"
  });
}