function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sseData(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        await sleep(1000);

        controller.enqueue(
          encoder.encode(
            sseData({
              type: "number",
              value: i,
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