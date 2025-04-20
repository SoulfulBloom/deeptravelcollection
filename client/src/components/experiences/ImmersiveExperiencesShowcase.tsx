import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

interface ExperienceCardProps {
  title: string;
  description: string;
  image: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ title, description, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={`${title} experience for travelers`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        
        <Link href={`/immersive-experiences/theme/${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mt-auto">
          Learn more
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default function ImmersiveExperiencesShowcase() {
  const experiences = [
    {
      title: "Cultural Immersion",
      description: "Connect with local traditions, festivals, and community events",
      image: "/images/experiences/cultural-immersion.jpg"
    },
    {
      title: "Local Living",
      description: "Experience daily life through homestays and community engagement",
      image: "/images/experiences/local-living.jpg"
    },
    {
      title: "Food & Culinary",
      description: "Discover authentic flavors beyond tourist restaurants",
      image: "/images/experiences/food-culinary.jpg"
    },
    {
      title: "Language & Connection",
      description: "Break down barriers through basic language and cultural understanding",
      image: "/images/experiences/language-connection.jpg"
    }
  ];
  
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mb-3">
            GO DEEPER
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Enhance Your Stay with Immersive Experiences</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Go beyond the expat bubble with authentic cultural connections
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={index}
              title={experience.title}
              description={experience.description}
              image={experience.image}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/immersive-experiences" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg">
            Explore Immersive Experiences
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}