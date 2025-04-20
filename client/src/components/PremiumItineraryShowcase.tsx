import React from 'react';
import { MapPin, Calendar, Clock, Coffee, Sun, Moon, Star, Info, MessageCircle, HeartHandshake } from 'lucide-react';

// Sample images can be imported when needed
// import localMarketImage from '@assets/local-market.jpg';

interface PremiumItineraryShowcaseProps {
  cityName?: string;
  countryName?: string;
}

const PremiumItineraryShowcase: React.FC<PremiumItineraryShowcaseProps> = ({ 
  cityName = "Sample City", 
  countryName = "Sample Country" 
}) => {
  const heading = "text-primary/90";

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 mb-6">
        <h3 className={`${heading} text-xl font-bold mb-2 flex items-center`}>
          <Star className="h-5 w-5 mr-2 text-amber-500" /> 
          Local Immersion Highlights
        </h3>
        <p className="text-blue-700 mb-3 text-sm">
          Our premium itineraries are designed to immerse you in authentic local experiences beyond typical tourist activities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="bg-amber-100 p-2 rounded-full">
              <MessageCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Apprentice with a Master Craftsman</h4>
              <p className="text-sm text-slate-600">Private workshop sessions with artisans preserving centuries-old techniques.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Coffee className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Hidden Local Experiences</h4>
              <p className="text-sm text-slate-600">Traditional cultural experiences in authentic settings not found in guidebooks.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="bg-purple-100 p-2 rounded-full">
              <HeartHandshake className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Community Cooking Exchange</h4>
              <p className="text-sm text-slate-600">Share recipes and stories with local families while preparing regional specialties.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Seasonal Festival Insider Access</h4>
              <p className="text-sm text-slate-600">Participate in local festivals with guided access to ceremonies usually closed to tourists.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Day 1: Ancient Traditions & Modern Rhythms
            </h3>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">PREMIUM</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cultural Context Sidebar */}
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h4 className="font-semibold text-indigo-800 flex items-center">
              <Info className="h-4 w-4 mr-2" /> Cultural Context: Local Customs
            </h4>
            <p className="text-sm text-indigo-700 mt-1">
              Our premium itineraries include essential cultural context to help you navigate local customs respectfully. Learn about appropriate greetings, dining etiquette, and important social norms that will enhance your travel experience and show respect to the local community.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-2 rounded-full mr-4 shrink-0">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center">
                  <h4 className="font-semibold text-lg text-slate-800">Morning: Cultural Heritage Sites</h4>
                  <span className="ml-2 text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 7:30 AM - 11:30 AM
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-slate-700">
                    Begin your journey at sunrise when local activities are just beginning. Visit important cultural sites without crowds, then follow scenic paths through the area. Your local guide will share insights and point out details that most visitors miss.
                  </p>
                  <div className="flex items-start mt-2">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      <MapPin className="h-4 w-4 text-blue-700" />
                    </div>
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Specific Location:</span> Each itinerary provides exact entry points and insider tips on the most scenic areas to explore.
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mt-2">
                    <p className="text-sm italic text-amber-800">
                      "Instead of rushing through, I paused at a small local café. An elderly local joined me and shared stories about how the area has changed. That spontaneous conversation taught me more about the destination's transformation than any guidebook." - Recent traveler, 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-2 rounded-full mr-4 shrink-0">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center">
                  <h4 className="font-semibold text-lg text-slate-800">Afternoon: Artisan Masterclass</h4>
                  <span className="ml-2 text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 1:00 PM - 4:30 PM
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-slate-700">
                    Visit a workshop of a master artisan in a historic district. Unlike commercial tours, our relationship with local craftspeople provides a hands-on experience with personalized guidance. Learn the significance of traditional techniques before creating a small piece to take home.
                  </p>
                  
                  {/* Like a Local Tip */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mt-3">
                    <h5 className="font-semibold text-emerald-800 flex items-center text-sm">
                      <Star className="h-4 w-4 mr-1" /> Like a Local Tip
                    </h5>
                    <p className="text-sm text-emerald-700 mt-1">
                      Most tourists visit only the main tourist centers. Instead, ask local artisans where they eat lunch—often at small family-owned establishments with only a few seats that don't appear on English maps. These hidden gems typically serve seasonal foods from local sources.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-2 rounded-full mr-4 shrink-0">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center">
                  <h4 className="font-semibold text-lg text-slate-800">Evening: Dinner with a Renowned Chef</h4>
                  <span className="ml-2 text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 6:00 PM - 9:00 PM
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-slate-700">
                    Enjoy an intimate dinner where a celebrated chef serves seasonal delicacies in an authentic setting. Unlike most dining experiences, we've arranged for the chef to personally explain each course's significance, creating a more meaningful cultural exchange.
                  </p>
                  
                  {/* Authentic Connections */}
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mt-3">
                    <h5 className="font-semibold text-purple-800 flex items-center text-sm">
                      <HeartHandshake className="h-4 w-4 mr-1" /> Authentic Connection Opportunity
                    </h5>
                    <p className="text-sm text-purple-700 mt-1">
                      Our connections with local communities often lead to meaningful interactions with family members who share fascinating perspectives on growing up in traditional settings while balancing with modernity—providing rare glimpses into local family dynamics.
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm text-rose-700 bg-rose-50 p-2 rounded-lg">
                    <p className="font-medium">Reservation Note: Premium dining experiences must be booked well in advance. Dietary accommodations are possible with prior notice.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day 2 Preview */}
      <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Day 2: Nature & Spiritual Reflection
            </h3>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">PREMIUM</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-2 rounded-full mr-3">
                <Coffee className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-lg text-slate-800">Morning: Spiritual Forest Meditation</h4>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">7:00 AM - 11:00 AM</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-dashed border-slate-200 py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-2 rounded-full mr-3">
                <Sun className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-lg text-slate-800">Afternoon: Traditional Crafts Village</h4>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">1:00 PM - 5:00 PM</span>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-2 rounded-full mr-3">
                <Moon className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-lg text-slate-800">Evening: Cultural District Night Tour</h4>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">6:30 PM - 10:00 PM</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Additional Premium Features In Your Complete Itinerary:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Complete 7-Day Plan</h4>
              <p className="text-sm text-slate-600">Detailed morning, afternoon and evening activities for each day.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Seasonal Adaptations</h4>
              <p className="text-sm text-slate-600">Alternative suggestions for each season with festival calendars.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Restaurant Reservations Guide</h4>
              <p className="text-sm text-slate-600">Contact details and phrases to use when booking hard-to-get reservations.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Transportation Logistics</h4>
              <p className="text-sm text-slate-600">Detailed instructions with offline-accessible transit maps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumItineraryShowcase;