import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Download, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InfoPackPreviewProps {
  destinationName: string;
  destinationId: number;
}

const InfoPackPreview: React.FC<InfoPackPreviewProps> = ({
  destinationName,
  destinationId,
}) => {
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Redirecting to payment",
      description: `Processing your purchase for ${destinationName} premium guide`,
      duration: 5000,
    });
    
    // Redirect to the checkout page with destination ID
    window.location.href = `/checkout?type=premium_itinerary&destinationId=${destinationId}`;
  };

  return (
    <div className="my-10 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600">
          Premium Travel Guide Preview
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
          Get an exclusive look at what's included in our premium {destinationName} travel guide.
          Only $19.99 CAD for the complete package.
        </p>
      </div>

      {/* Sample pages with semi-transparent overlay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <Card className="p-4 overflow-hidden relative border-2 border-primary">
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/70 to-white/20 z-10">
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-md shadow-lg text-xs font-bold">
              PREMIUM
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-primary/90 text-white p-3 text-center font-medium">
              Unlock Complete 7-Day Itinerary
            </div>
          </div>
          <h3 className="font-semibold mb-2">Day-by-Day Itinerary</h3>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-muted rounded-md">
              <div className="font-bold">Day 1: Arrival & First Impressions</div>
              <div>Morning: Start with a visit to the central market district</div>
              <div>Afternoon: Guided walking tour of historical sites</div>
              <div>Evening: Welcome dinner at a local favorite restaurant</div>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <div className="font-bold">Day 2: Cultural Immersion</div>
              <div>Morning: Museum and gallery explorations</div>
              <div>Afternoon: Interactive cultural workshop</div>
              <div>Evening: Live music performance with dinner</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 overflow-hidden relative border-2 border-primary">
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/70 to-white/20 z-10">
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-md shadow-lg text-xs font-bold">
              PREMIUM
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-primary/90 text-white p-3 text-center font-medium">
              Unlock 15+ Restaurant Recommendations
            </div>
          </div>
          <h3 className="font-semibold mb-2">Restaurant Recommendations</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="font-medium">Fine Dining</span>
            </div>
            <div className="border-l-2 border-muted-foreground/20 pl-3 ml-1 space-y-2">
              <div>Le Bistro Central - $$$</div>
              <div>Oceanview Restaurant - $$$$</div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="font-medium">Local Favorites</span>
            </div>
            <div className="border-l-2 border-muted-foreground/20 pl-3 ml-1 space-y-2">
              <div>Market Street Café - $</div>
              <div>Harbor Fish House - $$</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 overflow-hidden relative border-2 border-primary">
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/70 to-white/20 z-10">
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-md shadow-lg text-xs font-bold">
              PREMIUM
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-primary/90 text-white p-3 text-center font-medium">
              Unlock Detailed Accommodation Guide
            </div>
          </div>
          <h3 className="font-semibold mb-2">Accommodation Guide</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-muted rounded-md">
              <div className="font-bold">Old Town District</div>
              <div>Best for: First-time visitors</div>
              <div>Price Range: $$ - $$$</div>
              <div>Top Pick: Hotel Antigua</div>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <div className="font-bold">Waterfront Area</div>
              <div>Best for: Luxury travelers</div>
              <div>Price Range: $$$ - $$$$</div>
              <div>Top Pick: Marina Bay Resort</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features list */}
      <div className="max-w-3xl mx-auto bg-muted/30 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">What's Included in Your Premium Pack</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Complete 7-Day Itinerary</span>
              <p className="text-sm text-muted-foreground">Hour-by-hour plans for each day with alternatives for different interests</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Restaurant Guide</span>
              <p className="text-sm text-muted-foreground">15+ curated restaurants with pricing, cuisine details, and signature dishes</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Accommodation Tips</span>
              <p className="text-sm text-muted-foreground">Best neighborhoods to stay in with pros/cons and hotel recommendations</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Local Tips & Secrets</span>
              <p className="text-sm text-muted-foreground">Insider knowledge from residents to avoid tourist traps and find hidden gems</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Cultural Notes</span>
              <p className="text-sm text-muted-foreground">Essential customs, etiquette, and phrases to know for a respectful visit</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Canadian-Specific Guidance</span>
              <p className="text-sm text-muted-foreground">Travel tips specifically tailored for Canadian travelers</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2 text-amber-600">
            <Info className="h-5 w-5" />
            <span className="text-sm">Created by a licensed travel agent with 10+ years of experience</span>
          </div>
          
          <div className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            $19.99 CAD
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <Button
          size="lg"
          className="w-full sm:w-auto font-semibold"
          onClick={handlePurchase}
        >
          <Download className="mr-2 h-5 w-5" />
          Purchase Premium Guide
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => window.location.href = `/subscribe?destinationId=${destinationId}`}
        >
          View All Subscription Options
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Need personalized advice? Contact our licensed travel agent:</p>
        <p className="font-medium">289-231-6599 | kymm@deeptravelcollections.com</p>
      </div>
    </div>
  );
};

export default InfoPackPreview;