import { createClient } from '@/utils/supabase/server';
import { RecommendationsClient } from '@/components/recommendations/RecommendationsClient';
import { redirect } from 'next/navigation';

export default async function RecommendationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  
  if (!profile) {
    redirect('/dashboard/profile');
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background pt-10 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />
      <div className="container mx-auto px-4 max-w-4xl">
        <RecommendationsClient profile={profile} />
      </div>
    </main>
  );
}
