"use client";

import { useState } from "react";

export default  function StreamTest() {
  const [isRunning, setRunning] = useState(false);
  const [log, setLogs] = useState([]);
  async function startStream() {
    setLogs([]);
    setRunning(true);
    const res = await fetch("http://localhost:3000/api/stream/ai");
    setRunning(true);
    if (!res.body) {
      setRunning(false);
      return;
    }
      const reader = res.body.getReader();
      console.log('reader',reader)
    const decoder = new TextDecoder();
     let buffer = "";
     while(true)
     {
       const { value, done } = await reader.read();
       if(done) break
          buffer += decoder.decode(value, { stream: true });
              const events = buffer.split("\n\n");
               buffer = events.pop() || "";
         for (const event of events) {
        if (!event.startsWith("data: ")) continue;

        const json = event.replace("data: ", "");
        const parsed = JSON.parse(json);

        if (parsed.type === "token") {
            console.log('',log ,parsed.content)
         setLogs((prev) => {
    const oldText = prev[0] || "";
    return [oldText + parsed.content];
  });
        }

        if (parsed.type === "done") {
          setLogs((prev) => [...prev, "Stream done"]);
        }
      }
    }
       setRunning(false);
     }
  

 return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Stream Test</h1>

      <button
        onClick={startStream}
        disabled={isRunning}
        className="mt-4 rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {isRunning ? "Streaming..." : "Start Stream"}
      </button>

      <div className="mt-6 space-y-2">
        {log.map((log, index) => (
          <div key={index} className="rounded border bg-white p-3">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
