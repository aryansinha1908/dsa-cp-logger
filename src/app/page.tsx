"use client"

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TourProvider, useTour } from "@/components/tour-provider";
import { TourStep } from "@/components/tour-step";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { Code2, FileText, Filter, Lightbulb, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

const PLATFORMS = [
  { name: 'LeetCode', icon: SiLeetcode },
  { name: 'Codeforces', icon: SiCodeforces },
  { name: 'AtCoder', icon: Code2 },
  { name: 'CodeChef', icon: SiCodechef },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Auto-fetch metadata",
    desc: "Paste a LeetCode or Codeforces URL and get the title, difficulty, and tags instantly.",
  },
  {
    icon: Filter,
    title: "Smart filters",
    desc: "Filter by platform, difficulty, tags, or how you solved it — find any problem in seconds.",
  },
  {
    icon: Lightbulb,
    title: "Insight tracking",
    desc: "Record key insights and mistakes per problem. Review them before interviews.",
  },
];

function StatsCard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<{
    total: number;
    byPlatform: Record<string, number>;
    currentStreak: number;
    longestStreak: number;
    thisWeek: number;
  } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });

  useEffect(() => {
    fetch("/api/problems").then(r => r.json()).then(d => {
      if (!Array.isArray(d)) return;
      const byPlatform: Record<string, number> = {};
      d.forEach((p: any) => { byPlatform[p.platform] = (byPlatform[p.platform] ?? 0) + 1; });

      // Unique days with activity (YYYY-MM-DD)
      const days = [...new Set(d.map((p: any) => new Date(p.createdAt).toLocaleDateString("en-CA")))].sort();

      // Current streak — walk backwards from today
      let current = 0;
      const today = new Date(); today.setHours(0,0,0,0);
      for (let i = 0; ; i++) {
        const d2 = new Date(today); d2.setDate(today.getDate() - i);
        if (days.includes(d2.toLocaleDateString("en-CA"))) current++;
        else if (i === 0) break; // today empty — check yesterday
        else if (i === 1 && !days.includes(d2.toLocaleDateString("en-CA"))) break;
        else break;
      }
      // fix: if today has no entry, streak starts from yesterday
      const todayStr = today.toLocaleDateString("en-CA");
      if (!days.includes(todayStr)) {
        current = 0;
        const yest = new Date(today); yest.setDate(today.getDate() - 1);
        for (let i = 0; ; i++) {
          const d2 = new Date(yest); d2.setDate(yest.getDate() - i);
          if (days.includes(d2.toLocaleDateString("en-CA"))) current++;
          else break;
        }
      }

      // Longest streak
      let longest = 0, run = 0;
      for (let i = 0; i < days.length; i++) {
        if (i === 0) { run = 1; continue; }
        const prev = new Date(days[i - 1]); prev.setDate(prev.getDate() + 1);
        if (prev.toLocaleDateString("en-CA") === days[i]) run++;
        else run = 1;
        if (run > longest) longest = run;
      }
      if (run > longest) longest = run;

      // This week (Mon–today)
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      monday.setHours(0,0,0,0);
      const thisWeek = d.filter((p: any) => new Date(p.createdAt) >= monday).length;

      setStats({ total: d.length, byPlatform, currentStreak: current, longestStreak: Math.max(longest, current), thisWeek });
    }).catch(() => {});
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const isNewRecord = stats ? stats.currentStreak > 0 && stats.currentStreak >= stats.longestStreak : false;
  const streakPct = stats && stats.longestStreak > 0 ? stats.currentStreak / stats.longestStreak : 0;
  const r = 28; const circ = 2 * Math.PI * r;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="relative w-2xl aspect-square shrink-0 rounded-2xl border border-border bg-card p-8 shadow-xl cursor-default select-none flex flex-col"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />

      {/* User row */}
      <div className="flex items-center gap-5 mb-8">
        {session?.user?.image ? (
          <img src={session.user.image} alt="avatar" className="w-20 h-20 rounded-full border-2 border-border" />
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-border bg-muted flex items-center justify-center text-2xl font-semibold text-foreground">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-2xl font-semibold text-foreground truncate">{session?.user?.name ?? "Your archive"}</p>
          <p className="text-base text-muted-foreground truncate">{session?.user?.email ?? "Sign in to see stats"}</p>
        </div>
      </div>

      {/* Total */}
      <div className="mb-8">
        <p className="text-8xl font-bold text-foreground tabular-nums">{stats?.total ?? "—"}</p>
        <p className="text-lg text-muted-foreground mt-1">problems logged</p>
      </div>

      {/* Per-platform breakdown */}
      <div className="flex-1 flex flex-col justify-evenly mb-8">
        {stats && Object.entries(stats.byPlatform).sort((a, b) => b[1] - a[1]).map(([platform, count]) => (
          <div key={platform} className="flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((count / stats.total) * 100)}%` }} />
            </div>
            <span className="text-base text-muted-foreground w-32 truncate text-right">{platform}</span>
            <span className="text-base font-medium text-foreground w-8 text-right tabular-nums">{count}</span>
          </div>
        ))}
        {!stats && <p className="text-base text-muted-foreground">No data yet</p>}
      </div>

      {/* Streak row */}
      <div className="flex items-center gap-6">
        {/* Current streak */}
        <div className="flex items-center gap-3">
          {isNewRecord ? (
            <span className="text-4xl" style={{ filter: "drop-shadow(0 0 10px #f97316) drop-shadow(0 0 20px #f97316)" }}>🔥</span>
          ) : (
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-muted" />
                <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-orange-500"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - streakPct)} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground tabular-nums">
                {stats?.currentStreak ?? "—"}
              </span>
            </div>
          )}
          <div>
            {isNewRecord && <p className="text-4xl font-bold text-orange-400 tabular-nums">{stats?.currentStreak}</p>}
            <p className="text-sm text-muted-foreground">current streak</p>
          </div>
        </div>

        <div className="w-px h-12 bg-border" />

        {/* Longest streak */}
        <div>
          <p className="text-4xl font-bold text-foreground tabular-nums">{stats?.longestStreak ?? "—"}</p>
          <p className="text-sm text-muted-foreground">longest streak</p>
        </div>

        <div className="w-px h-12 bg-border" />

        {/* This week */}
        <div>
          <p className="text-4xl font-bold text-foreground tabular-nums">{stats?.thisWeek ?? "—"}</p>
          <p className="text-sm text-muted-foreground">this week</p>
        </div>
      </div>
    </motion.div>
  );
}

function HomeContent() {
  const { startTour, setTotalSteps } = useTour();

  useEffect(() => {
    setTotalSteps(3);
  }, [setTotalSteps]);

  const stagger: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="w-full" style={{ fontFamily: "var(--font-atkinson-mono), monospace" }}>

      {/* Hero */}
      <section className="py-28 md:py-36 border-b border-border">
        <div className="flex items-center justify-between gap-12">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
            <motion.p variants={fadeUp} className="text-sm font-mono text-primary uppercase tracking-widest mb-8">
              DSA / CP Logger
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight mb-8">
              Build your personal<br className="hidden md:block" /> problem archive.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed">
              Log every DSA and competitive programming problem you solve. Auto-fetch metadata, track insights and mistakes, review before interviews.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
              <Button size="lg" className="h-12 px-8 text-base" asChild style={{ anchorName: '--tour-btn-new' } as any}>
                <Link href="/problems/new">Log a problem <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild style={{ anchorName: '--tour-btn-view' } as any}>
                <Link href="/problems">View my log</Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-12 px-6 text-base text-muted-foreground" onClick={startTour}>
                Take a tour
              </Button>
            </motion.div>
          </motion.div>

          {/* Parallax stats card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="hidden lg:block"
            style={{ perspective: "800px" }}
          >
            <StatsCard />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-b border-border">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ anchorName: '--tour-cards' } as any}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-24 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground">Three steps to build your archive.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: "01", title: "Solve & copy the URL", desc: "Finish a problem on LeetCode, Codeforces, or any platform and copy the problem URL." },
            { n: "02", title: "Paste & auto-fetch", desc: "Paste the link — we pull the title, difficulty, and topic tags from the platform automatically." },
            { n: "03", title: "Add notes & review", desc: "Write your key insight and any mistakes. Come back to review the whole log before interviews." },
          ].map(({ n, title, desc }, idx) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-8 rounded-lg border border-border bg-card space-y-4 text-center"
            >
              <span className="font-mono text-sm text-primary">{n}</span>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="py-24 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">Supported platforms</h2>
          <p className="text-lg text-muted-foreground">Auto-fetch works on LeetCode and Codeforces. Others can be logged manually.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-4">
          {PLATFORMS.map(({ name, icon: Icon }, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="flex items-center gap-3 px-6 py-3.5 rounded-md border border-border bg-card text-base font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <Icon className="w-5 h-5" />
              {name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center flex flex-col items-center"
        >
          <h2 className="text-4xl font-bold tracking-tight">Ready to start?</h2>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            It's free. Takes 10 seconds to log a problem. Start building the habit now.
          </p>
          <Button size="lg" asChild>
            <Link href="/problems/new">Log your first problem <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </motion.div>
      </section>

      {/* Tour Steps */}
      <TourStep step={1} title="Log a problem" content="Paste a URL and we fetch everything automatically. Add your insights and you're done." anchorName="--tour-btn-new" positionArea="bottom span-all" />
      <TourStep step={2} title="View your log" content="See all your solved problems. Filter by difficulty, platform, tags, or how you solved it." anchorName="--tour-btn-view" positionArea="top span-all" />
      <TourStep step={3} title="Core features" content="Auto-fetch, smart filters, and insight tracking — the full loop from solve to review." anchorName="--tour-cards" positionArea="top center" />
    </div>
  );
}

export default function Home() {
  return (
    <TourProvider>
      <HomeContent />
    </TourProvider>
  );
}
