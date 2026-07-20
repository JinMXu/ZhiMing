"use client";

import type { BaziPayload } from "@/lib/divine/types";

export interface BaziFieldValue {
  name: string;
  gender: "male" | "female";
  date: string;
  time: string;
}

export const EMPTY_BAZI_FIELDS: BaziFieldValue = {
  name: "",
  gender: "male",
  date: "",
  time: "12:00",
};

/** 把表单值转为 bazi payload；日期缺失返回 null */
export function fieldsToPayload(v: BaziFieldValue): BaziPayload | null {
  const [y, m, d] = v.date.split("-").map(Number);
  const [hh, mm] = v.time.split(":").map(Number);
  if (!y || !m || !d) return null;
  return {
    name: v.name.trim() || undefined,
    gender: v.gender,
    year: y,
    month: m,
    day: d,
    hour: hh,
    minute: mm,
  };
}

/** 姓名/性别/出生日期时间字段组，八字排盘与姻缘匹配共用 */
export default function BaziFields({
  idPrefix,
  value,
  onChange,
}: {
  idPrefix: string;
  value: BaziFieldValue;
  onChange: (v: BaziFieldValue) => void;
}) {
  const set = (patch: Partial<BaziFieldValue>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-name`}>
          姓名（可选）
        </label>
        <input
          id={`${idPrefix}-name`}
          className="field-input"
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="如何称呼"
          maxLength={20}
        />
      </div>
      <div>
        <span className="field-label">性别</span>
        <div className="flex gap-3">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              type="button"
              className="choice"
              data-active={value.gender === g}
              onClick={() => set({ gender: g })}
            >
              {g === "male" ? "男（乾造）" : "女（坤造）"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-date`}>
          出生日期（公历）
        </label>
        <input
          id={`${idPrefix}-date`}
          type="date"
          className="field-input"
          value={value.date}
          onChange={(e) => set({ date: e.target.value })}
          min="1900-01-01"
          max="2100-12-31"
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-time`}>
          出生时间（不确定可填正午）
        </label>
        <input
          id={`${idPrefix}-time`}
          type="time"
          className="field-input"
          value={value.time}
          onChange={(e) => set({ time: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
