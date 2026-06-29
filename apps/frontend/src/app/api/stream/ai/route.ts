function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sseData(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
  const encoder = new TextEncoder();

  const tokens = [
    "Hello, ",
    "I am ",
    "your AI ",
    "assistant. ",
    "This response ",
    "is streaming ",
    "token by token.",
  ];

  const stream = new ReadableStream({
    async start(controller) {
      for (const token of tokens) {
        await sleep(500);

        controller.enqueue(
          encoder.encode(
            sseData({
              type: "token",
              content: token,
            })
          )
        );
      }

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
}