import { LandingThemeProvider } from "@/components/providers/landing-theme-provider";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/landing/footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingThemeProvider>
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LandingThemeProvider>
  );
}