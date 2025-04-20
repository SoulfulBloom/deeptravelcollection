// Data structure for provincial health insurance information

export interface ProvinceData {
  code: string;
  name: string;
  plan: string;
  maxDaysAbroad: number;
  coveragePercentage: number;
  maxAmount: string;
  documentation: string[];
  applicationProcedure: string[];
  recentChanges: string[];
  supplementalRecommendations: string[];
  officialWebsite: string;
}

export const provinces: ProvinceData[] = [
  {
    code: "ON",
    name: "Ontario",
    plan: "OHIP (Ontario Health Insurance Plan)",
    maxDaysAbroad: 212,
    coveragePercentage: 5,
    maxAmount: "$400 CAD per day for inpatient services and $50 CAD per day for outpatient services",
    documentation: [
      "Request an Application to Maintain OHIP Coverage During an Extended Absence (form 0590-82)",
      "Proof of Ontario residency",
      "Copy of travel documents"
    ],
    applicationProcedure: [
      "Submit your application at least 30 days before departure",
      "Application must be approved before leaving the province",
      "You must be physically present in Ontario for at least 153 days in any 12-month period"
    ],
    recentChanges: [
      "As of 2023, OHIP no longer covers out-of-country emergency healthcare costs",
      "You must have private travel insurance for adequate coverage abroad"
    ],
    supplementalRecommendations: [
      "Comprehensive travel insurance with minimum $1,000,000 USD coverage",
      "Coverage should include emergency transportation and repatriation",
      "Look for policies that cover pre-existing conditions"
    ],
    officialWebsite: "https://www.ontario.ca/page/ohip-coverage-while-outside-canada"
  },
  {
    code: "BC",
    name: "British Columbia",
    plan: "MSP (Medical Services Plan)",
    maxDaysAbroad: 182,
    coveragePercentage: 10,
    maxAmount: "$75 CAD per day for emergency inpatient services and $25 CAD for outpatient services",
    documentation: [
      "Temporary Absence form (contact Health Insurance BC)",
      "Proof of BC residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Health Insurance BC before leaving",
      "You must be physically present in BC for at least 6 months in a calendar year",
      "You may be eligible for an extension for a temporary absence"
    ],
    recentChanges: [
      "MSP coverage for out-of-country services is minimal",
      "Starting 2023, stricter residency verification processes are in place"
    ],
    supplementalRecommendations: [
      "Travel insurance with coverage of at least $2,000,000 USD",
      "Pre-existing condition coverage without stability period requirements if possible",
      "Emergency air evacuation and repatriation coverage"
    ],
    officialWebsite: "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/msp-and-leaving-bc"
  },
  {
    code: "QC",
    name: "Quebec",
    plan: "RAMQ (Régie de l'assurance maladie du Québec)",
    maxDaysAbroad: 183,
    coveragePercentage: 8,
    maxAmount: "$100 CAD for hospitalization per day and $50 CAD for medical services",
    documentation: [
      "Notify RAMQ before departure (no specific form)",
      "Proof of Quebec residency",
      "Travel itinerary or documentation"
    ],
    applicationProcedure: [
      "You must be physically present in Quebec for at least 183 days in a calendar year",
      "Special provisions for students, civil servants, and humanitarian workers",
      "Contact RAMQ before departure for authorization"
    ],
    recentChanges: [
      "Out-of-country coverage has been significantly reduced in recent years",
      "Enhanced verification of residency requirements"
    ],
    supplementalRecommendations: [
      "Insurance coverage specifically designed for Quebec residents",
      "Coverage for repatriation to Quebec, not just to Canada",
      "Minimum $5,000,000 CAD emergency medical coverage"
    ],
    officialWebsite: "https://www.ramq.gouv.qc.ca/en/citizens/absence-quebec/health-insurance"
  },
  {
    code: "AB",
    name: "Alberta",
    plan: "AHCIP (Alberta Health Care Insurance Plan)",
    maxDaysAbroad: 183,
    coveragePercentage: 7,
    maxAmount: "$100 CAD per day for inpatient services and $50 CAD for outpatient services",
    documentation: [
      "Temporary Absence form (contact Alberta Health)",
      "Proof of Alberta residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Notify Alberta Health before leaving",
      "You must be physically present in Alberta for at least 183 days in a 12-month period",
      "Extensions may be granted for specific circumstances"
    ],
    recentChanges: [
      "Enhanced verification of residency requirements",
      "Limited coverage for emergency services while traveling"
    ],
    supplementalRecommendations: [
      "Travel insurance with minimum $2,000,000 CAD coverage",
      "Coverage for air ambulance transportation back to Alberta",
      "Extended coverage for trips longer than 6 months"
    ],
    officialWebsite: "https://www.alberta.ca/ahcip-absence-from-alberta.aspx"
  },
  {
    code: "MB",
    name: "Manitoba",
    plan: "Manitoba Health",
    maxDaysAbroad: 183,
    coveragePercentage: 5,
    maxAmount: "$100 CAD per day for hospitalization and $25 CAD for outpatient services",
    documentation: [
      "Notification to Manitoba Health (no specific form)",
      "Proof of Manitoba residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Manitoba Health before departure",
      "Must be physically present in Manitoba for at least 183 days in a calendar year",
      "May be eligible for extension under certain circumstances"
    ],
    recentChanges: [
      "Stricter enforcement of residency requirements",
      "Limited coverage for medical services outside of Canada"
    ],
    supplementalRecommendations: [
      "Travel insurance with at least $2,000,000 CAD coverage",
      "Coverage for pre-existing conditions without stability period requirements",
      "Emergency evacuation and repatriation coverage"
    ],
    officialWebsite: "https://www.gov.mb.ca/health/mhsip/leavingmanitoba.html"
  },
  {
    code: "SK",
    name: "Saskatchewan",
    plan: "Saskatchewan Health",
    maxDaysAbroad: 183,
    coveragePercentage: 6,
    maxAmount: "$100 CAD per day for hospitalization and $30 CAD for outpatient services",
    documentation: [
      "Notification to Saskatchewan Health (recommended but not required)",
      "Proof of Saskatchewan residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact eHealth Saskatchewan before departure",
      "Must be physically present in Saskatchewan for at least 183 days in a calendar year",
      "Students may be eligible for extended coverage"
    ],
    recentChanges: [
      "Enhanced verification of residency requirements",
      "Limited coverage for emergency services abroad"
    ],
    supplementalRecommendations: [
      "Travel insurance with minimum $2,000,000 CAD coverage",
      "Coverage for air ambulance and repatriation",
      "Specific coverage for pre-existing conditions"
    ],
    officialWebsite: "https://www.ehealthsask.ca/residents/health-cards/Pages/Updating-Health-Registration.aspx"
  },
  {
    code: "NS",
    name: "Nova Scotia",
    plan: "MSI (Medical Services Insurance)",
    maxDaysAbroad: 183,
    coveragePercentage: 7,
    maxAmount: "$525 CAD per day for hospitalization and $30 CAD for outpatient services",
    documentation: [
      "Notification to Nova Scotia MSI (recommended but not required)",
      "Proof of Nova Scotia residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Nova Scotia MSI before departure",
      "Must be physically present in Nova Scotia for at least 183 days in a calendar year",
      "Special provisions for students and certain workers"
    ],
    recentChanges: [
      "Stricter enforcement of residency requirements",
      "Limited coverage for emergency services abroad"
    ],
    supplementalRecommendations: [
      "Travel insurance with at least $1,000,000 CAD coverage",
      "Coverage for emergency transportation back to Canada",
      "Look for policies with coverage for pre-existing conditions"
    ],
    officialWebsite: "https://novascotia.ca/dhw/msi/moving_travel.asp"
  },
  {
    code: "NB",
    name: "New Brunswick",
    plan: "New Brunswick Medicare",
    maxDaysAbroad: 183,
    coveragePercentage: 5,
    maxAmount: "$100 CAD per day for hospitalization and $20 CAD for outpatient services",
    documentation: [
      "Temporary Absence form (contact Medicare)",
      "Proof of New Brunswick residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Medicare before departure",
      "Must be physically present in New Brunswick for at least 183 days in a calendar year",
      "Students may be eligible for extended coverage"
    ],
    recentChanges: [
      "Enhanced verification of residency requirements",
      "Minimal coverage for emergency services abroad"
    ],
    supplementalRecommendations: [
      "Travel insurance with minimum $2,000,000 CAD coverage",
      "Coverage for air ambulance and repatriation",
      "Specific coverage for pre-existing conditions"
    ],
    officialWebsite: "https://www2.gnb.ca/content/gnb/en/departments/health/MedicarePrescriptionDrugPlan.html"
  },
  {
    code: "NL",
    name: "Newfoundland and Labrador",
    plan: "MCP (Medical Care Plan)",
    maxDaysAbroad: 183,
    coveragePercentage: 6,
    maxAmount: "$350 CAD per day for hospitalization and $25 CAD for outpatient services",
    documentation: [
      "Temporary Absence form (contact MCP)",
      "Proof of Newfoundland and Labrador residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact MCP before departure",
      "Must be physically present in Newfoundland and Labrador for at least 183 days in a calendar year",
      "May qualify for up to 12 months absence in special circumstances"
    ],
    recentChanges: [
      "Stricter enforcement of residency requirements",
      "Limited coverage for emergency services abroad"
    ],
    supplementalRecommendations: [
      "Travel insurance with at least $1,000,000 CAD coverage",
      "Coverage for emergency transportation back to Canada",
      "Look for policies with coverage for pre-existing conditions"
    ],
    officialWebsite: "https://www.gov.nl.ca/hcs/mcp/leaving/"
  },
  {
    code: "PE",
    name: "Prince Edward Island",
    plan: "PEI Medicare",
    maxDaysAbroad: 182,
    coveragePercentage: 5,
    maxAmount: "$400 CAD per day for hospitalization and $25 CAD for outpatient services",
    documentation: [
      "Extended Absence form (contact Health PEI)",
      "Proof of PEI residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Health PEI before departure",
      "Must be physically present in PEI for at least 183 days in a calendar year",
      "Students may be eligible for extended coverage"
    ],
    recentChanges: [
      "Enhanced verification of residency requirements",
      "Limited coverage for emergency services abroad"
    ],
    supplementalRecommendations: [
      "Travel insurance with minimum $2,000,000 CAD coverage",
      "Coverage for air ambulance and repatriation",
      "Specific coverage for pre-existing conditions"
    ],
    officialWebsite: "https://www.princeedwardisland.ca/en/information/health-pei/medical-services-travel-outside-canada"
  },
  {
    code: "NT",
    name: "Northwest Territories",
    plan: "NWT Health Care Plan",
    maxDaysAbroad: 183,
    coveragePercentage: 8,
    maxAmount: "$2,900 CAD per day for hospitalization and $300 CAD for outpatient services",
    documentation: [
      "Temporary Absence form (contact Health Services Administration)",
      "Proof of NWT residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Health Services Administration before departure",
      "Must be physically present in NWT for at least 183 days in a calendar year",
      "Students and certain workers may be eligible for extended coverage"
    ],
    recentChanges: [
      "Stricter enforcement of residency requirements",
      "Higher coverage amounts compared to other territories but still limited"
    ],
    supplementalRecommendations: [
      "Travel insurance with at least $2,000,000 CAD coverage",
      "Coverage for evacuation to major Canadian medical centers",
      "Look for policies with coverage for pre-existing conditions"
    ],
    officialWebsite: "https://www.hss.gov.nt.ca/en/services/nwt-health-care-plan"
  },
  {
    code: "YT",
    name: "Yukon",
    plan: "Yukon Health Care Insurance Plan",
    maxDaysAbroad: 183,
    coveragePercentage: 7,
    maxAmount: "$2,752 CAD per day for hospitalization and $290 CAD for outpatient services",
    documentation: [
      "Temporary Absence form (contact Insured Health Services)",
      "Proof of Yukon residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Insured Health Services before departure",
      "Must be physically present in Yukon for at least 183 days in a calendar year",
      "Students may be eligible for extended coverage"
    ],
    recentChanges: [
      "Enhanced verification of residency requirements",
      "Higher coverage amounts compared to provinces but still limited"
    ],
    supplementalRecommendations: [
      "Travel insurance with minimum $2,000,000 CAD coverage",
      "Coverage for air ambulance and repatriation",
      "Specific coverage for pre-existing conditions"
    ],
    officialWebsite: "https://yukon.ca/en/health-and-wellness/care-services/apply-yukon-health-care-insurance"
  },
  {
    code: "NU",
    name: "Nunavut",
    plan: "Nunavut Health Care Plan",
    maxDaysAbroad: 183,
    coveragePercentage: 8,
    maxAmount: "$2,900 CAD per day for hospitalization and $300 CAD for outpatient services",
    documentation: [
      "Notification to Department of Health (recommended)",
      "Proof of Nunavut residency",
      "Travel itinerary"
    ],
    applicationProcedure: [
      "Contact Department of Health before departure",
      "Must be physically present in Nunavut for at least 183 days in a calendar year",
      "Special provisions for students and certain workers"
    ],
    recentChanges: [
      "Stricter enforcement of residency requirements",
      "Higher coverage amounts compared to provinces but still limited"
    ],
    supplementalRecommendations: [
      "Travel insurance with at least $2,000,000 CAD coverage",
      "Coverage for evacuation to major Canadian medical centers",
      "Look for policies with coverage for pre-existing conditions"
    ],
    officialWebsite: "https://www.gov.nu.ca/health"
  }
];

// Function to get a province by code
export function getProvinceByCode(code: string): ProvinceData | undefined {
  return provinces.find(province => province.code === code);
}

// Function to get all province codes
export function getAllProvinceCodes(): string[] {
  return provinces.map(province => province.code);
}

// Function to get all province names
export function getAllProvinceNames(): string[] {
  return provinces.map(province => province.name);
}