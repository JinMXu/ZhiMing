import { describe, expect, it } from "vitest";
import { HEXAGRAMS } from "@/data/hexagrams";
import { castByCoins, castByNumbers, prepare } from "@/lib/divine/iching";

describe("六十四卦数据", () => {
  it("恰好 64 卦且上下经卦齐全", () => {
    expect(HEXAGRAMS).toHaveLength(64);
    const trigrams = new Set(["乾", "坤", "震", "巽", "坎", "离", "艮", "兑"]);
    for (const h of HEXAGRAMS) {
      expect(trigrams.has(h.upperTrigram)).toBe(true);
      expect(trigrams.has(h.lowerTrigram)).toBe(true);
      expect(h.yaoCi.length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe("梅花易数·数字起卦", () => {
  it("1、1、1 → 乾为天，初爻动，变天风姤", () => {
    const cast = castByNumbers([1, 1, 1]);
    expect(cast.benGua.name).toBe("乾为天");
    expect(cast.movingLines).toEqual([1]);
    expect(cast.bianGua?.name).toBe("天风姤");
    expect(cast.huGua.name).toBe("乾为天");
  });

  it("8、8、6 → 坤为地，上爻动，变山地剥", () => {
    const cast = castByNumbers([8, 8, 6]);
    expect(cast.benGua.name).toBe("坤为地");
    expect(cast.movingLines).toEqual([6]);
    expect(cast.bianGua?.name).toBe("山地剥");
  });

  it("数字取余：9 等同 1（乾）", () => {
    expect(castByNumbers([9, 1, 2]).benGua.name).toBe("乾为天");
  });
});

describe("六爻摇卦", () => {
  it("rng 恒大 → 六爻皆老阳：乾之坤", () => {
    const cast = castByCoins(() => 0.9);
    expect(cast.benGua.name).toBe("乾为天");
    expect(cast.movingLines).toHaveLength(6);
    expect(cast.bianGua?.name).toBe("坤为地");
  });

  it("rng 恒小 → 六爻皆老阴：坤之乾", () => {
    const cast = castByCoins(() => 0);
    expect(cast.benGua.name).toBe("坤为地");
    expect(cast.movingLines).toHaveLength(6);
    expect(cast.bianGua?.name).toBe("乾为天");
  });

  it("爻值域合法", () => {
    for (let i = 0; i < 20; i++) {
      const cast = castByCoins();
      for (const y of cast.yaos) {
        expect([6, 7, 8, 9]).toContain(y.value);
        expect(y.yang).toBe(y.value % 2 === 1);
        expect(y.moving).toBe(y.value === 6 || y.value === 9);
      }
    }
  });
});

describe("解卦 prompt", () => {
  it("包含问题、卦名、卦辞与动爻爻辞", () => {
    const { prompt } = prepare({ question: "合作能否达成？", method: "numbers", numbers: [3, 5, 2] });
    const cast = castByNumbers([3, 5, 2]);
    expect(prompt).toContain("合作能否达成？");
    expect(prompt).toContain(cast.benGua.name);
    expect(prompt).toContain(cast.benGua.guaCi);
    expect(prompt).toContain(cast.benGua.yaoCi[cast.movingLines[0] - 1]);
  });
});
