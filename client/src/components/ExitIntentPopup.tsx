import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Don't set up the exit intent if it has already been triggered this session
    if (hasTriggered) return;
    
    const storageKey = 'exitIntentShown';
    // Check if the popup has been shown in the last 3 days
    const lastShown = localStorage.getItem(storageKey);
    
    if (lastShown) {
      const lastShownDate = new Date(lastShown);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      // If popup was shown less than 3 days ago, don't show it again
      if (lastShownDate > threeDaysAgo) {
        return;
      }
    }

    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    
    // Function to detect when the user is likely to leave the page
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves to the top of the page (likely to address bar or closing)
      if (e.clientY <= 20 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        localStorage.setItem(storageKey, new Date().toISOString());
        
        // Prevent repeated triggering
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
    
    // Also show the popup after 50 seconds of inactivity
    showTimeout = setTimeout(() => {
      if (!hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        localStorage.setItem(storageKey, new Date().toISOString());
      }
    }, 50000);
    
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (showTimeout) clearTimeout(showTimeout);
    };
  }, [hasTriggered]);
  
  const handleGetGuide = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "You're all set!",
        description: "You'll be redirected to claim your free Bali guide.",
        variant: "default",
      });
      
      // Store that user has claimed the offer
      localStorage.setItem('exitIntentConverted', 'true');
      
      // Redirect to subscription page with the free offer parameter
      setTimeout(() => {
        setLocation('/subscribe?offer=freebali');
      }, 1000);
    }, 800);
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden relative animate-scale-in">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Popup header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-6 text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center">Wait! Your Free Travel Guide Awaits</h2>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Image */}
            <div className="w-full md:w-2/5">
              <div className="relative">
                <img 
                  src="/assets/beach-5264739_1280.jpg" 
                  alt="Bali Travel Guide" 
                  className="w-full rounded-lg shadow-lg border-2 border-white"
                />
                <div className="absolute -top-3 -right-3 bg-amber-500 text-white font-bold text-xs px-2 py-1 rounded">
                  $19.99 VALUE
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-3/5">
              <p className="text-lg font-medium text-gray-900 mb-4">
                Subscribe today and receive our <span className="font-bold text-blue-600">Premium Bali Destination Guide</span> absolutely FREE!
              </p>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Complete 7-day itinerary with local insights</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">15+ curated restaurant recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Hidden gems known only to locals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Detailed neighborhood guides for accommodations</span>
                </li>
              </ul>
              
              <p className="text-sm text-gray-600 italic mb-6">
                This exclusive bonus is our way of welcoming you to Deep Travel Collections.
              </p>
              
              <Button 
                onClick={handleGetGuide}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg font-bold py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Yes, I Want My Free Bali Guide'}
              </Button>
              
              <div className="text-center mt-4">
                <button 
                  onClick={handleClose} 
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  No thanks, I'll explore without the free guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}