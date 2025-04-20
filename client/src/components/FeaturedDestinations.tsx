import { useFonts } from "./ui/fonts";
import { useQuery } from "@tanstack/react-query";
import DestinationCard from "./DestinationCard";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function FeaturedDestinations() {
  const { heading } = useFonts();
  
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['/api/destinations/featured'],
  });
  
  return (
    <div className="bg-white py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="featured-destinations" className={`text-3xl font-bold text-neutral-900 sm:text-4xl ${heading}`}>
            Featured Destinations
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500 sm:mt-4">
            Popular itineraries from travelers' favorite places around the world
          </p>
        </div>
        
        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-60 w-full" />
                <div className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-10" />
                  </div>
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <div className="mt-6 flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            destinations?.map((destination) => (
              <DestinationCard 
                key={destination.id} 
                destination={destination} 
                featured={true}
              />
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/destinations">
            <Button className="inline-flex items-center px-6 py-3 text-base">
              View All Featured Destinations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
