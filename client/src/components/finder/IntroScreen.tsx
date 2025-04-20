import React from 'react';
import { useQuiz } from './QuizContext';
import { MapPin, Compass } from 'lucide-react';

const IntroScreen: React.FC = () => {
  const { goToNextStep } = useQuiz();
  
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Compass className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
          Find Your Perfect Snowbird Destination
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Answer a few questions to discover which alternative destination best matches your preferences.
          Our quiz will analyze your needs and suggest the most suitable options beyond traditional Florida getaways.
        </p>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Why Try Alternative Destinations?
        </h3>
        <ul className="text-left space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-2">•</span>
            <span>30-40% lower living costs compared to Florida</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-2">•</span>
            <span>Welcoming Canadian communities in various locations</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-2">•</span>
            <span>Healthcare options compatible with Canadian coverage</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-2">•</span>
            <span>Rich cultural experiences beyond typical tourist areas</span>
          </li>
        </ul>
      </div>
      
      <button
        onClick={goToNextStep}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
      >
        Start the Quiz
      </button>
    </div>
  );
};

export default IntroScreen;