"use client"

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { TourProvider, useTour } from "@/components/tour-provider";
import { TourStep } from "@/components/tour-step";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { Code2, FileText, Filter, Lightbulb, ArrowRight } from "lucide-react";

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
    <div className="w-full">

      {/* Hero */}
      <section className="py-28 md:py-36 border-b border-border">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
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
