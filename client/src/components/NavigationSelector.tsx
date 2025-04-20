import React, { useState } from 'react';
import { MapPin, Snowflake, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NavigationSelector() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-14 px-4 border-b border-blue-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-600 text-white rounded-full mb-4">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Choose Your Snowbird Experience
          </h2>
          <p className="text-blue-700 max-w-3xl mx-auto text-lg">
            We offer specialized resources for Canadian snowbirds seeking warmer alternatives:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto px-2 sm:px-0">
          {/* Snowbird Planning Tools Option */}
          <div 
            className={`
              relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer
              ${selectedPath === 'tools' 
                ? 'ring-4 ring-blue-500 transform scale-105' 
                : 'bg-white hover:shadow-xl hover:transform hover:scale-103'}
            `}
            onClick={() => setSelectedPath('tools')}
          >
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-blue-600 to-blue-400"></div>
            <div className="relative pt-16 px-6 pb-6">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-md">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Compass className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Snowbird Planning Tools
                </h3>
                <div className="w-12 h-1 bg-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-5">
                  Interactive tools to find your ideal destination, compare provincial healthcare coverage, and prepare for your trip.
                </p>
                
                <Link href="/destination-finder">
                  <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    Use Planning Tools
                    <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            
            {selectedPath === 'tools' && (
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-white text-blue-600 text-sm px-3 py-1 rounded-full font-semibold shadow">
                  Selected
                </div>
              </div>
            )}
          </div>
          
          {/* Snowbird Alternatives Option */}
          <div 
            className={`
              relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer
              ${selectedPath === 'snowbird' 
                ? 'ring-4 ring-red-500 transform scale-105' 
                : 'bg-white hover:shadow-xl hover:transform hover:scale-103'}
            `}
            onClick={() => setSelectedPath('snowbird')}
          >
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-600 to-red-400"></div>
            <div className="relative pt-16 px-6 pb-6">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-md">
                <div className="bg-red-100 p-4 rounded-full">
                  <Snowflake className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Snowbird Alternatives for Canadians
                </h3>
                <div className="w-12 h-1 bg-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-5">
                  Discover warm winter escapes beyond Florida with cultural richness and authentic experiences for Canadians.
                </p>
                
                <Link href="/canadian-snowbirds">
                  <span className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    Explore Alternatives
                    <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            
            {selectedPath === 'snowbird' && (
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-white text-red-600 text-sm px-3 py-1 rounded-full font-semibold shadow">
                  Selected
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Not sure? Continue scrolling to explore both options.
          </p>
        </div>
      </div>
    </div>
  );
}