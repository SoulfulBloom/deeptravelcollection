import React from 'react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFonts } from "@/components/ui/fonts";
import { Heart, MapPin, ShieldAlert, FileText } from 'lucide-react';

const SnowbirdEscapeGuide: React.FC = () => {
  const { heading } = useFonts();

  return (
    <div className="w-full max-w-6xl mx-auto py-4">
      <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${heading}`}>
        The Ultimate Snowbird Escape Guide
      </h2>
      
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="border-b p-6">
            <h3 className={`text-2xl font-bold mb-2 ${heading}`}>The Ultimate Snowbird Escape Guide</h3>
            <p className="text-gray-600">
              An indispensable resource for Canadians planning extended stays abroad, focusing on key legal, financial, and healthcare considerations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="flex items-start space-x-3">
              <Heart className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Provincial Health Insurance Rules</h4>
                <p className="text-gray-600 text-sm">
                  Province-by-province breakdown of health insurance residency requirements and coverage options while abroad.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Destination Comparisons</h4>
                <p className="text-gray-600 text-sm">
                  Detailed comparison of popular snowbird destinations including Mexico, Costa Rica, Panama, and Colombia with key facts on each location.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Tax Residency Guidance</h4>
                <p className="text-gray-600 text-sm">
                  Clear explanation of Canadian tax residency rules, reporting requirements, and strategies to maintain proper compliance while abroad.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Healthcare Abroad Solutions</h4>
                <p className="text-gray-600 text-sm">
                  Comprehensive guide to finding quality healthcare, managing medications, and securing appropriate insurance coverage in your destination.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link to="/checkout?type=snowbird_toolkit&product=snowbird-toolkit">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                $9.99 one-time purchase
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnowbirdEscapeGuide;