import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Coffee, 
  Utensils, 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  ChevronDown, 
  ChevronUp,
  Camera,
  Clock3,
  Star,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export default function SampleItinerary() {
  const [activeDay, setActiveDay] = useState(1);
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

  const toggleActivity = (id: string) => {
    setExpandedActivities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Sample Tokyo itinerary data
  const itineraryData = {
    destination: "Tokyo",
    country: "Japan",
    duration: "5 Days",
    description: "Experience the perfect blend of traditional culture and futuristic technology in the vibrant metropolis of Tokyo.",
    coverImage: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    highlights: [
      "Explore ancient temples and shrines",
      "Experience Tokyo's world-famous food scene",
      "Shop in trendy districts like Shibuya and Harajuku",
      "Visit peaceful gardens amid the bustling city"
    ],
    days: [
      {
        day: 1,
        title: "Traditional Tokyo",
        activities: [
          {
            id: "day1-1",
            time: "Morning",
            icon: <Sunrise className="text-amber-500" />,
            title: "Senso-ji Temple & Asakusa",
            description: "Begin your Tokyo journey at Japan's oldest and most significant Buddhist temple, Senso-ji. Approach via the famous Kaminarimon Gate and explore the vibrant Nakamise Shopping Street.",
            details: "Visit early morning (around 8:00 AM) to avoid crowds. Don't miss the Five-Story Pagoda and the Asakusa Shrine adjacent to the main temple. Consider renting a traditional kimono from nearby rental shops for a more immersive experience.",
            location: "2 Chome-3-1 Asakusa, Taito City",
            duration: "2-3 hours",
            cost: "Free (some areas may have small fees)"
          },
          {
            id: "day1-2",
            time: "Afternoon",
            icon: <Sun className="text-amber-600" />,
            title: "Ueno Park & Museums",
            description: "Explore one of Tokyo's largest public parks, home to several top-tier museums, a serene lotus pond, and the charming Ueno Zoo.",
            details: "Focus on 1-2 museums rather than trying to see them all. The Tokyo National Museum and National Museum of Nature and Science are highlights. In spring, this is one of Tokyo's most famous cherry blossom viewing spots.",
            location: "Uenokoen, Taito City",
            duration: "3-4 hours",
            cost: "¥1,000-2,000 depending on museums visited"
          },
          {
            id: "day1-3",
            time: "Evening",
            icon: <Sunset className="text-red-500" />,
            title: "Ameyoko Market & Local Dinner",
            description: "Experience the lively atmosphere of this post-war black market turned shopping street, then enjoy authentic Tokyo cuisine at a local izakaya.",
            details: "The market is most atmospheric in the late afternoon and early evening. For dinner, try Isehiro in nearby Ueno for traditional grilled skewers (yakitori) or visit Bentenyama Miyoshi for classic tempura.",
            location: "Between Ueno and Okachimachi Stations",
            duration: "2-3 hours",
            cost: "¥2,000-4,000 for dinner"
          }
        ]
      },
      {
        day: 2,
        title: "Modern Tokyo",
        activities: [
          {
            id: "day2-1",
            time: "Morning",
            icon: <Sunrise className="text-amber-500" />,
            title: "Shibuya Crossing & Exploring",
            description: "Experience the world's busiest pedestrian crossing and explore the surrounding Shibuya district, a center of youth fashion and culture.",
            details: "Visit the Shibuya Sky observatory for panoramic views, pay respects at the loyal dog Hachiko's statue, and browse trendy shops like Shibuya 109.",
            location: "Shibuya Station area",
            duration: "2-3 hours",
            cost: "¥2,000 for Shibuya Sky, shopping optional"
          },
          {
            id: "day2-2",
            time: "Afternoon",
            icon: <Sun className="text-amber-600" />,
            title: "Harajuku & Meiji Shrine",
            description: "Contrast the serene, forested grounds of Meiji Shrine with the colorful, trend-setting Harajuku district nearby.",
            details: "Start at Meiji Shrine for spiritual tranquility, then walk down Takeshita Street for a completely different atmosphere with quirky shops and creative street food.",
            location: "1-1 Yoyogikamizonocho, Shibuya City (Meiji Shrine)",
            duration: "3-4 hours",
            cost: "Shrine entry free, ¥1,000-3,000 for street food and shopping"
          },
          {
            id: "day2-3",
            time: "Evening",
            icon: <Sunset className="text-red-500" />,
            title: "Shinjuku Night Experience",
            description: "Immerse yourself in Tokyo's neon-lit entertainment district with its countless restaurants, bars, and nightlife options.",
            details: "Begin at the Tokyo Metropolitan Government Building for free night views, then explore the narrow food alleys of Omoide Yokocho (Memory Lane) or 'Piss Alley' for authentic izakaya experiences. For a uniquely Tokyo experience, visit the Robot Restaurant for dinner and a show.",
            location: "Shinjuku Station area",
            duration: "4-5 hours",
            cost: "¥3,000-8,000 depending on dining and activities"
          }
        ]
      },
      {
        day: 3,
        title: "Cultural Experiences",
        activities: []
      },
      {
        day: 4,
        title: "Tokyo Bay & Gardens",
        activities: []
      },
      {
        day: 5,
        title: "Day Trip to Mt. Fuji Area",
        activities: []
      }
    ]
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 mb-2">Sample Itinerary</Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Experience Our Premium Travel Guides
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            This is a preview of our detailed day-by-day Tokyo itinerary. 
            Our premium guides include full 5-day plans with insider tips, restaurant recommendations, and interactive maps.
          </p>
        </div>

        {/* Itinerary Header */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="h-80 w-full object-cover">
            <img 
              src={itineraryData.coverImage} 
              alt={`${itineraryData.destination}, ${itineraryData.country}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 w-full text-white">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{itineraryData.destination}, {itineraryData.country}</span>
                <Badge className="ml-3 bg-blue-500">{itineraryData.duration}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-3">
                The Ultimate {itineraryData.destination} Experience
              </h1>
              <p className="text-white/90 max-w-3xl">
                {itineraryData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Highlights of This Tokyo Itinerary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Traditional tea ceremony in an authentic Zen garden setting</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Secret local izakaya known only to Tokyo residents</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Hidden hanami (cherry blossom) viewing spots away from crowds</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Guided morning visit to Tsukiji Outer Market with a local chef</span>
            </div>
          </div>
        </div>

        {/* Day Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-1">
          {itineraryData.days.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`px-4 py-2 rounded-lg flex items-center flex-shrink-0 transition-colors ${
                activeDay === day.day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Day {day.day}: {day.title}</span>
            </button>
          ))}
        </div>

        {/* Day Content */}
        {itineraryData.days.map((day) => (
          <div key={day.day} className={activeDay === day.day ? 'block' : 'hidden'}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full h-8 w-8 inline-flex items-center justify-center mr-3">
                {day.day}
              </span>
              Day {day.day}: {day.title}
            </h3>

            {day.activities.length > 0 ? (
              <div className="space-y-8">
                {day.activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-start"
                      onClick={() => toggleActivity(activity.id)}
                    >
                      <div className="flex items-start">
                        <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                          {activity.icon}
                        </div>
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Clock3 className="h-4 w-4 mr-1" />
                            <span>{activity.time}</span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                          <p className="text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                        </div>
                      </div>
                      <div>
                        {expandedActivities[activity.id] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedActivities[activity.id] && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Location</p>
                              <p className="text-sm text-gray-600">{activity.location}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock3 className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Duration</p>
                              <p className="text-sm text-gray-600">{activity.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <DollarSign className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Estimated Cost</p>
                              <p className="text-sm text-gray-600">{activity.cost}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Insider Tips:</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Content Preview</h4>
                <p className="text-gray-600 mb-4">
                  This day's detailed itinerary is available in our premium guide.
                  Purchase the full Tokyo itinerary to access all 5 days of carefully curated experiences.
                </p>
                <Link href="/destinations/tokyo">
                  <Button variant="default">
                    Get Full Itinerary
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ))}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg overflow-hidden shadow-xl">
          <div className="p-8 md:p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Get the Complete {itineraryData.destination} Experience
            </h3>
            <p className="text-white/90 max-w-3xl mx-auto mb-6">
              Unlock all 5 days of our expertly crafted Tokyo itinerary including restaurant recommendations, 
              interactive maps, cultural insights, and insider tips you won't find anywhere else.
            </p>
            <Link href="/destinations/tokyo">
              <Button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 text-lg">
                Get Full {itineraryData.destination} Itinerary
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}