// Extended types for activities with more detailed structure
export interface ActivityDetail {
  time?: string;
  description: string;
  notes?: string;
}

// Type guard for checking activity type
export function isDetailedActivity(activity: string | ActivityDetail): activity is ActivityDetail {
  return typeof activity === 'object';
}