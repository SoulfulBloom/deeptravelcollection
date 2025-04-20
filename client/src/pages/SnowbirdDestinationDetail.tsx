import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { 
  Thermometer, 
  DollarSign, 
  Heart, 
  MapPin, 
  Users, 
  ChevronRight,
  Globe,
  Sun,
  Home,
  Stethoscope,
  ShieldCheck,
  Utensils,
  Bus,
  PiggyBank,
  Calendar,
  BarChart,
  Check,
  ChevronDown
} from 'lucide-react';
import snowbirdDestinations, { getDestinationById } from '../data/snowbirdDestinations';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SnowbirdCityButton } from '@/components/snowbird/CityItineraryButton';
import { GuidePurchaseCard } from '@/components/GuidePurchaseCard';

// Default destination as a fallback
const mexicoDestination = {
  id: "mexico",
  name: "Puerto Vallarta",
  country: "Mexico",
  region: "North America",
  slug: "mexico",
  imagePath: "/images/destinations/mexico.jpg",
  heroImage: "/images/destinations/mexico-hero.jpg",
  tagline: "Beachfront Paradise with Established Canadian Communities",
  overview: "Puerto Vallarta offers Canadian snowbirds a perfect blend of tropical climate, beautiful beaches, and modern amenities at a fraction of the cost of Florida. With a large Canadian expat community, English is widely spoken, making the transition easy for newcomers.",
  statistics: {
    averageWinterTemp: "25°C (77°F)",
    costComparedToUS: "25-35% lower",
    flightTimeFromToronto: "4.5 hours",
    canadianPopulation: "~20,000 during winter",
    timeZone: "Same as CST (No jet lag from most of Canada)",
    internetSpeed: "50-100 Mbps in major areas"
  },
  sections: {
    healthcare: {
      quality: "Good private hospitals with international standards",
      englishSpeaking: "Many doctors are bilingual or trained in the US/Canada",
      insurance: "Most Canadian travel insurance accepted at private facilities",
      costs: "70-80% less than US medical costs",
      facilities: ["Hospital San Javier", "IMSS Hospital", "Medasist Hospital", "Cornerstone Hospital"],
      notes: "Puerto Vallarta has been developing its medical tourism infrastructure, making it a reliable option for snowbirds with pre-existing conditions."
    },
    costOfLiving: {
      overall: "About 30% lower than Florida",
      housing: {
        monthlyRental: "$800-1,500 USD for a 2-bedroom condo",
        utilities: "$100-150 USD/month including internet",
        areas: ["Marina Vallarta", "Fluvial", "Versalles", "Romantic Zone"]
      },
      food: {
        groceries: "$200-300 USD/month",
        diningOut: "$5-15 USD for local meals, $15-30 USD for international restaurants",
        markets: ["Emiliano Zapata Market", "La Comer", "Costco", "Walmart"]
      },
      transportation: {
        localBus: "$0.50 USD per ride",
        taxi: "$3-7 USD for most trips within the city",
        carRental: "$25-40 USD per day"
      },
      entertainment: {
        activities: "$10-30 USD for tours and activities",
        gym: "$30-50 USD monthly membership",
        movies: "$4-6 USD per ticket"
      }
    },
    canadianCommunity: {
      size: "Large and well-established",
      organizations: ["Canadian Club of Puerto Vallarta", "Canadian Society", "Rotary Club"],
      events: ["Canada Day celebrations", "Weekly meetups", "Charity events"],
      businesses: ["Canadian-owned restaurants", "Real estate agencies", "Tour companies"],
      resources: ["Canadian Consulate in Puerto Vallarta", "Canadian newspapers", "English-language church services"]
    },
    localTips: {
      neighborhoods: {
        best: ["Marina Vallarta", "Nuevo Vallarta", "Fluvial", "Romantic Zone"],
        why: "These areas offer good security, amenities, and established expat communities"
      },
      transportation: {
        recommended: "Combination of walking, buses, and occasional taxis",
        apps: ["Uber", "InDriver", "DiDi"]
      },
      language: {
        english: "Widely spoken in tourist and expat areas",
        spanish: "Basic Spanish helpful but not essential"
      },
      safety: {
        rating: "Generally very safe in tourist and residential areas",
        precautions: "Standard city precautions apply - don't flash valuables, be aware at night"
      },
      seasonal: {
        bestMonths: "November to April (dry season)",
        events: ["Gourmet Festival (November)", "Candlearia (February)", "Semana Santa (Easter)"],
        weather: "December-March are the most pleasant and dry months"
      },
      mustVisit: ["Malecón Boardwalk", "Zona Romántica", "Botanical Gardens", "Marietas Islands", "Vallarta Botanical Gardens"]
    }
  },
  testimonials: [
    {
      quote: "We've been coming to Puerto Vallarta for five winters now instead of Florida. We save at least $1,000 a month on our condo rental and have made wonderful friends in the Canadian community here.",
      author: "Margaret and Tom R., Edmonton",
      yearsSnowhbirding: 5
    },
    {
      quote: "The healthcare system impressed me when I needed treatment for a minor injury. My insurance covered it completely, and the doctor spoke perfect English. It was more personal care than I get at home!",
      author: "David L., Winnipeg",
      yearsSnowhbirding: 3
    },
    {
      quote: "We were worried about the language barrier but found Puerto Vallarta extremely easy to navigate. Most people in restaurants and shops speak English, and we've found the Mexican people incredibly welcoming.",
      author: "Susan and James K., Vancouver",
      yearsSnowhbirding: 2
    }
  ],
  sampleItinerary: {
    title: "A Typical Day in Puerto Vallarta",
    items: [
      { time: "7:30 AM", activity: "Morning walk along the Malecón boardwalk" },
      { time: "9:00 AM", activity: "Breakfast at a local café (try Fredy's Tucan or The Pancake House)" },
      { time: "10:30 AM", activity: "Shopping at the local markets or beach time" },
      { time: "1:00 PM", activity: "Lunch at one of the beachfront restaurants" },
      { time: "3:00 PM", activity: "Afternoon activities: golf, spa, or cultural sites" },
      { time: "6:00 PM", activity: "Sunset drinks at a marina restaurant" },
      { time: "8:00 PM", activity: "Dinner and evening entertainment in Zona Romántica" }
    ]
  },
  faqs: [
    {
      question: "How long can I legally stay in Mexico as a Canadian?",
      answer: "Canadians can stay in Mexico for up to 180 days (approximately 6 months) with a tourist visa, which is obtained upon arrival. This makes it perfect for the typical snowbird season."
    },
    {
      question: "Do I need to speak Spanish to get by in Puerto Vallarta?",
      answer: "No, English is widely spoken in Puerto Vallarta, especially in areas popular with tourists and expats. Learning some basic Spanish phrases is helpful and appreciated by locals, but you can easily get by with English."
    },
    {
      question: "Is it safe to drink the water?",
      answer: "It's recommended to drink bottled water in Puerto Vallarta. Most condos and homes for rent have water filtration systems or provide purified water. Bottled water is inexpensive and readily available."
    },
    {
      question: "How is the internet connectivity for remote work?",
      answer: "Internet service in Puerto Vallarta is generally reliable and fast in most areas, particularly in the main tourist and expat zones. Many rental properties and condos offer high-speed internet, making it feasible for remote work."
    },
    {
      question: "Can I maintain my Canadian residency while spending winters in Mexico?",
      answer: "Yes, most Canadian provinces allow you to be absent for up to 7 months (depending on your province) while maintaining your provincial healthcare coverage. Be sure to check your specific provincial requirements before planning your stay."
    }
  ]
};

export default function SnowbirdDestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState(mexicoDestination);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load destination data based on the slug parameter
    if (slug) {
      // Find the destination in our array
      const newDestinationData = getDestinationById(slug);
      
      if (newDestinationData) {
        // Create a compatible destination object based on the structure needed by this component
        const formattedDestination = {
          id: newDestinationData.id,
          name: newDestinationData.name,
          country: newDestinationData.region === 'latin-america' ? 'Mexico' : 
                  newDestinationData.region === 'europe' ? 'Europe' :
                  newDestinationData.region === 'asia' ? 'Asia' :
                  newDestinationData.region === 'caribbean' ? 'Caribbean' : 'Other',
          region: newDestinationData.region === 'latin-america' ? "Latin America" : 
                  newDestinationData.region === 'europe' ? "Europe" :
                  newDestinationData.region === 'asia' ? "Asia" :
                  newDestinationData.region === 'caribbean' ? "Caribbean" : "Other",
          slug: newDestinationData.id,
          imagePath: newDestinationData.thumbnailImage,
          heroImage: newDestinationData.headerImage,
          tagline: newDestinationData.shortDescription,
          overview: newDestinationData.shortDescription,
          statistics: {
            averageWinterTemp: newDestinationData.region === 'latin-america' ? "25-30°C (77-86°F)" : 
                              newDestinationData.region === 'europe' ? "15-20°C (59-68°F)" : 
                              newDestinationData.region === 'asia' ? "22-28°C (72-82°F)" : "22-26°C (72-79°F)",
            costComparedToUS: newDestinationData.benefits[0] || "Varies by location",
            flightTimeFromToronto: newDestinationData.region === 'latin-america' ? "4-6 hours" :
                                  newDestinationData.region === 'europe' ? "7-9 hours" :
                                  newDestinationData.region === 'asia' ? "14-18 hours" :
                                  newDestinationData.region === 'caribbean' ? "4-5 hours" : "Varies",
            canadianPopulation: "Established Canadian community",
            timeZone: newDestinationData.region === 'latin-america' ? "Similar to North American time zones" :
                     newDestinationData.region === 'europe' ? "5-7 hours ahead of Eastern Time" :
                     newDestinationData.region === 'asia' ? "12-14 hours ahead of Eastern Time" :
                     newDestinationData.region === 'caribbean' ? "Same as Eastern Time" : "Varies",
            internetSpeed: "Good connectivity in major areas"
          },
          sections: {
            healthcare: {
              quality: "Good private hospitals with international standards",
              englishSpeaking: "Many doctors speak English in tourist and expat areas",
              insurance: "Most Canadian travel insurance accepted at private facilities",
              costs: "Significantly lower than US medical costs",
              facilities: ["Private Hospitals", "Medical Clinics", "Specialist Centers"],
              notes: "Always verify your insurance coverage before traveling."
            },
            costOfLiving: {
              overall: newDestinationData.region === 'latin-america' ? "About 30-40% lower than Florida" :
                      newDestinationData.region === 'europe' ? "About 10-25% lower than Florida" :
                      newDestinationData.region === 'asia' ? "About 40-60% lower than Florida" : "Varies by location",
              housing: {
                monthlyRental: "$500-1500 USD depending on location and size",
                utilities: "$100-150 USD/month including internet",
                areas: ["Popular Expat Areas", "Tourist Districts", "Residential Neighborhoods"]
              },
              food: {
                groceries: "$200-300 USD/month",
                diningOut: "$5-15 USD for local meals, $15-30 USD for international restaurants",
                markets: ["Local markets", "Supermarkets"]
              },
              transportation: {
                localBus: "$0.50-2 USD per ride",
                taxi: "$3-10 USD for most trips within the city",
                carRental: "$25-40 USD per day"
              },
              entertainment: {
                activities: "$10-30 USD for tours and activities",
                gym: "$30-50 USD monthly membership",
                movies: "$4-8 USD per ticket"
              }
            },
            canadianCommunity: {
              size: "Growing and well-established",
              organizations: ["Canadian Expat Communities", "Local Meetups", "Online Groups"],
              events: ["Canada Day celebrations", "Weekly meetups", "Local events"],
              businesses: ["Canadian-owned restaurants", "Real estate agencies", "Tour companies"],
              resources: ["Canadian Consulate services", "Canadian newspapers", "English-language church services"]
            },
            localTips: {
              neighborhoods: {
                best: ["Popular Areas", "Tourist Districts", "Expat Communities"],
                why: "These areas offer good security, amenities, and established expat communities"
              },
              transportation: {
                recommended: "Combination of walking, public transport, and occasional taxis",
                apps: ["Uber", "Local taxi apps"]
              },
              language: {
                english: "Widely spoken in tourist and expat areas",
                spanish: "Basic Spanish helpful but not essential"
              },
              safety: {
                rating: "Generally very safe in tourist and residential areas",
                precautions: "Standard city precautions apply - don't flash valuables, be aware at night"
              },
              seasonal: {
                bestMonths: "November to April (dry season)",
                events: ["Local Festivals", "Cultural Events", "Holiday Celebrations"],
                weather: "Warm and dry during winter months"
              },
              mustVisit: ["Local attractions", "Nature sites", "Cultural centers"]
            }
          },
          testimonials: [
            {
              quote: "We've been coming here instead of Florida for several winters now. We save significantly on our living costs and have made wonderful friends in the Canadian community.",
              author: "Canadian Snowbird",
              yearsSnowhbirding: 3
            }
          ],
          sampleItinerary: {
            title: `A Typical Day in ${newDestinationData.name}`,
            items: [
              { time: "7:30 AM", activity: "Morning walk or beach time" },
              { time: "9:00 AM", activity: "Breakfast at a local café" },
              { time: "10:30 AM", activity: "Shopping at the local markets or sightseeing" },
              { time: "1:00 PM", activity: "Lunch at a local restaurant" },
              { time: "3:00 PM", activity: "Afternoon activities: exploring, relaxing, or cultural sites" },
              { time: "6:00 PM", activity: "Sunset drinks" },
              { time: "8:00 PM", activity: "Dinner and evening entertainment" }
            ]
          },
          faqs: [
            {
              question: "How long can I legally stay as a Canadian?",
              answer: "Canadians can typically stay for up to 6 months with a tourist visa in most destinations. Always check the specific country requirements before traveling."
            },
            {
              question: "Do I need to speak the local language?",
              answer: "No, English is widely spoken in most tourist and expat areas. Learning some basic local phrases is helpful and appreciated by locals, but you can generally get by with English."
            },
            {
              question: "Can I maintain my Canadian residency while spending winters abroad?",
              answer: "Yes, most Canadian provinces allow you to be absent for up to 7 months (depending on your province) while maintaining your provincial healthcare coverage. Be sure to check your specific provincial requirements before planning your stay."
            }
          ]
        };
        
        setDestination(formattedDestination);
      } else {
        // If the slug doesn't match our data, default to mexico data
        setDestination({...mexicoDestination, slug: slug || "mexico"});
      }
    }
    
    setLoading(false);
    
    // Update page title
    document.title = `${slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Destination"} - Canadian Snowbird Guide | Deep Travel Collections`;
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={destination.imagePath} 
            alt={`${destination.name} - Snowbird destination`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Link href="/canadian-snowbirds/destinations">
                <span className="flex items-center text-gray-300 hover:text-white text-sm font-medium">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to All Destinations
                </span>
              </Link>
              <Separator orientation="vertical" className="mx-2 h-4 bg-gray-400" />
              <span className="text-gray-300 text-sm">{destination.region}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {destination.name}, {destination.country}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              {destination.tagline}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-2">
                <Thermometer className="h-4 w-4 mr-2" /> 
                {destination.statistics.averageWinterTemp}
              </Badge>
              
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-2">
                <DollarSign className="h-4 w-4 mr-2" /> 
                {destination.statistics.costComparedToUS} than U.S.
              </Badge>
              
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-2">
                <Users className="h-4 w-4 mr-2" /> 
                {destination.statistics.canadianPopulation} Canadians
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <SnowbirdCityButton
                cityId={destination.id}
                cityName={destination.name}
                country={destination.country}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Destination Overview</h2>
            <p className="text-lg text-gray-700 mb-8">
              {destination.overview}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold">Location</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>Region: <strong>{destination.region}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>Time Zone: <strong>{destination.statistics.timeZone}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>Flight from Toronto: <strong>{destination.statistics.flightTimeFromToronto}</strong></span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Sun className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-bold">Climate</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Winter Temperature: <strong>{destination.statistics.averageWinterTemp}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Best Months: <strong>{destination.sections.localTips.seasonal.bestMonths}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Weather: <strong>{destination.sections.localTips.seasonal.weather}</strong></span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Home className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold">Community</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-1">•</span>
                    <span>Canadian Population: <strong>{destination.statistics.canadianPopulation}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-1">•</span>
                    <span>Canadian Organizations: <strong>{destination.sections.canadianCommunity.organizations.length}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-1">•</span>
                    <span>Internet: <strong>{destination.statistics.internetSpeed}</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Section with Expandable Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Healthcare Section */}
            <Accordion type="single" collapsible className="mb-8 bg-white rounded-lg shadow-sm">
              <AccordionItem value="healthcare" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Stethoscope className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">Healthcare Access</h3>
                      <p className="text-sm text-gray-500">Quality, facilities, and insurance information</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Quality Rating</h4>
                        <p className="text-gray-700">{destination.sections.healthcare.quality}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">English-Speaking Providers</h4>
                        <p className="text-gray-700">{destination.sections.healthcare.englishSpeaking}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Insurance Compatibility</h4>
                        <p className="text-gray-700">{destination.sections.healthcare.insurance}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Cost Comparison</h4>
                        <p className="text-gray-700">{destination.sections.healthcare.costs}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Notable Medical Facilities</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {destination.sections.healthcare.facilities.map((facility, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {facility}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h4 className="font-semibold mb-2">Important Notes</h4>
                      <p className="text-gray-700">{destination.sections.healthcare.notes}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Cost of Living Section */}
            <Accordion type="single" collapsible className="mb-8 bg-white rounded-lg shadow-sm">
              <AccordionItem value="cost-of-living" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <PiggyBank className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">Cost of Living</h3>
                      <p className="text-sm text-gray-500">Housing, food, transportation and entertainment costs</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Overall Comparison</h4>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-gray-700 font-medium">
                          {destination.sections.costOfLiving.overall} than typical Florida snowbird destinations
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Housing <span className="text-sm font-normal text-gray-500">(Monthly Costs)</span></h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="mb-2">
                          <span className="font-medium">Monthly Rental:</span> {destination.sections.costOfLiving.housing.monthlyRental}
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Utilities:</span> {destination.sections.costOfLiving.housing.utilities}
                        </p>
                        <p>
                          <span className="font-medium">Popular Areas:</span> {destination.sections.costOfLiving.housing.areas.join(', ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Food & Dining</h4>
                        <p className="mb-1"><span className="font-medium">Groceries:</span> {destination.sections.costOfLiving.food.groceries}</p>
                        <p className="mb-1"><span className="font-medium">Dining Out:</span> {destination.sections.costOfLiving.food.diningOut}</p>
                        <p><span className="font-medium">Markets:</span> {destination.sections.costOfLiving.food.markets.join(', ')}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Transportation</h4>
                        <p className="mb-1"><span className="font-medium">Local Bus:</span> {destination.sections.costOfLiving.transportation.localBus}</p>
                        <p className="mb-1"><span className="font-medium">Taxi:</span> {destination.sections.costOfLiving.transportation.taxi}</p>
                        <p><span className="font-medium">Car Rental:</span> {destination.sections.costOfLiving.transportation.carRental}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Entertainment</h4>
                        <p className="mb-1"><span className="font-medium">Activities:</span> {destination.sections.costOfLiving.entertainment.activities}</p>
                        <p className="mb-1"><span className="font-medium">Gym:</span> {destination.sections.costOfLiving.entertainment.gym}</p>
                        <p><span className="font-medium">Movies:</span> {destination.sections.costOfLiving.entertainment.movies}</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex items-center mb-4">
                        <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold">Monthly Budget Comparison (Couple)</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Florida (Fort Myers)</h5>
                          <ul className="space-y-1">
                            <li className="flex justify-between">
                              <span>Housing:</span>
                              <span>$2,100</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Utilities:</span>
                              <span>$250</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Food:</span>
                              <span>$800</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Transportation:</span>
                              <span>$350</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Entertainment:</span>
                              <span>$500</span>
                            </li>
                            <li className="flex justify-between font-semibold border-t border-gray-300 mt-2 pt-2">
                              <span>Total:</span>
                              <span>$4,000</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">{destination.name}</h5>
                          <ul className="space-y-1">
                            <li className="flex justify-between">
                              <span>Housing:</span>
                              <span>$1,200</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Utilities:</span>
                              <span>$150</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Food:</span>
                              <span>$600</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Transportation:</span>
                              <span>$200</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Entertainment:</span>
                              <span>$400</span>
                            </li>
                            <li className="flex justify-between text-green-700 font-semibold border-t border-gray-300 mt-2 pt-2">
                              <span>Total:</span>
                              <span>$2,550</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">*Estimated average monthly expenses based on a couple living in a 2-bedroom accommodation.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Canadian Community Section */}
            <Accordion type="single" collapsible className="mb-8 bg-white rounded-lg shadow-sm">
              <AccordionItem value="canadian-community" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">Canadian Community</h3>
                      <p className="text-sm text-gray-500">Expat population, organizations, and support resources</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Community Size</h4>
                        <p className="text-gray-700">{destination.sections.canadianCommunity.size}</p>
                        <p className="text-gray-700 mt-1">
                          Approximate winter population: {destination.statistics.canadianPopulation}
                        </p>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-md">
                        <h4 className="font-semibold mb-2">Canadian Organizations</h4>
                        <ul className="space-y-1">
                          {destination.sections.canadianCommunity.organizations.map((org, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              {org}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Regular Events & Meetups</h4>
                        <ul className="space-y-1">
                          {destination.sections.canadianCommunity.events.map((event, index) => (
                            <li key={index} className="flex items-center">
                              <Calendar className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Canadian-Owned Businesses</h4>
                        <ul className="space-y-1">
                          {destination.sections.canadianCommunity.businesses.map((business, index) => (
                            <li key={index} className="flex items-center">
                              <DollarSign className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {business}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Support Resources</h4>
                      <ul className="space-y-1">
                        {destination.sections.canadianCommunity.resources.map((resource, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h4 className="font-semibold mb-2">Getting Connected</h4>
                      <p className="text-gray-700">
                        Most new Canadian arrivals connect through Facebook groups, local meetups at restaurants and cafes, 
                        and through the Canadian Club events. Many snowbirds report making lifelong friends within their first 
                        month in {destination.name}.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Local Tips Section */}
            <Accordion type="single" collapsible className="mb-8 bg-white rounded-lg shadow-sm">
              <AccordionItem value="local-tips" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">Local Tips</h3>
                      <p className="text-sm text-gray-500">Neighborhoods, transportation, safety, and must-visit locations</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Best Neighborhoods for Snowbirds</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h5 className="font-medium mb-2">Recommended Areas</h5>
                          <ul className="space-y-1">
                            {destination.sections.localTips.neighborhoods.best.map((neighborhood, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                                {neighborhood}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Why These Areas?</h5>
                          <p className="text-gray-700">{destination.sections.localTips.neighborhoods.why}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Transportation</h4>
                        <p className="mb-2">
                          <span className="font-medium">Recommended:</span> {destination.sections.localTips.transportation.recommended}
                        </p>
                        <p>
                          <span className="font-medium">Useful Apps:</span> {destination.sections.localTips.transportation.apps.join(', ')}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Language</h4>
                        <p className="mb-2">
                          <span className="font-medium">English:</span> {destination.sections.localTips.language.english}
                        </p>
                        <p>
                          <span className="font-medium">Local Language:</span> {destination.sections.localTips.language.spanish}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Safety</h4>
                        <p className="mb-2">
                          <span className="font-medium">Rating:</span> {destination.sections.localTips.safety.rating}
                        </p>
                        <p>
                          <span className="font-medium">Precautions:</span> {destination.sections.localTips.safety.precautions}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Seasonal Considerations</h4>
                        <p className="mb-2">
                          <span className="font-medium">Best Months:</span> {destination.sections.localTips.seasonal.bestMonths}
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Weather:</span> {destination.sections.localTips.seasonal.weather}
                        </p>
                        <h5 className="font-medium mb-1 mt-3">Local Events & Festivals</h5>
                        <ul className="space-y-1">
                          {destination.sections.localTips.seasonal.events.map((event, index) => (
                            <li key={index} className="flex items-center">
                              <Calendar className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Must-Visit Locations</h4>
                        <ul className="space-y-1">
                          {destination.sections.localTips.mustVisit.map((location, index) => (
                            <li key={index} className="flex items-start">
                              <MapPin className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              {location}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Sample Itinerary Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Sample Day in {destination.name}</h2>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-[15px] md:left-1/2 w-0.5 bg-blue-200"></div>
              <div className="space-y-8">
                {destination.sampleItinerary.items.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="relative flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 border-2 border-blue-300 z-10 flex items-center justify-center text-sm font-medium text-blue-700">
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-6 bg-blue-50 p-4 rounded-lg shadow-sm flex-grow">
                      <div className="text-sm font-medium text-blue-700 mb-1">{item.time}</div>
                      <div className="text-gray-700">{item.activity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-4">
                This is just a glimpse of a typical day in {destination.name}. Our complete guide includes detailed recommendations 
                for each month of your stay, with specific activities, restaurants, and local tips.
              </p>
              <SnowbirdCityButton
                cityId={destination.id}
                cityName={destination.name}
                country={destination.country}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What Canadian Snowbirds Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destination.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="italic text-gray-700 mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.yearsSnowhbirding} {testimonial.yearsSnowhbirding === 1 ? 'year' : 'years'} in {destination.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {destination.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="bg-gray-50 rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-100 hover:no-underline">
                    <div className="text-left font-medium text-lg">
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-0">
                    <p className="text-gray-700">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Guide Purchase Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Get Your Complete {destination.name} Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">What's Included in Your Guide:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>3-month comprehensive itinerary for {destination.name}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Canadian-specific healthcare guidance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Detailed cost of living breakdown</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Housing recommendations and rental tips</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Canadian community connections</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Lifetime access to guide updates</span>
                  </li>
                </ul>
              </div>
              <GuidePurchaseCard 
                guideId={destination.id.toString()}
                title={`${destination.name}, ${destination.country} Snowbird Guide`}
                description={`Comprehensive 3-month guide for Canadian snowbirds looking to spend winter in ${destination.name}. Includes healthcare, housing, and local community information.`}
                price={24.99}
                imageUrl={destination.imagePath}
                guideType="snowbird"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience {destination.name}?</h2>
            <p className="text-xl opacity-90 mb-8">
              Get our comprehensive guide with detailed recommendations, local insights, and practical information 
              to help you plan your perfect snowbird escape.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <SnowbirdCityButton
                cityId={destination.id}
                cityName={destination.name}
                country={destination.country}
              />
              
              <Link href="/canadian-snowbirds/destinations">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-800">
                  Explore More Destinations
                </Button>
              </Link>
            </div>
            
            <p className="mt-8 text-sm opacity-80">
              Our guides are created by Canadian travel experts with on-the-ground experience and are updated regularly to ensure accuracy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}