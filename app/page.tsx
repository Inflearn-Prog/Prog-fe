import { Header } from "@/components/header/header";
import {
  ComparisonSection,
  CtaSection,
  HeroSection,
  MobileBottomCta,
  StatsSection,
  TestimonialSection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-svh">
      <Header />
      <main className="flex-1 bg-gray-50 pb-16 md:pb-0">
        <HeroSection />
        <StatsSection />
        <TestimonialSection />
        <ComparisonSection />
        <CtaSection />
        <MobileBottomCta />
      </main>
    </div>
  );
}
