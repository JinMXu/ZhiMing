import { randomInt } from "node:crypto";
import { TAROT_DECK, type TarotCard } from "@/data/tarot";
import type { TarotPayload } from "./types";
import type { PreparedReading } from "./common";

export const SPREADS: Record<TarotPayload["spread"], { label: string; positions: string[] }> = {
  single: { label: "单张指引", positions: ["今日指引"] },
  three: { label: "三张牌阵", positions: ["过去", "现在", "未来"] },
};

export interface DrawnCard {
  position: string;
  name: string;
  nameEn: string;
  arcana: TarotCard["arcana"];
  reversed: boolean;
  keywords: string[];
}

function cryptoRng(): number {
  return randomInt(0, 1_000_000) / 1_000_000;
}

/** 从 78 张牌中无重复抽 count 张，每张随机正逆位。rng 可注入以便测试 */
export function drawCards(
  count: number,
  rng: () => number = cryptoRng,
): { card: TarotCard; reversed: boolean }[] {
  const pool = [...TAROT_DECK];
  const drawn: { card: TarotCard; reversed: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * pool.length);
    const [card] = pool.splice(idx, 1);
    drawn.push({ card, reversed: rng() < 0.5 });
  }
  return drawn;
}

export function buildPrompt(question: string, spreadLabel: string, cards: DrawnCard[]): string {
  const cardLines = cards
    .map(
      (c, i) =>
        `${i + 1}. 位置「${c.position}」：${c.name}（${c.nameEn}）${c.reversed ? "逆位" : "正位"} —— 关键词：${c.keywords.join("、")}`,
    )
    .join("\n");
  return `【问卜者的问题】${question}
【牌阵】${spreadLabel}
【抽到的牌】
${cardLines}

请结合问题逐张解读每个位置的牌意（结合正逆位与关键词），再给出整体指引：
一、逐位解读
二、综合指引
三、给问卜者的建议`;
}

export function prepare(payload: TarotPayload): PreparedReading {
  const spread = SPREADS[payload.spread];
  const cards: DrawnCard[] = drawCards(spread.positions.length).map((d, i) => ({
    position: spread.positions[i],
    name: d.card.name,
    nameEn: d.card.nameEn,
    arcana: d.card.arcana,
    reversed: d.reversed,
    keywords: d.reversed ? d.card.reversed : d.card.upright,
  }));
  return {
    facts: { kind: "tarot", spread: spread.label, question: payload.question, cards },
    prompt: buildPrompt(payload.question, spread.label, cards),
  };
}
