import type { FortunePayload } from "./types";
import type { PreparedReading } from "./common";

export function prepare(payload: FortunePayload): PreparedReading {
  const now = new Date();
  const date = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const label = payload.kind === "zodiac" ? "星座" : "生肖";
  const prompt = `今天是 ${date}。请为${label}【${payload.sign}】生成今日运势：
一、今日指数：综合、爱情、事业、财运四项，各 1–5 星（用 ★☆ 表示，如 ★★★★☆）
二、幸运色、幸运数字、贵人方位
三、今日运势详解（一段话，150 字左右，具体不空泛）
四、今日宜忌：宜两三条、忌两三条，简短俏皮`;
  return { facts: { kind: "fortune", label, sign: payload.sign, date }, prompt };
}
