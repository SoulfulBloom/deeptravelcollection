import React from 'react';
import { FaDownload } from 'react-icons/fa';

interface PremiumDownloadButtonProps {
  onClick: () => void;
}

const PremiumDownloadButton: React.FC<PremiumDownloadButtonProps> = ({ onClick }) => {
  return (
    <div className="w-full mt-4">
      <div className="animate-pulse mb-2 text-center">
        <span className="bg-yellow-400 text-xs font-bold text-blue-900 px-3 py-1 rounded-full">
          EXCLUSIVE GUIDE AVAILABLE
        </span>
      </div>
      <div className="relative inline-block w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-lg blur opacity-75 transition duration-1000 animate-pulse"></div>
        <button 
          onClick={onClick} 
          className="relative w-full inline-flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 py-3 rounded-md font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform"
        >
          <FaDownload className="mr-3 text-xl" /> 
          <span>
            DOWNLOAD YOUR <span className="underline decoration-yellow-300 decoration-2 underline-offset-2">PREMIUM</span> GUIDE
          </span>
        </button>
      </div>
    </div>
  );
};

export default PremiumDownloadButton;
