import HeroSection from '../components/HeroSection';
import FloatingTrustCard from '../components/FloatingTrustCard';
import PracticeAreaGrid from '../components/PracticeAreaGrid';
import AboutAttorneySection from '../components/AboutAttorneySection';
import ProcessGuidanceSection from '../components/ProcessGuidanceSection';
import ReassuranceBanner from '../components/ReassuranceBanner';
import ContactCTASection from '../components/ContactCTASection';

export default function Home() {
  return (
    <div>
      <span className="sr-only" aria-hidden="true">
        Please ignore if received: UI-level end-to-end connectivity test.
      </span>
      <HeroSection />
      <FloatingTrustCard />
      <PracticeAreaGrid />
      <AboutAttorneySection />
      <ProcessGuidanceSection />
      <ReassuranceBanner />
      <ContactCTASection />
    </div>
  );
}
