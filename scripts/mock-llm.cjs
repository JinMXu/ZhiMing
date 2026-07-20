/* eslint-disable @typescript-eslint/no-require-imports -- 桩服务故意用 CommonJS，脱离 TS 工具链独立运行 */
/**
 * 本地冒烟测试用的 OpenAI 兼容桩服务：把 prompt 事实回显为流式解读。
 * 仅用于本地验证流式链路，不参与生产代码。
 */
const http = require("node:http");

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || !req.url.endsWith("/chat/completions")) {
    res.writeHead(404);
    res.end();
    return;
  }
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    let userMsg = "";
    try {
      const j = JSON.parse(body);
      userMsg = (j.messages ?? []).map((m) => m.content).join(" ").replace(/\s+/g, " ").slice(0, 100);
    } catch {
      /* 忽略，桩服务不挑剔 */
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    const text = `## 模拟解读\n\n已收到排盘事实：${userMsg}…\n\n**这是桩服务生成的测试解读**，用于验证流式链路。命理占卜仅供娱乐参考。`;
    const chunks = text.match(/[\s\S]{1,16}/g) ?? [];
    let i = 0;
    const timer = setInterval(() => {
      if (i >= chunks.length) {
        res.write(
          'data: {"id":"mock","object":"chat.completion.chunk","created":0,"model":"mock","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}\n\n',
        );
        res.write("data: [DONE]\n\n");
        clearInterval(timer);
        res.end();
        return;
      }
      const delta = { content: chunks[i] };
      if (i === 0) delta.role = "assistant";
      i += 1;
      res.write(
        `data: ${JSON.stringify({ id: "mock", object: "chat.completion.chunk", created: 0, model: "mock", choices: [{ index: 0, delta }] })}\n\n`,
      );
    }, 5);
  });
});

server.listen(4010, "127.0.0.1", () => console.log("mock llm listening on 4010"));
