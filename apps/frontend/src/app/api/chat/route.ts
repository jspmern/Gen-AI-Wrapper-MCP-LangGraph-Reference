import { NextRequest } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sseData(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || typeof body.message !== "string") {
      return Response.json(
        {
          success: false,
          message: "Message is required",
        },
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const chunks = [
          "I am checking your request. ",
          "This is a dummy streaming response. ",
          `You asked: "${body.message}". `,
          "Later this will come from LangGraph + MCP tools.",
        ];

        controller.enqueue(
          encoder.encode(
            sseData({
              type: "start",
              messageId: `msg_${Date.now()}`,
            })
          )
        );

        for (const chunk of chunks) {
          await sleep(500);

          controller.enqueue(
            encoder.encode(
              sseData({
                type: "token",
                content: chunk,
              })
            )
          );
        }

        await sleep(300);

        controller.enqueue(
          encoder.encode(
            sseData({
              type: "tool",
              toolCall: {
                id: "tool_001",
                name: "get_employee",
                status: "completed",
                input: {
                  employeeId: "emp_001",
                },
                output: {
                  name: "Rahul Sharma",
                  department: "Engineering",
                },
              },
            })
          )
        );

        controller.enqueue(
          encoder.encode(
            sseData({
              type: "done",
            })
          )
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Invalid request body",
      },
      { status: 400 }
    );
  }
}