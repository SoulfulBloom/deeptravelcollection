import React from 'react';
import { Link } from 'wouter';
import { MapPin, ChevronRight } from 'lucide-react';

// Define destination types
interface Destination {
  id: number;
  name: string;
  country: string;
  region: string;
  image: string;
  description: string;
  slug: string;
}

// Region section props
interface RegionGridSectionProps {
  title: string;
  region: string;
  destinations: Destination[];
}

// Define regions and their display information
export const regions = [
  {
    name: "Europe",
    displayName: "Europe",
    description: "From historic cities to Mediterranean coastlines",
    image: "/images/regions/europe.jpg"
  },
  {
    name: "Asia",
    displayName: "Asia",
    description: "Ancient traditions meet futuristic innovations",
    image: "/images/regions/asia.jpg"
  },
  {
    name: "Latin America",
    displayName: "Latin America",
    description: "Vibrant cultures, rainforests, and colonial architecture",
    image: "/images/regions/latin-america.jpg"
  },
  {
    name: "Africa",
    displayName: "Africa",
    description: "Diverse landscapes from savanna to ancient pyramids",
    image: "/images/regions/africa.jpg"
  },
  {
    name: "North America",
    displayName: "North America",
    description: "Iconic cities, natural wonders, and cultural diversity",
    image: "/images/regions/north-america.jpg"
  }
];

// Sample destinations by region using actual images from your assets
export const sampleDestinations: Destination[] = [
  // Europe
  {
    id: 1,
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    image: "/images/header/barcelona.jpg",
    description: "Explore Gaudi's architecture and vibrant local culture",
    slug: "barcelona"
  },
  {
    id: 2,
    name: "Rome",
    country: "Italy",
    region: "Europe",
    image: "/images/header/rome.jpg",
    description: "Ancient history and modern lifestyle in the Eternal City",
    slug: "rome"
  },
  {
    id: 3,
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    image: "/images/portugal-header.jpg",
    description: "Colorful streets, ocean views and authenticity",
    slug: "lisbon"
  },
  // Asia
  {
    id: 4,
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    image: "/images/header/tokyo.jpg",
    description: "Traditional temples side-by-side with futuristic technology",
    slug: "tokyo"
  },
  {
    id: 5,
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    image: "/images/header/bali.jpg",
    description: "Spiritual temples, rice terraces, and stunning beaches",
    slug: "bali"
  },
  {
    id: 6,
    name: "Chiang Mai",
    country: "Thailand",
    region: "Asia",
    image: "/images/thailand-header.jpg",
    description: "Mountain temples and authentic northern Thai culture",
    slug: "chiang-mai"
  },
  // Latin America
  {
    id: 7,
    name: "Buenos Aires",
    country: "Argentina",
    region: "Latin America",
    image: "/images/header/buenos-aires.jpg",
    description: "The Paris of South America with tango and passion",
    slug: "buenos-aires"
  },
  {
    id: 8,
    name: "Medellin",
    country: "Colombia",
    region: "Latin America",
    image: "/images/header/medellin.jpg",
    description: "City of eternal spring with vibrant transformation",
    slug: "medellin"
  },
  // Africa
  {
    id: 9,
    name: "Cairo",
    country: "Egypt",
    region: "Africa",
    image: "/images/header/egypt.jpg",
    description: "Ancient wonders and bustling modern metropolis",
    slug: "cairo"
  },
  {
    id: 10,
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    image: "/images/south-africa-header.jpg",
    description: "Where mountains meet the ocean at Africa's tip",
    slug: "cape-town"
  },
  // North America
  {
    id: 11,
    name: "New York",
    country: "USA",
    region: "North America",
    image: "/images/usa-header.jpg",
    description: "The cultural melting pot that never sleeps",
    slug: "new-york"
  }
];

// Single destination card
const DestinationCard: React.FC<{destination: Destination}> = ({ destination }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={destination.image} 
          alt={`${destination.name}, ${destination.country}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center text-white">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{destination.country}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{destination.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
        <Link 
          href={`/immersive-experiences/destination/${destination.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          View immersive guide
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

// Region grid section component
const RegionGridSection: React.FC<RegionGridSectionProps> = ({ title, region, destinations }) => {
  // Filter destinations by region
  const filteredDestinations = destinations.filter(dest => dest.region === region);
  
  if (filteredDestinations.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="h-1 w-16 bg-blue-600 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.map(destination => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
      
      <div className="mt-6 text-right">
        <Link 
          href={`/immersive-experiences/region/${region.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          View all {region} experiences
          <ChevronRight className="ml-1 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default RegionGridSection;