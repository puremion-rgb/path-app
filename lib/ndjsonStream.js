// 서버 → 클라이언트로 Agent의 진행 단계(step)를 실시간으로 흘려보내기 위한
// 아주 단순한 NDJSON(줄바꿈으로 구분된 JSON) 스트림 헬퍼입니다.
// SSE 대신 이 방식을 쓰는 이유: fetch()의 body 스트림만으로 클라이언트에서
// 별도 라이브러리 없이 바로 파싱할 수 있기 때문입니다.

export function createNdjsonStream(work) {
  const encoder = new TextEncoder();
  let controllerRef;

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
    },
  });

  function send(obj) {
    controllerRef.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
  }

  (async () => {
    try {
      await work(send);
    } catch (e) {
      send({ type: "error", message: e?.message || "알 수 없는 오류가 발생했습니다." });
    } finally {
      controllerRef.close();
    }
  })();

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function readNdjsonStream(response, onLine) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onLine(JSON.parse(line));
      } catch {
        // 파싱 실패한 줄은 무시
      }
    }
  }
  if (buffer.trim()) {
    try {
      onLine(JSON.parse(buffer));
    } catch {}
  }
}
