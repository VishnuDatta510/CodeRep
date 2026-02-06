import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-8 py-10 sm:flex-row">
        <div className="flex items-center gap-3">
          <Image
            src="/icon128.png"
            alt="CodeRep Logo"
            width={28}
            height={28}
            className="rounded opacity-80"
          />
          <span className="text-base text-muted-foreground">
            CodeRep &copy; {new Date().getFullYear()}
          </span>
        </div>

        <nav className="flex items-center gap-8 text-base text-muted-foreground">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="transition-colors hover:text-foreground"
          >
            Settings
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
