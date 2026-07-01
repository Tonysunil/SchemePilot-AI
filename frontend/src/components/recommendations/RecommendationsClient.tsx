'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, XCircle, Loader2, ArrowRight, Save, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveScheme } from '@/app/actions/dashboard';
import Link from 'next/link';

interface AnalysisResult {
  eligible?: Array<{ title: string; match_level: string; reasons: string[] }>;
  needs_info?: Array<{ title: string; question: string }>;
  ineligible?: Array<{ title: string }>;
}

const LOADING_STEPS = [
  "🤖 Initializing AI engine...",
  "✓ Reading your profile data...",
  "✓ Checking strict eligibility criteria...",
  "✓ Searching 120+ government schemes...",
  "✓ Finding your best matches...",
  "Almost done..."
];

export function RecommendationsClient({ profile }: { profile: any }) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Stagger the loading steps for visual effect
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    const fetchAnalysis = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/analyze-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_profile: profile }),
        });
        
        if (!res.ok) throw new Error('Failed to analyze profile');
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        
        setResults(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        clearInterval(interval);
        // Ensure it shows the final step before removing loading screen
        setLoadingStep(LOADING_STEPS.length - 1);
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchAnalysis();

    return () => clearInterval(interval);
  }, [profile]);

  const handleSave = async (title: string) => {
    if (savedSchemes.has(title)) return;
    const res = await saveScheme(title, 'AI Recommended');
    if (!res?.error) {
      setSavedSchemes(prev => new Set(prev).add(title));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
              <div className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-full animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center mb-6 text-white">Analyzing Your Profile</h2>
          
          <div className="space-y-3">
            {LOADING_STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: idx <= loadingStep ? 1 : 0.3, 
                  x: 0,
                  color: idx === loadingStep ? '#818cf8' : (idx < loadingStep ? '#34d399' : '#9ca3af')
                }}
                className="flex items-center text-sm font-medium transition-colors duration-300"
              >
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="pt-6 text-center text-red-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-red-500/20 text-red-400">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const eligibleCount = results?.eligible?.length || 0;
  const needsInfoCount = results?.needs_info?.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          🎉 Good news, {profile.full_name || 'there'}!
        </h1>
        <p className="text-xl text-muted-foreground">
          We found <span className="text-emerald-400 font-bold">{eligibleCount} schemes</span> you are likely eligible for today.
        </p>
      </div>

      {eligibleCount > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-100 flex items-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mr-2" />
            Highly Eligible Schemes
          </h2>
          <div className="grid gap-4">
            {results?.eligible?.map((scheme, i) => (
              <Card key={i} className="bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl text-white">{scheme.title}</CardTitle>
                    <span className="shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-emerald-500/20 text-emerald-300">
                      {scheme.match_level || 'High Match'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wider">Why you match:</p>
                  <ul className="space-y-2">
                    {scheme.reasons?.map((reason, j) => (
                      <li key={j} className="flex items-start text-sm text-emerald-200/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSave(scheme.title)}
                    disabled={savedSchemes.has(scheme.title)}
                    className="border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400"
                  >
                    {savedSchemes.has(scheme.title) ? 'Saved' : 'Save Scheme'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {needsInfoCount > 0 && (
        <div className="space-y-4 mt-12">
          <h2 className="text-2xl font-semibold text-amber-100 flex items-center">
            <AlertCircle className="w-6 h-6 text-amber-400 mr-2" />
            Almost There... (Missing Details)
          </h2>
          <div className="grid gap-4">
            {results?.needs_info?.map((scheme, i) => (
              <Card key={i} className="bg-amber-500/5 border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">{scheme.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-200 mb-1">AI Needs Clarification:</p>
                    <p className="text-amber-100">{scheme.question}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link href={`/chat?q=${encodeURIComponent(scheme.question)}`}>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      Answer in Chat <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center pt-8 border-t border-white/10">
        <p className="text-muted-foreground mb-4">Want to ask specific questions about these schemes?</p>
        <Link href="/chat">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl">
            Talk to AI Assistant
          </Button>
        </Link>
      </div>
    </div>
  );
}
