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
console.log("Stripe initialized with public key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY ? "Key exists" : "No key found");

// Price constants
const PRODUCT_PRICES = {
  premium_itinerary: 15.99,
  premium_consultation: 49.99,
  premium_subscription: 39.99,
  snowbird_destination: 24.99,
  monthly_subscription: 19.99,
  annual_subscription: 199.00
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

// Define Pet Travel Guide price
const PET_TRAVEL_GUIDE_PRICE = 8.99;

// Payment form component using Stripe Elements
function CheckoutForm({ price, purchaseType, destinationId, product, originalPrice, isPromoApplied, email }: { 
  price: number;
  purchaseType: string;
  destinationId: string | null;
  product: string | null;
  originalPrice: number;
  isPromoApplied: boolean;
  email: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Effect to log when the component mounts and if Stripe is initialized
  useEffect(() => {
    console.log("CheckoutForm mounted with options:", {
      price,
      purchaseType,
      destinationId,
      product,
      email,
      hasStripe: !!stripe, 
      hasElements: !!elements
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment form submitted");

    if (!stripe || !elements) {
      console.error("Stripe not initialized correctly when submitting form", { 
        hasStripe: !!stripe, 
        hasElements: !!elements 
      });
      toast({
        title: "Payment System Error",
        description: "Payment processing is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Processing payment with Stripe...");

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: buildSuccessUrl(),
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error("Payment failed:", error);
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred with your payment",
          variant: "destructive",
        });
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded with paymentIntent", paymentIntent);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        
        // Redirect to success page
        window.location.href = buildSuccessUrl();
      } else if (paymentIntent) {
        console.log("Payment requires additional steps:", paymentIntent);
        // For 3D Secure or other authentication flows, Stripe will handle the redirect
      }
    } catch (err) {
      console.error("Stripe payment submission error:", err);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
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

  // Use effect to log if the elements are loaded properly
  useEffect(() => {
    if (stripe && elements) {
      console.log("Stripe and elements are properly initialized");
    } else {
      console.log("Stripe initialization status:", 
                  { stripe: stripe ? "loaded" : "not loaded", 
                    elements: elements ? "loaded" : "not loaded" });
    }
  }, [stripe, elements]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Enter your payment details below. This is a secure form processed by Stripe.
        </p>
        <div className="p-4 bg-gray-50 rounded-md">
          <PaymentElement 
            className="mb-4"
            onReady={() => console.log("Stripe payment element is ready")}
            onChange={(e) => {
              console.log("Stripe element change:", e.complete ? "complete" : "incomplete");
            }}
          />
        </div>
      </div>
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
        product: params.get('product') || null,
        email: params.get('email') || "",
        templateId: params.get('templateId')
      };
    }
    return {
      type: 'premium_itinerary',
      destinationId: null,
      product: null,
      email: "",
      templateId: null
    };
  };

  useEffect(() => {
    // Check current path for subscription type
    const path = window.location.pathname;
    
    // Handle subscription products based on URL path
    if (path === '/subscription/monthly') {
      setPurchaseType('monthly_subscription');
      setOriginalPrice(PRODUCT_PRICES.monthly_subscription);
      setPrice(PRODUCT_PRICES.monthly_subscription);
      setIsPromoApplied(false); // Don't apply promo code to subscriptions
      setIsLoading(false);
    } else if (path === '/subscription/annual') {
      setPurchaseType('annual_subscription');
      setOriginalPrice(PRODUCT_PRICES.annual_subscription);
      setPrice(PRODUCT_PRICES.annual_subscription);
      setIsPromoApplied(false); // Don't apply promo code to subscriptions
      setIsLoading(false);
    } else {
      // For non-subscription products, use query parameters
      const { type, destinationId, product, email: emailParam, templateId } = getQueryParams();
      
      // Set email from query parameters if available
      if (emailParam && validateEmail(emailParam)) {
        setEmail(emailParam);
        // If we have a valid email, auto-submit it to create payment intent
        setEmailStep(false); // Skip email step
      }
    
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
        
        setPurchaseType("digital_nomad_package");
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
      } 
      // Handle Pet Travel Guide
      else if (type === 'pet_travel_guide') {
        setOriginalPrice(PET_TRAVEL_GUIDE_PRICE);
        
        // Apply 20% discount if promotion is active
        if (PROMOTION.isActive) {
          const discountAmount = PET_TRAVEL_GUIDE_PRICE * (PROMOTION.discountPercentage / 100);
          const discountedPrice = PET_TRAVEL_GUIDE_PRICE - discountAmount;
          setPrice(parseFloat(discountedPrice.toFixed(2)));
          setIsPromoApplied(true);
        } else {
          setPrice(PET_TRAVEL_GUIDE_PRICE);
        }
        
        setPurchaseType("pet_travel_guide");
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
      
      // If we have an email from params, create payment intent automatically
      if (emailParam && validateEmail(emailParam)) {
        // Set timeout to allow state to update first
        setTimeout(() => {
          createPaymentIntent(emailParam, type, destinationId, product, parseFloat(price.toFixed(2)));
        }, 100);
      }
    }
  }, []);

  // Get product title
  const getProductTitle = () => {
    if (purchaseType === 'digital_nomad_package') {
      return 'Digital Nomad Transition Package';
    }
    
    if (purchaseType === 'snowbird_toolkit') {
      return 'The Ultimate Snowbird Escape Guide';
    }
    
    if (purchaseType === 'pet_travel_guide') {
      return 'The Ultimate Guide to Snowbird Travel with Pets';
    }
    
    switch (purchaseType) {
      case 'premium_itinerary':
        return 'Immersive Experience Guide';
      case 'snowbird_destination':
        return 'Snowbird Destination Guide';
      case 'premium_consultation':
        return 'Premium Itinerary + Consultation';
      case 'premium_subscription':
        return 'Premium Subscription';
      case 'monthly_subscription':
        return 'Monthly All-Access Subscription';
      case 'annual_subscription':
        return 'Annual All-Access Subscription';
      default:
        return 'Premium Travel Package';
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Helper function to create payment intent
  const createPaymentIntent = async (
    emailValue: string, 
    productTypeValue: string = purchaseType,
    destinationIdValue: string | null = destinationId,
    productValue: string | null = product,
    priceValue: number = price
  ) => {
    console.log("Creating payment intent...");
    
    try {
      setIsLoading(true);
      
      // Create payment intent with the server
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: priceValue,
          email: emailValue,
          productType: productTypeValue,
          destinationId: destinationIdValue || undefined,
          productId: productValue || undefined
        }),
      });
      
      const data = await response.json();
      console.log("Payment intent response:", data);
      
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

    createPaymentIntent(email);
  }

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
                {/* Add key={clientSecret} to force re-rendering when clientSecret changes */}
                <Elements 
                  key={clientSecret}
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe'
                    }
                  }}
                >
                  <CheckoutForm 
                    price={price} 
                    purchaseType={purchaseType} 
                    destinationId={destinationId} 
                    product={product} 
                    originalPrice={originalPrice}
                    isPromoApplied={isPromoApplied}
                    email={email}
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