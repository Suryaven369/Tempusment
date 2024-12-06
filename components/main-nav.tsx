import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Calendar } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-16 items-center justify-between pl-4 md:pl-10">
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Calendar className="h-9 w-9" />
        <span className="font-bold">TempusBook</span>
      </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden gap-6 md:flex">
            <Link href="/features" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              About
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4">
              <Link href="/features" className="text-sm font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-sm font-medium">
                About
              </Link>
              <Link href="/login" className="text-sm font-medium">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium">
                Get Started
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-4 pr-3 md:pr-9">
          <ModeToggle />
          <div className="hidden md:flex md:items-center md:gap-4 ">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}