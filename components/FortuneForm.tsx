"use client";

import { useState } from "react";
import type { FortunePayload } from "@/lib/divine/types";

const ZODIAC_SIGNS = [
  "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座",
  "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座",
];
const SHENGXIAO = [
  "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪",
];

export default function FortuneForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (payload: FortunePayload) => void;
}) {
  const [kind, setKind] = useState<"zodiac" | "shengxiao">("zodiac");
  const [sign, setSign] = useState(ZODIAC_SIGNS[0]);

  function switchKind(k: "zodiac" | "shengxiao") {
    setKind(k);
    setSign(k === "zodiac" ? ZODIAC_SIGNS[0] : SHENGXIAO[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ kind, sign } as FortunePayload);
  }

  const options = kind === "zodiac" ? ZODIAC_SIGNS : SHENGXIAO;

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <div>
        <span className="field-label">运势类型</span>
        <div className="flex gap-3">
          <button
            type="button"
            className="choice"
            data-active={kind === "zodiac"}
            onClick={() => switchKind("zodiac")}
          >
            星座运势
          </button>
          <button
            type="button"
            className="choice"
            data-active={kind === "shengxiao"}
            onClick={() => switchKind("shengxiao")}
          >
            生肖运势
          </button>
        </div>
      </div>
      <div className="max-w-xs">
        <label className="field-label" htmlFor="fortune-sign">
          {kind === "zodiac" ? "你的星座" : "你的生肖"}
        </label>
        <select
          id="fortune-sign"
          className="field-input"
          value={sign}
          onChange={(e) => setSign(e.target.value)}
        >
          {options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "观星中…" : "查看今日运势"}
      </button>
    </form>
  );
}
