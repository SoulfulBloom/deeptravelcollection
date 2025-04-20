import React from 'react';
import { Calendar, Clock, Home, Bell, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFonts } from "@/components/ui/fonts";

const HomeManagementService: React.FC = () => {
  const { heading } = useFonts();

  return (
    <Card className="shadow-lg border-t-4 border-t-blue-600 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <div className="text-center">
          <h3 className={`text-xl md:text-2xl font-bold text-blue-900 ${heading}`}>
            Snowbirds Toolkit: Canadian Home Management Service
          </h3>
          <p className="text-gray-600 mt-2">
            Peace of mind for your Canadian property during your snowbird season
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <Calendar className="h-12 w-12 text-blue-600" />
          </div>
          
          <h2 className={`text-2xl md:text-3xl font-bold text-blue-900 mb-4 ${heading}`}>
            Coming Soon
          </h2>
          
          <p className="text-gray-600 max-w-lg mb-6">
            We're working on launching our comprehensive home management service for Canadian snowbirds. 
            Stay tuned for peace of mind while you're away from your Canadian home.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
            <FeaturePreview 
              icon={<Home className="h-6 w-6 text-blue-500" />}
              title="Home Checks"
              description="Regular inspections of your property"
            />
            <FeaturePreview 
              icon={<Mail className="h-6 w-6 text-blue-500" />}
              title="Mail Service"
              description="Mail collection and forwarding"
            />
            <FeaturePreview 
              icon={<Bell className="h-6 w-6 text-blue-500" />}
              title="Emergency Response"
              description="Immediate action when issues arise"
            />
            <FeaturePreview 
              icon={<Clock className="h-6 w-6 text-blue-500" />}
              title="Maintenance"
              description="Seasonal property maintenance"
            />
          </div>
          
          <div className="mt-8">
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Join Waitlist
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Expected launch: Winter 2025/2026 season
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface FeaturePreviewProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeaturePreview: React.FC<FeaturePreviewProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-center">
      <div className="flex justify-center mb-2">
        {icon}
      </div>
      <h4 className="font-medium text-blue-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
};

export default HomeManagementService;