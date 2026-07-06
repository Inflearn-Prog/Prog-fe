import dynamic from "next/dynamic";

import { Header } from "@/components/header/header";
import { HeroSection, StatsSection } from "@/components/landing";

const TestimonialSection = dynamic(() =>
  import("@/components/landing/testimonial-section").then(
    (mod) => mod.TestimonialSection
  )
);

const ComparisonSection = dynamic(() =>
  import("@/components/landing/comparison-section").then(
    (mod) => mod.ComparisonSection
  )
);

const CtaSection = dynamic(() =>
  import("@/components/landing/cta-section").then((mod) => mod.CtaSection)
);

const MobileBottomCta = dynamic(() =>
  import("@/components/landing/mobile-bottom-cta").then(
    (mod) => mod.MobileBottomCta
  )
);

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
