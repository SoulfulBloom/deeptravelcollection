/**
 * Details Formatter Utility
 * 
 * Properly formats structured details from itinerary activity text
 * by extracting and normalizing location, cost, hours, etc.
 */

/**
 * Represents a formatted detail extracted from text
 */
interface TextDetail {
  label: string;
  value: string;
}

/**
 * Sanitize text coming from OpenAI that might have formatting issues
 * 
 * @param text The raw text with potential formatting issues
 * @returns Cleaned text with proper formatting
 */
export function sanitizeOpenAIText(text: string): string {
  if (!text) return '';
  
  // First, detect and handle schematized/structured data that looks like object notation
  // This pattern appears when OpenAI returns JSON-like structures inside text
  const hasStructuredData = /•?\s*(Description|Price Range|Cost|Address|Opening Hours|Location):\s*/.test(text) ||
                          /\s*-\s*(Description|Price Range|Cost|Address|Opening Hours|Location):\s*/.test(text);
                          
  if (hasStructuredData) {
    // Convert the structured format to something more readable
    return cleanStructuredText(text);
  }
  
  // Standard text sanitization for non-structured text
  let sanitized = text
    // Replace weird line break patterns with proper spacing
    .replace(/(\w)(\n|\r)+(\w)/g, '$1 $3')
    
    // Add proper line breaks before detail labels
    .replace(/(Location|Address|Cost|Price|Hours|Opening|Website|Phone|Tip|Note|Reservation|Admission|Fee):/gi, '\n$1:')
    
    // Fix running text where sections are combined without proper breaks
    .replace(/(\.)(\s*)(Location|Address|Cost|Price|Hours|Opening|Website|Phone)/g, '$1\n$3')
    
    // Ensure consistent newlines
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    
    // Fix cases where multiple details are on the same line
    .replace(/(Location|Address|Cost|Price|Hours|Opening):(.*?)(Cost|Price|Hours|Opening|Website|Phone)/gi, '$1:$2\n$3')
    
    // Remove excessive line breaks (more than 2 consecutive)
    .replace(/\n{3,}/g, '\n\n')
    
    // Fix cases where text runs into detail labels without spaces
    .replace(/(\w)(Location|Address|Cost|Price|Hours)/g, '$1 $2');
  
  return sanitized;
}

/**
 * Clean structured text that looks like it came from JSON or schema objects
 * 
 * @param text The structured text to clean
 * @returns Human-readable text
 */
function cleanStructuredText(text: string): string {
  // Remove JSON-like structures and bullet points while preserving the content
  let cleaned = text
    // Remove bullet points, asterisks and similar markers
    .replace(/^[•\-\*]\s*/gm, '')
    
    // Convert schema-like description labels to consistent format
    .replace(/^\s*(Description|Price Range|Cost|Address|Opening Hours|Location):\s*/gm, '$1: ')
    
    // Normalize attribute style formatting with indentation
    .replace(/^\s+(Description|Price Range|Cost|Address|Opening Hours|Location):/gm, '$1:')
    
    // Remove indentation at the start of continued text lines
    .replace(/^\s{2,}([^-•\*])/gm, '$1')
    
    // Fix nested schema structures
    .replace(/^\s{2,}-\s+(Description|Price Range|Cost|Address|Opening Hours|Location):/gm, '$1:')
    
    // Replace dashes and list markers before labels
    .replace(/^\s*-\s+(Description|Price Range|Cost|Address|Opening Hours|Location):/gm, '$1:')
    
    // Remove redundant field labels that might be part of value text
    .replace(/(Description|Price Range|Cost|Address|Opening Hours|Location):\s*\1:\s*/gi, '$1: ')
    
    // Ensure proper spacing after each detail
    .replace(/(Description|Price Range|Cost|Address|Opening Hours|Location):([^\n]+)/g, '$1:$2\n')
    
    // Clean up trailing whitespace
    .replace(/[ \t]+$/gm, '')
    
    // Remove excessive blank lines
    .replace(/\n{3,}/g, '\n\n');
    
  return cleaned;
}

/**
 * Clean the main activity text by removing detail sections
 * 
 * @param text Raw activity text
 * @returns Cleaned activity text without detail sections
 */
export function cleanActivityText(text: string): string {
  if (!text) return '';
  
  let cleanedText = text.trim();
  
  // Check if this is schema-formatted text
  const isSchemaFormatted = /^\s*(•|-|\*|\d+\.)\s*(Description|Location|Cost|Price|Hours|Address):/mi.test(text) ||
                          /^\s*(Description|Location|Cost|Price Range|Hours|Address):/mi.test(text);
  
  if (isSchemaFormatted) {
    // For schema-formatted text, try to extract only the description part
    const descriptionMatch = cleanedText.match(/(?:^|\n)\s*(?:[•\-\*]\s*)?(?:Description|Details):\s*([^\n]+((\n\s+[^\n]+)|(\n\s*(?![•\-\*]\s*[A-Z][a-z]+:)))*)/) ||
                            cleanedText.match(/^([^•\-\*\n]([^\n]|\n(?!\s*[•\-\*]\s*[A-Z][a-z]+:))*)/);
    
    if (descriptionMatch && descriptionMatch[1]) {
      // Return only the description part, without the "Description:" label
      const result = descriptionMatch[1].replace(/^Description:\s*/i, '').trim();
      return result || cleanedText.split('\n')[0]; // Fallback to first line if description is empty
    }
    
    // If we couldn't extract a description, just return the first non-detail line
    const lines = cleanedText.split('\n');
    for (const line of lines) {
      if (!line.match(/^\s*(?:[•\-\*]\s*)?(?:Description|Location|Cost|Price|Hours|Address|Website|Phone):/i)) {
        if (line.trim()) {
          return line.trim();
        }
      }
    }
    
    // Last resort: return the first line with any detail label removed
    return cleanedText.replace(/^\s*(?:[•\-\*]\s*)?(?:Description|Location|Cost|Price|Hours|Address|Website|Phone):\s*/i, '').split('\n')[0].trim();
  }
  
  // Standard approach for non-schema text
  // Remove location/address information
  cleanedText = cleanedText.replace(/^(Location|Address):[^\n]+(\n|$)/im, '');
  
  // Remove cost information
  cleanedText = cleanedText.replace(/^(Cost|Price|Fee|Admission|Price Range):[^\n]+(\n|$)/im, '');
  
  // Remove hours information
  cleanedText = cleanedText.replace(/^(Hours|Opening Hours|Times|Open):[^\n]+(\n|$)/im, '');
  
  // Remove any other common detail sections
  cleanedText = cleanedText.replace(/^(Website|Phone|Reservation|Booking|Contact):[^\n]+(\n|$)/im, '');
  
  // Handle bullet points at the start
  cleanedText = cleanedText.replace(/^[•\-\*]\s*/, '');
  
  // If we've removed too much, take the first sentence
  if (!cleanedText.trim() && text.trim()) {
    const firstSentence = text.trim().split(/\.\s+/)[0];
    return firstSentence.replace(/^[•\-\*]\s*/, '').trim();
  }
  
  return cleanedText.trim();
}

/**
 * Extract structured details from activity text
 * 
 * @param text Raw activity text
 * @returns Array of structured details with labels and values
 */
export function extractDetailsFromText(text: string): TextDetail[] {
  if (!text) return [];
  
  const details: TextDetail[] = [];
  
  // First, check for schema-like structured data pattern
  const schemaPatterns = [
    { pattern: /(Description|Details):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Description' },
    { pattern: /(Location|Address|Place):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Location' },
    { pattern: /(Cost|Price|Fee|Admission|Price Range):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Cost' },
    { pattern: /(Hours|Opening Hours|Times|Open|Operation Hours):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Hours' },
    { pattern: /(Website|URL|Online):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Website' },
    { pattern: /(Phone|Contact|Tel|Telephone):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Contact' },
    { pattern: /(Reservation|Booking):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Reservation' },
    { pattern: /(Tip|Tips|Note|Insider Tip):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Tip' },
    { pattern: /(Duration|Length|Visit Time):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Duration' },
    { pattern: /(Transport|Getting There):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Transport' },
    { pattern: /(Cuisine|Type of Food):\s*([^\n]+(\n\s+[^\n]+)*)/im, label: 'Cuisine' },
  ];
  
  // First look for structured schema-like content
  const isSchemaFormatted = /^\s*(•|-|\*|\d+\.)\s*(Description|Location|Cost|Price|Hours|Address):/mi.test(text);
  
  if (isSchemaFormatted) {
    // Process each line looking for schema-style details
    const lines = text.split('\n');
    let currentLabel: string | null = null;
    let currentValue = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Check if this line starts a new field
      let isNewField = false;
      for (const { pattern, label } of schemaPatterns) {
        const match = line.match(new RegExp(`^(?:[•\\-\\*]\\s*)?(${pattern.source.split(':')[0]}):\\s*(.+)`, 'i'));
        if (match) {
          // If we were building a previous field, save it
          if (currentLabel && currentValue) {
            details.push({
              label: currentLabel,
              value: currentValue.trim()
            });
          }
          
          // Start building a new field
          currentLabel = label;
          currentValue = match[2];
          isNewField = true;
          break;
        }
      }
      
      // If not a new field and we have a current label, append to current value
      if (!isNewField && currentLabel && line && !line.match(/^[•\-\*]\s*[A-Z]/)) {
        currentValue += ' ' + line;
      }
    }
    
    // Add the last field if we were building one
    if (currentLabel && currentValue) {
      details.push({
        label: currentLabel,
        value: currentValue.trim()
      });
    }
  } else {
    // Use the traditional line-by-line approach for more standard formatting
    const standardPatterns = [
      { pattern: /^(Location|Address):\s*(.+)(\n|$)/im, label: 'Location' },
      { pattern: /^(Cost|Price|Fee|Admission):\s*(.+)(\n|$)/im, label: 'Cost' },
      { pattern: /^(Hours|Opening Hours|Times|Open):\s*(.+)(\n|$)/im, label: 'Hours' },
      { pattern: /^(Website):\s*(.+)(\n|$)/im, label: 'Website' },
      { pattern: /^(Phone|Contact|Tel):\s*(.+)(\n|$)/im, label: 'Contact' },
      { pattern: /^(Reservation|Booking):\s*(.+)(\n|$)/im, label: 'Reservation' },
      { pattern: /^(Tip|Note):\s*(.+)(\n|$)/im, label: 'Note' },
    ];
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      for (const { pattern, label } of standardPatterns) {
        const match = line.match(pattern);
        if (match && match[2]) {
          details.push({
            label,
            value: match[2].trim()
          });
          break; // Once a match is found for a line, don't check other patterns
        }
      }
    }
  }
  
  // If we couldn't find any details using structured patterns, try to extract from inline text
  if (details.length === 0) {
    // Try to find location in parentheses
    const locationMatch = text.match(/\(([\w\s,]+location[\w\s,]*)\)/i) || 
                          text.match(/\(([\w\s,]+street[\w\s,]*)\)/i) ||
                          text.match(/\(([\w\s,]+address[\w\s,]*)\)/i) ||
                          text.match(/located at ([^\.]+)/i);
    
    if (locationMatch && (locationMatch[1] || locationMatch[0])) {
      details.push({
        label: 'Location',
        value: (locationMatch[1] || locationMatch[0]).trim().replace(/[\(\)]/g, '')
      });
    }
    
    // Try to find cost in parentheses or with $ symbol or Euro symbol
    const costMatch = text.match(/\(([\w\s,]+\$[\w\s,]*)\)/i) ||
                      text.match(/\(([\w\s,]+cost[\w\s,]*)\)/i) ||
                      text.match(/\(([\w\s,]+price[\w\s,]*)\)/i) ||
                      text.match(/\$[\d\.,]+(\s*-\s*\$[\d\.,]+)?/) ||
                      text.match(/€[\d\.,]+(\s*-\s*€[\d\.,]+)?/) ||
                      text.match(/(costs?|price|fee|admission)[:\s]+([^\.]+)/i);
    
    if (costMatch && (costMatch[2] || costMatch[0])) {
      details.push({
        label: 'Cost',
        value: (costMatch[2] || costMatch[0]).replace(/[\(\)]/g, '').trim()
      });
    }
    
    // Try to find opening hours
    const hoursMatch = text.match(/(\b(?:open|hours|opening|times)\b[^\.]+)/i);
    if (hoursMatch && hoursMatch[0]) {
      details.push({
        label: 'Hours',
        value: hoursMatch[0].replace(/^(open|hours|opening|times)[:\s]+/i, '').trim()
      });
    }
  }
  
  // Remove duplicate details (keep the first occurrence)
  const uniqueDetails: TextDetail[] = [];
  const labels = new Set<string>();
  
  for (const detail of details) {
    if (!labels.has(detail.label)) {
      labels.add(detail.label);
      uniqueDetails.push(detail);
    }
  }
  
  return uniqueDetails;
}