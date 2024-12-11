import { MainNav } from '@/components/main-nav';
import { Calendar, Users2, Building2 } from 'lucide-react';
import { Footer } from '@/components/landing/footer';

const stats = [
  {
    label: 'Active Users',
    value: '10,000+',
    icon: Users2,
  },
  {
    label: 'Appointments Booked',
    value: '1M+',
    icon: Calendar,
  },
  {
    label: 'Business Locations',
    value: '5,000+',
    icon: Building2,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">About TempusBook</h1>
          
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-lg text-muted-foreground text-center mb-12">
              TempusBook is revolutionizing how businesses manage appointments and client relationships. 
              Our platform combines powerful scheduling capabilities with advanced CRM features to help 
              businesses grow and succeed.
            </p>

            <div className="grid md:grid-cols-3 gap-8 my-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6">Our Mission</h2>
            <p>
              We believe that every business, regardless of size, deserves access to powerful tools 
              that can help them grow and succeed. Our mission is to provide an all-in-one solution 
              that makes appointment scheduling and client management effortless.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">Why Choose TempusBook?</h2>
            <ul className="space-y-4">
              <li>Built for modern businesses with real-world needs in mind</li>
              <li>Constantly evolving with new features and improvements</li>
              <li>Dedicated support team to help you succeed</li>
              <li>Secure and reliable platform you can trust</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}