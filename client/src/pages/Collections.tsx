import { useQuery } from "@tanstack/react-query";
import { Collection } from "@shared/schema";
import CollectionCard from "../components/CollectionCard";

export default function Collections() {
  const { data: collections, isLoading, error } = useQuery<Collection[]>({
    queryKey: ['/api/collections'],
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Curated Travel Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !collections) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Unable to load collections</h2>
        <p>Sorry, there was an error loading the travel collections. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <span className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-4">Expert-Curated Experiences</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Travel Collections</h1>
          <p className="text-xl max-w-3xl mx-auto mb-6">
            Thoughtfully organized themed journeys crafted by travel experts to help you explore destinations through unique lenses — from culinary adventures to cultural immersion.
          </p>
          <div className="w-20 h-1 bg-white/50 mx-auto"></div>
        </div>
      </div>

      {/* Collections grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No collections are available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}