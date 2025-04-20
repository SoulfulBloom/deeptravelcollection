import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaSnowflake } from 'react-icons/fa';

interface CityItineraryButtonProps {
  cityId: string | number;
  cityName: string;
  country: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showPrice?: boolean;
  price?: number;
}

export function CityItineraryButton({
  cityId,
  cityName,
  country,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
  showPrice = true,
  price = 15.99
}: CityItineraryButtonProps) {
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
      
      console.log('Processing snowbird city itinerary:', {
        cityId,
        cityName,
        country,
        email,
        firstName,
        lastName
      });

      // For snowbird city itineraries, we'll navigate directly to the direct checkout page
      // with the email pre-filled and specifying the city ID as a special category
      const params = new URLSearchParams({
        email: email,
        firstName: firstName,
        lastName: lastName,
        type: 'premium_itinerary',
        cityId: cityId.toString(),
        cityName: `${cityName}, ${country}`,
        amount: price.toString()
      });
      
      // Redirect to direct checkout page
      window.location.href = `/direct-checkout?${params.toString()}`;
      
    } catch (error: any) {
      console.error('Payment preparation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while preparing your payment.',
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
            {cityName} Snowbird Guide{showPrice ? ` ($${price.toFixed(2)})` : ''}
          </>
        )}
      </Button>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              <div className="flex items-center">
                <FaSnowflake className="text-blue-500 mr-2" />
                {cityName}, {country} Premium Snowbird Guide
              </div>
            </DialogTitle>
            <DialogDescription>
              Unlock our comprehensive 30+ day guide to help you get set up in your new home away from home in {cityName}, {country}. Includes detailed recommendations, local insights, and practical information to help you settle in. We'll send your guide to your email after purchase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Premium Guide Includes:</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Comprehensive 30+ day guide to help you settle in {cityName}</li>
              <li>• Best neighborhoods for Canadian snowbirds</li>
              <li>• Restaurant recommendations with exact addresses</li>
              <li>• Canadian expatriate community information</li>
              <li>• Healthcare facilities with English-speaking staff</li>
              <li>• Month-by-month activities and local tips</li>
              <li>• Cost breakdown and budgeting information</li>
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

export function SnowbirdCityButton({
  cityId,
  cityName,
  country,
  disabled = false,
}: {
  cityId: string | number;
  cityName: string;
  country: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <CityItineraryButton 
        cityId={cityId}
        cityName={cityName}
        country={country}
        disabled={disabled}
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-300"
      />
    </div>
  );
}