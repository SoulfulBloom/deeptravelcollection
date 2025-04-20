import { useEffect, useState } from 'react';
import { Clock, Crown } from 'lucide-react';
import { Link } from 'wouter';

export default function FlashSaleBanner() {
  const [showBanner, setShowBanner] = useState(true);
  
  // State for countdown timer - starting with 12 hours, 30 minutes
  const [countdown, setCountdown] = useState({
    hours: 11,
    minutes: 46,
    seconds: 59
  });
  
  useEffect(() => {
    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        // Calculate new countdown values
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        
        // If timer reaches zero, reset it to create urgency
        if (newHours < 0) {
          newHours = 23;
          newMinutes = 59;
          newSeconds = 59;
        }
        
        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
  if (!showBanner) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg text-white py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base border-b-2 border-amber-600 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2 text-xl">⏰</div>
          <div className="border-2 border-white px-1 sm:px-2 py-0.5 rounded-md mr-1 sm:mr-2 text-xs sm:text-sm bg-red-600 font-black">FLASH SALE</div>
          <div className="font-extrabold sm:text-base">VERY LIMITED TIME:</div>
          <div className="ml-2 font-bold">20% OFF!</div>
        </div>
        
        {/* Countdown timer */}
        <div className="flex items-center mt-1 sm:mt-0">
          <span className="font-semibold text-xs sm:text-sm mr-2">Ends in:</span>
          <div className="flex space-x-1">
            <div className="bg-white/20 rounded px-1 sm:px-2 py-0.5 text-center">
              <span className="font-mono font-bold text-white text-xs sm:text-sm">
                {countdown.hours.toString().padStart(2, '0')}
              </span>
              <span className="text-white/80 text-xs sm:text-xs ml-1">h</span>
            </div>
            <div className="bg-white/20 rounded px-1 sm:px-2 py-0.5 text-center">
              <span className="font-mono font-bold text-white text-xs sm:text-sm">
                {countdown.minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-white/80 text-xs sm:text-xs ml-1">m</span>
            </div>
            <div className="bg-white/20 rounded px-1 sm:px-2 py-0.5 text-center">
              <span className="font-mono font-bold text-white text-xs sm:text-sm">
                {countdown.seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-white/80 text-xs sm:text-xs ml-1">s</span>
            </div>
          </div>
          
          <Link href="/subscribe">
            <span className="hidden sm:flex items-center text-white font-bold cursor-pointer group bg-amber-600 hover:bg-amber-700 px-2 sm:px-3 py-0.5 rounded-full transition-all text-xs sm:text-sm ml-2">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-yellow-100 transition-colors">Subscribe</span>
            </span>
          </Link>
          
          <button 
            onClick={() => setShowBanner(false)}
            className="ml-2 p-1 rounded-full hover:bg-amber-600 transition-colors"
            aria-label="Close banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}