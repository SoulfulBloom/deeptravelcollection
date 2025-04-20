import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';

const WhyConsiderAlternatives: React.FC = () => {
  useEffect(() => {
    document.title = "Why Consider Alternatives to the US | Deep Travel Collections";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="absolute inset-0 bg-pattern-snowflakes opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">TRAVEL ADVISORY</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Why Canadians Should Reconsider US Travel in 2025
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              With significant changes affecting cross-border travel, Canadians face new challenges when visiting the United States. 
              From policy volatility to economic pressures, here's what you need to know before planning your next US trip.
            </p>
          </div>
        </div>
      </section>
      
      {/* Political Reality Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold text-blue-800">The Political Reality</h2>
                <p className="text-xl mt-2 font-medium text-blue-600">Four More Years of Uncertainty</p>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-6">
                  With President Trump now in office until 2029, Canadian travelers face a prolonged period 
                  of policy volatility and border uncertainty. This isn't simply about political preferences — 
                  it's about concrete policy changes directly impacting travelers.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Executive Order Changes</h3>
                    <p className="text-gray-700">
                      "Protecting the American People Against Invasion" has fundamentally changed cross-border travel
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Longer Wait Times</h3>
                    <p className="text-gray-700">
                      Border security intensification has led to extended waits and more intensive questioning
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Policy Volatility</h3>
                    <p className="text-gray-700">
                      Rapid changes without notice have left many Canadians stranded or scrambling to comply
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Travel Advisories</h3>
                    <p className="text-gray-700">
                      Canadian government warnings have increased in frequency and severity
                    </p>
                  </Card>
                </div>
              </div>
            </div>
            
            <Separator className="my-12" />
            
            {/* New Registration Requirements */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold text-blue-800">New Registration Requirements</h2>
                <p className="text-xl mt-2 font-medium text-blue-600">A Bureaucratic Nightmare</p>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-6">
                  As of April 2025, the US has implemented stringent new registration requirements that create 
                  significant hurdles for Canadian travelers, especially those planning longer stays.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Mandatory Registration</h3>
                    <p className="text-gray-700">
                      All Canadians 14 and older staying in the US for 30+ days must register with US Citizenship and Immigration Services
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Digital Documentation</h3>
                    <p className="text-gray-700">
                      Travelers must create USCIS accounts and complete Form G-325R before travel
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Constant Verification</h3>
                    <p className="text-gray-700">
                      Digital proof of registration must be carried throughout the entire stay
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Harsh Penalties</h3>
                    <p className="text-gray-700">
                      Non-compliance can result in fines up to $5,000 or imprisonment up to six months
                    </p>
                  </Card>
                </div>
              </div>
            </div>
            
            <Separator className="my-12" />
            
            {/* Canadians Voting With Their Feet */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold text-blue-800">Canadians Are Voting With Their Feet</h2>
                <p className="text-xl mt-2 font-medium text-blue-600">The Mass Exodus</p>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-6">
                  Recent statistics reveal a mass exodus of Canadian travelers from US destinations, representing 
                  the lowest level of Canadian travel to the US since the COVID-19 pandemic.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow text-center">
                    <div className="text-4xl font-bold text-blue-700 mb-2">26%</div>
                    <h3 className="text-lg font-semibold mb-2">Border Crossing Decrease</h3>
                    <p className="text-gray-700 text-sm">
                      Decline in land border crossings into the United States (March 2025 vs. March 2024)
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow text-center">
                    <div className="text-4xl font-bold text-blue-700 mb-2">31.9%</div>
                    <h3 className="text-lg font-semibold mb-2">Automobile Trip Decline</h3>
                    <p className="text-gray-700 text-sm">
                      Drop in Canadian-resident return trips by automobile to 1.5 million (March 2025)
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow text-center">
                    <div className="text-4xl font-bold text-blue-700 mb-2">70%</div>
                    <h3 className="text-lg font-semibold mb-2">Flight Booking Drop</h3>
                    <p className="text-gray-700 text-sm">
                      Decrease in flight bookings from Canada to the US (March 2025 vs. previous year)
                    </p>
                  </Card>
                </div>
              </div>
            </div>
            
            <Separator className="my-12" />
            
            {/* Economic Double-Whammy */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold text-blue-800">The Economic Double-Whammy</h2>
                <p className="text-xl mt-2 font-medium text-blue-600">Financial Burden</p>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-6">
                  The financial reality for Canadians traveling to the US has become increasingly prohibitive, 
                  especially for retirees on fixed incomes who have traditionally spent winters in warmer US states.
                </p>
                
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <div className="mb-4 h-60 bg-gray-100 flex items-center justify-center rounded">
                    <div className="flex space-x-4 w-full px-8">
                      <div className="h-40 w-1/5 bg-blue-700 relative flex flex-col justify-end rounded">
                        <div className="absolute top-0 w-full text-center -mt-6 text-sm font-medium">Exchange Rate</div>
                        <div className="p-2 text-white text-xs text-center">-22%</div>
                      </div>
                      <div className="h-48 w-1/5 bg-blue-600 relative flex flex-col justify-end rounded">
                        <div className="absolute top-0 w-full text-center -mt-6 text-sm font-medium">Insurance</div>
                        <div className="p-2 text-white text-xs text-center">+35%</div>
                      </div>
                      <div className="h-28 w-1/5 bg-blue-500 relative flex flex-col justify-end rounded">
                        <div className="absolute top-0 w-full text-center -mt-6 text-sm font-medium">Property</div>
                        <div className="p-2 text-white text-xs text-center">Selloff</div>
                      </div>
                      <div className="h-24 w-1/5 bg-blue-400 relative flex flex-col justify-end rounded">
                        <div className="absolute top-0 w-full text-center -mt-6 text-sm font-medium">Registration</div>
                        <div className="p-2 text-white text-xs text-center">New Fees</div>
                      </div>
                      <div className="h-32 w-1/5 bg-blue-300 relative flex flex-col justify-end rounded">
                        <div className="absolute top-0 w-full text-center -mt-6 text-sm font-medium">Tariffs</div>
                        <div className="p-2 text-white text-xs text-center">Price Impact</div>
                      </div>
                    </div>
                  </div>
                  <blockquote className="italic text-gray-700 border-l-4 border-blue-500 pl-4">
                    "When you factor in the exchange rate, increased insurance costs, and new registration fees, 
                    my winter in Florida would cost nearly double what it did five years ago," reports one Ontario snowbird.
                  </blockquote>
                </div>
              </div>
            </div>
            
            <Separator className="my-12" />
            
            {/* Healthcare Complications */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold text-blue-800">Healthcare Complications</h2>
                <p className="text-xl mt-2 font-medium text-blue-600">Medical Uncertainty</p>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-6">
                  For many Canadians, particularly seniors, healthcare access has become increasingly complicated 
                  in the US, adding another layer of risk for travelers with ongoing medical conditions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Insurance Exclusions</h3>
                    <p className="text-gray-700">
                      Many US medical facilities now require additional documentation beyond standard travel insurance
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Pre-existing Condition Scrutiny</h3>
                    <p className="text-gray-700">
                      Insurers have tightened restrictions on coverage for pre-existing conditions
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Emergency Care Costs</h3>
                    <p className="text-gray-700">
                      The average cost of an emergency room visit for Canadians has increased to $3,700 USD
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Claim Denial Rates</h3>
                    <p className="text-gray-700">
                      Canadian insurance companies report a 34% increase in US medical claim denials
                    </p>
                  </Card>
                </div>
              </div>
            </div>
            
            <Separator className="my-12" />
            
            {/* Psychological Impact */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold text-blue-800">The Psychological Impact</h2>
                <p className="text-xl mt-2 font-medium text-blue-600">Emotional Considerations</p>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-6">
                  Beyond practical considerations, many Canadians report feeling unwelcome or uncomfortable 
                  in the current US climate, adding an emotional dimension to travel decisions.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-700 font-bold">67%</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Feeling Unwelcome</h3>
                      <p className="text-gray-700 text-sm">feel "less welcome" than five years ago</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-700 font-bold">58%</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Political Expression Concerns</h3>
                      <p className="text-gray-700 text-sm">worry about expressing opinions</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-700 font-bold">43%</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Identity Concerns</h3>
                      <p className="text-gray-700 text-sm">fear confrontations about Canadian identity</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-700 font-bold">71%</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Minority Anxiety</h3>
                      <p className="text-gray-700 text-sm">of visible minorities report increased travel anxiety</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mt-6 italic">
                  This psychological dimension shouldn't be underestimated — vacation destinations are chosen not just 
                  for weather and amenities, but for how welcome and comfortable travelers feel.
                </p>
              </div>
            </div>
            
            <Separator className="my-12" />
            
            {/* Business Travel Decline */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold text-blue-800">Business Travel Decline</h2>
                <p className="text-xl mt-2 font-medium text-blue-600">Corporate Shifts</p>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-6">
                  It's not just leisure travelers reconsidering US trips. Canadian businesses are shifting their 
                  approaches as well, with long-term implications for Canadian-US business relationships.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Corporate Policy Changes</h3>
                    <p className="text-gray-700">
                      42% of major Canadian corporations have implemented new approval processes for US business travel
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Virtual Alternatives</h3>
                    <p className="text-gray-700">
                      68% report increased use of virtual meetings instead of in-person US meetings
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Trade Show Attendance</h3>
                    <p className="text-gray-700">
                      Canadian participation in US trade shows has declined by 37%
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Alternative Venues</h3>
                    <p className="text-gray-700">
                      International conferences previously held in US cities are increasingly relocating to Toronto, Vancouver, and Montreal
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Explore Alternative Destinations</h2>
            <p className="text-lg mb-8">
              With these challenges in mind, many Canadians are discovering incredible alternative destinations
              that offer warm weather, welcoming communities, and often better value for your travel dollar.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/canadian-snowbirds/destinations">
                <span className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Browse Snowbird Destinations
                </span>
              </Link>
              <Link href="/canadian-snowbirds/destination-finder">
                <span className="inline-block bg-white hover:bg-gray-100 text-blue-700 font-medium py-3 px-6 rounded-lg border border-blue-700 transition-colors">
                  Take Our Destination Quiz
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyConsiderAlternatives;