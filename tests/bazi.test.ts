import { describe, expect, it } from "vitest";
import { buildPrompt, computeChart } from "@/lib/divine/bazi";

describe("八字排盘", () => {
  it("已知出生时间的四柱与 lunar-javascript 一致", () => {
    const chart = computeChart({
      gender: "male",
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
    });
    expect(chart.pillars).toEqual({
      year: "庚午",
      month: "辛巳",
      day: "庚辰",
      time: "癸未",
    });
    expect(chart.dayMaster).toContain("金");
    expect(chart.dayMaster).toContain("庚");
    const total = Object.values(chart.wuxingCount).reduce((a, b) => a + b, 0);
    expect(total).toBe(8);
    expect(chart.shengxiao).toBe("马");
    expect(chart.xingzuo).toBe("金牛座");
    expect(chart.dayun.length).toBeGreaterThan(0);
    expect(chart.dayun[0].startAge).toBeGreaterThanOrEqual(1);
  });

  it("不存在的日期抛中文错误", () => {
    expect(() =>
      computeChart({ gender: "male", year: 2021, month: 2, day: 31, hour: 0, minute: 0 }),
    ).toThrow("日期不存在");
  });

  it("prompt 注入排盘事实", () => {
    const chart = computeChart({
      name: "张三",
      gender: "female",
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
    });
    const prompt = buildPrompt(chart);
    expect(prompt).toContain("庚午");
    expect(prompt).toContain("癸未");
    expect(prompt).toContain("张三");
    expect(prompt).toContain("大运");
  });
});
