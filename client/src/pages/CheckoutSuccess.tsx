import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Check, ArrowRight, Home } from "lucide-react";

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();
  const [purchaseDetails, setPurchaseDetails] = useState<{
    type: string;
    destinationId?: string;
    product?: string;
    discounted?: boolean;
    savings?: string;
  }>({
    type: 'unknown',
  });
  
  // Get URL params
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Get download link based on product type with session ID for payment verification
  const getDownloadLink = () => {
    // Get session ID from URL for payment verification
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session_id');
    
    if (purchaseDetails.type === 'snowbird_toolkit') {
      return `/api/download-snowbird-toolkit?sessionId=${session}`;
    }
    
    if (purchaseDetails.type === 'digital_nomad_package') {
      return `/api/download-digital-nomad?sessionId=${session}`;
    }
    
    if (purchaseDetails.type === 'pet_travel_guide') {
      return `/api/download-pet-travel-guide?sessionId=${session}`;
    }
    
    // For itineraries, use destination ID
    if (purchaseDetails.destinationId) {
      const destinationId = parseInt(purchaseDetails.destinationId);
      return `/api/destinations/${destinationId}/download?sessionId=${session}`;
    }
    
    // Fallback
    return `/api/download-premium-pdf?sessionId=${session}`;
  };
  
  // Get product title
  const getProductTitle = () => {
    switch (purchaseDetails.type) {
      case 'snowbird_toolkit':
        return 'The Ultimate Snowbird Escape Guide';
      case 'digital_nomad_package':
        return 'Digital Nomad Transition Package';
      case 'pet_travel_guide':
        return 'The Ultimate Guide to Snowbird Travel with Pets';
      case 'premium_itinerary':
        return 'Premium Itinerary';
      case 'premium_consultation':
        return 'Premium Itinerary + Consultation';
      case 'premium_subscription':
        return 'Monthly Subscription';
      default:
        return 'Your Purchase';
    }
  };
  
  const getNextSteps = () => {
    if (purchaseDetails.type === 'digital_nomad_package') {
      return [
        "Review your Digital Nomad Transition Package",
        "Complete the included checklists before your departure",
        "Use the resources to establish your digital work setup",
        "Join our community for ongoing support and networking"
      ];
    }
    
    if (purchaseDetails.type === 'snowbird_toolkit') {
      return [
        "Review your Snowbird Toolkit and checklist items",
        "Begin organizing your documents as recommended",
        "Set up mail forwarding and banking arrangements",
        "Follow the timeline for smooth seasonal transition"
      ];
    }
    
    if (purchaseDetails.type === 'pet_travel_guide') {
      return [
        "Review pet travel regulations for your destination",
        "Schedule required veterinary appointments",
        "Prepare your pet's travel documentation",
        "Pack recommended pet travel essentials"
      ];
    }
    
    // For premium itineraries
    return [
      "Download your premium itinerary PDF",
      "Review your personalized day-by-day guide",
      "Book the recommended experiences and accommodations",
      "Share your itinerary with travel companions"
    ];
  };
  
  useEffect(() => {
    // Get query parameters
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || 'unknown';
    const destinationId = params.get('destinationId');
    const product = params.get('product');
    const discounted = params.get('discounted') === 'true';
    const savings = params.get('savings');
    
    setPurchaseDetails({
      type,
      destinationId: destinationId || undefined,
      product: product || undefined,
      discounted,
      savings
    });
  }, []);

  return (
    <div className="container max-w-4xl py-12">
      <Card className="border-green-200 shadow-md">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="mx-auto bg-green-100 text-green-700 rounded-full p-4 h-16 w-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-green-800">
            Thank You for Your Purchase!
          </CardTitle>
          <CardDescription className="text-center text-green-700 text-lg">
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Order Details</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium">{getProductTitle()}</span>
                </div>
                
                {purchaseDetails.discounted && purchaseDetails.savings && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Savings:</span>
                    <span className="font-medium text-green-600">${purchaseDetails.savings} USD</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Next Steps</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <ul className="space-y-2">
                  {getNextSteps().map((step, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                className="flex items-center text-lg gap-2 py-6 px-8 bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <a href={getDownloadLink()} target="_blank" rel="noopener noreferrer">
                  <Download className="h-5 w-5" />
                  Download Now
                </a>
              </Button>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setLocation('/')}
              >
                <Home className="h-4 w-4" />
                Return to Homepage
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center border-t pt-6 text-center text-sm text-gray-500">
          <p>
            We've also sent a confirmation and download link to your email. 
            <br />
            If you need any assistance, please contact us at support@deeptravelcollections.com
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}