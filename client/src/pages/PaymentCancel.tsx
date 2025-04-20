import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useFonts } from '@/components/ui/fonts';

export default function PaymentCancel() {
  const { heading } = useFonts();
  
  const handleRetry = () => {
    // Go back to the previous page
    window.history.back();
  };

  return (
    <div className="container max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        
        <h1 className={`text-3xl font-bold mb-2 ${heading}`}>Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was not completed. No charges have been made to your card.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={handleRetry} 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          If you believe this is an error or need assistance, please contact our support team.
        </p>
      </div>
    </div>
  );
}