import { useFonts } from "./ui/fonts";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, MapPin, Utensils } from "lucide-react";

export default function ItineraryPreview() {
  const { heading } = useFonts();
  
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className={`text-3xl font-bold text-neutral-900 ${heading}`}>
              Download Detailed Itineraries For Your Next Trip
            </h2>
            <p className="mt-4 text-lg text-neutral-500">
              Our travel itineraries include day-by-day planning, must-see attractions, local insider tips, transportation options, accommodation recommendations, and much more.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CalendarDays className="text-primary text-xl" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-neutral-900">Day-by-Day Planning</h3>
                  <p className="mt-1 text-neutral-500">
                    Detailed daily schedules with optimal visiting hours and routes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="text-primary text-xl" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-neutral-900">Local Insider Tips</h3>
                  <p className="mt-1 text-neutral-500">
                    Hidden gems and local recommendations that typical tourists miss.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Utensils className="text-primary text-xl" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-neutral-900">Food & Dining Suggestions</h3>
                  <p className="mt-1 text-neutral-500">
                    Best local restaurants, cafes, and street food options.
                  </p>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/destinations">
                  <Button className="inline-flex items-center px-6 py-3 text-base">
                    Browse All Itineraries
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0">
            <div className="bg-neutral-100 rounded-lg p-6 shadow-lg relative">
              <div className="absolute -top-4 -right-4 bg-[#F97316] text-white rounded-full w-16 h-16 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-bold">PDF</div>
                  <div className="text-xs">format</div>
                </div>
              </div>
              <h3 className={`text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-3 mb-4 ${heading}`}>
                Premium Travel Itineraries
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="font-semibold text-neutral-800">Authentic Local Experiences</div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Our itineraries are crafted with a focus on authentic, immersive experiences that connect you with local culture.
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="font-semibold text-neutral-800">Detailed Planning</div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Each itinerary includes daily activities, dining recommendations, and practical travel information.
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="font-semibold text-neutral-800">Seasonal Variations</div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Our guides include seasonal adjustments to ensure the best experience regardless of when you travel.
                  </p>
                </div>
                
                <div className="text-center mt-4">
                  <Link href="/destinations">
                    <Button className="mt-4 flex items-center mx-auto">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Explore Itineraries
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
