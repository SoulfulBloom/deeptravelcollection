import React, { useState, useEffect } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';

// Minimal test component that just renders a payment element
function SimpleStripeTest() {
  const [ready, setReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div className="border p-4 rounded-md mb-6">
      <h3 className="font-medium mb-2">Basic Stripe Elements Test</h3>
      <p className="text-sm text-gray-500 mb-4">
        This tests if Stripe elements can render properly:
      </p>

      <div className="bg-gray-50 p-3 rounded-md mb-4">
        <p className="text-xs mb-2">Status:</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-32 text-xs">Stripe loaded:</div>
          {stripe ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-32 text-xs">Elements loaded:</div>
          {elements ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 text-xs">Payment UI ready:</div>
          {ready ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
        </div>
      </div>

      <div className="border border-gray-200 rounded p-4 mb-4 bg-white">
        <PaymentElement 
          onReady={() => {
            console.log("Stripe payment element is ready");
            setReady(true);
          }}
          onChange={(e) => {
            console.log("Element change event:", e);
          }}
        />
      </div>
    </div>
  );
}

// Main test page
export default function StripeDiagnostic() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [testStage, setTestStage] = useState(0);
  
  // Get Stripe public key from environment
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  // Initialize Stripe
  const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

  // Test server-side Stripe connection
  const testServerConnection = async () => {
    setLoading(true);
    setTestStage(1);
    try {
      const response = await fetch('/api/payments/stripe-status');
      const data = await response.json();
      setResults(data);
      
      if (data.success) {
        toast({
          title: "Server Connection Test Passed",
          description: "Your Stripe API keys are working on the server side.",
        });
        setTestStage(2);
      } else {
        toast({
          title: "Server Connection Test Failed",
          description: data.message || "There was a problem with your Stripe API keys.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error testing Stripe connection:", error);
      setResults({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      toast({
        title: "Connection Error",
        description: "Could not connect to the server to test Stripe.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test creating a payment intent
  const testCreatePaymentIntent = async () => {
    if (testStage < 2) {
      // Run the server test first if it hasn't been done
      await testServerConnection();
    }
    
    setLoading(true);
    setTestStage(3);
    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 0.50,
          email: 'test@example.com',
          productType: 'test_payment'
        }),
      });
      
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        toast({
          title: "Payment Intent Created",
          description: "Successfully created a test payment intent.",
        });
        setTestStage(4);
      } else {
        toast({
          title: "Payment Intent Failed",
          description: data.message || "Failed to create a payment intent.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast({
        title: "Payment Intent Error",
        description: "Could not create a test payment intent.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Stripe Connection Diagnostic</CardTitle>
          <CardDescription>
            Test your Stripe API connection and payment form rendering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Stripe Configuration</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Public Key:</div>
                <div>{stripePublicKey ? "✅ Configured" : "❌ Missing"}</div>
                <div className="font-medium">Public Key Format:</div>
                <div>{stripePublicKey?.startsWith('pk_') ? "✅ Valid format" : "❌ Invalid format"}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Test Progress</h3>
            <Progress value={testStage * 25} className="h-2 mb-2" />
            <div className="grid grid-cols-4 text-xs text-center">
              <div className={testStage >= 1 ? "text-blue-600 font-medium" : ""}>1. Start</div>
              <div className={testStage >= 2 ? "text-blue-600 font-medium" : ""}>2. Server API</div>
              <div className={testStage >= 3 ? "text-blue-600 font-medium" : ""}>3. Payment Intent</div>
              <div className={testStage >= 4 ? "text-blue-600 font-medium" : ""}>4. Elements Test</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={testServerConnection} 
              disabled={loading}
              className="w-full"
            >
              {loading && testStage === 1 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Server Connection...
                </>
              ) : "1. Test Stripe Server Connection"}
            </Button>
            
            <Button 
              onClick={testCreatePaymentIntent} 
              disabled={loading || testStage < 2}
              className="w-full"
            >
              {loading && testStage === 3 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Payment Intent...
                </>
              ) : "2. Test Creating Payment Intent"}
            </Button>
          </div>

          {results && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Test Results</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {clientSecret && (
        <Card>
          <CardHeader>
            <CardTitle>Stripe Elements Test</CardTitle>
            <CardDescription>
              Testing if Stripe Elements render correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stripePromise ? (
              <Elements 
                stripe={stripePromise} 
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  }
                }}
              >
                <SimpleStripeTest />
              </Elements>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <span>Stripe public key is missing. Please check your environment variables.</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <p>This test creates a real payment intent of $0.50 but doesn't charge any cards</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}