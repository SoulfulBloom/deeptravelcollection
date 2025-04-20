import React, { useEffect } from 'react';
import DestinationFinder from '../components/finder/DestinationFinder';
import { Badge } from '@/components/ui/badge';

const CanadianSnowbirdDestinationFinder: React.FC = () => {
  // Update page title
  useEffect(() => {
    document.title = "Find Your Perfect Snowbird Destination | Deep Travel Collections";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="absolute inset-0 bg-pattern-snowflakes opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">DESTINATION FINDER</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Snowbird Destination
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Answer a few simple questions about your preferences, budget, and lifestyle to discover
              the ideal winter escape tailored specifically for Canadian snowbirds.
            </p>
          </div>
        </div>
      </section>
      
      {/* Quiz Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Destination Matcher</h2>
              <p className="text-gray-600">
                Our algorithm will match you with destinations that best suit your unique needs and preferences.
                Take the quiz below to get personalized recommendations.
              </p>
            </div>
            
            <DestinationFinder />
          </div>
        </div>
      </section>
      
      {/* Info Section */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</span>
                    <p className="text-gray-700">Answer questions about your budget, healthcare needs, climate preferences, and more.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</span>
                    <p className="text-gray-700">Our algorithm analyzes your responses against our database of snowbird destinations.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</span>
                    <p className="text-gray-700">Receive personalized destination recommendations ranked by compatibility.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">4</span>
                    <p className="text-gray-700">Browse detailed guides for your recommended destinations.</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Why Use Our Finder</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Data-driven recommendations based on real expat experiences</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Designed specifically for Canadian snowbirds' unique needs</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Considers healthcare, climate, cost of living, and culture factors</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Updated regularly with the latest destination information</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CanadianSnowbirdDestinationFinder;