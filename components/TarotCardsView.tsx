import type { DrawnCard } from "@/lib/divine/tarot";

/** 抽牌结果：牌面卡片（逆位牌名倒转） */
export default function TarotCardsView({
  spread,
  cards,
}: {
  spread: string;
  cards: DrawnCard[];
}) {
  return (
    <section className="reveal mt-10">
      <span className="field-label">{spread}</span>
      <div className="flex flex-wrap gap-6">
        {cards.map((c) => (
          <div key={c.position} className="flex flex-col items-center gap-3">
            <span className="text-xs tracking-[0.3em] text-paper-dim">{c.position}</span>
            <div className="flex h-48 w-28 flex-col items-center justify-between border border-(--color-line) bg-ink-2 px-2 py-4">
              <span className="text-[10px] tracking-widest text-paper-dim">{c.nameEn}</span>
              <span
                className={`v-text font-kai text-2xl text-paper ${c.reversed ? "rotate-180" : ""}`}
              >
                {c.name}
              </span>
              <span
                className={`seal px-2 py-0.5 text-xs ${c.reversed ? "" : "opacity-80"}`}
              >
                {c.reversed ? "逆位" : "正位"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
