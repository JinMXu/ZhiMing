import { streamText } from "ai";
import { getModel } from "@/lib/llm";
import { divineRequestSchema, type DivineRequest } from "@/lib/divine/types";
import { SYSTEM_PROMPT, type PreparedReading } from "@/lib/divine/common";
import * as bazi from "@/lib/divine/bazi";
import * as tarot from "@/lib/divine/tarot";
import * as iching from "@/lib/divine/iching";
import * as fortune from "@/lib/divine/fortune";
import * as match from "@/lib/divine/match";

export const runtime = "nodejs";

function prepare(req: DivineRequest): PreparedReading {
  switch (req.type) {
    case "bazi":
      return bazi.prepare(req.payload);
    case "tarot":
      return tarot.prepare(req.payload);
    case "iching":
      return iching.prepare(req.payload);
    case "fortune":
      return fortune.prepare(req.payload);
    case "match":
      return match.prepare(req.payload);
  }
}

/**
 * 统一占卜接口。
 * 响应为 application/x-ndjson：首行是结构化结果 JSON（facts），其后是 LLM 解读文本流。
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "请求格式错误" }, { status: 400 });
  }

  const parsed = divineRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "输入有误" }, { status: 400 });
  }

  let prepared: PreparedReading;
  try {
    prepared = prepare(parsed.data);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "计算失败，请检查输入" },
      { status: 400 },
    );
  }

  let result;
  try {
    result = streamText({
      model: getModel(),
      system: SYSTEM_PROMPT,
      prompt: prepared.prompt,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "未知错误";
    const status = msg.includes("DEEPSEEK_API_KEY") ? 500 : 502;
    return Response.json({ error: `解读失败：${msg}` }, { status });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(JSON.stringify(prepared.facts) + "\n"));
      try {
        for await (const chunk of result.textStream) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `\n\n> 解读中断：${err instanceof Error ? err.message : "网络异常"}，请稍后重试。`,
          ),
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
