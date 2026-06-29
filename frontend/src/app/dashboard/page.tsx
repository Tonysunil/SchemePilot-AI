import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Landmark, Bookmark, CheckSquare, Bot, UserCircle } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(lang);

  // Extract name from metadata, or fallback to email prefix
  let name = user?.user_metadata?.full_name;
  if (!name && user?.email) {
    const emailPrefix = user.email.split('@')[0];
    const match = emailPrefix.match(/[a-zA-Z]+/); // Extracts first alpha sequence even if preceded by numbers
    name = match ? match[0] : emailPrefix;
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  } else if (!name) {
    name = 'Citizen';
  }

  const menuItems = [
    { title: dict.dashboard.card_scholarships, icon: <GraduationCap className="w-8 h-8 mb-2 text-blue-400" />, href: '/schemes' },
    { title: dict.dashboard.card_schemes, icon: <Landmark className="w-8 h-8 mb-2 text-emerald-400" />, href: '/schemes' },
    { title: dict.dashboard.card_saved, icon: <Bookmark className="w-8 h-8 mb-2 text-amber-400" />, href: '/dashboard/saved' },
    { title: dict.dashboard.card_checklist, icon: <CheckSquare className="w-8 h-8 mb-2 text-rose-400" />, href: '/dashboard/checklist' },
    { title: dict.dashboard.card_chat, icon: <Bot className="w-8 h-8 mb-2 text-indigo-400" />, href: '/chat' },
    { title: dict.dashboard.card_profile, icon: <UserCircle className="w-8 h-8 mb-2 text-purple-400" />, href: '/dashboard/profile' },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background pt-16 pb-20 flex flex-col items-center relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />

      <div className="container px-4 max-w-5xl w-full">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {dict.dashboard.greeting.replace('{name}', name)}
          </h1>
          <p className="text-xl text-muted-foreground">
            {dict.dashboard.question}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} className="block group">
              <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] transition-all duration-300 cursor-pointer backdrop-blur-xl">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
