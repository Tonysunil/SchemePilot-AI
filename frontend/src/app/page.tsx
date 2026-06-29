import { Hero } from '@/components/landing/Hero';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero dict={dict.landing} />
    </main>
  );
}
