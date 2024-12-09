"use client";

import Link from "next/link";
import { Calendar, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

interface BusinessFooterProps {
  business: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  userId: string;
}

export function BusinessFooter({ business, userId }: BusinessFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span className="font-bold text-lg">{business.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Book your appointments online, anytime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/book/${userId}#services`} className="text-sm text-muted-foreground hover:text-primary">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href={`/book/${userId}#about`} className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/book/${userId}/register`} className="text-sm text-muted-foreground hover:text-primary">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              {business.address && (
                <li className="text-sm text-muted-foreground">
                  {business.address}
                </li>
              )}
              {business.phone && (
                <li>
                  <a href={`tel:${business.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                    {business.phone}
                  </a>
                </li>
              )}
              {business.email && (
                <li>
                  <a href={`mailto:${business.email}`} className="text-sm text-muted-foreground hover:text-primary">
                    {business.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          {business.socialLinks && Object.values(business.socialLinks).some(link => link) && (
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {business.socialLinks.facebook && (
                  <a 
                    href={business.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {business.socialLinks.instagram && (
                  <a 
                    href={business.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {business.socialLinks.twitter && (
                  <a 
                    href={business.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {business.socialLinks.linkedin && (
                  <a 
                    href={business.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} {business.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}