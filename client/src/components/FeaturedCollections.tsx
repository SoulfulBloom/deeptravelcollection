import { useQuery } from "@tanstack/react-query";
import { Collection } from "@shared/schema";
import CollectionCard from "./CollectionCard";

export default function FeaturedCollections() {
  const { data: collections, isLoading, error } = useQuery<Collection[]>({
    queryKey: ['/api/collections/featured'],
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-32 h-5 bg-gray-200 animate-pulse mx-auto rounded-md"></div>
          <h2 className="text-3xl font-bold mt-2 mb-2">
            Curated Travel Collections
          </h2>
          <div className="h-4 bg-gray-200 animate-pulse mx-auto rounded-md max-w-3xl mb-1"></div>
          <div className="h-4 bg-gray-200 animate-pulse mx-auto rounded-md max-w-2xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Special Feature</span>
        <h2 className="text-3xl font-bold mb-2 mt-1">Curated Travel Collections</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Explore our exclusive themed collections, thoughtfully curated by travel experts to inspire your next adventure with unique, immersive experiences around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} featured={true} />
        ))}
      </div>
    </section>
  );
}