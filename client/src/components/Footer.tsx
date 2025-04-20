import { Link } from "wouter";
import { useFonts } from "./ui/fonts";
import { Compass, Phone, Mail } from "lucide-react";

export default function Footer() {
  const { heading } = useFonts();
  
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <Compass className="text-[#F97316] h-6 w-6 mr-2" />
              <span className={`${heading} font-bold text-xl`}>Deep Travel Collections</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">A subsidiary of Soulful Bloom INC</p>
            <p className="mt-3 text-neutral-300">
              Download detailed travel itineraries for destinations worldwide. Plan your perfect trip with insider tips and expert recommendations.
            </p>
            <div className="mt-4 bg-neutral-700/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-white mb-2">Licensed Travel Agent Services</h4>
              <div className="flex items-center mb-2 text-sm">
                <Phone className="h-4 w-4 mr-2 text-blue-300" />
                <span className="text-neutral-200">(289) 231-6599</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-blue-300" />
                <a href="mailto:kymm@deeptravelcollections.com" className="text-neutral-200 hover:text-white">
                  kymm@deeptravelcollections.com
                </a>
              </div>
            </div>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 00-4.4 23.2c-.2-.4-.3-.8-.3-1.4v-4.9h-2.2c-1.2 0-2-.5-2.4-1.5-.5-1-.5-2.4.8-3.6.4-.4 1-.7 1.6-.7.8 0 1.4.3 1.8.8.4.6.6 1.3.8 2l.1.4c.1.2.3.3.5.3.5 0 .7-.1 1.4-.9.3-.4.5-1 .4-1.5-.1-.9-.8-1.9-2-1.9-.8 0-1.9.5-2.3 1.4-1-1.2-1.6-2.8-1.6-4.4 0-3.5 2.8-6.4 6.4-6.4 1.8 0 3.5.8 4.7 2.1 1.2 1.3 1.9 3 1.9 4.8 0 2.7-1.1 5.1-3 6.9-.6.6-1.4.9-2.2.9-.8 0-1.5-.4-1.9-1-.1.2-.3.4-.4.5-.6.6-1.4.9-2.3.9-.8 0-1.4-.2-2-.7-.6-.4-1-1.1-1.3-1.8-.2.3-.4.6-.6.9-.4.6-1 1-1.7 1.3-.7.2-1.4.2-2.1 0-.7-.3-1.3-.8-1.7-1.5-.6-1-.8-2.1-.5-3.1.3-1 1-1.9 2-2.3.9-.4 1.9-.5 2.8-.1.9.3 1.6 1 2 1.9.3-.8.8-1.4 1.4-1.9.7-.5 1.6-.8 2.5-.8 1.9 0 3.5 1.6 3.5 3.5 0 .3 0 .5-.1.8.5-1 .8-2.1.8-3.3 0-4.1-3.3-7.4-7.4-7.4-3.3 0-6.1 2.2-7 5.2-.2.7-.3 1.4-.3 2.2 0 4.1 3.3 7.4 7.4 7.4.7 0 1.4-.1 2.1-.3.5-.1.9.2 1 .7.1.5-.2.9-.7 1-1 .3-2 .4-3 .4A8.5 8.5 0 013.5 12C3.5 5.6 7.6 1.5 12 1.5c4.4 0 8 3.6 8 8 0 4.4-3.2 7.7-7.3 8.4-.5.1-.9-.3-1-.8-.1-.5.3-.9.8-1 3.2-.6 5.7-3.3 5.7-6.7 0-3.7-3-6.7-6.7-6.7C7.3 3.5 5 7.8 6.8 11.6c.1.3.5.4.8.3.3-.1.4-.5.3-.8-1-2.6-.1-5.5 2.4-6.5 2.5-1 5.5.1 6.5 2.6.5 1.2.5 2.6 0 3.8-.4.9-1.3 1.7-2.3 2-.5.1-.9-.2-1-.7-.1-.5.2-.9.7-1 .6-.2 1.1-.6 1.3-1.1.3-.7.3-1.5 0-2.2-.6-1.5-2.3-2.2-3.8-1.6-1.5.6-2.2 2.3-1.6 3.8.1.3.3.6.5.8.4.4.9.6 1.4.6.2 0 .4 0 .6-.1.5-.2 1.1-.2 1.6 0 .5.2 1 .6 1.3 1.1.5.8.5 1.8.1 2.6-.4.8-1.2 1.4-2.1 1.6-.9.2-1.8.1-2.6-.3-.8-.4-1.4-1.2-1.6-2.1-.2-.9-.1-1.8.3-2.6.2-.3.1-.7-.2-.9-.3-.2-.7-.1-.9.2-.5 1.1-.6 2.4-.3 3.6.3 1.2 1.1 2.2 2.1 2.8 1 .6 2.3.8 3.4.5 1.2-.3 2.2-1.1 2.8-2.1.6-1 .8-2.3.5-3.4z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Destinations</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-neutral-300 hover:text-white">Europe</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Asia</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">North America</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">South America</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Africa</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Oceania</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Popular Itineraries</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/destinations/1" className="text-neutral-300 hover:text-white">Tokyo, Japan</Link></li>
              <li><Link href="/destinations/2" className="text-neutral-300 hover:text-white">Barcelona, Spain</Link></li>
              <li><Link href="/destinations/5" className="text-neutral-300 hover:text-white">New York, USA</Link></li>
              <li><Link href="/destinations/3" className="text-neutral-300 hover:text-white">Bali, Indonesia</Link></li>
              <li><Link href="/destinations/6" className="text-neutral-300 hover:text-white">Rome, Italy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-neutral-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Contribute</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-neutral-700 pt-8">
          <p className="text-neutral-400 text-sm text-center">
            © {new Date().getFullYear()} Deep Travel Collections, a subsidiary of Soulful Bloom INC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
