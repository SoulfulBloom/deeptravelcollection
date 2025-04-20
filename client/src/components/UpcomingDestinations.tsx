import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function UpcomingDestinations() {
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
        source: 'travel_guide'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: "Thank you for subscribing!",
          description: "Your free guide is downloading now.",
        });
        
        // Trigger the download
        window.location.href = data.downloadUrl;
        
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
    <div className="bg-blue-600 py-12 px-4">
      <div className="container mx-auto relative">
        {/* EXCLUSIVE OFFER Badge */}
        <div className="absolute -top-4 left-4 md:left-0">
          <div className="bg-blue-700 text-white px-4 py-2 rounded-full flex items-center shadow-md">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
            <span className="font-bold tracking-wide">EXCLUSIVE OFFER</span>
          </div>
        </div>
        
        {/* Value badge */}
        <div className="absolute -top-4 right-4 md:right-0">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-md font-bold">
            $16.99 VALUE - FREE
          </div>
        </div>

        <div className="pt-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
            Get Your Free Ultimate Immersive Travel Guide
          </h2>
          
          <div className="bg-blue-800/50 p-8 rounded-lg mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              What You'll Get:
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-green-400 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">Step-by-step authentic travel experience planning templates</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-400 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">Local interaction strategy and cultural immersion tips</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-400 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">Exclusive authentic travel checklists & planning resources</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-400 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white text-lg">24-page beautifully designed digital guidebook</span>
              </li>
            </ul>
            
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="pl-10 py-6 bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-600 text-white py-6 px-8 font-bold text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'GET FREE GUIDE'}
                  </Button>
                </div>
                <p className="text-sm text-white/80">
                  Plus, we'll send you monthly updates with new authentic travel experiences. You can unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}