import Link from "next/link";

const CATEGORIES = [
  "Politics", "Sports", "Crypto", "Tech", "AI", "Finance", "Geopolitics", "Culture",
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <span className="text-xs font-bold text-primary-foreground">P</span>
              </div>
              <span className="font-semibold">Polymarket</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The World&apos;s Largest Prediction Market™
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Markets by category</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/crypto" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Crypto
              </Link>
              <Link href="/sports" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Sports
              </Link>
              <Link href="/politics" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Politics
              </Link>
              {CATEGORIES.filter((c) => !["Crypto", "Sports", "Politics"].includes(c)).map((cat) => (
                <Link
                  key={cat}
                  href={`/search?q=${encodeURIComponent(cat.toLowerCase())}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Resources</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://docs.polymarket.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                API Docs
              </a>
              <Link
                href="/leaderboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Leaderboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Clone built with Polymarket Gamma &amp; Data APIs · Trading involves substantial risk of loss
        </div>
      </div>
    </footer>
  );
}
