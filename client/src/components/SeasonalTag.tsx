import { CalendarDays, CloudRain, Umbrella, Sun, Cloud } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SeasonalTagProps {
  destinationId?: number;
  seasonalInfo?: {
    peakTouristMonths?: string[];
    bestTimeToVisit?: string;
    weatherAlert?: string;
  };
  compact?: boolean;
}

export default function SeasonalTag({ destinationId, seasonalInfo, compact = false }: SeasonalTagProps) {
  // Only show for destinations with IDs that have seasonal data (23 for Tokyo, 24 for Barcelona, 25 for Bali)
  if (!destinationId || ![23, 24, 25].includes(destinationId)) {
    return null;
  }

  // If we don't have the seasonal info yet, fetch from API (but for now just show a placeholder)
  if (!seasonalInfo) {
    // Will be populated with real data once fetched
    const placeholderInfo = getPlaceholderInfo(destinationId);
    seasonalInfo = placeholderInfo;
  }

  // Get the weather icon based on destination
  const getWeatherIcon = () => {
    if (destinationId === 23) return <CloudRain className="h-3 w-3 text-blue-500" />; // Tokyo
    if (destinationId === 24) return <Sun className="h-3 w-3 text-yellow-500" />; // Barcelona
    if (destinationId === 25) return <Umbrella className="h-3 w-3 text-teal-500" />; // Bali
    return <Cloud className="h-3 w-3 text-gray-500" />;
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 mr-1">
              <CalendarDays className="h-3 w-3 mr-1" />
              <span>Best time</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs max-w-[200px]">
              <p className="font-semibold">{seasonalInfo.bestTimeToVisit}</p>
              {seasonalInfo.weatherAlert && (
                <p className="mt-1 text-amber-600">{seasonalInfo.weatherAlert}</p>
              )}
              {seasonalInfo.peakTouristMonths && seasonalInfo.peakTouristMonths.length > 0 && (
                <p className="mt-1">Peak months: {seasonalInfo.peakTouristMonths.join(', ')}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="mt-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              <span>Best time: {seasonalInfo.bestTimeToVisit}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs max-w-[250px]">
              <p className="font-semibold">Best Time to Visit: {seasonalInfo.bestTimeToVisit}</p>
              {seasonalInfo.weatherAlert && (
                <p className="mt-1 text-amber-600">
                  <CloudRain className="h-3 w-3 inline mr-1" />
                  {seasonalInfo.weatherAlert}
                </p>
              )}
              {seasonalInfo.peakTouristMonths && seasonalInfo.peakTouristMonths.length > 0 && (
                <p className="mt-1">Peak tourist months: {seasonalInfo.peakTouristMonths.join(', ')}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

// Placeholder data until we fetch real data
function getPlaceholderInfo(destinationId: number) {
  switch (destinationId) {
    case 23: // Tokyo
      return {
        peakTouristMonths: ["March", "April", "October", "November"],
        bestTimeToVisit: "Spring (Mar-May) & Fall (Sep-Nov)",
        weatherAlert: "Typhoon season from Aug-Oct. Rainy season in June"
      };
    case 24: // Barcelona
      return {
        peakTouristMonths: ["June", "July", "August"],
        bestTimeToVisit: "May-June & Sep-Oct",
        weatherAlert: "Very hot and crowded in August"
      };
    case 25: // Bali
      return {
        peakTouristMonths: ["July", "August", "December"],
        bestTimeToVisit: "April-June & Sep-Oct",
        weatherAlert: "Monsoon season from November to March"
      };
    default:
      return {
        bestTimeToVisit: "Year-round",
      };
  }
}