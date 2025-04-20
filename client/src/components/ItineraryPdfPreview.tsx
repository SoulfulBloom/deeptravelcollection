import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Day, Destination, Itinerary } from "@shared/schema";
import { useFonts } from "./ui/fonts";
import { CalendarDays, MapPin, Utensils, Clock, Hotel, Landmark, Download } from "lucide-react";
import { ActivityDetail, isDetailedActivity } from "@/types/itinerary";

interface ItineraryPdfPreviewProps {
  destination: Destination;
  itinerary: Itinerary;
  days: Day[];
}

export default function ItineraryPdfPreview({ destination, itinerary, days }: ItineraryPdfPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { heading } = useFonts();
  
  // Only display first 2 days in the preview
  const previewDays = days.slice(0, 2);
  
  return (
    <div className="mt-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-center">
            <Eye className="mr-2 h-4 w-4" /> 
            Preview PDF Content
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`text-2xl ${heading}`}>
              {destination.name} {itinerary.duration}-Day Itinerary Preview
            </DialogTitle>
            <p className="text-gray-600 text-sm mt-1">
              Preview of what's included in your itinerary download
            </p>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="bg-white rounded-lg border p-6">
              {/* PDF Header Preview */}
              <div className="border-b pb-4 mb-6">
                <h1 className={`text-3xl font-bold ${heading} text-primary`}>
                  {destination.name}, {destination.country}
                </h1>
                <p className="text-gray-600 mt-2">{itinerary.duration}-Day Complete Travel Guide</p>
              </div>
              
              {/* Overview Preview */}
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
                      <h3 className="font-medium">Location Details</h3>
                      <p className="text-sm text-gray-600">Address and directions for each attraction</p>
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
              
              {/* Sample Days Preview */}
              <div>
                <h2 className={`text-xl font-semibold ${heading} mb-3`}>Sample Daily Itinerary:</h2>
                <div className="space-y-6">
                  {previewDays.map((day) => (
                    <div key={day.id} className="border rounded-lg p-4 bg-gray-50">
                      <h3 className={`text-lg font-bold ${heading}`}>
                        Day {day.dayNumber}: {day.title}
                      </h3>
                      <div className="mt-3 space-y-3">
                        {(day.activities || []).map((activity, idx) => {
                          // Create a simple display for string activities
                          if (typeof activity === 'string') {
                            return (
                              <div key={idx} className="bg-white rounded p-3 shadow-sm">
                                <div className="flex items-start">
                                  <Clock className="text-primary mt-1 h-4 w-4 flex-shrink-0" />
                                  <div className="ml-2">
                                    <p>{activity}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          
                          // Create a mockup of structured activity for preview purposes
                          return (
                            <div key={idx} className="bg-white rounded p-3 shadow-sm">
                              <div className="flex items-start">
                                <Clock className="text-primary mt-1 h-4 w-4 flex-shrink-0" />
                                <div className="ml-2">
                                  <p className="font-semibold">Morning Activity</p>
                                  <p>Example activity description for the PDF preview</p>
                                  <p className="text-sm text-gray-600 mt-1 italic">
                                    Tip: Arrive early to avoid crowds
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Food & Restaurant Recommendations */}
                <div className="mt-8">
                  <h2 className={`text-xl font-semibold ${heading} mb-3`}>Restaurant Recommendations:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        <Utensils className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">Authentic Local Restaurant</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Central District</span>
                        </div>
                        <p className="text-sm mt-2">Known for traditional cuisine. Budget-friendly with excellent reviews from locals.</p>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        <Utensils className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">Fine Dining Experience</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Waterfront Area</span>
                        </div>
                        <p className="text-sm mt-2">Upscale dining with panoramic views. Reservation recommended.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Accommodation Options */}
                <div className="mt-8">
                  <h2 className={`text-xl font-semibold ${heading} mb-3`}>Accommodation Options:</h2>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <p className="text-sm">The complete PDF includes specific hotel recommendations in each category with contact information, pricing, and special booking tips.</p>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-3">
                          <h3 className="font-medium text-primary">Budget</h3>
                          <ul className="text-sm mt-2 space-y-2">
                            <li className="flex items-start">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                              <span><b>Backpacker's Haven</b> - Central location, from $35/night</span>
                            </li>
                            <li className="flex items-start">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                              <span><b>City Budget Inn</b> - Basic rooms, from $42/night</span>
                            </li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-3">
                          <h3 className="font-medium text-primary">Mid-Range</h3>
                          <ul className="text-sm mt-2 space-y-2">
                            <li className="flex items-start">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                              <span><b>Comfort Suites</b> - Great views, from $95/night</span>
                            </li>
                            <li className="flex items-start">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                              <span><b>Plaza Hotel</b> - Central area, from $110/night</span>
                            </li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-3">
                          <h3 className="font-medium text-primary">Luxury</h3>
                          <ul className="text-sm mt-2 space-y-2">
                            <li className="flex items-start">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                              <span><b>Grand Palace Hotel</b> - 5-star, from $220/night</span>
                            </li>
                            <li className="flex items-start">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                              <span><b>Royal Resort & Spa</b> - Luxury amenities, from $275/night</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Location Details */}
                <div className="mt-8">
                  <h2 className={`text-xl font-semibold ${heading} mb-3`}>Location Details & Navigation:</h2>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <div className="flex flex-col items-center">
                        <MapPin className="h-8 w-8 text-primary mb-2" />
                        <p className="text-sm text-gray-600">Detailed location information included in PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      The complete PDF includes precise location details for each attraction, restaurant, and accommodation, 
                      with directions, transportation options, and neighborhood information to help you navigate easily.
                    </p>
                  </div>
                </div>
                
                {/* Additional Content Preview */}
                <div className="mt-8 text-center">
                  <div className="text-gray-600 mb-3">
                    + {itinerary.duration - 2} more days in the complete PDF
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// This is just a simple eye icon component
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}