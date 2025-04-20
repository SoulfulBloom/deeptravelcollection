import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface InstantGuideFormProps {
  title?: string;
  description?: string;
  guideName?: string;
  guideValue?: string;
  bgColor?: string;
  ctaText?: string;
}

export default function InstantGuideForm({
  title = "Get Your Free Travel Guide",
  description = "Enter your email to receive our premium guide instantly",
  guideName = "Ultimate Immersive Travel Guide",
  guideValue = "$16.99 VALUE",
  bgColor = "bg-blue-600",
  ctaText = "GET FREE GUIDE"
}: InstantGuideFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
        source: 'instant_guide'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: "Thank you for subscribing!",
          description: "Your free guide is downloading now.",
        });
        
        // Trigger the download
        window.location.href = data.downloadUrl;
        
        // Show success state
        setIsSuccess(true);
        
        // Clear the email input
        setEmail('');
        
        // Reset success state after delay
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
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
    <div className={`${bgColor} px-4 py-8 rounded-lg shadow-lg relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>
      
      <div className="max-w-3xl mx-auto relative">
        {/* Value badge */}
        <div className="absolute top-0 right-4 md:right-0 transform -translate-y-1/2">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-md font-bold">
            {guideValue} - FREE
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {title}
          </h3>
          <p className="text-white/90 mt-2">
            {description}
          </p>
        </div>
        
        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <Download className="h-8 w-8 text-white mr-3" />
            <h4 className="text-xl font-semibold text-white">{guideName}</h4>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="pl-10 py-6 bg-white border-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || isSuccess}
                />
              </div>
              <Button 
                type="submit" 
                className={`py-6 px-8 font-bold text-lg ${isSuccess ? 'bg-green-500' : 'bg-amber-500 hover:bg-amber-600'}`}
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Sent!
                  </span>
                ) : (
                  ctaText
                )}
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
        
        <div className="mt-5 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Instant delivery</span>
            </div>
            <div className="flex items-center text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">No credit card</span>
            </div>
            <div className="flex items-center text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">PDF format</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}