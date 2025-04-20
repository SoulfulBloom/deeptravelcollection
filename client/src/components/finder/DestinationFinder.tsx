import React from 'react';
import { QuizProvider, useQuiz } from './QuizContext';
import IntroScreen from './IntroScreen';
import BudgetQuestion from './BudgetQuestion';
import HealthcareQuestion from './HealthcareQuestion';
import ClimateQuestion from './ClimateQuestion';
import CommunityQuestion from './CommunityQuestion';
import CultureQuestion from './CultureQuestion';
import DurationQuestion from './DurationQuestion';
import ResultsScreen from './ResultsScreen';

const QuizContent: React.FC = () => {
  const { currentStep } = useQuiz();
  
  // Render the appropriate screen based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <IntroScreen />;
      case 1:
        return <BudgetQuestion />;
      case 2:
        return <HealthcareQuestion />;
      case 3:
        return <ClimateQuestion />;
      case 4:
        return <CommunityQuestion />;
      case 5:
        return <CultureQuestion />;
      case 6:
        return <DurationQuestion />;
      case 7:
        return <ResultsScreen />;
      default:
        return <IntroScreen />;
    }
  };
  
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 rounded-xl shadow-sm">
      {renderStep()}
    </div>
  );
};

const DestinationFinder: React.FC = () => {
  return (
    <QuizProvider>
      <div className="py-12 max-w-4xl mx-auto">
        <QuizContent />
      </div>
    </QuizProvider>
  );
};

export default DestinationFinder;