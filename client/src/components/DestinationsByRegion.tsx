import { useFonts } from "./ui/fonts";
import { useQuery } from "@tanstack/react-query";
import DestinationCard from "./DestinationCard";
import RegionFilter from "./RegionFilter";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function DestinationsByRegion() {
  const { heading } = useFonts();
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  
  const { data: regions } = useQuery({
    queryKey: ['/api/regions'],
  });
  
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['/api/destinations', selectedRegion ? `regionId=${selectedRegion}` : ''],
  });
  
  const handleRegionChange = (regionId: number | null) => {
    setSelectedRegion(regionId);
    setVisibleCount(8); // Reset visible count when changing region
  };
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };
  
  return (
    <div className="bg-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold text-neutral-900 sm:text-4xl ${heading}`}>
            Explore by Region
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500 sm:mt-4">
            Find the perfect itinerary for your next adventure
          </p>
        </div>
        
        <div className="mt-10">
          <RegionFilter 
            regions={regions || []} 
            selectedRegion={selectedRegion} 
            onRegionChange={handleRegionChange} 
          />
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              // Loading skeletons
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              destinations?.slice(0, visibleCount).map((destination) => (
                <DestinationCard 
                  key={destination.id} 
                  destination={destination} 
                  featured={false}
                />
              ))
            )}
          </div>
          
          {destinations && visibleCount < destinations.length && (
            <div className="mt-10 text-center">
              <Button 
                variant="outline"
                className="inline-flex items-center px-6 py-3 border-primary text-primary hover:bg-blue-50"
                onClick={handleLoadMore}
              >
                Load More Destinations
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
