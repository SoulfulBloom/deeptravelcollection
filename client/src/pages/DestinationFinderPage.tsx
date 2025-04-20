import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DestinationFinder from '../components/finder/DestinationFinder';

const DestinationFinderPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Find Your Perfect Snowbird Destination
          </h1>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Use our interactive tool to discover the ideal winter escape that matches your preferences,
            budget, and lifestyle. Answer a few questions and we'll recommend the best alternatives to Florida
            for your Canadian snowbird experience.
          </p>
          
          <DestinationFinder />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DestinationFinderPage;