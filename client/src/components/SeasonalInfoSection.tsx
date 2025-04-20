import { useQuery } from "@tanstack/react-query";
import { useFonts } from "./ui/fonts";
import { CalendarDays, Cloud, CloudRain, Umbrella, Sun, AlertTriangle, CalendarClock, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

interface SeasonalInfoSectionProps {
  destinationId: number;
}

export default function SeasonalInfoSection({ destinationId }: SeasonalInfoSectionProps) {
  const { heading } = useFonts();

  // Only fetch for destinations with IDs that have seasonal data (23 for Tokyo, 24 for Barcelona, 25 for Bali)
  const shouldFetch = [23, 24, 25].includes(destinationId);

  const { data: seasonalInfo, isLoading } = useQuery({
    queryKey: [`/api/destinations/${destinationId}/seasonal`],
    enabled: shouldFetch,
  });

  const { data: peakMonths } = useQuery({
    queryKey: [`/api/destinations/${destinationId}/peak-tourist-months`],
    enabled: shouldFetch,
  });

  if (!shouldFetch) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Define types for the seasonal data
  interface SeasonInfo {
    description: string;
    months: string[];
  }
  
  interface SeasonalData {
    seasons: {
      summer: SeasonInfo;
      winter: SeasonInfo;
      shoulderSeasons: SeasonInfo;
    };
    peakTouristMonths: string[];
    weatherAlerts: string[];
    majorEvents: Array<{
      name: string;
      months: string[] | string;
      impactLevel: string;
    }>;
  }
  
  // Get proper seasonal info or fallback to placeholder if API not working
  const getSeasonalInfo = (): SeasonalData | null => {
    // Check if we got data from API
    if (seasonalInfo && typeof seasonalInfo === 'object') {
      // Convert API data to our expected format
      const apiData: any = seasonalInfo;
      
      const formattedData: SeasonalData = {
        seasons: {
          summer: {
            description: apiData.summerDescription || "Summer season",
            months: apiData.summerMonths || ["June", "July", "August"]
          },
          winter: {
            description: apiData.winterDescription || "Winter season",
            months: apiData.winterMonths || ["December", "January", "February"]
          },
          shoulderSeasons: {
            description: apiData.bestTimeDescription || "Shoulder seasons offer mild weather and fewer tourists",
            months: apiData.bestTimeMonths || ["April", "May", "September", "October"]
          }
        },
        peakTouristMonths: (peakMonths && 'peakMonths' in peakMonths) ? peakMonths.peakMonths : [],
        weatherAlerts: apiData.weatherAlerts ? [apiData.weatherAlerts] : [],
        majorEvents: apiData.events || []
      };
      
      return formattedData;
    }
    
    // Fallback data if API response not working
    switch (destinationId) {
      case 23: // Tokyo
        return {
          seasons: {
            summer: { description: "Hot and humid with temperatures ranging from 25-35°C (77-95°F)", months: ["June", "July", "August"] },
            winter: { description: "Cold with occasional snow, temperatures range from 0-10°C (32-50°F)", months: ["December", "January", "February"] },
            shoulderSeasons: { description: "Spring (cherry blossoms) and Fall (autumn foliage) are considered the best times to visit", months: ["March", "April", "May", "September", "October", "November"] }
          },
          peakTouristMonths: ["March", "April", "October", "November"],
          weatherAlerts: ["Typhoon season from August to October", "Rainy season in June"],
          majorEvents: [
            { name: "Cherry Blossom Season", months: ["March", "April"], impactLevel: "High" },
            { name: "Autumn Foliage", months: ["November"], impactLevel: "Medium" },
            { name: "Tokyo Olympics", months: ["July", "August"], impactLevel: "Very High" }
          ]
        };
      case 24: // Barcelona
        return {
          seasons: {
            summer: { description: "Hot with temperatures ranging from 24-30°C (75-86°F)", months: ["June", "July", "August"] },
            winter: { description: "Mild with temperatures ranging from 9-15°C (48-59°F)", months: ["December", "January", "February"] },
            shoulderSeasons: { description: "Spring and fall offer pleasant temperatures and fewer tourists", months: ["March", "April", "May", "September", "October", "November"] }
          },
          peakTouristMonths: ["June", "July", "August"],
          weatherAlerts: ["Occasional heavy rainfall in October"],
          majorEvents: [
            { name: "La Mercè Festival", months: ["September"], impactLevel: "Medium" },
            { name: "Mobile World Congress", months: ["February"], impactLevel: "High" },
            { name: "Primavera Sound", months: ["June"], impactLevel: "Medium" }
          ]
        };
      case 25: // Bali
        return {
          seasons: {
            summer: { description: "Dry season with temperatures around 27-30°C (80-86°F)", months: ["April", "May", "June", "July", "August", "September", "October"] },
            winter: { description: "Monsoon season with heavy rainfall and high humidity", months: ["November", "December", "January", "February", "March"] },
            shoulderSeasons: { description: "April-June and September-October offer great weather and fewer tourists", months: ["April", "May", "June", "September", "October"] }
          },
          peakTouristMonths: ["July", "August", "December"],
          weatherAlerts: ["Monsoon season from November to March"],
          majorEvents: [
            { name: "Nyepi (Day of Silence)", months: ["March"], impactLevel: "High" },
            { name: "Galungan", months: ["Varies"], impactLevel: "Medium" },
            { name: "Bali Arts Festival", months: ["June", "July"], impactLevel: "Medium" }
          ]
        };
      default:
        return null;
    }
  };

  const data = getSeasonalInfo();
  if (!data) return null;

  // Get weather icon based on destination
  const getWeatherIcon = () => {
    if (destinationId === 23) return <CloudRain className="h-5 w-5 text-blue-500" />; // Tokyo
    if (destinationId === 24) return <Sun className="h-5 w-5 text-yellow-500" />; // Barcelona
    if (destinationId === 25) return <Umbrella className="h-5 w-5 text-teal-500" />; // Bali
    return <Cloud className="h-5 w-5 text-gray-500" />;
  };

  // Get season months with appropriate styling
  const renderSeasonMonths = (months: string[]) => {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {months.map((month) => (
          <Badge key={month} variant="secondary" className="text-xs">
            {month}
          </Badge>
        ))}
      </div>
    );
  };

  // Get impact level badge with appropriate color
  const getImpactBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">{level}</Badge>;
      case 'very high':
        return <Badge className="bg-red-500 hover:bg-red-600">{level}</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{level}</Badge>;
      default:
        return <Badge className="bg-blue-500 hover:bg-blue-600">{level}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className={`text-xl font-semibold ${heading} flex items-center mb-4`}>
        <CalendarDays className="mr-2 h-5 w-5 text-primary" />
        Seasonal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Seasons Section */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium flex items-center text-blue-800">
            {getWeatherIcon()}
            <span className="ml-2">Seasons</span>
          </h3>

          <div className="mt-3 space-y-3">
            <div>
              <h4 className="text-sm font-semibold">Summer</h4>
              <p className="text-sm">{data.seasons.summer.description}</p>
              {renderSeasonMonths(data.seasons.summer.months)}
            </div>

            <div>
              <h4 className="text-sm font-semibold">Winter</h4>
              <p className="text-sm">{data.seasons.winter.description}</p>
              {renderSeasonMonths(data.seasons.winter.months)}
            </div>

            <div>
              <h4 className="text-sm font-semibold">Best Times (Shoulder Seasons)</h4>
              <p className="text-sm">{data.seasons.shoulderSeasons.description}</p>
              {renderSeasonMonths(data.seasons.shoulderSeasons.months)}
            </div>
          </div>
        </div>

        {/* Tourist Traffic Section */}
        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="font-medium flex items-center text-amber-800">
            <Users className="h-5 w-5" />
            <span className="ml-2">Tourist Traffic</span>
          </h3>

          <div className="mt-3">
            <h4 className="text-sm font-semibold">Peak Tourist Months</h4>
            <p className="text-sm">Expect higher prices and crowds during these times:</p>
            {renderSeasonMonths(data.peakTouristMonths || [])}

            <div className="mt-3">
              <h4 className="text-sm font-semibold">Weather Alerts</h4>
              <ul className="mt-1 space-y-1">
                {data.weatherAlerts && data.weatherAlerts.map((alert, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mr-1 flex-shrink-0 mt-0.5" />
                    <span>{alert}</span>
                  </li>
                ))}
                {(!data.weatherAlerts || data.weatherAlerts.length === 0) && (
                  <li className="text-sm italic">No significant weather alerts</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Major Events Section */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-medium flex items-center text-green-800">
            <CalendarClock className="h-5 w-5" />
            <span className="ml-2">Major Events</span>
          </h3>

          <div className="mt-3 space-y-3">
            {data.majorEvents && data.majorEvents.map((event, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{event.name}</h4>
                  {getImpactBadge(event.impactLevel)}
                </div>
                <p className="text-xs text-gray-600">
                  {Array.isArray(event.months) ? event.months.join(', ') : event.months}
                </p>
              </div>
            ))}
            {(!data.majorEvents || data.majorEvents.length === 0) && (
              <p className="text-sm italic">No major events information available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}