import React, { useState } from 'react';
import { provinces } from './provinceData';
import { Check, ChevronDown } from 'lucide-react';

interface ProvinceSelectorProps {
  selectedProvince: string | null;
  onSelectProvince: (provinceCode: string) => void;
}

const ProvinceSelector: React.FC<ProvinceSelectorProps> = ({ 
  selectedProvince, 
  onSelectProvince 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProvinceSelect = (provinceCode: string) => {
    onSelectProvince(provinceCode);
    setIsDropdownOpen(false);
  };

  const getSelectedProvinceName = () => {
    if (!selectedProvince) return "Select your province";
    const province = provinces.find(p => p.code === selectedProvince);
    return province ? province.name : "Select your province";
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Provincial Health Coverage</h2>
      
      <div className="relative">
        <button
          type="button"
          className="flex items-center justify-between w-full md:w-64 p-3 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleDropdown}
        >
          <span className="block truncate">{getSelectedProvinceName()}</span>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full md:w-64 bg-white shadow-lg rounded-lg max-h-80 overflow-auto">
            <ul className="py-1">
              {provinces.map((province) => (
                <li key={province.code}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedProvince === province.code ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleProvinceSelect(province.code)}
                  >
                    <div className="flex items-center">
                      {selectedProvince === province.code && (
                        <Check className="h-4 w-4 text-blue-500 mr-2" />
                      )}
                      <span className={selectedProvince === province.code ? "ml-2" : "ml-6"}>
                        {province.name}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {provinces.map((province) => (
          <button
            key={province.code}
            className={`p-2 text-sm border rounded-md transition-colors ${
              selectedProvince === province.code
                ? "bg-blue-100 border-blue-500 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleProvinceSelect(province.code)}
          >
            <span className="font-medium">{province.code}</span> - {province.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProvinceSelector;