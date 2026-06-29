'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    // Read the current cookie on mount to set initial state
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    const currentCode = match ? match[2] : 'en';
    const langObj = languages.find(l => l.code === currentCode);
    if (langObj) setLanguage(langObj.name);
  }, []);

  const handleLanguageChange = (lang: {code: string, name: string}) => {
    setLanguage(lang.name);
    document.cookie = `NEXT_LOCALE=${lang.code}; path=/; max-age=31536000`; // 1 year
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden sm:inline-flex items-center text-sm font-medium h-9 px-3 rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/20">
        <Globe className="mr-2 h-4 w-4" />
        {language}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang)}
            className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
