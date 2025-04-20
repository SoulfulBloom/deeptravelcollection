import React from 'react';
import { Card, CardContent } from './card';
import { MapPin, Clock, Navigation, Bus, Train, Car } from 'lucide-react';

interface LocationGuidePreviewProps {
  destinationName: string;
  country: string;
}

const LocationGuidePreview: React.FC<LocationGuidePreviewProps> = ({ destinationName, country }) => {
  return (
    <Card className="w-full bg-slate-50 border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Location Guide Preview</h3>
          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Included
          </span>
        </div>
        
        <div className="bg-slate-100 rounded-lg p-8 flex flex-col items-center justify-center text-center relative">
          <div className="absolute -rotate-12 top-8 right-8 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-sm text-sm font-bold shadow-md">
            PREVIEW
          </div>
          
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          
          <p className="text-lg text-slate-600 mb-1">Detailed Location Information</p>
          
          <p className="text-sm text-slate-500 max-w-xl mb-4">
            Our travel guides include comprehensive location details to help you navigate each destination with ease.
          </p>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4 max-w-xl">
            <p className="font-medium text-slate-700 mb-1">Deep Travel Collections Includes</p>
            <p className="text-sm text-slate-600 mb-2">
              Everything you need to find your way around:
            </p>
            <ul className="text-sm text-slate-600 list-disc pl-5 mb-3 space-y-1">
              <li>Detailed addresses and neighborhood information</li>
              <li>Transportation options with estimated travel times</li>
              <li>Local navigation tips from experienced travelers</li>
              <li>Walking routes between nearby attractions</li>
            </ul>
            <p className="text-sm font-medium text-slate-700">
              Enhanced Location Guide Included in All Itineraries
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-2 w-full max-w-xl">
            {[
              { icon: <Bus className="h-4 w-4 mx-auto text-primary" />, label: "Public Transit" },
              { icon: <Car className="h-4 w-4 mx-auto text-primary" />, label: "Driving Tips" },
              { icon: <Train className="h-4 w-4 mx-auto text-primary" />, label: "Railway Info" },
              { icon: <Navigation className="h-4 w-4 mx-auto text-primary" />, label: "Walking Routes" }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded p-2 text-center shadow-sm border border-slate-200"
              >
                {item.icon}
                <p className="text-xs text-slate-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          
          <p className="mt-4 text-sm text-slate-400 italic">
            All itineraries include detailed location information and navigation guidance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationGuidePreview;