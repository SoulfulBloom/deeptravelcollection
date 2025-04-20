import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useFonts } from "@/components/ui/fonts";
import { 
  Activity,
  CalendarDays, 
  MapPin, 
  Utensils, 
  Hotel, 
  DollarSign, 
  Briefcase,
  Download,
  Heart,
  ChevronRight,
  Home,
  LockIcon,
  CreditCard,
  BadgeCheck,
  ShieldCheck,
  Star,
  HelpCircle,
  Users,
  MapIcon,
  CheckCircle,
  Coffee,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

interface CanadianTestimonial {
  id: string;
  name: string;
  image: string;
  text: string;
  location: string;
  rating: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function GuidePreviewPage() {
  const { heading } = useFonts();
  const [, navigate] = useLocation();
  const [activeContent, setActiveContent] = useState<'healthcare' | 'financial' | 'housing'>('healthcare');
  
  // Sample data for guide preview (this would come from an API in production)
  const guide = {
    id: "costa-rica-snowbird",
    title: "Costa Rica Snowbird Guide",
    subtitle: "The Complete 3-Month Living Guide for Canadian Snowbirds",
    coverImage: "/images/destinations/costa-rica.jpg",
    author: {
      name: "Kymm Burton-Clark",
      role: "Senior Travel Consultant",
      credentials: "TICO Certified (Reg #51553)",
      image: "/images/author.jpg"
    },
    price: 19.99,
    priceCurrency: "CAD",
    previousPrice: 24.99,
    discountPercent: 20,
    pageCount: 87,
    tableOfContents: [
      {
        title: "Pre-Departure Planning",
        items: [
          "Essential Documents & Paperwork",
          "Health Insurance & Medical Preparations",
          "Financial Planning & Banking",
          "Home Management While Away",
          "Packing List for Extended Stay"
        ],
        preview: true
      },
      {
        title: "Arrival & Settlement",
        items: [
          "Airport Navigation & Transportation",
          "Temporary Accommodations",
          "Finding Long-Term Housing",
          "Setting Up Phone & Internet",
          "Local Area Orientation"
        ],
        preview: false
      },
      {
        title: "Daily Living in Costa Rica",
        items: [
          "Shopping & Groceries Guide",
          "Transportation Options",
          "Healthcare Services Access",
          "Banking & Managing Money",
          "Communication & Language Tips"
        ],
        preview: true
      },
      {
        title: "Canadian-Specific Considerations",
        items: [
          "Provincial Health Coverage Limitations",
          "Tax Implications for Snowbirds",
          "Staying Connected to Canada",
          "Canadian Communities & Meetups",
          "Emergency Consular Services"
        ],
        preview: false
      },
      {
        title: "Regions & Cities Guide",
        items: [
          "Pacific Coast Options",
          "Central Valley Living",
          "Caribbean Coast Alternatives",
          "Popular Snowbird Communities",
          "Cost of Living Comparison"
        ],
        preview: false
      },
      {
        title: "Housing & Accommodation",
        items: [
          "Neighborhood Guide for Canadians",
          "Long-term Rental Guide",
          "Property Management Services",
          "Rental Contract Terms & Negotiations",
          "Security & Maintenance Considerations"
        ],
        preview: true
      },
      {
        title: "Canadian Communities",
        items: [
          "Established Expat Networks",
          "Regular Meetups & Events",
          "Canadian-Owned Businesses",
          "Cultural Integration Resources",
          "Online Forums & Social Groups"
        ],
        preview: false
      },
      {
        title: "Return to Canada Preparation",
        items: [
          "Timeline and Departure Checklist",
          "Property Closing Procedures",
          "Canadian Customs and Immigration",
          "Health Insurance Reactivation",
          "Home and Vehicle Reactivation"
        ],
        preview: true
      },
      {
        title: "Healthcare Information",
        items: [
          "Healthcare Facilities & Services",
          "Provincial Health Insurance Compatibility",
          "Prescription Medication Guide",
          "Medical Emergency Protocol",
          "Travel Insurance Recommendations"
        ],
        preview: true
      },
      {
        title: "Financial Management",
        items: [
          "Banking Options for Canadians",
          "Currency Strategy & Exchange",
          "Cost of Living Breakdown",
          "Tax Implications for Snowbirds",
          "Financial Record-Keeping"
        ],
        preview: true
      }
    ],
    includedFeatures: [
      "Comprehensive 3-month living plan",
      "Detailed cost breakdown by region & lifestyle",
      "Healthcare facilities with English-speaking staff",
      "Provincial health insurance coverage by province",
      "Prescription medication availability & alternatives",
      "Medical emergency protocols with key Spanish phrases",
      "Canadian-friendly banking options & ATM maps",
      "Currency exchange strategies to minimize fees",
      "Cost comparison charts vs. Florida & Canadian cities",
      "Tax residency guidance & documentation requirements",
      "Legal residency requirements",
      "Neighborhood guide with Canadian population density maps",
      "Long-term rental contracts and negotiation strategies",
      "Property management services during absence",
      "Required documentation for foreign renters",
      "Seasonal price variations and negotiation tips",
      "Canadian expat community listings and meetups",
      "Return to Canada 8-week countdown checklist",
      "Canadian customs declaration guidance",
      "Provincial health insurance reactivation guide",
      "Home reactivation procedures for Canadian properties",
      "Financial transition strategies when returning home",
      "Transportation options & recommendations",
      "Climate data for different regions",
      "Monthly budget templates with seasonal adjustments",
      "Canadian community meetup information"
    ],
    testimonials: [
      {
        id: "1",
        name: "Margaret Wilson",
        location: "Ontario",
        image: "/testimonials/testimonial-1.jpg",
        text: "This guide saved us thousands on our first winter in Costa Rica. The provincial healthcare coverage section alone was worth the price - we had no idea about the specific limitations for Ontario residents.",
        rating: 5
      },
      {
        id: "2",
        name: "Robert Campbell",
        location: "Alberta",
        image: "/testimonials/testimonial-2.jpg",
        text: "The healthcare section is absolutely invaluable. The guide's clear explanation of Alberta health coverage limitations and the listing of English-speaking clinics saved us tremendous stress when my wife needed medical attention during our stay.",
        rating: 5
      },
      {
        id: "3",
        name: "Susan Miller",
        location: "British Columbia",
        image: "/testimonials/testimonial-3.jpg",
        text: "The cost breakdowns and banking sections saved us so much money. The guide's recommendations on Canadian bank partnerships and currency exchange strategies alone saved us over $600 in fees during our three-month stay.",
        rating: 5
      },
      {
        id: "4",
        name: "James and Linda Peterson",
        location: "Manitoba",
        image: "/testimonials/testimonial-4.jpg",
        text: "The housing and neighborhood guide was spot-on! We selected a perfect area based on the Canadian population density map, and the rental contract negotiation tips saved us nearly $1,200 on our 3-month lease. The property management section also helped us find someone to look after our condo while we visited family back home.",
        rating: 5
      }
    ],
    faqs: [
      {
        question: "Is this guide updated regularly?",
        answer: "Yes, the guide is updated quarterly to ensure all information remains current, including legal requirements, healthcare options, and community resources."
      },
      {
        question: "How is this different from free online resources?",
        answer: "Unlike scattered online information, this guide is specifically tailored for Canadian snowbirds with province-specific details, tax implications, and healthcare coverage information that's rarely found in general travel guides."
      },
      {
        question: "Do I get lifetime access to updates?",
        answer: "Yes, your one-time purchase includes lifetime access to all future updates of this guide, ensuring you always have the most current information for your travels."
      },
      {
        question: "Is there a refund policy?",
        answer: "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with the guide, we'll refund your purchase."
      },
      {
        question: "How detailed is the healthcare information?",
        answer: "Very comprehensive. The guide includes province-by-province coverage details, a directory of English-speaking medical facilities, prescription medication equivalents, and step-by-step emergency protocols with Spanish phrases."
      },
      {
        question: "How detailed is the housing and accommodation information?",
        answer: "Extremely comprehensive. The guide includes neighborhood-by-neighborhood analysis with Canadian population density maps, detailed rental contract templates and negotiation strategies, property management service listings, and Canadian expat community resources. We even include building-specific security recommendations and sample lease agreements customized for Canadian snowbirds."
      },
      {
        question: "Can I download the guide as a PDF?",
        answer: "Yes, the guide is delivered as a downloadable PDF that you can view on any device or print for your convenience."
      },
      {
        question: "Does the guide address tax implications for Canadian snowbirds?",
        answer: "Yes, the guide includes detailed tax information including Canadian residency requirements, CRA documentation needs, local tax obligations in Costa Rica, applicable tax treaties, and record-keeping recommendations. However, we recommend consulting with a tax professional for your specific situation."
      },
      {
        question: "Does this include visa information?",
        answer: "Absolutely! The guide includes detailed visa requirements and application processes specifically for Canadian citizens, including the latest updates on stay duration limits."
      }
    ],
    healthcareContent: {
      title: "Healthcare Information",
      subtitle: "Provincial Health Insurance Compatibility",
      content: `
        <h3>Understanding Provincial Health Coverage While Abroad</h3>
        
        <p>As a Canadian snowbird in Costa Rica, it's essential to understand exactly how your provincial health insurance coverage works while abroad. Coverage varies significantly between provinces, and proper documentation is crucial for successful claims.</p>
        
        <h4>Province-by-Province Coverage Details</h4>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-blue-200 mb-6">
            <thead class="bg-blue-50">
              <tr>
                <th class="border border-blue-200 px-4 py-2 text-left">Province/Territory</th>
                <th class="border border-blue-200 px-4 py-2 text-left">Maximum Coverage Period</th>
                <th class="border border-blue-200 px-4 py-2 text-left">Coverage Amount</th>
                <th class="border border-blue-200 px-4 py-2 text-left">Special Requirements</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-blue-200 px-4 py-2 font-medium">Ontario (OHIP)</td>
                <td class="border border-blue-200 px-4 py-2">212 days (7 months)</td>
                <td class="border border-blue-200 px-4 py-2">Up to $400 CAD per day for inpatient services; $50 CAD for outpatient</td>
                <td class="border border-blue-200 px-4 py-2">Must maintain physical presence in Ontario for 153 days in any 12-month period</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-blue-200 px-4 py-2 font-medium">British Columbia (MSP)</td>
                <td class="border border-blue-200 px-4 py-2">Up to 7 months</td>
                <td class="border border-blue-200 px-4 py-2">Up to $75 CAD per day for emergency inpatient care</td>
                <td class="border border-blue-200 px-4 py-2">Must be physically present in BC for 6 months per calendar year</td>
              </tr>
              <tr>
                <td class="border border-blue-200 px-4 py-2 font-medium">Alberta (AHCIP)</td>
                <td class="border border-blue-200 px-4 py-2">Up to 6 months</td>
                <td class="border border-blue-200 px-4 py-2">Very limited emergency coverage</td>
                <td class="border border-blue-200 px-4 py-2">Must notify Alberta Health of absence if over 6 months</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-blue-200 px-4 py-2 font-medium">Quebec (RAMQ)</td>
                <td class="border border-blue-200 px-4 py-2">Up to 183 days</td>
                <td class="border border-blue-200 px-4 py-2">Up to $100 CAD per day for hospitalization; $50 CAD for outpatient</td>
                <td class="border border-blue-200 px-4 py-2">Must inform RAMQ of temporary absence; special rules apply</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Critical Information for All Canadian Snowbirds</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>Provincial health plans typically cover only a small fraction of international healthcare costs. Comprehensive travel insurance is <strong>absolutely essential</strong> regardless of your province of residence.</p>
              </div>
            </div>
          </div>
        </div>

        <h4>Required Documentation for Claims</h4>
        
        <p>When seeking reimbursement from your provincial plan for medical care received in Costa Rica, you'll need to submit:</p>
        
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Detailed receipts and invoices</strong> - Must include a breakdown of all services provided</li>
          <li><strong>Medical reports and documentation</strong> - Translated to English/French (province dependent)</li>
          <li><strong>Proof of travel dates</strong> - Boarding passes, passport stamps</li>
          <li><strong>Completed claim forms</strong> - Specific to your provincial health plan</li>
          <li><strong>Physician's statement</strong> - Explaining why care was medically necessary</li>
        </ul>
        
        <h4>Provincial Claim Submission Process</h4>

        <ol class="list-decimal pl-5 mb-6 space-y-2">
          <li>Collect all documentation while still in Costa Rica (much harder to obtain after returning)</li>
          <li>Have all Spanish documents professionally translated if required by your province</li>
          <li>Complete the out-of-country claim form from your provincial health authority</li>
          <li>Submit your claim within the specified timeframe (typically 12 months, but varies by province)</li>
          <li>Retain copies of all submitted documents</li>
          <li>Follow up if you haven't received reimbursement within the expected timeframe (typically 6-8 weeks)</li>
        </ol>

        <div class="bg-blue-50 p-5 border border-blue-100 rounded-lg">
          <h5 class="font-bold text-blue-800 mb-2">Canadian Snowbird Insight:</h5>
          <p class="text-blue-800">Most provincial health insurance plans cover less than 10% of the actual costs of care abroad. For example, a $5,000 USD hospital visit might only be reimbursed at $400 CAD by your provincial plan. <strong>Always purchase comprehensive travel insurance that specifically covers your entire stay duration.</strong></p>
          
          <div class="mt-4 pt-4 border-t border-blue-200">
            <p class="font-medium text-blue-700">Complete details for all provinces and territories, including claim forms and contact information, are provided in the full guide.</p>
          </div>
        </div>
      `
    },
    housingContent: {
      title: "Housing & Accommodation",
      subtitle: "Neighborhood Guide for Canadians",
      content: `
        <h3>Top 5 Neighborhoods for Canadian Snowbirds in Costa Rica</h3>
        
        <p>Choosing the right neighborhood is one of the most important decisions for your extended stay. This section highlights areas with established Canadian communities, optimal amenities, and reliable infrastructure.</p>
        
        <div class="relative mb-6 border border-blue-200 rounded-lg overflow-hidden">
          <div class="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md z-10">
            <div class="text-xs text-blue-700 font-medium">Full neighborhood map in complete guide</div>
          </div>
          <div class="bg-blue-50 p-3 h-64 flex items-center justify-center text-blue-800 relative">
            <div class="absolute inset-0 opacity-40" style="background-image: url('/images/costa-rica-map.jpg'); background-position: center; background-size: cover;"></div>
            <div class="bg-white/50 backdrop-blur-sm p-6 rounded-md shadow-md text-center relative">
              <div class="flex justify-center mb-4">
                <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-800">Interactive neighborhood map with Canadian population density overlay</p>
              <p class="text-xs text-gray-600 mt-2">Complete with safety ratings, price comparisons, and proximity scores</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-6 mb-8">
          <div class="border border-blue-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div class="bg-blue-50 p-3 border-b border-blue-200">
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-blue-800">1. Escazú (San José Province)</h4>
                <div class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Highest Canadian Population
                </div>
              </div>
            </div>
            <div class="p-4">
              <div class="flex flex-wrap gap-3 mb-3">
                <div class="text-xs bg-blue-50 px-2 py-1 rounded-full text-blue-700">CDN Population: High</div>
                <div class="text-xs bg-green-50 px-2 py-1 rounded-full text-green-700">Safety: Excellent</div>
                <div class="text-xs bg-amber-50 px-2 py-1 rounded-full text-amber-700">Cost: $$$-$$$$</div>
                <div class="text-xs bg-purple-50 px-2 py-1 rounded-full text-purple-700">English: Widely Spoken</div>
              </div>
              
              <h5 class="font-medium text-gray-900 mb-2">Pros:</h5>
              <ul class="list-disc pl-5 mb-3 text-sm space-y-1">
                <li>Large established Canadian and international expat community</li>
                <li>Excellent infrastructure with reliable Internet and utilities</li>
                <li>Modern shopping centers with familiar brands and imports</li>
                <li>High concentration of English-speaking services and businesses</li>
                <li>Close to CIMA hospital (JCI-accredited with Canadian-trained doctors)</li>
              </ul>
              
              <h5 class="font-medium text-gray-900 mb-2">Cons:</h5>
              <ul class="list-disc pl-5 mb-3 text-sm space-y-1">
                <li>Higher cost of living compared to other areas</li>
                <li>More commercialized, less "authentic" Costa Rican experience</li>
                <li>Traffic congestion during rush hours</li>
                <li>30-45 minutes from beaches (day trips only)</li>
              </ul>
              
              <h5 class="font-medium text-gray-900 mb-2">Price Range (3-month lease):</h5>
              <ul class="list-disc pl-5 mb-0 text-sm">
                <li><strong>Budget:</strong> $1,200-1,500/month for 1-2BR apartment</li>
                <li><strong>Mid-range:</strong> $1,800-2,500/month for 2-3BR condo/house</li>
                <li><strong>Luxury:</strong> $3,000-5,000+/month for upscale home with views</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3>Long-term Rental Guide for Canadian Snowbirds</h3>
          
        <p>Understanding the local rental market and legal requirements is essential for a successful stay. This section covers everything you need to know about securing appropriate accommodations in Costa Rica.</p>
        
        <h4>Rental Contract Terms & Documentation</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 class="font-bold text-blue-800 mb-2">Required Documentation for Foreign Renters</h5>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Passport</strong> - Valid for at least 6 months beyond stay</li>
              <li><strong>Proof of Income</strong> - Bank statements or pension documentation</li>
              <li><strong>References</strong> - Previous landlord contact information</li>
              <li><strong>Local Contact</strong> - Sometimes required for emergency purposes</li>
              <li><strong>Travel Insurance</strong> - Often requested by property management</li>
            </ul>
          </div>
          
          <div>
            <h5 class="font-bold text-blue-800 mb-2">Typical Rental Terms for Snowbirds</h5>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Lease Duration:</strong> 3-6 month terms common for snowbirds</li>
              <li><strong>Deposit:</strong> Usually 1-2 months' rent, returned upon inspection</li>
              <li><strong>Payment:</strong> Often requested in USD, sometimes in colones</li>
              <li><strong>Utilities:</strong> Typically not included except for luxury rentals</li>
              <li><strong>Maintenance:</strong> Minor repairs often tenant responsibility</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800">Important Contract Tip for Canadians</h3>
              <div class="mt-2 text-sm text-amber-700">
                <p>Always request a bilingual (English/Spanish) contract. While verbal agreements might be common, they offer no legal protection. The full guide includes a sample bilingual rental agreement template specifically designed for Canadian snowbirds that protects your interests under Costa Rican law.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border border-blue-100 rounded-lg overflow-hidden mb-6">
          <div class="bg-blue-50 p-3 border-b border-blue-100">
            <h4 class="font-bold text-blue-800">Seasonal Price Variations & Negotiation Tips</h4>
          </div>
          <div class="p-4">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse mb-4">
                <thead>
                  <tr class="bg-blue-50">
                    <th class="border border-blue-200 px-3 py-2 text-left">Season</th>
                    <th class="border border-blue-200 px-3 py-2 text-left">Price Impact</th>
                    <th class="border border-blue-200 px-3 py-2 text-left">Negotiation Leverage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-blue-200 px-3 py-2 font-medium">High Season<br/>(Dec-April)</td>
                    <td class="border border-blue-200 px-3 py-2">30-50% premium</td>
                    <td class="border border-blue-200 px-3 py-2">Limited - high demand period</td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="border border-blue-200 px-3 py-2 font-medium">Green Season<br/>(May-Nov)</td>
                    <td class="border border-blue-200 px-3 py-2">15-30% discount</td>
                    <td class="border border-blue-200 px-3 py-2">Strong - longer stays very appealing</td>
                  </tr>
                  <tr>
                    <td class="border border-blue-200 px-3 py-2 font-medium">Holiday Weeks<br/>(Christmas, Easter)</td>
                    <td class="border border-blue-200 px-3 py-2">50-100% premium</td>
                    <td class="border border-blue-200 px-3 py-2">Very limited - avoid if possible</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h5 class="font-medium text-gray-900 mb-2">Effective Negotiation Strategies:</h5>
            <ul class="list-disc pl-5 text-sm">
              <li><strong>Book longer stays</strong> - 3+ month commitments often qualify for 20-30% discounts</li>
              <li><strong>Pay upfront</strong> - Some landlords offer 10-15% discount for full payment in advance</li>
              <li><strong>Offer currency stability</strong> - USD payments preferred by many landlords</li>
              <li><strong>Demonstrate reliability</strong> - References and professionalism go far</li>
              <li><strong>Leverage off-peak timing</strong> - Green season bookings have much more flexibility</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-blue-50 p-5 border border-blue-100 rounded-lg">
          <h5 class="font-bold text-blue-800 mb-2">Canadian Snowbird Insight:</h5>
          <p class="text-blue-800">The most successful rental strategy is booking in advance for green season stays. If your schedule allows, consider an early November arrival and stay through February to get the best blend of good weather, lower rates, and avoid the December premium pricing. Many Canadian snowbirds save 25-40% using this approach compared to high-season-only rates.</p>
          
          <div class="mt-4 pt-4 border-t border-blue-200">
            <p class="font-medium text-blue-700">The complete guide includes detailed property management contacts, neighborhood-specific rental rate tables, and customizable rental agreement templates in both English and Spanish with Canadian-specific legal protections.</p>
          </div>
        </div>
      `
    },
    financialContent: {
      title: "Financial Management",
      subtitle: "Cost of Living & Banking",
      content: `
        <h3>Cost of Living Comparison: Costa Rica vs. Canada & Florida</h3>
        
        <p>Understanding the true cost of living as a Canadian snowbird in Costa Rica helps you budget effectively and maximize your experience. This section provides detailed cost breakdowns for different lifestyle levels and compares them to familiar Canadian cities and Florida alternatives.</p>
        
        <h4>Monthly Budget Comparison (in CAD)</h4>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-blue-200 mb-6">
            <thead class="bg-blue-50">
              <tr>
                <th class="border border-blue-200 px-4 py-2 text-left">Expense Category</th>
                <th class="border border-blue-200 px-4 py-2 text-center">Costa Rica<br/>(Budget)</th>
                <th class="border border-blue-200 px-4 py-2 text-center">Costa Rica<br/>(Moderate)</th>
                <th class="border border-blue-200 px-4 py-2 text-center">Costa Rica<br/>(Luxury)</th>
                <th class="border border-blue-200 px-4 py-2 text-center">Florida<br/>(Moderate)</th>
                <th class="border border-blue-200 px-4 py-2 text-center">Toronto<br/>(Moderate)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-blue-200 px-4 py-2 font-medium">Housing (2BR)</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$800</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$1,500</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$2,800</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$3,200</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$2,800</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-blue-200 px-4 py-2 font-medium">Utilities</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$120</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$180</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$250</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$350</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$280</td>
              </tr>
              <tr>
                <td class="border border-blue-200 px-4 py-2 font-medium">Groceries</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$400</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$600</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$800</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$700</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$800</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-blue-200 px-4 py-2 font-medium">Dining Out</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$300</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$600</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$1,200</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$900</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$1,000</td>
              </tr>
              <tr>
                <td class="border border-blue-200 px-4 py-2 font-medium">Transportation</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$150</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$450</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$800</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$700</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$500</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-blue-200 px-4 py-2 font-medium">Entertainment</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$200</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$400</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$800</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$700</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$600</td>
              </tr>
              <tr>
                <td class="border border-blue-200 px-4 py-2 font-medium">Healthcare</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$100</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$200</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$350</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$500</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$100</td>
              </tr>
              <tr class="bg-gray-50 font-bold">
                <td class="border border-blue-200 px-4 py-2">TOTAL (Monthly)</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$2,070</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$3,930</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$7,000</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$7,050</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$6,080</td>
              </tr>
              <tr class="bg-green-50 font-bold">
                <td class="border border-blue-200 px-4 py-2">3-Month Total</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$6,210</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$11,790</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$21,000</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$21,150</td>
                <td class="border border-blue-200 px-4 py-2 text-center">$18,240</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800">Significant Savings Potential</h3>
              <div class="mt-2 text-sm text-amber-700">
                <p>Even at a moderate lifestyle level, Costa Rica can offer savings of approximately <strong>$9,000-$9,500 CAD per 3-month stay</strong> compared to Florida, while maintaining a comfortable standard of living.</p>
              </div>
            </div>
          </div>
        </div>

        <h4>Banking Options for Canadians</h4>

        <p>Managing your finances effectively requires understanding your banking options as a Canadian in Costa Rica:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="border border-blue-200 rounded-lg p-4">
            <h5 class="font-bold text-blue-800 mb-2">Canadian Banks with Costa Rica Partnerships</h5>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Scotiabank</strong> - Full service branches in major cities with preferred rates for Canadian account holders</li>
              <li><strong>RBC Royal Bank</strong> - Partner network with BAC San José offering reduced fees</li>
              <li><strong>TD Canada Trust</strong> - Global Alliance with no-fee ATM withdrawals at Banco Nacional</li>
            </ul>
          </div>
          
          <div class="border border-blue-200 rounded-lg p-4">
            <h5 class="font-bold text-blue-800 mb-2">Local Banks for Canadians</h5>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Banco Nacional</strong> - Largest network, English services in tourist areas</li>
              <li><strong>Banco de Costa Rica</strong> - Good exchange rates, some English service</li>
              <li><strong>BAC San José</strong> - Modern online banking with English interface</li>
            </ul>
          </div>
        </div>
          
        <div class="bg-blue-50 p-5 border border-blue-100 rounded-lg mb-8">
          <h5 class="font-bold text-blue-800 mb-2">Canadian Snowbird Insight:</h5>
          <p class="text-blue-800">The most cost-effective banking strategy is a combination approach: maintain your Canadian account with a bank that has Costa Rican partnerships (like Scotiabank), use credit cards with no foreign transaction fees for major purchases, and withdraw larger amounts less frequently from ATMs to minimize fees.</p>
          
          <div class="mt-4 pt-4 border-t border-blue-200">
            <p class="font-medium text-blue-700">The full guide includes comprehensive details on all banking options, recommended credit cards for Canadians abroad, and step-by-step instructions for setting up local accounts if desired.</p>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-6 mt-6">
          <p class="text-sm text-gray-500 italic mb-2">Disclaimer: The financial information provided is for general guidance only and is current as of our latest quarterly update. Currency exchange rates fluctuate daily, and individual experiences may vary. We recommend consulting with a financial advisor for personalized advice relevant to your specific situation.</p>
        </div>
      `
    },
    returnToCanadaContent: {
      title: "Return to Canada Preparation",
      subtitle: "Your Complete Departure & Homecoming Plan",
      content: `
        <h3>Timeline and Departure Checklist</h3>
        
        <p>Preparing for your return to Canada requires careful planning and organization. Use our comprehensive 8-week countdown checklist to ensure a smooth transition from Costa Rica back to your Canadian home.</p>
        
        <div class="bg-blue-50 p-5 border border-blue-100 rounded-lg mb-6">
          <h4 class="font-bold text-blue-800 mb-3">8-Week Departure Countdown</h4>
          
          <div class="space-y-4">
            <div>
              <h5 class="font-medium text-blue-700">8 Weeks Before Departure</h5>
              <ul class="text-blue-800 pl-5 list-disc space-y-1">
                <li>Book return flights (consider weather patterns and high/low season pricing)</li>
                <li>Notify landlord of departure date in writing</li>
                <li>Schedule property inspection and damage deposit return</li>
                <li>Begin researching import regulations for any significant purchases</li>
                <li>Contact Canadian home service providers to schedule reactivation</li>
              </ul>
            </div>
            
            <div>
              <h5 class="font-medium text-blue-700">6 Weeks Before Departure</h5>
              <ul class="text-blue-800 pl-5 list-disc space-y-1">
                <li>Schedule any final medical appointments in Costa Rica</li>
                <li>Request copies of all medical records if treatments were received</li>
                <li>Begin inventory of items being shipped/transported back</li>
                <li>Research mail forwarding options for any remaining mail</li>
                <li>Start organizing documents and receipts for Canadian taxes</li>
              </ul>
            </div>
            
            <div>
              <h5 class="font-medium text-blue-700">4 Weeks Before Departure</h5>
              <ul class="text-blue-800 pl-5 list-disc space-y-1">
                <li>Begin cancelling local services (internet, utilities, subscriptions)</li>
                <li>Make arrangements for any vehicle storage or sale</li>
                <li>Schedule property management services if leaving possessions</li>
                <li>Begin closure of any local bank accounts or transfer funds</li>
                <li>Inventory household items for storage or disposal</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-blue-200">
            <p class="font-medium text-blue-700">The full guide includes detailed, printable checklists for each timeframe with additional customized recommendations based on your specific situation and province of residence.</p>
          </div>
        </div>
        
        <h3>Canadian Customs and Immigration</h3>
        
        <p>Understanding your rights and obligations when returning to Canada is essential for a smooth reentry process, especially when bringing back goods purchased during your stay.</p>
        
        <h4>Current Customs Regulations</h4>
        
        <div class="border rounded-lg p-4 mb-6">
          <h5 class="font-medium mb-2">Duty-Free Personal Exemptions (as of 2025):</h5>
          <ul class="space-y-2">
            <li>
              <span class="font-medium">After 24+ hours absence:</span>
              <span class="text-gray-700"> Up to CAD$200 in goods</span>
            </li>
            <li>
              <span class="font-medium">After 48+ hours absence:</span>
              <span class="text-gray-700"> Up to CAD$800 in goods</span>
            </li>
            <li>
              <span class="font-medium">After 7+ days absence:</span>
              <span class="text-gray-700"> Up to CAD$800 in goods</span>
            </li>
            <li>
              <span class="font-medium">Alcohol allowance:</span>
              <span class="text-gray-700"> 1.5L wine OR 1.14L alcoholic beverages OR 8.5L of beer</span>
            </li>
            <li>
              <span class="font-medium">Tobacco allowance:</span>
              <span class="text-gray-700"> 200 cigarettes, 50 cigars, 200g manufactured tobacco</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Prohibited and Restricted Items</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>Certain items from Costa Rica face strict import restrictions or prohibitions when returning to Canada, including:</p>
                <ul class="list-disc pl-5 mt-2">
                  <li>Some agricultural products (fruits, plants, seeds)</li>
                  <li>Certain wood products without proper certification</li>
                  <li>Wildlife products (shells, coral, feathers)</li>
                  <li>Meat products and certain food items</li>
                  <li>Cultural artifacts without proper documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <h4>Declaration Requirements</h4>
        
        <p>All returning Canadian residents must complete the CBSA Declaration Card (Form E311) before arrival at Canadian Customs. You must declare:</p>
        
        <ul class="list-disc pl-5 mb-4">
          <li>All goods purchased or acquired while abroad, including gifts</li>
          <li>Repairs or alterations to items you took with you</li>
          <li>Items you're bringing for someone else</li>
          <li>Commercial goods (regardless of value)</li>
          <li>Currency or monetary instruments of CAD$10,000 or more</li>
        </ul>
        
        <h3>Health and Insurance Transition</h3>
        
        <p>Returning to the Canadian healthcare system after months abroad requires specific steps to ensure continuous coverage and proper medical follow-up.</p>
        
        <h4>Provincial Health Insurance Reactivation</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="border rounded-lg overflow-hidden">
            <div class="bg-blue-50 p-3 border-b border-blue-100">
              <h5 class="font-bold">Immediate Coverage Provinces</h5>
            </div>
            <div class="p-4">
              <p class="text-sm mb-2">If you've been absent within your province's allowable time limits (typically 6-7 months), coverage resumption is automatic upon return for:</p>
              <ul class="text-sm space-y-1">
                <li>• British Columbia</li>
                <li>• Alberta</li>
                <li>• Saskatchewan</li>
                <li>• Manitoba</li>
                <li>• Ontario</li>
                <li>• Quebec (if pre-registered)</li>
              </ul>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <div class="bg-blue-50 p-3 border-b border-blue-100">
              <h5 class="font-bold">Waiting Period Provinces</h5>
            </div>
            <div class="p-4">
              <p class="text-sm mb-2">If you've exceeded your province's allowable absence period, you may face a waiting period for coverage reinstatement:</p>
              <ul class="text-sm space-y-1">
                <li>• Ontario: Up to 3 months if OHIP eligibility was lost</li>
                <li>• British Columbia: Up to 3 months if residency was affected</li>
                <li>• Quebec: Up to 3 months if RAMQ registration was not maintained</li>
                <li>• Other provinces: Varies by situation and length of absence</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h4>Home Reactivation</h4>
        
        <p>Returning to your Canadian home after months away requires careful planning to ensure everything is functioning properly upon your arrival.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h5 class="font-medium mb-2">Before Arriving</h5>
            <ul class="text-sm space-y-2">
              <li>• Contact property manager to prepare home</li>
              <li>• Schedule heating/cooling system activation</li>
              <li>• Arrange for cleaning service prior to arrival</li>
              <li>• Request mail hold termination from Canada Post</li>
              <li>• Schedule security system reactivation</li>
            </ul>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h5 class="font-medium mb-2">Upon Arrival</h5>
            <ul class="text-sm space-y-2">
              <li>• Inspect property for any damage or leaks</li>
              <li>• Check all pipes and faucets for proper function</li>
              <li>• Test all appliances before full use</li>
              <li>• Check smoke/CO detectors and replace batteries</li>
              <li>• Inspect for signs of pests or rodents</li>
            </ul>
          </div>
        </div>
        
        <h4>Financial Transition</h4>
        
        <p>Managing your financial transition back to Canada requires attention to several key areas:</p>
        
        <div class="border rounded-lg p-4 mb-6">
          <ul class="space-y-2">
            <li>
              <span class="font-medium">✓ Notify financial institutions of your return</span>
              <span class="text-gray-700"> (prevents fraud alerts on cards)</span>
            </li>
            <li>
              <span class="font-medium">✓ Update contact information and addresses</span>
              <span class="text-gray-700"> for all accounts and services</span>
            </li>
            <li>
              <span class="font-medium">✓ Review automatic payments and subscriptions</span>
              <span class="text-gray-700"> to restart any paused services</span>
            </li>
            <li>
              <span class="font-medium">✓ Check account statements</span>
              <span class="text-gray-700"> for any unauthorized transactions during absence</span>
            </li>
            <li>
              <span class="font-medium">✓ Update online banking security settings</span>
              <span class="text-gray-700"> including login information and alerts</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-blue-50 p-5 border border-blue-100 rounded-lg mt-6">
          <h5 class="font-bold text-blue-800 mb-2">Canadian Snowbird Insight:</h5>
          <p class="text-blue-800">Many snowbirds find it helpful to create a "Return to Canada" binder with separate sections for home management, healthcare, financial, and vehicle information. Include all contact details for service providers, account numbers, and a master checklist for your return process. This organized approach significantly reduces stress during the transition.</p>
          
          <div class="mt-4 pt-4 border-t border-blue-200">
            <p class="font-medium text-blue-700">The complete guide includes printable templates for all checklists, tracking sheets, and organizational systems tailored specifically for Canadian snowbirds returning from Costa Rica.</p>
          </div>
        </div>
      `
    },
    paymentMethods: ["Visa", "Mastercard", "American Express", "PayPal"]
  };
  
  useEffect(() => {
    document.title = `${guide.title} Preview | Deep Travel Collections`;
    window.scrollTo(0, 0);
  }, [guide.title]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `url(${guide.coverImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}></div>
        <div className="relative container mx-auto px-4 py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Cover Image */}
              <div className="md:w-1/3 flex-shrink-0">
                <div className="bg-white p-2 rounded-lg shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img 
                    src={guide.coverImage} 
                    alt={guide.title} 
                    className="w-full h-auto rounded object-cover aspect-[3/4] shadow-inner"
                  />
                </div>
              </div>
              
              {/* Guide Information */}
              <div className="md:w-2/3">
                <Badge className="bg-amber-500 text-white mb-3">PREVIEW</Badge>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 ${heading}`}>
                  {guide.title}
                </h1>
                <p className="text-xl text-white/90 mb-4">{guide.subtitle}</p>
                
                <div className="flex items-center mb-6">
                  <img 
                    src={guide.author.image} 
                    alt={guide.author.name} 
                    className="w-12 h-12 rounded-full border-2 border-white mr-4"
                  />
                  <div>
                    <div className="font-medium">{guide.author.name}</div>
                    <div className="text-sm text-white/80 flex items-center">
                      {guide.author.role} • <BadgeCheck className="h-4 w-4 mx-1 text-amber-300" /> {guide.author.credentials}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="text-white/90 mb-4">
                    Your comprehensive guide to enjoying life as a Canadian snowbird in Costa Rica, with specific provincial considerations, healthcare guidance, and community connections.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      <span className="text-sm">Quarterly updates</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-amber-400" />
                      <span className="text-sm">{guide.pageCount} pages</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-5 w-5 mr-2 text-blue-400" />
                      <span className="text-sm">PDF format</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <div className="mb-1 flex items-center">
                      {guide.previousPrice && (
                        <span className="text-white/70 line-through text-sm mr-2">
                          ${guide.previousPrice.toFixed(2)} {guide.priceCurrency}
                        </span>
                      )}
                      <span className="text-2xl font-bold">
                        ${guide.price.toFixed(2)} {guide.priceCurrency}
                      </span>
                      {guide.discountPercent && (
                        <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          SAVE {guide.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/60 mb-3">
                      One-time purchase, lifetime updates
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      size="lg"
                      className="font-medium bg-gradient-to-r from-amber-500 to-amber-600 border-0 hover:from-amber-600 hover:to-amber-700"
                      onClick={() => navigate(`/checkout?type=guide&id=${guide.id}`)}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Purchase Guide
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="font-medium border-white text-white hover:bg-white/20"
                    >
                      <Heart className="mr-2 h-5 w-5" />
                      Add to Wishlist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content - Main Preview */}
          <div className="lg:col-span-2">
            {/* Table of Contents */}
            <section className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${heading}`}>
                Table of Contents
              </h2>
              
              <Accordion type="single" collapsible className="border rounded-lg">
                {guide.tableOfContents.map((section, index) => (
                  <AccordionItem key={index} value={`section-${index}`} className={section.preview ? "bg-white" : "bg-gray-50"}>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center">
                        {section.preview ? (
                          <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                        ) : (
                          <LockIcon className="h-5 w-5 mr-3 text-gray-400" />
                        )}
                        <div>
                          <div className="text-left font-medium">{section.title}</div>
                          <div className="text-xs text-gray-500 text-left">
                            {section.preview ? "Preview available" : "Available after purchase"}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2">
                      <ul className="space-y-2 ml-9">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center text-gray-700">
                            <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      
                      {section.preview ? (
                        <div className="mt-4 ml-9">
                          <Button variant="link" className="p-0 h-auto text-blue-600 font-medium flex items-center">
                            View sample content
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center mt-4 ml-9 text-sm text-gray-500">
                          <LockIcon className="h-4 w-4 mr-2" />
                          Available after purchase
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>{guide.tableOfContents.length} major sections</div>
                <div>{guide.pageCount} total pages</div>
              </div>
            </section>
            
            {/* Sample Content Section */}
            <section className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${heading}`}>
                Sample Content
              </h2>
              
              {/* Content Type Selector */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-md border border-blue-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveContent('healthcare')}
                    className={`px-4 py-2 font-medium text-sm flex items-center ${
                      activeContent === 'healthcare' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Healthcare
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveContent('financial')}
                    className={`px-4 py-2 font-medium text-sm flex items-center ${
                      activeContent === 'financial' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Financial
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveContent('housing')}
                    className={`px-4 py-2 font-medium text-sm flex items-center ${
                      activeContent === 'housing' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Housing
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-50 p-4 border-b">
                  <div className="text-xs text-blue-500 font-medium uppercase tracking-wider mb-1">
                    Section Preview
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {activeContent === 'healthcare' 
                      ? guide.healthcareContent.title 
                      : activeContent === 'financial'
                        ? guide.financialContent.title
                        : guide.housingContent.title
                    }
                  </h3>
                  <div className="text-gray-600">
                    {activeContent === 'healthcare' 
                      ? guide.healthcareContent.subtitle 
                      : activeContent === 'financial'
                        ? guide.financialContent.subtitle
                        : guide.housingContent.subtitle
                    }
                  </div>
                </div>
                
                <div 
                  className="p-6 prose prose-blue max-w-none" 
                  dangerouslySetInnerHTML={{ 
                    __html: activeContent === 'healthcare' 
                      ? guide.healthcareContent.content 
                      : activeContent === 'financial'
                        ? guide.financialContent.content
                        : guide.housingContent.content
                  }}
                ></div>
                
                <div className="bg-gradient-to-b from-transparent to-white p-6 text-center relative">
                  <div className="absolute inset-0 flex items-end justify-center pb-20">
                    <div className="w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
                  </div>
                  <div className="relative border-t pt-6">
                    <LockIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-4">
                      The complete section is available in the full guide
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(`/checkout?type=guide&id=${guide.id}`)}>
                      Purchase to Continue Reading
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Testimonials */}
            <section className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${heading}`}>
                Canadian Snowbird Reviews
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Star Rating */}
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      
                      {/* Testimonial Text */}
                      <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                      
                      {/* User Info */}
                      <div className="flex items-center">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.location}, Canada</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* What's Included */}
            <div className="mb-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className={`text-xl font-bold mb-4 ${heading}`}>
                What's Included
              </h3>
              
              <ul className="space-y-3">
                {guide.includedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-blue-100">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate(`/checkout?type=guide&id=${guide.id}`)}
                >
                  Get Instant Access - ${guide.price.toFixed(2)}
                </Button>
                <div className="flex justify-center mt-3 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  30-day satisfaction guarantee
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="mb-8 p-4 border rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Secure Payment Methods:</h4>
              <div className="flex flex-wrap gap-2">
                {guide.paymentMethods.map((method) => (
                  <div key={method} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">
                    {method}
                  </div>
                ))}
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-4 ${heading}`}>
                Frequently Asked Questions
              </h3>
              
              <Accordion type="single" collapsible className="border rounded-lg">
                {guide.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="text-left font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-1">
                      <p className="text-gray-700 ml-7">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-4 text-center">
                <Button variant="link" className="text-blue-600">
                  Have more questions? Contact us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final CTA Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${heading}`}>
            Ready to Start Your Canadian Snowbird Journey?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Get instant access to our comprehensive guide with everything you need to know about spending your winter in Costa Rica as a Canadian snowbird.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="font-medium bg-gradient-to-r from-amber-500 to-amber-600 border-0 hover:from-amber-600 hover:to-amber-700"
              onClick={() => navigate(`/checkout?type=guide&id=${guide.id}`)}
            >
              <Download className="mr-2 h-5 w-5" />
              Purchase for ${guide.price.toFixed(2)} {guide.priceCurrency}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="font-medium border-white text-white hover:bg-white/20"
            >
              <Coffee className="mr-2 h-5 w-5" />
              Contact the Author
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-1 text-green-400" />
              Secure Checkout
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-1 text-amber-400" />
              Lifetime Updates
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-1 text-blue-400" />
              Written by TICO Certified Travel Professionals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// External components that would be imported in a real implementation
const ShoppingCart = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
};