import OpenAI from "openai";
import { db } from "../db";
import { snowbirdDestinations } from "@shared/schema";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY not found in environment variables!");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a detailed itinerary for a Canadian Snowbird destination
 */
export async function generateSnowbirdItinerary(destinationId: number): Promise<{ filePath: string, filename: string }> {
  try {
    // Fetch the destination information
    const [destination] = await db.select().from(snowbirdDestinations).where(eq(snowbirdDestinations.id, destinationId));
    
    if (!destination) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }
    
    // Check if we already have a cached itinerary file
    const folderPath = path.join(process.cwd(), 'public', 'downloads', 'snowbird-itineraries');
    const filename = `${destination.name.toLowerCase().replace(/\s+/g, '-')}-snowbird-itinerary.pdf`;
    const filePath = path.join(folderPath, filename);
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    // Return cached version if it exists
    if (fs.existsSync(filePath)) {
      return { filePath, filename };
    }
    
    console.log(`Generating itinerary for ${destination.name}, ${destination.country}`);
    
    // Generate the itinerary content with GPT-4o
    const prompt = `Create a comprehensive, detailed guide for Canadian snowbirds staying in ${destination.name}, ${destination.country} during winter months (December-February). This will be formatted as a professional travel guide PDF.
    
DESTINATION INFORMATION:
- Region: ${destination.region}
- Winter Climate: ${destination.avgWinterTemp}
- Cost Comparison to Florida: ${destination.costComparison}
- Healthcare Access & Quality: ${destination.healthcareAccess || "Information not available"}
- Visa Requirements for Canadians: ${destination.visaRequirements || "Information not available"}
- Canadian Expat Community: ${destination.canadianExpats || "Information not available"}

BACKGROUND CONTEXT:
Canadian "snowbirds" are typically retirees aged 55+ who travel south during winter months to escape the harsh Canadian climate. Traditionally, they flock to Florida, but many are now seeking alternative destinations due to rising costs, healthcare concerns, and desire for authentic cultural experiences. This guide should focus on how this destination provides a compelling alternative to Florida.

REQUIRED COMPONENTS (must include ALL of these sections while preserving any existing content):

1. EXECUTIVE SUMMARY (2-3 paragraphs)
   - Why ${destination.name} is an ideal alternative to Florida for Canadian snowbirds
   - Brief overview of climate, cost savings, and unique benefits
   - What makes this destination special compared to traditional snowbird locations

2. HEALTHCARE SYSTEM OVERVIEW
   - Structure of ${destination.name}'s healthcare system (public vs. private)
   - Quality ratings compared to Canadian standards
   - International accreditations and rankings
   - Accessibility for foreigners and temporary residents
   - Recent healthcare system improvements or changes
   
3. MEDICAL FACILITIES FOR CANADIANS
   - Top hospitals and clinics with international standards
   - Facilities with English-speaking staff
   - Specialized centers relevant to senior health needs
   - Regional variations in healthcare quality
   - Canadian-recommended medical providers

4. HEALTHCARE COSTS AND INSURANCE
   - Typical consultation costs with specialists
   - Common procedure costs compared to Canada (percentage savings)
   - Prescription medication costs and availability
   - Recommended insurance providers and coverage levels
   - Coordination with Canadian provincial health plans
   - Pre-existing condition considerations

5. EMERGENCY MEDICAL SERVICES
   - Local emergency numbers and how to call an ambulance
   - Typical response times in different regions
   - Emergency room procedures
   - Translation services in emergencies
   - Medical evacuation options and costs
   - Emergency medical phrases in local language

6. PROVINCIAL HEALTH INSURANCE COMPATIBILITY
   - Province-by-province coverage details
   - Maximum coverage periods by province
   - Required documentation for maintaining coverage
   - Application procedures for extended absences
   - Recent policy changes affecting travelers
   - Supplemental insurance recommendations

7. FINANCIAL MANAGEMENT
   - Banking options compatible with Canadian accounts
   - Best methods for currency exchange
   - ATM availability and withdrawal fees
   - Credit card acceptance and foreign transaction considerations
   - Digital payment options
   - Monthly budget breakdown for different lifestyle levels
   - Cost comparison with Florida and Canadian cities

8. TAX IMPLICATIONS
   - Canadian tax residency considerations
   - Local tax obligations for temporary residents
   - Tax treaties between Canada and ${destination.country}
   - Required documentation for Canadian tax filing
   - Recommendations for record-keeping
   - Potential tax advantages for Canadian snowbirds

9. HOUSING AND ACCOMMODATION
   - Long-term rental market overview
   - Popular neighborhoods for Canadian snowbirds
   - Typical rental contract terms and requirements
   - Furnished vs. unfurnished options
   - Seasonal price variations
   - Property management services during absence
   - Security considerations for vacant properties
   - Utility costs and connection procedures

10. LEGAL DOCUMENTATION
    - Visa requirements and application procedures
    - Maximum stay durations and renewal options
    - Required documentation for extended stays
    - Residency permit options for longer-term stays
    - Border run procedures (if applicable)
    - Legal assistance resources for Canadians
    - Power of attorney and will considerations

11. COMMUNICATIONS AND TECHNOLOGY
    - Mobile phone options and local SIM cards
    - Internet reliability and provider options
    - VPN recommendations for accessing Canadian content
    - Streaming service accessibility
    - Technology for staying connected with family in Canada
    - Online banking access considerations
    - Digital security recommendations

12. TRANSPORTATION OPTIONS
    - Direct flight options from major Canadian cities (Toronto, Vancouver, Montreal, Calgary)
    - Approximate flight times and typical costs
    - Airport transfer recommendations
    - Local transportation options (public transit, taxis, rideshare, rental cars)
    - Driving license requirements
    - Vehicle purchase/rental considerations for longer stays
    - Accessibility options for those with mobility issues
    - Transportation costs compared to Canada

13. CANADIAN COMMUNITIES
    - Established Canadian expat communities
    - Canadian clubs and organizations
    - Regular meetups and events
    - Online forums and resources
    - Canadian-owned businesses in the area
    - Cultural integration opportunities

14. 3-MONTH ITINERARY BREAKDOWN
    - Week-by-week suggestions organized to maximize enjoyment while allowing for a relaxed pace
    - For each week, include:
      * Suggested activities and sights appropriate for seniors
      * Local events or seasonal highlights during that time
      * Day trip opportunities
      * Notes about weather considerations for that specific week

15. DINING & FOOD
    - Overview of local cuisine with Canadian comparisons
    - Recommended restaurants across different price points and cuisines
    - Grocery shopping guide with typical prices and specialty stores for Canadian products
    - Tips for those with dietary restrictions
    - Local markets and food delivery services

16. SOCIAL ACTIVITIES & COMMUNITY INTEGRATION
    - Expat clubs and Canadian meetup groups
    - Classes and activities suitable for seniors (art, cooking, language, etc.)
    - Community centers and libraries with English materials
    - Religious services in English if applicable
    - Volunteer opportunities for temporary residents

17. RETURN TO CANADA PREPARATION
    - Timeline and checklist for departure
    - Property closing procedures
    - Service cancellation protocols
    - Banking considerations before departure
    - Customs and immigration considerations
    - Health insurance reactivation requirements

18. SEASONAL CONSIDERATIONS
    - Climate variations throughout winter months
    - High and low season timing and implications
    - Seasonal events and activities
    - Weather-related health considerations
    - Seasonal price fluctuations
    - Holiday period considerations

FORMAT GUIDELINES:
- Create clear, well-organized sections with descriptive headings
- Use bullet points and numbered lists for better readability
- Include specific names of places, organizations, and services when possible
- Ensure content is senior-friendly (larger font considerations, practical mobility advice)
- The tone should be informative, practical, and encouraging

This will be published as a premium PDF guide titled "Canadian Snowbird Guide to ${destination.name}: Your Complete 3-Month Winter Escape Plan" so ensure the content is comprehensive, accurate, and professionally presented.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an expert travel guide writer specializing in creating detailed itineraries for Canadian snowbirds escaping winter." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });
    
    const itineraryContent = response.choices[0].message.content || "Failed to generate itinerary content.";
    
    // Generate PDF
    await generatePDF(itineraryContent, destination, filePath);
    
    return { filePath, filename };
  } catch (error) {
    console.error("Error generating snowbird itinerary:", error);
    throw error;
  }
}

/**
 * Generates a PDF for the snowbird itinerary
 */
async function generatePDF(content: string, destination: any, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Canadian Snowbird Guide to ${destination.name}`,
          Author: 'Deep Travel Collections',
        }
      });
      
      // Create a write stream to save the PDF
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);
      
      // Add header with blue bar
      doc.rect(0, 0, doc.page.width, 40).fill('#1e40af');
      
      // Add destination info
      doc.fontSize(24)
        .fillColor('#ffffff')
        .text(`Canadian Snowbird Guide to ${destination.name}`, 50, 10, { align: 'center' });
      
      // Add hero image section with gradient background
      doc.rect(0, 40, doc.page.width, 120).fill('#e0f2fe');
      
      // Add location and subtitle
      doc.fontSize(16)
        .fillColor('#0f172a')
        .text(`${destination.name}, ${destination.country}`, 50, 50, { align: 'center' });
      
      doc.fontSize(12)
        .fillColor('#64748b')
        .text(`3-Month Detailed Itinerary for Winter Season`, 50, 75, { align: 'center' });
      
      // Add destination highlights
      doc.roundedRect(50, 100, doc.page.width - 100, 40, 5)
        .fill('#dbeafe');
      
      doc.fontSize(10)
        .fillColor('#1e40af')
        .text(`Winter Climate: ${destination.avgWinterTemp} | Cost: ${destination.costComparison} | Region: ${destination.region}`, 60, 110, { align: 'center', width: doc.page.width - 120 });
      
      // Add introduction
      doc.moveDown(4);
      doc.fontSize(11)
        .fillColor('#334155')
        .text(`This comprehensive guide provides a detailed 3-month itinerary for Canadian snowbirds looking to spend their winter in ${destination.name}. The guide includes accommodation recommendations, activities, dining options, healthcare information, and practical tips for a comfortable extended stay.`, {
          align: 'left',
          width: doc.page.width - 100,
        });
      
      // Add content divider
      doc.moveDown(2);
      doc.moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke('#cbd5e1');
      doc.moveDown(1);
      
      // Add body content - parse and format the AI-generated content
      const sections = content.split('\n\n');
      
      for (const section of sections) {
        if (section.trim().startsWith('#')) {
          // Handle headers
          const headerText = section.replace(/^#+\s+/, '').trim();
          doc.moveDown(1);
          doc.fontSize(14)
            .fillColor('#0f172a')
            .text(headerText, { align: 'left', underline: true });
          doc.moveDown(0.5);
        } else if (section.trim().startsWith('-') || section.trim().startsWith('*')) {
          // Handle bullet points
          const bulletPoints = section.split('\n').map(line => line.replace(/^[-*]\s+/, '').trim());
          for (const bullet of bulletPoints) {
            if (bullet) {
              doc.fontSize(10)
                .fillColor('#334155')
                .text(`• ${bullet}`, { align: 'left', indent: 10, width: doc.page.width - 120 });
            }
          }
        } else if (section.includes(':') && !section.includes('.')) {
          // Handle key-value pairs
          const [key, value] = section.split(':').map(s => s.trim());
          doc.fontSize(10)
            .fillColor('#0f172a')
            .text(key + ':', { continued: true, indent: 5 })
            .fillColor('#334155')
            .text(' ' + value);
        } else {
          // Regular paragraphs
          doc.fontSize(10)
            .fillColor('#334155')
            .text(section, { align: 'left', width: doc.page.width - 100 });
        }
      }
      
      // Add footer with page numbers
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        
        // Add blue bar at bottom
        doc.rect(0, doc.page.height - 30, doc.page.width, 30).fill('#1e40af');
        
        // Add page number and company info
        doc.fontSize(8)
          .fillColor('#ffffff')
          .text(
            `Deep Travel Collections | Canadian Snowbird Guide | Page ${i + 1} of ${pages.count}`,
            50,
            doc.page.height - 20,
            { align: 'center', width: doc.page.width - 100 }
          );
          
        // Add orange sidebar
        doc.rect(30, 40, 5, doc.page.height - 70).fill('#f97316');
      }
      
      // Finalize the PDF and end the stream
      doc.end();
      
      stream.on('finish', () => {
        resolve();
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}