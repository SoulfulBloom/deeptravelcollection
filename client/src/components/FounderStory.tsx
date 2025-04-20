import React from 'react';
import { motion } from 'framer-motion';

export default function FounderStory() {
  return (
    <section className="w-full py-12 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" className="text-indigo-900" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-6"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-indigo-800">Why Trust My Itineraries?</h3>
            
            <p className="text-lg leading-relaxed text-gray-700">
              As a <span className="font-bold text-indigo-700">TICO-licensed travel consultant with 10 years in the industry</span>, I don't just plan trips—I craft deep, 
              meaningful, and unforgettable travel experiences.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              Every destination I recommend has been personally explored or meticulously researched to ensure it delivers the 
              <span className="italic font-medium"> cultural immersion, authentic connections, and transformative moments</span> that 
              define true experiential travel.
            </p>
            

            
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-lg font-medium text-indigo-900">
                This is not just a vacation—it's a journey designed for those who crave more than sightseeing. Let's explore deeper. 🌎✨
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">TICO Licensed</span>
              <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Cultural Immersion</span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Sustainable Travel</span>
              <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">Expert Consultant</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 relative"
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative">
                <img 
                  src="/images/founder/elephant-sanctuary.jpg" 
                  alt="Founder at Elephant Sanctuary in Chiang Mai" 
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                  <p className="text-white font-medium">Volunteering at an Elephant Sanctuary in Chiang Mai, Thailand</p>
                </div>
              </div>
            </div>
            

            
            {/* Certificate/Credential badge */}
            <div className="absolute -top-4 -right-4 md:top-4 md:right-0 bg-white rounded-full p-3 shadow-lg border-2 border-yellow-400 transform rotate-12 z-10">
              <div className="text-center">
                <span className="block text-xs font-bold text-gray-800">TICO</span>
                <span className="block text-xs font-bold text-gray-800">LICENSED</span>
                <div className="w-10 h-10 mx-auto mt-1 flex items-center justify-center bg-yellow-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}