import { useFonts } from "./ui/fonts";
import { useQuery } from "@tanstack/react-query";
import DestinationCard from "./DestinationCard";
import { Skeleton } from "./ui/skeleton";
import { Destination } from "@shared/schema";

interface RelatedDestinationsProps {
  destinationId: number;
  limit?: number;
}

export default function RelatedDestinations({ destinationId, limit = 4 }: RelatedDestinationsProps) {
  const { heading } = useFonts();
  
  const { data: relatedDestinations, isLoading } = useQuery<Destination[]>({
    queryKey: [`/api/destinations/${destinationId}/related`, limit ? `limit=${limit}` : ''],
    enabled: !!destinationId,
  });
  
  if (isLoading) {
    return (
      <div className="mt-12 bg-neutral-50 py-8 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-80 mb-6" />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array(limit).fill(0).map((_, i) => (
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
        </div>
      </div>
    );
  }
  
  if (!relatedDestinations || relatedDestinations.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12 bg-neutral-50 py-8 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-2xl font-bold text-neutral-900 mb-6 ${heading}`}>
          Similar Destinations You Might Like
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {relatedDestinations.map((destination: Destination) => (
            <DestinationCard 
              key={destination.id} 
              destination={destination} 
              featured={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}