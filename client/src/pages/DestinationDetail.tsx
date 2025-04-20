import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useFonts } from "@/components/ui/fonts.tsx";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, Calendar, Users, Star, Clock, BookOpen, 
  Download, ArrowLeft, Utensils, Coffee, Bus, Home, 
  Camera, Check, Loader2, Info
} from "lucide-react";
import { PaymentButton, DownloadWithPaymentButton } from "@/components/PaymentButton";
import ItineraryMapPreview from "@/components/ui/MapComponent";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import RelatedDestinations from "@/components/RelatedDestinations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// AiRecommendations removed as it was not working
import ItineraryPdfPreview from "@/components/ItineraryPdfPreview";
import BudgetVisualizer from "@/components/BudgetVisualizer";
// import EnhancedExperiences from "@/components/EnhancedExperiences";
import InfoPackPreview from "@/components/InfoPackPreview";
import SeasonalInfoSection from "@/components/SeasonalInfoSection";
import { Destination, Itinerary, Day } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
// Accordion components removed since they're not being used

export default function DestinationDetail() {
  const { heading } = useFonts();
  const { id } = useParams();
  const { toast } = useToast();
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  interface ItineraryResponse {
    destination: Destination;
    itinerary: Itinerary;
    days: Day[];
  }
  
  const { data, isLoading } = useQuery<ItineraryResponse>({
    queryKey: [`/api/destinations/${id}/itinerary`],
  });
  
  const destination = data?.destination;
  const itinerary = data?.itinerary;
  const days = data?.days;
  
  useEffect(() => {
    if (destination) {
      document.title = `${destination.name}, ${destination.country} | TravelPlan`;
    } else {
      document.title = "Destination Details | TravelPlan";
    }
  }, [destination]);
  
  const handleDownload = () => {
    setDownloadLoading(true);
    
    toast({
      title: "Redirecting to payment",
      description: `Processing your purchase for ${destination?.name} premium guide`,
      duration: 3000,
    });
    
    // Short timeout to allow the toast to show before redirecting
    setTimeout(() => {
      // Redirect to direct checkout page with destination ID
      window.location.href = `/direct-checkout?type=premium_itinerary&destinationId=${id}`;
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="bg-neutral-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/destinations">
              <Button variant="link" className="text-primary p-0">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to all destinations
              </Button>
            </Link>
          </div>
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left column - Destination info */}
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-lg mb-6" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
              
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              
              <Skeleton className="h-6 w-1/3 mb-4" />
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-28 w-full rounded-md" />
                </div>
              ))}
            </div>
            
            {/* Right column - Download card */}
            <div className="mt-12 lg:mt-0">
              <div className="sticky top-24">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!destination) {
    return (
      <div className="bg-neutral-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-3xl font-bold text-neutral-900 ${heading}`}>
            Destination Not Found
          </h1>
          <p className="mt-4 text-neutral-600">
            Sorry, we couldn't find the destination you're looking for.
          </p>
          <Link href="/destinations">
            <Button className="mt-6">
              Browse All Destinations
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (!itinerary) {
    return (
      <div className="bg-neutral-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/destinations">
              <Button variant="link" className="text-primary p-0">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to all destinations
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className={`text-3xl font-bold text-neutral-900 mb-4 ${heading}`}>
              {destination.name}, {destination.country}
            </h1>
            
            <div className="relative h-64 w-full overflow-hidden rounded-lg mb-6 mx-auto max-w-2xl">
              <img 
                src={destination.imageUrl} 
                alt={`${destination.name}, ${destination.country}`} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex justify-center items-center mb-4">
              <MapPin className="text-[#F97316] h-4 w-4 mr-1" />
              <span className="text-neutral-600">
                {(() => {
                  const regionMap: Record<number, string> = {
                    1: "Europe",
                    2: "Asia",
                    3: "North America",
                    4: "South America",
                    5: "Africa",
                    6: "Oceania"
                  };
                  return regionMap[destination.regionId] || "Unknown";
                })()}
              </span>
              <div className="flex items-center ml-4">
                <Star className="text-yellow-400 h-4 w-4 fill-current" />
                <span className="ml-1 text-neutral-600">{destination.rating}</span>
              </div>
            </div>
            
            <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
              {destination.description}
            </p>
            
            <div className="border-t border-neutral-200 pt-8 pb-4">
              <h2 className={`text-2xl font-bold text-neutral-900 mb-4 ${heading}`}>
                Itinerary Coming Soon
              </h2>
              <p className="text-neutral-600 mb-6">
                We're currently preparing a detailed itinerary for {destination.name}. 
                Check back soon for a complete travel guide!
              </p>
              <div className="flex justify-center space-x-4">
                <FavoriteButton destinationId={destination.id} />
                <ShareButton destinationName={destination.name} destinationId={destination.id} />
              </div>
            </div>
          </div>

          {/* AI Recommendations Section removed as it was not working properly */}
          
          {/* Related Destinations Section */}
          <RelatedDestinations destinationId={Number(id)} limit={4} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-neutral-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/destinations">
            <Button variant="link" className="text-primary p-0">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to all destinations
            </Button>
          </Link>
        </div>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left column - Destination info */}
          <div className="lg:col-span-2">
            <div className="relative h-64 w-full overflow-hidden rounded-lg mb-6">
              <img 
                src={destination.imageUrl} 
                alt={`${destination.name}, ${destination.country}`} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex justify-between items-start">
              <h1 className={`text-3xl font-bold text-neutral-900 ${heading}`}>
                {destination.name}, {destination.country}
              </h1>
              <div className="flex space-x-2">
                <FavoriteButton destinationId={destination.id} />
                <ShareButton destinationName={destination.name} destinationId={destination.id} />
              </div>
            </div>
            <div className="flex items-center mt-2 mb-6">
              <MapPin className="text-[#F97316] h-4 w-4 mr-1" />
              <span className="text-neutral-600">
                {(() => {
                  const regionMap: Record<number, string> = {
                    1: "Europe",
                    2: "Asia",
                    3: "North America",
                    4: "South America",
                    5: "Africa",
                    6: "Oceania"
                  };
                  return regionMap[destination.regionId] || "Unknown";
                })()}
              </span>
              <div className="flex items-center ml-4">
                <Star className="text-yellow-400 h-4 w-4 fill-current" />
                <span className="ml-1 text-neutral-600">{destination.rating}</span>
              </div>
              <span className="ml-4 text-neutral-600">{destination.downloadCount}+ downloads</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Calendar className="text-primary h-10 w-10 mr-3" />
                  <div>
                    <div className="font-medium">{itinerary.duration || 7} days</div>
                    <div className="text-sm text-neutral-500">Duration</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Users className="text-primary h-10 w-10 mr-3" />
                  <div>
                    <div className="font-medium">All ages</div>
                    <div className="text-sm text-neutral-500">Suitable for</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Clock className="text-primary h-10 w-10 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      {id && [23, 24, 25].includes(Number(id)) ? (
                        <>
                          {id === "23" && "Spring & Fall"}
                          {id === "24" && "May-Jun & Sep-Oct"}
                          {id === "25" && "Apr-Jun & Sep-Oct"}
                        </>
                      ) : (
                        "Any time"
                      )}
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="ml-1.5 rounded-full bg-neutral-100 p-1 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
                              <Info className="h-3.5 w-3.5 text-neutral-500" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              {id === "23" && "Tokyo's Spring (March-May) brings cherry blossoms, while Fall (Sep-Nov) offers colorful foliage. Both seasons have mild temperatures and fewer tourists."}
                              {id === "24" && "Barcelona's shoulder seasons (May-June and September-October) offer pleasant weather, fewer crowds, and more affordable accommodations."}
                              {id === "25" && "Bali's dry season from April to October is ideal, with April-June and September-October offering the perfect balance of good weather and fewer tourists."}
                              {!id || ![23, 24, 25].includes(Number(id)) && "View more seasonal information below for the best time to visit this destination."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-sm text-neutral-500">Best season</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center">
                  <BookOpen className="text-primary h-10 w-10 mr-3" />
                  <div>
                    <div className="font-medium">PDF Guide</div>
                    <div className="text-sm text-neutral-500">Format</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <h2 className={`text-2xl font-bold text-neutral-900 mb-4 ${heading}`}>
              About this destination
            </h2>
            <p className="text-neutral-700 mb-6">
              {destination.description}
            </p>
            
            {/* Itinerary overview section removed as it was not displaying any content */}
            
            {/* Seasonal Information Section */}
            <SeasonalInfoSection destinationId={Number(id)} />
            
            {/* Interactive Maps Section */}
            <div className="mb-8">
              <ItineraryMapPreview 
                destinationName={destination.name}
                country={destination.country}
              />
            </div>
            
            <div className="space-y-4 mb-8">
              <h2 className={`text-2xl font-bold text-neutral-900 mb-4 ${heading}`}>
                What's included in the PDF
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-700 mb-3 flex items-center">
                  <span className="inline-block mr-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">PREMIUM</span>
                  Premium Guide Features ($19.99)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Calendar className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Day-by-Day Schedule</h3>
                      <p className="text-sm text-neutral-600">Complete 7-day itinerary with daily activities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Home className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Accommodation Tips</h3>
                      <p className="text-sm text-neutral-600">Basic accommodation suggestions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Utensils className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Restaurant Suggestions</h3>
                      <p className="text-sm text-neutral-600">Popular dining options for each location</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Coffee className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Local Experiences</h3>
                      <p className="text-sm text-neutral-600">Cultural activities and hidden gems</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-neutral-700 mb-3 flex items-center">
                  <span className="inline-block mr-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">Premium</span>
                  Available with Travel Agent Consultation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <MapPin className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Interactive Maps</h3>
                      <p className="text-sm text-neutral-600">Detailed maps with points of interest marked</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <Bus className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Transportation Guide</h3>
                      <p className="text-sm text-neutral-600">How to get around efficiently and affordably</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <Camera className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Photo Spots</h3>
                      <p className="text-sm text-neutral-600">Best locations for memorable pictures</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <Clock className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Opening Hours</h3>
                      <p className="text-sm text-neutral-600">Operating hours for attractions and venues</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800 font-medium mb-1">Deep Travel Collections Premium Services</p>
                  <p className="text-sm text-blue-700 mb-2">
                    Enhance your travel experience with personalized guidance from our licensed travel agent with over 10 years of industry expertise.
                  </p>
                  
                  <div className="space-y-3 my-3">
                    <div className="flex justify-between items-center px-3 py-2 bg-white rounded shadow-sm">
                      <div>
                        <p className="font-medium text-blue-900">Premium Itinerary</p>
                        <p className="text-xs text-blue-700">Complete travel guide with extras</p>
                      </div>
                      <p className="font-bold">$19.99 <span className="text-xs font-normal">USD</span></p>
                    </div>
                    
                    <div className="flex justify-between items-center px-3 py-2 bg-white rounded shadow-sm">
                      <div>
                        <p className="font-medium text-blue-900">Premium + Consultation</p>
                        <p className="text-xs text-blue-700">Personalized expert guidance</p>
                      </div>
                      <p className="font-bold">$49.99 <span className="text-xs font-normal">USD</span></p>
                    </div>
                    
                    <div className="flex justify-between items-center px-3 py-2 bg-white rounded shadow-sm">
                      <div>
                        <p className="font-medium text-blue-900">Monthly Subscription</p>
                        <p className="text-xs text-blue-700">Access to all new itineraries</p>
                      </div>
                      <p className="font-bold">$39.99 <span className="text-xs font-normal">USD/mo</span></p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-blue-900 font-medium">Contact Deep Travel Collections: (289) 231-6599</p>
                  <p className="text-xs text-blue-700 mt-1">Email: kymm@deeptravelcollections.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Download card */}
          <div className="mt-12 lg:mt-0">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader className="bg-primary text-white rounded-t-lg">
                  <CardTitle className={`text-xl ${heading}`}>
                    {destination.name} 7-Day Itinerary
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {itinerary.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Duration:</span>
                      <span className="font-medium">7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Format:</span>
                      <span className="font-medium">PDF Guide</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">File size:</span>
                      <span className="font-medium">~2 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Last updated:</span>
                      <span className="font-medium">August 2023</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-neutral-700 font-medium">Premium Itinerary</span>
                        <span className="font-bold text-lg">$19.99 <span className="text-sm text-neutral-500">USD</span></span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 h-1 rounded-full flex-grow mr-2">
                          <div className="bg-blue-500 w-3/4 h-1 rounded-full"></div>
                        </div>
                        <span className="text-xs text-blue-700 font-medium">POPULAR</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">
                        Our most popular option with complete destination guidance
                      </p>
                    </div>
                    
                    <div className="pt-4 space-y-4">
                      <div className="flex items-center text-green-600 mb-2">
                        <Check className="h-5 w-5 mr-2" />
                        <span className="text-sm">Instant download after payment</span>
                      </div>
                      
                      {/* Preview PDF Button */}
                      <ItineraryPdfPreview 
                        destination={destination}
                        itinerary={itinerary}
                        days={days || []}
                      />
                      
                      {/* Purchase Button */}
                      <PaymentButton 
                        destinationId={destination.id}
                        templateId={itinerary.id}
                        destinationName={destination.name}
                        className="w-full py-6 text-lg"
                        price={19.99}
                      />
                      
                      {/* Premium Content Button */}
                      <Button 
                        className="w-full mt-3 py-4 text-md bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0 shadow-md" 
                        onClick={() => window.location.href = `/premium/${id}`}
                      >
                        <BookOpen className="h-5 w-5 mr-2" />
                        View Premium Content
                      </Button>
                      <p className="text-xs text-center text-neutral-500 mt-2">
                        See detailed samples of what's included in the premium package
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-neutral-50 px-6 py-4 text-sm text-neutral-500 rounded-b-lg">
                  <p>
                    By downloading, you agree to our <a href="#" className="text-primary hover:underline">terms of use</a>.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Premium Info Pack Preview */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className={`text-2xl font-bold mb-4 ${heading}`}>Premium Travel Guide Preview</h2>
          <InfoPackPreview destinationName={destination.name} destinationId={Number(id)} />
        </div>
        
        {/* Budget Visualizer Section */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${heading}`}>Trip Budget Planner</h2>
          <BudgetVisualizer destinationId={Number(id)} />
        </div>
        
        {/* Enhanced Experiences Section */}
        {/* Local experiences section removed as it was not working properly */}
        
        {/* AI Recommendations Section removed as it was not working properly */}
        
        {/* Related Destinations Section */}
        <RelatedDestinations destinationId={Number(id)} limit={4} />
      </div>
    </div>
  );
}