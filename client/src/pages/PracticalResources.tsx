import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FileDown, Building, FileText, Wallet, Hospital, CreditCard } from 'lucide-react';

const DownloadButton: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <Button className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-md flex items-center">
    <FileDown className="mr-2 h-5 w-5" />
    {children}
  </Button>
);

const PracticalResources: React.FC = () => {
  useEffect(() => {
    document.title = "Canadian Snowbird Practical Resources | Deep Travel Collections";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="absolute inset-0 bg-pattern-snowflakes opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">PRACTICAL RESOURCES</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Essential Resources for Canadian Snowbirds
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Navigate the practical aspects of wintering abroad with our comprehensive collection of guides, tools, and information.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-12 text-gray-700">
              Successfully transitioning to a winter destination abroad requires careful planning and consideration of numerous practical matters. 
              Our resource center provides Canadian snowbirds with essential information across five critical areas: provincial health coverage, 
              healthcare abroad, financial management, housing options, and legal documentation. Each resource is specifically tailored to the 
              needs of Canadians spending extended periods in international destinations.
            </p>
            

            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <div className="sticky top-8">
                  <div id="provincial-health" className="flex items-center text-blue-700 mb-2">
                    <Hospital className="h-6 w-6 mr-2" />
                    <h2 className="text-3xl font-bold">Provincial Health Coverage</h2>
                  </div>
                  <p className="text-xl mt-2 font-medium text-blue-600">Understanding Your Coverage Abroad</p>
                  <div className="mt-6">
                    <DownloadButton>Download Provincial Coverage Guide</DownloadButton>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Provincial Coverage Comparison Chart</h3>
                  <p className="text-gray-700 mb-4">
                    Interactive chart showing critical information for each province including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Maximum days allowed outside province while maintaining coverage</li>
                    <li>Coverage percentage for emergency services abroad</li>
                    <li>Coverage percentage for non-emergency services abroad</li>
                    <li>Reinstatement procedures if coverage lapses</li>
                    <li>Special provisions for snowbirds</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Province-Specific Information</h3>
                  <p className="text-gray-700 mb-4">
                    Detailed breakdowns for each province including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-semibold">Ontario</h4>
                      <p className="text-sm text-gray-700">OHIP coverage limitations and Out of Country Program changes</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-semibold">British Columbia</h4>
                      <p className="text-sm text-gray-700">MSP requirements and recent policy updates</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-semibold">Alberta</h4>
                      <p className="text-sm text-gray-700">AHCIP coverage and absence reporting requirements</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-semibold">Quebec</h4>
                      <p className="text-sm text-gray-700">RAMQ coverage and reimbursement procedures</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4">And detailed information for all other provinces and territories</p>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Coverage Maintenance Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Step-by-step instructions for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Reporting travel plans to provincial health authorities</li>
                    <li>Documentation requirements for extended absences</li>
                    <li>Procedures for maintaining coverage while abroad</li>
                    <li>Emergency coverage limitations and exceptions</li>
                    <li>Supplemental insurance recommendations</li>
                  </ul>
                </Card>
              </div>
            </div>
            
            <Separator className="my-12" />
            

            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <div className="sticky top-8">
                  <div id="healthcare" className="flex items-center text-blue-700 mb-2">
                    <Hospital className="h-6 w-6 mr-2" />
                    <h2 className="text-3xl font-bold">Healthcare</h2>
                  </div>
                  <p className="text-xl mt-2 font-medium text-blue-600">Resources for Canadian Snowbirds</p>
                  <div className="mt-6">
                    <DownloadButton>Download Healthcare Abroad Guide</DownloadButton>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Destination Healthcare Guides</h3>
                  <p className="text-gray-700 mb-4">
                    For each major snowbird destination:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Overview of public and private healthcare systems</li>
                    <li>Quality ratings and international accreditations</li>
                    <li>Average costs for common procedures and consultations</li>
                    <li>Availability of English-speaking medical professionals</li>
                    <li>Canadian-preferred medical facilities with contact information</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Medical Insurance Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive information on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Types of travel medical insurance policies</li>
                    <li>Coverage considerations for pre-existing conditions</li>
                    <li>Age-related premium factors and limitations</li>
                    <li>Claim procedures and documentation requirements</li>
                    <li>Insurance company comparison tool</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Prescription Medication Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Practical advice on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Legally transporting prescription medications internationally</li>
                    <li>Obtaining medications abroad with Canadian prescriptions</li>
                    <li>Equivalent medication names in different countries</li>
                    <li>Strategies for managing long-term medication needs</li>
                    <li>Emergency prescription situations and solutions</li>
                  </ul>
                </Card>
              </div>
            </div>
            
            <Separator className="my-12" />
            

            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <div className="sticky top-8">
                  <div id="financial" className="flex items-center text-blue-700 mb-2">
                    <Wallet className="h-6 w-6 mr-2" />
                    <h2 className="text-3xl font-bold">Financial Management</h2>
                  </div>
                  <p className="text-xl mt-2 font-medium text-blue-600">Managing Your Finances Abroad</p>
                  <div className="mt-6">
                    <DownloadButton>Download Financial Management Guide</DownloadButton>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Banking Strategies</h3>
                  <p className="text-gray-700 mb-4">
                    Information on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Canadian banks with international partnerships</li>
                    <li>Fee-minimizing strategies for international transactions</li>
                    <li>Credit card recommendations for international use</li>
                    <li>Online banking security practices abroad</li>
                    <li>Currency exchange optimization strategies</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Tax Implications Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Detailed coverage of:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Residency status implications for Canadian taxes</li>
                    <li>Foreign income reporting requirements</li>
                    <li>Tax treaties with major snowbird destinations</li>
                    <li>Property ownership tax considerations</li>
                    <li>Record-keeping requirements for tax purposes</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Budgeting Tools</h3>
                  <p className="text-gray-700 mb-4">
                    Resources including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Destination-specific budget templates</li>
                    <li>Cost of living calculators</li>
                    <li>Exchange rate monitoring tools</li>
                    <li>Expense tracking systems</li>
                    <li>Financial emergency preparation</li>
                  </ul>
                </Card>
              </div>
            </div>
            
            <Separator className="my-12" />
            

            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <div className="sticky top-8">
                  <div id="housing" className="flex items-center text-blue-700 mb-2">
                    <Building className="h-6 w-6 mr-2" />
                    <h2 className="text-3xl font-bold">Housing</h2>
                  </div>
                  <p className="text-xl mt-2 font-medium text-blue-600">Finding and Securing Accommodation</p>
                  <div className="mt-6">
                    <DownloadButton>Download Accommodation Guide</DownloadButton>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Accommodation Options Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Information on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Long-term rental strategies and platforms</li>
                    <li>Property purchase considerations in each destination</li>
                    <li>Retirement community options with Canadian presence</li>
                    <li>House-sitting and home exchange opportunities</li>
                    <li>Short-term options for destination exploration</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Legal Considerations</h3>
                  <p className="text-gray-700 mb-4">
                    Guidance on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Rental contract review and negotiation</li>
                    <li>Property purchase legal requirements by country</li>
                    <li>Inheritance and ownership rights for foreigners</li>
                    <li>Property management during absence</li>
                    <li>Dispute resolution mechanisms</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Neighborhood Guides</h3>
                  <p className="text-gray-700 mb-4">
                    For major snowbird destinations:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Canadian-popular neighborhoods and communities</li>
                    <li>Safety ratings and considerations</li>
                    <li>Amenity proximity (shopping, healthcare, recreation)</li>
                    <li>Transportation options and accessibility</li>
                    <li>Cultural integration factors</li>
                  </ul>
                </Card>
              </div>
            </div>
            
            <Separator className="my-12" />
            

            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="w-full md:w-1/3">
                <div className="sticky top-8">
                  <div id="legal" className="flex items-center text-blue-700 mb-2">
                    <FileText className="h-6 w-6 mr-2" />
                    <h2 className="text-3xl font-bold">Legal Documentation</h2>
                  </div>
                  <p className="text-xl mt-2 font-medium text-blue-600">Essential Documentation for Snowbirds</p>
                  <div className="mt-6">
                    <DownloadButton>Download Legal Documentation Guide</DownloadButton>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Visa and Residency Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive information on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Tourist visa duration and extension procedures</li>
                    <li>Retirement visa options and requirements</li>
                    <li>Residency permit application processes</li>
                    <li>Border run and visa renewal strategies</li>
                    <li>Recent immigration policy changes affecting Canadians</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">Essential Documents Checklist</h3>
                  <p className="text-gray-700 mb-4">
                    Detailed list of:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Required identification documents</li>
                    <li>Healthcare documentation</li>
                    <li>Financial and insurance paperwork</li>
                    <li>Property and accommodation documentation</li>
                    <li>Emergency contact and medical information</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Legal Preparation Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Advice on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Power of attorney considerations for Canadians abroad</li>
                    <li>Healthcare directives for international situations</li>
                    <li>Will and estate planning for international property</li>
                    <li>Tax documentation requirements</li>
                    <li>Digital document storage and access solutions</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Prepare for Your Winter Abroad</h2>
            <p className="text-lg mb-8">
              Ensure your snowbird experience is smooth and worry-free with our comprehensive resources:
            </p>
            <ul className="text-left max-w-lg mx-auto mb-8 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Download our complete Canadian Snowbird Resource Kit</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Use our interactive tools to plan your winter abroad</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Connect with recommended service providers in your destination</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>Join our Canadian Snowbird community for peer advice and support</span>
              </li>
            </ul>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-lg text-lg">
              Get Complete Resource Kit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PracticalResources;