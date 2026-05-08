import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SupportSection from './components/SupportSection';
import RobotMarketplaceSection from './components/RobotMarketplaceSection';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import CtaSection from './components/CtaSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <SupportSection />
      <RobotMarketplaceSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
