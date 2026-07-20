"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";
import FactsView from "@/components/FactsView";
import ReadingOutput from "@/components/ReadingOutput";
import { clearRecords, removeRecord, useRecords } from "@/lib/records";
import { MODULE_NAMES } from "@/lib/divine/facts";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryPage() {
  const records = useRecords();
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleClear() {
    if (!window.confirm("确定清空全部测算记录？此操作不可恢复。")) return;
    clearRecords();
    setExpanded(null);
  }

  return (
    <ModuleShell
      numeral="录"
      title="测算记录"
      subtitle="本机存档"
      intro="每次测算完成会自动存档于此，最多保留五十条。记录仅存在你的浏览器里，不会上传到任何服务器。"
    >
      {records === null ? null : records.length === 0 ? (
        <p className="mt-16 text-center text-paper-dim">
          尚无记录。去测一盘
          <span className="font-kai text-gold"> 八字 </span>或起一卦，回来这里就能看到存档。
        </p>
      ) : (
        <>
          <div className="mt-6 flex justify-end">
            <button type="button" className="choice text-sm" onClick={handleClear}>
              清空全部
            </button>
          </div>
          <ul className="mt-4">
            {records.map((r) => (
              <li key={r.id} className="border-b border-(--color-line)">
                <div className="flex items-center gap-4 py-5">
                  <span className="seal shrink-0 px-2 py-1 text-xs">
                    {MODULE_NAMES[r.kind]}
                  </span>
                  <button
                    type="button"
                    className="flex-1 text-left"
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    <span className="block truncate text-paper transition-colors hover:text-gold">
                      {r.title.split("\n")[0]}
                    </span>
                    <span className="mt-1 block text-xs text-paper-dim">{formatTime(r.createdAt)}</span>
                  </button>
                  <span className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="choice text-sm"
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    >
                      {expanded === r.id ? "收起" : "查看"}
                    </button>
                    <button
                      type="button"
                      className="choice text-sm text-cinnabar"
                      onClick={() => removeRecord(r.id)}
                    >
                      删除
                    </button>
                  </span>
                </div>
                {expanded === r.id && (
                  <div className="pb-10">
                    <FactsView facts={r.facts} />
                    <section className="mt-8">
                      <hr className="hairline mb-8" />
                      <ReadingOutput text={r.text} loading={false} />
                    </section>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </ModuleShell>
  );
}
