import { useState, useEffect } from 'react';
import { Check, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentResponse {
  success: boolean;
  payment?: {
    stripeSessionId: string;
    email: string;
    amount: number;
    status: string;
    createdAt: string;
    destinationId?: number;
    templateId?: number;
    metadata?: {
      productType?: string;
    }
  };
  message?: string;
}

export default function SimplePaymentSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get payment_id from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('payment_id');
    if (id) {
      setPaymentId(id);
      fetchPaymentDetails(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchPaymentDetails = async (id: string) => {
    try {
      // Record the payment first
      const recordResponse = await fetch('/api/payments/success/record-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: id,
          email: localStorage.getItem('userEmail') || 'customer@example.com'
        }),
      });
      
      if (!recordResponse.ok) {
        console.warn('Failed to record payment, but will still show success page');
      }
      
      // Then get the details
      const response = await fetch(`/api/payments/success/details/${id}`);
      const data = await response.json();
      
      setPaymentData(data);
      setIsLoading(false);
      
      // Save payment ID in localStorage for future reference
      localStorage.setItem('lastPaymentId', id);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Could not retrieve payment details. Your payment may still have been successful.',
        variant: 'destructive',
      });
    }
  };

  const getProductName = () => {
    if (!paymentData?.payment) return 'Your purchase';
    
    const productType = paymentData.payment.metadata?.productType;
    
    if (productType === 'snowbird_toolkit') {
      return 'The Ultimate Snowbird Escape Guide';
    } else if (productType === 'pet_travel_guide') {
      return 'The Ultimate Guide to Snowbird Travel with Pets';
    } else if (productType === 'digital_nomad_package') {
      return 'Digital Nomad Transition Package';
    } else {
      return 'Premium Travel Guide';
    }
  };

  const handleDownload = () => {
    // In a real implementation, we would fetch the download URL from the server
    toast({
      title: 'Preparing Download',
      description: 'Your download will begin momentarily...',
    });
    
    // Simulate download delay
    setTimeout(() => {
      // Redirect to a sample PDF file (can be replaced with actual dynamic file)
      window.location.href = '/tokyo_itinerary.pdf';
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentId) {
    return (
      <div className="container max-w-4xl mx-auto py-16">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information Missing</CardTitle>
            <CardDescription>
              We couldn't find payment information in the URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you've completed a payment, please check your email for confirmation 
              or contact customer support with your payment reference.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-16">
      <Card className="mb-8 overflow-hidden">
        <div className="h-2 bg-green-500 w-full"></div>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-medium">{getProductName()}</span>
                </div>
                {paymentData?.payment && (
                  <>
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-medium text-gray-600 text-sm">{paymentData.payment.stripeSessionId.substring(0, 14)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">${paymentData.payment.amount.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{new Date(paymentData.payment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <p className="text-gray-600">
                We've sent an email confirmation to your registered email address.
                Your purchase is available immediately below.
              </p>
              
              <Button 
                onClick={handleDownload} 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Your Purchase
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="justify-center border-t pt-6">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      <div className="text-center text-gray-500 text-sm">
        <p>Questions about your order? Email us at support@example.com</p>
      </div>
    </div>
  );
}