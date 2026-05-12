import HeroSection from '../components/HeroSection';
import FloatingTrustCard from '../components/FloatingTrustCard';
import PracticeAreaGrid from '../components/PracticeAreaGrid';
import AboutAttorneySection from '../components/AboutAttorneySection';
import ProcessGuidanceSection from '../components/ProcessGuidanceSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ReassuranceBanner from '../components/ReassuranceBanner';
import ContactCTASection from '../components/ContactCTASection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FloatingTrustCard />
      <PracticeAreaGrid />
      <AboutAttorneySection />
      <ProcessGuidanceSection />
      <TestimonialsSection />
      <ReassuranceBanner />
      <ContactCTASection />
    </div>
  );
}
