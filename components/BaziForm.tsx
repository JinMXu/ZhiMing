"use client";

import { useState } from "react";
import BaziFields, {
  EMPTY_BAZI_FIELDS,
  fieldsToPayload,
  type BaziFieldValue,
} from "@/components/BaziFields";
import type { BaziPayload } from "@/lib/divine/types";

export default function BaziForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (payload: BaziPayload) => void;
}) {
  const [value, setValue] = useState<BaziFieldValue>(EMPTY_BAZI_FIELDS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = fieldsToPayload(value);
    if (!payload) {
      setError("请选择出生日期");
      return;
    }
    setError(null);
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <BaziFields idPrefix="bazi" value={value} onChange={setValue} />
      {error && <p className="text-sm text-cinnabar">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "推演中…" : "排盘解读"}
      </button>
    </form>
  );
}
