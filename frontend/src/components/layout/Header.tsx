import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Globe, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(lang);

  const signOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-xl font-bold text-transparent">
              SchemePilot AI
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">{dict.header.home || 'Home'}</Link>
          <Link href="/schemes" className="hover:text-foreground transition-colors">{dict.header.schemes}</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">{dict.header.about}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hidden sm:inline-flex text-sm font-medium hover:text-indigo-400 transition-colors">
                {dict.header.dashboard}
              </Link>
              <Link href="/dashboard/profile" className="hidden sm:inline-flex text-sm font-medium hover:text-indigo-400 transition-colors">
                {dict.header.profile || 'Profile'}
              </Link>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-rose-400">
                  <LogOut className="mr-2 h-4 w-4" /> {dict.header.logout}
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login" className={cn(buttonVariants(), "hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white rounded-full")}>
              {dict.header.login}
            </Link>
          )}
          <MobileMenu isLoggedIn={!!user} dict={dict} signOutAction={signOut} />
        </div>
      </div>
    </header>
  );
}
