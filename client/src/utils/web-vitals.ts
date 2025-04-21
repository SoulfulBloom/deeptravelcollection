// Simplified web-vitals.ts
export type ReportHandler = (metric: {
  name: string;
  value: number;
  delta: number;
  id: string;
}) => void;

// Stub implementations
export function getCLS(onReport: ReportHandler): void {}
export function getFID(onReport: ReportHandler): void {}
export function getFCP(onReport: ReportHandler): void {}
export function getLCP(onReport: ReportHandler): void {}
export function getTTFB(onReport: ReportHandler): void {}

export function reportWebVitals(onPerfEntry?: ReportHandler): void {
  console.log('Web vitals reporting disabled in simplified version');
}

export default reportWebVitals;
