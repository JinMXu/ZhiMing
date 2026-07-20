import Link from "next/link";

/** 模块页统一骨架：返回链接 + 编号 + 标题 + 引子 */
export default function ModuleShell({
  numeral,
  title,
  subtitle,
  intro,
  children,
}: {
  numeral: string;
  title: string;
  subtitle: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24">
      <header className="pt-10">
        <Link href="/" className="text-sm text-paper-dim transition-colors hover:text-paper">
          ← 返回知命
        </Link>
        <div className="reveal mt-10 flex items-baseline gap-5">
          <span className="font-kai text-3xl text-cinnabar">{numeral}</span>
          <h1 className="font-kai text-4xl text-paper">{title}</h1>
          <span className="text-xs tracking-[0.3em] text-gold">{subtitle}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-paper-dim">{intro}</p>
        <hr className="hairline mt-8" />
      </header>
      {children}
    </main>
  );
}
