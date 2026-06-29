import { createClient } from '@/utils/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { removeScheme } from '@/app/actions/dashboard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SavedSchemesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: schemes } = await supabase
    .from('saved_schemes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background pt-10 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">Saved Schemes</h1>
            <p className="text-muted-foreground text-lg">
              Your bookmarked government schemes for quick access.
            </p>
          </div>
          <Bookmark className="w-12 h-12 text-indigo-500/20 hidden md:block" />
        </div>

        {(!schemes || schemes.length === 0) ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-center py-20">
            <CardContent>
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No schemes saved yet</h3>
              <p className="text-muted-foreground mb-6">Ask SchemePilot AI to find schemes for you and save them here.</p>
              <Link href="/chat">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Go to AI Chat</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {schemes.map((scheme) => (
              <Card key={scheme.id} className="bg-white/5 border-white/10 backdrop-blur-xl group hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">{scheme.scheme_title}</h3>
                    {scheme.category && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-indigo-500/10 text-indigo-400">
                        {scheme.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <form action={async () => {
                      "use server";
                      await removeScheme(scheme.id);
                    }} className="w-full md:w-auto">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400 w-full md:w-auto">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                    <Button variant="outline" className="w-full md:w-auto border-white/10 hover:bg-white/10 text-white">
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
