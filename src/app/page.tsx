"use client"

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { TourProvider, useTour } from "@/components/tour-provider";
import { TourStep } from "@/components/tour-step";

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 relative pointer-events-none">
      
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
