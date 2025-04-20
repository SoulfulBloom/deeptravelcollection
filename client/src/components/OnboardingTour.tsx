import { useEffect, useState } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from "@/components/ui/button";

export default function OnboardingTour() {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('hasSeenTour', false);
  const [isReady, setIsReady] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);

  // Function to reset tour state
  const resetTourState = () => {
    setHasSeenTour(false);
    startTour();
  };

  // Function to start the tour
  const startTour = () => {
    const intro = introJs();
    
    intro.setOptions({
      steps: [
        {
          intro: '<h3 class="text-lg font-bold mb-2">Welcome to Deep Travel Collections!</h3><p>Let\'s take a quick tour of our site to help you get the most out of your experience.</p>',
        },
        {
          element: '#top-collections',
          intro: '<h3 class="text-lg font-bold mb-2">Travel Collections</h3><p>Explore our featured collections curated by travel experts, including Snowbird Alternatives for Canadians.</p>',
          position: 'bottom'
        },
        {
          element: '#featured-destinations',
          intro: '<h3 class="text-lg font-bold mb-2">Featured Destinations</h3><p>Discover handpicked destinations from around the world with complete itineraries and local experiences.</p>',
          position: 'top'
        },
        {
          element: '#testimonials',
          intro: '<h3 class="text-lg font-bold mb-2">Traveler Testimonials</h3><p>Read what our travelers have to say about their experiences and get inspired for your next trip.</p>',
          position: 'top'
        },
        {
          element: 'nav',
          intro: '<h3 class="text-lg font-bold mb-2">Navigation</h3><p>Easily find your way around with our navigation menu, access your favorites, and explore collections.</p>',
          position: 'bottom'
        }
      ],
      showStepNumbers: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      nextLabel: 'Next →',
      prevLabel: '← Back',
      doneLabel: 'Done',
      tooltipClass: 'customTooltip',
      highlightClass: 'introjs-highlight',
      buttonClass: 'introjs-button'
    });

    intro.onbeforeexit(() => {
      setHasSeenTour(true);
      return true; // Allow the exit to proceed
    });

    intro.start();
  };

  useEffect(() => {
    // Wait a bit for components to fully render
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // The tour is now manually started only through the button

  // Always show the start button more prominently at the top
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 w-full flex items-center justify-center">
      <div className="container max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        <div className="flex flex-col sm:flex-row items-center mb-2 sm:mb-0">
          <span className="font-bold mr-2 text-lg">🚀</span>
          <span className="font-medium text-center">First time here? Take a guided tour</span>
        </div>
        <Button 
          onClick={resetTourState}
          className="bg-amber-500 hover:bg-amber-600 text-black font-medium shadow-md"
        >
          Start Interactive Tour
        </Button>
      </div>
    </div>
  );
}