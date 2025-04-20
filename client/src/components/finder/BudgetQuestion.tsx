import React from 'react';
import { useQuiz } from './QuizContext';
import { DollarSign } from 'lucide-react';
import { BudgetOption } from './types';
import ProgressBar from './ProgressBar';

const BudgetQuestion: React.FC = () => {
  const { responses, updateResponse, goToNextStep, goToPreviousStep } = useQuiz();
  
  const budgetOptions: { value: BudgetOption; label: string }[] = [
    { value: 'under-1500', label: 'Under $1,500' },
    { value: '1500-2500', label: '$1,500 - $2,500' },
    { value: '2500-3500', label: '$2,500 - $3,500' },
    { value: 'over-3500', label: 'Over $3,500' }
  ];
  
  const handleSelect = (value: BudgetOption) => {
    updateResponse('budget', value);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <DollarSign className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          What's your monthly budget for accommodation and living expenses?
        </h2>
        <p className="text-gray-600">
          This helps us recommend destinations that match your financial comfort zone.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {budgetOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              responses.budget === option.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <span className={`text-lg font-bold block mb-1 ${
              responses.budget === option.value ? 'text-blue-700' : 'text-gray-800'
            }`}>
              {option.label}
            </span>
            
            <span className="text-sm text-gray-600">
              {option.value === 'under-1500' && 'Budget-conscious living with simpler accommodations'}
              {option.value === '1500-2500' && 'Comfortable living in most alternative destinations'}
              {option.value === '2500-3500' && 'Upscale living with premium amenities'}
              {option.value === 'over-3500' && 'Luxury living with high-end accommodations'}
            </span>
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
          disabled={!responses.budget}
          className={`px-5 py-2 rounded-md text-white ${
            responses.budget 
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

export default BudgetQuestion;