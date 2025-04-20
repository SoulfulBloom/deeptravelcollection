import { useFonts } from "./ui/fonts";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FaDownload, FaCheckCircle, FaFileAlt, FaTags } from "react-icons/fa";

export default function Newsletter() {
  const { heading } = useFonts();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the email to a server
    console.log('Email submitted:', email);
    
    // Save email to localStorage to demonstrate it was captured
    try {
      const savedEmails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
      savedEmails.push({ email, date: new Date().toISOString() });
      localStorage.setItem('newsletterEmails', JSON.stringify(savedEmails));
    } catch (error) {
      console.error('Failed to save email to localStorage:', error);
    }
    
    toast({
      title: "Thank You!",
      description: "Your email has been registered. Your free guide is ready to download!",
      duration: 5000,
    });
    
    // Attempt to download using different methods
    try {
      // Method 1: Use direct file path from public folder (most reliable)
      const link = document.createElement('a');
      link.href = '/downloads/THE-ULTIMATE-IMMERSIVE-TRAVEL-STARTER-GUIDE.pdf';
      link.download = 'Ultimate-Immersive-Travel-Guide.pdf';
      link.target = '_blank'; // Adding target blank helps in some browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('PDF download initiated');
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Ready",
        description: "If download doesn't start automatically, please use the download button below.",
        duration: 5000,
      });
    }
    
    setIsSubmitted(true);
    setShowDownloadButton(true);
    setEmail("");
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute -top-5 right-5 md:right-10 bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm tracking-wider transform rotate-3 shadow-md">
          $16.99 VALUE - FREE
        </div>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="flex">
              <div className="px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-4 inline-flex items-center">
                <FaFileAlt className="mr-2" /> EXCLUSIVE OFFER
              </div>
            </div>
            
            <h2 className={`text-3xl md:text-4xl font-bold text-white ${heading}`}>
              Get Your Free Ultimate Immersive Travel Guide
            </h2>
            
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                <FaCheckCircle className="inline-block mr-2 text-green-300" />
                What You'll Get:
              </h3>
              
              <ul className="space-y-3 text-blue-50">
                <li className="flex">
                  <span className="bg-white/20 p-1 rounded-full mr-3 flex-shrink-0">
                    <FaCheckCircle className="text-green-300 h-4 w-4" />
                  </span>
                  <span>Step-by-step authentic travel experience planning templates</span>
                </li>
                <li className="flex">
                  <span className="bg-white/20 p-1 rounded-full mr-3 flex-shrink-0">
                    <FaCheckCircle className="text-green-300 h-4 w-4" />
                  </span>
                  <span>Local interaction strategy and cultural immersion tips</span>
                </li>
                <li className="flex">
                  <span className="bg-white/20 p-1 rounded-full mr-3 flex-shrink-0">
                    <FaCheckCircle className="text-green-300 h-4 w-4" />
                  </span>
                  <span>Exclusive authentic travel checklists & planning resources</span>
                </li>
                <li className="flex">
                  <span className="bg-white/20 p-1 rounded-full mr-3 flex-shrink-0">
                    <FaCheckCircle className="text-green-300 h-4 w-4" />
                  </span>
                  <span>24-page beautifully designed digital guidebook</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 lg:mt-0 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <div className="mb-4 text-center">
              <h3 className="text-white text-xl font-bold mb-2">Transform Your Travel Experience</h3>
              <p className="text-blue-100">
                Enter your email to receive our premium travel guide and exclusive weekly travel tips
              </p>
            </div>
            
            {!isSubmitted ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-blue-100 mb-1">
                    Your Email Address
                  </label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 border-white/20 bg-white/5 text-white placeholder-blue-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white focus:border-white rounded-md"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center px-5 py-6 border border-transparent text-base font-medium rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaDownload className="mr-2" /> Get Your Free Guide Now
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-blue-200 mt-2">
                    Join thousands of immersive travelers who have transformed their journeys with our guides
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-3" />
                <p className="text-white font-medium mb-3">
                  Thank you! Your guide is ready to download
                </p>
                
                {showDownloadButton && (
                  <div className="mt-4">
                    <div className="animate-pulse mb-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        CLICK BELOW TO DOWNLOAD
                      </span>
                    </div>
                    <div className="relative inline-block">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                      <a 
                        href="/downloads/THE-ULTIMATE-IMMERSIVE-TRAVEL-STARTER-GUIDE.pdf" 
                        download="THE-ULTIMATE-IMMERSIVE-TRAVEL-STARTER-GUIDE.pdf"
                        target="_blank"
                        className="relative inline-flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 py-3 rounded-md font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform"
                      >
                        <FaDownload className="mr-2 text-xl" /> 
                        <span>Download Your Guide</span>
                      </a>
                    </div>
                    <p className="mt-3 text-sm text-blue-200">
                      We've also sent this link to your email
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-center space-x-2 text-blue-200 text-sm">
                <FaTags className="text-amber-400" />
                <span>Get exclusive access to new travel guides before anyone else</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
