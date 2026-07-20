<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 项目说明：知命 · AI 算命

Next.js（App Router）+ TypeScript + Tailwind v4 的占卜应用。核心架构：**确定性计算在 `lib/divine/` 的代码里完成（排盘/抽牌/起卦），LLM 只做解读**；新增占卜模块时沿用同一模式：`prepare(payload) → { facts, prompt }`。

- 统一接口：`app/api/divine/route.ts`，zod discriminated union 校验（`lib/divine/types.ts`），响应为 NDJSON——首行 facts JSON + LLM 文本流；前端用 `components/useReading.ts` 解析。
- 系统 prompt 在 `lib/divine/common.ts`，所有模块共用；facts 类型与摘要统一在 `lib/divine/facts.ts`（页面、记录、导出三处复用）。
- 测算记录：`lib/records.ts`（localStorage，useSyncExternalStore 订阅），useReading 流结束后自动存档；记录页 `/history` 用 `components/FactsView.tsx` 按 kind 分发渲染。
- 导出：`components/ExportBar.tsx`（复制 / Markdown / PNG）。PNG 导出必须按 `scrollWidth + 边距` 显式设画布尺寸并 `boxSizing: "content-box"`——Tailwind 全局 border-box，直接加 padding 会挤压内容宽度裁掉右侧。
- 静态数据在 `data/`（塔罗 78 张、64 卦），改数据后跑 `npm test` 有覆盖校验。
- LLM 接入：`lib/llm.ts`（OpenAI 兼容协议），环境变量 `DEEPSEEK_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL`，模板见 `.env.example`。
- 命令：`npm run dev` / `npm test` / `npm run build`；无 Key 冒烟用 `scripts/mock-llm.cjs`（见 README）。
- UI 约定：暗色东方风（墨底/朱砂/金线，见 `app/globals.css` 的 @theme 变量），标题用 `font-kai`，错误信息一律中文。
