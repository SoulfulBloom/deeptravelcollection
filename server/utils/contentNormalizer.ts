/**
 * Content Normalizer
 * 
 * Standardizes content formatting to ensure consistency across different generators
 * and make pattern extraction more reliable.
 */

/**
 * Normalize markdown content by standardizing heading formats, section markers, etc.
 * This helps ensure consistent extraction regardless of how content was generated.
 * 
 * @param content - The original content to normalize
 * @returns Standardized content
 */
export function normalizeContent(content: string): string {
  if (!content) return '';
  
  // Create a modified copy to work with
  let normalized = content;
  
  // Standardize day headings (convert various formats to consistent "# Day X: Title" format)
  normalized = standardizeDayHeadings(normalized);
  
  // Standardize section headings (Morning, Afternoon, Evening, etc.)
  normalized = standardizeSectionHeadings(normalized);
  
  // Standardize content structure
  normalized = standardizeContentStructure(normalized);
  
  return normalized;
}

/**
 * Standardize day headings to a consistent format
 * 
 * @param content - The content to standardize
 * @returns Content with standardized day headings
 */
function standardizeDayHeadings(content: string): string {
  let result = content;
  
  // Handle variations in heading levels (# vs ## vs ###)
  // Convert any level Day X heading to "# Day X"
  result = result.replace(/^#{1,3}\s*Day\s+(\d+)(?:: |\s-\s|\s|\:)/gm, '# Day $1: ');
  
  // Convert "### Day X" to "# Day X"
  result = result.replace(/^### Day (\d+)(?:: |\s-\s|\s)/gm, '# Day $1: ');
  
  // Convert "## Day X" to "# Day X"
  result = result.replace(/^## Day (\d+)(?:: |\s-\s|\s)/gm, '# Day $1: ');
  
  // Convert "# Day X Itinerary" to "# Day X: Itinerary"
  result = result.replace(/^# Day (\d+) Itinerary/gm, '# Day $1: Itinerary');
  
  // Ensure all "# Day X" without a colon have one
  result = result.replace(/^# Day (\d+)(?!\:)(\s+)([A-Z])/gm, '# Day $1:$2$3');
  
  // Handle "Day X: Title" (no hash)
  result = result.replace(/^Day (\d+)(?:: |\s-\s|\:)/gm, '# Day $1: ');
  
  // Handle "Day X" (no hash, no colon)
  result = result.replace(/^Day (\d+)(?!\:)(\s+)([A-Z])/gm, '# Day $1:$2$3');
  
  return result;
}

/**
 * Standardize section headings to a consistent format
 * 
 * @param content - The content to standardize
 * @returns Content with standardized section headings
 */
function standardizeSectionHeadings(content: string): string {
  let result = content;
  
  // Standardize Morning sections - handle variations in heading styles
  result = result.replace(/^#{1,3}\s*Morning(?:\s+Activities)?/gim, '## Morning Activities');
  result = result.replace(/^### Morning/gm, '## Morning Activities');
  result = result.replace(/^## Morning(?!\s+Activities)/gm, '## Morning Activities');
  result = result.replace(/^\*\*Morning Activities\*\*/gm, '## Morning Activities');
  result = result.replace(/^Morning:/gm, '## Morning Activities');
  result = result.replace(/^Morning Activities:/gm, '## Morning Activities');
  
  // Standardize Lunch sections - handle variations in heading styles
  result = result.replace(/^#{1,3}\s*Lunch(?:\s+Recommendation)?/gim, '## Lunch Recommendation');
  result = result.replace(/^### Lunch/gm, '## Lunch Recommendation');
  result = result.replace(/^## Lunch(?!\s+Recommendation)/gm, '## Lunch Recommendation');
  result = result.replace(/^\*\*Lunch Recommendation\*\*/gm, '## Lunch Recommendation');
  result = result.replace(/^Lunch:/gm, '## Lunch Recommendation');
  result = result.replace(/^Lunch Recommendation:/gm, '## Lunch Recommendation');
  
  // Standardize Afternoon sections - handle variations in heading styles
  result = result.replace(/^#{1,3}\s*Afternoon(?:\s+Activities)?/gim, '## Afternoon Activities');
  result = result.replace(/^### Afternoon/gm, '## Afternoon Activities');
  result = result.replace(/^## Afternoon(?!\s+Activities)/gm, '## Afternoon Activities');
  result = result.replace(/^\*\*Afternoon Activities\*\*/gm, '## Afternoon Activities');
  result = result.replace(/^Afternoon:/gm, '## Afternoon Activities');
  result = result.replace(/^Afternoon Activities:/gm, '## Afternoon Activities');
  
  // Standardize Evening sections - handle variations in heading styles
  result = result.replace(/^#{1,3}\s*Evening(?:\s+Activities|\s*\/\s*Dinner\s+Plan)?/gim, '## Evening/Dinner Plan');
  result = result.replace(/^### Evening/gm, '## Evening/Dinner Plan');
  result = result.replace(/^## Evening(?!\s*\/\s*Dinner\s+Plan)/gm, '## Evening/Dinner Plan');
  result = result.replace(/^\*\*Evening Activities\*\*/gm, '## Evening/Dinner Plan');
  result = result.replace(/^\*\*Evening\/Dinner Plan\*\*/gm, '## Evening/Dinner Plan');
  result = result.replace(/^Evening:/gm, '## Evening/Dinner Plan');
  result = result.replace(/^Evening Activities:/gm, '## Evening/Dinner Plan');
  result = result.replace(/^Dinner:/gm, '## Evening/Dinner Plan');
  
  return result;
}

/**
 * Standardize content structure
 * 
 * @param content - The content to standardize
 * @returns Content with standardized structure
 */
function standardizeContentStructure(content: string): string {
  let result = content;
  
  // Ensure blank line after headings
  result = result.replace(/^(#+ .+)(?!\n\n)/gm, '$1\n');
  
  // Convert duplicate blank lines to single blank lines
  result = result.replace(/\n{3,}/g, '\n\n');
  
  // Check if content has all 7 days (for 7-day itineraries)
  const dayRegex = /# Day (\d+):/g;
  let match;
  const foundDays = [];
  while ((match = dayRegex.exec(result)) !== null) {
    foundDays.push(parseInt(match[1]));
  }
  
  // If we're missing days, try to detect and add them
  if (foundDays.length > 0) {
    const maxDay = Math.max(...foundDays);
    if (maxDay <= 7) {
      // For each possible day number
      for (let day = 1; day <= 7; day++) {
        // If we don't have this day
        if (!foundDays.includes(day)) {
          console.log(`Content normalizer: Day ${day} missing, attempting to detect and insert`);
          
          // Look for section headers that might indicate a day boundary
          const dayPattern = new RegExp(`(?<=\\n\\n|^)(?!# )((Morning Activities|Afternoon Activities|Evening\\/Dinner Plan|Lunch Recommendation)(?:\\n|\\r\\n|\\r))`, 'i');
          const dayMatches = result.match(dayPattern);
          
          if (dayMatches) {
            // Insert the day header before the first section header
            const insertion = `# Day ${day}: Itinerary\n\n`;
            result = result.replace(dayPattern, match => `${insertion}${match}`);
            console.log(`Content normalizer: Added missing header for Day ${day}`);
          }
        }
      }
    }
  }
  
  return result;
}

/**
 * Normalize a day's content specifically
 * 
 * @param dayContent - Content for a specific day
 * @param dayNumber - The day number
 * @returns Normalized day content
 */
export function normalizeDayContent(dayContent: string, dayNumber: number): string {
  if (!dayContent) return '';
  
  let normalized = dayContent;
  
  // If day heading isn't present, add it
  if (!normalized.match(/^# Day \d+/m)) {
    // Check if we have a title-like first line
    const firstLineMatch = normalized.match(/^(.+)(\r?\n)/);
    let title = "Itinerary";
    
    if (firstLineMatch && !firstLineMatch[1].includes('##') && !firstLineMatch[1].includes('Morning') 
        && !firstLineMatch[1].includes('Afternoon') && !firstLineMatch[1].includes('Evening')) {
      // Extract the title from the first line
      title = firstLineMatch[1].trim();
      // Remove the original title line if we're using it as our day title
      normalized = normalized.substring(firstLineMatch[0].length);
    }
    
    // Add the day header with the extracted title or default "Itinerary"
    normalized = `# Day ${dayNumber}: ${title}\n\n${normalized}`;
  }
  
  // Ensure we have all standard sections
  const hasMorning = normalized.match(/## Morning Activities/i);
  const hasLunch = normalized.match(/## Lunch/i);
  const hasAfternoon = normalized.match(/## Afternoon Activities/i);
  const hasEvening = normalized.match(/## Evening/i);
  
  // Add missing sections with placeholders if they don't exist
  if (!hasMorning) {
    normalized += '\n\n## Morning Activities\nExplore the local area and enjoy breakfast at a nearby café.\n';
  }
  if (!hasLunch) {
    normalized += '\n\n## Lunch Recommendation\nTry a local restaurant for an authentic meal experience.\n';
  }
  if (!hasAfternoon) {
    normalized += '\n\n## Afternoon Activities\nVisit attractions and immerse yourself in the local culture.\n';
  }
  if (!hasEvening) {
    normalized += '\n\n## Evening/Dinner Plan\nEnjoy dinner at a recommended restaurant and relax for the evening.\n';
  }
  
  // Call the general normalizer
  return normalizeContent(normalized);
}