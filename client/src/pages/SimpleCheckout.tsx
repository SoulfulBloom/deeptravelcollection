import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Helper function to get human-readable product names
function getProductName(productType: string): string {
  const productNames: Record<string, string> = {
    'pet-guide': 'Pet Travel Guide',
    'digital-nomad': 'Digital Nomad Transition Package',
    'snowbird-toolkit': 'Canadian Snowbird Toolkit',
    'destination-guide': 'Premium Destination Guide',
    'test': 'Test Product'
  };
  
  return productNames[productType] || 'Travel Product';
}

// Basic payment form component
function SimpleCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setMessage('Card element not found');
      setIsLoading(false);
      return;
    }
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
    });
    
    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
    }
    
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 space-y-4">
        <div className="p-4 border rounded-lg">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }} />
        </div>
        
        {message && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
            {message}
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Payment"
        )}
      </Button>
    </form>
  );
}

// Main component
export default function SimpleCheckout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    amount: number;
    productType: string;
    destinationId?: number;
  } | null>(null);
  
  // Get URL parameters
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
  
  useEffect(() => {
    // Parse URL parameters to get order details
    const params = new URLSearchParams(window.location.search);
    const amount = params.get('amount');
    const productType = params.get('productType');
    const destinationId = params.get('destinationId');
    const email = params.get('email') || '';
    
    // Validate required parameters
    if (!amount || !productType) {
      // Redirect to home page after a short delay if accessing directly without parameters
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
      setError('Missing payment information. Redirecting to home page...');
      setLoading(false);
      return;
    }
    
    const createIntent = async () => {
      try {
        const requestBody: any = {
          amount: parseFloat(amount),
          email: email || '',
          productType: productType,
        };
        
        // Add destination ID if available
        if (destinationId) {
          requestBody.destinationId = parseInt(destinationId, 10);
        }
        
        setOrderDetails({
          amount: parseFloat(amount),
          productType: productType,
          destinationId: destinationId ? parseInt(destinationId, 10) : undefined
        });
        
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('Could not retrieve payment information');
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };
    
    createIntent();
  }, []);
  
  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-600">Redirecting...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{error}</p>
              {error.includes('Redirecting') ? (
                <p className="mt-4 text-sm text-gray-600">
                  Taking you back to our homepage.
                </p>
              ) : (
                <p className="mt-4 text-sm text-gray-600">
                  Please try again or contact support if the issue persists.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Secure Checkout</CardTitle>
            {orderDetails && (
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-medium">{getProductName(orderDetails.productType)}</p>
                <p className="text-lg font-medium text-primary mt-1">${orderDetails.amount.toFixed(2)}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {clientSecret && stripePromise ? (
              <Elements 
                stripe={stripePromise} 
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  }
                }}
              >
                <SimpleCheckoutForm />
              </Elements>
            ) : (
              <p className="text-yellow-600">
                Unable to initialize Stripe. Check your API keys.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}