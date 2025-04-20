import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Elements, PaymentElement, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call loadStripe outside of a component's render to avoid recreating the Stripe object
// on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Payment form component using Stripe Elements
interface PaymentFormProps {
  email: string;
  clientSecret: string;
}

function PaymentTestForm({ clientSecret, email }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  // Toggle between test card numbers for successful and failed payments
  const [testCardNumber, setTestCardNumber] = useState('4242424242424242');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card element not found');
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Test User',
          email: email || 'test@example.com',
        },
      }
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsProcessing(false);
    } else if (paymentIntent) {
      setSucceeded(true);
      toast({
        title: 'Payment Successful',
        description: `Thank you for your purchase!`,
      });
      
      // Redirect to success page
      setTimeout(() => {
        window.location.href = `/payment-success?payment_id=${paymentIntent.id}`;
      }, 1500);
    } else {
      setIsProcessing(false);
    }
  };

  const handleTestCardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTestCardNumber(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="hidden">
          <select 
            value={testCardNumber}
            onChange={handleTestCardChange}
            className="w-full p-2 border rounded"
          >
            <option value="4242424242424242">Success Card (4242...)</option>
            <option value="4000000000000002">Declined Card (4000...0002)</option>
            <option value="4000000000009995">Insufficient Funds (4000...9995)</option>
          </select>
        </div>
        
        <div className="shadow-sm rounded-md overflow-hidden p-4 border border-gray-200">
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
        

        
        {errorMessage && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
            {errorMessage}
          </div>
        )}
        
        {succeeded ? (
          <div className="flex items-center justify-center p-4 text-green-600 bg-green-50 rounded">
            <CheckCircle className="mr-2 h-5 w-5" />
            Payment completed successfully!
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white text-lg"
            disabled={isProcessing || !stripe || !elements}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

export default function TestPayment() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState("19.99");
  const [email, setEmail] = useState("test@example.com");
  const [productName, setProductName] = useState("Premium Travel Guide");
  const [productType, setProductType] = useState("premium_itinerary");
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get parameters from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      if (params.get('email')) {
        setEmail(params.get('email') || email);
      }
      
      if (params.get('price')) {
        setAmount(params.get('price') || amount);
      }
      
      if (params.get('productName')) {
        setProductName(params.get('productName') || productName);
      }
      
      if (params.get('productType')) {
        setProductType(params.get('productType') || productType);
      }
      
      setDestinationId(params.get('destinationId'));
      setTemplateId(params.get('templateId'));
    }
  }, []);

  const createPaymentIntent = async () => {
    setIsInitializing(true);

    try {
      // Create payment intent with the server
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          email: email,
          productType: productType,
          destinationId: destinationId || undefined,
          templateId: templateId || undefined,
        }),
      });
      
      const data = await response.json();
      console.log("Payment intent response:", data);
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        toast({
          title: "Payment Ready",
          description: "Payment form initialized successfully",
        });
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: 'Setup Error',
        description: 'Unable to initialize payment. Please check the logs.',
        variant: 'destructive',
      });
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (email) {
      createPaymentIntent();
    }
  }, [email, amount, productType]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleRestart = () => {
    createPaymentIntent();
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
        <p className="text-gray-600">Complete your purchase of {productName}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                {clientSecret ? "Complete the payment form below" : "Preparing your payment..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#4F46E5',
                      }
                    },
                    loader: 'auto'
                  }}
                >
                  <PaymentTestForm clientSecret={clientSecret} email={email} />
                </Elements>
              ) : (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                  <span>Initializing secure payment...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between font-medium">
                  <span>{productName}</span>
                  <span>${parseFloat(amount).toFixed(2)}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${parseFloat(amount).toFixed(2)} USD</span>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-800">
                  <p className="font-medium mb-1">Order Details:</p>
                  <p>Email: {email}</p>
                  {destinationId && <p>Destination ID: {destinationId}</p>}
                  {productType && <p>Product Type: {productType}</p>}
                </div>
              </div>
            </CardContent>

          </Card>
        </div>
      </div>
    </div>
  );
}