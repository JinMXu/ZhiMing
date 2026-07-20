import { describe, expect, it } from "vitest";
import { buildPrompt, prepare } from "@/lib/divine/match";
import { factsSummary, type MatchFacts } from "@/lib/divine/facts";

const personA = { name: "张三", gender: "male" as const, year: 1990, month: 5, day: 15, hour: 14, minute: 30 };
const personB = { name: "李四", gender: "female" as const, year: 1992, month: 8, day: 20, hour: 9, minute: 0 };

describe("姻缘匹配", () => {
  it("prepare 排出两张命盘", () => {
    const { facts } = prepare({ a: personA, b: personB });
    const f = facts as MatchFacts;
    expect(f.kind).toBe("match");
    expect(f.chartA.pillars.year).toBe("庚午");
    expect(f.chartA.name).toBe("张三");
    expect(f.chartB.name).toBe("李四");
    expect(f.chartB.pillars.day).toHaveLength(2);
  });

  it("prompt 注入双人排盘事实与合婚要求", () => {
    const { facts, prompt } = prepare({ a: personA, b: personB });
    const f = facts as MatchFacts;
    expect(prompt).toContain("张三");
    expect(prompt).toContain("李四");
    expect(prompt).toContain(f.chartA.pillars.day);
    expect(prompt).toContain(f.chartB.pillars.day);
    expect(prompt).toContain("合婚");
    expect(prompt).toContain("姻缘指数");
  });

  it("任一方日期无效则抛错", () => {
    expect(() => prepare({ a: personA, b: { ...personB, month: 2, day: 30 } })).toThrow(
      "日期不存在",
    );
  });

  it("factsSummary 涵盖双方日主", () => {
    const { facts } = prepare({ a: personA, b: personB });
    const summary = factsSummary(facts as MatchFacts);
    expect(summary).toContain("姻缘匹配");
    expect(summary).toContain("张三");
    expect(summary).toContain("李四");
    expect(summary).toContain("×");
  });

  it("buildPrompt 不泄露姓名时仍有占位", () => {
    const { facts } = prepare({
      a: { ...personA, name: undefined },
      b: { ...personB, name: undefined },
    });
    const f = facts as MatchFacts;
    const prompt = buildPrompt(f.chartA, f.chartB);
    expect(prompt).toContain("【甲方】");
    expect(prompt).toContain("【乙方】");
  });
});
