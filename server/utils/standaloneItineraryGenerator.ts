/**
 * Standalone Itinerary Generator
 * 
 * A simplified, robust solution for generating high-quality PDF itineraries
 * that bypasses the complexity of the existing system.
 */

import { PDFDocument, rgb, StandardFonts, RGB } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { Destination, Itinerary, Day } from '@shared/schema';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a premium itinerary in PDF format
 * 
 * @param destination Destination object
 * @param itinerary Itinerary object (optional, only used for metadata)
 * @param days Array of day objects (optional, only used for metadata)
 * @returns Buffer containing the PDF
 */
export async function generateStandalonePDF(
  destination: any,
  itinerary?: any,
  days?: any[]
): Promise<Buffer> {
  try {
    console.log(`Starting standalone generation for ${destination.name}...`);
    
    // Generate all content in one go with a very specific prompt
    const content = await generateDetailedContent(destination);
    
    // Create PDF
    const pdfBuffer = await createPDF(destination, content);
    
    console.log(`✓ Standalone itinerary generated successfully for ${destination.name}`);
    return pdfBuffer;
  } catch (error: unknown) {
    console.error("Error generating standalone itinerary:", error);
    throw error;
  }
}

/**
 * Generate detailed content for the itinerary
 * 
 * @param destination Destination object
 * @returns Formatted content string
 */
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
      model: "gpt-4o", // Using the newest OpenAI model which was released May 13, 2024. Do not change this unless explicitly requested by the user
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

/**
 * Create PDF document from the generated content
 * 
 * @param destination Destination object
 * @param content Formatted content string
 * @returns Buffer containing the PDF
 */
async function createPDF(destination: any, content: string): Promise<Buffer> {
  try {
    console.log(`[PDF Generator] Starting PDF creation for ${destination.name}...`);
    
    // Create a PDF document
    console.log(`[PDF Generator] Creating PDF document...`);
    const pdfDoc = await PDFDocument.create();
    
    // Embed fonts
    console.log(`[PDF Generator] Embedding fonts...`);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaObliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    
    // Font encoding safety check
    console.log(`[PDF Generator] Setting up font encoding safety measures...`);
    
    // Title page
    const titlePage = pdfDoc.addPage();
    const { width, height } = titlePage.getSize();
    
    // Add solid background instead of gradient to avoid RGB type issues
    titlePage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0, 0.47, 0.75), // #0077be
    });
    
    // Add accent stripe at the top with a complementary color
    titlePage.drawRectangle({
      x: 0,
      y: height - 40,
      width,
      height: 40,
      color: rgb(0, 0.69, 0.95), // #00b0f0
    });
    
    // Add decorative accent on left side
    titlePage.drawRectangle({
      x: 0,
      y: 0,
      width: 20,
      height,
      color: rgb(1, 0.42, 0.21), // #FF6B35
    });
    
    // Add white content area with shadow effect
    const margin = 50;
    
    // Shadow effect (darker rectangle slightly offset)
    titlePage.drawRectangle({
      x: margin + 5,
      y: margin - 5,
      width: width - (margin * 2),
      height: height - (margin * 2),
      color: rgb(0.85, 0.85, 0.85), // light gray
    });
    
    // Main white content area
    titlePage.drawRectangle({
      x: margin,
      y: margin,
      width: width - (margin * 2),
      height: height - (margin * 2),
      color: rgb(1, 1, 1), // white
    });
    
    // Title content
    titlePage.drawText('PREMIUM', {
      x: margin + 50,
      y: height - 150,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(1, 0.42, 0.21), // #FF6B35
    });
    
    titlePage.drawText('TRAVEL ITINERARY', {
      x: margin + 50,
      y: height - 190,
      size: 36,
      font: helveticaBoldFont,
      color: rgb(0, 0.47, 0.75), // #0077be
    });
    
    titlePage.drawText(destination.name.toUpperCase(), {
      x: margin + 50,
      y: height - 250,
      size: 48,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText('7-DAY EXPERIENCE', {
      x: margin + 50,
      y: height - 310,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText(`Created: ${new Date().toLocaleDateString()}`, {
      x: margin + 50,
      y: height - 400,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText('Created exclusively for you by', {
      x: margin + 50,
      y: height - 430,
      size: 14,
      font: helveticaFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText('DEEP TRAVEL COLLECTIONS', {
      x: margin + 50,
      y: height - 460,
      size: 18,
      font: helveticaBoldFont,
      color: rgb(0, 0.47, 0.75), // #0077be
    });
    
    titlePage.drawText('© 2025 All rights reserved', {
      x: width - margin - 200,
      y: margin + 30,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0), // black
    });
    
    // Content pages
    let currentPage = pdfDoc.addPage();
    let yPosition = height - 50;
    
    // Apply consistent styling to the page
    applyPageStyling(currentPage, width, height);
    
    // Process content
    const title = 'YOUR JOURNEY OVERVIEW';
    currentPage.drawText(title, {
      x: width / 2 - helveticaBoldFont.widthOfTextAtSize(title, 24) / 2,
      y: yPosition,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0, 0.47, 0.75), // #0077be
    });
    
    // Add underline below title
    const titleWidth = helveticaBoldFont.widthOfTextAtSize(title, 24);
    const underlineStartX = width / 2 - titleWidth / 2;
    currentPage.drawLine({
      start: { x: underlineStartX, y: yPosition - 10 },
      end: { x: underlineStartX + titleWidth, y: yPosition - 10 },
      thickness: 2,
      color: rgb(1, 0.42, 0.21), // #FF6B35
    });
    
    yPosition -= 40;
    
    // Split content into sections by headings
    console.log(`[PDF Generator] Processing content sections...`);
    const sections = content.split(/(?=^#{1,2}\s+.*$)/m);
    console.log(`[PDF Generator] Found ${sections.length} content sections to process`);
    
    // Process each section
    for (const section of sections) {
      if (!section.trim()) continue;
      
      // Check if this is the first section (intro)
      if (!section.trim().startsWith('#')) {
        // Wrap and add intro text
        const lines = wrapText(section.trim(), helveticaFont, 12, width - 100);
        for (const line of lines) {
          currentPage.drawText(line, {
            x: 50,
            y: yPosition,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          
          yPosition -= 20;
          
          // Check if we need a new page
          if (yPosition < 50) {
            currentPage = pdfDoc.addPage();
            yPosition = height - 50;
            
            // Apply consistent styling to the new page
            applyPageStyling(currentPage, width, height);
          }
        }
        
        continue;
      }
      
      // Split section into lines
      const lines = section.split('\n');
      let heading = lines[0].replace(/^#+\s+/, '').trim();
      
      // Add heading
      currentPage.drawText(heading, {
        x: 50,
        y: yPosition,
        size: 18,
        font: helveticaBoldFont,
        color: rgb(0, 0.47, 0.75), // #0077be
      });
      
      yPosition -= 30;
      
      // Process remaining lines
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
          yPosition -= 10; // Add some spacing for empty lines
          continue;
        }
        
        // Check if we need a new page
        if (yPosition < 50) {
          currentPage = pdfDoc.addPage();
          yPosition = height - 50;
          
          // Apply consistent styling to the new page
          applyPageStyling(currentPage, width, height);
        }
        
        // Check if this is a subheading
        if (line.match(/^#{2,3}\s+|^\*\*[A-Z]|^[A-Z][a-z]+:|^[A-Z]{3,}:/)) {
          const subheading = line.replace(/^#{2,3}\s+/, '').replace(/^\*\*|\*\*$/g, '');
          
          currentPage.drawText(subheading, {
            x: 50,
            y: yPosition,
            size: 14,
            font: helveticaBoldFont,
            color: rgb(1, 0.42, 0.21), // #FF6B35
          });
          
          yPosition -= 25;
        } 
        // Check if this is a bullet point
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          const bulletText = line.substring(2);
          const wrappedBulletText = wrapText(bulletText, helveticaFont, 12, width - 140);
          
          for (let j = 0; j < wrappedBulletText.length; j++) {
            // For the first line, add a bullet point
            if (j === 0) {
              currentPage.drawText('•', {
                x: 60,
                y: yPosition,
                size: 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
            }
            
            currentPage.drawText(wrappedBulletText[j], {
              x: 75,
              y: yPosition,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
            
            yPosition -= 20;
            
            if (yPosition < 50) {
              currentPage = pdfDoc.addPage();
              yPosition = height - 50;
            }
          }
        } 
        // Regular text
        else {
          const wrappedText = wrapText(line, helveticaFont, 12, width - 100);
          
          for (const textLine of wrappedText) {
            currentPage.drawText(textLine, {
              x: 50,
              y: yPosition,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
            
            yPosition -= 20;
            
            if (yPosition < 50) {
              currentPage = pdfDoc.addPage();
              yPosition = height - 50;
            }
          }
        }
      }
      
      // Add some space between sections
      yPosition -= 30;
      
      // Check if we need a new page for the next section
      if (yPosition < 100) {
        currentPage = pdfDoc.addPage();
        yPosition = height - 50;
      }
    }
    
    // Convert to buffer
    console.log(`[PDF Generator] Finalizing and saving PDF document...`);
    const pdfBytes = await pdfDoc.save();
    console.log(`[PDF Generator] PDF generation complete! Size: ${Math.round(pdfBytes.length / 1024)} KB`);
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error("Error creating PDF:", error);
    throw error;
  }
}

/**
 * Apply consistent styling to a page
 * 
 * @param page PDF page to style
 * @param width Page width
 * @param height Page height
 */
function applyPageStyling(page: any, width: number, height: number): void {
  // Add horizontal accent bar at top of page
  page.drawRectangle({
    x: 0,
    y: height - 25,
    width,
    height: 15,
    color: rgb(0, 0.47, 0.75), // #0077be
  });
  
  // Add vertical accent bar on left side
  page.drawRectangle({
    x: 20,
    y: 0,
    width: 3,
    height,
    color: rgb(1, 0.42, 0.21), // #FF6B35
  });
}

/**
 * Wrap text based on font metrics and width
 * 
 * @param text Text to wrap
 * @param font Font for measurement
 * @param fontSize Font size for measurement
 * @param maxWidth Maximum width in points
 * @returns Array of wrapped lines
 */
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  // Safety check - if text is empty or null, return empty array
  if (!text) {
    console.log(`[PDF Generator] Warning: Empty text passed to wrapText, returning empty lines array`);
    return [];
  }

  try {
    // Log potential problematic characters
    const nonLatinChars = text.match(/[^\x00-\x7F]/g);
    if (nonLatinChars && nonLatinChars.length > 0) {
      console.log(`[PDF Generator] Found ${nonLatinChars.length} non-Latin characters: ${JSON.stringify(nonLatinChars.slice(0, 10))}`);
    }
    
    // Sanitize text and replace non-Latin characters that might cause encoding issues
    const sanitizedText = text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // Replace any non-Latin characters that might cause encoding issues
      .replace(/[^\x00-\x7F]/g, function(char) {
        // Common character translations
        const charMap: Record<string, string> = {
          // Arabic
          'م': "'m'", // meem
          'ا': "'a'", // alif
          'ن': "'n'", // noon
          
          // Japanese/Chinese
          '東': "'East'",
          '京': "'Capital'",
          '北': "'North'",
          '上': "'Up'",
          '海': "'Sea'",
          
          // Other common characters
          '€': "EUR",
          '£': "GBP",
          '¥': "JPY",
          '₹': "INR",
          '°': "deg",
          '©': "(c)",
          '®': "(r)",
          '™': "(tm)",
        };
        
        if (charMap[char]) {
          return charMap[char];
        }
        
        console.log(`[PDF Generator] Replacing non-Latin character: ${char} (${char.charCodeAt(0).toString(16)})`);
        // Default fallback for other non-Latin characters
        return '';
      })
      .trim();
    
    const words = sanitizedText.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  } catch (error: unknown) {
    console.error(`[PDF Generator] Error in wrapText: ${error instanceof Error ? error.message : String(error)}`);
    // Return a safe fallback in case of error
    return [text.substring(0, 100) + '... [text truncated due to encoding error]'];
  }
}