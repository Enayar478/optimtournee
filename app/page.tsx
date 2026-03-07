import { Navbar } from "@/components/sections/Navbar";
import { HeroV2 } from "@/components/sections/HeroV2";
import { FeaturesV2 } from "@/components/sections/FeaturesV2";
import { TestimonialsV2 } from "@/components/sections/TestimonialsV2";
import { ROICalculatorV2 } from "@/components/sections/ROICalculatorV2";
import { DemoPreview } from "@/components/sections/DemoPreview";
import { Pricing } from "@/components/sections/Pricing";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroV2 />
      <FeaturesV2 />
      <ROICalculatorV2 />
      <TestimonialsV2 />
      <DemoPreview />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
