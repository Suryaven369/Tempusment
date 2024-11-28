"use client";

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Play } from "lucide-react";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">See TempusBook in Action</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Watch how TempusBook can transform your business operations with smart scheduling and client management.
          </p>
          
          <div className="aspect-video bg-card rounded-lg shadow-lg overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
              alt="TempusBook Demo Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Smart Booking</h3>
              <p className="text-muted-foreground">See how our intelligent scheduling system works in real-time.</p>
            </div>
            <div className="p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Client Management</h3>
              <p className="text-muted-foreground">Explore our comprehensive CRM features and client profiles.</p>
            </div>
            <div className="p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Business Analytics</h3>
              <p className="text-muted-foreground">Discover how to track and improve your business performance.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}