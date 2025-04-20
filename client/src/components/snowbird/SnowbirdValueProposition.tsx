import React from 'react';
import { DollarSign, Heart, Users, Compass, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

const ValuePropositionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  iconColor 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  iconColor: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg border-t-4 border-transparent hover:border-blue-500">
      <div className={`mb-4 inline-flex p-3 rounded-full ${iconColor}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default function SnowbirdValueProposition() {
  const valueProps = [
    {
      icon: DollarSign,
      title: "30-40% Lower Costs",
      description: "Compared to traditional Florida destinations, with detailed cost breakdowns",
      iconColor: "bg-green-500"
    },
    {
      icon: Heart,
      title: "Canadian-Compatible Healthcare",
      description: "Options that work with your provincial coverage and insurance",
      iconColor: "bg-red-500"
    },
    {
      icon: Users,
      title: "Established Canadian Communities",
      description: "Connect with fellow Canadians already enjoying these destinations",
      iconColor: "bg-blue-500"
    },
    {
      icon: Compass,
      title: "Authentic Cultural Experiences",
      description: "Go beyond tourist areas with our immersive local guides",
      iconColor: "bg-purple-500"
    }
  ];
  
  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-3">
            FOR CANADIAN SNOWBIRDS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Canadian Snowbirds Choose Us</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We understand the unique needs of Canadians seeking warm winter escapes and provide solutions tailored specifically for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => (
            <ValuePropositionCard
              key={index}
              icon={prop.icon}
              title={prop.title}
              description={prop.description}
              iconColor={prop.iconColor}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/snowbird-guide" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Learn more about our Canadian Snowbird services
            <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}