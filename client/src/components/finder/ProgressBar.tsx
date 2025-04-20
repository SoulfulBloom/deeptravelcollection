import React from 'react';
import { useQuiz } from './QuizContext';

const ProgressBar: React.FC = () => {
  const { currentStep, totalSteps } = useQuiz();
  
  // Calculate progress percentage (skip intro and results screens)
  const calculateProgress = () => {
    if (currentStep === 0) return 0;
    if (currentStep > totalSteps) return 100;
    
    return ((currentStep - 1) / totalSteps) * 100;
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          {currentStep > 0 && currentStep <= totalSteps ? `Question ${currentStep} of ${totalSteps}` : ''}
        </span>
        <span>{Math.round(calculateProgress())}% Complete</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;