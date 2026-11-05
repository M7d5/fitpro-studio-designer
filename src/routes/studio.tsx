import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import markup from "@/studio/markup.html?raw";
import { SiteNav } from "@/components/site/SiteNav";
import studioCss from "@/studio/style.css?url";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "المحرر — ستوديو الساعة" },
      { name: "description", content: "صمّم خلفيات ساعة LT10 / LJ737(D)، صدّرها PNG، واتصل بالساعة مباشرة عبر البلوتوث." },
      { property: "og:title", content: "FitPro Studio — ستوديو الساعة" },
      { property: "og:description", content: "محرر خلفيات ساعات FitPro مع معاينة حيّة واتصال Web Bluetooth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: studioCss },
    ],
  }),
  component: Studio,
});

function Studio() {
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    void document.fonts?.load("600 14px \"IBM Plex Sans Arabic\"").finally(() => {
      void import("@/studio/app.mjs");
    });
  }, []);
  return (
    <div className="studio-root">
      <SiteNav />
      <div className="animate-page-in" dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
