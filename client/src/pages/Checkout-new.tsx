import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe - this key should be the public key from your Stripe account
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Price constants
const PRODUCT_PRICES = {
  premium_itinerary: 19.99,
  premium_consultation: 49.99,
  premium_subscription: 39.99
};

// Promotion settings
const PROMOTION = {
  discountPercentage: 20,
  code: 'SALE20',
  isActive: true
};

// Digital Nomad product prices
const DIGITAL_NOMAD_PRICES = {
  'digital-nomad-basic': 49.99,
  'digital-nomad-premium': 79.99
};

// Define Snowbird Toolkit price
const SNOWBIRD_TOOLKIT_PRICE = 9.99;

// Payment form component using Stripe Elements
function CheckoutForm({ price, purchaseType, destinationId, product, originalPrice, isPromoApplied }: { 
  price: number;
  purchaseType: string;
  destinationId: string | null;
  product: string | null;
  originalPrice: number;
  isPromoApplied: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: buildSuccessUrl(),
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred with your payment",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    // Payment processing is handled by Stripe, which will redirect to the return_url
  };

  const buildSuccessUrl = () => {
    let successUrl = `${window.location.origin}/checkout-success?type=${purchaseType}`;
    if (destinationId) {
      successUrl += `&destinationId=${destinationId}`;
    }
    if (product) {
      successUrl += `&product=${product}`;
    }
    if (isPromoApplied) {
      successUrl += `&discounted=true&savings=${(originalPrice - price).toFixed(2)}`;
    }
    return successUrl;
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="pt-6">
        <Button
          type="submit"
          className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {isPromoApplied ? (
                <span className="flex items-center justify-center">
                  Pay ${price.toFixed(2)} USD
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full ml-2">
                    20% OFF
                  </span>
                </span>
              ) : (
                `Pay ${price.toFixed(2)} USD`
              )}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [purchaseType, setPurchaseType] = useState<string>("premium_itinerary");
  const [price, setPrice] = useState<number>(19.99);
  const [originalPrice, setOriginalPrice] = useState<number>(19.99);
  const [promoCode, setPromoCode] = useState<string>(PROMOTION.code);
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(PROMOTION.isActive);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailStep, setEmailStep] = useState<boolean>(true);
  
  // Track destination ID for the itinerary being purchased
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  
  // Get query parameters
  const getQueryParams = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return {
        type: params.get('type') || 'premium_itinerary',
        destinationId: params.get('destinationId'),
        product: params.get('product') || null
      };
    }
    return {
      type: 'premium_itinerary',
      destinationId: null,
      product: null
    };
  };

  useEffect(() => {
    // Set purchaseType, destinationId based on query parameters
    const { type, destinationId, product } = getQueryParams();
    
    // Handle product-specific pricing for Digital Nomad package
    if (product && product in DIGITAL_NOMAD_PRICES) {
      setProduct(product);
      const nomadPrice = DIGITAL_NOMAD_PRICES[product as keyof typeof DIGITAL_NOMAD_PRICES];
      setOriginalPrice(nomadPrice);
      
      // Apply 20% discount if promotion is active
      if (PROMOTION.isActive) {
        const discountAmount = nomadPrice * (PROMOTION.discountPercentage / 100);
        const discountedPrice = nomadPrice - discountAmount;
        setPrice(parseFloat(discountedPrice.toFixed(2)));
        setIsPromoApplied(true);
      } else {
        setPrice(nomadPrice);
      }
      
      setPurchaseType("digital_nomad");
    } 
    // Handle Snowbird Toolkit
    else if (product === 'snowbird-toolkit') {
      setProduct(product);
      setOriginalPrice(SNOWBIRD_TOOLKIT_PRICE);
      
      // Apply 20% discount if promotion is active
      if (PROMOTION.isActive) {
        const discountAmount = SNOWBIRD_TOOLKIT_PRICE * (PROMOTION.discountPercentage / 100);
        const discountedPrice = SNOWBIRD_TOOLKIT_PRICE - discountAmount;
        setPrice(parseFloat(discountedPrice.toFixed(2)));
        setIsPromoApplied(true);
      } else {
        setPrice(SNOWBIRD_TOOLKIT_PRICE);
      }
      
      setPurchaseType("snowbird_toolkit");
    } else {
      setPurchaseType(type);
      // Set original price based on purchaseType for regular itineraries
      if (type in PRODUCT_PRICES) {
        const basePrice = PRODUCT_PRICES[type as keyof typeof PRODUCT_PRICES];
        setOriginalPrice(basePrice);
        
        // Apply 20% discount if promotion is active
        if (PROMOTION.isActive) {
          const discountAmount = basePrice * (PROMOTION.discountPercentage / 100);
          const discountedPrice = basePrice - discountAmount;
          setPrice(parseFloat(discountedPrice.toFixed(2)));
          setIsPromoApplied(true);
        } else {
          setPrice(basePrice);
        }
      }
    }
    
    setDestinationId(destinationId);
    setIsLoading(false);
  }, []);

  // Get product title
  const getProductTitle = () => {
    if (purchaseType === 'digital_nomad' && product) {
      switch (product) {
        case 'digital-nomad-basic':
          return 'Digital Nomad Basic Package';
        case 'digital-nomad-premium':
          return 'Digital Nomad Premium Package';
        default:
          return 'Digital Nomad Package';
      }
    }
    
    if (purchaseType === 'snowbird_toolkit') {
      return 'The Ultimate Snowbird Escape Guide';
    }
    
    if (purchaseType === 'pet_travel_guide') {
      return 'The Ultimate Guide to Snowbird Travel with Pets';
    }
    
    switch (purchaseType) {
      case 'premium_itinerary':
        return 'Premium Itinerary';
      case 'premium_consultation':
        return 'Premium Itinerary + Consultation';
      case 'premium_subscription':
        return 'Monthly Subscription';
      default:
        return 'Premium Travel Package';
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create payment intent with the server
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          email: email,
          productType: purchaseType,
          destinationId: destinationId || undefined,
          productId: product || undefined
        }),
      });
      
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setEmailStep(false);
        setIsLoading(false);
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: 'Payment Error',
        description: 'Unable to initialize payment. Please try again later.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Handle apply promo code
  const handleApplyPromoCode = () => {
    if (promoCode === PROMOTION.code) {
      setIsPromoApplied(true);
      const discountAmount = originalPrice * (PROMOTION.discountPercentage / 100);
      const discountedPrice = originalPrice - discountAmount;
      setPrice(parseFloat(discountedPrice.toFixed(2)));
      toast({
        title: "Promo code applied!",
        description: `${PROMOTION.discountPercentage}% discount has been applied to your order.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promotional code.",
        variant: "destructive",
      });
    }
  };

  // Render email collection step
  if (emailStep) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600">Complete your purchase of {getProductTitle()}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Email Address</CardTitle>
                <CardDescription>We'll send your purchase confirmation and download link to this email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com" 
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Continue to Payment"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Product Price */}
                  <div className="flex justify-between">
                    <span>{getProductTitle()}</span>
                    {isPromoApplied ? (
                      <div className="text-right">
                        <span className="text-gray-500 line-through block">${originalPrice.toFixed(2)}</span>
                        <span className="text-green-600 font-medium">${price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {/* Promo Code Section */}
                  <div className="border border-dashed border-amber-300 rounded-md bg-amber-50 p-3">
                    <p className="text-amber-800 text-sm font-medium mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Promotional Code
                    </p>
                    <div className="flex gap-2">
                      <Input 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="text-sm bg-white"
                        placeholder="Enter promo code"
                        disabled={isPromoApplied}
                      />
                      {isPromoApplied ? (
                        <Button 
                          type="button" 
                          variant="outline"
                          className="shrink-0 bg-white border-green-500 text-green-600 hover:bg-green-50"
                          disabled
                        >
                          Applied
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          variant="outline"
                          className="shrink-0"
                          onClick={handleApplyPromoCode}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render Stripe payment form
  if (clientSecret) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600">Complete your payment for {getProductTitle()}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>All transactions are secure and encrypted</CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    price={price} 
                    purchaseType={purchaseType} 
                    destinationId={destinationId} 
                    product={product} 
                    originalPrice={originalPrice}
                    isPromoApplied={isPromoApplied}
                  />
                </Elements>
              </CardContent>
              <CardFooter className="justify-between items-center border-t pt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure Payment
                </div>
                <div className="flex gap-2">
                  <img src="/assets/visa.svg" alt="Visa" className="h-8" />
                  <img src="/assets/mastercard-new.svg" alt="Mastercard" className="h-8" />
                  <img src="/assets/amex.svg" alt="American Express" className="h-8" />
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{getProductTitle()}</span>
                    {isPromoApplied ? (
                      <div className="text-right">
                        <span className="text-gray-500 line-through block">${originalPrice.toFixed(2)}</span>
                        <span className="text-green-600 font-medium">${price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {isPromoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Promo Discount ({PROMOTION.discountPercentage}%)</span>
                      <span className="text-emerald-700">-${(originalPrice - price).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${price.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Email: {email}</p>
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm"
                onClick={() => setEmailStep(true)}
              >
                Change
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="container max-w-4xl py-12 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h3 className="mt-4 font-medium text-gray-700">Initializing checkout...</h3>
      </div>
    </div>
  );
}