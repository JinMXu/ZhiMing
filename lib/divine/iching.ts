import { randomInt } from "node:crypto";
import { HEXAGRAMS, type Hexagram } from "@/data/hexagrams";
import type { IchingPayload } from "./types";
import type { PreparedReading } from "./common";

// 先天八卦数序：乾1 兑2 离3 震4 巽5 坎6 艮7 坤8；lines 自下而上，1 阳 0 阴
const TRIGRAMS = [
  { name: "乾", lines: [1, 1, 1] },
  { name: "兑", lines: [1, 1, 0] },
  { name: "离", lines: [1, 0, 1] },
  { name: "震", lines: [1, 0, 0] },
  { name: "巽", lines: [0, 1, 1] },
  { name: "坎", lines: [0, 1, 0] },
  { name: "艮", lines: [0, 0, 1] },
  { name: "坤", lines: [0, 0, 0] },
] as const;

const hexMap = new Map(HEXAGRAMS.map((h) => [`${h.upperTrigram}|${h.lowerTrigram}`, h]));

function trigramName(lines: number[]): string {
  const t = TRIGRAMS.find(
    (t) => t.lines[0] === lines[0] && t.lines[1] === lines[1] && t.lines[2] === lines[2],
  );
  if (!t) throw new Error("非法的三爻组合");
  return t.name;
}

export function hexagramByLines(lines6: number[]): Hexagram {
  const lower = trigramName(lines6.slice(0, 3));
  const upper = trigramName(lines6.slice(3, 6));
  const hex = hexMap.get(`${upper}|${lower}`);
  if (!hex) throw new Error(`卦象数据缺失：上${upper}下${lower}`);
  return hex;
}

export interface Yao {
  value: 6 | 7 | 8 | 9; // 老阴6、少阳7、少阴8、老阳9
  yang: boolean;
  moving: boolean;
}

const YAO_NAMES: Record<number, string> = {
  6: "老阴",
  7: "少阳",
  8: "少阴",
  9: "老阳",
};

export interface CastResult {
  methodLabel: string;
  yaos: Yao[]; // 自下而上：初爻在 index 0
  movingLines: number[]; // 动爻爻位 1–6
  benGua: Hexagram;
  bianGua: Hexagram | null;
  huGua: Hexagram;
}

function buildResult(yaos: Yao[], methodLabel: string): CastResult {
  const lines = yaos.map((y) => (y.yang ? 1 : 0));
  const movingLines = yaos.map((y, i) => (y.moving ? i + 1 : 0)).filter((n) => n > 0);
  const benGua = hexagramByLines(lines);
  const bianGua =
    movingLines.length > 0
      ? hexagramByLines(lines.map((l, i) => (yaos[i].moving ? 1 - l : l)))
      : null;
  // 互卦：下互取二三四爻，上互取三四五爻
  const huGua = hexagramByLines([lines[1], lines[2], lines[3], lines[2], lines[3], lines[4]]);
  return { methodLabel, yaos, movingLines, benGua, bianGua, huGua };
}

function cryptoRng(): number {
  return randomInt(0, 1_000_000) / 1_000_000;
}

/** 六爻摇卦：三枚铜钱抛六次，字面记 3、背面记 2，和为 6/7/8/9 */
export function castByCoins(rng: () => number = cryptoRng): CastResult {
  const yaos: Yao[] = [];
  for (let i = 0; i < 6; i++) {
    let value = 0;
    for (let c = 0; c < 3; c++) value += rng() < 0.5 ? 2 : 3;
    const v = value as 6 | 7 | 8 | 9;
    yaos.push({ value: v, yang: v % 2 === 1, moving: v === 6 || v === 9 });
  }
  return buildResult(yaos, "六爻摇卦（自动）");
}

/** 梅花易数·数字起卦：一数求上卦、二数求下卦、三数求动爻，皆按先天数取余 */
export function castByNumbers(numbers: [number, number, number]): CastResult {
  const [a, b, c] = numbers;
  const upper = TRIGRAMS[(a % 8 === 0 ? 8 : a % 8) - 1];
  const lower = TRIGRAMS[(b % 8 === 0 ? 8 : b % 8) - 1];
  const moving = c % 6 === 0 ? 6 : c % 6;
  const lines6 = [...lower.lines, ...upper.lines];
  const yaos: Yao[] = lines6.map((l, i) => {
    const isMoving = i + 1 === moving;
    const value = (l === 1 ? (isMoving ? 9 : 7) : isMoving ? 6 : 8) as 6 | 7 | 8 | 9;
    return { value, yang: l === 1, moving: isMoving };
  });
  return buildResult(yaos, `梅花易数·数字起卦（${a}、${b}、${c}）`);
}

export function buildPrompt(question: string, cast: CastResult): string {
  const positions = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
  const yaoLines = cast.yaos
    .map(
      (y, i) =>
        `${positions[i]}：${y.yang ? "阳爻" : "阴爻"}（${YAO_NAMES[y.value]}）${y.moving ? "【动】" : ""}`,
    )
    .join("\n");
  const movingCi = cast.movingLines
    .map((n) => `${positions[n - 1]}：${cast.benGua.yaoCi[n - 1]}`)
    .join("\n");
  return `【所问之事】${question}
【起卦方式】${cast.methodLabel}
【六爻（自下而上）】
${yaoLines}
【本卦】${cast.benGua.name}（上${cast.benGua.upperTrigram}下${cast.benGua.lowerTrigram}）
卦辞：${cast.benGua.guaCi}
【动爻】${cast.movingLines.length > 0 ? `第 ${cast.movingLines.join("、")} 爻\n爻辞：\n${movingCi}` : "无动爻，以卦辞为断"}
${cast.bianGua ? `【变卦】${cast.bianGua.name}（上${cast.bianGua.upperTrigram}下${cast.bianGua.lowerTrigram}）\n卦辞：${cast.bianGua.guaCi}\n` : ""}【互卦】${cast.huGua.name}

请结合所问之事解卦：
一、卦象总览（本卦寓意与此事的对应）
二、现状分析（结合卦辞）
三、动爻关键提示（引爻辞原文，说明变化之机；无动爻则以卦辞为断）
四、变卦所示的趋势走向
五、给问卜者的行动建议`;
}

export function prepare(payload: IchingPayload): PreparedReading {
  const cast = payload.method === "numbers" ? castByNumbers(payload.numbers) : castByCoins();
  return { facts: { kind: "iching", question: payload.question, cast }, prompt: buildPrompt(payload.question, cast) };
}
