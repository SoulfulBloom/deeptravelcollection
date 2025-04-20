/**
 * Snowbird Itinerary Generator
 * 
 * A specialized generator for Canadian snowbird itineraries using the successful
 * standalone generator approach, but with custom prompts for snowbird destinations.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a premium snowbird itinerary in PDF format
 * 
 * @param destination Snowbird destination object
 * @returns Buffer containing the PDF
 */
export async function generateSnowbirdPDF(destination: any): Promise<Buffer> {
  try {
    console.log(`Starting snowbird itinerary generation for ${destination.name}...`);
    
    // Generate all content in one go with a very specific prompt
    const content = await generateDetailedContent(destination);
    
    // Create PDF
    const pdfBuffer = await createPDF(destination, content);
    
    console.log(`✓ Snowbird itinerary generated successfully for ${destination.name}`);
    return pdfBuffer;
  } catch (error: unknown) {
    console.error("Error generating snowbird itinerary:", error);
    throw error;
  }
}

/**
 * Generate detailed content for the snowbird itinerary
 * 
 * @param destination Snowbird destination object
 * @returns Formatted content string
 */
async function generateDetailedContent(destination: any): Promise<string> {
  const prompt = `
As a professional travel consultant for Canadian snowbirds, create a PREMIUM 3-month living guide for ${destination.name}, ${destination.country} with these EXACT requirements:

1. START with a detailed "WHY CHOOSE ${destination.name.toUpperCase()} OVER FLORIDA" section that includes:
   - Climate comparison with Florida (temperatures, humidity, rainfall)
   - Cost of living comparison (accommodation, food, healthcare, entertainment)
   - Cultural benefits and unique experiences not available in Florida
   - Canadian expat community presence and support networks
   - Healthcare quality and accessibility for seniors
   - Familiar amenities and activities similar to what they enjoy in Canada/Florida

2. Include a PRACTICAL INFORMATION section with:
   - Visa requirements specifically for Canadians (duration allowed, application process, costs)
   - Best neighborhoods for 3-month stays with safety ratings and proximity to amenities
   - Long-term accommodation options with SPECIFIC rental agencies and price ranges
   - Healthcare facilities with English-speaking staff (EXACT hospital/clinic names and addresses)
   - Banking, ATMs, and money exchange information (which Canadian banks have partnerships)
   - Internet and mobile connectivity details (providers, costs, reliability)

3. ENHANCED AT-HOME EXPERIENCE section with:
   - How to set up your temporary home for maximum comfort (including what to bring from Canada)
   - Where to find familiar groceries, foods, and household items
   - Tips for feeling at home quickly (establishing routines, meeting neighbors)
   - Local services that make life easier (house cleaning, gardening, maintenance)
   - Home security considerations for longer-term stays

4. MONTHLY BREAKDOWN with week-by-week "AT-HOME ACTIVITIES":
   - MONTH 1 (SETTLING IN): 
     * Neighborhood orientation activities
     * Essential services locations (groceries, pharmacies, banks)
     * Organized group activities specifically for Canadian seniors
     * "Just like home" restaurants and cafés with familiar menus
     * Low-effort day trips to ease into the local culture
   
   - MONTH 2 (COMFORTABLE EXPLORATION):
     * Cultural highlights with English-speaking guides
     * Golf courses, tennis clubs, and swimming facilities 
     * Book clubs, card game groups, and similar social activities popular with Canadians
     * Canadian-style recreation options (hockey viewing parties, curling clubs if available)
     * Wellness and fitness classes geared toward seniors
   
   - MONTH 3 (DEEPENING CONNECTIONS):
     * Local craft and hobby groups to join
     * Gentle adventure experiences with guided support
     * Canadian clubs' special events and celebrations
     * Regular "home comfort" spots to establish as part of your routine
     * "Bring home" experiences - learning local cooking, crafts to showcase back in Canada

5. Include a section on HEALTHCARE CONSIDERATIONS:
   - How to maintain Canadian healthcare coverage while abroad
   - Travel insurance recommendations with approximate costs
   - List of specific hospitals and clinics with international patient departments
   - Pharmacy information and prescription medication guidance
   - Emergency procedures and contact numbers

6. Include a COMFORT COMPARISON section with:
   - Specific examples of how life in ${destination.name} matches or exceeds Florida experiences
   - Weather patterns compared to Florida AND Canadian cities (Toronto, Vancouver, Montreal)
   - Familiar Canadian chain stores or similar alternatives
   - Availability of English-language services, TV, books, and newspapers
   - How locals treat Canadian visitors compared to treatment in Florida

7. Add a TRANSPORTATION GUIDE with:
   - Direct flight options from major Canadian cities with airlines and typical costs
   - Local transportation options (public transit, taxis, rental cars)
   - Tips for navigating the city/region for seniors with mobility considerations
   - Airport transfer recommendations
   - Walking accessibility ratings for different neighborhoods

8. Include a CANADIAN COMMUNITY INTEGRATION section with:
   - Established Canadian social clubs and regular meetups
   - "Must-attend" events for the Canadian community each month
   - Canadian-friendly establishments (restaurants, shops, services)
   - Where to watch Canadian sports or find Canadian products
   - Canadian consulate/embassy information

9. DETAILED RESTAURANT RECOMMENDATIONS with:
   - Top 10 specific restaurants with exact addresses, cuisine types, and price ranges in both local currency and CAD
   - Local specialties that Canadians typically enjoy (with specific dishes to try and where to find them)
   - Fine dining options for special occasions (with reservation information and dress code)
   - Casual dining spots with North American cuisine
   - Best breakfast spots with Canadian-style options (pancakes, bacon and eggs, etc.)
   - Food delivery services with English-language ordering (apps and websites)
   - Special food considerations (gluten-free, vegetarian, etc.) and which restaurants accommodate them
   - Hidden gems and local favorites with English-speaking staff
   - Restaurant chains similar to Canadian/North American favorites
   - Specific menu items and prices at recommended restaurants

10. ACCOMMODATION OPTIONS section with:
   - Detailed comparison of short-term housing options (condos, apartments, houses)
   - Specific neighborhoods and buildings that are popular with Canadians
   - List of reputable real estate agents and rental agencies specializing in snowbird rentals (with contact info)
   - Typical cost ranges for different types of accommodation with amenities (pool, security, etc.)
   - Gated communities vs. regular neighborhoods - pros and cons for each
   - House-sitting and home exchange opportunities
   - Extended stay hotels and apart-hotels for first-time visitors
   - Recommended specific properties that are well-suited for 3-month stays
   - Furnished vs unfurnished rental comparison with pricing
   - Exact locations of Canadian-friendly communities with proximity to amenities

IMPORTANT FORMATTING REQUIREMENTS:
1. DO NOT use asterisks (*) or double asterisks (**) ANYWHERE in your response
2. Use clean headings without formatting characters like "Month 1: Settling In" (NOT "**Month 1**")
3. Use proper heading hierarchy with # for main sections and ## for subsections
4. Instead of writing "**Opening Hours:**", just write "Opening Hours:" (no asterisks)
5. Use clear section breaks between day sections
6. Keep text clean and focused - absolutely no markdown formatting characters like *asterisks* or **double asterisks**
7. For all prices, show both local currency AND approximate CAD amount in parentheses, e.g. "80,000 COP (~$25 CAD)"
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
          content: `You are a premium travel guide creator specializing in detailed winter itineraries for Canadian snowbirds in ${destination.name}, ${destination.country} with these skills:
1. You ONLY provide specific, named locations with exact details - never generic descriptions
2. You are an expert at currency conversion and always show prices in both local currency and CAD equivalent
3. You have extensive knowledge of healthcare systems relevant to seniors
4. You create beautiful, easy-to-read content with proper headings and formatting
5. You help snowbirds understand local costs by providing clear price comparisons with Florida
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
      .replace(/"Visa Requirements:"/g, 'Visa Requirements:')
      .replace(/"Transportation:"/g, 'Transportation:')
      .replace(/"Healthcare:"/g, 'Healthcare:')
      .replace(/"Budget:"/g, 'Budget:')
      .replace(/"Accommodation:"/g, 'Accommodation:');
      
    return cleanContent;
  } catch (error) {
    console.error(`Error generating content for ${destination.name}:`, error);
    throw error;
  }
}

/**
 * Create PDF document from the generated content
 * 
 * @param destination Snowbird destination object
 * @param content Formatted content string
 * @returns Buffer containing the PDF
 */
async function createPDF(destination: any, content: string): Promise<Buffer> {
  try {
    console.log(`[PDF Generator] Starting PDF creation for ${destination.name}...`);
    
    // Create a PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaObliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    
    // Title page
    const titlePage = pdfDoc.addPage();
    const { width, height } = titlePage.getSize();
    
    // Add solid background color
    titlePage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
    });
    
    // Add accent stripe at the top
    titlePage.drawRectangle({
      x: 0,
      y: height - 40,
      width,
      height: 40,
      color: rgb(0, 0.69, 0.95), // #00b0f0 - lighter blue
    });
    
    // Add decorative accent on left side
    titlePage.drawRectangle({
      x: 0,
      y: 0,
      width: 20,
      height,
      color: rgb(0.97, 0.45, 0.08), // #f87314 - orange shade
    });
    
    // White content area
    const margin = 50;
    
    // Shadow effect
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
    
    // Canadian flag emblem
    titlePage.drawRectangle({
      x: width - 130,
      y: height - 130,
      width: 40,
      height: 25,
      color: rgb(0.87, 0.11, 0.11), // #df1c1c - Canadian flag red
    });
    
    // Title content
    titlePage.drawText('CANADIAN SNOWBIRD', {
      x: margin + 50,
      y: height - 150,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0.87, 0.11, 0.11), // #df1c1c - Canadian flag red
    });
    
    titlePage.drawText('ALTERNATIVE GUIDE', {
      x: margin + 50,
      y: height - 190,
      size: 36,
      font: helveticaBoldFont,
      color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
    });
    
    titlePage.drawText(destination.name.toUpperCase(), {
      x: margin + 50,
      y: height - 250,
      size: 48,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText(`${destination.country.toUpperCase()}`, {
      x: margin + 50,
      y: height - 310,
      size: 30,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText('3-MONTH WINTER ITINERARY', {
      x: margin + 50,
      y: height - 370,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0.97, 0.45, 0.08), // #f87314 - orange shade
    });
    
    titlePage.drawText(`Created: ${new Date().toLocaleDateString()}`, {
      x: margin + 50,
      y: margin + 100,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText('Created exclusively for you by', {
      x: margin + 50,
      y: margin + 70,
      size: 14,
      font: helveticaFont,
      color: rgb(0, 0, 0), // black
    });
    
    titlePage.drawText('DEEP TRAVEL COLLECTIONS', {
      x: margin + 50,
      y: margin + 40,
      size: 18,
      font: helveticaBoldFont,
      color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
    });
    
    titlePage.drawText('© 2025 All rights reserved', {
      x: width - margin - 200,
      y: margin + 20,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0), // black
    });
    
    // Content pages
    let currentPage = pdfDoc.addPage();
    let yPosition = height - 50;
    
    // Apply consistent styling to the page
    applyPageStyling(currentPage, width, height);
    
    // Add title
    const title = 'CANADIAN SNOWBIRD GUIDE';
    currentPage.drawText(title, {
      x: width / 2 - helveticaBoldFont.widthOfTextAtSize(title, 24) / 2,
      y: yPosition,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
    });
    
    // Add underline below title
    const titleWidth = helveticaBoldFont.widthOfTextAtSize(title, 24);
    const underlineStartX = width / 2 - titleWidth / 2;
    currentPage.drawLine({
      start: { x: underlineStartX, y: yPosition - 10 },
      end: { x: underlineStartX + titleWidth, y: yPosition - 10 },
      thickness: 2,
      color: rgb(0.97, 0.45, 0.08), // #f87314 - orange shade
    });
    
    yPosition -= 40;
    
    // Split content into sections by headings
    const sections = content.split(/(?=^#{1,2}\s+.*$)/m);
    
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
        color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
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
            color: rgb(0.97, 0.45, 0.08), // #f87314 - orange shade
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
              
              // Apply consistent styling to the new page
              applyPageStyling(currentPage, width, height);
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
              
              // Apply consistent styling to the new page
              applyPageStyling(currentPage, width, height);
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
        
        // Apply consistent styling to the new page
        applyPageStyling(currentPage, width, height);
      }
    }
    
    // Add a final page with contact information
    const finalPage = pdfDoc.addPage();
    applyPageStyling(finalPage, width, height);
    
    finalPage.drawText('CONTACT & RESOURCES', {
      x: width / 2 - helveticaBoldFont.widthOfTextAtSize('CONTACT & RESOURCES', 24) / 2,
      y: height - 100,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
    });
    
    const contactText = [
      'For more information and personalized travel planning, please contact:',
      '',
      'Deep Travel Collections',
      'Email: contact@deeptravelcollections.com',
      'Website: www.deeptravelcollections.com',
      '',
      'Canadian Snowbird Resources:',
      '• Canadian Snowbird Association: www.snowbirds.org',
      '• Government of Canada Travel: travel.gc.ca',
      '• Canadian Embassy in ' + destination.country + ': Check travel.gc.ca for details',
      '',
      'This guide was created exclusively for Canadian snowbirds seeking alternatives to traditional winter destinations.',
      'All information was current at the time of publication. Prices and details may change.',
      '',
      '© 2025 Deep Travel Collections. All rights reserved.'
    ];
    
    let contactY = height - 150;
    for (const line of contactText) {
      if (line === '') {
        contactY -= 20;
        continue;
      }
      
      finalPage.drawText(line, {
        x: 100,
        y: contactY,
        size: 12,
        font: line.includes('Deep Travel Collections') || line.includes('CONTACT') || line.includes('Canadian Snowbird Resources') 
          ? helveticaBoldFont 
          : helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      contactY -= 20;
    }
    
    // Convert to buffer
    const pdfBytes = await pdfDoc.save();
    
    // Create the output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'downloads', 'snowbird-itineraries');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error("Error creating PDF:", error);
    throw error;
  }
}

/**
 * Apply consistent styling to each page of the PDF
 * 
 * @param page PDF page to style
 * @param width Page width
 * @param height Page height
 */
function applyPageStyling(page: any, width: number, height: number): void {
  // Add blue header bar
  page.drawRectangle({
    x: 0,
    y: height - 40,
    width,
    height: 40,
    color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
  });
  
  // Add orange sidebar
  page.drawRectangle({
    x: 30,
    y: 0,
    width: 5,
    height: height - 40,
    color: rgb(0.97, 0.45, 0.08), // #f87314 - orange shade
  });
  
  // Add footer
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: 30,
    color: rgb(0.06, 0.42, 0.67), // #1069ab - blue shade
  });
  
  // Add footer with generic page number (static)
  page.drawText(`DEEP TRAVEL COLLECTIONS | Canadian Snowbird Guide`, {
    x: width / 2 - 150,
    y: 10,
    size: 10,
    color: rgb(0, 0, 0), // black
  });
}

/**
 * Wrap text to fit within a specified width
 * 
 * @param text Text to wrap
 * @param font PDF font
 * @param fontSize Font size
 * @param maxWidth Maximum width for the text
 * @returns Array of text lines
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
          'ن': "'n'", // noon
          'ك': "'k'", // kaf
          // Asian languages
          '您': "(nin)", // Chinese "you"
          '好': "(hao)", // Chinese "good"
          '東': "(dong)", // Chinese "east"
          '京': "(jing)", // Chinese "capital"
          '안': "(an)", // Korean
          '녕': "(nyeong)", // Korean
          'は': "(ha)", // Japanese
          'じ': "(ji)", // Japanese
          'め': "(me)", // Japanese
          'て': "(te)", // Japanese
          // Accented Latin characters
          'á': "a",
          'é': "e",
          'í': "i",
          'ó': "o",
          'ú': "u",
          'ñ': "n",
          'ç': "c",
          // Currency symbols
          '€': "EUR",
          '£': "GBP",
          '¥': "JPY",
          '₩': "KRW",
          // Other common symbols
          '°': " degrees",
          '№': "No.",
          '™': "(TM)",
          '®': "(R)",
          '©': "(C)",
          // Typographical symbols
          '—': "-",
          '–': "-",
          '…': "...",
          '•': "*",
          // Ensure some common symbols are handled
          'α': "alpha",
          'β': "beta",
          'γ': "gamma",
          'δ': "delta",
          'θ': "theta",
          'π': "pi",
          'Σ': "Sigma"
        };
        
        return charMap[char] || ' ';
      });

    // Split input text into words
    const words = sanitizedText.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if (!word) continue; // Skip empty words
      
      // Create potential new line by adding the current word
      const potentialLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
      
      try {
        const potentialLineWidth = font.widthOfTextAtSize(potentialLine, fontSize);
        
        // Check if the potential line exceeds the maximum width
        if (potentialLineWidth > maxWidth) {
          // If the current line is not empty, add it to the lines array
          if (currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // If the current line is empty, the word itself exceeds the maximum width
            // We'll need to split the word character by character
            let partialWord = '';
            for (let i = 0; i < word.length; i++) {
              const potentialPartialWord = partialWord + word[i];
              try {
                const potentialPartialWordWidth = font.widthOfTextAtSize(potentialPartialWord, fontSize);
                
                if (potentialPartialWordWidth > maxWidth) {
                  lines.push(partialWord);
                  partialWord = word[i];
                } else {
                  partialWord = potentialPartialWord;
                }
              } catch (widthError) {
                console.error(`[PDF Generator] Error measuring character '${word[i]}' width, skipping:`, widthError);
                // Skip this character and continue
                continue;
              }
            }
            
            if (partialWord.length > 0) {
              currentLine = partialWord;
            }
          }
        } else {
          // If the potential line doesn't exceed the maximum width, update the current line
          currentLine = potentialLine;
        }
      } catch (lineWidthError) {
        console.error(`[PDF Generator] Error measuring line width, using fallback wrapping for: "${potentialLine}"`, lineWidthError);
        // Fallback wrapping strategy - roughly 80 chars per line
        if (currentLine.length > 80) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
        }
      }
    }
    
    // Add the last line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  } catch (error) {
    console.error('[PDF Generator] Error in wrapText, returning empty array:', error);
    // Return an empty array in case of error
    return [];
  }
}