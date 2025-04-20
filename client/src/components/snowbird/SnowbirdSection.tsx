import React from 'react';
import { useFonts } from "@/components/ui/fonts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DigitalNomadPackage from './DigitalNomadPackage';
import HomeManagementService from './HomeManagementService';
import SnowbirdEscapeGuide from './SnowbirdEscapeGuide';
import PetTravelGuide from './PetTravelGuide';
import CanadianTestimonials from './CanadianTestimonials';
import { Link } from 'wouter';

const SnowbirdSection: React.FC = () => {
  const { heading } = useFonts();
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="bg-red-50 text-red-600 mb-2">For Canadians</Badge>
          <h2 className={`text-3xl font-bold text-gray-900 sm:text-4xl mb-4 ${heading}`}>
            Tools for Canadian Snowbirds
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Escape the Canadian winter without the Florida crowds. Discover affordable destinations with great weather, 
            modern amenities, and authentic cultural experiences.
          </p>
        </div>
        
        {/* Digital Nomad Package */}
        <div className="mb-10">
          <DigitalNomadPackage />
        </div>
        
        {/* Home Management Service */}
        <div className="mb-10">
          <HomeManagementService />
        </div>
        
        {/* Snowbird Escape Guide */}
        <div className="mb-10">
          <SnowbirdEscapeGuide />
        </div>
        
        {/* Pet Travel Guide */}
        <div className="mb-10">
          <PetTravelGuide />
        </div>
        
        {/* Canadian Testimonials Section */}
        <div className="mt-16 mb-10">
          <CanadianTestimonials />
        </div>

        {/* View All Destinations Button */}
        <div className="mt-12 text-center">
          <h3 className={`text-2xl font-bold text-gray-900 mb-6 ${heading}`}>
            Ready to Explore More?
          </h3>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Visit our Snowbird Alternatives page to explore all available destinations with detailed information, pricing, and downloadable itineraries.
          </p>
          <Link href="/snowbird-alternatives">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
              View All Snowbird Destinations
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SnowbirdSection;