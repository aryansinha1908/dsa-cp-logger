"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="w-full px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-base tracking-tight text-foreground hover:text-primary transition-colors">
          <BookOpen className="w-5 h-5 text-primary" />
          DSA Logger
        </Link>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/problems">Problems</Link>
              </Button>
              <Button asChild>
                <Link href="/problems/new">Log Problem</Link>
              </Button>
              <Button variant="ghost" onClick={() => signOut()} className="text-muted-foreground">
                Sign out
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn("google")}>Sign in</Button>
          )}
        </div>
      </div>
    </nav>
  )
}
