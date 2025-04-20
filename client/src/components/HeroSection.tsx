import { useFonts } from "./ui/fonts";
import { Link } from "wouter";
import { Phone, Mail, MapPin, DollarSign, Sun, Leaf } from "lucide-react";

export default function HeroSection() {
  const { heading } = useFonts();
  
  return (
    <>
      {/* User Direction Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 flex items-center justify-center text-sm sm:text-base md:text-lg font-medium flex-wrap gap-2 mb-4 rounded-lg shadow-md text-center">
        <span>Canadian Snowbirds: Discover comfortable, affordable winter escapes beyond Florida that save you 30-40% annually</span>
      </div>
    
      {/* Contact Information Banner */}
      <div className="bg-blue-900 text-white py-2 px-4 flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm flex-wrap gap-2 mb-3 rounded-b-lg text-center sm:text-left">
        <span className="font-medium">Need personal travel consultation?</span>
        <div className="flex items-center sm:ml-2 sm:mr-4 my-1 sm:my-0">
          <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span>(289) 231-6599</span>
        </div>
        <div className="flex items-center my-1 sm:my-0">
          <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <a href="mailto:kymm@deeptravelcollections.com" className="hover:underline">kymm@deeptravelcollections.com</a>
        </div>
        <span className="sm:ml-2 text-xs bg-blue-800 px-2 py-0.5 rounded-full">Licensed Travel Agent</span>
      </div>
    
      <div className="hero-container relative overflow-hidden h-[450px] sm:h-[400px] w-full rounded-lg shadow-lg mb-8">
        <img 
          src="/images/destinations/beach-5264739_1280.jpg" 
          alt="Canadian couple enjoying a tropical beach sunset" 
          className="hero-image absolute w-full h-full object-cover object-center transition-transform duration-1000 ease-in-out hover:scale-105"
        />
        
        <div className="hero-overlay absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-black/80 flex flex-col justify-center px-4 sm:px-[10%]">
          <div className="max-w-4xl">
            <h1 className={`hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white text-shadow-lg ${heading}`}>
              Beyond Florida: Winter Escapes for Canadian Snowbirds
              <span className="block bg-gradient-to-r from-blue-300 to-red-300 text-transparent bg-clip-text mt-2">Discover warm, welcoming alternatives with 30-40% lower costs</span>
            </h1>
            
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 max-w-4xl mb-4 sm:mb-5 mt-3">
              <p className="text-white text-shadow-sm text-xs sm:text-sm md:text-base">
                Expert guides for Canadians seeking stress-free winter living in Mexico, Costa Rica, Panama, Colombia, and Portugal
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mt-3">
                <div className="flex items-center text-white/90 text-xs sm:text-sm">
                  <Sun className="h-4 w-4 mr-2 text-amber-400" />
                  <span>Year-round sunshine</span>
                </div>
                <div className="flex items-center text-white/90 text-xs sm:text-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                  <span>Lower cost of living</span>
                </div>
                <div className="flex items-center text-white/90 text-xs sm:text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-red-400" />
                  <span>Vibrant expat communities</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/destination-finder" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all text-sm sm:text-base flex items-center">
                <Leaf className="h-4 w-4 mr-2" />
                Find Your Perfect Destination
              </Link>
              <Link href="/why-reconsider-us" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 font-semibold px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all text-sm sm:text-base">
                Why Consider Alternatives?
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Snowbird Resources Callout */}
      <div className="max-w-2xl mx-auto -mt-8 mb-12 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-4 text-center border-t-4 border-blue-600">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Canadian Snowbird Resources</h3>
          <p className="text-gray-600 text-sm">Comprehensive tools and guides to help Canadian snowbirds find the perfect alternative winter destination.</p>
          <div className="flex justify-center gap-3 mt-3">
            <Link href="/destination-finder" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg text-sm font-medium">
              Find Your Destination
            </Link>
            <Link href="/snowbird-toolkit" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded-lg text-sm font-medium">
              Get Toolkit
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Destinations heading will come after this */}
    </>
  );
}
