'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileMenu({ 
  isLoggedIn, 
  dict, 
  signOutAction 
}: { 
  isLoggedIn: boolean; 
  dict: any; 
  signOutAction: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-foreground">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg z-50 p-4"
          >
            <nav className="flex flex-col space-y-4">
              <Link href="/" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">
                {dict.header.home || 'Home'}
              </Link>
              <Link href="/schemes" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">
                {dict.header.schemes}
              </Link>
              <Link href="/about" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">
                {dict.header.about}
              </Link>

              <div className="h-px bg-border w-full my-2" />

              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">
                    {dict.header.dashboard}
                  </Link>
                  <Link href="/dashboard/profile" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">
                    {dict.header.profile || 'Profile'}
                  </Link>
                  <form action={signOutAction} className="pt-2">
                    <Button type="submit" variant="ghost" className="w-full justify-start text-muted-foreground hover:text-rose-500 px-0">
                      <LogOut className="mr-2 h-5 w-5" /> {dict.header.logout}
                    </Button>
                  </form>
                </>
              ) : (
                <Link href="/login" onClick={closeMenu} className={cn(buttonVariants(), "bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl w-full justify-center mt-2")}>
                  {dict.header.login}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
