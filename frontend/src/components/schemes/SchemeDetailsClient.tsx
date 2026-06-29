'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, FileText, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { bulkAddChecklistItems } from '@/app/actions/dashboard';
import { useRouter } from 'next/navigation';

export function SchemeDetailsClient({ scheme }: { scheme: any }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">Scheme not found.</p>
      </div>
    );
  }

  const handleAddToChecklist = async () => {
    if (!scheme.required_documents || scheme.required_documents.length === 0) {
      alert('No required documents specified for this scheme.');
      return;
    }
    
    setIsAdding(true);
    // Format tasks e.g., "Aadhaar Card (For PM-KISAN)"
    const tasks = scheme.required_documents.map((doc: string) => `${doc} (For ${scheme.name})`);
    
    const result = await bulkAddChecklistItems(tasks);
    setIsAdding(false);
    
    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      setAdded(true);
      setTimeout(() => {
        if (scheme.official_website) {
          window.open(scheme.official_website, '_blank');
        } else {
          router.push('/dashboard/checklist');
        }
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/schemes" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Schemes
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <div className="flex gap-2 flex-wrap mb-4">
              <Badge className="bg-indigo-500/20 text-indigo-300">{scheme.category}</Badge>
              <Badge variant="outline" className="border-white/20">{scheme.state}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{scheme.name}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{scheme.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-400" /> 
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>{scheme.eligibility}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="mr-2 h-5 w-5 text-blue-400" /> 
                    Application Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>{scheme.application_process}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-indigo-600/10 border-indigo-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-indigo-100">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent className="text-indigo-200 font-medium">
                  {scheme.benefits}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl">Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                    {scheme.required_documents?.map((doc: string, i: number) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handleAddToChecklist} 
                    disabled={isAdding || added}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12"
                  >
                    {isAdding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ClipboardList className="mr-2 h-5 w-5" />}
                    {added ? 'Added! Redirecting...' : 'Add to Checklist & Apply'}
                  </Button>
                </CardContent>
              </Card>

              {scheme.official_website && (
                <a 
                  href={scheme.official_website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-foreground font-medium"
                >
                  Official Website <ExternalLink className="ml-2 h-4 w-4 text-muted-foreground" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
