import { Link } from "wouter";
import { useFonts } from "./ui/fonts";
import { Button } from "./ui/button";
import { Download, MapPin, Star, Eye, FileText } from "lucide-react";
import { type Destination } from "@shared/schema";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { type Day, type EnhancedExperience } from "@shared/schema";
import { CalendarDays, Clock, Hotel, Landmark, Utensils } from "lucide-react";

// Function to validate and get appropriate image URL
const getValidImageUrl = (name: string, country: string, imageUrl: string | null): string => {
  console.log(`Getting image for ${name}, ${country}, imageUrl: ${imageUrl}`);
  
  // Image URL override map for problematic destinations
  const imageOverrides: Record<string, string> = {
    "Algarve": "/images/destinations/algarve-portugal.jpg",
    "San Jose": "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1695&q=80"
  };
  
  // Hard override for Algarve (case insensitive)
  if (name.toLowerCase() === "algarve") {
    console.log("Using Algarve image override - local image");
    return "/images/destinations/algarve-portugal.jpg";
  }
  
  // Check if we have an override for this destination
  if (name in imageOverrides) {
    console.log(`Using override for ${name}`);
    return imageOverrides[name];
  }
  
  // Otherwise, use the provided URL or a fallback
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  
  // Last resort fallback: Use a generic image based on region/country
  return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(name + ' ' + country)}`;
};
import SeasonalTag from "./SeasonalTag";

type DestinationCardProps = {
  destination: Destination;
  featured: boolean;
};

export default function DestinationCard({ destination, featured }: DestinationCardProps) {
  const { heading } = useFonts();
  const { id, name, country, imageUrl, description, immersiveDescription, rating, downloadCount, regionId } = destination;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Premium showcase data - this is static and consistent across all destinations
  // We're showing a consistent high-quality example regardless of the destination
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
  
  // Get region name based on region ID
  const getRegionName = (regionId: number | null) => {
    if (!regionId) return "Unknown";
    
    const regionsMap: Record<number, string> = {
      13: "Europe",
      14: "Asia",
      15: "North America",
      16: "South America",
      17: "Africa",
      18: "Oceania"
    };
    return regionsMap[regionId] || "Unknown";
  };
  
  // Featured card (larger)
  const renderFeaturedCard = () => (
    <div className="destination-card group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div 
        className="relative h-60 w-full overflow-hidden cursor-pointer"
        onClick={() => window.location.href = `/destinations/${id}`}
      >
        <img 
          src={getValidImageUrl(name, country, imageUrl)} 
          alt={`${name}, ${country}`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute top-0 right-0 m-2 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-semibold text-primary">
          7-day itinerary
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 
              className={`text-xl font-bold text-neutral-900 ${heading} cursor-pointer hover:text-primary`}
              onClick={() => window.location.href = `/destinations/${id}`}
            >{name}, {country}</h3>
            <p className="text-sm text-neutral-500 mt-1">{description ? description.split(',')[0] : 'Explore this destination'}</p>
          </div>
          <div className="flex items-center">
            <Star className="text-yellow-400 h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-semibold">{rating}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-neutral-500">
          <MapPin className="text-[#F97316] h-4 w-4 mr-2" />
          <span>{getRegionName(regionId)}</span>
          
          {/* Seasonal Tag for Best Time to Visit */}
          <div className="ml-auto">
            <SeasonalTag destinationId={id} />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-primary mb-1 flex items-center">
            <span className="mr-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"></path>
              </svg>
            </span>
            Authentic Cultural Immersion
          </h4>
          <div className="text-sm text-neutral-600 line-clamp-4">
            {immersiveDescription || description || 'Discover the wonders of this remarkable destination with our comprehensive 7-day itinerary.'}
          </div>
        </div>
        
        {/* PDF Preview section */}
        <div className="mt-4 border rounded-lg p-3 bg-blue-50/50 relative overflow-hidden cursor-pointer" 
             onClick={() => setIsDialogOpen(true)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                <FileText className="h-4 w-4 mr-1 text-primary" />
                PDF Itinerary Preview
              </h4>
              <p className="text-xs text-blue-600 mt-1">
                7-day itinerary with detailed daily plans
              </p>
            </div>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
              variant="outline" 
              size="sm" 
              className="flex items-center bg-white/80 hover:bg-white border-blue-200 text-blue-600"
            >
              <Eye className="h-3 w-3 mr-1" /> Preview
            </Button>
          </div>
          <div className="absolute bottom-0 right-0 -mb-1 -mr-1 opacity-10">
            <FileText className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="text-primary font-semibold">
            {downloadCount && downloadCount > 500 ? 
              `${Math.floor(downloadCount / 100) * 10}+ downloads` : 
              downloadCount && downloadCount > 100 ? 
                `${Math.floor(downloadCount / 10) * 5}+ downloads` : 
                downloadCount && downloadCount > 0 ? 
                  `${downloadCount}+ downloads` : 
                  "New itinerary"}
          </span>
          <div className="flex gap-2">
            <Link href={`/destinations/${id}`}>
              <Button 
                size="sm" 
                className="flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/destinations/${id}`;
                }}
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Compact card (smaller)
  const renderCompactCard = () => (
    <div className="destination-card group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div 
        className="relative h-48 w-full overflow-hidden cursor-pointer"
        onClick={() => window.location.href = `/destinations/${id}`}
      >
        <img 
          src={getValidImageUrl(name, country, imageUrl)} 
          alt={`${name}, ${country}`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="p-4">
        <h3 
          className={`text-lg font-bold text-neutral-900 ${heading} cursor-pointer hover:text-primary`}
          onClick={() => window.location.href = `/destinations/${id}`}
        >{name}, {country}</h3>
        <div className="mt-2 flex items-center text-sm text-neutral-500">
          <MapPin className="text-[#F97316] h-4 w-4 mr-2" />
          <span>{getRegionName(regionId)}</span>
          
          {/* Seasonal Tag for Compact Card - Best Time to Visit */}
          <div className="ml-auto">
            <SeasonalTag destinationId={id} compact={true} />
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-xs font-semibold text-primary mb-1 flex items-center">
            <span className="mr-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"></path>
              </svg>
            </span>
            Authentic Immersion
          </div>
          <div className="text-xs text-neutral-600 line-clamp-2">
            {immersiveDescription || description || 'Discover the wonders of this remarkable destination with our comprehensive 7-day itinerary.'}
          </div>
        </div>
        
        {/* Compact PDF Preview section */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-3 w-3 text-primary mr-1" />
            <span className="text-xs text-neutral-600">7-day itinerary</span>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            variant="outline" 
            size="sm" 
            className="flex items-center text-blue-600 text-xs px-2 py-1 h-auto border-blue-200"
          >
            <Eye className="h-3 w-3 mr-1" /> Preview
          </Button>
        </div>
        
        <div className="mt-2 flex items-center justify-end">
          <div className="flex gap-1">
            <Link href={`/destinations/${id}`}>
              <Button 
                variant="link" 
                size="sm" 
                className="text-primary hover:text-blue-700 p-0 h-auto flex items-center" 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/destinations/${id}`;
                }}
              >
                <Download className="h-3 w-3 mr-1" /> Download
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* PDF Preview Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              <span className={heading}>Premium Itinerary Sample</span>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Example of our premium itinerary quality. Your {name} guide will feature the same level of detail and premium content.
            </p>
          </DialogHeader>
          
          <div className="mt-4">
            {/* PDF-like container with blurred content */}
            <div className="bg-white rounded-lg border shadow-lg p-6 relative">
              {/* Very slight blur overlay */}
              <div className="absolute inset-0 bg-white/15 backdrop-blur-[0.5px] flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="bg-white/90 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-blue-800">Premium Sample</p>
                  <p className="text-sm text-blue-600 mb-3">Get the full version with your download</p>
                  <Download className="h-8 w-8 text-primary mx-auto animate-bounce" />
                </div>
              </div>
              
              {/* PDF Header */}
              <div className="border-b pb-4 mb-6">
                <h1 className={`text-3xl font-bold ${heading} text-primary`}>
                  {name}, {country}
                </h1>
                <p className="text-gray-600 mt-2">7-Day Complete Travel Guide</p>
              </div>
              
              {/* Overview */}
              <div className="mb-6">
                <h2 className={`text-xl font-semibold ${heading} mb-3`}>What's Inside This Guide:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <CalendarDays className="text-primary mt-1 h-5 w-5" />
                    <div className="ml-3">
                      <h3 className="font-medium">Day-by-Day Detailed Itinerary</h3>
                      <p className="text-sm text-gray-600">Complete daily schedules with time estimates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-primary mt-1 h-5 w-5" />
                    <div className="ml-3">
                      <h3 className="font-medium">Interactive Maps</h3>
                      <p className="text-sm text-gray-600">Detailed location maps for each attraction</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Daily Itinerary Section */}
              <div className="mb-6">
                <h2 className={`text-xl font-semibold ${heading} mb-3`}>Daily Itinerary:</h2>
                
                {/* Show Day 1 */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className={`text-lg font-bold ${heading}`}>
                    Day {premiumShowcaseData.days[0].dayNumber}: {premiumShowcaseData.days[0].title}
                  </h3>
                  <div className="mt-3 space-y-3">
                    {/* Show morning, afternoon, evening activities */}
                    {['Morning', 'Afternoon', 'Evening'].map((period, index) => {
                      return (
                        <div key={index} className="bg-white rounded p-3 shadow-sm">
                          <div className="flex items-start">
                            <Clock className="text-primary mt-1 h-4 w-4 flex-shrink-0" />
                            <div className="ml-2">
                              <p className="font-semibold">{period}</p>
                              <p>
                                {premiumShowcaseData.days[0].activities[index] || `${period} activity in Kyoto`}
                              </p>
                              {index === 0 && (
                                <p className="text-sm text-gray-600 mt-1 italic">
                                  Tip: Many shrines open earlier for visitors - arrive early to beat the crowds
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Show a bit of day 2 */}
                <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                  <h3 className={`text-lg font-bold ${heading}`}>
                    Day {premiumShowcaseData.days[1].dayNumber}: {premiumShowcaseData.days[1].title}
                  </h3>
                  <div className="mt-3">
                    <div className="bg-white rounded p-3 shadow-sm">
                      <div className="flex items-start">
                        <Clock className="text-primary mt-1 h-4 w-4 flex-shrink-0" />
                        <div className="ml-2">
                          <p className="font-semibold">Morning</p>
                          <p>{premiumShowcaseData.days[1].activities[0]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Authentic Local Experiences */}
              <div className="mb-6">
                <h2 className={`text-xl font-semibold ${heading} mb-3`}>Authentic Local Experiences:</h2>
                <div className="space-y-4">
                  {/* Experience 1 */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Utensils className="text-primary h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{premiumShowcaseData.experiences[0].title}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1 mb-2">
                          <MapPin className="h-3 w-3 mr-1 text-primary" />
                          {premiumShowcaseData.experiences[0].specificLocation}
                        </p>
                        <p className="text-sm">
                          {premiumShowcaseData.experiences[0].description}
                        </p>
                        <div className="mt-3 bg-primary/5 p-3 rounded-lg">
                          <p className="text-sm italic text-gray-600">
                            <span className="text-primary font-semibold">Personal Experience:</span> {premiumShowcaseData.experiences[0].personalNarrative}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Restaurant Recommendations */}
              <div className="mb-6">
                <h2 className={`text-xl font-semibold ${heading} mb-3`}>Restaurant Recommendations:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-bold">Gion Karyo</h3>
                    <p className="text-sm text-neutral-500">Traditional Kyoto cuisine</p>
                    <p className="text-sm mt-2">Exceptional kaiseki in a tranquil setting with garden views. Seasonal ingredients prepared with meticulous attention to detail.</p>
                    <div className="flex items-center mt-2">
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-bold">Nishiki Warai</h3>
                    <p className="text-sm text-neutral-500">Casual izakaya</p>
                    <p className="text-sm mt-2">Affordable local favorite offering hearty portions of Kyoto specialties including hamo (pike conger) and yuba (tofu skin).</p>
                    <div className="flex items-center mt-2">
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <Star className="text-neutral-300 h-3 w-3 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Accommodation Options */}
              <div className="mb-6">
                <h2 className={`text-xl font-semibold ${heading} mb-3`}>Accommodation Options:</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Hotel className="text-primary h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">Tawaraya Ryokan</h3>
                      <p className="text-sm text-neutral-500">Historic luxury ryokan ($$$$)</p>
                      <p className="text-sm mt-1">One of Kyoto's finest traditional inns with impeccable service, authentic tatami rooms, and traditional kaiseki meals.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {featured ? renderFeaturedCard() : renderCompactCard()}
    </>
  );
}