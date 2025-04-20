import React from 'react';
import { useQuiz } from './QuizContext';
import { Globe } from 'lucide-react';
import { CultureRating } from './types';
import ProgressBar from './ProgressBar';

const CultureQuestion: React.FC = () => {
  const { responses, updateResponse, goToNextStep, goToPreviousStep } = useQuiz();
  
  const handleRatingSelect = (rating: CultureRating) => {
    updateResponse('culture', rating);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
          <Globe className="h-6 w-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          How interested are you in cultural immersion and learning the local language?
        </h2>
        <p className="text-gray-600">
          This helps us gauge your interest in destinations with rich cultural experiences.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-between w-full max-w-md mb-2">
            <span className="text-sm text-gray-500">Not interested</span>
            <span className="text-sm text-gray-500">Very interested</span>
          </div>
          
          <div className="flex items-center justify-between w-full max-w-md">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingSelect(rating as CultureRating)}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                  responses.culture === rating
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-gray-600 text-sm">
          {responses.culture === 1 && (
            <p>You prefer familiar surroundings and don't need to engage with the local culture or language.</p>
          )}
          {responses.culture === 2 && (
            <p>You enjoy occasional cultural experiences but prefer places where English is widely spoken.</p>
          )}
          {responses.culture === 3 && (
            <p>You're open to cultural experiences and learning a few basic phrases in the local language.</p>
          )}
          {responses.culture === 4 && (
            <p>You value authentic cultural exchange and are willing to learn conversational language skills.</p>
          )}
          {responses.culture === 5 && (
            <p>You seek full cultural immersion and are excited to develop meaningful language proficiency.</p>
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
          disabled={!responses.culture}
          className={`px-5 py-2 rounded-md text-white ${
            responses.culture 
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

export default CultureQuestion;