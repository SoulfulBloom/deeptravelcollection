import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  FaDownload, 
  FaCheckCircle, 
  FaMapMarkedAlt, 
  FaEnvelope, 
  FaArrowRight, 
  FaPassport, 
  FaHospital, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaPlane, 
  FaSuitcase,
  FaFileAlt
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function CanadianSnowbirdSuccess() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(true); // Show download button by default
  const [isPremium, setIsPremium] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Extract query parameters for premium check
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const premium = searchParams.get('premium') === 'true';
    const session = searchParams.get('session_id');
    
    setIsPremium(premium);
    if (session) {
      setSessionId(session);
    }
    
    // Log for debugging
    console.log(`Success page: premium=${premium}, sessionId=${session}`);
  }, []);
  
  // Automatically trigger PDF download when the page loads
  React.useEffect(() => {
    // Only auto-download for free version, not premium purchases
    if (isPremium) {
      toast({
        title: "Thank You for Your Purchase!",
        description: "Your Premium Canadian Snowbird Guide is now available.",
        duration: 5000,
      });
      return;
    }
    
    // Small delay to ensure page is loaded first
    const timer = setTimeout(() => {
      // Only show toast if not from email submission
      if (!isSubmitted) {
        toast({
          title: "Your Guide is Ready!",
          description: "Your Canadian Snowbird Guide is ready to download.",
          duration: 5000,
        });
        
        // Automatically trigger PDF download
        const link = document.createElement('a');
        link.href = '/downloads/THE-ULTIMATE-CANADIAN-SNOWBIRD-DEPARTURE-CHECKLIST.pdf';
        link.download = 'Canadian-Snowbird-Departure-Checklist.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [toast, isSubmitted, isPremium]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    
    // Show success message
    toast({
      title: "Thank You!",
      description: "Your email has been registered. Your guide is downloading now!",
      duration: 5000,
    });
    
    // Automatically trigger PDF download
    const link = document.createElement('a');
    link.href = '/downloads/THE-ULTIMATE-CANADIAN-SNOWBIRD-DEPARTURE-CHECKLIST.pdf';
    link.download = 'Canadian-Snowbird-Departure-Checklist.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsSubmitted(true);
    setShowDownloadButton(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl border-none overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-900/30"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-2">
                <img 
                  src="/images/canada-153554_1280.webp" 
                  alt="Canadian Flag" 
                  className="h-16 md:h-20 w-auto shadow-lg transform -rotate-3"
                />
              </div>
              
              <FaCheckCircle className="text-white text-5xl mx-auto mb-3 animate-bounce" />
              <h1 className="text-3xl font-bold text-white mb-2">Thank You!</h1>
              <p className="text-blue-100 text-lg">Your Premium Travel Resource is Ready</p>
            </div>
          </div>

          <CardHeader className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border-b border-blue-100">
            <div className="absolute -top-5 right-0 bg-red-600 text-white px-4 py-1 rounded-l-full font-bold text-sm tracking-wider transform rotate-2 shadow-md">
              VALUE $16.99
            </div>
            <CardTitle className="text-center text-2xl text-blue-800">
              <span className="relative">
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-xs font-bold text-blue-900 px-3 py-1 rounded-full animate-pulse">
                  EXCLUSIVE GUIDE
                </span>
              </span>
              The Ultimate Canadian Snowbird Departure Checklist and Comparison Guide
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full text-lg transform -rotate-2 shadow-md">
                  {isPremium ? 'PREMIUM PAID CONTENT' : 'PREMIUM CONTENT - FREE ACCESS'}
                </div>
              </div>
              <p className="text-xl mb-3 text-center font-semibold text-blue-800">
                {isPremium 
                  ? 'Thank you for your purchase! Your premium travel guide is ready.' 
                  : 'Your comprehensive travel guide is ready to download!'}
              </p>
              <p className="text-gray-700 mb-4 text-center">
                This <span className="font-semibold">beautifully designed</span> and <span className="text-blue-600 font-bold">meticulously researched</span> guide 
                will transform how you plan your winter escape with insider tips and essential checklists.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-bold text-blue-800 text-center mb-2">The Ultimate Canadian Snowbird Toolkit</h4>
                <p className="text-sm text-gray-700 mb-2">
                  This comprehensive 24-page guide includes everything Canadian snowbirds need to plan their winter escape to warm-weather alternative destinations including:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 pl-5 list-disc">
                  <li>Complete destination comparison charts for Colombia, Panama, Portugal, Thailand, and other Florida alternatives</li>
                  <li>Healthcare cost and quality comparison across all featured destinations</li>
                  <li>Month-by-month planning timeline to ensure a smooth departure</li>
                  <li>Expert tips on maintaining your Canadian residency status while abroad</li>
                  <li>Travel insurance recommendations specific to long-term stays</li>
                  <li>Budget worksheets for accurate cost planning</li>
                </ul>
              </div>
              
              {/* For free version, show email form if not submitted */}
              {!isPremium && !isSubmitted && (
                <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                  <h3 className="font-semibold text-lg mb-3 text-center">Enter Your Email to Download</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">Get exclusive travel tips and updates on new destinations</p>
                  
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input 
                            id="email"
                            type="email" 
                            placeholder="your.email@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          <FaArrowRight className="mr-2" /> Submit
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      We respect your privacy and will never share your information.
                    </p>
                  </form>
                </div>
              )}
              
              {/* Show email submission success message if applicable */}
              {!isPremium && isSubmitted && (
                <div className="text-center mb-4">
                  <p className="text-green-600 font-medium mb-3">
                    <FaCheckCircle className="inline-block mr-2" />
                    Email successfully registered!
                  </p>
                </div>
              )}
              
              {/* Premium paid content notice */}
              {isPremium && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <h4 className="font-bold text-green-800 text-center mb-2">
                    <FaCheckCircle className="inline-block mr-2" />
                    Payment Successful
                  </h4>
                  <p className="text-sm text-gray-700 text-center">
                    Your premium snowbird guide purchase has been processed successfully. 
                    Thank you for supporting Deep Travel Collections.
                  </p>
                </div>
              )}
              
              {/* Download button - shown for free version, or for premium version after payment */}
              {(showDownloadButton || isPremium) && (
                <div className="text-center mt-4">
                  <div className="animate-pulse mb-3">
                    <span className="bg-yellow-400 text-xs font-bold text-blue-900 px-3 py-1 rounded-full">
                      READY FOR DOWNLOAD
                    </span>
                  </div>
                  <div className="relative inline-block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <a 
                      href={isPremium 
                        ? "/downloads/CANADIAN-SNOWBIRD-TOOLKIT.pdf" 
                        : "/downloads/THE-ULTIMATE-CANADIAN-SNOWBIRD-DEPARTURE-CHECKLIST.pdf"} 
                      download={isPremium 
                        ? "Canadian-Snowbird-Complete-Toolkit.pdf" 
                        : "Canadian-Snowbird-Departure-Checklist.pdf"}
                      className="relative inline-flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform"
                    >
                      <FaDownload className="mr-3 text-xl" /> 
                      <span>
                        DOWNLOAD YOUR <span className="underline decoration-yellow-300 decoration-2 underline-offset-2">PREMIUM</span> GUIDE
                      </span>
                    </a>
                  </div>
                  <p className="mt-3 text-sm text-emerald-700 font-medium">
                    Click the button above to save your guide
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
              <div className="mb-4 flex items-center justify-center">
                <div className="px-4 py-1 bg-blue-600 text-white font-bold rounded-full text-lg transform -rotate-1 shadow-md">
                  <FaFileAlt className="inline-block mr-2" /> PREMIUM CONTENT OVERVIEW
                </div>
              </div>
              
              <h3 className="font-bold text-2xl mb-4 text-center text-blue-800 border-b-2 border-blue-100 pb-2">
                What's Inside Your <span className="text-emerald-600">Premium</span> Guide:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                      <FaSuitcase />
                    </div>
                    <h4 className="font-semibold text-blue-800">Pre-Departure Checklist</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-11">
                    Complete, step-by-step preparation lists for Canadian snowbirds
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-600 p-2 rounded-full text-white mr-3">
                      <FaMapMarkedAlt />
                    </div>
                    <h4 className="font-semibold text-green-800">Destination Comparison</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-11">
                    Side-by-side analysis of top snowbird destinations with pros and cons
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-600 p-2 rounded-full text-white mr-3">
                      <FaHospital />
                    </div>
                    <h4 className="font-semibold text-red-800">Healthcare Access</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-11">
                    Detailed information about medical facilities and insurance requirements
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-600 p-2 rounded-full text-white mr-3">
                      <FaPassport />
                    </div>
                    <h4 className="font-semibold text-purple-800">Visa Requirements</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-11">
                    Duration of stay guidelines and necessary documentation
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="bg-yellow-600 p-2 rounded-full text-white mr-3">
                      <FaMoneyBillWave />
                    </div>
                    <h4 className="font-semibold text-yellow-800">Cost Calculator</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-11">
                    Interactive budget planning tool for your winter escape
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="bg-teal-600 p-2 rounded-full text-white mr-3">
                      <FaCalendarAlt />
                    </div>
                    <h4 className="font-semibold text-teal-800">Planning Timeline</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-11">
                    Month-by-month preparation schedule for a stress-free departure
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-blue-600 font-medium">
                  <FaCheckCircle className="inline-block mr-1" />
                  Beautifully designed 24-page digital guidebook with easy-to-follow sections
                </p>
              </div>
            </div>

            <Separator />

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg text-center space-y-4">
              <h3 className="text-white text-xl font-bold">Ready to Discover Your Perfect Winter Escape?</h3>
              <p className="text-blue-100 mb-4">Explore more exclusive snowbird alternatives and premium travel resources</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <Link href="/snowbird-alternatives" className="block">
                    <div className="flex flex-col items-center text-white">
                      <FaMapMarkedAlt className="text-3xl mb-2" />
                      <span className="font-medium">Snowbird Alternatives</span>
                      <span className="text-xs text-blue-100 mt-1">Discover hidden gems beyond Florida</span>
                    </div>
                  </Link>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <Link href="/" className="block">
                    <div className="flex flex-col items-center text-white">
                      <FaPlane className="text-3xl mb-2" />
                      <span className="font-medium">All Destinations</span>
                      <span className="text-xs text-blue-100 mt-1">Explore our entire collection</span>
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="mt-4">
                <Button asChild variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-800">
                  <Link href="/collections">
                    View All Travel Collections
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}