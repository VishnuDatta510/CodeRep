import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ScienceSection } from "@/components/landing/science-section";
import { HowToUseSection } from "@/components/landing/how-to-use-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ScienceSection />
        <HowToUseSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
