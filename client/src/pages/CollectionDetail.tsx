import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Collection, CollectionItem, Destination } from "@shared/schema";
import { useState } from "react";
import DestinationCard from "../components/DestinationCard";
import { FaUtensils, FaPalette, FaUsers, FaGem } from "react-icons/fa";
import { ChevronLeft } from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  "utensils": FaUtensils,
  "palette": FaPalette,
  "users": FaUsers,
  "gem": FaGem
};

interface CollectionDetailResponse {
  collection: Collection;
  items?: (CollectionItem & {
    destination: {
      id: number;
      name: string;
      country: string;
      imageUrl: string;
      rating: string;
    } | null;
  })[];
  destinations?: {
    id: number;
    name: string;
    country: string;
    imageUrl: string;
    rating: string;
    regionId: number;
    description: string;
    downloadCount: number;
    featured: boolean;
  }[];
}

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<[number, number]>();

  const { data, isLoading, error } = useQuery<CollectionDetailResponse>({
    queryKey: [`/api/collections/${slug}`],
    retry: 1,
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-64 rounded-xl bg-gray-200 animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || !data.collection) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Collection not found</h2>
        <p className="mb-8">Sorry, the collection you are looking for does not exist or could not be loaded.</p>
        <Link href="/">
          <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to homepage
          </div>
        </Link>
      </div>
    );
  }

  const { collection, items, destinations } = data;
  const CollectionIcon = iconMap[collection.icon] || FaGem;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Collection header */}
      <div 
        className="relative h-[40vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${collection.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/50"></div>
        <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-end items-start pb-12">
          <Link href="/">
            <div className="mb-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full inline-flex items-center hover:bg-white/30 transition cursor-pointer">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </div>
          </Link>
          
          <div className="flex items-center mb-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: collection.themeColor || '#4F46E5' }}
            >
              <CollectionIcon size={30} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">{collection.name}</h1>
          </div>
          
          <p className="text-gray-200 text-lg max-w-3xl">{collection.description}</p>
        </div>
      </div>

      {/* Collection destinations */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Destinations in this Collection</h2>
        
        {/* Check for items first (legacy collections) */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              item.destination && (
                <div key={item.id} className="space-y-4">
                  <DestinationCard 
                    destination={{
                      id: item.destination.id,
                      name: item.destination.name,
                      country: item.destination.country,
                      imageUrl: item.destination.imageUrl,
                      rating: item.destination.rating,
                      // Adding other required properties with default values
                      regionId: 0,
                      description: '',
                      downloadCount: 0,
                      featured: false
                    }}
                    featured={false}
                  />
                  
                  {item.highlight && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                      <h4 className="font-bold text-blue-800">Highlight</h4>
                      <p className="text-blue-700">{item.highlight}</p>
                    </div>
                  )}
                  
                  {item.note && (
                    <div className="text-sm text-gray-600 italic">
                      <span className="font-medium">Pro Tip:</span> {item.note}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        ) : destinations && destinations.length > 0 ? (
          /* If no items but destinations exist, show those instead (for newer collections like snowbird) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div key={destination.id} className="space-y-4">
                <DestinationCard 
                  destination={{
                    ...destination,
                    // Fill in any missing properties with defaults
                    immersiveDescription: null,
                    bestTimeToVisit: null,
                    localTips: null,
                    geography: null,
                    culture: null,
                    cuisine: null
                  }}
                  featured={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No destinations in this collection yet.</p>
        )}
      </div>
    </div>
  );
}