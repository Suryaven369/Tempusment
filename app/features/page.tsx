import { MainNav } from '@/components/main-nav';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Features</h1>
          <p className="text-lg text-muted-foreground">
            Discover all the powerful features that make TempusBook the perfect solution for your business.
          </p>
        </div>
        <Features />
        <Footer />

      </div>
    </main>
  );
}