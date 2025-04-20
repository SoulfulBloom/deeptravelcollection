import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { FaMapMarkerAlt, FaPlane, FaHospital, FaCoins, FaDollarSign, FaCalendarAlt, FaLanguage, FaUsers, FaDownload, FaEnvelope, FaCheck } from 'react-icons/fa';
import { SnowbirdPremiumButton } from '@/components/snowbird/SnowbirdPaymentButton';
import { SnowbirdCityButton } from '@/components/snowbird/CityItineraryButton';
import PremiumDownloadButton from '@/components/PremiumDownloadButton';

type SnowbirdDestination = {
  id: number;
  name: string;
  country: string;
  region: string;
  imageUrl: string;
  avgWinterTemp: string;
  costComparison: string;
  description: string;
  visaRequirements: string;
  healthcareAccess: string;
  avgAccommodationCost: string;
  flightTime: string;
  languageBarrier: string;
  canadianExpats: string;
  bestTimeToVisit: string;
  localTips: string;
  costOfLiving: string;
  createdAt?: string;
};

export default function SnowbirdAlternatives() {
  // State for filters
  const [selectedClimates, setSelectedClimates] = useState<string[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<string[]>([]);
  const [selectedHealthcare, setSelectedHealthcare] = useState<string[]>([]);
  const [compareDestinations, setCompareDestinations] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [isCanadianSnowbird, setIsCanadianSnowbird] = useState(false);

  // Fetch snowbird destinations
  const { data: apiDestinations, isLoading, error } = useQuery<SnowbirdDestination[]>({
    queryKey: ['/api/snowbird'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fallback data for when API doesn't return all destinations
  const fallbackDestinations: SnowbirdDestination[] = [
    {
      id: 100,
      name: "Algarve",
      country: "Portugal",
      region: "Europe",
      imageUrl: "/images/destinations/algarve-portugal.jpg",
      avgWinterTemp: "16°C (61°F)",
      costComparison: "30-40% lower cost than Florida",
      description: "The Algarve region offers a Mediterranean climate with mild winters, beautiful beaches, and a well-established expat community, making it perfect for Canadian snowbirds seeking European charm without harsh winters.",
      visaRequirements: "Schengen visa for 90 days, D7 visa available for longer stays",
      healthcareAccess: "Excellent public and private healthcare system",
      avgAccommodationCost: "€900-1,800/month for a 1-2 bedroom",
      flightTime: "7-8 hours from Toronto",
      languageBarrier: "Moderate, English widely spoken in tourist areas",
      canadianExpats: "Medium-sized and growing community",
      bestTimeToVisit: "October to April",
      localTips: "Consider the towns of Lagos or Tavira for a good balance of amenities and authentic Portuguese experience.",
      costOfLiving: "Moderate, with affordable dining and transportation options",
      createdAt: "2025-01-01T12:00:00.000Z"
    },
    {
      id: 101,
      name: "Puerto Vallarta",
      country: "Mexico",
      region: "North America",
      imageUrl: "https://images.unsplash.com/photo-1580191947416-62d35a55e71d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      avgWinterTemp: "25°C (77°F)",
      costComparison: "25-35% savings compared to Florida",
      description: "A vibrant coastal city with beautiful beaches, rich cultural heritage, and a thriving expat community. Puerto Vallarta offers the perfect blend of authentic Mexican culture and modern amenities.",
      visaRequirements: "Tourist visa for 180 days, easy to obtain",
      healthcareAccess: "Good quality private hospitals, many catering to international patients",
      avgAccommodationCost: "$800-1,500 USD/month for a 1-2 bedroom",
      flightTime: "5-6 hours from Toronto",
      languageBarrier: "Low to moderate",
      canadianExpats: "Large community",
      bestTimeToVisit: "November to April",
      localTips: "The 5 de Diciembre neighborhood offers a good balance of local culture and modern amenities.",
      costOfLiving: "Affordable with many options for all budgets",
      createdAt: "2025-01-02T12:00:00.000Z"
    },
    {
      id: 102,
      name: "San Jose",
      country: "Costa Rica",
      region: "Central America",
      imageUrl: "https://images.unsplash.com/photo-1584755684292-cac19e64616a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      avgWinterTemp: "24°C (75°F)",
      costComparison: "Similar costs to Florida but with unique natural experiences",
      description: "Costa Rica offers an ecological paradise with perfect winter temperatures, stable political climate, and a focus on sustainable living and natural beauty.",
      visaRequirements: "90-day tourist visa on arrival, renewable with border exit",
      healthcareAccess: "Excellent healthcare system with lower costs than US or Canada",
      avgAccommodationCost: "$700-1,400 USD/month for a 1-2 bedroom",
      flightTime: "5-7 hours from Toronto",
      languageBarrier: "Moderate, though English widely spoken in expat areas",
      canadianExpats: "Growing community with good infrastructure",
      bestTimeToVisit: "December to April (dry season)",
      localTips: "Consider the Central Valley area for convenient access to amenities while being close to beaches and natural attractions.",
      costOfLiving: "Moderate, with good value for money on fresh produce and leisure activities",
      createdAt: "2025-01-03T12:00:00.000Z"
    },
    {
      id: 103,
      name: "Panama City",
      country: "Panama",
      region: "Central America",
      imageUrl: "https://images.unsplash.com/photo-1578511161102-ad52358690fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      avgWinterTemp: "28°C (82°F)",
      costComparison: "20-30% savings over Florida with tax advantages",
      description: "Panama offers modern amenities with a tropical climate, uses US currency, and has one of the best retirement visa programs in the world with the Pensionado program.",
      visaRequirements: "Tourist visa for 180 days, Pensionado program for retirees",
      healthcareAccess: "High-quality private healthcare at lower costs",
      avgAccommodationCost: "$800-1,500 USD/month for a 1-2 bedroom",
      flightTime: "6-7 hours from Toronto",
      languageBarrier: "Moderate, English widely used in business and tourism",
      canadianExpats: "Established community with growing numbers",
      bestTimeToVisit: "December to April (dry season)",
      localTips: "Consider Coronado, El Valle, or Boquete for popular expat communities with different climates and lifestyles.",
      costOfLiving: "20-30% lower than Florida with tax advantages for retirees",
      createdAt: "2025-01-04T12:00:00.000Z"
    },
    {
      id: 104,
      name: "Punta Cana",
      country: "Dominican Republic",
      region: "Caribbean",
      imageUrl: "https://images.unsplash.com/photo-1584555613483-3b107aa8ba59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      avgWinterTemp: "27°C (81°F)",
      costComparison: "40-50% lower costs than Florida",
      description: "A Caribbean paradise with established snowbird communities, offering white-sand beaches, all-inclusive options, and affordable housing with direct flights from Canada.",
      visaRequirements: "Tourist card on arrival valid for 30 days, extensions available",
      healthcareAccess: "Good private hospitals in major cities and tourist areas",
      avgAccommodationCost: "$600-1,200 USD/month for a 1-2 bedroom",
      flightTime: "4-5 hours from Toronto",
      languageBarrier: "Moderate, English widely spoken in tourist areas",
      canadianExpats: "Large seasonal community",
      bestTimeToVisit: "December to April",
      localTips: "Consider gated communities or established expat areas for safety and convenience.",
      costOfLiving: "40-50% lower than Florida with excellent value on services",
      createdAt: "2025-01-05T12:00:00.000Z"
    },
    {
      id: 105,
      name: "Varadero",
      country: "Cuba",
      region: "Caribbean",
      imageUrl: "https://images.unsplash.com/photo-1610977495571-3cf47d8c0e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      avgWinterTemp: "25°C (77°F)",
      costComparison: "Among the most affordable winter options for Canadians",
      description: "Rich culture and beautiful beaches at unbeatable prices, with a safe environment, excellent healthcare, and a unique cultural experience unlike any other Caribbean destination.",
      visaRequirements: "Tourist card required, valid for 30 days and extendable",
      healthcareAccess: "Excellent healthcare system with medical tourism infrastructure",
      avgAccommodationCost: "$400-800 USD/month for a 1-2 bedroom",
      flightTime: "3-4 hours from Toronto",
      languageBarrier: "High, Spanish is essential outside tourist areas",
      canadianExpats: "Large seasonal community with established infrastructure",
      bestTimeToVisit: "November to April",
      localTips: "Stock up on essentials before arrival as some items may be scarce, and use convertible pesos for most transactions.",
      costOfLiving: "Among the most affordable options, especially for all-inclusive stays",
      createdAt: "2025-01-06T12:00:00.000Z"
    }
  ];
  
  // Helper function to prioritize local images for destinations
  const getImagePath = (destination: SnowbirdDestination) => {
    // Local image mappings - prioritize these over any external URLs
    const localImageMap: Record<string, string> = {
      "Algarve": "/images/destinations/thumbs/algarve.jpg",
      "Puerto Vallarta": "/images/destinations/thumbs/puerto-vallarta.jpg",
      "Mérida": "/images/destinations/thumbs/merida.jpg",
      "Chiang Mai": "/images/destinations/thumbs/chiang-mai.jpg",
      "Panama City": "/images/destinations/thumbs/panama-city.jpg",
      "Lisbon": "/images/destinations/thumbs/lisbon.jpg",
      "Malaga": "/images/destinations/thumbs/malaga.jpg",
      "Punta Cana": "/images/destinations/thumbs/punta-cana.jpg",
      "Varadero": "/images/destinations/thumbs/varadero.jpg",
      "Medellín": "/images/destinations/thumbs/medellin.jpg",
      "San Jose": "/images/destinations/thumbs/san-jose.jpg",
      "Costa Rica": "/images/destinations/thumbs/san-jose.jpg"
    };

    // Check if we have a local image for this destination
    if (localImageMap[destination.name]) {
      console.log(`Using local image for ${destination.name}`);
      return localImageMap[destination.name];
    }
    
    // For all other destinations, use the original image URL if it exists and is not empty
    if (destination.imageUrl && destination.imageUrl.trim() !== '') {
      return destination.imageUrl;
    }
    
    // Fallback to a default image if no imageUrl is provided
    return "/images/destinations/thumbs/algarve.jpg";
  };
  
  // Combine API destinations with fallback data
  const destinations = React.useMemo(() => {
    // Debugging
    console.log("API Destinations:", apiDestinations);
    
    if (!apiDestinations || apiDestinations.length === 0) {
      console.log("Using fallback destinations");
      return fallbackDestinations;
    }
    
    // Always include all fallback destinations along with API destinations
    // This ensures we show all destinations, regardless of what's in the API
    const combined = [...apiDestinations];
    
    // Add all fallback destinations not already in the API response
    fallbackDestinations.forEach(fallbackDest => {
      const exists = combined.some(apiDest => 
        apiDest.name.toLowerCase() === fallbackDest.name.toLowerCase());
      
      if (!exists) {
        console.log("Adding fallback destination:", fallbackDest.name);
        combined.push(fallbackDest);
      }
    });
    
    // Make one last pass to ensure all destinations have properly formatted createdAt dates
    const result = combined.map(dest => {
      return {
        ...dest,
        createdAt: typeof dest.createdAt === 'object' ? new Date().toISOString() : dest.createdAt
      };
    });
    
    console.log("Final destinations:", result);
    return result;
  }, [apiDestinations]);

  // Helper function to get highlight based on region
  const getHighlight = (destination: SnowbirdDestination) => {
    const highlights: Record<string, string> = {
      'Algarve': 'Mediterranean climate with 300+ days of sunshine annually',
      'Puerto Vallarta': 'Year-round warm temperatures and beautiful beaches',
      'San Jose': 'Ecological paradise with perfect winter temperatures',
      'Panama City': 'Modern amenities with tropical climate',
      'Punta Cana': 'Caribbean paradise with established snowbird communities',
      'Varadero': 'Rich culture and beautiful beaches at unbeatable prices',
    };
    
    return highlights[destination.name] || `Beautiful ${destination.region} destination`;
  };

  // Helper function to get key points
  const getKeyPoints = (destination: SnowbirdDestination) => {
    if (destination.name === 'Algarve') {
      return ['Affordable housing', 'Established expat community', 'Excellent healthcare'];
    } else if (destination.name === 'Puerto Vallarta') {
      return ['Strong Canadian presence', 'Affordable living', 'Direct flights from Canada'];
    } else if (destination.name === 'San Jose') {
      return ['Stable political climate', 'Excellent healthcare', 'Outdoor lifestyle'];
    } else if (destination.name === 'Panama City') {
      return ['Uses US dollar', 'Pensionado visa program', 'Developed infrastructure'];
    } else if (destination.name === 'Punta Cana') {
      return ['All-inclusive options', 'Affordable housing', 'Direct flights from Canada'];
    } else if (destination.name === 'Varadero') {
      return ['Safe environment', 'Excellent healthcare', 'Unique cultural experience'];
    } else {
      return [destination.visaRequirements?.split('.')[0] || 'Easy visa process', 
              destination.healthcareAccess?.split('.')[0] || 'Good healthcare options', 
              destination.costOfLiving?.split('.')[0] || 'Affordable living'];
    }
  };

  // Function to toggle destination for comparison
  const toggleCompareDestination = (id: number) => {
    // Create a new array to hold the updated destinations
    let newCompareDestinations: number[];
    
    if (compareDestinations.includes(id)) {
      // Remove destination if already selected
      newCompareDestinations = compareDestinations.filter(destId => destId !== id);
    } else {
      // Add destination if less than 3 are already selected
      if (compareDestinations.length < 3) {
        newCompareDestinations = [...compareDestinations, id];
      } else {
        // If already 3 destinations selected, don't add more
        return;
      }
    }
    
    // Update state with new array
    setCompareDestinations(newCompareDestinations);
    
    // Enable comparison mode if at least 2 destinations are selected
    if (newCompareDestinations.length >= 2) {
      setShowComparison(true);
      
      // Scroll to comparison section after a small delay to ensure it's rendered
      setTimeout(() => {
        document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (newCompareDestinations.length === 0) {
      // Turn off comparison mode if no destinations are selected
      setShowComparison(false);
    }
  };

  // Function to handle email signup
  const handleEmailSignup = () => {
    if (email && email.includes('@')) {
      // Always redirect to success page with download regardless of checkbox status
      if (window.location.href.includes('snowbird')) {
        window.location.href = '/canadian-snowbird-success';
      } else {
        // Regular Florida updates signup
        alert('Thank you for signing up for Florida Alternative Updates!');
        setEmail('');
        setShowEmailSignup(false);
      }
    } else {
      alert('Please enter a valid email address');
    }
  };
  
  if (isLoading) return <div className="container mx-auto px-4 py-8"><p>Loading snowbird destinations...</p></div>;
  if (error) return <div className="container mx-auto px-4 py-8"><p>Error loading snowbird destinations</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header Banner */}
      <div 
        className="w-full bg-cover bg-center flex flex-col justify-center items-center text-white py-16"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80)',
          backgroundPosition: 'center 60%'
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <img 
              src="/images/canada-153554_1280.webp" 
              alt="Canadian Flag" 
              className="h-16 md:h-20 w-auto shadow-xl transform -rotate-3"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center px-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
            Skip the Trade Wars: Stress-Free Winter Escapes
          </h1>
          <h2 className="text-xl md:text-2xl mb-6 text-center px-4">
            Beyond Florida: Premium Guides for Canadian Snowbirds
          </h2>
          
          {/* Main hero description */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 mb-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-200">
              More Than Just an Itinerary
            </h3>
            <p className="text-lg mb-6 text-center">
              Our premium snowbird guides dive deep into creating your perfect home away from home.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-700 bg-opacity-90 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-blue-100">What's Included in Premium Guides</h3>
                <ul className="space-y-2 text-blue-50 text-sm">
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Cost comparisons showing how your chosen destination beats Florida for value</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>10+ specific restaurant recommendations with addresses and price ranges</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Detailed accommodation options with neighborhood insights</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-700 bg-opacity-90 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-blue-100">Trade The Headaches For Hammocks</h3>
                <ul className="space-y-2 text-blue-50 text-sm">
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Practical tips for settling in, from visas to healthcare that welcomes Canadians</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Month-by-month activities to help you explore, connect, and relax</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Local Canadian community meetups and events calendar</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Canadian Snowbird Checkbox - Top position */}
            <div className="bg-blue-600 py-4 px-5 rounded-md mb-6 mx-auto max-w-xl border-2 border-yellow-400 shadow-lg">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <input 
                  type="checkbox" 
                  id="canadian_snowbird_top" 
                  name="canadian_snowbird"
                  className="w-6 h-6"
                  checked={isCanadianSnowbird}
                  onChange={(e) => setIsCanadianSnowbird(e.target.checked)}
                />
                <div className="flex flex-col text-left">
                  <label htmlFor="canadian_snowbird_top" className="text-sm md:text-base font-bold text-white">
                    I'm a Canadian looking for snowbird destinations
                  </label>
                  <span className="text-yellow-200 font-semibold text-sm mt-1">
                    Get a <span className="text-white text-base md:text-lg font-black bg-gradient-to-r from-green-500 to-green-600 px-2 py-0.5 rounded-md animate-pulse">FREE</span> Ultimate Canadian Snowbird Departure Checklist and Comparison Guide 
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full ml-2 text-xs font-bold">VALUE $16.99</span>
                  </span>
                </div>
              </div>
              
              {/* Download button that appears when checkbox is checked */}
              <Button 
                onClick={() => window.location.href = '/canadian-snowbird-success'} 
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <FaDownload className="mr-2" /> Download Your Free Canadian Guide Now
              </Button>
            </div>
            
            <div className="text-sm md:text-base space-y-4">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Sunny beach" className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-lg transform rotate-3" />
                <img src="https://images.unsplash.com/photo-1501426026826-31c667bdf23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Sunset" className="w-28 h-28 rounded-full object-cover border-4 border-orange-400 shadow-lg transform -rotate-3" />
                <img src="https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Palm trees" className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-lg transform rotate-6" />
              </div>
              
              <div className="bg-blue-800 bg-opacity-60 p-5 rounded-lg border-l-4 border-yellow-400">
                <p className="text-lg font-medium mb-4">
                  Skip the Trade Wars: Your Stress-Free beyond Florida Winter Escapes
                </p>
                <p className="mb-3">
                  Tired of navigating the trade wars and soaring costs in Florida or Arizona? We've crafted the perfect alternatives for Canadian snowbirds looking for warmth, culture, and affordability—without the hassle. These exclusive guides are your all-in-one resource for spending a seamless winter in Varadero, Cuba, where sunny skies, vibrant culture, and a thriving Canadian community make it feel like a home away from home.
                </p>
                <p className="font-semibold text-yellow-200">
                  Trade the headaches for hammocks
                </p>
              </div>
              
              <p>
                For decades, Florida has been the go-to winter destination for Canadian snowbirds seeking warmth and sunshine during the harsh northern winters. 
                However, recent trade tensions, political uncertainty, and changing policies have prompted many Canadians to explore alternatives.
              </p>
              <p>
                These beautiful destinations offer all the benefits Florida is known for — warm winters, beautiful beaches, and established expat communities — 
                while providing unique cultural experiences, potential cost savings, and freedom from current US-Canada complications.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">



        {/* Comparison Mode Toggle removed for cleaner UI */}

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {destinations?.map((destination: SnowbirdDestination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={getImagePath(destination)} 
                  alt={`${destination.name}, ${destination.country} - Snowbird destination`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold text-white">
                    {destination.name}, {destination.country}
                  </h3>
                </div>
              </div>
              
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{getHighlight(destination)}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FaMapMarkerAlt className="mr-1" /> {destination.region}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap mb-4">
                  <Badge variant="outline" className="mr-2 mb-2 bg-blue-50">
                    <FaCalendarAlt className="mr-1" /> {destination.avgWinterTemp}
                  </Badge>
                  <Badge variant="outline" className="mr-2 mb-2 bg-green-50">
                    <FaDollarSign className="mr-1" /> {destination.costComparison}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  {getKeyPoints(destination).map((point, index) => (
                    <div key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {destination.description}
                </p>
                
                {/* Detailed Information Accordion */}
                <Accordion type="single" collapsible className="w-full mt-2">
                  <AccordionItem value="visa-info">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <FaPlane className="mr-2 text-blue-500" />
                        Visa Requirements
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      {destination.visaRequirements || "Information not available"}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="healthcare-info">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <FaHospital className="mr-2 text-red-500" />
                        Healthcare Access
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      {destination.healthcareAccess || "Information not available"}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="cost-info">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <FaCoins className="mr-2 text-amber-500" />
                        Cost of Living
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      {destination.costOfLiving || "Information not available"}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="community-info">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <FaUsers className="mr-2 text-green-500" />
                        Canadian Community
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      {destination.canadianExpats || "Information not available"}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tips-info">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-purple-500" />
                        Local Tips
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      {destination.localTips || "Information not available"}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              
              <CardFooter className="flex justify-center pt-0">
                <SnowbirdCityButton
                  cityId={destination.id}
                  cityName={destination.name}
                  country={destination.country}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Additional Information Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Planning Your Perfect Winter Escape</h2>
            <p className="text-lg mb-6 text-center">
              Ready to transform your winter escape experience with a detailed, personalized guide?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-700 bg-opacity-90 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-blue-100">What You'll Discover</h3>
                <ul className="space-y-2 text-blue-50">
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>10+ specific restaurant recommendations with addresses and price ranges</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Detailed accommodation options with property contacts and neighborhood insights</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Canadian-friendly services and hidden gems to make your stay effortless</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-700 bg-opacity-90 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-blue-100">Trade The Headaches For Hammocks</h3>
                <ul className="space-y-2 text-blue-50">
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Practical tips for settling in, from visas to healthcare that welcomes Canadians</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Month-by-month activities to help you explore, connect, and relax</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Local Canadian community meetups and events calendar</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              {/* Sun and palm imagery */}
              <div className="flex justify-center gap-6 mb-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full"></div>
                  <div className="absolute inset-0 animate-ping bg-yellow-400 rounded-full opacity-75"></div>
                  <div className="absolute inset-2 bg-yellow-300 rounded-full"></div>
                </div>
                <img 
                  src="/images/palm-tree.svg" 
                  alt="Palm tree" 
                  className="h-16 w-auto"
                />
              </div>
              
              <p className="text-xl font-semibold mb-3">Tired of navigating trade wars and soaring costs?</p>
              <p className="mb-4">Our exclusive guides are your all-in-one resource for spending a seamless winter in your chosen destination, where sunny skies, vibrant culture, and a thriving Canadian community make it feel like a home away from home.</p>
              <p className="text-lg font-bold text-green-300">Just $19.99 for a complete premium destination guide</p>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        {showComparison && compareDestinations.length >= 2 && (
          <div id="comparison" className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Destination Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-blue-50">
                    <th className="text-left py-3 px-4 font-bold">Feature</th>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <th key={id} className="text-left py-3 px-4 font-bold">
                          {dest.name}, {dest.country}
                        </th>
                      ) : null;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Climate</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.avgWinterTemp}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Cost Comparison</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.costComparison}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Accommodation Cost</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.avgAccommodationCost}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Healthcare</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.healthcareAccess?.split('.')[0]}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Flight Time</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.flightTime}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Language</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.languageBarrier}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Canadian Community</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.canadianExpats}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Best Time to Visit</td>
                    {compareDestinations.map(id => {
                      const dest = destinations.find((d: SnowbirdDestination) => d.id === id);
                      return dest ? (
                        <td key={id} className="py-3 px-4">{dest.bestTimeToVisit}</td>
                      ) : null;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Explore Your Florida Alternatives?</h2>
            <p className="mb-6">
              Get personalized recommendations, visa guidance, and exclusive offers for Canadian snowbirds looking for their perfect winter home.
            </p>
            
            {/* Canadian Snowbird Checkbox - Always visible */}
            <div className="bg-blue-600 py-4 px-5 rounded-md mb-6 mx-auto max-w-xl border-2 border-yellow-400 shadow-lg">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <input 
                  type="checkbox" 
                  id="canadian_snowbird" 
                  name="canadian_snowbird"
                  className="w-6 h-6"
                  checked={isCanadianSnowbird}
                  onChange={(e) => setIsCanadianSnowbird(e.target.checked)}
                />
                <div className="flex flex-col text-left">
                  <label htmlFor="canadian_snowbird" className="text-sm md:text-base font-bold text-white">
                    I'm a Canadian looking for snowbird destinations
                  </label>
                  <span className="text-yellow-200 font-semibold text-sm mt-1">
                    Get a <span className="text-white text-base md:text-lg font-black bg-gradient-to-r from-green-500 to-green-600 px-2 py-0.5 rounded-md animate-pulse">FREE</span> Ultimate Canadian Snowbird Departure Checklist and Comparison Guide 
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full ml-2 text-xs font-bold">VALUE $16.99</span>
                  </span>
                </div>
              </div>
              
              {/* Download button always visible */}
              <Button 
                onClick={() => window.location.href = '/canadian-snowbird-success'} 
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <FaDownload className="mr-2" /> Download Your Free Canadian Guide Now
              </Button>
            </div>
            
            {showEmailSignup ? (
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white text-gray-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleEmailSignup} variant="secondary">
                  Subscribe
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowEmailSignup(true)} size="lg" variant="secondary">
                <FaEnvelope className="mr-2" /> Get Florida Alternative Updates
              </Button>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What are the main benefits of these alternatives compared to Florida?</AccordionTrigger>
              <AccordionContent>
                These destinations offer beautiful weather and beaches similar to Florida, but with additional benefits like lower costs of living, unique cultural experiences, and freedom from US-Canada political tensions. Many offer excellent healthcare systems, established expat communities, and special visa programs for retirees.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How does healthcare compare to what I'd receive in Florida?</AccordionTrigger>
              <AccordionContent>
                Healthcare quality varies by destination, but many offer excellent private healthcare at significantly lower costs than the US. Countries like Portugal, Costa Rica, and Panama have high-quality medical systems frequently used by expatriates. Most destinations have international hospitals with English-speaking staff, and private insurance is generally more affordable than in the US.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>What visa options are available for long-term stays?</AccordionTrigger>
              <AccordionContent>
                Many of these destinations offer special visa programs for retirees or long-term visitors. Portugal offers the D7 visa for those with passive income. Panama has the famous Pensionado program with significant benefits for retirees. Mexico offers temporary and permanent resident visas for those who can prove income. Most countries allow tourist stays of 30-180 days, with options to extend or apply for residency.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Are these destinations safe for Canadian snowbirds?</AccordionTrigger>
              <AccordionContent>
                The destinations featured are popular with expatriates and have established tourism infrastructure. Like anywhere, it's important to research specific neighborhoods and follow common safety practices. Many areas popular with snowbirds have lower crime rates than major North American cities, and the presence of established expatriate communities often indicates a comfortable safety level for visitors.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I maintain my Canadian residency status while being away?</AccordionTrigger>
              <AccordionContent>
                To maintain provincial health coverage and other benefits, most Canadian provinces require residents to be physically present for a minimum period each year (typically 5-6 months). It's important to check your specific province's requirements, maintain a permanent address in Canada, file taxes in Canada, and carefully track your days outside the country.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}