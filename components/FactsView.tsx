import BaziChartView from "@/components/BaziChartView";
import TarotCardsView from "@/components/TarotCardsView";
import HexagramView from "@/components/HexagramView";
import MatchCharts from "@/components/MatchCharts";
import type { ReadingFacts } from "@/lib/divine/facts";

/** 按 facts 类型分发到对应的结果可视化（记录页复用） */
export default function FactsView({ facts }: { facts: ReadingFacts }) {
  switch (facts.kind) {
    case "bazi":
      return <BaziChartView chart={facts.chart} />;
    case "tarot":
      return <TarotCardsView spread={facts.spread} cards={facts.cards} />;
    case "iching":
      return <HexagramView cast={facts.cast} />;
    case "match":
      return <MatchCharts chartA={facts.chartA} chartB={facts.chartB} />;
    case "fortune":
      return null;
  }
}
