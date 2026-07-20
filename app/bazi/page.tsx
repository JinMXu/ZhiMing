"use client";

import { useRef } from "react";
import ModuleShell from "@/components/ModuleShell";
import BaziForm from "@/components/BaziForm";
import BaziChartView from "@/components/BaziChartView";
import ReadingOutput from "@/components/ReadingOutput";
import ExportBar from "@/components/ExportBar";
import SavedNote from "@/components/SavedNote";
import { useReading } from "@/components/useReading";
import { factsSummary, type BaziFacts } from "@/lib/divine/facts";

export default function BaziPage() {
  const { facts, text, loading, error, started, start } = useReading<BaziFacts>();
  const exportRef = useRef<HTMLDivElement>(null);

  const summary = facts ? factsSummary(facts) : "";

  return (
    <ModuleShell
      numeral="壹"
      title="生辰八字"
      subtitle="四柱推命"
      intro="以出生年月日时换算干支，排年、月、日、时四柱。命盘由程序精确推算，解读交由 AI 命理师娓娓道来。"
    >
      <BaziForm loading={loading} onSubmit={(p) => start("bazi", p)} />
      {error && (
        <p className="mt-8 border border-cinnabar/40 px-4 py-3 text-sm text-cinnabar">{error}</p>
      )}
      {started && (
        <div className="mt-10">
          <ExportBar
            targetRef={exportRef}
            summary={summary}
            text={text}
            name="知命-生辰八字"
            disabled={loading}
          />
          <div ref={exportRef} className="mt-6">
            {facts?.chart && <BaziChartView chart={facts.chart} />}
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
