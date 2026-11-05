import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "المزايا — ستوديو الساعة" },
      { name: "description", content: "كل ما يقدمه ستوديو الساعة: تصاميم جاهزة، معاينة حيّة، تصدير PNG، واتصال بلوتوث." },
      { property: "og:title", content: "المزايا — ستوديو الساعة" },
      { property: "og:description", content: "تعرف على مزايا محرر خلفيات ساعات FitPro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Features,
});

const features = [
  ["◐", "ألوان بلا حدود", "اختر لون التفاصيل والخلفية بحرية، وشاهد النتيجة لحظياً."],
  ["▢", "صورتك الخاصة", "أضف صورة من جهازك وكبّرها لتملأ الشاشة كما تريد."],
  ["Aa", "عبارتك", "أضف كلمة تشبهك أعلى التصميم أو أسفله."],
  ["⌁", "قراءة الساعة", "اتصل بالبلوتوث ليُضبط مقاس التصميم تلقائياً على شاشتك."],
  ["↓", "تصدير نظيف", "صورة PNG بدون وقت ثابت، جاهزة لتطبيق FitPro."],
  ["◎", "على جهازك فقط", "لا حسابات ولا رفع ملفات. كل شيء يبقى عندك."],
];

function Features() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 pt-24 text-center">
        <Reveal><h1 className="text-5xl font-bold tracking-tight sm:text-6xl">بسيط. وقوي.</h1></Reveal>
        <Reveal delay={150}><p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">أدوات قليلة مختارة بعناية، تكفي لتصنع وجه ساعة لا يشبه غيرك.</p></Reveal>
      </section>
      <section className="mx-auto mt-20 grid max-w-6xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([icon, title, body], i) => (
          <Reveal key={title} delay={(i % 3) * 120}>
            <div className="group h-full rounded-[2rem] bg-card p-9 transition duration-500 hover:-translate-y-1 hover:bg-secondary">
              <div className="text-4xl text-accent transition duration-500 group-hover:scale-110">{icon}</div>
              <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <Reveal className="mt-24 text-center">
        <Link to="/studio" reloadDocument className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110">جرّب المحرر الآن</Link>
      </Reveal>
    </PageShell>
  );
}
