// Types for the destination finder quiz

export type BudgetOption = 'under-1500' | '1500-2500' | '2500-3500' | 'over-3500';
export type HealthcareRating = 1 | 2 | 3 | 4 | 5;
export type ClimatePreference = 'hot-dry' | 'warm-humid' | 'mild-temperate' | 'varied';
export type CommunityRating = 1 | 2 | 3 | 4 | 5;
export type CultureRating = 1 | 2 | 3 | 4 | 5;
export type StayDuration = '1-2' | '3-4' | '5-6' | '6-plus';

export interface QuizResponses {
  budget: BudgetOption | null;
  healthcare: HealthcareRating | null;
  climate: ClimatePreference | null;
  community: CommunityRating | null;
  culture: CultureRating | null;
  duration: StayDuration | null;
}

export interface DestinationMatch {
  id: number;
  name: string;
  country: string;
  matchPercentage: number;
  imageUrl: string;
  features: string[];
}

export const defaultQuizResponses: QuizResponses = {
  budget: null,
  healthcare: null,
  climate: null,
  community: null,
  culture: null,
  duration: null
};