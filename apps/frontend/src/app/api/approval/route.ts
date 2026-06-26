import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { approvalId, action, editedInput } = body;

    if (!approvalId) {
      return NextResponse.json({
        success: false,
        message: "approvalId is required",
        status: 400
      })

    }

    if (!["approve", "reject", "edit"].includes(action)) {
      return NextResponse.json({
        success: false,
        message: "action must be approve, reject, or edit",
        status: 400
      })
        ;
    }

    return NextResponse.json({

      approvalId,
      action,
      editedInput: editedInput || null,
      status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "edited",
      processedAt: new Date().toISOString(),
      message: "Approval processed successfully",
      success: true
    }



    );
  } catch {
    return NextResponse.json({
      success: false,
      message: "Invalid request body",
      status: 400
    })

  }
}