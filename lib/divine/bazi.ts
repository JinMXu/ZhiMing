import { Solar } from "lunar-javascript";
import type { BaziPayload } from "./types";
import type { PreparedReading } from "./common";

const GAN_WUXING: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};

const GAN_YINYANG: Record<string, string> = {
  甲: "阳", 丙: "阳", 戊: "阳", 庚: "阳", 壬: "阳",
  乙: "阴", 丁: "阴", 己: "阴", 辛: "阴", 癸: "阴",
};

const ZHI_WUXING: Record<string, string> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

/** 星座起始日期表（月, 日, 星座），摩羯跨年作默认值 */
const XINGZUO_THRESHOLDS: [number, number, string][] = [
  [1, 20, "水瓶座"], [2, 19, "双鱼座"], [3, 21, "白羊座"], [4, 20, "金牛座"],
  [5, 21, "双子座"], [6, 22, "巨蟹座"], [7, 23, "狮子座"], [8, 23, "处女座"],
  [9, 23, "天秤座"], [10, 24, "天蝎座"], [11, 23, "射手座"], [12, 22, "摩羯座"],
];

function getXingzuo(month: number, day: number): string {
  let sign = "摩羯座";
  for (const [m, d, s] of XINGZUO_THRESHOLDS) {
    if (month > m || (month === m && day >= d)) sign = s;
  }
  return sign;
}

export interface BaziChart {
  name?: string;
  gender: "male" | "female";
  solarText: string;
  lunarText: string;
  pillars: { year: string; month: string; day: string; time: string };
  dayMaster: string;
  wuxingCount: Record<"金" | "木" | "水" | "火" | "土", number>;
  shishenGan: string[];
  nayin: string[];
  shengxiao: string;
  xingzuo: string;
  dayun: { startAge: number; ganZhi: string; startYear: number }[];
}

function isValidDate(year: number, month: number, day: number): boolean {
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

export function computeChart(payload: BaziPayload): BaziChart {
  const { year, month, day, hour, minute } = payload;
  if (!isValidDate(year, month, day)) {
    throw new Error("输入的日期不存在，请检查年月日");
  }
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const pillars = { year: ec.getYear(), month: ec.getMonth(), day: ec.getDay(), time: ec.getTime() };

  const wuxingCount: BaziChart["wuxingCount"] = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  for (const pillar of Object.values(pillars)) {
    for (const ch of pillar) {
      const wx = (GAN_WUXING[ch] ?? ZHI_WUXING[ch]) as keyof typeof wuxingCount | undefined;
      if (wx) wuxingCount[wx]++;
    }
  }

  const dayGan = pillars.day[0];
  const dayun = ec
    .getYun(payload.gender === "male" ? 1 : 0)
    .getDaYun()
    .filter((d) => d.getGanZhi())
    .slice(0, 8)
    .map((d) => ({ startAge: d.getStartAge(), ganZhi: d.getGanZhi(), startYear: d.getStartYear() }));

  return {
    name: payload.name,
    gender: payload.gender,
    solarText: `${year}年${month}月${day}日 ${hour}时${minute}分`,
    lunarText: lunar.toFullString(),
    pillars,
    dayMaster: `${GAN_YINYANG[dayGan]}${GAN_WUXING[dayGan]}（${dayGan}）`,
    wuxingCount,
    shishenGan: [ec.getYearShiShenGan(), ec.getMonthShiShenGan(), ec.getTimeShiShenGan()],
    nayin: [ec.getYearNaYin(), ec.getMonthNaYin(), ec.getDayNaYin(), ec.getTimeNaYin()],
    shengxiao: lunar.getYearShengXiao(),
    xingzuo: getXingzuo(month, day),
    dayun,
  };
}

export function buildPrompt(chart: BaziChart): string {
  const wx = Object.entries(chart.wuxingCount)
    .map(([k, v]) => `${k}×${v}`)
    .join("、");
  return `【求测者信息】
${chart.name ? `姓名：${chart.name}\n` : ""}性别：${chart.gender === "male" ? "男" : "女"}
公历：${chart.solarText}
农历：${chart.lunarText}

【八字排盘】
四柱：年柱 ${chart.pillars.year}｜月柱 ${chart.pillars.month}｜日柱 ${chart.pillars.day}｜时柱 ${chart.pillars.time}
日主：${chart.dayMaster}
五行分布（天干地支本气）：${wx}
天干十神：年干 ${chart.shishenGan[0]}、月干 ${chart.shishenGan[1]}、时干 ${chart.shishenGan[2]}
四柱纳音：${chart.nayin.join("、")}
生肖：${chart.shengxiao}｜星座：${chart.xingzuo}
大运：${chart.dayun.map((d) => `${d.startAge}岁起 ${d.ganZhi}（${d.startYear}年）`).join("；")}

请以子平八字为据，分节解读此命盘：
一、五行旺衰与格局喜用（指出身强或身弱、喜用神与忌神）
二、性格特质
三、事业与财运
四、感情与婚姻
五、健康与注意事项
六、未来二十年大运走势（结合上述大运分阶段分析）`;
}

export function prepare(payload: BaziPayload): PreparedReading {
  const chart = computeChart(payload);
  return { facts: { kind: "bazi", chart }, prompt: buildPrompt(chart) };
}
