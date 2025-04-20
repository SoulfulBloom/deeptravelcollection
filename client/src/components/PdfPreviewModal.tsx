import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Eye, Download, CalendarDays, MapPin, Utensils, Clock, Hotel, Landmark } from "lucide-react";
import { useFonts } from "./ui/fonts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { type Day, type EnhancedExperience } from "@shared/schema";

interface PdfPreviewModalProps {
  destinationName: string;
  country: string;
  destinationId: number;
}

interface ItineraryData {
  days: Day[];
}

export default function PdfPreviewModal({ destinationName, country, destinationId }: PdfPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { heading } = useFonts();
  
  // We're showing a consistent high-quality example regardless of the destination
  // No need to fetch specific destination data for the preview
  
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
        description: "Learn to prepare authentic Kyoto cuisine in a 100-year-old machiya (wooden townhouse). The class begins with a guided tour of Nishiki Market to select fresh, seasonal ingredients. Under the guidance of a local chef, master traditional Kyo-ryori dishes including dashi stock, seasonal vegetable preparations, and yudofu (hot tofu). The intimate class (maximum 6 participants) concludes with a meal in the townhouse's traditional dining room overlooking a small Japanese garden.",
        personalNarrative: "The machiya's worn wooden floors and paper screens transported me to another era. Our teacher, Akiko-san, shared family recipes passed down through generations. The subtle flavors of the dashi stock we made from scratch revealed why Kyoto cuisine is renowned for its delicate taste. Beyond just cooking techniques, Akiko-san explained the philosophy of Japanese seasonal eating and the cultural significance of each dish we prepared.",
        seasonalTips: "Spring classes feature sakura (cherry blossom) themed dishes, while autumn includes matsutake mushroom preparation when in season. Winter classes focus on hot pot dishes that are perfect for cold Kyoto days."
      },
      {
        id: 998,
        destinationId: 998,
        title: "Meditation with Zen Buddhist Monks",
        specificLocation: "Kodai-ji Temple",
        type: "Cultural",
        description: "Join resident monks at this 400-year-old temple for an authentic Zen meditation session. The experience begins with a brief introduction to Zen philosophy and meditation techniques. Participants then engage in two 20-minute zazen (seated meditation) sessions in the temple's meditation hall, with a walking meditation between sessions. A monk provides guidance throughout and concludes with a Q&A discussion about Buddhist practice and philosophy. The experience offers rare access to spaces typically closed to general visitors.",
        personalNarrative: "The absolute stillness was initially uncomfortable – both physically and mentally. As minutes passed, the monk's occasional gentle correction of my posture helped me settle. The sound of distant temple bells marking time created a profound connection to centuries of practice in this same space. After completion, the head monk served us matcha tea, explaining that this simple act encompasses all of Zen philosophy when performed with complete presence.",
        seasonalTips: "Winter sessions are held in a heated room but still require warm clothing. Summer sessions take place in early morning to avoid heat. During cherry blossom season, special dawn meditation sessions are available with views of the temple gardens."
      }
    ]
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="hidden">
          <Button id={`pdf-preview-trigger-${destinationId}`} variant="ghost" size="sm" className="flex items-center text-primary">
            <Eye className="h-3 w-3 mr-1" /> PDF Preview
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="pdf-preview-description">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <span className={heading}>{destinationName}, {country} - Premium Itinerary</span>
          </DialogTitle>
          <p id="pdf-preview-description" className="text-sm text-muted-foreground">
            Example of our premium itinerary quality. Your {destinationName} guide will feature this same level of detail and premium content.
          </p>
        </DialogHeader>
        
        <div className="mt-4">
          {/* PDF-like container with blurred content */}
          <div className="bg-white rounded-lg border shadow-lg p-6 relative">
            {/* Very slight blur overlay - Just enough to differentiate it from the full version */}
            <div className="absolute inset-0 bg-white/15 backdrop-blur-[0.5px] flex flex-col items-center justify-center z-10 pointer-events-none">
              <div className="bg-white/90 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-blue-800">PDF Preview</p>
                <p className="text-sm text-blue-600 mb-3">Get the full version with your download</p>
                <Download className="h-8 w-8 text-primary mx-auto animate-bounce" />
              </div>
            </div>
            
            {/* PDF Header */}
            <div className="border-b pb-4 mb-6">
              <h1 className={`text-3xl font-bold ${heading} text-primary`}>
                {destinationName}, {country}
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
                <div className="flex items-start">
                  <Utensils className="text-primary mt-1 h-5 w-5" />
                  <div className="ml-3">
                    <h3 className="font-medium">Restaurant Recommendations</h3>
                    <p className="text-sm text-gray-600">Best places to eat at each location</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Hotel className="text-primary mt-1 h-5 w-5" />
                  <div className="ml-3">
                    <h3 className="font-medium">Accommodation Options</h3>
                    <p className="text-sm text-gray-600">Suggested places to stay for all budgets</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Daily Itinerary Section */}
            <div className="mb-6">
              <h2 className={`text-xl font-semibold ${heading} mb-3`}>Daily Itinerary:</h2>
              
              {/* Use our premium showcase data */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className={`text-lg font-bold ${heading}`}>
                  Day {premiumShowcaseData.days[0].dayNumber}: Cultural Immersion Day
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
                              {index === 0 ? "Cultural heritage site exploration with local guide" : 
                               index === 1 ? "Traditional craft workshops at artisan village" : 
                               "Local cuisine dinner with cultural performance"}
                            </p>
                            {index === 0 && (
                              <p className="text-sm text-gray-600 mt-1 italic">
                                Tip: Heritage sites open earlier for visitors - arrive early to beat the crowds
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                <h3 className={`text-lg font-bold ${heading}`}>
                  Day {premiumShowcaseData.days[1].dayNumber}: Nature and Landscape Day
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
                              {index === 0 ? "Scenic hiking trail with panoramic viewpoints" : 
                               index === 1 ? "Visit to natural landmark with photography opportunities" : 
                               "Sunset viewing at recommended scenic spot"}
                            </p>
                            {index === 1 && (
                              <p className="text-sm text-gray-600 mt-1 italic">
                                Tip: This scenic location is most photogenic around 4pm when sunlight filters through
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Authentic Local Experiences */}
            <div className="mb-6">
              <h2 className={`text-xl font-semibold ${heading} mb-3`}>Authentic Local Experiences:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Experience */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="h-24 bg-blue-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-primary font-semibold">
                        Cultural Experience
                      </div>
                      <div className="text-xs text-gray-500">Authentic • Local • Unique</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">Traditional Artisan Workshop</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Sample Cultural District</span>
                    </div>
                    <p className="text-sm mt-2 line-clamp-3">
                      Hands-on experience learning traditional crafts from local artisans who have practiced their art for generations. Visitors can create their own souvenir while learning about the cultural and historical significance of these traditional techniques...
                    </p>
                  </div>
                </div>
                
                {/* Second Experience */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="h-24 bg-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-primary font-semibold">
                        Culinary Experience
                      </div>
                      <div className="text-xs text-gray-500">Authentic • Local • Unique</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">Farm-to-Table Cooking Class</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Sample Rural Location</span>
                    </div>
                    <p className="text-sm mt-2 line-clamp-3">
                      Begin with a guided market tour to select fresh, seasonal ingredients, then learn to prepare traditional local dishes. The experience includes hands-on cooking instruction from expert home cooks who share family recipes passed down through generations...
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Premium Experience Preview Box */}
              <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className={`${heading} text-lg font-semibold text-blue-800 mb-2`}>Experience Preview: Personal Narrative</h3>
                <div className="bg-white p-4 rounded-lg border border-blue-100 italic text-neutral-700">
                  "I woke before dawn to meet my guide at the entrance. The early morning light created a magical atmosphere as we walked through the quiet streets. My guide shared stories about his family's connection to this tradition dating back generations. It became not just a tourist activity but a meaningful cultural exchange..."
                </div>
                <div className="mt-3 flex items-start">
                  <div className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-sm font-medium">
                    Seasonal Tips
                  </div>
                  <p className="ml-2 text-sm text-blue-800">Visit during the spring festival season for special demonstrations. Summer visitors should go early in the day to avoid crowds and heat...</p>
                </div>
              </div>
            </div>
            
            {/* Additional Content Preview */}
            <div className="mt-8 text-center">
              <div className="text-gray-600 mb-3">
                + 6 more days in the complete PDF
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
                <div className="border rounded p-2 bg-gray-50">
                  <Landmark className="h-4 w-4 mx-auto text-primary mb-1" />
                  <p>Attraction Details</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <Clock className="h-4 w-4 mx-auto text-primary mb-1" />
                  <p>Opening Hours</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <MapPin className="h-4 w-4 mx-auto text-primary mb-1" />
                  <p>Transportation Guide</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <Utensils className="h-4 w-4 mx-auto text-primary mb-1" />
                  <p>Food Guide</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <h3 className={`${heading} text-lg font-semibold`}>What's Inside The Complete Guide:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">1</div>
                <div>
                  <span className="font-medium">Complete 7-Day Itinerary</span>
                  <p className="text-sm text-gray-600">Detailed daily activities with morning, afternoon, and evening plans</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">2</div>
                <div>
                  <span className="font-medium">Restaurant Recommendations</span>
                  <p className="text-sm text-gray-600">Curated dining options for each day with price ranges</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">3</div>
                <div>
                  <span className="font-medium">Accommodation Guide</span>
                  <p className="text-sm text-gray-600">Best places to stay across different budgets</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">4</div>
                <div>
                  <span className="font-medium">Local Experiences</span>
                  <p className="text-sm text-gray-600">Authentic activities with personal recommendations</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 text-center">
            <a href={`/destinations/${destinationId}/download`}>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30">
                <Download className="h-4 w-4 mr-2" />
                Download The Full Guide Now
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}