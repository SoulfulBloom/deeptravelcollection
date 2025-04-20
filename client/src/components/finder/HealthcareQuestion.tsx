import React from 'react';
import { useQuiz } from './QuizContext';
import { Heart } from 'lucide-react';
import { HealthcareRating } from './types';
import ProgressBar from './ProgressBar';

const HealthcareQuestion: React.FC = () => {
  const { responses, updateResponse, goToNextStep, goToPreviousStep } = useQuiz();
  
  const handleRatingSelect = (rating: HealthcareRating) => {
    updateResponse('healthcare', rating);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <Heart className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          How important is healthcare quality and accessibility to you?
        </h2>
        <p className="text-gray-600">
          This helps us prioritize destinations with healthcare facilities that meet your needs.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-between w-full max-w-md mb-2">
            <span className="text-sm text-gray-500">Not important</span>
            <span className="text-sm text-gray-500">Very important</span>
          </div>
          
          <div className="flex items-center justify-between w-full max-w-md">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingSelect(rating as HealthcareRating)}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                  responses.healthcare === rating
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-gray-600 text-sm">
          {responses.healthcare === 1 && (
            <p>You're flexible with healthcare options and don't require immediate access to medical facilities.</p>
          )}
          {responses.healthcare === 2 && (
            <p>You prefer having basic healthcare nearby but aren't concerned about specialized care.</p>
          )}
          {responses.healthcare === 3 && (
            <p>You value having decent healthcare options within a reasonable distance.</p>
          )}
          {responses.healthcare === 4 && (
            <p>Healthcare access is quite important to you - you want good facilities nearby.</p>
          )}
          {responses.healthcare === 5 && (
            <p>Healthcare is a top priority - you need excellent medical facilities with Canadian-friendly options.</p>
          )}
        </div>
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
          disabled={!responses.healthcare}
          className={`px-5 py-2 rounded-md text-white ${
            responses.healthcare 
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

export default HealthcareQuestion;