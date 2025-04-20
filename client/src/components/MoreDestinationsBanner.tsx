import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function MoreDestinationsBanner() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send the subscription request to our backend
      const response = await apiRequest('POST', '/api/newsletter/subscribe', {
        email,
        source: 'upcoming_destinations'
      });
      
      if (response.ok) {
        toast({
          title: "Thank you for subscribing!",
          description: "You'll be the first to know about new destinations.",
        });
        
        // Clear the email input
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-700 py-12 px-4">
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center justify-center mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <Calendar className="h-5 w-5 mr-2 text-indigo-200" />
          <span className="text-white text-sm font-medium">Updated Monthly</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          More Destinations Added Every Month
        </h2>
        
        <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
          Sign up to be the first in line when new authentic travel experiences become available. Get early access and exclusive offers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center">
            <MapPin className="h-10 w-10 mb-4 text-indigo-200" />
            <h3 className="text-xl font-semibold text-white mb-2">New Destinations</h3>
            <p className="text-indigo-100">Discover fresh, curated authentic experiences in new locations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center">
            <Clock className="h-10 w-10 mb-4 text-indigo-200" />
            <h3 className="text-xl font-semibold text-white mb-2">Early Access</h3>
            <p className="text-indigo-100">Get first dibs on limited seasonal itineraries before they're gone</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center">
            <div className="h-10 w-10 mb-4 text-indigo-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Exclusive Offers</h3>
            <p className="text-indigo-100">Receive special discounts and bonus content for subscribers only</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="email"
                placeholder="Your email address"
                className="pl-10 py-6 bg-white border-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 px-8 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'SUBSCRIBE'}
            </Button>
          </form>
          <p className="text-sm text-indigo-200 mt-3">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}