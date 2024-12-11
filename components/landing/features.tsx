import {
  Calendar,
  Users,
  CreditCard,
  Bell,
  BarChart3,
  Building2,
  Mail,
  Star,
  Shield,
} from "lucide-react";


const features = [
  {
    name: "Smart Scheduling",
    description: "Intelligent booking system with real-time availability and automated confirmations.",
    icon: Calendar,
  },
  {
    name: "Client Management",
    description: "Comprehensive CRM with detailed client profiles and interaction history.",
    icon: Users,
  },
  {
    name: "Secure Payments",
    description: "Integrated payment processing with multiple payment options and automated invoicing.",
    icon: CreditCard,
  },
  {
    name: "Smart Notifications",
    description: "Automated reminders and notifications for appointments and follow-ups.",
    icon: Bell,
  },
  {
    name: "Business Analytics",
    description: "Detailed insights into business performance and client behavior.",
    icon: BarChart3,
  },
  {
    name: "Multi-location Support",
    description: "Manage multiple business locations from a single dashboard.",
    icon: Building2,
  },
  {
    name: "Marketing Tools",
    description: "Built-in email and SMS marketing campaigns for client engagement.",
    icon: Mail,
  },
  {
    name: "Reviews & Feedback",
    description: "Collect and manage client reviews and feedback automatically.",
    icon: Star,
  },
  {
    name: "Enterprise Security",
    description: "Advanced security features with role-based access control.",
    icon: Shield,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful features for modern businesses
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            TempusBook provides all the tools you need to manage appointments, clients, and grow your business effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                  
                </dd>
              </div>
              
            ))}
          </dl>
        </div>
      </div>
      
    </div>
    

  );
}