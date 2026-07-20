import { describe, expect, it } from "vitest";
import { TAROT_DECK } from "@/data/tarot";
import { buildPrompt, drawCards, prepare } from "@/lib/divine/tarot";

describe("塔罗牌数据", () => {
  it("恰好 78 张且 id 连续", () => {
    expect(TAROT_DECK).toHaveLength(78);
    const ids = TAROT_DECK.map((c) => c.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 78 }, (_, i) => i));
  });
});

describe("抽牌", () => {
  it("数量正确、不重复、正逆位字段存在", () => {
    const drawn = drawCards(3, () => 0.42);
    expect(drawn).toHaveLength(3);
    const ids = drawn.map((d) => d.card.id);
    expect(new Set(ids).size).toBe(3);
    for (const d of drawn) expect(typeof d.reversed).toBe("boolean");
  });

  it("rng 恒为 0 时逐张取牌堆首牌", () => {
    const drawn = drawCards(2, () => 0);
    expect(drawn.map((d) => d.card.id)).toEqual([0, 1]);
    expect(drawn.every((d) => d.reversed)).toBe(true);
  });

  it("prepare 事实与 prompt 完整", () => {
    const { facts, prompt } = prepare({ question: "事业如何？", spread: "three" });
    const f = facts as { spread: string; cards: { position: string; name: string; keywords: string[] }[] };
    expect(f.spread).toBe("三张牌阵");
    expect(f.cards.map((c) => c.position)).toEqual(["过去", "现在", "未来"]);
    expect(prompt).toContain("事业如何？");
    for (const c of f.cards) expect(prompt).toContain(c.name);
  });

  it("buildPrompt 标注正逆位与关键词", () => {
    const prompt = buildPrompt("测试问题", "单张指引", [
      { position: "今日指引", name: "愚者", nameEn: "The Fool", arcana: "major", reversed: true, keywords: ["鲁莽"] },
    ]);
    expect(prompt).toContain("逆位");
    expect(prompt).toContain("鲁莽");
  });
});
