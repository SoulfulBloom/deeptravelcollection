/**
 * Optimized prompts for the itinerary generators
 * 
 * These prompts are carefully crafted to produce high-quality itinerary content
 * with specific details, formatting, and structured information.
 */

/**
 * System prompt for premium itinerary generation
 * 
 * Instructs the AI to create detailed, authentic travel content with specific locations
 * and insider information as a premium travel expert.
 */
export const PREMIUM_SYSTEM_PROMPT = `
You are a premium travel expert with deep knowledge of {{destination}}, {{country}}. 
Create authentic, detailed travel content with the following characteristics:

1. Use specific venue names, addresses, and opening hours where relevant
2. Include approximate costs for activities and dining options in local currency
3. Note insider tips that typical tourists wouldn't know
4. Consider local transportation options and walking times between locations
5. Mention seasonal considerations and weather if relevant
6. Format content with clear Markdown headers and sections
7. Provide a balance of popular attractions and authentic local experiences

Your content should read like it was written by someone who lives in {{destination}} and
has insider knowledge of the city's best experiences.
`;

/**
 * System prompt optimized for resilient, reliable generation
 * 
 * A more concise prompt that focuses on reliability and key information
 * while being less token-intensive.
 */
export const RESILIENT_SYSTEM_PROMPT = `
You are a travel expert creating content for {{destination}}, {{country}}.
Focus on:
- Authentic local experiences
- Specific venue names and details
- Practical travel information
- Clear markdown formatting with headers

Be concise but informative, focusing on providing useful travel advice.
`;

/**
 * Comprehensive prompt for generating a full premium itinerary
 * 
 * This detailed prompt ensures high-quality output with specific expectations
 * for each day structure, accommodation options, and practical information.
 */
export const PREMIUM_ITINERARY_PROMPT = `
Create a premium 7-day itinerary for {{destination}}, {{country}} with the following structure:

1. Introduction to {{destination}} (what makes it special, best time to visit)
   - Format as a Markdown H1 header with title
   - Include brief overview (150-200 words)

2. For each day (Days 1-7):
   - Create a theme for the day (e.g., "Day 3: Historical Exploration")
   - Format as a Markdown H2 header
   - Structure each day with sections for:
     * Morning activities with specific venues, opening hours, costs
     * Lunch recommendation with cuisine type, price range, signature dishes
     * Afternoon activities with specific venues, opening hours, costs
     * Evening/dinner recommendation with ambiance description, price range
     * Accommodation options (budget, mid-range, luxury) with neighborhood
   - Include ONE insider tip for each day that most tourists wouldn't know
   - Note transportation options between locations

3. Practical information section:
   - Format as a Markdown H2 header
   - Include local customs, tipping practices, cultural considerations
   - Transportation options within the city
   - Safety information
   - Language tips if relevant

Make the content authentic, specific, and premium in quality. Focus on experiences
that go beyond standard tourist attractions.
`;

/**
 * Prompt for generating a single day of an itinerary
 * 
 * Focuses on creating detailed content for a specific day with structured sections
 * and practical details.
 */
export const PREMIUM_DAY_PROMPT = `
Create a detailed Day {{day_number}} for a premium 7-day itinerary in {{destination}}, {{country}}.

Structure the day with the following sections:
1. Give the day a theme or focus (e.g., "Cultural Immersion" or "Nature and Adventure")
2. Morning activities with 2-3 specific venues/attractions including:
   - Exact names of places
   - Approximate opening hours
   - Estimated costs in local currency
   - What makes each place special
3. Lunch recommendation:
   - Specific restaurant name and location
   - Type of cuisine and 1-2 suggested dishes
   - Price range
   - Any reservation tips
4. Afternoon activities with 2-3 venues/attractions with same details as morning
5. Evening plan including dinner recommendation:
   - Restaurant or evening activity suggestion
   - Why it's special for the destination
   - Price range and practical details
6. Accommodation recommendations:
   - One budget, one mid-range, and one luxury option
   - Brief description of each and their neighborhoods
7. Insider tip of the day:
   - Something only locals would typically know

Format with proper Markdown for readability (H2 for day title, H3 for sections).
Be specific, detailed and authentic - avoid generic advice.
`;

/**
 * Prompt for generating a specific section of a day (for chunked generator)
 * 
 * This prompt is designed to generate smaller pieces of content to enable
 * chunked generation for reduced token usage and improved reliability.
 */
export const PREMIUM_DAY_CHUNK_PROMPT = `
For Day {{day_number}} of a premium itinerary in {{destination}}, {{country}}, create detailed content for the {{section}} section only.

If this is a Morning or Afternoon section:
- Recommend 2-3 specific attractions or activities
- Include exact venue names, locations, and why they're worth visiting
- Note approximate cost in local currency and opening hours
- Mention approximate time needed at each location
- Include any practical tips (best entrance, quietest time to visit, etc.)

If this is a Lunch or Evening section:
- Recommend a specific restaurant with its name and location
- Mention 1-2 signature dishes to try
- Note cuisine type and price range
- Include any reservation recommendations or busy periods to avoid

If this is an Accommodation section:
- Provide options at different price points (budget, mid-range, luxury)
- Mention specific neighborhoods and their advantages
- Include any special amenities or standout features

Be specific, authentic, and include details that show insider knowledge of {{destination}}.
Write in a professional but engaging tone appropriate for a premium travel guide.
`;

/**
 * Prompt for generating a specific single day (for resilient generator)
 * 
 * More concise and token-efficient prompt for generating a single day
 * when reliability is a primary concern.
 */
export const SINGLE_DAY_PROMPT = `
Create a detailed Day {{day_number}} for a 7-day itinerary in {{destination}}, {{country}}.

IMPORTANT FORMATTING INSTRUCTIONS:
1. Start with a level 1 heading: "# Day {{day_number}}: [Title for the day]"
2. Use level 2 headings for sections:
   - "## Morning Activities"
   - "## Lunch Recommendation"
   - "## Afternoon Activities"
   - "## Evening/Dinner Plan"

Include the following:
- Morning activities (specific places, costs, opening hours)
- Lunch recommendation (restaurant name, cuisine, price range)
- Afternoon activities (specific places, costs, opening hours)
- Evening/dinner plan
- One accommodation option
- One insider tip

Be specific with venue names and details.
`;

/**
 * Prompt for generating the introduction to an itinerary
 */
export const INTRODUCTION_PROMPT = `
Write an engaging introduction for a 7-day premium itinerary to {{destination}}, {{country}}.
Include what makes this destination special, the best time to visit, and what travelers
can expect from this itinerary. Format the title as a Markdown H1 header and keep the
content engaging but concise (max 250 words).
`;

/**
 * Prompt for generating practical information section
 */
export const PRACTICAL_INFO_PROMPT = `
Create a practical information section for travelers visiting {{destination}}, {{country}}.
Include details about:
- Local transportation options and how to get around
- Currency and payment methods (including tipping customs)
- Local etiquette and cultural considerations
- Safety tips and emergency information
- Language considerations
- Weather and what to pack

Format this as a "Practical Information" section with a Markdown H2 header and use H3 subheaders
for different categories. Keep the information concise, practical, and specific to this destination.
`;

/**
 * Prompt for generating a regional guide
 * 
 * Used for creating content about a broader region that includes multiple destinations.
 */
export const REGIONAL_GUIDE_PROMPT = `
Create a comprehensive regional guide for {{region}}, highlighting:

1. Geographic overview and main destinations in the region
2. Best times to visit with seasonal considerations
3. Transportation options between destinations
4. Cultural highlights and unique aspects of the region
5. Recommended route for a 10-14 day itinerary through the region
6. 3-5 must-see attractions or experiences
7. Practical tips specific to traveling in this region

Format with clear Markdown headers and be specific in your recommendations.
`;

/**
 * Prompt for generating authentic local experiences
 */
export const AUTHENTIC_EXPERIENCES_PROMPT = `
Generate three authentic local experiences for {{destination}}, {{country}} that go beyond typical tourist activities.

For each experience:
1. Create a compelling title that captures its essence
2. Describe the experience in detail (100-150 words)
3. Explain why it's culturally significant
4. Provide practical details (location, cost, timing, how to arrange)
5. Include one insider tip that makes the experience special

Focus on experiences that:
- Connect travelers with local people or traditions
- Provide genuine cultural understanding
- Are accessible but not commonly found in standard guidebooks
- Represent the authentic character of {{destination}}

Format each experience with Markdown headers and use engaging, descriptive language.
`;

/**
 * Prompt for generating a destination comparison
 */
export const DESTINATION_COMPARISON_PROMPT = `
Create a detailed comparison between {{destination1}} and {{destination2}} for travelers deciding between these locations.

Compare the following aspects:
1. Overall travel experience and atmosphere
2. Costs and budget considerations
3. Main attractions and activities
4. Food and culinary experiences
5. Accommodations and neighborhoods
6. Ease of travel and getting around
7. Best time to visit each
8. Ideal traveler profile for each destination

For each category, highlight strengths and weaknesses of both destinations and provide specific examples.
Format with clear Markdown headers and conclude with a summary of which destination might be better for different types of travelers.
`;

/**
 * Prompt for generating specialized itineraries
 */
export const SPECIALTY_ITINERARY_PROMPT = `
Create a specialized 7-day itinerary for {{destination}}, {{country}} focused on {{theme}} experiences.

Structure each day with:
1. A daily theme that connects to the overall {{theme}} focus
2. Morning, lunch, afternoon, and evening recommendations
3. Specific venues, experiences, and activities that showcase {{theme}}
4. Local insights and context about how {{theme}} is expressed in this destination
5. Practical details (costs, opening hours, reservation needs)

Make the itinerary cohesive while still providing variety. Include both mainstream and hidden gem experiences related to {{theme}}.
Use proper Markdown formatting with clear headers and provide specific details that would be valuable to travelers interested in {{theme}}.
`;