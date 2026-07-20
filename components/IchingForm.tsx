"use client";

import { useState } from "react";
import type { IchingPayload } from "@/lib/divine/types";

export default function IchingForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (payload: IchingPayload) => void;
}) {
  const [question, setQuestion] = useState("");
  const [method, setMethod] = useState<"auto" | "numbers">("auto");
  const [numbers, setNumbers] = useState(["", "", ""]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      setError("请先写下你想问的事");
      return;
    }
    if (method === "numbers") {
      const nums = numbers.map((n) => Number(n));
      if (nums.some((n) => !Number.isInteger(n) || n <= 0)) {
        setError("请填写三个正整数（随口报出的数最灵验）");
        return;
      }
      setError(null);
      onSubmit({
        question: question.trim(),
        method: "numbers",
        numbers: nums as [number, number, number],
      });
      return;
    }
    setError(null);
    onSubmit({ question: question.trim(), method: "auto" });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <div>
        <label className="field-label" htmlFor="iching-question">所问之事</label>
        <textarea
          id="iching-question"
          className="field-input resize-none"
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="一事一占，心诚则灵，如：这次合作能否达成？"
          maxLength={200}
        />
      </div>
      <div>
        <span className="field-label">起卦方式</span>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="choice"
            data-active={method === "auto"}
            onClick={() => setMethod("auto")}
          >
            自动摇卦 · 六爻
          </button>
          <button
            type="button"
            className="choice"
            data-active={method === "numbers"}
            onClick={() => setMethod("numbers")}
          >
            报数起卦 · 梅花易数
          </button>
        </div>
      </div>
      {method === "numbers" && (
        <div className="grid grid-cols-3 gap-6">
          {numbers.map((n, i) => (
            <div key={i}>
              <label className="field-label" htmlFor={`iching-num-${i}`}>
                {["上卦之数", "下卦之数", "动爻之数"][i]}
              </label>
              <input
                id={`iching-num-${i}`}
                className="field-input"
                inputMode="numeric"
                value={n}
                onChange={(e) =>
                  setNumbers(numbers.map((v, j) => (j === i ? e.target.value : v)))
                }
                placeholder={`第${["一", "二", "三"][i]}个数`}
              />
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-cinnabar">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "起卦中…" : "虔诚起卦"}
      </button>
    </form>
  );
}
