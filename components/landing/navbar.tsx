"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Settings, Chrome, User, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { openUserProfile } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icon128.png"
            alt="CodeRep Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-xl font-semibold tracking-tight">CodeRep</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-2 md:flex">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" size="default" className="gap-2">
                <LayoutDashboard className="size-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="default" className="gap-2">
                <Settings className="size-4" />
                Settings
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="default" className="gap-2">
                <Chrome className="size-4" />
                Extension
              </Button>
            </Link>
          </SignedIn>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="default">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Button
              variant="outline"
              size="default"
              className="gap-2"
              onClick={() => openUserProfile()}
            >
              <User className="size-4" />
              Account
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
