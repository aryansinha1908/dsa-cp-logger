"use client"

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { TourProvider, useTour } from "@/components/tour-provider";
import { TourStep } from "@/components/tour-step";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { Code2 } from "lucide-react";

const PLATFORMS = [
  { name: 'LeetCode', icon: SiLeetcode, color: 'text-yellow-500 group-hover:text-yellow-400' },
  { name: 'Codeforces', icon: SiCodeforces, color: 'text-blue-500 group-hover:text-blue-400' },
  { name: 'AtCoder', icon: Code2, color: 'text-neutral-500 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white' },
  { name: 'CodeChef', icon: SiCodechef, color: 'text-orange-700 dark:text-orange-600 group-hover:text-orange-500' }
];

function HomeContent() {
  const { startTour, setTotalSteps } = useTour();

  useEffect(() => {
    setTotalSteps(3);
  }, [setTotalSteps]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full relative">
      
      {/* Background Image Container with Glass Blur */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-auto">
        <Image 
          src="/images/bg.png" 
          alt="Ambient Background" 
          fill
          priority
          className="object-cover opacity-80"
        />
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[60px]" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center space-y-12 relative pointer-events-none pt-20 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-3xl z-10 relative"
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-blue-100 to-teal-400 dark:from-white dark:via-blue-200 dark:to-teal-500 bg-clip-text text-transparent drop-shadow-sm pb-2 pointer-events-auto">
            Master Your Coding Interviews
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-medium px-4 pointer-events-auto">
            Log, track, and analyze your solved DSA and Competitive Programming problems. 
            Auto-fetch problem details seamlessly.
          </p>
          <div className="pt-4 pointer-events-auto flex justify-center gap-4">
             <Button variant="outline" onClick={startTour} className="rounded-full bg-background/50 backdrop-blur-md hover:bg-muted/50 border-border/50">
               Take a Tour
             </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 z-10 relative pointer-events-auto"
        >
          <Link href="/problems" style={{ anchorName: '--tour-btn-view' } as any}>
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-shadow">
              View My Problems
            </Button>
          </Link>
          <Link href="/problems/new" style={{ anchorName: '--tour-btn-new' } as any}>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted/50">
              Log New Problem
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          style={{ anchorName: '--tour-cards' } as any}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl text-left px-4 z-10 relative pointer-events-auto"
        >
          <motion.div variants={item} className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-xl hover:bg-card/60 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Automated Metadata</h3>
            <p className="text-muted-foreground leading-relaxed">Paste a LeetCode or Codeforces URL and we instantly fetch the problem name, difficulty, and tags.</p>
          </motion.div>
          
          <motion.div variants={item} className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-xl hover:bg-card/60 transition-colors">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-6 text-teal-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Smart Organization</h3>
            <p className="text-muted-foreground leading-relaxed">Filter your problems by platform, difficulty, and search through your past logs easily.</p>
          </motion.div>
          
          <motion.div variants={item} className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-xl hover:bg-card/60 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Insight Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">Record key insights and mistakes to revise efficiently before your upcoming interviews.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Supported Platforms Section */}
      <div className="py-24 px-4 relative z-10 pointer-events-auto border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Supported Platforms
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Seamlessly integrate with the most popular coding platforms. Just drop a link, and we'll do the rest.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {PLATFORMS.map((platform, idx) => {
              const Icon = platform.icon;
              return (
                <motion.div 
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-white/10 hover:bg-card/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/5 transition-all flex flex-col items-center justify-center font-semibold text-lg gap-4"
                >
                  <Icon className={`w-12 h-12 transition-colors duration-300 ${platform.color}`} />
                  <span>{platform.name}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Interactive Workflow Section */}
      <div className="py-24 px-4 relative z-10 pointer-events-auto border-t border-white/5 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to build your ultimate problem-solving repository.</p>
          </motion.div>

          <div className="space-y-12">
            {[
              { step: '01', title: 'Solve & Submit', desc: 'Conquer a problem on your favorite platform and copy the URL.' },
              { step: '02', title: 'Paste & Fetch', desc: 'Paste the link here. Our parsers automatically pull the title, difficulty, and topic tags.' },
              { step: '03', title: 'Reflect & Revise', desc: 'Add your custom notes, approaches, and code snippets. Come back to review before interviews.' }
            ].map((item, idx) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col sm:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}
              >
                <div className="w-24 h-24 shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl font-bold text-blue-400">
                  {item.step}
                </div>
                <div className={`flex-1 ${idx % 2 !== 0 ? 'sm:text-right' : 'sm:text-left'} text-center`}>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 px-4 relative z-10 pointer-events-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-8 p-12 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-white/10 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
          <h2 className="text-4xl sm:text-5xl font-bold relative z-10">Ready to level up?</h2>
          <p className="text-xl text-muted-foreground relative z-10">
            Start building your personal library of solved problems today. It's free and takes seconds.
          </p>
          <div className="pt-4 relative z-10">
            <Link href="/problems/new">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all hover:scale-105">
                Log Your First Problem
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Tour Steps */}
      <TourStep 
        step={1} 
        title="Log a Problem" 
        content="Start by logging a new problem you just solved. Paste the URL and we'll fetch the details automatically." 
        anchorName="--tour-btn-new"
        positionArea="bottom span-all"
      />
      <TourStep 
        step={2} 
        title="View Your History" 
        content="Once logged, come here to see all your solved problems, filter them by difficulty or tags, and review your notes." 
        anchorName="--tour-btn-view"
        positionArea="top span-all"
      />
      <TourStep 
        step={3} 
        title="Core Features" 
        content="Our platform automatically fetches metadata, helps you organize, and lets you track insights so you can master your interviews!" 
        anchorName="--tour-cards"
        positionArea="top center"
      />
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

