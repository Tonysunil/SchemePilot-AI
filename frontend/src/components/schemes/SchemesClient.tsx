'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, FileText, CheckCircle2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function SchemesClient({ schemes }: { schemes: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-background pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Government Schemes Library</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Browse through available welfare schemes, subsidies, and scholarships. Let SchemePilot AI find the perfect match for you.
            </p>
          </div>
          <div className="relative w-full md:w-96 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes or categories..." 
              className="pl-10 h-12 rounded-xl bg-white/5 border-white/10"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.1, 0.5) }}
            >
              <Card className="h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors rounded-2xl">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
                      {scheme.category || 'General'}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-muted-foreground">
                      {scheme.state || 'All India'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl leading-tight">{scheme.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 text-muted-foreground text-sm">
                  <p className="mb-4 line-clamp-3">{scheme.description}</p>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="font-semibold text-foreground block mb-1">Key Benefit:</span>
                    <span className="line-clamp-2">{scheme.benefits}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Dialog>
                    <DialogTrigger className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-white/20 text-foreground hover:bg-white/10 cursor-pointer")}>
                      Details
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{scheme.name}</DialogTitle>
                        <DialogDescription className="text-indigo-300 font-medium">
                          {scheme.category} • {scheme.state}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center text-lg"><FileText className="w-5 h-5 mr-2 text-blue-400" /> What is this scheme?</h4>
                          <p className="text-muted-foreground leading-relaxed">{scheme.description}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center text-lg"><Award className="w-5 h-5 mr-2 text-indigo-400" /> Features & Benefits</h4>
                          <p className="text-muted-foreground leading-relaxed">{scheme.benefits}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center text-lg"><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" /> Eligibility</h4>
                          <p className="text-muted-foreground leading-relaxed">{scheme.eligibility}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <Link href={`/schemes/${scheme.id}`} className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-white/20 hover:bg-white/10")}>
                          Full Details & Checklist
                        </Link>
                        {scheme.official_website && (
                          <a href={scheme.official_website} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white")}>
                            Apply Official <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {scheme.official_website && (
                    <a 
                      href={scheme.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants(), "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white")}
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  )}
                  {!scheme.official_website && (
                    <Link 
                      href={`/schemes/${scheme.id}`}
                      className={cn(buttonVariants(), "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white")}
                    >
                      Check Eligibility
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          {filteredSchemes.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No schemes found matching your search. Try adjusting your keywords!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
