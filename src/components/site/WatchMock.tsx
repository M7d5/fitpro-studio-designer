import { useEffect, useState } from "react";

export function WatchMock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now ? now.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--";
  const day = now ? now.toLocaleDateString("ar", { weekday: "long", day: "numeric" }) : "";
  return (
    <div className={`relative ${className}`} aria-hidden>
      <div className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-3xl animate-glow" />
      <div className="relative mx-auto aspect-[5/6] w-full rounded-[3.2rem] bg-gradient-to-br from-muted-foreground/60 via-secondary to-muted-foreground/40 p-3 shadow-2xl">
        <div className="absolute -left-2 top-[28%] h-14 w-3 rounded-full bg-muted-foreground/70" />
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2.6rem] border-[6px] border-stage bg-stage">
          <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full border-[10px] border-accent/80" />
          <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full border-[6px] border-accent/30" />
          <span className="relative text-sm text-muted-foreground">{day}</span>
          <span className="relative text-6xl font-semibold tabular-nums tracking-tight text-foreground">{time}</span>
          <span className="relative mt-3 rounded-full bg-secondary/80 px-3 py-1 text-xs text-accent">♥ ٦٢ نبضة/د</span>
        </div>
      </div>
    </div>
  );
}
