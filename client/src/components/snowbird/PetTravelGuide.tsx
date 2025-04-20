import React from 'react';
import { Globe, FileText, Plane, CheckCircle, ShoppingCart, Download } from 'lucide-react';
import { PiPawPrintFill } from 'react-icons/pi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFonts } from "@/components/ui/fonts";
import { Link } from 'wouter';

const PetTravelGuide: React.FC = () => {
  const { heading } = useFonts();
  
  // No longer need test mode URL functionality

  return (
    <Card className="shadow-lg border-t-4 border-t-green-600 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-white">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-full">
            <PiPawPrintFill className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className={`text-xl text-green-900 ${heading}`}>
            The Ultimate Guide to Snowbird Travel with Pets
          </CardTitle>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            For Canadian Snowbirds
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
              New!
            </Badge>
            <span className="text-lg font-bold text-green-700">$8.99</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <p className="text-gray-700">
            For Canadian snowbirds seeking warm-weather escapes beyond the U.S., traveling with pets can be a challenge. 
            Many popular alternatives—like Mérida, Medellín, Puerto Vallarta, and Lisbon—have specific pet entry rules, 
            airline restrictions, and documentation requirements.
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-5">
          <h4 className={`text-green-800 font-semibold mb-2 ${heading}`}>This guide covers:</h4>
          <ul className="space-y-2">
            {[
              'Pet entry rules for top snowbird destinations',
              'Required vaccinations & paperwork',
              'Pet-friendly airlines & approximate costs',
              'Tips for stress-free travel with cats & medium-sized dogs'
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-1 text-green-600" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FeatureCard 
            icon={<Globe className="h-8 w-8 text-green-600" />}
            title="Destination Insights"
            description="Detailed pet regulations for popular international snowbird destinations beyond Florida"
          />
          <FeatureCard 
            icon={<FileText className="h-8 w-8 text-green-600" />}
            title="Documentation Guide"
            description="Templates and checklists for all required pet health certificates and paperwork"
          />
          <FeatureCard 
            icon={<Plane className="h-8 w-8 text-green-600" />}
            title="Travel Planning"
            description="Airline pet policies, kennel requirements, and stress-reduction strategies for pets"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 justify-end">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <Link href="/checkout?type=pet_travel_guide">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center gap-2 w-full">
              <ShoppingCart className="h-4 w-4" />
              Purchase Guide ($8.99)
            </Button>
          </Link>
          <a 
            href="/resources/Snowbird-Travel-with-Pets-Guide.pdf" 
            download="Snowbird-Travel-with-Pets-Guide.pdf"
            className="text-green-600 text-xs text-center hover:underline flex items-center justify-center"
          >
            <Download className="h-3 w-3 mr-1" />
            Download Sample
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-medium text-green-900 text-center mb-1">{title}</h4>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default PetTravelGuide;