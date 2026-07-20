"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

/**
 * 导出工具栏：复制文本 / 下载 Markdown / 导出 PNG 图片。
 * targetRef 指向要进图片的结果区域（facts 可视化 + 解读正文）。
 */
export default function ExportBar({
  targetRef,
  summary,
  text,
  name,
  disabled,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  summary: string;
  text: string;
  name: string;
  disabled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const filename = `${name}-${stamp}`;
  const markdown = `${summary}\n\n${text}\n\n—— 知命 · AI 解读，仅供娱乐参考`;

  async function copyText() {
    setError(null);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("复制失败，请手动选择文本复制");
    }
  }

  function triggerDownload(name: string, href: string) {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    a.click();
  }

  function downloadMd() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerDownload(`${filename}.md`, url);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function downloadPng() {
    const node = targetRef.current;
    if (!node) return;
    setExporting(true);
    setError(null);
    try {
      // 关键点：Tailwind 全局 border-box，若只加 padding 会反向挤压内容宽度导致右侧被裁。
      // 这里显式按 scrollWidth + 边距设定画布，并让节点以 content-box 保持原始内容宽度。
      const pad = 28;
      const dataUrl = await toPng(node, {
        backgroundColor: "#16110c",
        pixelRatio: 2,
        width: node.scrollWidth + pad * 2,
        height: node.scrollHeight + pad * 2,
        style: {
          width: `${node.scrollWidth}px`,
          maxWidth: "none",
          padding: `${pad}px`,
          margin: "0",
          boxSizing: "content-box",
          overflow: "visible",
        },
      });
      triggerDownload(`${filename}.png`, dataUrl);
    } catch {
      setError("图片导出失败，请重试");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="mr-1 text-xs tracking-[0.3em] text-gold">导出</span>
      <button type="button" className="choice text-sm" onClick={copyText} disabled={disabled}>
        {copied ? "已复制 ✓" : "复制文本"}
      </button>
      <button type="button" className="choice text-sm" onClick={downloadMd} disabled={disabled}>
        Markdown
      </button>
      <button
        type="button"
        className="choice text-sm"
        onClick={downloadPng}
        disabled={disabled || exporting}
      >
        {exporting ? "生成中…" : "图片"}
      </button>
      {error && <span className="w-full text-right text-xs text-cinnabar">{error}</span>}
    </div>
  );
}
