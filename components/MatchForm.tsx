"use client";

import { useState } from "react";
import BaziFields, {
  EMPTY_BAZI_FIELDS,
  fieldsToPayload,
  type BaziFieldValue,
} from "@/components/BaziFields";
import type { MatchPayload } from "@/lib/divine/types";

export default function MatchForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (payload: MatchPayload) => void;
}) {
  const [a, setA] = useState<BaziFieldValue>(EMPTY_BAZI_FIELDS);
  const [b, setB] = useState<BaziFieldValue>({ ...EMPTY_BAZI_FIELDS, gender: "female" });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pa = fieldsToPayload(a);
    const pb = fieldsToPayload(b);
    if (!pa || !pb) {
      setError("请把两人的出生日期都选上");
      return;
    }
    setError(null);
    onSubmit({ a: pa, b: pb });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-12">
      <section>
        <h2 className="font-kai mb-6 text-xl text-gold">你的信息</h2>
        <BaziFields idPrefix="match-a" value={a} onChange={setA} />
      </section>
      <section>
        <h2 className="font-kai mb-6 text-xl text-gold">TA 的信息</h2>
        <BaziFields idPrefix="match-b" value={b} onChange={setB} />
      </section>
      {error && <p className="text-sm text-cinnabar">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "合盘中…" : "合盘配对"}
      </button>
    </form>
  );
}
