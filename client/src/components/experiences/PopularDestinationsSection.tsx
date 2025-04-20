import React, { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, MapPin, Globe, Filter } from 'lucide-react';
import { sampleDestinations } from './RegionGridSection';

// Create tabs for the regions to filter by
const regionTabs = [
  { id: 'all', label: 'All Regions' },
  { id: 'Europe', label: 'Europe' },
  { id: 'Asia', label: 'Asia' },
  { id: 'Latin America', label: 'Latin America' },
  { id: 'Africa', label: 'Africa' },
  { id: 'North America', label: 'North America' }
];

export default function PopularDestinationsSection() {
  const [activeRegion, setActiveRegion] = useState('all');
  
  // Filter destinations based on active region
  const filteredDestinations = activeRegion === 'all' 
    ? sampleDestinations 
    : sampleDestinations.filter(dest => dest.region === activeRegion);
  
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mb-3">
            EXPLORE THE WORLD
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Popular Immersive Experience Destinations
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Dive deep into authentic local experiences with our premium immersive travel guides
          </p>
        </div>
        
        {/* Region Tabs */}
        <div className="flex overflow-x-auto mb-8 pb-2 scrollbar-hide">
          <div className="inline-flex items-center space-x-2 px-1">
            <Filter className="text-gray-400 h-4 w-4" />
            {regionTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${
                  activeRegion === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {filteredDestinations.map((destination) => (
            <div 
              key={destination.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={destination.image} 
                  alt={`${destination.name}, ${destination.country}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 p-4">
                    <div className="flex items-center text-white mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/immersive-experiences/destination/${destination.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                  >
                    View immersive guide
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    <span>{destination.region}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Button to view all */}
        <div className="text-center">
          <Link href="/immersive-experiences" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg">
            View All 40+ Immersive Experiences
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}