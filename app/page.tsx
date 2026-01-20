import Herosection from "./components/landing/Herosection";
import FeatureSection from "./components/landing/FeatureSection";
import IntegrationSection from "./components/landing/IntegrationSection"
import  HowItWorksSection from "./components/landing/HowItWorksSection"
import MoreFeaturesSection from "./components/landing/MoreFeatresSection";
import Footer from "./components/landing/Footer";

export default async function Home(){
  return (
    <div className="min-h-screen bg-black">
      <Herosection/>
      <FeatureSection/>
      <IntegrationSection/>
      <HowItWorksSection/>
      <MoreFeaturesSection/>
      <Footer/>
    </div>
  )
}