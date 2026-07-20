"use client";

import { useRef } from "react";
import ModuleShell from "@/components/ModuleShell";
import IchingForm from "@/components/IchingForm";
import HexagramView from "@/components/HexagramView";
import ReadingOutput from "@/components/ReadingOutput";
import ExportBar from "@/components/ExportBar";
import SavedNote from "@/components/SavedNote";
import { useReading } from "@/components/useReading";
import { factsSummary, type IchingFacts } from "@/lib/divine/facts";

export default function IchingPage() {
  const { facts, text, loading, error, started, start } = useReading<IchingFacts>();
  const exportRef = useRef<HTMLDivElement>(null);

  const summary = facts ? factsSummary(facts) : "";

  return (
    <ModuleShell
      numeral="叁"
      title="周易起卦"
      subtitle="六爻梅花"
      intro="一事一占。摇卦或报数成六爻，得本卦、动爻与变卦，引《周易》卦爻辞断事之进退。"
    >
      <IchingForm loading={loading} onSubmit={(p) => start("iching", p)} />
      {error && (
        <p className="mt-8 border border-cinnabar/40 px-4 py-3 text-sm text-cinnabar">{error}</p>
      )}
      {started && (
        <div className="mt-10">
          <ExportBar
            targetRef={exportRef}
            summary={summary}
            text={text}
            name="知命-周易起卦"
            disabled={loading}
          />
          <div ref={exportRef} className="mt-6">
            {facts?.cast && <HexagramView cast={facts.cast} />}
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
