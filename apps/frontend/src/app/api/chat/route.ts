import { NextRequest, NextResponse } from "next/server";
 
import { createMockAiResponse } from "@/mocks/chat.mock";


 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || typeof body.message !== "string") {
       return NextResponse.json(
    {
      success: false,
      message:"message is required",
      status:400
    }
  );
    }

    const aiResponse = createMockAiResponse(body.message);
     return NextResponse.json(
    {
      success: true,
      message:"AI response generated successfully",
       aiResponse,
    })

  } catch {
       return NextResponse.json(
    {
      success: false,
      message:"invalid request body",
      status:400
    })
  }
}