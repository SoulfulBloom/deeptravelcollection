import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFonts } from "@/components/ui/fonts";
import DestinationCard from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Destination } from "@shared/schema";

export default function Favorites() {
  const { heading } = useFonts();
  const queryClient = useQueryClient();
  
  // Set document title
  useEffect(() => {
    document.title = "My Favorites | Deep Travel Collections";
  }, []);
  
  // Fetch favorites
  const { data: favorites, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/favorites'],
  });
  
  // Refresh favorites when component is mounted
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
  }, [queryClient]);
  
  return (
    <div className="bg-neutral-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="link" className="text-primary p-0">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to home
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-10">
          <h1 className={`text-3xl font-bold text-neutral-900 sm:text-4xl ${heading}`}>
            My Favorites
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500 sm:mt-4">
            Your collection of saved travel destinations
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
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
        ) : favorites?.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((destination) => (
              <DestinationCard 
                key={destination.id} 
                destination={destination} 
                featured={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className={`mt-4 text-lg font-medium text-neutral-900 ${heading}`}>No favorites yet</h3>
            <p className="mt-2 text-neutral-500">
              Start adding destinations to your favorites to see them here.
            </p>
            <Link href="/destinations">
              <Button className="mt-6">
                Browse Destinations
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}