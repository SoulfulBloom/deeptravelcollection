import React, { useRef } from 'react';
import { Printer } from 'lucide-react';
import { getProvinceByCode } from './provinceData';

interface PrintableSummaryProps {
  provinceCode: string | null;
}

const PrintableSummary: React.FC<PrintableSummaryProps> = ({ provinceCode }) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Simple print function using browser's print functionality
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const documentTitle = provinceCode 
      ? `${getProvinceByCode(provinceCode)?.name} Health Coverage Summary` 
      : 'Health Coverage Summary';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            h1 { font-size: 24px; }
            h2 { font-size: 18px; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            ul { padding-left: 20px; }
            .disclaimer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  if (!provinceCode) {
    return null;
  }
  
  const province = getProvinceByCode(provinceCode);
  
  if (!province) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Summary
        </button>
      </div>
      
      <div className="hidden">
        <div ref={printRef} className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Provincial Health Insurance Coverage Summary</h1>
            <p className="text-lg text-gray-600">{province.name} - {province.plan}</p>
            <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          
          <hr className="my-6" />
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-bold mb-2">Coverage Details</h2>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Maximum Days Abroad:</td>
                    <td className="py-2">{province.maxDaysAbroad} days</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Coverage Percentage:</td>
                    <td className="py-2">Approximately {province.coveragePercentage}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Maximum Coverage Amount:</td>
                    <td className="py-2">{province.maxAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h2 className="text-lg font-bold mb-2">Application Procedure</h2>
              <ul className="list-disc pl-5 space-y-1">
                {province.applicationProcedure.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Required Documentation</h2>
            <ul className="list-disc pl-5 space-y-1">
              {province.documentation.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Recent Policy Changes</h2>
            <ul className="list-disc pl-5 space-y-1">
              {province.recentChanges.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Supplemental Insurance Recommendations</h2>
            <ul className="list-disc pl-5 space-y-1">
              {province.supplementalRecommendations.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-10 border-t pt-6">
            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> This summary is provided for informational purposes only and was generated on {new Date().toLocaleDateString()}. 
              Provincial health coverage policies change frequently. Always verify current information with your provincial health authority 
              at {province.officialWebsite}.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Generated by Deep Travel Collections - Canadian Snowbird Resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableSummary;