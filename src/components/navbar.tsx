"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center pt-6 pb-4 bg-transparent pointer-events-none">
      <nav
        className="w-[90%] max-w-3xl rounded-full border border-border/40 bg-background/60 backdrop-blur-md shadow-lg pointer-events-auto"
        style={{ fontFamily: "var(--font-atkinson-mono), monospace" }}
      >
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-base tracking-tight text-foreground hover:text-primary transition-colors"
          >
            <BookOpen className="w-5 h-5 text-primary" />
            DSA Logger
          </Link>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button
                  variant="secondary"
                  asChild
                  className="rounded-full bg-secondary/60 hover:bg-secondary/80"
                >
                  <Link href="/problems">Problems</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/problems/new">Log Problem</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="rounded-full border-red-500/60 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn("google")} className="rounded-full">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
