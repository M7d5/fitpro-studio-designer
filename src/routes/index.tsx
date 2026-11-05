import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { WatchMock } from "@/components/site/WatchMock";
import { CloserLook } from "@/components/site/CloserLook";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ستوديو الساعة — صمّم وجه ساعتك" },
      { name: "description", content: "صمّم خلفيات ساعات FitPro بمعاينة حيّة، صدّرها PNG، واتصل بساعتك عبر البلوتوث." },
      { property: "og:title", content: "ستوديو الساعة — صمّم وجه ساعتك" },
      { property: "og:description", content: "محرر أنيق لخلفيات ساعات FitPro يعمل في متصفحك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 pt-20 text-center sm:pt-28">
        <Reveal><p className="text-lg font-medium text-accent">ستوديو الساعة</p></Reveal>
        <Reveal delay={120}><h1 className="mx-auto mt-3 max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-7xl">وجهك. بطريقتك.</h1></Reveal>
        <Reveal delay={240}><p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground sm:text-xl">صمّم خلفية ساعتك بألوانك وصورك، وشاهدها حيّة قبل أن تلبسها.</p></Reveal>
        <Reveal delay={360}>
          <div className="mt-8 flex items-center justify-center gap-6">
            <Link to="/studio" reloadDocument className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110">ابدأ التصميم</Link>
            <Link to="/features" className="text-sm text-primary hover:underline">اعرف المزيد ›</Link>
          </div>
        </Reveal>
        <Reveal delay={200} className="mx-auto mt-16 w-64 sm:w-80"><WatchMock className="animate-float" /></Reveal>
      </section>

      <section className="mx-auto mt-32 max-w-6xl px-5">
        <Reveal><h2 className="mb-10 text-4xl font-bold tracking-tight sm:text-5xl">نظرة عن قرب.</h2></Reveal>
        <Reveal><CloserLook /></Reveal>
      </section>

      <section className="mx-auto mt-32 grid max-w-6xl gap-5 px-5 sm:grid-cols-3">
        {[["٤", "تصاميم جاهزة للبدء"], ["PNG", "تصدير بمقاس شاشتك"], ["٠", "ملفات تُرفع لخوادم"]].map(([n, t], i) => (
          <Reveal key={t} delay={i * 120}>
            <div className="rounded-[2rem] bg-card p-10 text-center">
              <div className="text-5xl font-bold text-foreground">{n}</div>
              <div className="mt-3 text-muted-foreground">{t}</div>
            </div>
          </Reveal>
        ))}
      </section>
    </PageShell>
  );
}
