import { Check, AlertTriangle, Camera, PalmtreeIcon, MapPin, Star, Gift } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFonts } from "@/components/ui/fonts";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Subscribe() {
  const { heading } = useFonts();
  const [location] = useLocation();
  const [hasOfferBanner, setHasOfferBanner] = useState(false);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const { toast } = useToast();
  
  // Extract destinationId and offer from URL if present
  const params = new URLSearchParams(location.split('?')[1] || '');
  const destinationId = params.get('destinationId');
  const offer = params.get('offer');
  
  // State for countdown timer
  const [countdown, setCountdown] = useState({
    hours: 11,
    minutes: 32,
    seconds: 47
  });
  
  useEffect(() => {
    // Check if there's an offer parameter in the URL
    if (offer === 'freebali') {
      setHasOfferBanner(true);
    }
    
    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        // Calculate new countdown values
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        
        // If timer reaches zero, reset it to create urgency
        if (newHours < 0) {
          newHours = 23;
          newMinutes = 59;
          newSeconds = 59;
        }
        
        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);
    
    return () => clearInterval(timer); // Clear timer on component unmount
  }, [offer]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-neutral-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero section with dark blue background */}
        <div className="relative rounded-2xl overflow-hidden mb-20 shadow-xl">
          <div className="absolute inset-0 bg-blue-900"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-indigo-900"></div>
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          }}></div>

          <div className="relative z-10 py-20 px-6 text-center">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full text-base font-bold mb-8 shadow-lg border border-orange-300">
              Expert-Crafted Travel Experiences
            </div>
            
            <h1 className={`${heading}`}>
              <div className="text-6xl md:text-8xl font-black mb-3 text-white drop-shadow-lg">Premium</div>
              <div className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 drop-shadow-lg">
                Travel Guides
              </div>
            </h1>
            
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-medium mt-8 mb-12 drop-shadow-md">
              Immersive itineraries with detailed insights and personalized consultation 
              from our licensed travel agent with over 10 years of experience.
            </p>
            
            <Link href="/destinations">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-10 py-7 text-xl rounded-xl shadow-xl transform hover:scale-105 transition-all">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>

        {/* Free Bali guide offer banner - only shown when coming from exit intent popup */}
        {hasOfferBanner && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-4 mb-6 max-w-3xl mx-auto shadow-lg border border-blue-300 animate-pulse">
            <div className="flex items-start">
              <div className="rounded-full bg-white/20 p-2 mr-3 mt-0.5 flex-shrink-0">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">YOUR FREE BALI GUIDE IS ALMOST YOURS!</h3>
                <p className="text-white/90 mt-1">
                  We're excited to send you our Premium Bali Guide ($19.99 value) for FREE!
                  Simply choose any plan below and we'll include your Bali guide with your purchase.
                  <span className="font-bold"> This special offer is reserved exclusively for you.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Very limited time offer banner with countdown */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg p-4 mb-12 max-w-3xl mx-auto shadow-xl border-2 border-orange-300 relative overflow-hidden">
          {/* "Limited Time" flash badge */}
          <div className="absolute -right-12 top-5 bg-red-600 text-white text-xs font-extrabold px-14 py-1 rotate-45 shadow-md z-10">
            FLASH SALE
          </div>
          
          <div className="flex items-start">
            <div className="rounded-full bg-white/30 p-2 mr-3 mt-0.5 flex-shrink-0 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"></path><path d="M13.9 21.818a10 10 0 0 1-3.8 0"></path><path d="M13.9 2.182a10 10 0 0 1 3.6 20.636"></path><path d="M10.1 21.818a10 10 0 0 1-3.6-20.636"></path><path d="M12 8v4l3 3"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">VERY LIMITED TIME OFFER! 20% OFF ALL PLANS</h3>
              <p className="text-white/90 mt-1">
                Join over 10,000 travelers who have transformed their journeys with our expert guides. 
                First-time subscribers get an additional free consultation with our licensed travel agent.
              </p>
              
              {/* Countdown timer boxes */}
              <div className="mt-3 flex flex-wrap items-center">
                <span className="font-extrabold text-white mr-2">OFFER EXPIRES IN:</span>
                <div className="flex space-x-2">
                  <div className="bg-white/20 rounded px-3 py-1 text-center min-w-[40px]">
                    <span className="font-mono font-bold text-white text-xl">
                      {countdown.hours.toString().padStart(2, '0')}
                    </span>
                    <p className="text-white/80 text-xs">Hours</p>
                  </div>
                  <div className="bg-white/20 rounded px-3 py-1 text-center min-w-[40px]">
                    <span className="font-mono font-bold text-white text-xl">
                      {countdown.minutes.toString().padStart(2, '0')}
                    </span>
                    <p className="text-white/80 text-xs">Mins</p>
                  </div>
                  <div className="bg-white/20 rounded px-3 py-1 text-center min-w-[40px]">
                    <span className="font-mono font-bold text-white text-xl">
                      {countdown.seconds.toString().padStart(2, '0')}
                    </span>
                    <p className="text-white/80 text-xs">Secs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Title */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-semibold mb-4">
            Choose Your Perfect Plan
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${heading}`}>
            <span className="text-blue-700">Flexible</span> Pricing Options
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg font-medium">
            Select the plan that best fits your travel needs and budget. All options include our expert-crafted content.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Premium Itinerary */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl overflow-hidden bg-white">
            <div className="h-3 bg-blue-600 w-full absolute top-0 left-0"></div>
            <CardHeader className="pt-8">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-max px-4 py-1 text-sm mb-3">
                SINGLE ITINERARY
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Premium Itinerary</CardTitle>
              <CardDescription className="text-base text-gray-600 font-medium">Enhanced travel guide with extras</CardDescription>
              <div className="mt-4">
                <span className="text-6xl font-extrabold text-blue-600">$19.99</span>
                <span className="text-gray-600 ml-1">/itinerary</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Detailed 7-Day Itinerary</p>
                    <p className="text-sm text-gray-600">Complete day-by-day guide with timings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Restaurant Recommendations</p>
                    <p className="text-sm text-gray-600">Curated dining experiences with price ranges</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Accommodation Guide</p>
                    <p className="text-sm text-gray-600">Best areas to stay by budget</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Downloadable PDF</p>
                    <p className="text-sm text-gray-600">Professional-quality design</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-2 bg-green-50 border-t border-b border-green-100 mb-4">
              <p className="text-xs text-green-700 flex items-center justify-center">
                <Star className="h-3 w-3 mr-1 fill-green-500 text-green-500" />
                <span className="font-medium">4,829 travelers</span> purchased this month
              </p>
            </div>
            <CardFooter className="pt-2">
              <Link href={`/checkout?type=premium_itinerary${destinationId ? `&destinationId=${destinationId}` : ''}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Purchase Itinerary
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Monthly Subscription */}
          <Card className="border-2 border-amber-500 relative transform scale-105 hover:scale-110 transition-all shadow-xl hover:shadow-2xl overflow-hidden bg-white">
            <div className="absolute -right-8 top-7 bg-amber-500 text-white text-xs font-bold px-8 py-1 rotate-45 shadow-md z-10">
              BEST VALUE
            </div>
            <div className="h-3 bg-amber-500 w-full absolute top-0 left-0"></div>
            <CardHeader className="pt-8">
              <div className="bg-amber-100 text-amber-800 font-bold rounded-full w-max px-4 py-1 text-sm mb-3">
                UNLIMITED ACCESS
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Monthly Subscription</CardTitle>
              <CardDescription className="text-base text-gray-600 font-medium">Access to all itineraries + updates</CardDescription>
              <div className="mt-4">
                <span className="text-6xl font-extrabold text-amber-500">$39.99</span>
                <span className="text-gray-600 ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Unlimited Premium Itineraries</p>
                    <p className="text-sm text-gray-600">All 24+ destinations included</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">New Destinations Monthly</p>
                    <p className="text-sm text-gray-600">Fresh content as we expand</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Agent Availability</p>
                    <p className="text-sm text-gray-600">Priority support from our expert</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Consultation Discounts</p>
                    <p className="text-sm text-gray-600">15% off personalized services</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-2 bg-amber-50 border-t border-b border-amber-100 mb-4">
              <p className="text-xs text-amber-700 flex items-center justify-center">
                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                <span className="font-medium">Save 50%</span> vs. buying individually
              </p>
            </div>
            <CardFooter className="pt-2">
              <Link href={`/checkout?type=premium_subscription${destinationId ? `&destinationId=${destinationId}` : ''}`}>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-lg py-6">
                  Subscribe Now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Premium with Consultation */}
          <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-all hover:shadow-xl overflow-hidden bg-white">
            <div className="h-3 bg-indigo-600 w-full absolute top-0 left-0"></div>
            <CardHeader className="pt-8">
              <div className="bg-indigo-100 text-indigo-800 font-bold rounded-full w-max px-4 py-1 text-sm mb-3">
                EXPERT GUIDANCE
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Premium + Consultation</CardTitle>
              <CardDescription className="text-base text-gray-600 font-medium">Personalized expert guidance</CardDescription>
              <div className="mt-4">
                <span className="text-6xl font-extrabold text-indigo-600">$49.99</span>
                <span className="text-gray-600 ml-1">/itinerary</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Everything in Premium Itinerary</p>
                    <p className="text-sm text-gray-600">All premium features included</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">30-Minute Consultation</p>
                    <p className="text-sm text-gray-600">With licensed travel expert</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Interactive Maps</p>
                    <p className="text-sm text-gray-600">Daily routes and points of interest</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Personalized Adjustments</p>
                    <p className="text-sm text-gray-600">Tailored to your preferences</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-2 bg-indigo-50 border-t border-b border-indigo-100 mb-4">
              <p className="text-xs text-indigo-700 flex items-center justify-center">
                <Star className="h-3 w-3 mr-1 fill-indigo-500 text-indigo-500" />
                <span className="font-medium">$30 value added</span> with expert consultation
              </p>
            </div>
            <CardFooter className="pt-2">
              <Link href={`/checkout?type=premium_consultation${destinationId ? `&destinationId=${destinationId}` : ''}`}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6">
                  Choose with Consultation
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Gallery Section */}
        <div className="mt-24 mb-12">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-semibold mb-4">
              <Camera className="h-5 w-5 inline-block mr-2" /> Explore Our Destinations
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${heading}`}>
              <span className="text-blue-700">Stunning Places</span> Await You
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg font-medium">
              Discover remarkable destinations with our expert-crafted travel guides. Here's a glimpse of what awaits you.
            </p>
          </div>

          {/* Simplified image gallery with hard-coded images that will definitely show */}
          <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto">
            {/* Santorini */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 relative h-80 group">
              <img 
                src="/assets/santorini-4825173_1280.jpg" 
                alt="Santorini, Greece" 
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white drop-shadow-md">Santorini, Greece</h3>
                <p className="text-white/90 text-sm">Mediterranean Paradise</p>
              </div>
            </div>

            {/* Rome */}
            <div className="col-span-6 md:col-span-3 lg:col-span-4 relative h-80 group">
              <img 
                src="/assets/rome-4087275_1280.jpg" 
                alt="Rome, Italy" 
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white drop-shadow-md">Rome, Italy</h3>
                <p className="text-white/90 text-sm">Eternal City</p>
              </div>
            </div>

            {/* Panama City */}
            <div className="col-span-6 md:col-span-3 lg:col-span-4 relative h-80 group">
              <img 
                src="/assets/panama-city-2163483_1280.jpg" 
                alt="Panama City" 
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white drop-shadow-md">Panama City</h3>
                <p className="text-white/90 text-sm">Where Two Oceans Meet</p>
              </div>
            </div>

            {/* Puerto Vallarta */}
            <div className="col-span-6 md:col-span-4 relative h-60 group">
              <img 
                src="/assets/puerta-vallarta-mexico-2253026_1280.jpg" 
                alt="Puerto Vallarta" 
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white drop-shadow-md">Puerto Vallarta</h3>
                <p className="text-white/90 text-sm">Mexican Pacific Jewel</p>
              </div>
            </div>

            {/* Caribbean Beach */}
            <div className="col-span-6 md:col-span-4 relative h-60 group">
              <img 
                src="/assets/beach-652119_1280.jpg" 
                alt="Caribbean Beach" 
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white drop-shadow-md">Caribbean Beach</h3>
                <p className="text-white/90 text-sm">Tropical Getaway</p>
              </div>
            </div>

            {/* Tropical Paradise */}
            <div className="col-span-12 md:col-span-4 relative h-60 group">
              <img 
                src="/assets/beach-5264739_1280.jpg" 
                alt="Tropical Paradise" 
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white drop-shadow-md">Tropical Paradise</h3>
                <p className="text-white/90 text-sm">Pristine Beaches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us - with gradient background */}
        <div className="mt-24 py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-bold mb-3">Expert-Crafted Experiences</span>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-blue-800 ${heading}`}>
                Why Choose Deep Travel Collections
              </h2>
              <p className="text-center text-blue-700 mb-8 max-w-3xl mx-auto font-medium">
                Our itineraries go beyond ordinary travel guides, created by a licensed travel agent 
                with over 10 years of experience and enriched with authentic local insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl border border-blue-100">
                <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-5">
                  <Star className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-800">Expert Curation</h3>
                <p className="text-gray-600">
                  All itineraries are meticulously crafted by a licensed travel expert with extensive destination knowledge.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl border border-blue-100">
                <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M11.6 16.8a1 1 0 1 1-1.2 1.6 1 1 0 0 1 1.2-1.6z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-800">Authentic Experiences</h3>
                <p className="text-gray-600">
                  Discover hidden gems and local favorites that go beyond typical tourist attractions.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl border border-blue-100">
                <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-800">Comprehensive Details</h3>
                <p className="text-gray-600">
                  Get detailed recommendations for dining, accommodations, transportation, and cultural insights.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-24 mb-12">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-300">
            {/* Dark blue background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-indigo-900"></div>
            
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="small-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#small-grid)" />
              </svg>
            </div>
            
            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="inline-block mb-8 rounded-full px-6 py-2 bg-amber-500 text-white font-bold">
                GET STARTED TODAY
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-lg">
                Ready to Elevate Your <span className="text-amber-300">Travel Experience?</span>
              </h2>
              
              <p className="text-xl text-white max-w-2xl mx-auto mb-10 font-medium drop-shadow">
                Contact our licensed travel agent directly for personalized service 
                and start planning your extraordinary journey today.
              </p>
              
              {contactFormSubmitted ? (
                <div className="bg-white p-8 rounded-xl max-w-xl mx-auto shadow-2xl border-2 border-green-300 animate-pulse">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 mb-2">Thanks for reaching out!</h3>
                    <p className="text-gray-700 text-lg mb-4">
                      Your message has been sent successfully. Our travel expert will contact you shortly.
                    </p>
                    <div className="flex items-center justify-center space-x-3 text-green-800 font-medium">
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        (289) 231-6599
                      </p>
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        kymm@deeptravelcollections.com
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl max-w-xl mx-auto shadow-2xl border border-blue-200">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    <div className="text-center md:text-left">
                      <p className="font-bold text-xl text-blue-800">Deep Travel Collections</p>
                      <p className="text-gray-700 font-medium">Licensed Travel Agent Service</p>
                      <p className="font-bold mt-4 text-xl text-blue-700">Phone: (289) 231-6599</p>
                      <p className="text-gray-700 font-medium">Email: kymm@deeptravelcollections.com</p>
                    </div>
                    <Button 
                      size="lg" 
                      className="px-8 py-6 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xl transform hover:scale-105 transition-all"
                      onClick={() => {
                        setContactFormSubmitted(true);
                        toast({
                          title: "Message Sent!",
                          description: "Thank you for your interest. Our travel expert will contact you shortly.",
                          variant: "default"
                        });
                      }}
                    >
                      Contact Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}