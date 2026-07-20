"use client";

import { useRef } from "react";
import ModuleShell from "@/components/ModuleShell";
import MatchForm from "@/components/MatchForm";
import MatchCharts from "@/components/MatchCharts";
import ReadingOutput from "@/components/ReadingOutput";
import ExportBar from "@/components/ExportBar";
import SavedNote from "@/components/SavedNote";
import { useReading } from "@/components/useReading";
import { factsSummary, type MatchFacts } from "@/lib/divine/facts";

export default function MatchPage() {
  const { facts, text, loading, error, started, start } = useReading<MatchFacts>();
  const exportRef = useRef<HTMLDivElement>(null);

  const summary = facts ? factsSummary(facts) : "";

  return (
    <ModuleShell
      numeral="伍"
      title="姻缘匹配"
      subtitle="八字合婚"
      intro="缘分天定，事在人为。以两人出生时间各排一命盘，观五行互补、生肖配对与性格磨合，看这段缘分几分天成、几分经营。"
    >
      <MatchForm loading={loading} onSubmit={(p) => start("match", p)} />
      {error && (
        <p className="mt-8 border border-cinnabar/40 px-4 py-3 text-sm text-cinnabar">{error}</p>
      )}
      {started && (
        <div className="mt-10">
          <ExportBar
            targetRef={exportRef}
            summary={summary}
            text={text}
            name="知命-姻缘匹配"
            disabled={loading}
          />
          <div ref={exportRef} className="mt-6">
            {facts && <MatchCharts chartA={facts.chartA} chartB={facts.chartB} />}
            <section className="mt-12">
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
