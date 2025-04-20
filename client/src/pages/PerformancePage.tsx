import React from 'react';
import PerformanceDashboard from '../components/performance/PerformanceDashboard';

const PerformancePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Performance Monitoring
      </h1>
      
      <div className="space-y-8">
        <PerformanceDashboard />
        
        {/* Additional dashboards will be added here as they are implemented */}
      </div>
    </div>
  );
};

export default PerformancePage;