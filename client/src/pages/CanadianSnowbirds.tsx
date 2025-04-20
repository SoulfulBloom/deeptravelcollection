import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { 
  MapPin, 
  Sun, 
  DollarSign, 
  FileText, 
  Heart, 
  ArrowRight, 
  PlaneTakeoff, 
  ChevronRight, 
  Bird
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FaSnowflake, FaSuitcase, FaPassport, FaPlaneDeparture, FaHospital, FaMoneyBillWave } from 'react-icons/fa';
import { SnowbirdPremiumButton } from '@/components/snowbird/SnowbirdPaymentButton';
import { SnowbirdCityButton } from '@/components/snowbird/CityItineraryButton';
import snowbirdDestinations from '../data/snowbirdDestinations';

// Featured destinations from our data
const featuredDestinations = snowbirdDestinations
  .filter(destination => destination.featured)
  .slice(0, 4)
  .map(destination => ({
    id: destination.id,
    name: destination.name,
    country: destination.region === 'latin-america' ? 'Latin America' : 
            destination.region === 'europe' ? 'Europe' : 
            destination.region === 'asia' ? 'Asia' : 
            destination.region === 'caribbean' ? 'Caribbean' : 
            destination.region === 'africa' ? 'Africa' : 'Global',
    imageUrl: destination.thumbnailImage,
    description: destination.shortDescription,
    climate: destination.region === 'latin-america' || destination.region === 'caribbean' ? "25-30°C (77-86°F)" : 
            destination.region === 'europe' ? "15-20°C (59-68°F)" : 
            destination.region === 'asia' ? "22-28°C (72-82°F)" : "22-26°C (72-79°F)",
    costComparison: destination.benefits[0]
  }));

// Premium products
const products = [
  {
    id: "snowbird_toolkit",
    title: "Canadian Snowbird Toolkit",
    price: 9.99,
    description: "Essential guide with checklists, legal considerations, and destination comparisons for Canadian snowbirds.",
    icon: <FaSuitcase className="h-12 w-12 text-blue-600" />,
    features: [
      "Departure preparation checklist",
      "Home maintenance while away guide",
      "Province-by-province residency requirements",
      "Healthcare coverage comparison",
      "Tax considerations for snowbirds",
      "Budgeting tools for winter escapes"
    ]
  },
  {
    id: "pet_travel_guide",
    title: "Pet Travel Guide",
    price: 8.99,
    description: "Comprehensive guide for traveling with pets including airline policies, accommodation tips, and health considerations.",
    icon: <FaPassport className="h-12 w-12 text-green-600" />,
    features: [
      "Airline pet policies comparison",
      "Border crossing requirements by country",
      "Finding pet-friendly accommodations",
      "Veterinary records and preparations",
      "Emergency vet contacts in popular destinations",
      "Tips for keeping pets comfortable during travel"
    ]
  },
  {
    id: "digital_nomad_package",
    title: "Digital Nomad Transition Package",
    price: 39.99,
    originalPrice: 49.99,
    saleText: "20% OFF",
    description: "Complete toolkit for Canadians transitioning to digital nomad lifestyle with visa guidance and remote work setup.",
    icon: <FaPlaneDeparture className="h-12 w-12 text-purple-600" />,
    features: [
      "Digital nomad visa comparison by country",
      "Tax implications for Canadian remote workers",
      "Internet reliability rankings by destination",
      "Co-working space directories",
      "Banking and financial management abroad",
      "Health insurance options for long-term travelers"
    ]
  }
];

export default function CanadianSnowbirds() {
  // Update page title
  useEffect(() => {
    document.title = "Canadian Snowbird Resources | Deep Travel Collections";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-pattern-snowflakes opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">CANADIAN SNOWBIRDS</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Complete Guide to Winter Escapes
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-3xl">
              Discover exceptional destinations, practical resources, and expert guidance designed specifically for Canadians seeking warmth during winter months.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/canadian-snowbirds/destinations">
                <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
                  Explore Destinations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800" asChild>
                <Link href="#resources">
                  View Resources
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">DESTINATIONS</Badge>
            <h2 className="text-3xl font-bold mb-4">Featured Snowbird Alternatives</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore these exceptional alternatives to traditional U.S. destinations, offering better value, authentic experiences, and excellent healthcare.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={destination.imageUrl} 
                    alt={`${destination.name} - Snowbird destination`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white">{destination.name}, {destination.country}</h3>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-blue-50">
                      <Sun className="h-3 w-3 mr-1" /> {destination.climate}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50">
                      <DollarSign className="h-3 w-3 mr-1" /> {destination.costComparison}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Link href={`/canadian-snowbirds/destinations/${destination.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  {/* Default country for all snowbird destinations */}
                  <SnowbirdCityButton
                    cityId={destination.id}
                    cityName={destination.name}
                    country={"Canada"}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/canadian-snowbirds/destinations">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View All Destinations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section id="resources" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">RESOURCES</Badge>
            <h2 className="text-3xl font-bold mb-4">Premium Snowbird Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive guides and resources to make your winter escape successful, from pre-departure planning to settling in at your destination.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="relative overflow-hidden">
                {product.saleText && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {product.saleText}
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {product.icon}
                  </div>
                  <CardTitle className="text-center text-xl">{product.title}</CardTitle>
                  <CardDescription className="text-center">{product.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaSnowflake className="text-blue-500 mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="flex justify-center">
                  <Link href={`/direct-checkout?type=${product.id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 w-full">
                      Get Instant Access
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Consider Alternatives Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">ADVANTAGES</Badge>
            <h2 className="text-3xl font-bold mb-4">Why Consider Alternatives?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Many Canadian snowbirds are discovering compelling reasons to explore new destinations beyond the traditional U.S. options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Better Value</h3>
              <p className="text-gray-600">
                Many alternative destinations offer 30-70% lower costs than Florida, from accommodation to dining and healthcare.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHospital className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Healthcare</h3>
              <p className="text-gray-600">
                Access excellent healthcare at a fraction of U.S. costs, with many destinations offering high-quality medical facilities.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Authentic Experiences</h3>
              <p className="text-gray-600">
                Experience rich local cultures, unique cuisines, and meaningful interactions beyond typical tourist experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Immersive Experiences Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-2">DEEPER TRAVEL</Badge>
            <h2 className="text-3xl font-bold mb-4">Discover Our Immersive Experiences</h2>
            <p className="text-gray-700 mb-8">
              Beyond snowbird destinations, explore our curated collection of immersive travel experiences. 
              Enhance your stay with authentic cultural connections that take you beyond the expat bubble.
            </p>
            
            <div className="flex justify-center">
              <Link href="/immersive-experiences">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900">
                  GO DEEPER
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Winter Escape?</h2>
            <p className="text-lg mb-8">
              Explore our comprehensive destination guides, premium resources, and expert advice to make this winter your best one yet.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/canadian-snowbirds/destinations">
                <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
                  Explore Destinations
                </Button>
              </Link>
              
              <Link href="/direct-checkout?type=snowbird_toolkit">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
                  Get Snowbird Toolkit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}