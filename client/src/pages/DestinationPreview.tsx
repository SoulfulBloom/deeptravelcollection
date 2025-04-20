import { useParams } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFonts } from "@/components/ui/fonts";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Download, Tag, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Destination, type Itinerary, type Day, type EnhancedExperience } from "@shared/schema";
import { Link } from "wouter";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import DestinationLocation from "@/components/DestinationLocation";
import PremiumItineraryShowcase from "@/components/PremiumItineraryShowcase";

export default function DestinationPreview() {
  const { id } = useParams();
  const { heading } = useFonts();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch destination details
  const { data: destination, isLoading: isLoadingDestination } = useQuery<Destination>({
    queryKey: [`/api/destinations/${id}`],
    enabled: !!id,
  });
  
  // Fetch itinerary data
  const { data: itinerary, isLoading: isLoadingItinerary } = useQuery<Itinerary>({
    queryKey: [`/api/destinations/${id}/itinerary`],
    enabled: !!id,
  });
  
  // Fetch itinerary days
  const { data: days, isLoading: isLoadingDays } = useQuery<Day[]>({
    queryKey: [`/api/itineraries/${itinerary?.id}/days`],
    enabled: !!itinerary?.id,
  });
  
  // Fetch enhanced experiences
  const { data: experiences, isLoading: isLoadingExperiences } = useQuery<EnhancedExperience[]>({
    queryKey: [`/api/destinations/${id}/enhanced-experiences`],
    enabled: !!id,
  });
  
  // Premium showcase data - this is static and consistent across all destinations
  const premiumShowcaseData = {
    cityName: "Kyoto",
    countryName: "Japan",
    days: [
      {
        dayNumber: 1,
        title: "Cultural Immersion in Ancient Kyoto",
        activities: [
          "Morning: Visit Fushimi Inari Shrine early (6-8am) to experience the iconic torii gates without crowds. Follow the mountain path to Yotsutsuji intersection for panoramic city views.",
          "Afternoon: Explore Gion district with a guided walking tour through traditional teahouses and geisha streets. Visit Yasaka Shrine and stroll through Maruyama Park.",
          "Evening: Participate in a traditional tea ceremony at Camellia tea ceremony experience, followed by dinner at a local izakaya with seasonal Kyoto specialties."
        ]
      },
      {
        dayNumber: 2,
        title: "Temples and Zen Gardens",
        activities: [
          "Morning: Visit Kinkaku-ji (Golden Pavilion) at opening time (9am) to appreciate the gold-leaf temple reflecting in the mirror pond before crowds arrive.",
          "Afternoon: Explore the Arashiyama Bamboo Grove and visit Tenryu-ji Temple, a UNESCO World Heritage site with one of Japan's finest zen gardens.",
          "Evening: Experience a traditional kaiseki multi-course dinner featuring local seasonal ingredients at a riverside restaurant with views of traditional cormorant fishing."
        ]
      }
    ],
    experiences: [
      {
        id: 999,
        destinationId: 999,
        title: "Traditional Machiya Cooking Class",
        specificLocation: "Northern Higashiyama District",
        type: "Culinary",
        description: "Learn to prepare authentic Kyoto cuisine in a 100-year-old machiya (wooden townhouse). The class begins with a guided tour of Nishiki Market to select fresh, seasonal ingredients.",
        personalNarrative: "The machiya's worn wooden floors and paper screens transported me to another era. Our teacher, Akiko-san, shared family recipes passed down through generations.",
        seasonalTips: "Spring classes feature sakura (cherry blossom) themed dishes, while autumn includes matsutake mushroom preparation when in season."
      },
      {
        id: 998,
        destinationId: 998,
        title: "Meditation with Zen Buddhist Monks",
        specificLocation: "Kodai-ji Temple",
        type: "Cultural",
        description: "Join resident monks at this 400-year-old temple for an authentic Zen meditation session. The experience begins with a brief introduction to Zen philosophy and meditation techniques.",
        personalNarrative: "The absolute stillness was initially uncomfortable – both physically and mentally. As minutes passed, the monk's occasional gentle correction of my posture helped me settle.",
        seasonalTips: "Winter sessions are held in a heated room but still require warm clothing. Summer sessions take place in early morning to avoid heat."
      }
    ]
  };
  
  if (isLoadingDestination || !destination) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full mb-8" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }
  
  // Function to get day of the week
  const getDayOfWeek = (index: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[index % 7];
  };

  // Function to get activities for a day
  const getActivityForPeriod = (day: Day, period: number): string => {
    if (!day.activities || day.activities.length === 0) {
      return "Activity details not available";
    }
    return day.activities[period] || "Activity details not available";
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Back button */}
      <div className="mb-4">
        <Link href={`/destinations`}>
          <Button variant="ghost" className="flex items-center text-neutral-600 hover:text-neutral-900 px-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Destinations
          </Button>
        </Link>
      </div>
      
      {/* Preview Banner */}
      <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-lg mb-6">
        <p className="text-center font-semibold">
          This is a preview of the destination itinerary. To access the full PDF itinerary with all details, purchase and download the complete guide.
        </p>
      </div>
      
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img 
          src={destination.imageUrl} 
          alt={`${destination.name}, ${destination.country}`} 
          className="w-full h-[300px] sm:h-[400px] object-cover" 
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex flex-wrap items-end justify-between">
            <div>
              <h1 className={`${heading} text-2xl sm:text-4xl font-bold text-white mb-2`}>
                {destination.name}, {destination.country}
              </h1>
              <div className="text-white/90 mb-1">
                <DestinationLocation 
                  regionId={destination.regionId} 
                  country={destination.country} 
                  name={destination.name} 
                  compact={true} 
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              <Link href={`/destinations/${id}`}>
                <Button className="flex items-center bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Get Full Itinerary
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary Preview</TabsTrigger>
          <TabsTrigger value="experiences">Local Experiences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className={`${heading} text-xl font-bold mb-4`}>Destination Overview</h2>
          <p className="text-neutral-700 mb-6 whitespace-pre-line">{destination.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Recommended Duration</h3>
              </div>
              <p>7 Days</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Ideal For</h3>
              </div>
              <p>Couples, Families, Solo Travelers</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Tag className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Budget Range</h3>
              </div>
              <p>$$ - $$$</p>
            </div>
          </div>
          
          {/* PDF Preview Section */}
          <div className="border rounded-lg p-4 bg-blue-50 mb-6">
            <h3 className={`${heading} text-lg font-semibold mb-3 text-center`}>Preview of the PDF Itinerary</h3>
            <div className="relative">
              <div className="h-72 overflow-hidden rounded-lg border-4 border-white shadow-lg">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 pointer-events-none">
                  <div className="bg-white/80 p-4 rounded-lg shadow-md">
                    <p className="text-lg font-medium text-blue-800">PDF Preview</p>
                    <p className="text-sm text-blue-600 mb-3">Get the full unblurred version with your download</p>
                    <Download className="h-8 w-8 text-primary mx-auto animate-bounce" />
                  </div>
                </div>
                
                {/* PDF Content Preview */}
                <div className="w-full h-full bg-white p-4 overflow-hidden">
                  <div className="border-b pb-2 mb-3">
                    <h2 className={`${heading} text-xl font-bold text-primary`}>Premium Itinerary Sample</h2>
                    <p className="text-gray-600 text-sm">7-Day Complete Travel Guide</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center">
                      <Calendar className="text-primary h-4 w-4 mr-1" />
                      <p className="text-xs">Day-by-Day Itinerary</p>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="text-primary h-4 w-4 mr-1" />
                      <p className="text-xs">Interactive Maps</p>
                    </div>
                  </div>
                  
                  <div className="border rounded p-2 bg-gray-50 mb-2">
                    <p className="text-xs font-medium">Day 1: {premiumShowcaseData.days[0].title}</p>
                    <div className="border-l-2 border-primary pl-2 mt-1">
                      <p className="text-xs text-gray-700 truncate">{premiumShowcaseData.days[0].activities[0]}</p>
                    </div>
                  </div>
                  
                  <div className="border rounded p-2 bg-gray-50">
                    <p className="text-xs font-medium">Day 2: {premiumShowcaseData.days[1].title}</p>
                    <div className="border-l-2 border-amber-500 pl-2 mt-1">
                      <p className="text-xs text-gray-700 truncate">{premiumShowcaseData.days[1].activities[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <Link href={`/destinations/${id}`}>
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Get Unblurred Full Itinerary
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className={`${heading} text-lg font-semibold mb-3`}>What's Included in the Full Itinerary</h3>
            <ul className="list-disc pl-5 space-y-2 text-neutral-700">
              <li>Complete day-by-day 7-day itinerary with morning, afternoon, and evening activities</li>
              <li>Five curated restaurant recommendations with price range and cuisine type</li>
              <li>Accommodation options across different budgets</li>
              <li>Transportation tips and local travel advice</li>
              <li>Authentic local experiences with personal narratives</li>
              <li>Cultural notes and important travel insights</li>
              <li>Detailed packing recommendations</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="itinerary" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className={`${heading} text-xl font-bold mb-4`}>Premium Itinerary Preview</h2>
          
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p><strong>Example Premium Itinerary:</strong> This preview showcases the quality and depth of our premium content. Your itinerary will feature this same level of detail for your chosen destination.</p>
            </div>
          </div>

          {/* Static premium itinerary showcase that's the same across all destinations */}
          <PremiumItineraryShowcase 
            cityName="Kyoto"
            countryName="Japan"
          />
          
          <div className="mt-8 flex justify-center">
            <Link href={`/destinations/${id}`}>
              <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5">
                <Download className="h-4 w-4 mr-2" />
                Get the Full Itinerary
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="experiences" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className={`${heading} text-xl font-bold mb-4`}>Authentic Local Experiences</h2>

          {isLoadingExperiences ? (
            <div className="py-10">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-neutral-600">Loading experiences...</p>
              </div>
            </div>
          ) : !experiences || experiences.length === 0 ? (
            <div className="py-10">
              <div className="text-center space-y-4">
                <p className="text-neutral-600">Sorry, we couldn't load the enhanced experiences for this destination.</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="mx-auto"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p><strong>Authentic Local Experiences:</strong> These are real experiences curated for {destination.name}. Your premium guide will include the full details for each of these unique activities.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {experiences.map((experience) => (
                  <div key={experience.id} className="border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`${heading} text-lg font-semibold mb-2`}>{experience.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {experience.season || 'Year-round'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-500 mb-3">
                      <MapPin className="text-[#F97316] h-4 w-4 mr-1" />
                      <span>{experience.specificLocation}</span>
                    </div>
                    <p className="text-neutral-700 mb-4">
                      {experience.description?.substring(0, 200)}...
                    </p>
                    
                    {experience.personalNarrative && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                        <p className="text-neutral-700 italic">"{experience.personalNarrative.substring(0, 150)}..."</p>
                      </div>
                    )}
                    
                    {experience.localTip && (
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <h4 className="font-medium text-amber-800 mb-1 text-sm">Local Tip</h4>
                        <p className="text-amber-700 text-sm">{experience.localTip}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="mt-8">
                  <Link href={`/destinations/${id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                      <Download className="h-4 w-4 mr-2" />
                      Get the Full Premium Guide with All Experiences
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 text-center text-white mb-8">
        <h2 className={`${heading} text-2xl sm:text-3xl font-bold mb-3`}>Ready to Explore {destination.name}?</h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Get the complete 7-day itinerary with restaurant recommendations, accommodation tips, local experiences, and much more!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/destinations/${id}`}>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Download Full Itinerary
            </Button>
          </Link>
          <Link href="/subscribe">
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              Subscribe for All Destinations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}