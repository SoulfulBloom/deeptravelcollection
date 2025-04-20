import React from 'react';
import { ChevronRight, DollarSign, Plane, Users, Sun, Heart, Landmark, Plus } from 'lucide-react';
import { Link } from 'wouter';

interface DestinationCardProps {
  name: string;
  image: string;
  benefits: string[];
  icons: React.ElementType[];
  linkTo: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ name, image, benefits, icons, linkTo }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48 sm:h-52 md:h-56">
        <img 
          src={image} 
          alt={`${name} - destination for Canadian snowbirds`} 
          className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <h3 className="text-xl font-bold text-white p-4">{name}</h3>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <ul className="space-y-2 mb-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              {React.createElement(icons[index], { className: "h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" })}
              <span className="text-sm text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="px-4 pb-4">
        <Link href={linkTo} className="inline-flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors">
          Explore {name}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

const MoreDestinationsCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-4">More Destinations</h3>
          
          <p className="text-white/90 mb-6">
            Explore Colombia, Portugal, and other Canadian-friendly alternatives
          </p>
        </div>
        
        <Link href="/canadian-snowbirds/destinations" className="inline-flex items-center justify-center py-2 px-4 bg-white text-blue-700 rounded-md font-medium text-sm transition-colors hover:bg-blue-50">
          See All Destinations
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default function SnowbirdDestinationShowcase() {
  const destinations = [
    {
      name: "Mexico",
      image: "/images/destinations/thumbs/puerto-vallarta.jpg",
      benefits: [
        "40% lower cost than Florida",
        "Direct flights from major Canadian cities",
        "Large Canadian communities"
      ],
      icons: [DollarSign, Plane, Users],
      linkTo: "/canadian-snowbirds/destinations/puerto-vallarta"
    },
    {
      name: "Dominican Republic",
      image: "/images/destinations/thumbs/punta-cana.jpg",
      benefits: [
        "All-inclusive resorts",
        "Caribbean beaches",
        "Well-established tourism"
      ],
      icons: [Landmark, Sun, Heart],
      linkTo: "/canadian-snowbirds/destinations/punta-cana"
    },
    {
      name: "Cuba",
      image: "/images/destinations/thumbs/varadero.jpg",
      benefits: [
        "Affordable living costs",
        "Excellent healthcare",
        "Rich cultural experience"
      ],
      icons: [DollarSign, Heart, Sun],
      linkTo: "/canadian-snowbirds/destinations/varadero"
    },
    {
      name: "Colombia",
      image: "/images/destinations/thumbs/medellin.jpg",
      benefits: [
        "Spring-like climate year-round",
        "Modern amenities",
        "Growing expat community"
      ],
      icons: [Sun, Landmark, Users],
      linkTo: "/canadian-snowbirds/destinations/medellin"
    },
    {
      name: "Costa Rica",
      image: "/images/destinations/thumbs/san-jose.jpg",
      benefits: [
        "Perfect year-round climate",
        "Excellent healthcare system",
        "Growing Canadian population"
      ],
      icons: [Sun, Heart, Users],
      linkTo: "/canadian-snowbirds/destinations/costa-rica"
    },
    {
      name: "Panama",
      image: "/images/destinations/thumbs/panama-city.jpg",
      benefits: [
        "Pensionado program benefits",
        "US dollar economy",
        "Modern infrastructure"
      ],
      icons: [Heart, DollarSign, Landmark],
      linkTo: "/canadian-snowbirds/destinations/panama-city"
    }
  ];
  
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-3">
            BEYOND FLORIDA
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Popular Snowbird Alternatives to Florida</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Discover where Canadians are finding better value, weather, and welcome
          </p>
        </div>
        
        {/* Show 3 featured destinations on first row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {destinations.slice(0, 3).map((destination, index) => (
            <DestinationCard 
              key={index}
              name={destination.name}
              image={destination.image}
              benefits={destination.benefits}
              icons={destination.icons}
              linkTo={destination.linkTo}
            />
          ))}
        </div>
        
        {/* Show remaining destinations plus "More" card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.slice(3).map((destination, index) => (
            <DestinationCard 
              key={index + 3}
              name={destination.name}
              image={destination.image}
              benefits={destination.benefits}
              icons={destination.icons}
              linkTo={destination.linkTo}
            />
          ))}
          
          <MoreDestinationsCard />
        </div>
      </div>
    </section>
  );
}