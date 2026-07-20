import type { BaziChart } from "@/lib/divine/bazi";

/** 八字排盘结果：四柱大字 + 五行分布 + 大运 */
export default function BaziChartView({ chart }: { chart: BaziChart }) {
  const pillars = [
    { label: "年柱", value: chart.pillars.year },
    { label: "月柱", value: chart.pillars.month },
    { label: "日柱", value: chart.pillars.day },
    { label: "时柱", value: chart.pillars.time },
  ];
  return (
    <section className="reveal mt-10">
      <div className="flex items-start justify-between gap-2 border border-(--color-line) px-6 py-8 md:px-10">
        {pillars.map((p) => (
          <div key={p.label} className="flex flex-col items-center gap-3">
            <span className="text-xs tracking-[0.3em] text-paper-dim">{p.label}</span>
            <span className="font-kai flex flex-col text-4xl leading-snug text-paper md:text-5xl">
              <span>{p.value[0]}</span>
              <span>{p.value[1]}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-paper-dim">
        <span>
          日主 <em className="font-kai not-italic text-gold">{chart.dayMaster}</em>
        </span>
        <span>
          五行{" "}
          <em className="not-italic text-paper">
            {Object.entries(chart.wuxingCount)
              .map(([k, v]) => `${k}×${v}`)
              .join("　")}
          </em>
        </span>
        <span>
          {chart.shengxiao}年 · {chart.xingzuo}
        </span>
      </div>
      {chart.dayun.length > 0 && (
        <div className="mt-6">
          <span className="field-label">大运</span>
          <div className="flex flex-wrap gap-2">
            {chart.dayun.map((d) => (
              <span
                key={d.ganZhi + d.startAge}
                className="border border-(--color-line) px-3 py-1.5 text-sm text-paper-dim"
              >
                <span className="font-kai text-paper">{d.ganZhi}</span>　{d.startAge}岁
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
