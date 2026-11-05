import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import markup from "@/studio/markup.html?raw";
import studioCss from "@/studio/style.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitPro Studio — ستوديو الساعة" },
      { name: "description", content: "صمّم خلفيات ساعة LT10 / LJ737(D)، صدّرها PNG، واتصل بالساعة مباشرة عبر البلوتوث." },
      { property: "og:title", content: "FitPro Studio — ستوديو الساعة" },
      { property: "og:description", content: "محرر خلفيات ساعات FitPro مع معاينة حيّة واتصال Web Bluetooth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" },
      { rel: "stylesheet", href: studioCss },
    ],
  }),
  component: Studio,
});

function Studio() {
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    void document.fonts?.load("600 14px Cairo").finally(() => {
      void import("@/studio/app.mjs");
    });
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
