import BaziChartView from "@/components/BaziChartView";
import type { BaziChart } from "@/lib/divine/bazi";

/** 姻缘匹配结果：两人命盘并排（移动端上下排） */
export default function MatchCharts({
  chartA,
  chartB,
}: {
  chartA: BaziChart;
  chartB: BaziChart;
}) {
  const people = [
    { label: "你", chart: chartA },
    { label: "TA", chart: chartB },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {people.map((p) => (
        <div key={p.label}>
          <span className="seal inline-block px-2.5 py-1 text-sm">
            {p.chart.name ?? p.label}
          </span>
          <BaziChartView chart={p.chart} />
        </div>
      ))}
    </div>
  );
}
