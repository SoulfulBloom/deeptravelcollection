import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { 
  Sun, 
  DollarSign, 
  Heart, 
  MapPin, 
  Users, 
  ChevronRight,
  Search,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SnowbirdCityButton } from '@/components/snowbird/CityItineraryButton';

// Types and interfaces
type DestinationRegion = 'All' | 'North America' | 'Central America' | 'Caribbean' | 'South America' | 'Europe' | 'Asia';

interface SnowbirdDestination {
  id: number;
  name: string;
  country: string;
  region: string;
  slug: string;
  imagePath: string;
  description: string;
  climate: string;
  costSavings: string;
  healthcare: string;
  highlights: string[];
}

// Destination data
const destinations: SnowbirdDestination[] = [
  {
    id: 15, // Using existing database ID for Cuba
    name: "Varadero",
    country: "Cuba",
    region: "Caribbean",
    slug: "cuba",
    imagePath: "/images/destinations/thumbs/varadero.jpg",
    description: "White-sand beaches and rich culture at unbeatable prices, with excellent healthcare for visitors.",
    climate: "26-28°C (79-82°F)",
    costSavings: "40-50% lower than Canada",
    healthcare: "Good public healthcare system",
    highlights: ["Pristine beaches", "Affordable living", "Rich cultural experience"]
  },
  {
    id: 101, // Using ID from fallback data
    name: "Puerto Vallarta",
    country: "Mexico",
    region: "North America",
    slug: "mexico",
    imagePath: "/images/destinations/thumbs/puerto-vallarta.jpg",
    description: "A coastal paradise with beachfront living, vibrant culture, and established Canadian communities.",
    climate: "25°C (77°F)",
    costSavings: "25-35% lower than Canada",
    healthcare: "Excellent private hospitals",
    highlights: ["Strong Canadian presence", "Affordable living", "Direct flights from Canada"]
  },
  {
    id: 102,
    name: "San Jose",
    country: "Costa Rica",
    region: "Central America",
    slug: "costa-rica",
    imagePath: "/images/destinations/thumbs/san-jose.jpg",
    description: "Ecological paradise with perfect winter temperatures and exceptional healthcare at reasonable costs.",
    climate: "24°C (75°F)",
    costSavings: "20-30% lower than Canada",
    healthcare: "World-class healthcare system",
    highlights: ["Stable political climate", "Excellent healthcare", "Outdoor lifestyle"]
  },
  {
    id: 103,
    name: "Panama City",
    country: "Panama",
    region: "Central America",
    slug: "panama",
    imagePath: "/images/destinations/thumbs/panama-city.jpg",
    description: "Modern amenities with a tropical climate, using US currency, with an excellent retirement program.",
    climate: "28°C (82°F)",
    costSavings: "20-30% lower than Canada",
    healthcare: "High-quality private healthcare",
    highlights: ["Uses US dollar", "Pensionado visa program", "Developed infrastructure"]
  },
  {
    id: 104,
    name: "Punta Cana",
    country: "Dominican Republic",
    region: "Caribbean",
    slug: "dominican-republic",
    imagePath: "/images/destinations/thumbs/punta-cana.jpg",
    description: "Caribbean paradise with established snowbird communities and beautiful all-inclusive resorts.",
    climate: "27°C (81°F)",
    costSavings: "40-50% lower than Canada",
    healthcare: "Good private hospitals",
    highlights: ["All-inclusive options", "Affordable housing", "Direct flights from Canada"]
  },
  {
    id: 106,
    name: "Medellín",
    country: "Colombia",
    region: "South America",
    slug: "colombia",
    imagePath: "/images/destinations/thumbs/medellin.jpg",
    description: "The 'City of Eternal Spring' offers perfect year-round climate and emerging expat community.",
    climate: "22°C (72°F)",
    costSavings: "50-60% lower than Canada",
    healthcare: "Top-ranked healthcare system",
    highlights: ["Perfect weather year-round", "Modern infrastructure", "Rapidly growing expat community"]
  },
  {
    id: 107,
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    slug: "portugal",
    imagePath: "/images/destinations/thumbs/lisbon.jpg",
    description: "European charm with mild winters, established expat communities and Old World culture.",
    climate: "15°C (59°F)",
    costSavings: "30-40% lower than Canada",
    healthcare: "Excellent universal healthcare",
    highlights: ["European lifestyle", "Safe environment", "Rich history and culture"]
  },
  {
    id: 100, // Using ID from fallback data
    name: "Algarve",
    country: "Portugal",
    region: "Europe",
    slug: "algarve-portugal",
    imagePath: "/images/destinations/thumbs/algarve.jpg",
    description: "Mediterranean climate with 300+ days of sunshine and beautiful beaches along the Atlantic.",
    climate: "16°C (61°F)",
    costSavings: "30-40% lower than Canada",
    healthcare: "Excellent public healthcare",
    highlights: ["Mild winters", "Beautiful coastline", "Established expat community"]
  },
  {
    id: 108,
    name: "Chiang Mai",
    country: "Thailand",
    region: "Asia",
    slug: "thailand",
    imagePath: "/images/destinations/thumbs/chiang-mai.jpg",
    description: "Cultural hub with mountain temples, affordable living and excellent medical tourism facilities.",
    climate: "25°C (77°F)",
    costSavings: "60-70% lower than Canada",
    healthcare: "World-class medical tourism",
    highlights: ["Extremely affordable", "Rich cultural experience", "International standard healthcare"]
  },
  {
    id: 109,
    name: "Malaga",
    country: "Spain",
    region: "Europe",
    slug: "spain",
    imagePath: "/images/destinations/thumbs/malaga.jpg",
    description: "Costa del Sol offers 320 days of sunshine with Spanish culture and Mediterranean lifestyle.",
    climate: "17°C (63°F)",
    costSavings: "25-35% lower than Canada",
    healthcare: "Top-rated healthcare system",
    highlights: ["Mediterranean lifestyle", "Beautiful beaches", "European standard of living"]
  },
  {
    id: 110,
    name: "Penang",
    country: "Malaysia",
    region: "Asia",
    slug: "malaysia",
    imagePath: "/images/destinations/thumbs/coming-soon.jpg",
    description: "Island living with multicultural atmosphere, excellent food, and MM2H visa program.",
    climate: "28°C (82°F)",
    costSavings: "50-60% lower than Canada",
    healthcare: "Medical tourism destination",
    highlights: ["Malaysia My Second Home program", "English widely spoken", "Multicultural environment"]
  },
  {
    id: 111,
    name: "Belize City",
    country: "Belize",
    region: "Central America",
    slug: "belize",
    imagePath: "/images/destinations/thumbs/coming-soon.jpg",
    description: "English-speaking Caribbean paradise with established expat communities and QRP program.",
    climate: "27°C (81°F)",
    costSavings: "30-40% lower than Canada",
    healthcare: "Good private healthcare",
    highlights: ["English is official language", "Qualified Retirement Program", "Caribbean lifestyle"]
  },
  {
    id: 112,
    name: "Cuenca",
    country: "Ecuador",
    region: "South America",
    slug: "ecuador",
    imagePath: "/images/destinations/thumbs/coming-soon.jpg",
    description: "UNESCO World Heritage city with spring-like climate year-round and low cost of living.",
    climate: "21°C (70°F)",
    costSavings: "60-70% lower than Canada",
    healthcare: "High-quality, affordable healthcare",
    highlights: ["Use US dollar as currency", "Colonial architecture", "Growing expat community"]
  }
];

export default function CanadianSnowbirdDestinations() {
  const [activeRegion, setActiveRegion] = useState<DestinationRegion>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<SnowbirdDestination[]>(destinations);

  // Filter destinations based on region and search query
  useEffect(() => {
    let filtered = destinations;
    
    // Apply region filter (if not 'All')
    if (activeRegion !== 'All') {
      filtered = filtered.filter(destination => destination.region === activeRegion);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        destination => 
          destination.name.toLowerCase().includes(query) || 
          destination.country.toLowerCase().includes(query) ||
          destination.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredDestinations(filtered);
  }, [activeRegion, searchQuery]);

  // Update page title
  useEffect(() => {
    document.title = "Alternative Destinations for Canadian Snowbirds | Deep Travel Collections";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('/images/snowbird/hero-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-blue-700 rounded-full text-xs font-semibold mb-6">
              BEYOND FLORIDA
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Alternative Destinations for Canadian Snowbirds
            </h1>
            
            <p className="text-xl opacity-90 mb-8">
              Discover exceptional winter escapes with better value, authentic cultures, and excellent healthcare compared to traditional U.S. options.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#destinations">
                <Button size="lg" variant="default" className="bg-white text-blue-800 hover:bg-blue-50">
                  Explore Destinations
                </Button>
              </Link>
              
              <Link href="#comparison">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
                  Compare Options
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Consider Alternatives Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Consider Alternatives to Florida?</h2>
            <p className="text-gray-600">
              Many Canadian snowbirds are discovering compelling reasons to explore new destinations beyond the traditional U.S. options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Better Value</h3>
              <p className="text-gray-600">
                Many alternative destinations offer 30-70% lower costs than Florida, from accommodation to dining and healthcare.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
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
      
      {/* Destinations Section */}
      <section id="destinations" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse Snowbird Destinations</h2>
            <p className="text-gray-600">
              Explore our curated selection of winter escapes perfect for Canadian snowbirds.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="relative md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Tabs defaultValue="All" className="w-full md:w-auto">
                <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-7 h-auto">
                  <TabsTrigger 
                    value="All" 
                    onClick={() => setActiveRegion('All')}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="North America" 
                    onClick={() => setActiveRegion('North America')}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    North America
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Central America" 
                    onClick={() => setActiveRegion('Central America')}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Central America
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Caribbean" 
                    onClick={() => setActiveRegion('Caribbean')}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Caribbean
                  </TabsTrigger>
                  <TabsTrigger 
                    value="South America" 
                    onClick={() => setActiveRegion('South America')}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    South America
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Europe" 
                    onClick={() => setActiveRegion('Europe')}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Europe
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Asia" 
                    onClick={() => setActiveRegion('Asia')}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Asia
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Results info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
                {activeRegion !== 'All' ? ` in ${activeRegion}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </p>
              
              <p className="text-sm text-gray-600">
                Click on any destination to view detailed information
              </p>
            </div>
          </div>
          
          {/* Destination Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${destination.imagePath})` }}
                >
                  {destination.imagePath.includes('coming-soon') && (
                    <div className="absolute top-0 right-0 p-2 bg-blue-500 text-white text-xs font-bold rounded-bl-lg">
                      COMING SOON
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-xl font-bold text-white">{destination.name}, {destination.country}</h3>
                    <div className="flex items-center text-sm text-white/80">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{destination.region}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <div className="flex flex-wrap mb-4 gap-2">
                    <Badge variant="outline" className="bg-blue-50">
                      <Sun className="h-3 w-3 mr-1" /> {destination.climate}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50">
                      <DollarSign className="h-3 w-3 mr-1" /> {destination.costSavings}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  
                  <div className="space-y-2">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 flex flex-wrap gap-2 justify-between">
                  {destination.imagePath.includes('coming-soon') ? (
                    <Button variant="outline" size="sm" className="flex items-center opacity-50 cursor-not-allowed" disabled>
                      Coming Soon
                      <Clock className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Link href={`/canadian-snowbirds/destinations/${destination.slug}`}>
                      <Button variant="outline" size="sm" className="flex items-center">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                  
                  <SnowbirdCityButton
                    cityId={destination.id}
                    cityName={destination.name}
                    country={destination.country}
                    disabled={destination.imagePath.includes('coming-soon')}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* No results */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12 bg-gray-100 rounded-lg">
              <p className="text-gray-600 mb-4">No destinations found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveRegion('All');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Common Questions About Snowbird Alternatives</h2>
            <p className="text-gray-600">
              Answers to frequently asked questions from Canadian snowbirds exploring new destinations.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            <div className="py-6">
              <h3 className="text-xl font-bold mb-2">How does healthcare work outside the U.S.?</h3>
              <p className="text-gray-600">
                Many alternative destinations offer high-quality healthcare at a fraction of U.S. costs. Most require travel insurance, but out-of-pocket expenses tend to be much lower. Countries like Mexico, Costa Rica, and Thailand have excellent private hospitals catering to foreigners. Our destination guides include detailed healthcare information for each location.
              </p>
            </div>
            
            <div className="py-6">
              <h3 className="text-xl font-bold mb-2">Can I maintain my Canadian residency status?</h3>
              <p className="text-gray-600">
                Yes, most Canadian provinces allow you to be absent for up to 6-7 months (depending on your province) while maintaining your healthcare coverage. It's important to check your specific provincial requirements and keep records of your travel dates. Some countries offer special visas for retirees or long-term visitors.
              </p>
            </div>
            
            <div className="py-6">
              <h3 className="text-xl font-bold mb-2">Are there established Canadian communities?</h3>
              <p className="text-gray-600">
                Absolutely! Many destinations on our list have thriving Canadian expat communities with regular meetups, social events, and support networks. Places like Puerto Vallarta (Mexico), Algarve (Portugal), and Chiang Mai (Thailand) have significant Canadian populations during winter months. These communities can be invaluable for newcomers adjusting to life abroad.
              </p>
            </div>
            
            <div className="py-6">
              <h3 className="text-xl font-bold mb-2">What about safety concerns?</h3>
              <p className="text-gray-600">
                While safety varies by location, most popular snowbird destinations have areas that are very safe for foreign residents. Our guides highlight the safest neighborhoods and regions within each destination. Many snowbirds report feeling safer in their international communities than in some parts of the U.S., particularly in gated communities and expat-friendly areas.
              </p>
            </div>
            
            <div className="py-6">
              <h3 className="text-xl font-bold mb-2">How do the costs compare to Florida?</h3>
              <p className="text-gray-600">
                Most alternative destinations offer significant cost savings compared to Florida. Depending on the location, you might save 30-70% on accommodations, dining, entertainment, and healthcare. For example, a comfortable 2-bedroom apartment that might cost $3,000/month in Florida could be $1,200-1,500 in Mexico or Panama, or as low as $600-800 in Thailand or Ecuador.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore Your Options?</h2>
            <p className="text-xl opacity-90 mb-8">
              Get our comprehensive destination guides with insider tips, practical advice, and detailed information to plan your perfect winter escape.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
                Browse Comprehensive Guides
              </Button>
              
              <Link href="/destination-finder">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
                  Take Destination Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}