import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "نظرة عامة" },
  { to: "/features", label: "المزايا" },
  { to: "/guide", label: "طريقة الاستخدام" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-nav backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          ستوديو الساعة
        </Link>
        <div className="flex items-center gap-5 text-xs sm:gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="hidden py-3 text-muted-foreground transition-colors hover:text-foreground sm:block"
              activeProps={{ className: "!text-foreground border-b border-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/studio"
            reloadDocument
            className="rounded-full bg-primary px-3.5 py-1 text-xs font-medium text-primary-foreground transition hover:brightness-110"
          >
            ابدأ التصميم
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>ستوديو الساعة — لساعات FitPro من طراز LT10 و LJ737(D)</span>
        <span>يعمل بالكامل داخل متصفحك. لا يُرفع أي شيء إلى خوادم.</span>
      </div>
    </footer>
  );
}
