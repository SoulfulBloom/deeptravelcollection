import React, { createContext, useState, useContext, ReactNode } from 'react';
import { QuizResponses, defaultQuizResponses, DestinationMatch } from './types';

interface QuizContextType {
  currentStep: number;
  totalSteps: number;
  responses: QuizResponses;
  results: DestinationMatch[] | null;
  isComplete: boolean;
  
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateResponse: <K extends keyof QuizResponses>(key: K, value: QuizResponses[K]) => void;
  setResults: (results: DestinationMatch[]) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<QuizResponses>(defaultQuizResponses);
  const [results, setResults] = useState<DestinationMatch[] | null>(null);
  const totalSteps = 6; // Number of questions plus intro and results screens
  
  const goToStep = (step: number) => {
    if (step >= 0 && step <= totalSteps + 1) {
      setCurrentStep(step);
    }
  };
  
  const goToNextStep = () => {
    goToStep(currentStep + 1);
  };
  
  const goToPreviousStep = () => {
    goToStep(currentStep - 1);
  };
  
  const updateResponse = <K extends keyof QuizResponses>(key: K, value: QuizResponses[K]) => {
    setResponses((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  
  const resetQuiz = () => {
    setCurrentStep(0);
    setResponses(defaultQuizResponses);
    setResults(null);
  };
  
  const isComplete = currentStep === totalSteps + 1;
  
  return (
    <QuizContext.Provider
      value={{
        currentStep,
        totalSteps,
        responses,
        results,
        isComplete,
        goToStep,
        goToNextStep,
        goToPreviousStep,
        updateResponse,
        setResults,
        resetQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};