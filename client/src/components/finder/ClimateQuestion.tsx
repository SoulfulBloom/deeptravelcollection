import React from 'react';
import { useQuiz } from './QuizContext';
import { Sun, CloudRain, Cloud, Compass } from 'lucide-react';
import { ClimatePreference } from './types';
import ProgressBar from './ProgressBar';

const ClimateQuestion: React.FC = () => {
  const { responses, updateResponse, goToNextStep, goToPreviousStep } = useQuiz();
  
  const climateOptions: { 
    value: ClimatePreference; 
    label: string; 
    icon: React.ElementType;
    description: string;
    color: string;
  }[] = [
    { 
      value: 'hot-dry', 
      label: 'Hot and dry', 
      icon: Sun,
      description: 'Desert-like conditions, minimal rainfall, hot days',
      color: 'bg-amber-100 text-amber-700'
    },
    { 
      value: 'warm-humid', 
      label: 'Warm and humid', 
      icon: CloudRain,
      description: 'Tropical climate with warm temperatures year-round',
      color: 'bg-emerald-100 text-emerald-700'
    },
    { 
      value: 'mild-temperate', 
      label: 'Mild and temperate', 
      icon: Cloud,
      description: 'Moderate temperatures, distinct but mild seasons',
      color: 'bg-blue-100 text-blue-700'
    },
    { 
      value: 'varied', 
      label: 'Varied by region', 
      icon: Compass,
      description: 'Mix of climates depending on the area',
      color: 'bg-purple-100 text-purple-700'
    }
  ];
  
  const handleSelect = (value: ClimatePreference) => {
    updateResponse('climate', value);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
          <Sun className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          What climate do you prefer?
        </h2>
        <p className="text-gray-600">
          This will help us recommend destinations with weather patterns you'll enjoy.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {climateOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`p-5 rounded-lg border-2 text-left transition-all ${
              responses.climate === option.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-full mr-3 ${option.color}`}>
                <option.icon className="h-5 w-5" />
              </div>
              <span className={`text-lg font-bold ${
                responses.climate === option.value ? 'text-blue-700' : 'text-gray-800'
              }`}>
                {option.label}
              </span>
            </div>
            <span className="text-sm text-gray-600 block">{option.description}</span>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={goToNextStep}
          disabled={!responses.climate}
          className={`px-5 py-2 rounded-md text-white ${
            responses.climate 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-300 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClimateQuestion;