import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

type DestinationLocationProps = {
  regionId: number;
  country: string;
  name: string;
  compact?: boolean;
};

export default function DestinationLocation({ 
  regionId, 
  country, 
  name, 
  compact = false 
}: DestinationLocationProps) {
  // Get region name based on region ID
  const regionName = useMemo(() => {
    const regionsMap: Record<number, string> = {
      13: "Europe",
      14: "Asia",
      15: "North America",
      16: "South America",
      17: "Africa",
      18: "Oceania"
    };
    return regionsMap[regionId] || country;
  }, [regionId, country]);
  
  if (compact) {
    return (
      <div className="flex items-center text-sm text-neutral-500">
        <MapPin className="text-[#F97316] h-4 w-4 mr-2" />
        <span>{regionName}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-base text-neutral-600">
      <MapPin className="text-[#F97316] h-5 w-5 mr-2" />
      <div>
        <span className="font-medium">{name}</span>
        <span className="mx-1">•</span>
        <span>{country}</span>
        <span className="mx-1">•</span>
        <span className="text-neutral-500">{regionName}</span>
      </div>
    </div>
  );
}