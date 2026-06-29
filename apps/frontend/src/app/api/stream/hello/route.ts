function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(new TextEncoder().encode("Hello "));
      await sleep(1000);

      controller.enqueue(new TextEncoder().encode("World "));
      await sleep(1000);

      controller.enqueue(new TextEncoder().encode("Done"));

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}