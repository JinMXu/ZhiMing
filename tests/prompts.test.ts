import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "@/lib/divine/common";
import { prepare as baziPrepare } from "@/lib/divine/bazi";
import { prepare as tarotPrepare } from "@/lib/divine/tarot";
import { prepare as ichingPrepare } from "@/lib/divine/iching";
import { prepare as fortunePrepare } from "@/lib/divine/fortune";

describe("系统 prompt", () => {
  it("包含角色设定与仅供娱乐声明", () => {
    expect(SYSTEM_PROMPT).toContain("命理");
    expect(SYSTEM_PROMPT).toContain("仅供娱乐");
  });
});

describe("各模块 prompt 注入关键事实", () => {
  it("八字：四柱入 prompt", () => {
    const { prompt } = baziPrepare({
      gender: "male",
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
    });
    expect(prompt).toContain("年柱 庚午");
    expect(prompt).toContain("时柱 癸未");
  });

  it("塔罗：问题与牌阵入 prompt", () => {
    const { prompt, facts } = tarotPrepare({ question: "感情走向？", spread: "single" });
    expect(prompt).toContain("感情走向？");
    expect(prompt).toContain("单张指引");
    expect((facts as { cards: unknown[] }).cards).toHaveLength(1);
  });

  it("周易：起卦方式入 prompt", () => {
    const { prompt } = ichingPrepare({ question: "出行顺利否？", method: "auto" });
    expect(prompt).toContain("出行顺利否？");
    expect(prompt).toContain("六爻摇卦");
  });

  it("运势：星座、日期与星级要求入 prompt", () => {
    const { prompt, facts } = fortunePrepare({ kind: "zodiac", sign: "白羊座" });
    expect(prompt).toContain("白羊座");
    expect(prompt).toContain("★");
    expect(prompt).toMatch(/今日/);
    expect((facts as { sign: string }).sign).toBe("白羊座");
  });
});
