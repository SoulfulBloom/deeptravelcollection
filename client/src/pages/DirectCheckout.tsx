import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Define product types and interfaces
interface BaseProduct {
  name: string;
  price: number;
  description: string;
  salePrice?: string;
  saleText?: string;
}

// Define product types and prices
const PRODUCTS: Record<string, BaseProduct> = {
  premium_itinerary: {
    name: 'Premium Travel Itinerary',
    price: 15.99, // 20% discount from original $19.99
    salePrice: '19.99',
    saleText: '20% OFF',
    description: 'Comprehensive 30+ day guide to help you get set up in your new home away from home, featuring local community insights, healthcare information, restaurant recommendations, accommodation options, seasonal activities, and much more.'
  },
  snowbird_toolkit: {
    name: 'Canadian Snowbird Toolkit',
    price: 9.99,
    description: 'The ultimate guide for Canadian snowbirds with checklists, legal considerations, healthcare information, and destination comparisons.'
  },
  pet_travel_guide: {
    name: 'Pet Travel Guide',
    price: 8.99,
    description: 'Comprehensive guide for traveling with pets including airline policies, accommodation tips, border crossing requirements, and health considerations.'
  },
  digital_nomad_package: {
    name: 'Digital Nomad Transition Package',
    price: 39.99,
    salePrice: '49.99',
    saleText: '20% OFF',
    description: 'Complete toolkit for Canadians transitioning to digital nomad lifestyle, with visa guidance, tax implications, remote work setup, and destination recommendations.'
  }
};

// Type for product IDs
type ProductId = keyof typeof PRODUCTS;

// Form schema
const checkoutSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  firstName: z.string().min(2, 'First name must contain at least 2 characters'),
  lastName: z.string().min(2, 'Last name must contain at least 2 characters'),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function DirectCheckout() {
  const [, setLocation] = useLocation();
  const [_, params] = useRoute('/direct-checkout');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get product type from URL query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const productType = queryParams.get('type') as ProductId || 'premium_itinerary';
  const destinationId = queryParams.get('destinationId');
  
  // Get product details
  const product = PRODUCTS[productType] || PRODUCTS.premium_itinerary;
  
  // Set up form with validation
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      terms: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);
      
      // Get special city info if provided
      const cityId = queryParams.get('cityId');
      const cityName = queryParams.get('cityName');
      
      // Determine product type - handle special snowbird city itineraries
      // Map snowbird cities to their actual destination IDs in the main destinations table
      let finalDestinationId = null;
      let finalProductType = productType;
      
      if (cityId && cityName && productType === 'premium_itinerary') {
        // This is a snowbird city itinerary
        // Map snowbird destination IDs to their matching destinations table IDs
        const snowbirdCityMap: Record<string, number> = {
          // Map snowbird_destinations IDs to destinations IDs (from our database)
          '6': 56,  // Puerto Vallarta, Mexico
          '7': 35,  // Lisbon -> Amsterdam (closest match we have)
          '8': 32,  // Chiang Mai -> Bangkok (closest match we have)
          '9': 24,  // Malaga -> Barcelona (closest match we have)
          '10': 55, // Medellin, Colombia
          '11': 56, // Mérida -> Puerto Vallarta (similar in Mexico)
          '12': 57, // Costa Rica -> San Jose, Costa Rica
          '13': 60, // Punta Cana, Dominican Republic
          '14': 58, // Panama City, Panama
          '15': 59, // Varadero, Cuba
          // Fallback IDs for the frontend snowbird IDs
          '100': 24, // Algarve -> Barcelona (European destination)
          '101': 56, // Puerto Vallarta, Mexico
          '102': 57, // San Jose, Costa Rica
          '103': 58, // Panama City, Panama
          '104': 60, // Punta Cana, Dominican Republic
          '105': 59  // Varadero, Cuba
        };
        
        // Use mapped ID if available, otherwise use a default ID that exists in the destinations table
        finalDestinationId = snowbirdCityMap[cityId] || 23; // Fallback to Tokyo ID if no mapping
        
        // Add city name to a special log for debugging
        console.log(`Processing special snowbird city itinerary: ${cityName} (ID: ${cityId})`);
        console.log(`Mapped to destination ID: ${finalDestinationId}`);
      } else {
        // Regular destination
        finalDestinationId = destinationId ? parseInt(destinationId, 10) : null;
      }
      
      // Prepare payload for backend
      const payload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        productType: finalProductType,
        destinationId: finalDestinationId,
        amount: product.price,
        // Pass additional info for special snowbird city processing
        cityInfo: cityId && cityName ? {
          cityId,
          cityName
        } : undefined
      };
      
      // Submit to our direct payment endpoint
      const response = await apiRequest('POST', '/api/direct-payment/process', payload);
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Redirect to processing page which will show status and handle download
        setLocation(`/checkout-processing?purchaseId=${result.purchaseId}`);
      } else {
        toast({
          title: 'Payment Error',
          description: result.message || 'There was a problem processing your payment. Please try again.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: 'There was a problem processing your request. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 px-4 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order summary */}
        <div className="md:col-span-1 order-2 md:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{product.name}</span>
                  <span>
                    ${product.price.toFixed(2)}
                    {product.salePrice && (
                      <span className="text-sm line-through ml-2 text-muted-foreground">
                        ${product.salePrice}
                      </span>
                    )}
                  </span>
                </div>
                {product.saleText && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-2 rounded text-center text-sm font-medium">
                    {product.saleText} Limited Time Offer!
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <div className="text-sm text-muted-foreground">
                <p>Secure payment processing</p>
                <p>Instant delivery to your email</p>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded text-sm">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              What you'll receive:
            </h3>
            <p className="text-blue-700 dark:text-blue-200 mb-2">
              {product.description}
            </p>
            <p className="text-blue-600 dark:text-blue-300 text-xs">
              Your purchase will be delivered immediately to your email after checkout.
            </p>
          </div>
        </div>
        
        {/* Checkout form */}
        <div className="md:col-span-2 order-1 md:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Enter your details to complete your purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-sm text-amber-800 dark:text-amber-200">
                      Your purchase will be delivered to this email address immediately after checkout.
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 mt-1"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Complete Purchase - $${product.price.toFixed(2)}`
                      )}
                    </Button>
                  </form>
                </Form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}