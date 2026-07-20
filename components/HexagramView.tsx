import type { CastResult } from "@/lib/divine/iching";

/** 卦象：六爻爻线（阳实阴虚，动爻标朱砂点）+ 本卦变卦名 */
export default function HexagramView({ cast }: { cast: CastResult }) {
  // 爻自上而下渲染，数组反转
  const yaos = [...cast.yaos].reverse();
  return (
    <section className="reveal mt-10 flex flex-wrap items-end gap-10">
      <div>
        <span className="field-label">{cast.methodLabel}</span>
        <div className="flex flex-col gap-2.5 border border-(--color-line) px-8 py-6">
          {yaos.map((y, i) => {
            const pos = 6 - i; // 爻位 1–6
            const moving = cast.movingLines.includes(pos);
            return (
              <div key={pos} className="flex w-44 items-center justify-between gap-3">
                {y.yang ? (
                  <div className="h-3 flex-1 bg-paper" />
                ) : (
                  <>
                    <div className="h-3 flex-1 bg-paper" />
                    <div className="w-6" />
                    <div className="h-3 flex-1 bg-paper" />
                  </>
                )}
                <span className="w-3 text-center text-xs text-cinnabar">{moving ? "●" : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pb-1">
        <div className="flex items-baseline gap-3">
          <span className="text-xs tracking-[0.3em] text-paper-dim">本卦</span>
          <span className="font-kai text-3xl text-paper">{cast.benGua.name}</span>
        </div>
        {cast.bianGua && (
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-xs tracking-[0.3em] text-paper-dim">变卦</span>
            <span className="font-kai text-2xl text-gold">{cast.bianGua.name}</span>
          </div>
        )}
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-dim">
          {cast.benGua.guaCi}
        </p>
      </div>
    </section>
  );
}
