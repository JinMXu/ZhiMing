"use client";

import { useRef } from "react";
import ModuleShell from "@/components/ModuleShell";
import TarotForm from "@/components/TarotForm";
import TarotCardsView from "@/components/TarotCardsView";
import ReadingOutput from "@/components/ReadingOutput";
import ExportBar from "@/components/ExportBar";
import SavedNote from "@/components/SavedNote";
import { useReading } from "@/components/useReading";
import { factsSummary, type TarotFacts } from "@/lib/divine/facts";

export default function TarotPage() {
  const { facts, text, loading, error, started, start } = useReading<TarotFacts>();
  const exportRef = useRef<HTMLDivElement>(null);

  const summary = facts ? factsSummary(facts) : "";

  return (
    <ModuleShell
      numeral="贰"
      title="塔罗牌"
      subtitle="韦特占卜"
      intro="洗牌、切牌、抽牌——牌面由随机之法而定，正逆之间，藏着当下心境的镜子。"
    >
      <TarotForm loading={loading} onSubmit={(p) => start("tarot", p)} />
      {error && (
        <p className="mt-8 border border-cinnabar/40 px-4 py-3 text-sm text-cinnabar">{error}</p>
      )}
      {started && (
        <div className="mt-10">
          <ExportBar
            targetRef={exportRef}
            summary={summary}
            text={text}
            name="知命-塔罗牌"
            disabled={loading}
          />
          <div ref={exportRef} className="mt-6">
            {facts && <TarotCardsView spread={facts.spread} cards={facts.cards} />}
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
