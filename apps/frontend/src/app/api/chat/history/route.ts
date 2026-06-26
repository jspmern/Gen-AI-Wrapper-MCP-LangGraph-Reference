import { mockChatHistory } from "@/mocks/chat.mock";
import { NextResponse } from "next/server";

export function GET()
{
    return NextResponse.json({
        success:true,
        message:"Chat Histroy successfully fetched",
        mockChatHistory
    })
}