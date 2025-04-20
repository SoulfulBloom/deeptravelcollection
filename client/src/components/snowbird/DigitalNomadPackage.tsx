import React, { useState } from 'react';
import { 
  Wifi, 
  Briefcase, 
  CreditCard, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Download,
  Coins,
  CheckCircle,
  ShoppingCart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFonts } from "@/components/ui/fonts";
import { Link } from 'wouter';

// Content for Digital Nomad Package
const packageContent = {
  title: "Snowbird to Digital Nomad Transition Package",
  price: "$49.99 one-time purchase",
  description: "Transform your snowbird experience into a digital nomad lifestyle with our comprehensive guide for Canadians.",
  features: [
    {
      title: "Remote Work Setup Guide",
      description: "Essential guidance for creating an effective remote work environment while traveling as a Canadian snowbird.",
      icon: "wifi"
    },
    {
      title: "Canadian Business Solutions",
      description: "Important considerations and resources for maintaining your Canadian business connections while spending time abroad.",
      icon: "briefcase"
    },
    {
      title: "Financial Management",
      description: "Tips and strategies for handling your finances effectively while living the snowbird lifestyle.",
      icon: "credit-card"
    },
    {
      title: "Time Management",
      description: "Practical advice for balancing work and leisure time during your extended stays abroad.",
      icon: "clock"
    }
  ],
  detailedContents: [
    "Comprehensive digital guide",
    "International living resources",
    "Transition planning documents", 
    "Remote work insights",
    "Financial planning resources",
    "Time management tools",
    "Communication strategies",
    "Banking solutions for travelers"
  ],
  testimonial: {
    text: "This guide helped me transition from a traditional snowbird to enjoying a more flexible lifestyle in Costa Rica. The practical advice made the whole process so much easier.",
    author: "David M., Vancouver"
  }
};

interface PackageFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
  callToAction: string;
  link: string;
}

const DigitalNomadPackage: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { heading } = useFonts();
  
  // Map icons from content
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'wifi': return <Wifi className="h-6 w-6 text-blue-500" />;
      case 'briefcase': return <Briefcase className="h-6 w-6 text-blue-500" />;
      case 'credit-card': return <CreditCard className="h-6 w-6 text-blue-500" />;
      case 'clock': return <Clock className="h-6 w-6 text-blue-500" />;
      default: return <CheckCircle className="h-6 w-6 text-blue-500" />;
    }
  };
  
  const features: PackageFeature[] = packageContent.features.map(feature => ({
    title: feature.title,
    description: feature.description,
    icon: getIconComponent(feature.icon)
  }));
  
  const pricingTiers: PricingTier[] = [
    {
      name: "Digital Nomad Package",
      price: 49.99,
      description: "The complete toolkit for Canadian snowbirds transitioning to digital nomad lifestyle",
      features: packageContent.detailedContents,
      recommended: true,
      callToAction: "Get Started",
      link: "/checkout?type=digital_nomad_package"
    }
  ];
  

  

  
  return (
    <Card className="shadow-lg border-t-4 border-t-red-600 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-100 to-white">
        <div className="flex items-center gap-2">
          <img 
            src="/canada-flag-icon.png" 
            alt="Canadian Flag" 
            className="h-6 w-6"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZjBmMGYwIiBkPSJNMCAwaDUxMnY1MTJIMHoiLz48cGF0aCBmaWxsPSIjZDgwMDI3IiBkPSJNMCAwaDEyOHY1MTJIMHptMzg0IDB2NTEyaDEyOFYweiIvPjxwYXRoIGZpbGw9IiNkODAwMjciIGQ9Ik0yMTQuMiAyMDUuNyAyMTAgMTk3bC0xMCAxLjctNC40IDkuNS00LjUtMi4zIDEuMi0xMS4yLTExLjktMi4yIDMuMi01IC00LjEtNS42IDE0LjQtMS40IDEtMS43TDE5OCAyMDFsNy4yLTExIDcuMyAxMCA0LjUtMTEuMiA1LjUtMy43TDIxMSAxOTdsMTAuNS0xLjdoMGwtNy4zIDEwLjR6Ii8+PC9zdmc+";
              e.currentTarget.style.border = "1px solid #e5e5e5";
            }}
          />
          <CardTitle className={`text-xl text-blue-900 ${heading}`}>
            Snowbird to Digital Nomad Transition Package
          </CardTitle>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Exclusively for Canadians
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-600 text-white">
              <Coins className="h-3 w-3 mr-1" />
              20% OFF
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
              <div className="flex-shrink-0 bg-blue-50 p-2 rounded-full">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-medium text-blue-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pricing - Single Package */}
        <div className="mt-6">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className="border border-blue-500 bg-blue-50 rounded-lg p-5 relative max-w-2xl mx-auto"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Digital Nomad Solution
              </div>
              <h3 className="text-xl font-bold text-blue-800 text-center">
                {tier.name}
              </h3>
              <div className="my-3 text-center">
                <span className="text-3xl font-bold text-blue-600">
                  ${tier.price}
                </span>
                <span className="text-gray-500 text-sm"> one-time purchase</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">{tier.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 mb-1 list-none">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </div>
              <div className="space-y-2">
                <Link href={tier.link}>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {tier.callToAction}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 relative">
          <div className="absolute -top-3 -left-2 text-blue-500 text-4xl">"</div>
          <p className="text-gray-700 italic pl-4">
            {packageContent.testimonial.text}
          </p>
          <p className="text-right text-sm font-medium mt-2 text-blue-800">
            — {packageContent.testimonial.author}
          </p>
        </div>
        
        {expanded && (
          <div className="mt-4 border-t pt-4 border-gray-100 animate-in fade-in duration-300">
            <h4 className="font-medium text-blue-900 mb-2">What You'll Receive:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              {packageContent.detailedContents.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 justify-between">
        <Button 
          variant="outline"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show More Details
            </>
          )}
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">

          <div className="flex flex-col gap-2">
            <Link href="/checkout?type=digital_nomad_package">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center gap-2 w-full">
                <ShoppingCart className="h-4 w-4" />
                Purchase Now
              </Button>
            </Link>
            <a 
              href="/resources/Digital-Nomad-Transition-Package.pdf" 
              download="Digital-Nomad-Transition-Package.pdf"
              className="text-blue-600 text-sm text-center hover:underline flex items-center justify-center"
            >
              <Download className="h-3 w-3 mr-1" />
              Download Sample PDF
            </a>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DigitalNomadPackage;