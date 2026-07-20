import Link from "next/link";

/** 测算完成后的自动存档提示 */
export default function SavedNote() {
  return (
    <p className="mt-4 text-right text-xs text-paper-dim">
      已自动存入
      <Link
        href="/history"
        className="mx-1 underline decoration-cinnabar underline-offset-4 transition-colors hover:text-paper"
      >
        记录
      </Link>
      （仅保存在本机浏览器）
    </p>
  );
}
