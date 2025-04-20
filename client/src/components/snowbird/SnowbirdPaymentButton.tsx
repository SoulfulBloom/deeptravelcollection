import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, CreditCard, Loader2, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaSnowflake } from 'react-icons/fa';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SnowbirdPaymentButtonProps {
  destinationId: number;
  destinationName: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showPrice?: boolean;
  price?: number;
}

export function SnowbirdPaymentButton({
  destinationId,
  destinationName,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
  showPrice = true,
  price = 9.99
}: SnowbirdPaymentButtonProps) {
  // IMPORTANT: destinationId here is from snowbird_destinations table, not destinations table
  // We must never use this ID with the destinations foreign key in user_purchases
  // The database schema requires destination_id to be a valid reference to the destinations table
  const [isLoading, setIsLoading] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
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
    
    let hasError = false;
    
    // Validate email
    if (!email) {
      setEmailError('Please enter your email address');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }
    
    // Validate names
    if (!firstName || firstName.length < 2) {
      setNameError('Please enter your first name (at least 2 characters)');
      hasError = true;
    } else if (!lastName || lastName.length < 2) {
      setNameError('Please enter your last name (at least 2 characters)');
      hasError = true;
    } else {
      setNameError('');
    }
    
    if (hasError) return;
    
    setEmailDialogOpen(false);
    
    try {
      setIsLoading(true);
      
      console.log('Sending payment data:', {
        destinationId: null, // Using null for standard products without destination
        email,
        firstName,
        lastName,
        productType: 'snowbird_toolkit',
        amount: price
      });
      
      // Create a direct payment
      const response = await fetch('/api/direct-payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationId: null, // Don't send destination ID for general products
          email,
          firstName,
          lastName,
          productType: 'snowbird_toolkit',
          amount: price
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to process payment');
      }
      
      // Redirect to success page
      window.location.href = `/checkout-processing?purchaseId=${data.purchaseId}&email=${encodeURIComponent(email)}`;
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
            Premium Guide{showPrice ? ` ($${price.toFixed(2)})` : ''}
          </>
        )}
      </Button>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              <div className="flex items-center">
                <FaSnowflake className="text-blue-500 mr-2" />
                {destinationName} Premium Snowbird Guide
              </div>
            </DialogTitle>
            <DialogDescription>
              Unlock comprehensive details about living in {destinationName} as a Canadian snowbird. We'll send your premium guide to your email after purchase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Premium Guide Includes:</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Detailed restaurant recommendations with exact addresses</li>
              <li>• Specific rental properties and neighborhoods</li>
              <li>• Canadian community meetups and events</li>
              <li>• Healthcare facilities with English-speaking staff</li>
              <li>• Month-by-month activities and recommendations</li>
            </ul>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-medium">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="firstName" 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name" 
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-medium">
                    Last Name
                  </Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Your last name" 
                  />
                </div>
              </div>
              {nameError && (
                <p className="text-sm text-red-500 mt-1">{nameError}</p>
              )}

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
                By providing your information, you agree to receive your purchased guide and related updates.
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
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                Continue to Payment (${price.toFixed(2)})
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SnowbirdPremiumButton({
  destinationId,
  destinationName,
}: {
  destinationId: number;
  destinationName: string;
}) {
  return (
    <div className="relative">
      <SnowbirdPaymentButton 
        destinationId={destinationId}
        destinationName={destinationName}
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-300"
      />
    </div>
  );
}