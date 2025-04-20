import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscriptionPageProps {
  params: {
    plan: string; // 'monthly' or 'annual'
  };
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ params }) => {
  const { plan = 'monthly' } = params;
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const isAnnual = plan === 'annual';
  const price = isAnnual ? 199 : 19.99;
  const interval = isAnnual ? 'year' : 'month';
  
  // Features based on plan
  const features = [
    "All Immersive Experience Guides (12+ destinations)",
    "All Snowbird Destination Guides (13+ destinations)",
    "Monthly content updates and new destinations",
    "Priority support and early access",
    "Downloadable PDFs of all guides",
  ];
  
  if (isAnnual) {
    features.push("Two months free compared to monthly subscription");
  } else {
    features.push("Cancel anytime");
  }

  useEffect(() => {
    // Create subscription session when component loads
    const createSubscriptionSession = async () => {
      setLoading(true);
      try {
        const response = await apiRequest("POST", "/api/create-subscription", {
          plan,
          email: localStorage.getItem('userEmail') || '',
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.sessionUrl) {
          // If we get a direct session URL, redirect to it
          window.location.href = data.sessionUrl;
        }
      } catch (error: any) {
        toast({
          title: "Error creating subscription",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createSubscriptionSession();
  }, [plan, toast]);

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            {isAnnual ? 'Annual' : 'Monthly'} Subscription
          </h1>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Deep Travel Collections All-Access</CardTitle>
              <CardDescription>
                {isAnnual 
                  ? 'Annual subscription with two months free'
                  : 'Monthly subscription with flexible cancellation'}
              </CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">${price}</span>
                <span className="text-gray-500 ml-2">per {interval}</span>
                {isAnnual && (
                  <span className="text-green-500 ml-4 text-sm font-medium">
                    Save $40 compared to monthly
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">What's included:</h3>
                <ul className="space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {loading && (
                <div className="mt-8 flex justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
                </div>
              )}
              
              {/* Payment section will go here when we have the client secret */}
              {!loading && clientSecret && (
                <div className="mt-8">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    {/* Payment form will go here */}
                    <PaymentForm returnUrl={window.location.origin + '/success'} />
                  </Elements>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/pricing')}
                disabled={loading}
              >
                Back to Pricing
              </Button>
              
              {!clientSecret && !loading && (
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Retry Payment Setup
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// This component would be defined in the same file or imported
const PaymentForm = ({ returnUrl }: { returnUrl: string }) => {
  // Payment form implementation would go here
  // For now we're just showing a placeholder
  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <p className="text-center text-gray-600 mb-4">
        Payment processing form would be displayed here
      </p>
      <Button 
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={() => window.location.href = returnUrl}
      >
        Complete Checkout (Demo)
      </Button>
    </div>
  );
};

export default SubscriptionPage;