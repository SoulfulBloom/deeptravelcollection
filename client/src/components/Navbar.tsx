import { Link, useLocation } from "wouter";
import { useFonts } from "./ui/fonts";
import { useState, useEffect, useRef } from "react";
import { Heart, CreditCard, Crown, X } from "lucide-react";
import { Button } from "./ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import FlashSaleBanner from "./FlashSaleBanner";
import NavDropdown from "./NavDropdown";
import { mainNavItems, canadianSnowbirdsMenu, destinationsMenu, immersiveExperiencesMenu } from "@/data/navigationMenus";
// Use the new larger logo
import logoImage from "../assets/deep-travel-logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [location] = useLocation();
  const { heading } = useFonts();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Fetch favorites count
  const { data: favoritesData } = useQuery<{ count: number }>({
    queryKey: ['/api/favorites/count'],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 10000, // 10 seconds
  });
  
  const favoritesCount = favoritesData?.count || 0;
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      {showBanner && <FlashSaleBanner />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24 items-center">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/">
              <div className="flex flex-col items-center">
                <div className="relative bg-blue-50 rounded-lg p-1 sm:p-2 shadow-md hover:shadow-lg transition-all">
                  <img 
                    src={logoImage} 
                    alt="Deep Travel Collection Logo" 
                    className="h-16 sm:h-20 w-auto cursor-pointer"
                  />
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 mt-1">A subsidiary of Soulful Bloom INC</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:ml-10 md:flex md:space-x-8 lg:space-x-12">
            {/* Main Navigation Items */}
            {mainNavItems.map((item, index) => (
              item.dropdown ? (
                <NavDropdown
                  key={index}
                  label={item.label}
                  items={item.dropdown.map(dropdownItem => ({
                    label: dropdownItem.label,
                    href: dropdownItem.path
                  }))}
                  isActive={isActive(item.path)}
                  className={`${isActive(item.path) ? 'border-primary text-primary' : 
                    item.label === "Canadian Snowbirds" ? 'border-transparent bg-red-50 text-red-600 hover:border-red-300 hover:text-red-700 hover:bg-red-100' : 
                    'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'} 
                    rounded-md font-medium text-base`}
                  iconComponent={item.label === "Canadian Snowbirds" ? <span>🍁</span> : undefined}
                />
              ) : (
                <Link key={index} href={item.path}>
                  <span className={`${isActive(item.path) ? 'border-primary text-primary' : 
                    'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'} 
                    border-b-2 px-1 py-1 font-medium text-base cursor-pointer inline-block transition-all`}>
                    {item.label}
                  </span>
                </Link>
              )
            ))}
            
            {/* Snowbird Toolkit */}
            <Link href="/snowbird">
              <span className={`${isActive('/snowbird') ? 'border-primary text-primary' : 'border-transparent bg-red-50 text-red-600 hover:border-red-300 hover:text-red-700 hover:bg-red-100'} border-b-2 px-2 py-1 rounded-md font-medium text-sm cursor-pointer inline-block transition-all flex items-center`}>
                <img src="/images/canada-153554_1280.webp" alt="Canadian Flag" className="w-4 h-4 mr-1" />
                <span>Snowbird Toolkit</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4 lg:space-x-6">
            <Link href="/pricing">
              <span className={`${isActive('/pricing') ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'} flex items-center cursor-pointer text-base font-medium`}>
                <CreditCard className="h-5 w-5 mr-2" />
                <span>Pricing</span>
              </span>
            </Link>
            <Link href="/signin">
              <Button className="bg-primary hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm shadow-md hover:shadow-lg transition-all">
                Sign In
              </Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - overlay style */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
          <div 
            ref={mobileMenuRef}
            className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg">Menu</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 64px)'}}>
              {/* Main Navigation Items */}
              {mainNavItems.map((item, index) => (
                item.dropdown ? (
                  <NavDropdown
                    key={index}
                    label={item.label}
                    items={item.dropdown.map(dropdownItem => ({
                      label: dropdownItem.label,
                      href: dropdownItem.path
                    }))}
                    isActive={isActive(item.path)}
                    className={`${isActive(item.path) ? 'bg-primary text-white' : 
                      item.label === "Canadian Snowbirds" ? 'bg-red-50 text-red-600 hover:bg-red-100' : 
                      'text-neutral-700 hover:bg-neutral-100'} mb-1`}
                    iconComponent={item.label === "Canadian Snowbirds" ? <span className="text-base">🍁</span> : undefined}
                    onClick={() => setIsOpen(false)}
                  />
                ) : (
                  <Link key={index} href={item.path} onClick={() => setIsOpen(false)}>
                    <span className={`${isActive(item.path) ? 'bg-primary text-white' : 
                      'text-neutral-700 hover:bg-neutral-100'} 
                      block px-3 py-2 rounded-md font-medium cursor-pointer text-sm mb-1`}>
                      {item.label}
                    </span>
                  </Link>
                )
              ))}
              
              {/* Snowbird toolkit */}
              <Link href="/snowbird" onClick={() => setIsOpen(false)}>
                <span className={`${isActive('/snowbird') ? 'bg-primary text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'} block px-3 py-2 rounded-md font-medium cursor-pointer text-sm flex items-center mb-1`}>
                  <img src="/images/canada-153554_1280.webp" alt="Canadian Flag" className="w-4 h-4 mr-2" />
                  Snowbird Toolkit
                </span>
              </Link>
              
              {/* Pricing */}
              <Link href="/pricing" onClick={() => setIsOpen(false)}>
                <span className={`${isActive('/pricing') ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'} block px-3 py-2 rounded-md font-medium cursor-pointer flex items-center text-sm mb-1`}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pricing
                </span>
              </Link>
              <div className="mt-4 px-3">
                <Link href="/signin" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-blue-700 text-white">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="mt-2 px-3">
                <Link href="/subscribe" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">
                    <Crown className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
