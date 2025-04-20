import React from 'react';
import { getProvinceByCode, ProvinceData } from './provinceData';
import { ExternalLink, Clock, PercentCircle, DollarSign, FileText, ClipboardList, Bell, Shield } from 'lucide-react';

interface ProvinceDetailsProps {
  provinceCode: string | null;
}

const ProvinceDetails: React.FC<ProvinceDetailsProps> = ({ provinceCode }) => {
  const province = provinceCode ? getProvinceByCode(provinceCode) : null;

  if (!province) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Please select a province to view coverage details
        </h3>
        <p className="text-gray-600">
          Coverage details vary significantly between provinces. Select your province 
          to see specific information about maintaining health coverage while abroad.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h3 className="text-2xl font-bold text-white">{province.name}</h3>
        <p className="text-blue-100">{province.plan}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <InfoCard 
            icon={<Clock className="h-8 w-8 text-blue-500" />}
            title="Maximum Days Outside Province"
            content={`${province.maxDaysAbroad} days per year while maintaining coverage`}
          />
          
          <InfoCard 
            icon={<PercentCircle className="h-8 w-8 text-green-500" />}
            title="Coverage Percentage Abroad"
            content={`Approximately ${province.coveragePercentage}% of actual costs`}
            note="Most services covered at a fraction of actual costs"
          />
          
          <InfoCard 
            icon={<DollarSign className="h-8 w-8 text-amber-500" />}
            title="Maximum Coverage Amount"
            content={province.maxAmount}
            note="Typically insufficient for most medical emergencies abroad"
          />
          
          <InfoCard 
            icon={<Bell className="h-8 w-8 text-red-500" />}
            title="Recent Policy Changes"
            content={
              <ul className="list-disc pl-5 space-y-1">
                {province.recentChanges.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            }
          />
        </div>
        
        <div className="space-y-6">
          <DetailSection
            icon={<FileText className="h-6 w-6 text-indigo-500" />}
            title="Required Documentation"
            items={province.documentation}
          />
          
          <DetailSection
            icon={<ClipboardList className="h-6 w-6 text-purple-500" />}
            title="Application Procedure"
            items={province.applicationProcedure}
          />
          
          <DetailSection
            icon={<Shield className="h-6 w-6 text-teal-500" />}
            title="Supplemental Insurance Recommendations"
            items={province.supplementalRecommendations}
          />
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a 
            href={province.officialWebsite} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Visit official {province.name} health insurance website 
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  note?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, content, note }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div className="ml-4">
          <h4 className="text-lg font-medium text-gray-900">{title}</h4>
          <div className="mt-2 text-gray-700">{content}</div>
          {note && <p className="mt-2 text-sm text-gray-500">{note}</p>}
        </div>
      </div>
    </div>
  );
};

interface DetailSectionProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

const DetailSection: React.FC<DetailSectionProps> = ({ icon, title, items }) => {
  return (
    <div>
      <div className="flex items-center mb-3">
        {icon}
        <h4 className="ml-2 text-lg font-medium text-gray-900">{title}</h4>
      </div>
      <ul className="ml-8 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProvinceDetails;