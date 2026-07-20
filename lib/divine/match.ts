import type { MatchPayload } from "./types";
import type { PreparedReading } from "./common";
import { computeChart, type BaziChart } from "./bazi";

function personBlock(label: string, chart: BaziChart): string {
  const wx = Object.entries(chart.wuxingCount)
    .map(([k, v]) => `${k}×${v}`)
    .join("、");
  return `【${label}】${chart.name ? `姓名：${chart.name}｜` : ""}性别：${chart.gender === "male" ? "男" : "女"}
公历：${chart.solarText}
四柱：年柱 ${chart.pillars.year}｜月柱 ${chart.pillars.month}｜日柱 ${chart.pillars.day}｜时柱 ${chart.pillars.time}
日主：${chart.dayMaster}
五行分布：${wx}
生肖：${chart.shengxiao}｜星座：${chart.xingzuo}`;
}

export function buildPrompt(chartA: BaziChart, chartB: BaziChart): string {
  return `以下是两位求测者的生辰八字命盘，请以传统八字合婚之法分析二人姻缘匹配：

${personBlock("甲方", chartA)}

${personBlock("乙方", chartB)}

请分节解读：
一、双方命盘概览（各自的日主强弱与性格底色）
二、五行互补（双方五行是否相生相补、有无严重偏枯相克）
三、生肖与日支配对（生肖六合六冲三合、夫妻宫日支的关系）
四、十神互动与性格磨合（相处的甜处与摩擦点）
五、相处建议（给二人最实在的三点忠告）
六、综合姻缘指数（0–100 分，并附一句四字判语）`;
}

export function prepare(payload: MatchPayload): PreparedReading {
  const chartA = computeChart(payload.a);
  const chartB = computeChart(payload.b);
  return { facts: { kind: "match", chartA, chartB }, prompt: buildPrompt(chartA, chartB) };
}
