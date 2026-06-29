import { createClient } from '@/utils/supabase/server';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { saveProfile } from '@/app/actions/profile';
import { removeScheme } from '@/app/actions/dashboard';
import { Save, CheckCircle2, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage(props: { searchParams: Promise<{ updated?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Try to fetch existing profile
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  const { data: schemes } = await supabase
    .from('saved_schemes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background pt-10 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">Profile Setup</h1>
          <p className="text-muted-foreground text-lg">
            Tell us about yourself. We'll use this securely to find government schemes you're perfectly eligible for!
          </p>
        </div>

        {searchParams.updated === 'true' && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5 mr-3" />
            Your profile has been successfully updated!
          </div>
        )}

        <form action={saveProfile}>
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Essential Information</CardTitle>
              <CardDescription>Required fields to help the AI match you accurately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" name="state" placeholder="e.g. Maharashtra" required defaultValue={profile?.state || ''} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_income">Annual Family Income (₹) *</Label>
                  <Input id="annual_income" name="annual_income" type="number" placeholder="e.g. 250000" required defaultValue={profile?.annual_income || ''} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education Level *</Label>
                  <Input id="education" name="education" placeholder="e.g. Undergraduate" required defaultValue={profile?.education || ''} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course Name *</Label>
                  <Input id="course" name="course" placeholder="e.g. B.Tech Computer Science" required defaultValue={profile?.course || ''} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Current Year of Study *</Label>
                  <Input id="year" name="year" placeholder="e.g. 2nd Year" required defaultValue={profile?.year || ''} className="bg-white/5 border-white/10" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <h3 className="text-lg font-medium mb-1">Optional Demographics</h3>
                <p className="text-sm text-muted-foreground mb-6">Skip these if you prefer, but they unlock specialized schemes.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category (Optional)</Label>
                    <Input id="category" name="category" placeholder="e.g. General, OBC, SC, ST" defaultValue={profile?.category || ''} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender (Optional)</Label>
                    <Input id="gender" name="gender" placeholder="e.g. Male, Female, Other" defaultValue={profile?.gender || ''} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="disability">Disability (Optional)</Label>
                    <Input id="disability" name="disability" placeholder="e.g. None, Visually Impaired" defaultValue={profile?.disability || ''} className="bg-white/5 border-white/10" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-6 border-t border-white/10 bg-white/5 rounded-b-xl">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                {profile ? 'Update Profile' : 'Save Profile'}
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">Schemes I've Applied For</h2>
          </div>
          
          {(!schemes || schemes.length === 0) ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-center py-10">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">You haven't saved or applied for any schemes yet.</p>
                <Link href="/chat">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Find Schemes via AI</Button>
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
                        Track Status <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
