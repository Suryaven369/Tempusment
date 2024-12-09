"use client";

import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/landing/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}