import { useState, type ReactNode } from "react";
import { WatchMock } from "./WatchMock";

type Item = { id: string; title: string; body: string; stage: ReactNode };

const swatches = ["bg-accent", "bg-primary", "bg-destructive", "bg-foreground", "bg-muted-foreground"];

const items: Item[] = [
  {
    id: "themes",
    title: "التصاميم الجاهزة",
    body: "أربع بدايات أنيقة: مدار، رمال، موج، وهدوء. اختر واحدة ثم غيّر لونها بلمسة.",
    stage: (
      <div className="flex flex-col items-center gap-8">
        <WatchMock className="w-56 sm:w-64" />
        <div className="flex gap-3">{swatches.map((s) => <span key={s} className={`h-6 w-6 rounded-full ring-2 ring-border ${s}`} />)}</div>
      </div>
    ),
  },
  {
    id: "preview",
    title: "المعاينة الحيّة",
    body: "كل تغيير تراه فوراً على الساعة: اللون، العبارة، وصورتك الخاصة — قبل أن تحفظ أي شيء.",
    stage: (
      <div className="relative flex h-full w-full items-center justify-center">
        {[0, 1, 2].map((i) => (
          <span key={i} className="absolute rounded-full border border-primary/40 animate-glow" style={{ width: 180 + i * 110, height: 180 + i * 110, animationDelay: `${i * 0.8}s` }} />
        ))}
        <WatchMock className="w-52 sm:w-60" />
      </div>
    ),
  },
  {
    id: "bluetooth",
    title: "اتصال بالبلوتوث",
    body: "اتصل بساعتك مباشرة من المتصفح لقراءة مقاس الشاشة والبطارية، واختبر الاهتزاز للعثور عليها.",
    stage: (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-glow" />
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-primary text-6xl text-primary">⌁</div>
      </div>
    ),
  },
  {
    id: "export",
    title: "تصدير بجودة كاملة",
    body: "احفظ الخلفية صورة PNG بمقاس شاشة ساعتك تماماً، ثم ضعها عبر تطبيق FitPro.",
    stage: (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-accent text-6xl text-accent">↓</div>
      </div>
    ),
  },
  {
    id: "projects",
    title: "احفظ مشاريعك",
    body: "احفظ تصميمك كملف مشروع وارجع له أي وقت لتكمل من حيث توقفت.",
    stage: (
      <div className="relative h-64 w-72">
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute h-48 w-40 rounded-3xl border border-border bg-card shadow-2xl" style={{ right: i * 50, top: i * 18, transform: `rotate(${(i - 1) * 8}deg)` }}>
            <div className={`m-3 h-28 rounded-2xl ${["bg-accent/70", "bg-primary/70", "bg-secondary"][i]}`} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "privacy",
    title: "خصوصية تامة",
    body: "كل شيء يعمل داخل متصفحك. صورك وتصاميمك لا تغادر جهازك أبداً.",
    stage: <div className="text-8xl text-muted-foreground">◎</div>,
  },
];

export function CloserLook() {
  const [active, setActive] = useState(0);
  const go = (d: number) => setActive((a) => (a + d + items.length) % items.length);
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-stage">
      <div className="grid min-h-[560px] lg:min-h-[640px] lg:grid-cols-[360px_1fr]">
        <div className="relative z-10 flex items-center gap-3 p-6 sm:p-10">
          <div className="hidden flex-col gap-2 sm:flex">
            <button onClick={() => go(-1)} aria-label="السابق" className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:text-foreground">⌃</button>
            <button onClick={() => go(1)} aria-label="التالي" className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:text-foreground">⌄</button>
          </div>
          <ul className="flex flex-col items-start gap-3">
            {items.map((it, i) => {
              const open = i === active;
              return (
                <li key={it.id}>
                  <button
                    onClick={() => setActive(i)}
                    aria-expanded={open}
                    className={`grid overflow-hidden text-right backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? "max-w-[300px] rounded-3xl bg-secondary/90 p-5" : "max-w-[300px] rounded-full bg-secondary/70 px-4 py-2.5 hover:bg-secondary"}`}
                  >
                    {open ? (
                      <p key="o" className="animate-page-in text-sm leading-7 text-muted-foreground">
                        <strong className="font-semibold text-foreground">{it.title}. </strong>
                        {it.body}
                      </p>
                    ) : (
                      <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-foreground/70 text-xs">+</span>
                        {it.title}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative min-h-[420px]">
          {items.map((it, i) => (
            <div
              key={it.id}
              aria-hidden={i !== active}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${i === active ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
            >
              {it.stage}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
