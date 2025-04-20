import React from 'react';
import { Link } from 'wouter';
import { MapPin, Compass, Users, Sunrise, Globe, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 text-center relative z-10">
          <span className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-6">Our Mission</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            What We <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DO & Why</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Discover how we're transforming the way people experience the world through carefully crafted travel blueprints.
          </p>
          <div className="w-24 h-1 bg-purple-400 mx-auto mt-8 rounded-full"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* What Makes Our Itineraries Different */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transform transition-all hover:shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">What Makes Our Itineraries Different</h2>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg font-semibold">
                Not a tour. Not your average itinerary.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                These are handcrafted, deeply researched travel blueprints designed for real travelers who want 
                meaningful, off-the-beaten-path experiences—without overpaying for a group tour.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Each Deep Travel Collection itinerary gives you:
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex">
                  <span className="text-2xl mr-3">🌍</span>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Experiential travel with heart</span>—unique cultural activities, 
                    local gems, and authentic connections
                  </p>
                </div>
                
                <div className="flex">
                  <span className="text-2xl mr-3">✈️</span>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Full freedom</span> to book your own flights and accommodations
                  </p>
                </div>
                
                <div className="flex">
                  <span className="text-2xl mr-3">🧭</span>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Clear, guided structure</span> that's more detailed than what you'll find online—and 
                    yet far more affordable than working with a traditional travel agent or tour company
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                As a travel consultant with over 10 years of experience (and someone who's been to most of these destinations), 
                I've created each itinerary to give you the magic of a tour, without the markup.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                These aren't cookie-cutter. They're curated. They're designed for solo women, midlife adventurers, 
                couples looking for adventure, digital nomads, and curious Canadians who want more than just "places to see."
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg font-semibold">
                You don't need a tour bus to have a life-changing trip. You just need the right plan—and a little insider help.
              </p>
            </div>
          </div>
          
          {/* Our Journey Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transform transition-all hover:shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                  <Compass className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Our Journey</h2>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                For over a decade, I've been on a mission to transform how people experience the world. 
                What began as a personal passion for discovering authentic cultural experiences has evolved into 
                Deep Travel Collections – a curated platform of immersive travel itineraries designed to connect 
                travelers with the heart and soul of destinations around the globe.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                My journey into experiential travel began 10 years ago when I stepped off the typical tourist path 
                during a trip to Portugal's Algarve region. Instead of staying in a resort, I found myself in a small 
                coastal village, learning to prepare cataplana with a local family, participating in traditional 
                fishing practices, and becoming part of the community's daily rhythm. That experience fundamentally 
                changed my perspective on what travel could be – not just observing a destination, but truly becoming 
                a part of it.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Whether it's sipping coffee with local growers in Colombia's Zona Cafetera, learning traditional Mayan 
                weaving in Mérida, or diving into Lisbon's hidden fado bars, my itineraries go beyond tourism—they invite 
                you to live, feel, and connect with the soul of each place.
              </p>
              
              <div className="relative group mt-4 md:ml-12 mb-6">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative">
                  <img 
                    src="/images/founder/kenya-safari.jpg" 
                    alt="Founder on Safari in Kenya" 
                    className="rounded-lg shadow-xl w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                    <p className="text-white font-medium">Safari adventures in Kenya, Africa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Philosophy Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden mb-12 transform transition-all hover:shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">The Deep Travel Philosophy</h2>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                At Deep Travel Collections, we believe that meaningful travel goes beyond sightseeing. It's about 
                cultural immersion, authentic connections, and experiences that transform your understanding of both 
                the world and yourself. Our meticulously crafted itineraries are designed to:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mr-4">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Connect</h3>
                    <p className="text-gray-600">with local communities and traditions</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mr-4">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Reveal</h3>
                    <p className="text-gray-600">hidden gems that typical tourists never discover</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-4">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Provide</h3>
                    <p className="text-gray-600">cultural context that enriches every experience</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mr-4">
                    <Sunrise className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Create</h3>
                    <p className="text-gray-600">opportunities for genuine exchange and understanding</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed text-lg">
                We're committed to supporting local economies and sustainable tourism practices in everything we do.
              </p>
            </div>
          </div>
          
          {/* Canadian Snowbirds Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transform transition-all hover:shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 text-red-600 fill-current">
                    <path d="M383.8 351.7c2.5-2.5 105.2-92.4 105.2-92.4l-17.5-7.5c-10-4.2-7.5-15.5 5-22.5 12.5-7.5 27.5-2.5 35 5l22.5 17.5c10 7.5 7.5 27.5-5 40l-12.5 12.5c-27.5 25-35 5-40-2.5-5-7.5-35-35-42.5-42.5-7.5-1.2-15-2.5-25 7.5l-22.5 22.5c-.1 0 2.5 112.5 2.5 112.5l30-30c7.5-7.5 12.5-20 2.5-30l-20-20c-5-5-5-15 5-20 10-10 10-5 17.5 5l30 27.5c5 5 10 12.5 5 20l-8.9 9z" />
                    <path d="M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Canadian Snowbirds: Beyond the Beaten Path</h2>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                A significant part of our mission has been serving Canadian snowbirds seeking alternatives to traditional 
                US winter destinations. With growing economic and political uncertainties affecting Canada-US relations, 
                many Canadians are exploring international options that offer similar warmth and comfort with unique 
                cultural benefits.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Our specialized guides for destinations like Portugal's Algarve, Mexico's Pacific Coast, Costa Rica, 
                  Cuba, Dominican Republic, and Panama provide comprehensive resources for extended 2-6 month stays. 
                  These destinations not only offer <span className="font-semibold">30-40% cost savings compared to Florida</span> but provide rich opportunities 
                  for cultural immersion that simply aren't available in typical snowbird communities.
                </p>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Each guide includes Canadian-specific visa information, healthcare guidance, accommodation resources, 
                and detailed cost breakdowns – all informed by firsthand experience and continuous research.
              </p>
            </div>
          </div>
          
          {/* Commitment Section */}
          <div className="bg-gradient-to-b from-indigo-50 to-blue-50 rounded-2xl shadow-xl overflow-hidden mb-12 transform transition-all hover:shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Our Commitment to Authentic Experiences</h2>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Every itinerary in our collection has been personally vetted or created based on extensive research and 
                local partnerships. We don't just list attractions – we provide the context, connections, and insider 
                knowledge that transform a trip into a life-changing journey.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Whether you're planning a 5-day cultural exploration of Tokyo, a 10-day adventure through Bali's 
                spiritual landscapes, or a 3-month winter escape to Costa Rica's Pacific coast, our guides offer the 
                perfect balance of structure and discovery, allowing you to experience destinations with confidence 
                while remaining open to the serendipitous moments that make travel truly magical.
              </p>
              <p className="text-indigo-700 mb-8 leading-relaxed text-xl font-medium italic text-center py-4">
                Join us in discovering how deep travel can transform not just where you go, but how you see the world.
              </p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl text-white">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to experience travel more deeply?</h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
                Explore our curated collections and find your next transformative travel experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/collections">
                  <span className="px-8 py-3 bg-white text-indigo-700 rounded-full font-semibold hover:bg-opacity-95 transition-all transform hover:scale-105 inline-block cursor-pointer">
                    Explore Our Collections
                  </span>
                </Link>
                <Link href="/destinations">
                  <span className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold transition-all inline-block cursor-pointer">
                    Browse Destinations
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}