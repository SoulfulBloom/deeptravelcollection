import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HealthCoverageComparison from '../components/health-insurance/HealthCoverageComparison';

const HealthCoveragePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-blue-600 text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              Canadian Provincial Health Insurance Coverage Abroad
            </h1>
            <p className="text-center mt-4 max-w-3xl mx-auto">
              Compare coverage limitations, requirements, and recommendations for Canadian snowbirds 
              traveling outside their home province
            </p>
          </div>
        </div>
        
        <HealthCoverageComparison />
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthCoveragePage;