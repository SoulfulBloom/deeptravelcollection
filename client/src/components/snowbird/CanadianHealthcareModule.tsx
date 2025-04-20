import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Info, CheckCircle, AlertTriangle, Heart, Pill, Ambulance, Settings, Stethoscope, Activity } from 'lucide-react';

interface HealthcareModuleProps {
  destination: string;
  // Optional custom data for specific destinations
  customData?: {
    emergencyNumbers?: string[];
    hospitals?: Array<{name: string, address: string, hasEnglishStaff: boolean}>;
    insuranceNotes?: string;
    medicationNotes?: string;
  };
}

export default function CanadianHealthcareModule({ destination, customData }: HealthcareModuleProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Default emergency numbers if not provided
  const emergencyNumbers = customData?.emergencyNumbers || ['911', '112'];
  
  return (
    <div className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-3">
              CANADIAN SNOWBIRD HEALTHCARE
            </span>
            <h2 className="text-3xl font-bold mb-3">Healthcare Information for Canadians in {destination}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Essential healthcare information specifically for Canadian snowbirds spending extended time in {destination}.
            </p>
          </div>
          
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-blue-700">
              Information provided should be verified with individual provincial health plans and insurance providers. 
              Healthcare systems and policies may change. Last updated: {new Date().toLocaleDateString('en-CA')}
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>
            
            {/* Healthcare System Overview */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-xl font-bold flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-blue-600" />
                Healthcare System Overview
              </h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Structure in {destination}</CardTitle>
                  <CardDescription>How the healthcare system works compared to Canada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    {destination}'s healthcare system consists of both public and private options. Unlike Canada's universal healthcare system, 
                    {destination === "United States" 
                      ? " the US system is primarily private and insurance-based with Medicare/Medicaid for eligible groups." 
                      : destination === "Mexico" 
                        ? " Mexico offers a mix of public insurance (IMSS), government employee coverage (ISSSTE), and private options." 
                        : " the healthcare landscape includes a combination of public services and private facilities of varying quality."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Quality Comparison</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>WHO Ranking: {destination === "United States" ? "37th" : destination === "Mexico" ? "61st" : "Varies by region"}</li>
                        <li>Infrastructure: {destination === "United States" ? "Excellent" : destination === "Mexico" ? "Good in major cities" : "Best in urban centers"}</li>
                        <li>Technology: {destination === "United States" ? "Cutting-edge" : destination === "Mexico" ? "Modern in private hospitals" : "Varies by facility"}</li>
                        <li>Wait Times: {destination === "United States" ? "Typically shorter than Canada" : "Can be comparable to Canada"}</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Accessibility for Canadians</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Tourist Access: {destination === "United States" ? "Full access with proper insurance" : "Available with passport"}</li>
                        <li>Language Barriers: {destination === "United States" ? "Minimal" : "May require translator"}</li>
                        <li>Payment Methods: Credit cards and cash widely accepted</li>
                        <li>Documentation: Passport and insurance information required</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <h4 className="font-bold text-gray-900 mb-3">Key Differences from Canadian Healthcare</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aspect</TableHead>
                      <TableHead>Canada</TableHead>
                      <TableHead>{destination}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Cost Structure</TableCell>
                      <TableCell>Universal coverage, minimal direct costs</TableCell>
                      <TableCell>{destination === "United States" 
                        ? "Fee-for-service, insurance-based" 
                        : "Mix of public subsidized and private pay services"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Specialist Access</TableCell>
                      <TableCell>Referral from GP required</TableCell>
                      <TableCell>{destination === "United States" 
                        ? "Direct access possible with insurance" 
                        : "Often available without referral in private system"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Prescription Drugs</TableCell>
                      <TableCell>Not covered universally</TableCell>
                      <TableCell>{destination === "United States" 
                        ? "Covered by insurance plans, often expensive" 
                        : "Generally lower cost than Canada"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Emergency Care</TableCell>
                      <TableCell>Universal access</TableCell>
                      <TableCell>{destination === "United States" 
                        ? "Available to all but very costly without insurance" 
                        : "Available but quality varies by location"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <Alert className="mt-6">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Before You Travel</AlertTitle>
                <AlertDescription>
                  We strongly recommend consulting with your provincial health authority and purchasing comprehensive travel insurance before departing Canada.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            {/* Provincial Insurance Compatibility */}
            <TabsContent value="insurance" className="space-y-6">
              <h3 className="text-xl font-bold flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-600" />
                Provincial Health Insurance Compatibility
              </h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Canadian Provincial Coverage While Abroad</CardTitle>
                  <CardDescription>How your provincial health insurance works in {destination}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Provincial health plans provide limited coverage when traveling outside Canada. Coverage varies by province and is typically a fraction of what would be covered in Canada.
                    {customData?.insuranceNotes && <span className="font-medium text-blue-700"> {customData.insuranceNotes}</span>}
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ontario">
                      <AccordionTrigger>Ontario (OHIP)</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                          <li><span className="font-medium">Coverage Period:</span> Maximum 212 days (7 months) outside Canada</li>
                          <li><span className="font-medium">Out-of-Country Coverage:</span> Very limited, up to $400/day for inpatient services</li>
                          <li><span className="font-medium">Documentation:</span> Original itemized receipts, physician's statement</li>
                          <li><span className="font-medium">Claim Form:</span> Form 0951-84 required, submit within 12 months</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="british-columbia">
                      <AccordionTrigger>British Columbia (MSP)</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                          <li><span className="font-medium">Coverage Period:</span> Up to 7 months (must be in BC for 6 months per year)</li>
                          <li><span className="font-medium">Out-of-Country Coverage:</span> Limited to $75 CAD per day for emergency hospital and 50% of eligible fees for physician services</li>
                          <li><span className="font-medium">Documentation:</span> Receipts, medical reports, proof of travel dates</li>
                          <li><span className="font-medium">Claim Form:</span> Out-of-Country Claims form, submit within 90 days</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="alberta">
                      <AccordionTrigger>Alberta (AHCIP)</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                          <li><span className="font-medium">Coverage Period:</span> Up to 6 months absence</li>
                          <li><span className="font-medium">Out-of-Country Coverage:</span> Emergency services only, at Alberta rates (typically 10-15% of actual costs)</li>
                          <li><span className="font-medium">Documentation:</span> Detailed receipts, medical records, proof of departure</li>
                          <li><span className="font-medium">Claim Form:</span> AHCIP Out-of-Country Health Services Claim form</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="quebec">
                      <AccordionTrigger>Quebec (RAMQ)</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                          <li><span className="font-medium">Coverage Period:</span> Up to 183 days per calendar year (plus brief trips)</li>
                          <li><span className="font-medium">Out-of-Country Coverage:</span> Maximum $100 CAD per day for hospitalization, $50 for outpatient care</li>
                          <li><span className="font-medium">Documentation:</span> Original invoices, medical reports in French or English</li>
                          <li><span className="font-medium">Claim Form:</span> RAMQ Application for Reimbursement form</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <h4 className="font-bold text-gray-900 mb-3">Claim Submission Process</h4>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <ol className="list-decimal list-inside space-y-3 mb-5">
                    <li className="font-medium">Pay for all medical services upfront and keep detailed receipts</li>
                    <li className="font-medium">Request detailed medical reports in English if possible</li>
                    <li className="font-medium">Complete your provincial health insurance claim form</li>
                    <li className="font-medium">Submit claim to your supplemental travel insurance first (if applicable)</li>
                    <li className="font-medium">Submit remaining expenses to your provincial plan with proof of insurance response</li>
                    <li className="font-medium">Keep copies of all submitted documents</li>
                  </ol>
                  
                  <div className="flex items-start space-x-3 text-blue-800 bg-blue-50 p-3 rounded">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-bold">Pro Tip:</span> Take photos of all medical documentation immediately and upload to secure cloud storage in case original documents are lost.
                    </p>
                  </div>
                </div>
              </div>
              
              <Card className="mt-6 border-amber-200">
                <CardHeader className="bg-amber-50">
                  <CardTitle className="flex items-center text-amber-800">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Why Supplemental Insurance Is Essential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Provincial plans typically cover only 5-10% of foreign medical costs. For example:
                  </p>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medical Service</TableHead>
                        <TableHead>Typical Cost in {destination}</TableHead>
                        <TableHead>Provincial Coverage</TableHead>
                        <TableHead>Your Potential Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Emergency Room Visit</TableCell>
                        <TableCell>{destination === "United States" ? "$2,000-$3,000 USD" : "$500-$1,000 USD"}</TableCell>
                        <TableCell>$50-100 CAD</TableCell>
                        <TableCell className="font-medium text-red-600">{destination === "United States" ? "$2,400-$3,700 CAD" : "$550-$1,200 CAD"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hospital Stay (per day)</TableCell>
                        <TableCell>{destination === "United States" ? "$5,000+ USD" : "$800-$2,000 USD"}</TableCell>
                        <TableCell>$100-400 CAD</TableCell>
                        <TableCell className="font-medium text-red-600">{destination === "United States" ? "$6,000+ CAD" : "$900-$2,200 CAD"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medical Evacuation</TableCell>
                        <TableCell>{destination === "United States" ? "$35,000-$100,000 USD" : "$15,000-$50,000 USD"}</TableCell>
                        <TableCell>$0 CAD</TableCell>
                        <TableCell className="font-medium text-red-600">{destination === "United States" ? "$45,000-$130,000 CAD" : "$20,000-$65,000 CAD"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-bold text-blue-800 mb-2">Recommended Insurance Providers for Canadians</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" /> Medipac Travel Insurance</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" /> Blue Cross</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" /> Travel Guard</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" /> Allianz Global Assistance</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" /> Manulife Travel Insurance</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" /> TuGo Travel Insurance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Medical Facilities */}
            <TabsContent value="facilities" className="space-y-6">
              <h3 className="text-xl font-bold flex items-center">
                <Heart className="mr-2 h-5 w-5 text-blue-600" />
                Healthcare Facilities for Canadians
              </h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Medical Facilities in {destination}</CardTitle>
                  <CardDescription>Hospitals and clinics suitable for Canadian visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-5">
                    {destination} offers a range of medical facilities from world-class private hospitals to basic local clinics. Canadians typically find the best care at facilities accustomed to treating international patients.
                  </p>
                  
                  <div className="bg-gray-50 p-5 rounded-lg mb-5">
                    <h4 className="font-bold text-gray-900 mb-3">Recommended Hospitals with English-Speaking Staff</h4>
                    
                    {customData?.hospitals ? (
                      <ul className="space-y-3">
                        {customData.hospitals.map((hospital, index) => (
                          <li key={index} className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                            <h5 className="font-bold">{hospital.name}</h5>
                            <p className="text-gray-600 text-sm">{hospital.address}</p>
                            {hospital.hasEnglishStaff && (
                              <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full mt-1">
                                <CheckCircle className="h-3 w-3 mr-1" /> English-speaking staff
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 italic">
                        Specific hospital information for {destination} will be provided in your detailed guide.
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" /> 
                        What to Look For
                      </h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>JCI or international accreditation</li>
                        <li>English-speaking medical staff</li>
                        <li>Experience with international patients</li>
                        <li>Direct billing to insurance companies</li>
                        <li>Canadian-trained doctors when available</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Warning Signs
                      </h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>No published credentials or accreditation</li>
                        <li>Significantly lower prices than average</li>
                        <li>Inability to provide detailed cost estimates</li>
                        <li>Poor hygiene standards</li>
                        <li>Pressure for upfront cash payments</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Average Wait Time</TableHead>
                        <TableHead>Compared to Canada</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Primary Care Appointment</TableCell>
                        <TableCell>{destination === "United States" ? "1-3 days" : "1-7 days"}</TableCell>
                        <TableCell>{destination === "United States" ? "Much shorter" : "Comparable"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Specialist Consultation</TableCell>
                        <TableCell>{destination === "United States" ? "1-2 weeks" : "2-4 weeks"}</TableCell>
                        <TableCell>{destination === "United States" ? "Much shorter" : "Shorter"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Emergency Room</TableCell>
                        <TableCell>{destination === "United States" ? "1-3 hours" : "2-6 hours"}</TableCell>
                        <TableCell>Comparable</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Non-urgent Surgery</TableCell>
                        <TableCell>{destination === "United States" ? "1-3 weeks" : "2-8 weeks"}</TableCell>
                        <TableCell>Much shorter</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Telemedicine Options</CardTitle>
                  <CardDescription>Virtual care options for Canadians abroad</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Many Canadian physicians can provide virtual follow-up care while you're abroad, and several services cater specifically to Canadians traveling outside the country.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-bold mb-2">Maple</h5>
                      <p className="text-sm text-gray-600 mb-2">Canadian service with 24/7 doctor access</p>
                      <p className="text-xs bg-green-50 text-green-800 py-1 px-2 rounded inline-block">Works internationally</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-bold mb-2">Teladoc</h5>
                      <p className="text-sm text-gray-600 mb-2">International service with Canadian doctors</p>
                      <p className="text-xs bg-green-50 text-green-800 py-1 px-2 rounded inline-block">Insurance coverage available</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-bold mb-2">Cloud MDX</h5>
                      <p className="text-sm text-gray-600 mb-2">Canadian snowbird focused services</p>
                      <p className="text-xs bg-green-50 text-green-800 py-1 px-2 rounded inline-block">Prescription coordination</p>
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-5 w-5" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      While Canadian doctors can consult with you virtually, they generally cannot prescribe medications to be filled in foreign countries. 
                      Use these services primarily for follow-ups and minor issues.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Prescription Medications */}
            <TabsContent value="medications" className="space-y-6">
              <h3 className="text-xl font-bold flex items-center">
                <Pill className="mr-2 h-5 w-5 text-blue-600" />
                Prescription Medications
              </h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Managing Prescriptions in {destination}</CardTitle>
                  <CardDescription>Information about bringing, finding, and filling prescriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Managing medications is one of the most important aspects of healthcare planning for Canadian snowbirds. 
                    {customData?.medicationNotes && <span className="font-medium text-blue-700"> {customData.medicationNotes}</span>}
                  </p>
                  
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">Bringing Medications from Canada</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li><span className="font-medium">Quantity limitations:</span> Typically, you can bring up to a 90-day supply of prescription medications for personal use</li>
                      <li><span className="font-medium">Documentation:</span> Carry original prescription bottles with labels, plus a letter from your physician explaining medical necessity</li>
                      <li><span className="font-medium">Controlled substances:</span> Special rules apply; specific medical documentation required and some medications may be prohibited entirely</li>
                      <li><span className="font-medium">Declaration:</span> Always declare all medications when crossing borders</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Filling Prescriptions Locally</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li><span className="font-medium">Local prescription requirements:</span> Canadian prescriptions are {destination === "United States" ? "generally not accepted" : "sometimes accepted but may need local doctor approval"}</li>
                        <li><span className="font-medium">Finding a local doctor:</span> Ask your hotel, consulate, or expat groups for recommendations</li>
                        <li><span className="font-medium">Pharmacy standards:</span> {destination === "United States" ? "Highly regulated, similar to Canada" : "Look for major chains or hospital pharmacies for reliability"}</li>
                        <li><span className="font-medium">Generic alternatives:</span> {destination === "United States" ? "Widely available but can be expensive" : "Often available at significantly lower costs than Canada"}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Medication Availability</h4>
                      <p className="mb-2 text-gray-600">Common Canadian medications available in {destination}:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-green-50 p-2 rounded text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Blood pressure medications
                        </div>
                        <div className="bg-green-50 p-2 rounded text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Cholesterol medications
                        </div>
                        <div className="bg-green-50 p-2 rounded text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Diabetes medications
                        </div>
                        <div className="bg-green-50 p-2 rounded text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Pain relievers
                        </div>
                        <div className="bg-green-50 p-2 rounded text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Antihistamines
                        </div>
                        <div className="bg-green-50 p-2 rounded text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          GI medications
                        </div>
                      </div>
                      
                      <p className="mt-3 mb-2 text-gray-600">Medications that may be difficult to find:</p>
                      <div className="space-y-2">
                        <div className="bg-amber-50 p-2 rounded text-sm flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                          <span>Some Canadian-specific brand names and formulations</span>
                        </div>
                        <div className="bg-amber-50 p-2 rounded text-sm flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                          <span>Certain controlled substances may have different regulations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mt-4 mb-3">Cost Comparison</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication Type</TableHead>
                        <TableHead>Canada Average Price</TableHead>
                        <TableHead>{destination} Average Price</TableHead>
                        <TableHead>Savings/Additional Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Common Generic Medications</TableCell>
                        <TableCell>$20-40 CAD</TableCell>
                        <TableCell>{destination === "United States" ? "$30-100 USD" : "$5-25 USD"}</TableCell>
                        <TableCell className={destination === "United States" ? "text-red-600" : "text-green-600"}>
                          {destination === "United States" ? "50-300% more expensive" : "50-80% savings"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Brand-name Medications</TableCell>
                        <TableCell>$100-200 CAD</TableCell>
                        <TableCell>{destination === "United States" ? "$300-500 USD" : "$50-150 USD"}</TableCell>
                        <TableCell className={destination === "United States" ? "text-red-600" : "text-green-600"}>
                          {destination === "United States" ? "200-300% more expensive" : "Up to 40% savings"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Specialty Medications</TableCell>
                        <TableCell>$500+ CAD</TableCell>
                        <TableCell>{destination === "United States" ? "$1,000-2,000+ USD" : "$200-600 USD"}</TableCell>
                        <TableCell className={destination === "United States" ? "text-red-600" : "text-green-600"}>
                          {destination === "United States" ? "100-300% more expensive" : "Up to 50% savings"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="mt-4 space-y-4">
                <h4 className="font-bold text-gray-900">Medication Management Tips</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <h5 className="font-bold text-blue-800 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Before You Travel
                    </h5>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
                      <li>Get a medication review with your doctor</li>
                      <li>Request an extended supply (90+ days if possible)</li>
                      <li>Create a detailed list of all medications with generic names</li>
                      <li>Research medication availability at your destination</li>
                      <li>Consider pill organizers for extended trips</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <h5 className="font-bold text-blue-800 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      During Your Stay
                    </h5>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
                      <li>Store medications properly (temperature considerations)</li>
                      <li>Keep a photocopy of prescriptions separate from medications</li>
                      <li>Never buy medications from non-licensed vendors</li>
                      <li>Consider time zone changes for medication schedules</li>
                      <li>Use pill reminder apps to maintain consistent schedule</li>
                    </ul>
                  </div>
                </div>
                
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-800">Important Warning</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Medication names, strengths, and formulations can vary internationally. Always confirm with a healthcare professional that you're receiving the correct equivalent medication.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            
            {/* Emergency Medical Services */}
            <TabsContent value="emergency" className="space-y-6">
              <h3 className="text-xl font-bold flex items-center">
                <Ambulance className="mr-2 h-5 w-5 text-blue-600" />
                Emergency Medical Protocol
              </h3>
              
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800">Emergency Contacts in {destination}</AlertTitle>
                <AlertDescription className="text-red-700">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {emergencyNumbers.map((number, index) => (
                      <div key={index} className="bg-white p-2 rounded border border-red-100 text-center">
                        <p className="font-bold text-red-800">{number}</p>
                        <p className="text-xs">{
                          number === '911' ? 'Emergency Services' :
                          number === '112' ? 'International Emergency' :
                          'Local Emergency'
                        }</p>
                      </div>
                    ))}
                    <div className="bg-white p-2 rounded border border-red-100 text-center">
                      <p className="font-bold text-red-800">+1 613-996-8885</p>
                      <p className="text-xs">Canadian Emergency Watch</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              <Card>
                <CardHeader>
                  <CardTitle>Step-by-Step Emergency Protocol</CardTitle>
                  <CardDescription>What to do in case of a medical emergency</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4 mb-6">
                    <li className="border-l-4 border-blue-600 pl-4 pb-1">
                      <h4 className="font-bold">1. Call for emergency services</h4>
                      <p className="text-gray-600">Dial {emergencyNumbers[0]} or have someone nearby call for you. If possible, request an ambulance with advanced life support.</p>
                    </li>
                    
                    <li className="border-l-4 border-blue-600 pl-4 pb-1">
                      <h4 className="font-bold">2. Contact your travel insurance provider</h4>
                      <p className="text-gray-600">Call the emergency number on your insurance card immediately. They can provide guidance, arrange direct billing, and help find appropriate facilities.</p>
                    </li>
                    
                    <li className="border-l-4 border-blue-600 pl-4 pb-1">
                      <h4 className="font-bold">3. Show your insurance information</h4>
                      <p className="text-gray-600">Present your travel insurance card and passport to the medical staff as soon as possible.</p>
                    </li>
                    
                    <li className="border-l-4 border-blue-600 pl-4 pb-1">
                      <h4 className="font-bold">4. Request an English-speaking healthcare provider</h4>
                      <p className="text-gray-600">Ask for someone who speaks English or request translation services if needed.</p>
                    </li>
                    
                    <li className="border-l-4 border-blue-600 pl-4 pb-1">
                      <h4 className="font-bold">5. Contact the Canadian Embassy/Consulate</h4>
                      <p className="text-gray-600">In serious situations, contact the Canadian consular services for additional assistance.</p>
                    </li>
                    
                    <li className="border-l-4 border-blue-600 pl-4 pb-1">
                      <h4 className="font-bold">6. Keep all documentation</h4>
                      <p className="text-gray-600">Obtain detailed receipts, medical reports, and documentation of all services provided.</p>
                    </li>
                  </ol>
                  
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">Key Medical Phrases in {destination === "Mexico" ? "Spanish" : destination === "Portugal" ? "Portuguese" : "Local Language"}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="font-bold text-gray-900">I need a doctor</p>
                        <p className="text-gray-600 italic">
                          {destination === "Mexico" ? "Necesito un médico" : 
                           destination === "Portugal" ? "Preciso de um médico" :
                           destination === "United States" ? "I need a doctor" :
                           "[Local translation]"}
                        </p>
                      </div>
                      
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="font-bold text-gray-900">I have an emergency</p>
                        <p className="text-gray-600 italic">
                          {destination === "Mexico" ? "Tengo una emergencia" : 
                           destination === "Portugal" ? "Tenho uma emergência" :
                           destination === "United States" ? "I have an emergency" :
                           "[Local translation]"}
                        </p>
                      </div>
                      
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="font-bold text-gray-900">I have travel insurance</p>
                        <p className="text-gray-600 italic">
                          {destination === "Mexico" ? "Tengo seguro de viaje" : 
                           destination === "Portugal" ? "Tenho seguro de viagem" :
                           destination === "United States" ? "I have travel insurance" :
                           "[Local translation]"}
                        </p>
                      </div>
                      
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="font-bold text-gray-900">I take medication for...</p>
                        <p className="text-gray-600 italic">
                          {destination === "Mexico" ? "Tomo medicamentos para..." : 
                           destination === "Portugal" ? "Tomo medicamentos para..." :
                           destination === "United States" ? "I take medication for..." :
                           "[Local translation]"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <h4 className="font-bold text-gray-900 mb-4">Medical Evacuation Options</h4>
                <p className="mb-4">Medical evacuation can cost tens of thousands of dollars and is rarely covered by provincial health plans.</p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evacuation Type</TableHead>
                      <TableHead>Typical Cost (Without Insurance)</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Insurance Coverage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ground Transport to Better Facility</TableCell>
                      <TableCell>{destination === "United States" ? "$2,000-$5,000 USD" : "$500-$2,000 USD"}</TableCell>
                      <TableCell>1-3 hours</TableCell>
                      <TableCell>Usually covered with pre-approval</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Air Ambulance (Domestic)</TableCell>
                      <TableCell>{destination === "United States" ? "$15,000-$30,000 USD" : "$5,000-$15,000 USD"}</TableCell>
                      <TableCell>2-6 hours</TableCell>
                      <TableCell>Often covered with limitations</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">International Medical Repatriation</TableCell>
                      <TableCell>{destination === "United States" ? "$35,000-$100,000 USD" : "$20,000-$75,000 USD"}</TableCell>
                      <TableCell>24-72 hours</TableCell>
                      <TableCell>Requires comprehensive insurance</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-bold text-blue-800 mb-2">Medical Evacuation Insurance Tips</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
                    <li>Confirm your policy covers evacuation to Canada, not just to the "nearest appropriate facility"</li>
                    <li>Check if your policy requires medical necessity or allows for evacuation by choice</li>
                    <li>Understand the pre-approval process required before evacuation arrangements</li>
                    <li>Consider standalone medical evacuation membership programs like Medjet or Global Rescue</li>
                    <li>Verify coverage limits are sufficient for your destination (minimum $100,000 recommended)</li>
                  </ul>
                </div>
              </div>
              
              <Card className="mt-6 border-amber-200">
                <CardHeader className="bg-amber-50">
                  <CardTitle className="flex items-center text-amber-800">
                    <Settings className="mr-2 h-5 w-5" />
                    Specialized Senior Care Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Canadian seniors with chronic conditions should take additional precautions when traveling to {destination}.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-bold mb-2">Cardiac Care</h5>
                        <p className="text-sm text-gray-600 mb-2">
                          {destination === "United States" 
                            ? "Excellent cardiac facilities available in most major cities. Look for certified chest pain centers."
                            : "Quality varies significantly. Research hospitals with cardiac centers before traveling."}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-bold mb-2">Dialysis Services</h5>
                        <p className="text-sm text-gray-600 mb-2">
                          {destination === "United States" 
                            ? "Many dialysis centers accept Canadian visitors with advance arrangements."
                            : "Limited availability. Book appointments several months in advance."}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-bold mb-2">Respiratory Conditions</h5>
                        <p className="text-sm text-gray-600 mb-2">
                          Consider air quality and altitude. Bring sufficient supplies for CPAP or oxygen therapy (requires advance arrangements).
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-bold mb-2">Mobility Services</h5>
                        <p className="text-sm text-gray-600 mb-2">
                          Mobility equipment rentals available in major tourist areas. Research accessibility options for your specific needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-center text-blue-800">Healthcare Preparation Checklist</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Before Departure
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Schedule medical/dental check-ups</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Purchase comprehensive travel insurance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Refill prescriptions (90+ day supply)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Get a doctor's letter for medications</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Create a medical information card to carry</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Research healthcare facilities at destination</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Documents to Pack
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Insurance policy with emergency contact numbers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Physician's contact information</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>List of medications with generic names</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Medical history summary</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Provincial health card & insurance card</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-300 flex-shrink-0 mr-2"></div>
                    <span>Canadian consulate contact information</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Printable Checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}