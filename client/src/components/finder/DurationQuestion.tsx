import React from 'react';
import { useQuiz } from './QuizContext';
import { Calendar } from 'lucide-react';
import { StayDuration } from './types';
import ProgressBar from './ProgressBar';

const DurationQuestion: React.FC = () => {
  const { responses, updateResponse, goToNextStep, goToPreviousStep } = useQuiz();
  
  const durationOptions: { value: StayDuration; label: string; description: string }[] = [
    { 
      value: '1-2', 
      label: '1-2 months', 
      description: 'A shorter winter escape during the coldest Canadian months'
    },
    { 
      value: '3-4', 
      label: '3-4 months', 
      description: 'A moderate stay covering most of the winter season'
    },
    { 
      value: '5-6', 
      label: '5-6 months', 
      description: 'An extended stay for the entire winter season'
    },
    { 
      value: '6-plus', 
      label: '6+ months', 
      description: 'A long-term arrangement, potentially year-round'
    }
  ];
  
  const handleSelect = (value: StayDuration) => {
    updateResponse('duration', value);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
          <Calendar className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          How long do you plan to stay each year?
        </h2>
        <p className="text-gray-600">
          This helps us recommend destinations with appropriate visa options and seasonal considerations.
        </p>
      </div>
      
      <div className="space-y-3 mb-8">
        {durationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              responses.duration === option.value
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span className={`text-lg font-bold block mb-1 ${
              responses.duration === option.value ? 'text-indigo-700' : 'text-gray-800'
            }`}>
              {option.label}
            </span>
            <span className="text-sm text-gray-600">{option.description}</span>
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
          disabled={!responses.duration}
          className={`px-5 py-2 rounded-md text-white ${
            responses.duration 
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

export default DurationQuestion;