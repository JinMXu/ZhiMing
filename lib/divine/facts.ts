import type { BaziChart } from "./bazi";
import type { DrawnCard } from "./tarot";
import type { CastResult } from "./iching";

/** 各模块 facts（随流首行下发、存入本地记录、驱动结果可视化）的统一类型 */
export interface BaziFacts {
  kind: "bazi";
  chart: BaziChart;
}
export interface TarotFacts {
  kind: "tarot";
  spread: string;
  question: string;
  cards: DrawnCard[];
}
export interface IchingFacts {
  kind: "iching";
  question: string;
  cast: CastResult;
}
export interface FortuneFacts {
  kind: "fortune";
  label: string;
  sign: string;
  date: string;
}
export interface MatchFacts {
  kind: "match";
  chartA: BaziChart;
  chartB: BaziChart;
}
export type ReadingFacts = BaziFacts | TarotFacts | IchingFacts | FortuneFacts | MatchFacts;

export const MODULE_NAMES: Record<ReadingFacts["kind"], string> = {
  bazi: "生辰八字",
  tarot: "塔罗牌",
  iching: "周易起卦",
  fortune: "每日运势",
  match: "姻缘匹配",
};

/** 一行摘要：导出文本开头、记录列表标题共用 */
export function factsSummary(facts: ReadingFacts): string {
  switch (facts.kind) {
    case "bazi": {
      const c = facts.chart;
      return `生辰八字 · ${c.solarText} · 四柱 ${c.pillars.year} ${c.pillars.month} ${c.pillars.day} ${c.pillars.time}（日主 ${c.dayMaster}）`;
    }
    case "tarot":
      return `塔罗牌 · ${facts.spread} · 所问「${facts.question}」\n${facts.cards
        .map((c) => `${c.position}：${c.name} ${c.reversed ? "逆位" : "正位"}`)
        .join("　")}`;
    case "iching":
      return `周易起卦 · ${facts.cast.methodLabel} · 本卦 ${facts.cast.benGua.name}${
        facts.cast.bianGua ? ` → 变卦 ${facts.cast.bianGua.name}` : ""
      } · 所问「${facts.question}」`;
    case "fortune":
      return `每日运势 · ${facts.date} · ${facts.sign}（${facts.label}）`;
    case "match":
      return `姻缘匹配 · ${facts.chartA.name ?? "甲方"}（${facts.chartA.dayMaster}）× ${facts.chartB.name ?? "乙方"}（${facts.chartB.dayMaster}）`;
  }
}
