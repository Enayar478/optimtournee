import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ROICalculator } from "@/components/sections/ROICalculator";
import { Features } from "@/components/sections/Features";
import { DemoPreview } from "@/components/sections/DemoPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ROICalculator />
      <Features />
      <DemoPreview />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
