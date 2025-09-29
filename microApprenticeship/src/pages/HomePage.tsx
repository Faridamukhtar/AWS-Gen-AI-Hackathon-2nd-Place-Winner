import { HeroSection } from "../components/HeroSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { ForGraduatesSection } from "../components/ForGraduatesSection";
import { ForOrganizationsSection } from "../components/ForOrganizationsSection";
import { SuccessStoriesSection } from "../components/SuccessStoriesSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <ForGraduatesSection />
      <ForOrganizationsSection />
      <SuccessStoriesSection />
    </>
  );
}