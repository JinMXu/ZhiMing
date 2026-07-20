import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * 返回配置好的语言模型。DeepSeek 使用 OpenAI 兼容协议，
 * 通过环境变量可切换任意 OpenAI 兼容服务。
 */
export function getModel() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY，请在 .env.local 中填写后重启服务");
  }
  const provider = createOpenAICompatible({
    name: "deepseek",
    baseURL: process.env.LLM_BASE_URL ?? "https://api.deepseek.com",
    apiKey,
  });
  return provider(process.env.LLM_MODEL ?? "deepseek-v4-pro");
}
