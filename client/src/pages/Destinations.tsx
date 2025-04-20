import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useFonts } from "@/components/ui/fonts";
import DestinationCard from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Destinations() {
  const { heading } = useFonts();
  const [location] = useLocation();
  const [visibleCount, setVisibleCount] = useState(8);
  
  useEffect(() => {
    document.title = "Destinations | TravelPlan";
  }, [location]);
  
  const { data: destinations = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/destinations'],
  });
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };
  
  return (
    <div className="bg-neutral-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-3xl font-bold text-neutral-900 sm:text-4xl ${heading}`}>
            Explore Destinations
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500 sm:mt-4">
            Browse our collection of travel itineraries from around the world
          </p>
        </div>
        
        <div className="mt-10">
          
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {Array(8).fill(0).map((_, i) => (
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
              ))}
            </div>
          ) : destinations?.length ? (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {destinations.slice(0, visibleCount).map((destination: any) => (
                  <DestinationCard 
                    key={destination.id} 
                    destination={destination} 
                    featured={false}
                  />
                ))}
              </div>
              
              {visibleCount < destinations.length && (
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
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-neutral-600">No destinations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
