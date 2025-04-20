import React, { useEffect } from 'react';
import { useQuiz } from './QuizContext';
import { Check, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { DestinationMatch } from './types';

// This is mock data until we implement the actual destination matching algorithm
const generateMockResults = (): DestinationMatch[] => {
  return [
    {
      id: 55,
      name: 'Puerto Vallarta',
      country: 'Mexico',
      matchPercentage: 92,
      imageUrl: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3',
      features: [
        'Established Canadian community',
        'Affordable living costs',
        'Excellent healthcare options',
        'Warm tropical climate'
      ]
    },
    {
      id: 56,
      name: 'Algarve',
      country: 'Portugal',
      matchPercentage: 85,
      imageUrl: 'https://images.unsplash.com/photo-1591991849021-aadedd3c12e9?auto=format&fit=crop&q=80&w=2669&ixlib=rb-4.0.3',
      features: [
        'Mild Mediterranean climate',
        'High-quality healthcare',
        'Growing Canadian presence',
        'Rich European culture'
      ]
    },
    {
      id: 57,
      name: 'Chiang Mai',
      country: 'Thailand',
      matchPercentage: 78,
      imageUrl: 'https://images.unsplash.com/photo-1518003106814-9d69a8c5ee49?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3',
      features: [
        'Very low cost of living',
        'Warm tropical climate',
        'Cultural immersion opportunities',
        'International-standard hospitals'
      ]
    }
  ];
};

const ResultsScreen: React.FC = () => {
  const { responses, results, setResults, resetQuiz } = useQuiz();
  
  // In a real implementation, this would call an API endpoint to get recommendations
  useEffect(() => {
    if (!results) {
      // Simulate a brief loading period
      const timer = setTimeout(() => {
        setResults(generateMockResults());
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [results, setResults]);
  
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Analyzing your preferences...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Your Top Matches
        </h2>
        <p className="text-gray-600">
          Based on your preferences, we've found these destinations that best match what you're looking for.
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        {results.map((destination) => (
          <div 
            key={destination.id}
            className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="md:flex">
              <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                <img
                  src={destination.imageUrl}
                  alt={`${destination.name}, ${destination.country}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {destination.matchPercentage}% Match
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {destination.name}, {destination.country}
                </h3>
                
                <div className="mb-4">
                  <div className="bg-gray-200 h-2 w-full rounded-full">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${destination.matchPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-700 mb-2">Why it's a good match:</h4>
                <ul className="space-y-1 mb-4">
                  {destination.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={`/destinations/${destination.id}`}>
                  <a className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
                    Explore {destination.name}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={resetQuiz}
          className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Retake Quiz
        </button>
        
        <Link href="/snowbird">
          <a className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Explore All Destinations
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ResultsScreen;