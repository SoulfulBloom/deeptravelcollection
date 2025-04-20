import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  Calculator, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Download,
  Plane,
  CheckCircle,
  ShoppingCart,
  Package,
  ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFonts } from "@/components/ui/fonts";
import { Link } from 'wouter';

// Content for Snowbird Toolkit
const toolkitContent = {
  title: "The Ultimate Snowbird Toolkit",
  price: "$9.99 one-time purchase",
  description: "An indispensable resource for Canadians planning extended stays abroad, focusing on key legal, financial, and healthcare considerations.",
  features: [
    {
      title: "Provincial Health Insurance Rules",
      description: "Province-by-province breakdown of health insurance residency requirements and coverage options while abroad.",
      icon: "heart"
    },
    {
      title: "Destination Comparisons",
      description: "Detailed comparison of popular snowbird destinations including Mexico, Costa Rica, Panama, and Colombia with key facts on each location.",
      icon: "plane"
    },
    {
      title: "Tax Residency Guidance",
      description: "Clear explanation of Canadian tax residency rules, reporting requirements, and strategies to maintain proper compliance while abroad.",
      icon: "calculator"
    },
    {
      title: "Healthcare Abroad Solutions",
      description: "Comprehensive guide to finding quality healthcare, managing medications, and securing appropriate insurance coverage in your destination.",
      icon: "shield"
    }
  ],
  detailedContents: [
    "120+ page comprehensive digital guide",
    "Printable checklists for pre-departure planning",
    "Provincial health coverage comparison charts",
    "Tax residency assessment worksheet",
    "Country-specific healthcare provider directories",
    "Home security planning templates",
    "Banking & finance strategy guides",
    "Communication solutions comparison",
    "Essential apps and resources for Canadians abroad",
    "Emergency contact information by country"
  ],
  premium: [
    "Exclusive access to quarterly guidebook updates",
    "Snowbird-specific travel insurance comparison tool",
    "Tax worksheet templates for Canadian expats"
  ]
};

const SnowbirdToolkit: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { heading } = useFonts();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="h-6 w-6 mb-2 text-primary" />;
      case 'plane':
        return <Plane className="h-6 w-6 mb-2 text-primary" />;
      case 'calculator':
        return <Calculator className="h-6 w-6 mb-2 text-primary" />;
      case 'shield':
        return <Shield className="h-6 w-6 mb-2 text-primary" />;
      default:
        return <FileText className="h-6 w-6 mb-2 text-primary" />;
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4 md:px-0">
      <h2 className={`${heading} text-3xl md:text-4xl font-bold mb-8 text-center`}>
        {toolkitContent.title}
      </h2>
      
      {/* Hero image section above the card */}
      <div className="w-full rounded-lg mb-8 overflow-hidden shadow-xl relative">
        <img 
          src="/images/destinations/beach-5264739_1280.jpg" 
          alt="Canadian snowbird enjoying sunset on the beach" 
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
          <h3 className={`${heading} text-3xl md:text-4xl font-bold mb-3`}>Your Winter Paradise Awaits</h3>
          <p className="text-lg md:text-xl max-w-2xl">
            Escape the cold and create unforgettable memories with our comprehensive Canadian Snowbird guide
          </p>
        </div>
      </div>
      
      <Card className="w-full border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-2xl font-bold">{toolkitContent.title}</CardTitle>
              <p className="text-gray-600 mt-2">{toolkitContent.description}</p>
            </div>
            <Badge className="mt-2 md:mt-0 bg-primary text-white font-semibold py-1 px-3 text-base">
              {toolkitContent.price}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolkitContent.features.map((feature, index) => (
              <div key={index} className="flex flex-col items-start">
                {getIcon(feature.icon)}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-xl font-semibold">What's Included</h3>
              <Button variant="ghost" size="icon" className="ml-2">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {isExpanded && (
              <div className="mt-4 pl-4 border-l-2 border-primary">
                <h4 className="font-semibold mb-2">Guide Contents:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {toolkitContent.detailedContents.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col border-t border-gray-200 pt-6 bg-gray-50">
          {/* Testimonial section with smaller image */}
          <div className="w-full mb-6 bg-blue-50 rounded-lg p-6 shadow-inner">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img 
                  src="/images/destinations/beach-652119_1280.jpg" 
                  alt="Happy Canadian snowbird" 
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="flex-1">
                <div className="text-lg italic text-gray-700 mb-4">
                  "This toolkit was exactly what I needed before starting my winter in Portugal. 
                  The healthcare section alone saved me thousands in potential insurance mistakes. 
                  I read it cover to cover and refer to it weekly. Worth every penny!"
                </div>
                <div className="font-semibold text-right">
                  — Margaret T., Ottawa
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center w-full">
            <div className="flex flex-wrap gap-4 mb-4 sm:mb-0">
              <div className="flex flex-col gap-2">
                <Link to="/checkout?type=snowbird_toolkit&product=snowbird-toolkit">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white font-medium"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Purchase Now
                  </Button>
                </Link>
                <div className="text-sm text-center text-blue-600 font-medium">Sample PDF Resources</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <a 
                    href="/resources/Canadian-Snowbird-Toolkit.pdf" 
                    download="Canadian-Snowbird-Toolkit.pdf"
                    className="text-blue-600 text-xs hover:underline flex items-center border border-blue-200 rounded px-2 py-1 bg-blue-50"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Snowbird Toolkit
                  </a>
                  <a 
                    href="/resources/THE-ULTIMATE-CANADIAN-SNOWBIRD-DEPARTURE-CHECKLIST.pdf" 
                    download="Canadian-Snowbird-Departure-Checklist.pdf"
                    className="text-blue-600 text-xs hover:underline flex items-center border border-blue-200 rounded px-2 py-1 bg-blue-50"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Departure Checklist
                  </a>
                  <a 
                    href="/resources/Snowbird-Travel-with-Pets-Guide.pdf" 
                    download="Snowbird-Travel-with-Pets-Guide.pdf"
                    className="text-blue-600 text-xs hover:underline flex items-center border border-blue-200 rounded px-2 py-1 bg-blue-50"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Pet Travel Guide
                  </a>
                  <a 
                    href="/resources/Digital-Nomad-Transition-Package.pdf" 
                    download="Digital-Nomad-Transition-Package.pdf"
                    className="text-blue-600 text-xs hover:underline flex items-center border border-blue-200 rounded px-2 py-1 bg-blue-50"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Digital Nomad Package
                  </a>
                  <a 
                    href="/resources/THE-ULTIMATE-IMMERSIVE-TRAVEL-STARTER-GUIDE.pdf" 
                    download="ULTIMATE-IMMERSIVE-TRAVEL-GUIDE.pdf"
                    className="text-blue-600 text-xs hover:underline flex items-center border border-blue-200 rounded px-2 py-1 bg-blue-50"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Travel Starter Guide
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span>Secure checkout • Instant PDF delivery</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Additional products callout */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
        <div className="text-center mb-6">
          <h3 className={`${heading} text-2xl font-bold mb-3`}>Explore More Snowbird Solutions</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our Ultimate Snowbird Toolkit is just one of several specialized resources we offer for Canadian travelers.
            Discover our Digital Nomad Package, Pet Travel Guide, and more!
          </p>
        </div>
        <div className="flex justify-center">
          <Link to="/snowbird">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              size="lg"
            >
              <Package className="h-5 w-5" />
              View All Snowbird Resources
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SnowbirdToolkit;