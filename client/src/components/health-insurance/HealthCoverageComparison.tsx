import React, { useState } from 'react';
import IntroSection from './IntroSection';
import ProvinceSelector from './ProvinceSelector';
import ProvinceDetails from './ProvinceDetails';
import ComparisonView from './ComparisonView';
import PrintableSummary from './PrintableSummary';
import { ArrowLeftRight, AlertTriangle } from 'lucide-react';

const HealthCoverageComparison: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [comparisonProvinces, setComparisonProvinces] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  
  const handleProvinceSelect = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    
    // If we're in comparison mode, add the province to the comparison list
    if (showComparison && !comparisonProvinces.includes(provinceCode)) {
      if (comparisonProvinces.length < 3) {
        setComparisonProvinces([...comparisonProvinces, provinceCode]);
      }
    }
  };
  
  const handleRemoveProvince = (provinceCode: string) => {
    setComparisonProvinces(comparisonProvinces.filter(code => code !== provinceCode));
  };
  
  const toggleComparisonView = () => {
    setShowComparison(!showComparison);
    
    // If switching to comparison view and we have a selected province, add it to comparison
    if (!showComparison && selectedProvince && !comparisonProvinces.includes(selectedProvince)) {
      setComparisonProvinces([...comparisonProvinces, selectedProvince]);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <IntroSection />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <ProvinceSelector 
          selectedProvince={selectedProvince}
          onSelectProvince={handleProvinceSelect}
        />
        
        <button
          onClick={toggleComparisonView}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors self-start"
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          {showComparison ? "View Single Province" : "Compare Provinces"}
        </button>
      </div>
      
      <div className="mb-10">
        {showComparison ? (
          <ComparisonView 
            selectedProvinces={comparisonProvinces}
            onSelectProvince={(code) => {
              if (comparisonProvinces.length < 3) {
                setComparisonProvinces([...comparisonProvinces, code]);
              }
            }}
            onRemoveProvince={handleRemoveProvince}
          />
        ) : (
          <ProvinceDetails provinceCode={selectedProvince} />
        )}
      </div>
      
      {!showComparison && <PrintableSummary provinceCode={selectedProvince} />}
      
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Disclaimer</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  The information provided here is for general guidance only and may change without notice. 
                  Provincial health coverage policies are regularly updated. Always verify current information 
                  directly with your provincial health authority before making travel plans.
                </p>
                <p className="mt-2">
                  This tool does not constitute professional advice. Consult with a licensed insurance broker 
                  to determine the appropriate travel health insurance coverage for your specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCoverageComparison;