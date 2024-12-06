"use client";

import { LandingHero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { MainNav } from '@/components/main-nav';
//import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <LandingHero />
      <Features />
    
    </main>
  );
}