"use client";

import { useRef } from "react";
import ModuleShell from "@/components/ModuleShell";
import FortuneForm from "@/components/FortuneForm";
import ReadingOutput from "@/components/ReadingOutput";
import ExportBar from "@/components/ExportBar";
import SavedNote from "@/components/SavedNote";
import { useReading } from "@/components/useReading";
import { factsSummary, type FortuneFacts } from "@/lib/divine/facts";

export default function FortunePage() {
  const { facts, text, loading, error, started, start } = useReading<FortuneFacts>();
  const exportRef = useRef<HTMLDivElement>(null);

  const summary = facts ? factsSummary(facts) : "";

  return (
    <ModuleShell
      numeral="肆"
      title="每日运势"
      subtitle="星象生肖"
      intro="今日宜忌，一目了然。星座观星象之移，生肖应太岁之化，权当每日的一面小镜子。"
    >
      <FortuneForm loading={loading} onSubmit={(p) => start("fortune", p)} />
      {error && (
        <p className="mt-8 border border-cinnabar/40 px-4 py-3 text-sm text-cinnabar">{error}</p>
      )}
      {started && (
        <div className="mt-10">
          <ExportBar
            targetRef={exportRef}
            summary={summary}
            text={text}
            name="知命-每日运势"
            disabled={loading}
          />
          <div ref={exportRef} className="mt-6">
            {facts && (
              <p className="text-sm tracking-[0.2em] text-paper-dim">
                {facts.date} · {facts.sign}
                {facts.label === "星座" ? "星座" : "生肖"}运势
              </p>
            )}
            <section className="mt-6">
              <hr className="hairline mb-8" />
              <ReadingOutput text={text} loading={loading} />
              <p className="mt-10 text-xs tracking-[0.25em] text-paper-dim">
                知命 · AI 解读 · 仅供娱乐参考
              </p>
            </section>
          </div>
          {!loading && !error && text && <SavedNote />}
        </div>
      )}
    </ModuleShell>
  );
}
