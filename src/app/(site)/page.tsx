import { ProjectCollision } from "@/components/fx/ProjectCollision";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { CitiesSection } from "@/components/sections/CitiesSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { DeliverySection } from "@/components/sections/DeliverySection";
import { DemosSection } from "@/components/sections/DemosSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FeaturedPacks } from "@/components/sections/FeaturedPacks";
import { Hero } from "@/components/sections/Hero";
import { PackQuiz } from "@/components/sections/PackQuiz";
import { ScrollStorySection } from "@/components/sections/ScrollStorySection";
import { jsonLd } from "@/lib/content";

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd.business()} />
      <JsonLd data={jsonLd.faq()} />
      <Hero />
      <ProjectCollision />
      <PortfolioSection />
      <CategoriesSection />
      <FeaturedPacks />
      <PackQuiz />
      <DemosSection />
      <ScrollStorySection />
      <ComparisonSection />
      <DeliverySection />
      <CitiesSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
