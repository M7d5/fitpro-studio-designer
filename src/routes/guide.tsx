import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "طريقة الاستخدام — ستوديو الساعة" },
      { name: "description", content: "خطوات بسيطة لتصميم خلفية ساعتك ووضعها عبر تطبيق FitPro." },
      { property: "og:title", content: "طريقة الاستخدام — ستوديو الساعة" },
      { property: "og:description", content: "من التصميم إلى معصمك في خمس خطوات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Guide,
});

const steps = [
  ["صمّم", "افتح المحرر، اختر تصميماً جاهزاً، وغيّر الألوان والعبارة أو أضف صورتك."],
  ["اتصل (اختياري)", "من Chrome أو Edge على الكمبيوتر اضغط «اتصال بالساعة» ليُقرأ مقاس شاشتها."],
  ["صدّر", "اضغط «حفظ الخلفية PNG» لتحصل على الصورة بالمقاس الصحيح."],
  ["انقلها لجوالك", "أرسل الصورة لهاتفك، ثم افتح تطبيق FitPro."],
  ["طبّقها", "الإعدادات ← إعدادات الواجهة ← واجهة مخصصة ← تغيير الخلفية، ثم مزامنة."],
];

function Guide() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 pt-24 text-center">
        <Reveal><h1 className="text-5xl font-bold tracking-tight sm:text-6xl">من الفكرة إلى معصمك.</h1></Reveal>
        <Reveal delay={150}><p className="mt-5 text-lg text-muted-foreground">خمس خطوات، دقيقتان تقريباً.</p></Reveal>
      </section>
      <ol className="mx-auto mt-20 max-w-3xl space-y-5 px-5">
        {steps.map(([t, b], i) => (
          <Reveal key={t} delay={60}>
            <li className="flex gap-6 rounded-[2rem] bg-card p-8">
              <span className="text-4xl font-bold tabular-nums text-primary">{i + 1}</span>
              <div>
                <h3 className="text-xl font-semibold">{t}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{b}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal className="mx-auto mt-10 max-w-3xl px-5">
        <p className="rounded-3xl border border-border p-6 text-sm leading-7 text-muted-foreground">الرفع المباشر للتصميم إلى الساعة غير متاح حالياً، لأن صيغة واجهات هذا الموديل لم تُطابق بعد، وإرسال صيغة خاطئة قد يعطّل الساعة.</p>
      </Reveal>
      <Reveal className="mt-14 text-center">
        <Link to="/studio" reloadDocument className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110">افتح المحرر</Link>
      </Reveal>
    </PageShell>
  );
}
