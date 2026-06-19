import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
          Master Your Coding Interviews
        </h1>
        <p className="text-xl text-muted-foreground">
          Log, track, and analyze your solved DSA and Competitive Programming problems. 
          Auto-fetch problem details from LeetCode and Codeforces seamlessly.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/problems">
          <Button size="lg" className="h-12 px-8 text-lg rounded-full">
            View My Problems
          </Button>
        </Link>
        <Link href="/problems/new">
          <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
            Log New Problem
          </Button>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl text-left">
        <div className="p-6 rounded-2xl bg-card border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Automated Metadata</h3>
          <p className="text-muted-foreground text-sm">Paste a LeetCode or Codeforces URL and we instantly fetch the problem name, difficulty, and tags.</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Smart Organization</h3>
          <p className="text-muted-foreground text-sm">Filter your problems by platform, difficulty, and search through your past logs easily.</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Insight Tracking</h3>
          <p className="text-muted-foreground text-sm">Record key insights and mistakes to revise efficiently before your interviews.</p>
        </div>
      </div>
    </div>
  );
}
