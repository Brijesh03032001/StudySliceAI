'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlayCircle, Scissors, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: PlayCircle },
    { href: '/upload', label: 'Upload', icon: Scissors },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                  <Link href="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              StudySlice AI
            </span>
          </Link>

        <div className="flex items-center gap-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              variant={pathname === href ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                'gap-2 text-slate-600 hover:text-slate-900',
                pathname === href && 'bg-emerald-500 hover:bg-emerald-600 text-white'
              )}
            >
              <Link href={href}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}