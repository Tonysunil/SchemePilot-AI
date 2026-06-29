'use client';

import { motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Sparkles, FileText, Search, Bot, ShieldCheck, Languages } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Hero({ dict }: { dict: any }) {
  
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-foreground backdrop-blur-md mb-8"
        >
          <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
          <span>{dict.badge}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          {dict.title.split(' ').map((word: string, i: number, arr: string[]) => 
            i >= arr.length - 2 ? (
              <span key={i} className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">{word} </span>
            ) : (
              <span key={i} className="text-foreground">{word} </span>
            )
          )}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground"
        >
          {dict.subtitle}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/chat">
            <Button size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg">
              {dict.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/schemes" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md")}>
            <Search className="mr-2 h-5 w-5" />
            {dict.browse}
          </Link>
        </motion.div>

        {/* Feature Cards Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          <FeatureCard 
            icon={<Search className="h-6 w-6 text-blue-400" />}
            title="Semantic Discovery"
            description="No more keyword guessing. Just explain your situation naturally."
          />
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6 text-indigo-400" />}
            title="Intelligent Reasoning"
            description="Our AI reads official documents to verify your eligibility accurately."
          />
          <FeatureCard 
            icon={<FileText className="h-6 w-6 text-purple-400" />}
            title="Actionable Plans"
            description="Get step-by-step application checklists and required documents."
          />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10">
      <div className="p-3 bg-white/5 rounded-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
