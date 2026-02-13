'use client';

import { BottomNav } from '@/components/layout/bottom-nav';
import { Header } from '@/components/layout/header';
import { DBProvider } from '@/components/providers/db-provider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <DBProvider>
      <div className="min-h-screen bg-background">
        <Header />
        {children}
        <BottomNav />
      </div>
    </DBProvider>
  );
}
