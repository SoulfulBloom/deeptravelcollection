import HeroSection from "@/components/HeroSection";
import Newsletter from "@/components/Newsletter";
import SnowbirdLeadMagnet from "@/components/SnowbirdLeadMagnet";
import NavigationSelector from "@/components/NavigationSelector";
import InstantGuideForm from "@/components/InstantGuideForm";
import SnowbirdValueProposition from "@/components/snowbird/SnowbirdValueProposition";
import SnowbirdDestinationShowcase from "@/components/snowbird/SnowbirdDestinationShowcase";
import ImmersiveExperiencesShowcase from "@/components/experiences/ImmersiveExperiencesShowcase";
import { useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Compass, Calendar, Heart } from "lucide-react";
import "../styles/onboarding-tour.css";

export default function Home() {
  useEffect(() => {
    document.title = "Deep Travel - Canadian Snowbird Destinations";
  }, []);
  
  return (
    <>
      <HeroSection />
      <SnowbirdValueProposition />
      
      {/* Why Trust My Itineraries Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Why Trust My Itineraries?</h2>
                
                <p className="mb-4 text-gray-700">
                  As a <span className="font-semibold text-blue-700">TICO-licensed travel consultant with 10 years in the industry</span>, I don't just plan trips
                  —I craft deep, meaningful, and unforgettable travel experiences.
                </p>
                
                <p className="mb-4 text-gray-700">
                  Every destination I recommend has been personally explored or meticulously researched
                  to ensure it delivers the <span className="italic">cultural immersion, authentic connections, and transformative
                  moments</span> that define true experiential travel.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
                  <p className="text-gray-700">
                    This is not just a vacation—it's a journey designed for those who crave more than
                    sightseeing. Let's explore deeper. 🌏✨
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    TICO Licensed
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    Cultural Immersion
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Sustainable Travel
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    Expert Consultant
                  </span>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg blur opacity-50"></div>
                  <div className="relative bg-white rounded-lg overflow-hidden">
                    <img 
                      src="/images/founder/elephant-sanctuary.jpg" 
                      alt="Volunteering at an Elephant Sanctuary in Chiang Mai, Thailand"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-0 right-0 bg-white/90 text-xs rounded-bl-lg p-2 font-semibold">
                      TICO LICENSED
                      <div className="flex justify-center mt-1">
                        <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full border border-yellow-500"></span>
                      </div>
                    </div>
                    <div className="p-3 bg-black/70 text-white text-sm absolute bottom-0 w-full">
                      Volunteering at an Elephant Sanctuary in Chiang Mai, Thailand
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <SnowbirdDestinationShowcase />
      
      {/* Snowbird Resources Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-3">
              ESSENTIAL RESOURCES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Snowbird Tools</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Everything Canadian snowbirds need to plan their perfect winter escape
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Destination Finder Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex p-3 rounded-full bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Destination Finder Quiz</h3>
              <p className="text-gray-600 mb-4">Answer a few questions about your preferences and discover your ideal snowbird destination.</p>
              <Link href="/destination-finder" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                Find Your Match
              </Link>
            </div>
            
            {/* Provincial Health Coverage Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex p-3 rounded-full bg-red-100">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Health Coverage Tool</h3>
              <p className="text-gray-600 mb-4">Compare provincial health insurance coverage limits while traveling abroad.</p>
              <Link href="/health-coverage" className="inline-block px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors">
                Check Coverage
              </Link>
            </div>
            
            {/* Snowbird Toolkit Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex p-3 rounded-full bg-green-100">
                <Compass className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Snowbird Toolkit</h3>
              <p className="text-gray-600 mb-4">Essential checklists, guides and resources to prepare for your extended stay abroad.</p>
              <Link href="/snowbird-toolkit" className="inline-block px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors">
                Get Toolkit
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Navigation Selector - Helps users quickly find different types of content */}
      <NavigationSelector />
      
      {/* Snowbird Toolkit Lead Magnet */}
      <div className="container mx-auto px-4 py-12">
        <InstantGuideForm 
          title="Get Your Free Snowbird Departure Checklist"
          description="The ultimate checklist for Canadians preparing to spend the winter abroad"
          guideName="The Ultimate Canadian Snowbird Departure Checklist"
          guideValue="$9.99 VALUE"
          bgColor="bg-gradient-to-r from-blue-700 to-blue-500"
          ctaText="DOWNLOAD NOW"
        />
      </div>
      
      {/* Secondary Section: Immersive Experiences */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold mb-3">
              ALSO AVAILABLE
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Discover Our Immersive Experiences</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Beyond snowbird destinations, explore our curated collection of immersive travel experiences
            </p>
          </div>
          
          <ImmersiveExperiencesShowcase />
          
          <div className="text-center mt-8">
            <Link href="/immersive-experiences" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors">
              Explore All Immersive Experiences
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
