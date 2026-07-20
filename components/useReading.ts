"use client";

import { useCallback, useRef, useState } from "react";
import { saveRecord } from "@/lib/records";
import type { ReadingFacts } from "@/lib/divine/facts";

export interface ReadingState<T = unknown> {
  facts: T | null;
  text: string;
  loading: boolean;
  error: string | null;
  started: boolean;
}

const INITIAL: ReadingState<never> = {
  facts: null,
  text: "",
  loading: false,
  error: null,
  started: false,
};

/**
 * 调用 /api/divine 并读取 NDJSON 流：
 * 首行解析为 facts（结构化结果），其余内容逐块追加为解读文本。
 */
export function useReading<T = unknown>() {
  const [state, setState] = useState<ReadingState<T>>(INITIAL as ReadingState<T>);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async (type: string, payload: unknown) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ ...(INITIAL as ReadingState<T>), loading: true, started: true });

    try {
      const res = await fetch("/api/divine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `请求失败（${res.status}）`);
      }
      if (!res.body) throw new Error("响应为空，请重试");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let factsDone = false;

      let facts: T | null = null;
      let fullText = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        if (!factsDone) {
          const nl = buffer.indexOf("\n");
          if (nl === -1) continue;
          try {
            facts = JSON.parse(buffer.slice(0, nl)) as T;
          } catch {
            // facts 解析失败不阻断解读流
          }
          buffer = buffer.slice(nl + 1);
          factsDone = true;
          setState((s) => ({ ...s, facts }));
        }

        if (buffer) {
          const chunk = buffer;
          buffer = "";
          fullText += chunk;
          setState((s) => ({ ...s, text: s.text + chunk }));
        }
      }
      setState((s) => ({ ...s, loading: false }));
      if (facts && fullText.trim()) {
        // 测算完成，自动存入本机记录
        saveRecord(facts as unknown as ReadingFacts, fullText);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "网络异常，请重试",
      }));
    }
  }, []);

  return { ...state, start };
}
