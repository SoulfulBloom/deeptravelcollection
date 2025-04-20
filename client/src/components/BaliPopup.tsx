import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Download, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const BaliPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only show the popup after 5 seconds if it hasn't been shown before
    const hasShownPopup = localStorage.getItem('hasShownBaliPopup');
    
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark that we've shown the popup
    localStorage.setItem('hasShownBaliPopup', 'true');
  };

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
      // Save the email for marketing purposes if needed
      await apiRequest('POST', '/api/free-bali-sample', { email });
      
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your free Bali itinerary will be downloaded shortly.",
      });
      
      // Trigger the download
      window.location.href = "/api/download-bali-sample";
      
      // Close the popup after a few seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isSubmitted ? (
              <span className="text-green-600 flex items-center justify-center">
                <Check className="mr-2 h-6 w-6" /> Success!
              </span>
            ) : (
              "FREE Bali Travel Itinerary"
            )}
          </DialogTitle>
          <button 
            onClick={handleClose} 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {!isSubmitted && (
            <DialogDescription className="text-center pt-2">
              Discover Bali's hidden gems with our free 7-day itinerary!
            </DialogDescription>
          )}
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-green-50 p-6 rounded-lg w-full text-center">
              <p className="text-green-800 font-medium mb-2">Thank you! Your free Bali itinerary is ready.</p>
              <p className="text-gray-600 text-sm">We've sent a copy to your email for future reference.</p>
            </div>
            <Button 
              variant="default" 
              className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = "/api/download-bali-sample"}
            >
              <Download className="h-4 w-4" />
              Download Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="relative bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900">What You'll Get:</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>7-day premium Bali itinerary with local insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>Hidden gem recommendations not found in guidebooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>Practical travel tips including transport & budget info</span>
                </li>
              </ul>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-left">
                Where should we send your free itinerary?
              </Label>
              <Input
                id="email"
                placeholder="your.email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <DialogFooter className="sm:justify-center mt-2 gap-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Preparing..." : "Get My Free Bali Itinerary"}
              </Button>
            </DialogFooter>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BaliPopup;