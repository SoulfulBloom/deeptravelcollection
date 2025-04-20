import React from 'react';
import { useFonts } from "./ui/fonts";
import { Badge } from './ui/badge';
import { CalendarClock, MapPin, Globe, Eye } from 'lucide-react';

export default function ComingItineraries() {
  const { heading } = useFonts();
  
  const upcomingItineraries = [
    {
      name: "Greek Islands Cultural Immersion",
      country: "Greece",
      region: "Europe",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      description: "Live like a local on Santorini, Mykonos, and Crete. Join traditional cooking classes, family-hosted dinners, and artisan workshops with generations of Greek craftspeople.",
      comingSoon: true,
      eta: "May 2025"
    },
    {
      name: "Vietnam Cultural Heritage",
      country: "Vietnam",
      region: "Asia",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
      description: "Connect with ethnic minority communities in Sapa, learn age-old craft traditions in Hanoi's Ancient Quarter, and experience authentic homestays with local families.",
      comingSoon: true,
      eta: "June 2025"
    },
    {
      name: "South African Cultural Journey",
      country: "South Africa",
      region: "Africa",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2686&q=80",
      description: "Immerse yourself in township life, learn traditional Zulu and Xhosa customs, participate in community-based tourism initiatives, and experience Ubuntu philosophy firsthand.",
      comingSoon: true,
      eta: "July 2025"
    },
    {
      name: "Peruvian Cultural Immersion",
      country: "Peru",
      region: "South America",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
      description: "Live with indigenous Quechua families, participate in traditional agricultural practices, learn ancient weaving techniques, and experience authentic Andean spiritual ceremonies.",
      comingSoon: true,
      eta: "August 2025"
    }
  ];
  
  return (
    <div className="bg-neutral-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 mb-2">Cultural Immersion</Badge>
          <h2 className={`text-3xl font-bold text-gray-900 sm:text-4xl mb-4 ${heading}`}>
            Upcoming Cultural Immersion Experiences
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            We're crafting authentic cultural experiences that connect you with local communities, traditions, and ways of life.
            These immersive itineraries go beyond typical tourism to foster genuine cultural exchange.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingItineraries.map((itinerary, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <img 
                    src={itinerary.image} 
                    alt={`${itinerary.name}, ${itinerary.country}`} 
                    className="object-cover w-full h-48"
                  />
                </div>
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                    <Eye className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                    Coming {itinerary.eta}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Globe className="h-4 w-4 mr-1" />
                  <span>{itinerary.region}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{itinerary.country}</span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2">{itinerary.name}</h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {itinerary.description}
                </p>
                
                <div className="flex items-center text-sm text-blue-600 font-semibold">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  <span>Available {itinerary.eta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500 italic">
            Want us to prioritize a specific destination? 
            <a href="mailto:support@deeptravelcollections.com" className="text-blue-600 ml-1 hover:underline">
              Let us know!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}