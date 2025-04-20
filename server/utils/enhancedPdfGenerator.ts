/**
 * Enhanced PDF Generator
 * 
 * Creates beautiful, professionally formatted travel itinerary PDFs
 * with proper styling, branding, and layout.
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Destination, Itinerary, Day, EnhancedExperience } from '@shared/schema';

// Define consistent colors for branding
const COLORS = {
  primary: '#2563eb',       // Deep blue for headers and key elements
  secondary: '#0ea5e9',     // Light blue for accents
  accent: '#f97316',        // Orange for highlights and call-to-actions
  dark: '#1e293b',          // Dark slate for main text
  light: '#f8fafc',         // Light background
  gray: '#64748b',          // Medium gray for secondary text
  success: '#10b981',       // Green for positive elements
  border: '#e2e8f0',        // Light gray for borders
};

// Font configuration
const FONTS = {
  header: 'Helvetica-Bold',
  subheader: 'Helvetica-Bold',
  body: 'Helvetica',
  emphasis: 'Helvetica-Oblique',
  light: 'Helvetica-Light',
};

// Consistent sizing
const SIZES = {
  title: 24,
  heading: 18,
  subheading: 14,
  normal: 10,
  small: 8,
  tiny: 6,
  margin: 50,     // Default page margin
  gutter: 15,     // Space between elements
  smallGap: 8,    // Smaller space
};

export interface EnhancedPDFOptions {
  includeMap?: boolean;
  includePhotos?: boolean;
  colorTheme?: 'blue' | 'green' | 'orange' | 'purple';
  showPageNumbers?: boolean;
  showBranding?: boolean;
  companyName?: string;
  companyLogo?: string;
  contactInfo?: string;
}

const defaultOptions: EnhancedPDFOptions = {
  includeMap: true,
  includePhotos: true,
  colorTheme: 'blue',
  showPageNumbers: true,
  showBranding: true,
  companyName: 'Deep Travel Collections',
  contactInfo: 'www.deeptravelcollections.com | info@deeptravelcollections.com',
};

interface Position {
  x: number;
  y: number;
}

/**
 * Generate a beautifully formatted premium PDF itinerary
 */
export async function generateEnhancedPDF(
  destination: Destination,
  itinerary: Itinerary,
  days: Day[],
  experiences: EnhancedExperience[],
  options: EnhancedPDFOptions = {}
): Promise<Buffer> {
  const opts = { ...defaultOptions, ...options };
  
  return new Promise((resolve, reject) => {
    try {
      // Create a document with A4 size
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: SIZES.margin,
          bottom: SIZES.margin,
          left: SIZES.margin,
          right: SIZES.margin
        },
        info: {
          Title: `${destination.name} Premium Travel Itinerary`,
          Author: opts.companyName,
          Subject: `7-Day Travel Itinerary for ${destination.name}, ${destination.country}`,
          Keywords: 'travel, itinerary, vacation, premium, guide',
          CreationDate: new Date(),
        }
      });
      
      // Collect the PDF data into a buffer
      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Start building the PDF
      addCoverPage(doc, destination, itinerary, opts);
      
      addIntroductionPage(doc, destination, itinerary);
      
      // Add a page for each day of the itinerary
      days.forEach((day, index) => {
        addDayPage(doc, day, index + 1, destination, experiences);
      });
      
      // Add local experiences showcase
      if (experiences && experiences.length > 0) {
        addExperiencesPage(doc, experiences, destination);
      }
      
      // Add practical information page
      addPracticalInfoPage(doc, destination);
      
      // Add back cover
      addBackCover(doc, opts);
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Add a stylish cover page to the PDF
 */
function addCoverPage(
  doc: PDFKit.PDFDocument,
  destination: Destination,
  itinerary: Itinerary,
  options: EnhancedPDFOptions
): void {
  // Background color
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fill(COLORS.primary);
  
  // Create a white content area with rounded corners
  const contentMargin = 40;
  const contentWidth = doc.page.width - (contentMargin * 2);
  const contentHeight = doc.page.height - (contentMargin * 2);
  
  doc.roundedRect(contentMargin, contentMargin, contentWidth, contentHeight, 10)
     .fill(COLORS.light);
  
  // Add branding at the top
  if (options.showBranding) {
    doc.fontSize(14)
       .font(FONTS.light)
       .fillColor(COLORS.dark)
       .text(options.companyName || 'Deep Travel Collections', contentMargin + 30, contentMargin + 30, {
         align: 'center',
         width: contentWidth - 60
       });
       
    // Add a decorative line
    doc.moveTo(contentMargin + 100, contentMargin + 50)
       .lineTo(doc.page.width - contentMargin - 100, contentMargin + 50)
       .lineWidth(1)
       .stroke(COLORS.border);
  }
  
  // Main title - destination name
  const titleY = contentMargin + 100;
  doc.fontSize(SIZES.title * 1.5)
     .font(FONTS.header)
     .fillColor(COLORS.primary)
     .text(destination.name.toUpperCase(), contentMargin + 30, titleY, {
       align: 'center',
       width: contentWidth - 60
     });
  
  // Subtitle - country
  doc.fontSize(SIZES.heading)
     .font(FONTS.subheader)
     .fillColor(COLORS.secondary)
     .text(destination.country, contentMargin + 30, titleY + 60, {
       align: 'center',
       width: contentWidth - 60
     });
  
  // Itinerary title with elegant styling
  const itineraryTitleY = doc.y + 50;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.emphasis)
     .fillColor(COLORS.accent)
     .text('PREMIUM TRAVEL ITINERARY', contentMargin + 30, itineraryTitleY, {
       align: 'center',
       width: contentWidth - 60
     });
     
  // Days count with stylish badge
  const daysCountY = doc.y + 30;
  doc.roundedRect(doc.page.width/2 - 60, daysCountY, 120, 40, 20)
     .fill(COLORS.primary);
     
  doc.fontSize(SIZES.heading)
     .font(FONTS.header)
     .fillColor(COLORS.light)
     .text('7 DAYS', doc.page.width/2 - 60, daysCountY + 10, {
       align: 'center',
       width: 120
     });
     
  // Date information
  const dateY = daysCountY + 70;
  doc.fontSize(SIZES.normal)
     .font(FONTS.light)
     .fillColor(COLORS.gray)
     .text(`Created: ${new Date().toLocaleDateString()}`, contentMargin + 30, dateY, {
       align: 'center',
       width: contentWidth - 60
     });
     
  // Footer with legal text
  const footerY = doc.page.height - contentMargin - 60;
  doc.fontSize(SIZES.small)
     .font(FONTS.light)
     .fillColor(COLORS.gray)
     .text('This premium itinerary is exclusively prepared for you. All content is curated by travel experts with local knowledge.', 
           contentMargin + 50, footerY, {
       align: 'center',
       width: contentWidth - 100
     });
     
  // Copyright line
  doc.fontSize(SIZES.tiny)
     .text(`© ${new Date().getFullYear()} ${options.companyName || 'Deep Travel Collections'}. All rights reserved.`, 
           contentMargin + 50, footerY + 30, {
       align: 'center',
       width: contentWidth - 100
     });
}

/**
 * Add an introduction page with destination overview
 */
function addIntroductionPage(
  doc: PDFKit.PDFDocument,
  destination: Destination,
  itinerary: Itinerary
): void {
  doc.addPage();
  
  // Page title
  doc.fontSize(SIZES.heading)
     .font(FONTS.header)
     .fillColor(COLORS.primary)
     .text('DESTINATION OVERVIEW', SIZES.margin, SIZES.margin);
     
  // Decorative underline
  doc.moveTo(SIZES.margin, SIZES.margin + SIZES.heading + 5)
     .lineTo(SIZES.margin + 200, SIZES.margin + SIZES.heading + 5)
     .lineWidth(2)
     .stroke(COLORS.accent);
     
  // Destination information
  const infoY = SIZES.margin + SIZES.heading + 20;
  
  // Section for key information
  doc.roundedRect(SIZES.margin, infoY, doc.page.width - (SIZES.margin * 2), 100, 5)
     .fillAndStroke('#f1f5f9', COLORS.border);
     
  const colWidth = (doc.page.width - (SIZES.margin * 2) - (SIZES.gutter * 2)) / 3;
  
  // Column 1: Basic Information
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.dark)
     .text('Location', SIZES.margin + SIZES.gutter, infoY + SIZES.gutter);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`${destination.name}, ${destination.country}`, SIZES.margin + SIZES.gutter, infoY + SIZES.gutter + 20);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Region: ${destination.region || 'International'}`, SIZES.margin + SIZES.gutter, doc.y + 5);
  
  // Column 2: Climate
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.dark)
     .text('Best Time to Visit', SIZES.margin + SIZES.gutter + colWidth, infoY + SIZES.gutter);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(destination.bestTimeToVisit || 'Year-round', SIZES.margin + SIZES.gutter + colWidth, infoY + SIZES.gutter + 20);
     
  // Column 3: Language
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.dark)
     .text('Language', SIZES.margin + SIZES.gutter + (colWidth * 2), infoY + SIZES.gutter);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(destination.language || 'Local Language', SIZES.margin + SIZES.gutter + (colWidth * 2), infoY + SIZES.gutter + 20);
  
  // About this destination
  const aboutY = infoY + 120;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('ABOUT THIS DESTINATION', SIZES.margin, aboutY);
     
  // Description
  const descriptionText = destination.immersiveDescription || destination.description || 
    `${destination.name} is a remarkable destination offering unique experiences and cultural insights.`;
    
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(descriptionText, SIZES.margin, aboutY + 30, {
       width: doc.page.width - (SIZES.margin * 2),
       align: 'justify'
     });
     
  // Itinerary overview
  const overviewY = doc.y + 30;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('ITINERARY HIGHLIGHTS', SIZES.margin, overviewY);
     
  // Highlights
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(itinerary.description, SIZES.margin, overviewY + 30, {
       width: doc.page.width - (SIZES.margin * 2),
       align: 'justify'
     });
     
  // Days at a glance - stylish bar
  const ataGlanceY = doc.y + 40;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('YOUR 7-DAY JOURNEY AT A GLANCE', SIZES.margin, ataGlanceY);
     
  const dayBarY = ataGlanceY + 30;
  const dayWidth = (doc.page.width - (SIZES.margin * 2)) / 7;
  
  // Draw day boxes
  for (let i = 0; i < 7; i++) {
    const x = SIZES.margin + (i * dayWidth);
    const color = i % 2 === 0 ? COLORS.primary : COLORS.secondary;
    
    doc.rect(x, dayBarY, dayWidth, 50)
       .fill(color);
       
    doc.fontSize(SIZES.small)
       .font(FONTS.header)
       .fillColor(COLORS.light)
       .text(`DAY ${i + 1}`, x + 5, dayBarY + 5, {
         width: dayWidth - 10
       });
       
    doc.fontSize(SIZES.tiny)
       .font(FONTS.body)
       .fillColor(COLORS.light)
       .text(days[i]?.title || 'Exploration Day', x + 5, dayBarY + 25, {
         width: dayWidth - 10
       });
  }
}

/**
 * Add a detailed page for each day of the itinerary
 */
function addDayPage(
  doc: PDFKit.PDFDocument,
  day: Day,
  dayNumber: number,
  destination: Destination,
  experiences: EnhancedExperience[]
): void {
  doc.addPage();
  
  // Top banner with day number and title
  doc.rect(0, 0, doc.page.width, 120)
     .fill(COLORS.primary);
     
  doc.fontSize(SIZES.title)
     .font(FONTS.header)
     .fillColor(COLORS.light)
     .text(`DAY ${dayNumber}`, SIZES.margin, 40);
     
  doc.fontSize(SIZES.heading)
     .font(FONTS.subheader)
     .fillColor(COLORS.light)
     .text(day.title, SIZES.margin, 70, {
       width: doc.page.width - (SIZES.margin * 2)
     });
  
  // Morning section
  const morningY = 140;
  addTimeSection(doc, 'MORNING', day.content, morningY, "morning");
  
  // Afternoon section
  const afternoonY = doc.y + 30;
  addTimeSection(doc, 'AFTERNOON', day.content, afternoonY, "afternoon");
  
  // Evening section
  const eveningY = doc.y + 30;
  addTimeSection(doc, 'EVENING', day.content, eveningY, "evening");
  
  // Note about local experiences
  const noteY = doc.y + 40;
  
  // Find a relevant experience for this day if possible
  const relevantExperience = experiences && experiences.length > dayNumber - 1 ? 
    experiences[dayNumber - 1] : null;
    
  if (relevantExperience) {
    doc.rect(SIZES.margin, noteY, doc.page.width - (SIZES.margin * 2), 100)
       .fill('#f0f9ff');
       
    doc.fontSize(SIZES.subheading)
       .font(FONTS.subheader)
       .fillColor(COLORS.secondary)
       .text('LOCAL EXPERIENCE SPOTLIGHT', SIZES.margin + 15, noteY + 15);
       
    doc.fontSize(SIZES.normal)
       .font(FONTS.header)
       .fillColor(COLORS.dark)
       .text(relevantExperience.title, SIZES.margin + 15, noteY + 35);
       
    doc.fontSize(SIZES.normal)
       .font(FONTS.body)
       .fillColor(COLORS.dark)
       .text(relevantExperience.description, SIZES.margin + 15, noteY + 55, {
         width: doc.page.width - (SIZES.margin * 2) - 30
       });
  }
  
  // Add a footer with the destination name
  addPageFooter(doc, `${destination.name} Itinerary - Day ${dayNumber}`);
}

/**
 * Add a section for a specific time of day (morning, afternoon, evening)
 */
function addTimeSection(
  doc: PDFKit.PDFDocument, 
  title: string, 
  content: string,
  yPosition: number,
  timeOfDay: string
): void {
  // Try to extract the specific section from the content
  const sectionContent = extractTimeOfDayContent(content, timeOfDay) || 
    `Explore ${timeOfDay} attractions and enjoy local experiences.`;
  
  // Section header with colored bubble
  doc.roundedRect(SIZES.margin, yPosition, 100, 25, 12.5)
     .fill(timeOfDay === 'morning' ? '#fbbf24' : 
           timeOfDay === 'afternoon' ? '#60a5fa' : '#8b5cf6');
     
  doc.fontSize(SIZES.subheading)
     .font(FONTS.header)
     .fillColor(COLORS.light)
     .text(title, SIZES.margin + 10, yPosition + 5);
     
  // Content with left border
  const contentY = yPosition + 35;
  
  // Add a vertical line on the left
  doc.moveTo(SIZES.margin + 5, contentY)
     .lineTo(SIZES.margin + 5, contentY + 100)
     .lineWidth(2)
     .stroke(timeOfDay === 'morning' ? '#fbbf24' : 
            timeOfDay === 'afternoon' ? '#60a5fa' : '#8b5cf6');
  
  // Add the content
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(sectionContent, SIZES.margin + 15, contentY, {
       width: doc.page.width - (SIZES.margin * 2) - 15,
       align: 'justify'
     });
}

/**
 * Extract content for a specific time of day
 */
function extractTimeOfDayContent(content: string, timeOfDay: string): string | null {
  const normalizedContent = content.toLowerCase();
  const timeOfDayLower = timeOfDay.toLowerCase();
  
  // Check for section headers like "Morning:", "Afternoon:", "Evening:"
  const patterns = [
    new RegExp(`${timeOfDayLower}[:\\s]([\\s\\S]*?)(?=(morning|afternoon|evening)[:\\s]|$)`, 'i'),
    new RegExp(`${timeOfDayLower} activities[:\\s]([\\s\\S]*?)(?=(morning|afternoon|evening)[:\\s]|$)`, 'i'),
    new RegExp(`${timeOfDayLower} itinerary[:\\s]([\\s\\S]*?)(?=(morning|afternoon|evening)[:\\s]|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Fall back to looking for general time references
  if (normalizedContent.includes(timeOfDayLower)) {
    // Find the paragraph containing the time of day
    const paragraphs = content.split(/\n\n|\r\n\r\n/);
    for (const paragraph of paragraphs) {
      if (paragraph.toLowerCase().includes(timeOfDayLower)) {
        return paragraph.trim();
      }
    }
  }
  
  return null;
}

/**
 * Add a page showcasing local experiences
 */
function addExperiencesPage(
  doc: PDFKit.PDFDocument,
  experiences: EnhancedExperience[],
  destination: Destination
): void {
  doc.addPage();
  
  // Page header
  doc.fontSize(SIZES.heading)
     .font(FONTS.header)
     .fillColor(COLORS.primary)
     .text('AUTHENTIC LOCAL EXPERIENCES', SIZES.margin, SIZES.margin);
     
  // Decorative underline
  doc.moveTo(SIZES.margin, SIZES.margin + SIZES.heading + 5)
     .lineTo(SIZES.margin + 250, SIZES.margin + SIZES.heading + 5)
     .lineWidth(2)
     .stroke(COLORS.accent);
     
  // Introduction text
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Immerse yourself in the local culture of ${destination.name} with these authentic experiences carefully selected by our travel experts.`, 
           SIZES.margin, SIZES.margin + SIZES.heading + 15, {
       width: doc.page.width - (SIZES.margin * 2),
       align: 'justify'
     });
  
  // List each experience in a card-like format
  let yPosition = doc.y + 20;
  
  experiences.slice(0, 4).forEach((experience, index) => {
    // Check if we need to add a new page
    if (yPosition > doc.page.height - 150) {
      doc.addPage();
      yPosition = SIZES.margin;
      
      // Add continuation header
      doc.fontSize(SIZES.heading)
         .font(FONTS.header)
         .fillColor(COLORS.primary)
         .text('AUTHENTIC LOCAL EXPERIENCES (CONTINUED)', SIZES.margin, SIZES.margin);
         
      // Decorative underline
      doc.moveTo(SIZES.margin, SIZES.margin + SIZES.heading + 5)
         .lineTo(SIZES.margin + 350, SIZES.margin + SIZES.heading + 5)
         .lineWidth(2)
         .stroke(COLORS.accent);
         
      yPosition = SIZES.margin + SIZES.heading + 15;
    }
    
    // Experience card
    const cardHeight = 110;
    const boxColor = index % 2 === 0 ? '#f0f9ff' : '#eff6ff';
    
    doc.roundedRect(SIZES.margin, yPosition, doc.page.width - (SIZES.margin * 2), cardHeight, 5)
       .fill(boxColor);
       
    // Experience title
    doc.fontSize(SIZES.subheading)
       .font(FONTS.subheader)
       .fillColor(COLORS.primary)
       .text(experience.title, SIZES.margin + 15, yPosition + 15, {
         width: doc.page.width - (SIZES.margin * 2) - 30
       });
       
    // Location and type
    doc.fontSize(SIZES.small)
       .font(FONTS.emphasis)
       .fillColor(COLORS.gray)
       .text(`${experience.location} | ${experience.type}`, SIZES.margin + 15, doc.y + 5, {
         width: doc.page.width - (SIZES.margin * 2) - 30
       });
       
    // Description
    doc.fontSize(SIZES.normal)
       .font(FONTS.body)
       .fillColor(COLORS.dark)
       .text(experience.description, SIZES.margin + 15, doc.y + 10, {
         width: doc.page.width - (SIZES.margin * 2) - 30
       });
    
    yPosition += cardHeight + 15;
  });
  
  // Add a footer with the destination name
  addPageFooter(doc, `${destination.name} - Local Experiences Guide`);
}

/**
 * Add a practical information page with useful travel tips
 */
function addPracticalInfoPage(
  doc: PDFKit.PDFDocument,
  destination: Destination
): void {
  doc.addPage();
  
  // Page header
  doc.fontSize(SIZES.heading)
     .font(FONTS.header)
     .fillColor(COLORS.primary)
     .text('PRACTICAL INFORMATION', SIZES.margin, SIZES.margin);
     
  // Decorative underline
  doc.moveTo(SIZES.margin, SIZES.margin + SIZES.heading + 5)
     .lineTo(SIZES.margin + 200, SIZES.margin + SIZES.heading + 5)
     .lineWidth(2)
     .stroke(COLORS.accent);
     
  // Introduction
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Essential information to help you make the most of your trip to ${destination.name}.`, 
           SIZES.margin, SIZES.margin + SIZES.heading + 15, {
       width: doc.page.width - (SIZES.margin * 2)
     });
     
  const sectionsY = doc.y + 20;
  const colWidth = (doc.page.width - (SIZES.margin * 2) - SIZES.gutter) / 2;
  
  // Left column
  let leftColY = sectionsY;
  
  // Currency section
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('CURRENCY & MONEY', SIZES.margin, leftColY);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Currency: ${destination.currency || 'Local currency'}\nCredit cards are widely accepted in most establishments. It's advisable to carry some local currency for small purchases and in remote areas.`, 
           SIZES.margin, leftColY + 20, {
       width: colWidth
     });
     
  // Language section
  leftColY = doc.y + 20;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('LANGUAGE', SIZES.margin, leftColY);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`The official language is ${destination.language || 'the local language'}. English is spoken in many tourist areas and establishments.`, 
           SIZES.margin, leftColY + 20, {
       width: colWidth
     });
     
  // Transportation section
  leftColY = doc.y + 20;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('GETTING AROUND', SIZES.margin, leftColY);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Public transportation is ${destination.transportationRating || 'available'} and includes buses, taxis, and possibly metro/subway systems. Ridesharing apps may also be available.`, 
           SIZES.margin, leftColY + 20, {
       width: colWidth
     });
  
  // Right column
  let rightColY = sectionsY;
  
  // Weather section
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('WEATHER & CLIMATE', SIZES.margin + colWidth + SIZES.gutter, rightColY);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Best time to visit: ${destination.bestTimeToVisit || 'Year-round'}\nThe climate is ${destination.climate || 'varied throughout the year'}. Check the current forecast before your trip.`, 
           SIZES.margin + colWidth + SIZES.gutter, rightColY + 20, {
       width: colWidth
     });
     
  // Safety section
  rightColY = sectionsY + 100;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('SAFETY & HEALTH', SIZES.margin + colWidth + SIZES.gutter, rightColY);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`${destination.name} is generally a safe destination for travelers. As with any trip, take standard precautions with your belongings and be aware of your surroundings. It's recommended to have travel insurance that covers medical expenses.`, 
           SIZES.margin + colWidth + SIZES.gutter, rightColY + 20, {
       width: colWidth
     });
     
  // Etiquette section
  rightColY = doc.y + 20;
  doc.fontSize(SIZES.subheading)
     .font(FONTS.subheader)
     .fillColor(COLORS.primary)
     .text('LOCAL ETIQUETTE', SIZES.margin + colWidth + SIZES.gutter, rightColY);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Respect local customs and traditions. Dress modestly when visiting religious sites. It's appreciated if you learn a few basic phrases in the local language.`, 
           SIZES.margin + colWidth + SIZES.gutter, rightColY + 20, {
       width: colWidth
     });
  
  // Emergency information box at the bottom
  const emergencyY = doc.y + 40;
  doc.roundedRect(SIZES.margin, emergencyY, doc.page.width - (SIZES.margin * 2), 80, 5)
     .fill('#fee2e2');
     
  doc.fontSize(SIZES.subheading)
     .font(FONTS.header)
     .fillColor('#ef4444')
     .text('EMERGENCY CONTACTS', SIZES.margin + 15, emergencyY + 15);
     
  doc.fontSize(SIZES.normal)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text(`Emergency Services: ${destination.emergencyNumber || '112/911 (general emergency)'}\nTourist Police: ${destination.touristPolice || 'Check locally'}\nNearest Hospital: ${destination.nearestHospital || 'Check locally'}\nEmbassy/Consulate: Check your country's diplomatic representation in ${destination.country}.`, 
           SIZES.margin + 15, emergencyY + 35, {
       width: doc.page.width - (SIZES.margin * 2) - 30
     });
     
  // Add a footer with the destination name
  addPageFooter(doc, `${destination.name} - Practical Travel Information`);
}

/**
 * Add a back cover to the PDF
 */
function addBackCover(
  doc: PDFKit.PDFDocument,
  options: EnhancedPDFOptions
): void {
  doc.addPage();
  
  // Background color
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fill(COLORS.primary);
  
  // White content area with rounded corners
  const contentMargin = 40;
  const contentWidth = doc.page.width - (contentMargin * 2);
  const contentHeight = doc.page.height - (contentMargin * 2);
  
  doc.roundedRect(contentMargin, contentMargin, contentWidth, contentHeight, 10)
     .fill(COLORS.light);
     
  // Thank you message
  doc.fontSize(SIZES.heading * 1.2)
     .font(FONTS.header)
     .fillColor(COLORS.primary)
     .text('THANK YOU', contentMargin + 30, contentMargin + 60, {
       align: 'center',
       width: contentWidth - 60
     });
     
  // Message
  const messageY = contentMargin + 120;
  doc.fontSize(SIZES.normal * 1.2)
     .font(FONTS.body)
     .fillColor(COLORS.dark)
     .text('We hope this itinerary helps you create amazing memories on your journey. Safe travels!', 
           contentMargin + 30, messageY, {
       align: 'center',
       width: contentWidth - 60
     });
     
  // Company info
  if (options.showBranding) {
    const companyY = doc.page.height - contentMargin - 120;
    
    doc.fontSize(SIZES.subheading)
       .font(FONTS.header)
       .fillColor(COLORS.primary)
       .text(options.companyName || 'Deep Travel Collections', contentMargin + 30, companyY, {
         align: 'center',
         width: contentWidth - 60
       });
       
    doc.fontSize(SIZES.normal)
       .font(FONTS.body)
       .fillColor(COLORS.gray)
       .text('Crafting unforgettable travel experiences', contentMargin + 30, companyY + 30, {
         align: 'center',
         width: contentWidth - 60
       });
       
    if (options.contactInfo) {
      doc.fontSize(SIZES.normal)
         .font(FONTS.light)
         .fillColor(COLORS.gray)
         .text(options.contactInfo, contentMargin + 30, companyY + 60, {
           align: 'center',
           width: contentWidth - 60
         });
    }
  }
}

/**
 * Add a consistent footer to pages
 */
function addPageFooter(
  doc: PDFKit.PDFDocument,
  text: string
): void {
  const pageNumber = doc.bufferedPageRange().count;
  
  doc.fontSize(SIZES.small)
     .font(FONTS.light)
     .fillColor(COLORS.gray)
     .text(
       `${text} | Page ${pageNumber}`,
       SIZES.margin,
       doc.page.height - SIZES.margin / 2,
       { align: 'center', width: doc.page.width - (SIZES.margin * 2) }
     );
}