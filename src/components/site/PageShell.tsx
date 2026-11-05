import type { ReactNode } from "react";
import { SiteFooter, SiteNav } from "./SiteNav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="animate-page-in">{children}</main>
      <SiteFooter />
    </div>
  );
}
