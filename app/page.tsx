import Link from "next/link";

const MODULES = [
  {
    numeral: "壹",
    title: "生辰八字",
    subtitle: "四柱推命",
    desc: "以出生年月日时排四柱八字，观五行旺衰、十神格局，推大运流年。",
    href: "/bazi",
    cta: "排盘",
  },
  {
    numeral: "贰",
    title: "塔罗牌",
    subtitle: "韦特占卜",
    desc: "默念心中所问，随机抽取牌面，以正逆位之意解过去、现在与未来。",
    href: "/tarot",
    cta: "抽牌",
  },
  {
    numeral: "叁",
    title: "周易起卦",
    subtitle: "六爻梅花",
    desc: "数字起卦或摇卦成爻，得本卦与变卦，引卦爻辞断事之吉凶趋势。",
    href: "/iching",
    cta: "起卦",
  },
  {
    numeral: "肆",
    title: "每日运势",
    subtitle: "星象生肖",
    desc: "星座生肖当日宜忌，综合、爱情、事业、财运四项指数一览。",
    href: "/fortune",
    cta: "观运",
  },
  {
    numeral: "伍",
    title: "姻缘匹配",
    subtitle: "八字合婚",
    desc: "两人各排命盘，观五行互补与生肖配对，看缘分几分天成、几分经营。",
    href: "/match",
    cta: "合盘",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24">
      {/* 页眉 */}
      <header className="flex items-center justify-between pt-10">
        <div className="flex items-center gap-4">
          <span className="seal flex h-11 w-11 items-center justify-center text-2xl">命</span>
          <span className="font-kai text-xl tracking-[0.3em] text-paper">
            知命
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/history"
            className="text-xs tracking-[0.25em] text-paper-dim transition-colors hover:text-paper"
          >
            记录
          </Link>
          <span className="text-xs tracking-[0.25em] text-paper-dim">仅供娱乐参考</span>
        </div>
      </header>

      {/* 主视觉 */}
      <section className="relative mt-20 flex items-start justify-between gap-8 md:mt-28">
        <div className="reveal">
          <p className="text-xs tracking-[0.5em] text-gold">以古之法 · 问今之事</p>
          <h1 className="font-kai mt-6 text-6xl leading-tight text-paper md:text-8xl">
            知命
          </h1>
          <p className="mt-8 max-w-md text-lg leading-loose text-paper-dim">
            五十而知天命。排一盘八字，抽一张塔罗，起一卦周易——
            古人观象以知进退，今人借此以观内心。
          </p>
        </div>
        <p
          className="v-text reveal hidden shrink-0 text-sm text-paper-dim md:block"
          style={{ animationDelay: "0.15s" }}
        >
          命由己造　相由心生
        </p>
      </section>

      <hr className="hairline mt-20" />

      {/* 四术索引 */}
      <nav className="mt-4">
        {MODULES.map((m, i) => (
          <Link
            key={m.href}
            href={m.href}
            className="group reveal flex items-baseline gap-6 border-b border-(--color-line) py-8 transition-colors hover:bg-ink-2 md:gap-10"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <span className="font-kai text-2xl text-cinnabar">
              {m.numeral}
            </span>
            <div className="flex-1">
              <div className="flex items-baseline gap-4">
                <h2 className="font-kai text-3xl text-paper transition-transform duration-300 group-hover:translate-x-2">
                  {m.title}
                </h2>
                <span className="text-xs tracking-[0.3em] text-gold">{m.subtitle}</span>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper-dim">{m.desc}</p>
            </div>
            <span className="font-kai text-lg text-paper-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-cinnabar">
              {m.cta} →
            </span>
          </Link>
        ))}
      </nav>

      <footer className="mt-20 flex items-center justify-between text-xs tracking-[0.2em] text-paper-dim">
        <span>知命者不怨天 · 知己者不怨人</span>
        <span>AI 解读 · 仅供参考</span>
      </footer>
    </main>
  );
}
