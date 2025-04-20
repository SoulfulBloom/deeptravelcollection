import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

const IntroSection: React.FC = () => {
  return (
    <div className="mb-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Provincial Health Insurance Coverage Abroad
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Understanding your provincial health coverage limitations while traveling is crucial for Canadian snowbirds.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800">Why This Matters</h3>
            <p className="mt-2 text-blue-700">
              Provincial health plans provide limited coverage when you're outside Canada. Most cover less than 10% 
              of medical expenses abroad, with strict maximum amounts that are often insufficient for even minor 
              emergencies. Understanding these limitations is essential for planning appropriate travel insurance.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-amber-800">How To Use This Tool</h3>
            <div className="mt-2 text-amber-700 space-y-2">
              <p>1. Select your province from the dropdown menu or map</p>
              <p>2. Review detailed information about your provincial coverage</p>
              <p>3. Compare multiple provinces using the comparison view</p>
              <p>4. Generate a printable summary for your records</p>
              <p>5. Click the official website link to verify the most up-to-date information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;