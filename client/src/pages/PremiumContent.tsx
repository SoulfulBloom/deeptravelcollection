import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  MapPin, 
  Utensils, 
  Home, 
  Calendar, 
  Lightbulb, 
  AlertCircle, 
  DollarSign, 
  Plane, 
  FileText, 
  Clock 
} from "lucide-react";

type PremiumContentProps = {
  params: {
    id: string;
  };
};

const PremiumContent: React.FC<PremiumContentProps> = ({ params }) => {
  const destinationId = parseInt(params.id);
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Payment verification - default to not paid
  const [isPaid, setIsPaid] = useState(false);

  // Fetch destination and itinerary data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/destinations', destinationId, 'itinerary'],
    queryFn: async () => {
      const response = await fetch(`/api/destinations/${destinationId}/itinerary`);
      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }
      return response.json();
    },
    enabled: !!destinationId,
  });
  
  // Additional premium content - would normally come from the API
  const premiumContent = {
    restaurantRecommendations: [
      {
        name: "Bistro Locale",
        description: "Farm-to-table restaurant featuring seasonal ingredients and innovative presentations. Their chef's tasting menu is a must-try experience.",
        priceRange: "$$$",
        cuisine: "Modern Fusion",
        signature: "Herb-crusted lamb with root vegetable purée"
      },
      {
        name: "Ocean View",
        description: "Stunning waterfront restaurant specializing in sustainably-sourced seafood. Book an outdoor table for sunset views.",
        priceRange: "$$$$",
        cuisine: "Seafood",
        signature: "Grilled octopus with citrus and herb oil"
      },
      {
        name: "Café Cultura",
        description: "Cozy café beloved by locals for its authentic dishes and relaxed atmosphere. Great for breakfast and lunch.",
        priceRange: "$$",
        cuisine: "Local Traditional",
        signature: "Homemade pastries and specialty coffee"
      }
    ],
    accommodationTips: [
      {
        name: "Old Town District",
        description: "Historical center with charming architecture, walking distance to main attractions and numerous restaurants.",
        priceRange: "$$ - $$$",
        bestFor: "First-time visitors and cultural enthusiasts",
        recommendation: "Hotel Antigua (boutique) or City Plaza (luxury)"
      },
      {
        name: "Bayside Area",
        description: "Modern waterfront district with stunning views and upscale shopping. More peaceful than the city center.",
        priceRange: "$$$ - $$$$",
        bestFor: "Luxury travelers and honeymooners",
        recommendation: "The Waterfront Resort or Marina Suites"
      },
      {
        name: "Northern Hills",
        description: "Residential area with local flavor, excellent public transport connections and authentic restaurants.",
        priceRange: "$ - $$",
        bestFor: "Budget travelers and longer stays",
        recommendation: "Hill View Guesthouse or Northern Apartments"
      }
    ],
    localTips: [
      "Visit the central market on Tuesday mornings when local farmers bring their freshest produce",
      "The museum district offers free admission on the first Sunday of each month",
      "Locals eat dinner much later than in Canada - prime dining time is 8-10pm",
      "Take advantage of the excellent public transportation system instead of taxis",
      "Avoid the southern beaches in summer as they get extremely crowded - the northern coves are more peaceful"
    ],
    canadianSpecificInfo: {
      visaRequirements: "Canadian citizens can visit for up to 90 days without a visa. Your passport must be valid for at least 6 months beyond your planned departure date.",
      healthcareInfo: "While emergency care is available, comprehensive travel insurance is strongly recommended as Canadian provincial health plans offer limited or no coverage abroad.",
      costOfLiving: "Approximately 15% lower than major Canadian cities. Credit cards are widely accepted, but keep some local currency for small establishments and markets.",
      canadianCommunity: "There's an active Canadian expat community that meets monthly at the International Club. Contact details are provided in the full PDF.",
      comparisonToCanada: "The climate is significantly warmer than southern Canada year-round. Public transportation is more extensive than in most Canadian cities, and the pace of life is generally more relaxed."
    },
    bestTimeToVisit: "Spring (April-June) and fall (September-October) offer pleasant temperatures and fewer tourists. Summer brings festivals but higher prices and crowds.",
    packingTips: [
      "Lightweight, breathable clothing with one light jacket for evening breezes",
      "Comfortable walking shoes for cobblestone streets and hiking trails",
      "Adapters for Type C electrical outlets (different from North American plugs)",
      "Reef-safe sunscreen and insect repellent",
      "Reusable water bottle – tap water is safe to drink throughout the country"
    ],
    transportationTips: [
      "The public transit card (available at the airport) offers significant savings over individual tickets",
      "Bicycle rentals are available throughout the city and provide a fantastic way to explore",
      "For trips to nearby towns, the regional train is more scenic and often faster than driving",
      "If renting a car, note that parking in the city center is difficult and expensive",
      "Rideshare apps work well in urban areas but have limited availability in rural regions"
    ],
    culturalNotes: "Greeting people with a light handshake is customary in business settings, while friends may greet with cheek kisses. Punctuality is appreciated but not strictly adhered to for social gatherings. Tipping around 10% is standard for good service in restaurants."
  };

  // Handle download button click
  const handleDownload = async () => {
    if (!data) return;
    
    setIsPdfGenerating(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your premium content...",
    });
    
    try {
      // API request to generate and download the PDF with session ID for payment verification
      const response = await fetch(`/api/destinations/${destinationId}/download?sessionId=${sessionId}`, {
        method: 'GET',
      });
      
      if (response.status === 403) {
        // Payment verification failed
        const data = await response.json();
        toast({
          title: "Payment Required",
          description: "Your payment couldn't be verified. Please purchase this guide to access premium content.",
          variant: "destructive",
        });
        
        // Redirect to checkout if payment verification failed
        if (data.redirect) {
          navigate(data.redirect);
        }
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      // Create a download link for the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${data.destination.name}_Premium_Itinerary.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete!",
        description: "Your premium guide has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Check for session ID in URL and verify payment
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Extract sessionId from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session_id');
        
        if (session) {
          setSessionId(session);
          
          // Verify payment with the server
          const response = await fetch(`/api/payments/status/${session}`);
          const data = await response.json();
          
          if (data.status === 'completed') {
            setIsPaid(true);
            toast({
              title: "Payment Verified",
              description: "Your premium guide is ready for download",
            });
          } else {
            // Payment not verified, redirect to destination page
            toast({
              title: "Payment Required",
              description: "Please purchase this guide to access premium content",
              variant: "destructive",
            });
            navigate(`/destination/${destinationId}`);
          }
        } else {
          // No session ID found, redirect to destination page
          toast({
            title: "Payment Required",
            description: "Please purchase this guide to access premium content",
            variant: "destructive",
          });
          navigate(`/destination/${destinationId}`);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        navigate(`/destination/${destinationId}`);
      }
    };
    
    checkPaymentStatus();
  }, [destinationId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-10 space-y-8">
        <div className="h-8 w-2/3 bg-muted animate-pulse rounded-md mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container max-w-5xl py-10 text-center">
        <h2 className="text-2xl font-bold text-red-500">Error loading premium content</h2>
        <p className="text-muted-foreground">Please try again later or contact support</p>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => navigate(`/destination/${destinationId}`)}
        >
          Return to Destination Page
        </Button>
      </div>
    );
  }

  const { destination, itinerary, days } = data;

  return (
    <div className="container max-w-5xl py-10 space-y-10">
      {/* Header section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
            PREMIUM CONTENT
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-gradient bg-gradient-to-r from-primary to-purple-600">
          {destination.name}, {destination.country}
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
          Your complete 7-day travel guide with exclusive recommendations and local insights
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {isPaid ? (
            <Button
              size="lg"
              className="w-full sm:w-auto font-semibold"
              onClick={handleDownload}
              disabled={isPdfGenerating}
            >
              <Download className="mr-2 h-5 w-5" />
              {isPdfGenerating ? "Generating PDF..." : "Download Complete Guide (PDF)"}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full sm:w-auto font-semibold bg-gradient-to-r from-blue-600 to-blue-700"
              onClick={() => navigate(`/checkout?type=premium_itinerary&destinationId=${destinationId}`)}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Purchase Premium Guide ($19.99)
            </Button>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Itinerary preview */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 shadow-md">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Your 7-Day Itinerary</h2>
            </div>
            
            <div className="space-y-6">
              {days.slice(0, 3).map((day: any) => (
                <div key={day.id} className="space-y-3">
                  <h3 className="text-lg font-semibold">Day {day.dayNumber}: {day.title}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Morning</div>
                        <p className="text-sm text-muted-foreground">{day.morningActivity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Afternoon</div>
                        <p className="text-sm text-muted-foreground">{day.afternoonActivity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Evening</div>
                        <p className="text-sm text-muted-foreground">{day.eveningActivity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {days.length > 3 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground italic">
                    Plus {days.length - 3} more days in the complete PDF guide...
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Restaurant recommendations */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center mb-4">
              <Utensils className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Restaurant Recommendations</h2>
            </div>
            
            <div className="space-y-5">
              {premiumContent.restaurantRecommendations.map((restaurant, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                    <span className="text-sm bg-muted px-2 py-1 rounded">
                      {restaurant.priceRange} • {restaurant.cuisine}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground my-2">{restaurant.description}</p>
                  <div className="text-sm font-medium">
                    Signature dish: <span className="italic">{restaurant.signature}</span>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground italic">
                  Plus 12 more restaurant recommendations in the complete PDF guide...
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right column - Additional info */}
        <div className="space-y-6">
          {/* Accommodation tips */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center mb-4">
              <Home className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Where to Stay</h2>
            </div>
            
            <div className="space-y-4">
              {premiumContent.accommodationTips.slice(0, 2).map((area, index) => (
                <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <h3 className="font-semibold">{area.name}</h3>
                  <p className="text-sm text-muted-foreground my-1">{area.description}</p>
                  <div className="text-xs">
                    <span className="font-medium">Best for:</span> {area.bestFor}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Price range:</span> {area.priceRange}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">We recommend:</span> {area.recommendation}
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-1">
                <p className="text-xs text-muted-foreground italic">
                  Plus more areas in the complete guide...
                </p>
              </div>
            </div>
          </Card>

          {/* Local tips */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Local Tips & Secrets</h2>
            </div>
            
            <ul className="space-y-2">
              {premiumContent.localTips.slice(0, 3).map((tip, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-center pt-3">
              <p className="text-xs text-muted-foreground italic">
                Plus more insider tips in the complete guide...
              </p>
            </div>
          </Card>

          {/* Canadian-specific info */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">For Canadian Travelers</h2>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium block">Visa Requirements:</span>
                <p className="text-muted-foreground">{premiumContent.canadianSpecificInfo.visaRequirements}</p>
              </div>
              
              <div>
                <span className="font-medium block">Healthcare:</span>
                <p className="text-muted-foreground">{premiumContent.canadianSpecificInfo.healthcareInfo}</p>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground italic">
                  More Canadian-specific content in the PDF...
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom section - Additional value */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Also Included in Your Premium Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold">Packing List</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Detailed, season-specific packing recommendations
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold">Safety Information</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Areas to avoid and local emergency contacts
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold">Budget Breakdown</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Typical costs for meals, transportation, and activities
            </p>
          </div>
        </div>
      </Card>

      {/* Footer reminder */}
      <div className="bg-muted/30 p-6 rounded-lg text-center">
        <p className="text-muted-foreground mb-2">
          {isPaid 
            ? "Remember to download your complete guide using the button at the top of this page" 
            : "Purchase the complete guide to unlock all premium content"}
        </p>
        {isPaid ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isPdfGenerating}
            className="mt-2"
          >
            <Download className="mr-2 h-4 w-4" />
            {isPdfGenerating ? "Generating..." : "Download Complete Guide (PDF)"}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/checkout?type=premium_itinerary&destinationId=${destinationId}`)}
            className="mt-2"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Purchase Premium Guide
          </Button>
        )}
        
        <div className="mt-4 pt-4 border-t border-border text-sm">
          <p>Need personalized advice or trip customization?</p>
          <p className="font-medium">Contact our licensed travel agent: 289-231-6599 | kymm@deeptravelcollections.com</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumContent;