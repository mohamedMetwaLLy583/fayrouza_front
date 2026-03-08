'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';

interface LayoutWithNavbarProps {
  children: ReactNode;
}

export function LayoutWithNavbar({ children }: LayoutWithNavbarProps) {
  const pathname = usePathname();
  
  // Pages that should have the navbar
  const pagesWithNavbar = ['/home'];
  
  if (pagesWithNavbar.includes(pathname)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
      </div>
    );
  }
  
  // For other pages, render without navbar
  return <>{children}</>;
}