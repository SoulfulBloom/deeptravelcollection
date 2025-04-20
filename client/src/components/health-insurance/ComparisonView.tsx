import React, { useState } from 'react';
import { provinces, ProvinceData, getAllProvinceCodes } from './provinceData';
import { X, Plus, ExternalLink } from 'lucide-react';

interface ComparisonViewProps {
  selectedProvinces: string[];
  onSelectProvince: (provinceCode: string) => void;
  onRemoveProvince: (provinceCode: string) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  selectedProvinces,
  onSelectProvince,
  onRemoveProvince
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Filter provinces that are not already selected
  const availableProvinces = provinces.filter(
    province => !selectedProvinces.includes(province.code)
  );

  const selectedProvincesData = selectedProvinces.map(code => 
    provinces.find(province => province.code === code)
  ).filter((province): province is ProvinceData => province !== undefined);

  if (selectedProvincesData.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">No provinces selected for comparison.</p>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add a province to compare
        </button>
        
        {showDropdown && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            <h4 className="font-medium text-gray-800 mb-2">Select a province:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableProvinces.map(province => (
                <button
                  key={province.code}
                  onClick={() => {
                    onSelectProvince(province.code);
                    setShowDropdown(false);
                  }}
                  className="text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  {province.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Provincial Health Coverage Comparison</h3>
        <p className="text-sm text-gray-600">Compare coverage details side by side</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Feature
              </th>
              {selectedProvincesData.map(province => (
                <th key={province.code} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <span>{province.name} ({province.code})</span>
                    <button 
                      onClick={() => onRemoveProvince(province.code)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </th>
              ))}
              {selectedProvincesData.length < 3 && (
                <th scope="col" className="px-6 py-3 w-40">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Province
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                      <div className="max-h-60 overflow-y-auto">
                        {availableProvinces.map(province => (
                          <button
                            key={province.code}
                            onClick={() => {
                              onSelectProvince(province.code);
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                          >
                            {province.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <ComparisonRow 
              label="Health Plan"
              values={selectedProvincesData.map(p => p.plan)}
            />
            <ComparisonRow 
              label="Max Days Abroad"
              values={selectedProvincesData.map(p => `${p.maxDaysAbroad} days`)}
            />
            <ComparisonRow 
              label="Coverage Percentage"
              values={selectedProvincesData.map(p => `${p.coveragePercentage}%`)}
            />
            <ComparisonRow 
              label="Max Amount"
              values={selectedProvincesData.map(p => p.maxAmount)}
            />
            <ComparisonRow 
              label="Required Docs"
              values={selectedProvincesData.map(p => (
                <ul className="list-disc pl-4 text-xs">
                  {p.documentation.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              ))}
            />
            <ComparisonRow 
              label="Recent Changes"
              values={selectedProvincesData.map(p => (
                <ul className="list-disc pl-4 text-xs">
                  {p.recentChanges.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              ))}
            />
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Official Website
              </td>
              {selectedProvincesData.map(province => (
                <td key={province.code} className="px-6 py-4 text-sm text-gray-500">
                  <a 
                    href={province.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Visit site <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </td>
              ))}
              {selectedProvincesData.length < 3 && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ComparisonRowProps {
  label: string;
  values: React.ReactNode[];
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, values }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {label}
      </td>
      {values.map((value, index) => (
        <td key={index} className="px-6 py-4 text-sm text-gray-500">
          {value}
        </td>
      ))}
      {values.length < 3 && <td></td>}
    </tr>
  );
};

export default ComparisonView;