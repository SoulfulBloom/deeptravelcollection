import { useState } from 'react';
import { Button } from './ui/button';
import { Download, CreditCard, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentButtonProps {
  destinationId: number;
  templateId: number;
  destinationName: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showPrice?: boolean;
  price?: number;
  productType?: string;
}

export function PaymentButton({
  destinationId,
  templateId,
  destinationName,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
  showPrice = true,
  price = 15.99, // 20% discount from original $19.99
  productType = 'premium_itinerary'
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { toast } = useToast();

  const handleButtonClick = () => {
    setEmailDialogOpen(true);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setEmailDialogOpen(false);
    
    try {
      setIsLoading(true);
      
      // Collect payment parameters to pass to the test payment page
      const params = new URLSearchParams({
        productName: destinationName || 'Premium Travel Guide',
        productType: productType || 'premium_itinerary',
        price: price ? price.toString() : '19.99',
        email: email,
        destinationId: destinationId ? destinationId.toString() : '23',
        templateId: templateId ? templateId.toString() : '1'
      });
      
      toast({
        title: "Redirecting to secure payment",
        description: "You'll be taken to our payment page",
        duration: 2000,
      });
      
      // Direct to our direct payment checkout page
      setTimeout(() => {
        window.location.href = `/direct-checkout?type=${productType}&destinationId=${destinationId}&email=${encodeURIComponent(email)}`;
      }, 1000);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'An error occurred while processing your payment.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        disabled={disabled || isLoading}
        variant={variant}
        size={size}
        className={`relative ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Buy Now{showPrice ? ` ($${price.toFixed(2)})` : ''}
          </>
        )}
      </Button>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Enter your email to continue</DialogTitle>
            <DialogDescription>
              We'll send your itinerary to this email after purchase.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEmailSubmit} className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Your Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com" 
                    className="pl-10"
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>
              
              <p className="text-xs text-gray-500">
                By providing your email, you agree to receive your purchased itinerary and related updates.
                We respect your privacy and will not share your information.
              </p>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Continue to Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DownloadWithPaymentButton({
  destinationId,
  templateId,
  destinationName,
}: {
  destinationId: number;
  templateId: number;
  destinationName: string;
}) {
  return (
    <div className="relative">
      <PaymentButton 
        destinationId={destinationId}
        templateId={templateId}
        destinationName={destinationName}
        className="download-button glow-button hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-blue-700 text-xl py-6"
        showPrice={true}
        price={15.99} // 20% discount from original $19.99
      />
    </div>
  );
}