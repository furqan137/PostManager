'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenLine } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/',
      label: 'Posts',
      active: pathname === '/',
    },
    {
      href: '/posts/new',
      label: 'New Post',
      active: pathname === '/posts/new',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <PenLine className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Post Manager
            </span>
          </Link>
          <nav className="flex items-center space-x-1 ml-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? 'default' : 'ghost'}
                className={cn(
                  'text-sm transition-all',
                  route.active 
                    ? 'text-primary-foreground' 
                    : 'text-foreground/60 hover:text-foreground'
                )}
                asChild
              >
                <Link href={route.href}>{route.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}