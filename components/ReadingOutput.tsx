"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** 流式解读渲染：加载中带打字光标 */
export default function ReadingOutput({ text, loading }: { text: string; loading: boolean }) {
  if (!text && loading) {
    return (
      <p className="text-paper-dim italic">
        推演中<span className="caret" />
      </p>
    );
  }
  return (
    <div className={`reading ${loading ? "caret" : ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
