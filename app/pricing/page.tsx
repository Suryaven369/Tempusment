import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for small businesses and independent professionals',
    features: [
      'Up to 2 staff members',
      'Basic appointment scheduling',
      'Client management',
      'Email notifications',
      'Basic analytics',
      'Standard support',
    ],
  },
  {
    name: 'Professional',
    price: '$79',
    description: 'Ideal for growing businesses with advanced needs',
    features: [
      'Up to 10 staff members',
      'Advanced scheduling',
      'Full CRM capabilities',
      'Email & SMS notifications',
      'Advanced analytics',
      'Priority support',
      'Marketing tools',
      'Custom branding',
    ],
  },
  {
    name: 'Enterprise',
    price: '$199',
    description: 'For large organizations requiring maximum flexibility',
    features: [
      'Unlimited staff members',
      'Enterprise scheduling',
      'Advanced CRM & automation',
      'Multi-location support',
      'Custom analytics',
      '24/7 premium support',
      'Advanced marketing suite',
      'API access',
      'Custom integration',
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col p-8 bg-card rounded-lg shadow-lg border"
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                {plan.price}
                <span className="ml-1 text-xl font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="ml-3 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-8" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}