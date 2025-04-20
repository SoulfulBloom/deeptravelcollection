import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FaDownload, FaCheckCircle, FaFileAlt, FaGlobeAmericas, FaUser, FaCompass } from "react-icons/fa";

export default function ImmersiveTravelLeadMagnet() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
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
    console.log('Immersive guide email submitted:', email);
    
    // Save email to localStorage to demonstrate it was captured
    try {
      const savedEmails = JSON.parse(localStorage.getItem('immersiveEmails') || '[]');
      savedEmails.push({ email, date: new Date().toISOString() });
      localStorage.setItem('immersiveEmails', JSON.stringify(savedEmails));
    } catch (error) {
      console.error('Failed to save email to localStorage:', error);
    }
    
    toast({
      title: "Thank You!",
      description: "Your Ultimate Immersive Travel Guide is on its way!",
      duration: 5000,
    });
    
    // Trigger download
    try {
      const link = document.createElement('a');
      link.href = '/downloads/THE-ULTIMATE-IMMERSIVE-TRAVEL-STARTER-GUIDE.pdf';
      link.download = 'Ultimate-Immersive-Travel-Guide.pdf';
      link.target = '_blank'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Immersive PDF download initiated');
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Ready",
        description: "If download doesn't start automatically, please use the download button.",
      });
    }
    
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl shadow-2xl overflow-hidden border-2 border-blue-300 mb-12">
      <div className="absolute right-4 top-4">
        <FaCompass className="text-white text-4xl animate-pulse" />
      </div>
      
      <div className="px-6 py-8 md:p-8">
        <div className="md:flex items-start gap-8">
          {/* Left column with headline and benefits */}
          <div className="mb-8 md:mb-0 md:w-1/2">
            <div className="inline-flex items-center bg-white/20 text-white px-4 py-1 rounded-full font-semibold text-sm mb-4">
              <FaGlobeAmericas className="mr-2" /> AUTHENTIC TRAVEL
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              🗺️ Free Download: The Ultimate Immersive Travel Guide
            </h2>
            
            <p className="text-white/90 text-lg mb-6">
              Stop being a tourist and start having authentic local experiences with our expert-crafted guide.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">Inside Your Free Guide:</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-500/30 p-1.5 rounded-full mr-3 mt-0.5">
                    <FaUser className="text-white h-4 w-4" />
                  </div>
                  <span className="text-white/90">Connect with locals using proven conversation techniques</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-500/30 p-1.5 rounded-full mr-3 mt-0.5">
                    <FaCompass className="text-white h-4 w-4" />
                  </div>
                  <span className="text-white/90">Find hidden gems that aren't in typical guidebooks</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-500/30 p-1.5 rounded-full mr-3 mt-0.5">
                    <FaGlobeAmericas className="text-white h-4 w-4" />
                  </div>
                  <span className="text-white/90">Transform ordinary trips into life-changing experiences</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right column with form */}
          <div className="md:w-1/2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            {!isSubmitted ? (
              <>
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  Get Your Free Travel Guide Now
                </h3>
                <p className="text-white/80 text-center mb-4">
                  Enter your email below for immediate access to transform your travel experience
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-0 rounded-md text-gray-900 placeholder-gray-500"
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 rounded-md shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaDownload className="mr-2" /> Download Free Guide
                  </Button>
                  
                  <p className="text-center text-white/70 text-xs">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Thank You!
                </h3>
                <p className="text-white/90 mb-4">
                  Your Immersive Travel Guide is ready to download
                </p>
                
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <a 
                    href="/downloads/THE-ULTIMATE-IMMERSIVE-TRAVEL-STARTER-GUIDE.pdf" 
                    download="Ultimate-Immersive-Travel-Guide.pdf"
                    target="_blank"
                    className="relative inline-flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white px-6 py-3 rounded-md font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform"
                  >
                    <FaDownload className="mr-2" /> 
                    <span>Download Your Guide</span>
                  </a>
                </div>
                <p className="mt-4 text-sm text-white/80">
                  We've also sent this link to your email
                </p>
              </div>
            )}
            

          </div>
        </div>
      </div>
    </div>
  );
}