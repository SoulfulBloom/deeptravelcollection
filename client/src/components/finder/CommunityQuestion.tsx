import React from 'react';
import { useQuiz } from './QuizContext';
import { Users } from 'lucide-react';
import { CommunityRating } from './types';
import ProgressBar from './ProgressBar';

const CommunityQuestion: React.FC = () => {
  const { responses, updateResponse, goToNextStep, goToPreviousStep } = useQuiz();
  
  const handleRatingSelect = (rating: CommunityRating) => {
    updateResponse('community', rating);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Users className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          How important is being near established Canadian communities?
        </h2>
        <p className="text-gray-600">
          This helps us match you with destinations that have varying levels of Canadian presence.
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
                onClick={() => handleRatingSelect(rating as CommunityRating)}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                  responses.community === rating
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-gray-600 text-sm">
          {responses.community === 1 && (
            <p>You enjoy immersing yourself in local cultures and don't need a Canadian presence nearby.</p>
          )}
          {responses.community === 2 && (
            <p>You're independent but still appreciate occasional contact with fellow Canadians.</p>
          )}
          {responses.community === 3 && (
            <p>You value having a moderate Canadian presence with social opportunities.</p>
          )}
          {responses.community === 4 && (
            <p>You prefer destinations with established Canadian groups and regular gatherings.</p>
          )}
          {responses.community === 5 && (
            <p>You prioritize being part of a strong, active Canadian community with familiar amenities.</p>
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
          disabled={!responses.community}
          className={`px-5 py-2 rounded-md text-white ${
            responses.community 
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

export default CommunityQuestion;