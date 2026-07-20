import { z } from "zod";

const question = z
  .string()
  .trim()
  .min(1, "请填写所问之事")
  .max(200, "问题最多 200 字");

export const baziPayloadSchema = z.object({
  name: z.string().trim().max(20, "姓名最多 20 字").optional(),
  gender: z.enum(["male", "female"]),
  year: z.number().int().min(1900, "年份须在 1900–2100 之间").max(2100, "年份须在 1900–2100 之间"),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
});

export const tarotPayloadSchema = z.object({
  question,
  spread: z.enum(["single", "three"]),
});

export const ichingPayloadSchema = z.union([
  z.object({ question, method: z.literal("auto") }),
  z.object({
    question,
    method: z.literal("numbers"),
    numbers: z.tuple([
      z.number().int().positive("数字须为正整数"),
      z.number().int().positive("数字须为正整数"),
      z.number().int().positive("数字须为正整数"),
    ]),
  }),
]);

export const ZODIAC_SIGNS = [
  "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座",
  "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座",
] as const;

export const SHENGXIAO = [
  "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪",
] as const;

export const fortunePayloadSchema = z.union([
  z.object({ kind: z.literal("zodiac"), sign: z.enum(ZODIAC_SIGNS) }),
  z.object({ kind: z.literal("shengxiao"), sign: z.enum(SHENGXIAO) }),
]);

export const matchPayloadSchema = z.object({
  a: baziPayloadSchema,
  b: baziPayloadSchema,
});

export const divineRequestSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("bazi"), payload: baziPayloadSchema }),
  z.object({ type: z.literal("tarot"), payload: tarotPayloadSchema }),
  z.object({ type: z.literal("iching"), payload: ichingPayloadSchema }),
  z.object({ type: z.literal("fortune"), payload: fortunePayloadSchema }),
  z.object({ type: z.literal("match"), payload: matchPayloadSchema }),
]);

export type BaziPayload = z.infer<typeof baziPayloadSchema>;
export type TarotPayload = z.infer<typeof tarotPayloadSchema>;
export type IchingPayload = z.infer<typeof ichingPayloadSchema>;
export type FortunePayload = z.infer<typeof fortunePayloadSchema>;
export type MatchPayload = z.infer<typeof matchPayloadSchema>;
export type DivineRequest = z.infer<typeof divineRequestSchema>;
