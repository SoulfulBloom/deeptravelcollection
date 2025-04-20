import React, { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useFonts } from "@/components/ui/fonts";
import { ChevronRight, Globe, Compass, Users, Utensils, MapPin } from "lucide-react";
import ItineraryPreview from "@/components/ItineraryPreview";
import SampleItinerary from "@/components/SampleItinerary";
import ComingItineraries from "@/components/ComingItineraries";
import ImmersiveExperiencesShowcase from "@/components/experiences/ImmersiveExperiencesShowcase";
import RegionGridSection, { regions, sampleDestinations } from "@/components/experiences/RegionGridSection";
import PopularDestinationsSection from "@/components/experiences/PopularDestinationsSection";
import { GuidePurchaseCard } from "@/components/GuidePurchaseCard";

// Define interface for destination
interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  slug: string;
  region: string;
}

// Import the DestinationCard component from RegionGridSection
const DestinationCard = ({ destination }: { destination: Destination }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={destination.image} 
          alt={`${destination.name}, ${destination.country}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center text-white">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{destination.country}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{destination.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
        <Link 
          href={`/immersive-experiences/destination/${destination.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          View immersive guide
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default function ImmersiveExperiencesPage() {
  const { heading } = useFonts();
  // Get URL parameters to handle different routes
  const params = useParams();
  
  // Parse route parameters
  const region = params?.region;
  const destination = params?.destination;
  const theme = params?.theme;
  
  useEffect(() => {
    // Set page title based on params
    let title = "Immersive Travel Experiences | Deep Travel Collections";
    
    if (region) {
      const regionName = regions.find(r => r.name.toLowerCase().replace(/\s+/g, '-') === region)?.displayName || region;
      title = `${regionName} Travel Experiences | Deep Travel Collections`;
    }
    else if (destination) {
      const destinationName = sampleDestinations.find(d => d.slug === destination)?.name || destination;
      title = `${destinationName} Immersive Guide | Deep Travel Collections`;
    }
    else if (theme) {
      title = `${theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Travel Experiences | Deep Travel Collections`;
    }
    
    document.title = title;
    window.scrollTo(0, 0);
  }, [region, destination, theme]);

  // Determine if we should render specific content based on parameters
  const renderSpecificContent = region || destination || theme;
  
  // Helper to get header text based on params
  const getHeaderText = () => {
    if (region) {
      const regionObj = regions.find(r => r.name.toLowerCase().replace(/\s+/g, '-') === region);
      return {
        title: `${regionObj?.displayName || region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Immersive Experiences`,
        subtitle: regionObj?.description || "Explore authentic local experiences in this region"
      };
    }
    else if (destination) {
      const destinationObj = sampleDestinations.find(d => d.slug === destination);
      return {
        title: `${destinationObj?.name || destination.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Immersive Guide`,
        subtitle: destinationObj?.description || "Authentic local experiences and cultural immersion"
      };
    }
    else if (theme) {
      return {
        title: `${theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Experiences`,
        subtitle: "Curated experiences focused on authentic cultural connections"
      };
    }
    
    return {
      title: "Immersive Travel Experiences",
      subtitle: "Go beyond typical tourism with our curated collection of authentic local experiences, cultural immersions, and meaningful connections that transform your journey."
    };
  };
  
  const headerContent = getHeaderText();
  
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/experiences/immersive-pattern.jpg')] bg-center"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Only show this on main page */}
            {!renderSpecificContent && (
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-6">
                AUTHENTIC TRAVEL EXPERIENCES
              </span>
            )}
            
            {/* Show back link for specific pages */}
            {renderSpecificContent && (
              <Link href="/immersive-experiences" className="inline-flex items-center text-white/80 hover:text-white mb-6">
                <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                Back to All Immersive Experiences
              </Link>
            )}
            
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${heading}`}>
              {headerContent.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              {headerContent.subtitle}
            </p>
            
            {/* Only show these buttons on main page */}
            {!renderSpecificContent && (
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="#collections" className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-white/90 transition-colors">
                  Browse Experience Collections
                </Link>
                <Link href="#itineraries" className="px-6 py-3 bg-indigo-700/50 text-white border border-white/30 rounded-lg font-medium hover:bg-indigo-700/70 transition-colors">
                  View Sample Itineraries
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditional content rendering based on URL parameters */}
      {destination ? (
        // Single Destination View
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Full Destination Content would be loaded here from backend */}
              <div className="mb-12">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                  <div className="h-80 overflow-hidden relative">
                    <img 
                      src={sampleDestinations.find(d => d.slug === destination)?.image || "/images/destinations/default.jpg"}
                      alt={destination.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent/10 flex items-end">
                      <div className="p-6 text-white">
                        <div className="flex items-center mb-2">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span className="font-medium">
                            {sampleDestinations.find(d => d.slug === destination)?.country || "Destination Country"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">About This Immersive Experience</h2>
                    <p className="text-gray-600 mb-6">
                      This immersive guide is designed to help you experience {destination.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} like a local, 
                      with authentic cultural experiences, hidden spots known only to residents, and meaningful connections with the community.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Cultural Highlights</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Local festivals and celebrations</li>
                          <li>Traditional art and craft workshops</li>
                          <li>Heritage sites with local significance</li>
                          <li>Community gathering spots</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Authentic Experiences</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Home cooking with local families</li>
                          <li>Traditional skill learning opportunities</li>
                          <li>Language exchange meetups</li>
                          <li>Neighborhood walking routes</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-xl font-bold mb-4 text-center">Get Your Immersive Experience Guide</h3>
                      <GuidePurchaseCard 
                        guideId={destination}
                        title={`${destination.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Immersive Guide`}
                        description="Experience authentic cultural immersion with our expertly crafted 7-day guide, including hidden gems, local experiences, and cultural insights."
                        price={15.99}
                        imageUrl={sampleDestinations.find(d => d.slug === destination)?.image || "/images/destinations/default.jpg"}
                        guideType="immersive"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Similar Destinations */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Similar Destinations You Might Enjoy</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {sampleDestinations
                    .filter(d => d.slug !== destination && d.region === sampleDestinations.find(dest => dest.slug === destination)?.region)
                    .slice(0, 3)
                    .map(dest => (
                      <div key={dest.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-40 overflow-hidden">
                          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900">{dest.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{dest.description}</p>
                          <Link href={`/immersive-experiences/destination/${dest.slug}`} className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            View guide
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : region ? (
        // Region Specific View
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Destinations in {region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Discover immersive experiences in {region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} that connect you with local culture
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {sampleDestinations
                  .filter(d => d.region.toLowerCase().replace(/\s+/g, '-') === region)
                  .map(dest => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                    />
                  ))}
              </div>
              
              {/* If no destinations found for this region */}
              {sampleDestinations.filter(d => d.region.toLowerCase().replace(/\s+/g, '-') === region).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">No destinations found for this region yet.</p>
                  <p className="mt-2">Check back soon as we're constantly adding new immersive experiences.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : theme ? (
        // Theme Specific View
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Experiences
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Discover destinations featuring {theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} immersive experiences
                </p>
              </div>
              
              {/* In a real implementation, we would filter destinations by theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {sampleDestinations
                  .slice(0, 6) // Just show some sample destinations for now
                  .map(dest => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Main Page View - only show these sections on the main immersive experiences page
        <>
          {/* Experience Types Grid */}
          <div className="bg-white py-16" id="collections">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mb-3">
                  EXPERIENCE COLLECTIONS
                </span>
                <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${heading}`}>
                  Types of Immersive Experiences
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Our immersive travel experiences are organized into themed collections, each offering a unique way to connect with local cultures and communities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Cultural Immersion Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src="/images/experiences/cultural-immersion.jpg" 
                      alt="Cultural immersion experiences" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                      <div className="bg-indigo-600 rounded-full p-2 inline-block">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Immersion</h3>
                    <p className="text-gray-600 mb-4">
                      Connect with local traditions, festivals, ceremonies, and community events that reveal the authentic heart of a destination.
                    </p>
                    <Link href="/immersive-experiences/theme/cultural-immersion" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                      Explore cultural experiences
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Local Living Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src="/images/experiences/local-living.jpg" 
                      alt="Local living experiences" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                      <div className="bg-green-600 rounded-full p-2 inline-block">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Local Living</h3>
                    <p className="text-gray-600 mb-4">
                      Experience daily life through homestays, community engagement, and activities that connect you with residents.
                    </p>
                    <Link href="/immersive-experiences/theme/local-living" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                      Discover local living
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Food Journeys Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src="/images/experiences/food-culinary.jpg" 
                      alt="Food journey experiences" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                      <div className="bg-amber-600 rounded-full p-2 inline-block">
                        <Utensils className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Food & Culinary</h3>
                    <p className="text-gray-600 mb-4">
                      Discover authentic flavors through market tours, cooking classes, home dining, and food traditions beyond tourist restaurants.
                    </p>
                    <Link href="/immersive-experiences/theme/food" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                      Explore food journeys
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Language & Connection Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src="/images/experiences/language-connection.jpg" 
                      alt="Language and cultural connection experiences" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                      <div className="bg-purple-600 rounded-full p-2 inline-block">
                        <Compass className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Language & Connection</h3>
                    <p className="text-gray-600 mb-4">
                      Break down barriers through basic language learning, cultural workshops, and meaningful exchange programs.
                    </p>
                    <Link href="/immersive-experiences/theme/language-cultural" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                      Discover connection programs
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Showcase Component */}
          <ImmersiveExperiencesShowcase />
          
          {/* Popular Destinations Section - New Component */}
          <PopularDestinationsSection />
          
          {/* Destinations by Region */}
          <div className="py-12 md:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mb-3">
                  EXPLORE BY REGION
                </span>
                <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${heading}`}>
                  Immersive Experiences By Region
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Discover authentic experiences organized by geographic region
                </p>
              </div>
              
              {/* Region Grid Sections */}
              {regions.map((region) => (
                <RegionGridSection 
                  key={region.name}
                  title={`${region.displayName} Experiences`}
                  region={region.name}
                  destinations={sampleDestinations}
                />
              ))}
            </div>
          </div>
          
          {/* Itinerary Preview & Sample Section */}
          <div id="itineraries">
            <ItineraryPreview />
            <SampleItinerary />
          </div>
          
          {/* Coming Itineraries */}
          <ComingItineraries />
        </>
      )}
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${heading}`}>
            Ready to Experience Travel on a Deeper Level?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto">
            Explore our premium guides that combine immersive local experiences with practical travel planning to create truly memorable journeys.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/destinations" className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-white/90 transition-colors">
              Browse All Destinations
            </Link>
            <Link href="/immersive-experiences/custom" className="px-6 py-3 bg-indigo-500 text-white border border-white/30 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
              Create Custom Experience
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}