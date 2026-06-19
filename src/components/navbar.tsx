"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          DSA Logger
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/problems">
                <Button variant="ghost">My Problems</Button>
              </Link>
              <Link href="/problems/new">
                <Button variant="default">Log Problem</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn("google")}>Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  )
}
