/**
 * Standalone Itinerary Generator (TypeScript Version)
 * 
 * A simplified, robust solution for generating high-quality PDF itineraries
 * with a streamlined API.
 */

import { OpenAI } from 'openai';
import * as fs from 'fs-extra';
import * as PDFDocument from 'pdfkit';
import * as path from 'path';

// Define types
interface ItineraryContent {
  destination: string;
  country: string;
  content: string;
}

interface PDFOptions {
  size: string;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  info: {
    Title: string;
    Author: string;
    Subject: string;
    Keywords: string;
  };
}

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Main function to generate itinerary
export async function generateItinerary(destination: any): Promise<Buffer> {
  try {
    console.log(`Starting ${destination.name} itinerary generation...`);
    
    // Generate all content in one go with a very specific prompt
    const content = await generateDetailedContent(destination);
    
    // Create PDF
    const pdfBuffer = await createPDF({
      destination: destination.name,
      country: destination.country,
      content
    });
    
    console.log(`✓ Itinerary generated successfully for ${destination.name}`);
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}

// Generate detailed content
async function generateDetailedContent(destination: any): Promise<string> {
  const prompt = `
Create a PREMIUM 7-day travel itinerary for ${destination.name}, ${destination.country} with these EXACT requirements:

1. For EACH day, provide:
   - A specific theme (e.g., "Cultural Exploration")
   - MORNING activity with SPECIFIC attraction name, exact address, opening hours, entrance fee, and 1 insider tip
   - AFTERNOON activity with SPECIFIC attraction name, exact address, opening hours, entrance fee, and 1 insider tip
   - EVENING activity with SPECIFIC restaurant name, exact address, price range, signature dish, and whether reservations are needed

2. Include ONLY real, specific places with their EXACT names (never say "a local restaurant" or "a museum")

3. For each activity, include:
   - TRANSPORTATION: How to get there, including specific bus/train numbers or taxi estimates
   - DURATION: How long to spend there
   - DESCRIPTION: 2-3 sentences about what makes it special

4. Include one OFF-THE-BEATEN-PATH recommendation per day that most tourists don't know about

5. Add a PRACTICAL INFORMATION section with:
   - Three specific hotel recommendations (budget, mid-range, luxury) with actual names and price ranges
   - Local transportation options with costs
   - Emergency contacts (actual hospital names and police numbers)
   - 5 useful local phrases with pronunciation (USE ONLY LATIN ALPHABET, DO NOT USE NATIVE SCRIPTS)
   - Add a CURRENCY GUIDE section with current exchange rates to USD and common prices in both local currency and USD

IMPORTANT FORMATTING REQUIREMENTS:
1. DO NOT use asterisks (*) or double asterisks (**) ANYWHERE in your response
2. Use clean headings without formatting characters like "Morning: Attraction Name" (NOT "**Morning**")
3. Use proper heading hierarchy with # for main sections and ## for subsections
4. Instead of writing "**Opening Hours:**", just write "Opening Hours:" (no asterisks)
5. Use clear section breaks between day sections
6. Keep text clean and focused - absolutely no markdown formatting characters like *asterisks* or **double asterisks**
7. For all prices, show both local currency AND approximate USD amount in parentheses, e.g. "IDR 80,000 (~$5 USD)"
8. IMPORTANT: For local phrases, ONLY use Latin alphabet with pronunciation guide, NOT native script characters
9. Only use standard English characters and punctuation (no special characters from other languages)
10. NEVER use quotation marks around labels like address, opening hours, etc.

Format everything with clear headings and ensure all information is accurate and specific to ${destination.name}, ${destination.country}.
`;

  try {
    console.log(`Generating content for ${destination.name} with a direct, comprehensive prompt...`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: `You are a premium travel guide creator specializing in detailed ${destination.name}, ${destination.country} itineraries with these skills:
1. You ONLY provide specific, named locations with exact details - never generic descriptions
2. You are an expert at currency conversion and always show prices in both local currency and USD equivalent
3. You have extensive knowledge of current exchange rates
4. You create beautiful, easy-to-read content with proper headings and formatting
5. You help travelers understand local costs by providing clear price comparisons
6. You ALWAYS romanize non-Latin words and phrases, NEVER using native script characters
7. You ONLY use standard ASCII characters (a-z, A-Z, 0-9, standard punctuation) in your output
8. You NEVER use asterisks (*) or double asterisks (**) anywhere in your output
9. You NEVER use quotation marks around labels like "Address:" - just write them directly
10. You format headings with # and ## symbols only, not with any other formatting characters` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    
    if (!response.choices[0].message.content) {
      throw new Error("OpenAI returned empty content");
    }
    
    // Clean up content to remove any remaining asterisks or markdown formatting
    let cleanContent = response.choices[0].message.content
      .replace(/\*\*/g, '') // Remove double asterisks (bold)
      .replace(/\*/g, '')   // Remove single asterisks (italic)
      .replace(/"([A-Z][a-z]+:)"/g, '$1') // Remove quotes around labels
      .replace(/"Address:"/g, 'Address:')
      .replace(/"Opening Hours:"/g, 'Opening Hours:')
      .replace(/"Entrance Fee:"/g, 'Entrance Fee:')
      .replace(/"Insider Tip:"/g, 'Insider Tip:')
      .replace(/"Transportation:"/g, 'Transportation:')
      .replace(/"Duration:"/g, 'Duration:')
      .replace(/"Description:"/g, 'Description:');
      
    return cleanContent;
  } catch (error) {
    console.error(`Error generating content for ${destination.name}:`, error);
    throw error;
  }
}

// Create PDF document
async function createPDF(data: ItineraryContent): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const options: PDFOptions = {
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `${data.destination} Travel Itinerary`,
          Author: 'Deep Travel Collections',
          Subject: 'Premium Travel Itinerary',
          Keywords: `travel, ${data.destination}, itinerary, premium`
        }
      };
      
      const doc = new PDFDocument(options);
      
      // Instead of writing to file, we'll collect buffer chunks
      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(Buffer.from(chunk)));
      
      // Add title page with solid background
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fill('#0077be');
      
      // Add accent stripe at the top
      doc.rect(0, doc.page.height - 40, doc.page.width, 40)
         .fill('#00b0f0');
      
      // Add decorative accent on left side
      doc.rect(0, 0, 20, doc.page.height)
         .fill('#FF6B35');
      
      // Add white content area
      const margin = 50;
      
      // Shadow effect
      doc.rect(margin + 5, margin - 5, doc.page.width - (margin * 2), doc.page.height - (margin * 2))
         .fill('#d9d9d9');
      
      // Main white content area
      doc.rect(margin, margin, doc.page.width - (margin * 2), doc.page.height - (margin * 2))
         .fill('white');
      
      // Add title content
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#FF6B35')
         .text('PREMIUM', margin + 50, margin + 100, { align: 'left' });
      
      doc.moveDown(0.5);
      doc.fontSize(36)
         .fillColor('#0077be')
         .text('TRAVEL ITINERARY', { align: 'left' });
      
      doc.moveDown(1);
      doc.fontSize(48)
         .fillColor('black')
         .text(data.destination.toUpperCase(), { align: 'left' });
      
      doc.moveDown(0.5);
      doc.fontSize(24)
         .text('7-DAY EXPERIENCE', { align: 'left' });
      
      doc.moveDown(4);
      doc.fontSize(12)
         .text(`Created: ${new Date().toLocaleDateString()}`, { align: 'left' });
      
      doc.moveDown(1);
      doc.fontSize(14)
         .text('Created exclusively for you by', { align: 'left' });
      
      doc.moveDown(0.5);
      doc.fontSize(18)
         .fillColor('#0077be')
         .text('DEEP TRAVEL COLLECTIONS', { align: 'left' });
      
      doc.moveDown(0.5);
      doc.fontSize(10)
         .fillColor('black')
         .text('© 2025 All rights reserved', { align: 'right' });
      
      // Add content pages
      doc.addPage();
      
      // Add title
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#0077be')
         .text('YOUR JOURNEY OVERVIEW', { align: 'center' });
      
      // Draw an underline
      const titleWidth = doc.widthOfString('YOUR JOURNEY OVERVIEW');
      const titleX = (doc.page.width - titleWidth) / 2;
      doc.moveTo(titleX, 75)
         .lineTo(titleX + titleWidth, 75)
         .lineWidth(2)
         .stroke('#FF6B35');
         
      doc.moveDown(1);
      
      // Process and add content
      // For H1 headings, we'll make a new page
      // For H2 headings, we'll use special formatting
      // Split by heading markers
      const sections = data.content.split(/(?=^#{1,2}\s+.*$)/m);
      
      // Add each section
      sections.forEach((section, index) => {
        if (index === 0 && !section.trim().startsWith('#')) {
          // This is likely the introduction
          doc.font('Helvetica')
             .fontSize(12)
             .fillColor('black')
             .text(section, { align: 'left', lineGap: 5 });
          
          doc.moveDown(1);
        } else if (section.trim()) {
          // Get the first line as the heading
          const lines = section.split('\n');
          const heading = lines[0].trim().replace(/^#+\s+/, '');
          
          // Is this a top-level heading? (# Heading)
          const isMainHeading = /^#\s+[^#]/.test(lines[0]);
          
          if (isMainHeading && index > 0) {
            // Add a page break for main headings (except the first one)
            doc.addPage();
          }
          
          // Add heading
          doc.font('Helvetica-Bold')
             .fontSize(isMainHeading ? 18 : 14)
             .fillColor(isMainHeading ? '#0077be' : '#FF6B35')
             .text(heading, { align: 'left' });
          
          // Add a rule under main headings
          if (isMainHeading) {
            const headingWidth = doc.widthOfString(heading);
            doc.moveTo(50, doc.y + 5)
               .lineTo(50 + headingWidth, doc.y + 5)
               .lineWidth(1)
               .stroke('#0077be');
          }
          
          doc.moveDown(0.5);
          
          // Add content
          doc.font('Helvetica')
             .fontSize(12)
             .fillColor('black');
          
          // Process remaining lines
          lines.slice(1).forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
              doc.moveDown(0.5);
              return;
            }
            
            // Check if this is a subheading (## or formatted label)
            if (trimmedLine.match(/^#{2,3}\s+|^[A-Z][a-z]+:|^[A-Z]{3,}:/)) {
              const subheading = trimmedLine
                .replace(/^#{2,3}\s+/, '')
                .replace(/^\*\*|\*\*$/g, '');
              
              doc.font('Helvetica-Bold')
                 .fontSize(14)
                 .fillColor('#FF6B35')
                 .text(subheading, { continued: false });
              
              doc.font('Helvetica')
                 .fontSize(12)
                 .fillColor('black');
              
              doc.moveDown(0.5);
            } 
            // Check if this is a bullet point
            else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
              // Extract just the text after the bullet marker
              const bulletText = trimmedLine.substring(2).trim();
              
              // Create an array with just one item for the bullet
              doc.list([bulletText], { bulletRadius: 2, textIndent: 20 });
              doc.moveDown(0.5);
            } 
            // Regular text
            else {
              doc.text(trimmedLine, { lineGap: 5 });
              doc.moveDown(0.5);
            }
          });
          
          // Extra space between sections
          doc.moveDown(1);
        }
      });
      
      // Add page numbers and footer to all content pages (not the title page)
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 1; i < totalPages; i++) {
        doc.switchToPage(i);
        
        // Add footer with page numbers
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor('#333333')
           .text(
             `${data.destination} Travel Itinerary - Page ${i + 1} of ${totalPages}`,
             50, 
             doc.page.height - 50,
             { align: 'center' }
           );
           
        // Add header bar
        doc.rect(0, 0, doc.page.width, 20)
           .fill('#0077be');
      }
      
      // Finalize PDF
      doc.end();
      
      // When document is done, resolve with the complete buffer
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      
      // Handle any errors
      doc.on('error', (error) => {
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}