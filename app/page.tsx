import HeroSection from '../components/HeroSection';
import FloatingTrustCard from '../components/FloatingTrustCard';
import PracticeAreaGrid from '../components/PracticeAreaGrid';
import AboutAttorneySection from '../components/AboutAttorneySection';
import ProcessGuidanceSection from '../components/ProcessGuidanceSection';
import LocalAuthoritySection from '../components/LocalAuthoritySection';
import ReassuranceBanner from '../components/ReassuranceBanner';
import ContactCTASection from '../components/ContactCTASection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FloatingTrustCard />
      <PracticeAreaGrid />
      <AboutAttorneySection />
      <LocalAuthoritySection />
      <ProcessGuidanceSection />
      <ReassuranceBanner />
      <ContactCTASection />
    </div>
  );
}
