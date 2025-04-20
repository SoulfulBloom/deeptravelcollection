import { Link } from "wouter";
import { Collection } from "@shared/schema";
import { Icon } from "lucide-react";
import { FaUtensils, FaPalette, FaUsers, FaGem, FaSpa } from "react-icons/fa";

const iconMap: Record<string, React.ComponentType<any>> = {
  "utensils": FaUtensils,
  "palette": FaPalette,
  "users": FaUsers,
  "gem": FaGem,
  "spa": FaSpa
};

interface CollectionCardProps {
  collection: Collection;
  featured?: boolean;
}

export default function CollectionCard({ collection, featured = false }: CollectionCardProps) {
  const CollectionIcon = iconMap[collection.icon] || FaGem;
  
  return (
    <Link href={`/collections/${collection.slug}`}>
      <div className={`block relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${featured ? 'h-80 group hover:shadow-xl' : 'h-64 hover:shadow-lg'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"></div>
        
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${collection.imageUrl})` }}
        />
        
        <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col gap-1">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: collection.themeColor || '#4F46E5' }}
          >
            <CollectionIcon size={24} className="text-white" />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-white">{collection.name}</h3>
          
          <p className="text-sm text-gray-200 line-clamp-2">
            {collection.description}
          </p>
          
          <div className={`
            mt-3 px-4 py-2 rounded-full font-medium text-sm inline-flex items-center 
            transition-all duration-300 w-fit
            ${featured ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/30 text-white'}
          `}>
            Browse collection
            <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}