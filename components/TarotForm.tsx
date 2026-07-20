"use client";

import { useState } from "react";
import type { TarotPayload } from "@/lib/divine/types";

export default function TarotForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (payload: TarotPayload) => void;
}) {
  const [question, setQuestion] = useState("");
  const [spread, setSpread] = useState<"single" | "three">("three");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      setError("请先默念并写下你想问的事");
      return;
    }
    setError(null);
    onSubmit({ question: question.trim(), spread });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <div>
        <label className="field-label" htmlFor="tarot-question">所问之事</label>
        <textarea
          id="tarot-question"
          className="field-input resize-none"
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="心中默念的问题，如：近期的事业走向如何？"
          maxLength={200}
        />
      </div>
      <div>
        <span className="field-label">牌阵</span>
        <div className="flex gap-3">
          <button
            type="button"
            className="choice"
            data-active={spread === "three"}
            onClick={() => setSpread("three")}
          >
            三张牌 · 过去现在未来
          </button>
          <button
            type="button"
            className="choice"
            data-active={spread === "single"}
            onClick={() => setSpread("single")}
          >
            单张 · 今日指引
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-cinnabar">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "洗牌中…" : "静心抽牌"}
      </button>
    </form>
  );
}
