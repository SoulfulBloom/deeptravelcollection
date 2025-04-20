import { db } from "./db";
import { snowbirdDestinations } from "../shared/schema";

/**
 * This script adds predefined Mérida snowbird destination to the database
 */
async function addMeridaPreset() {
  try {
    console.log('Adding Mérida, Mexico as a Snowbird Alternative with preset data...');
    
    // Define the destination with predefined content
    const dest = {
      name: "Mérida",
      country: "Mexico",
      region: "North America",
      image_url: "https://images.unsplash.com/photo-1582225632302-772578827d48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      avg_winter_temp: "24°C (75°F)",
      cost_comparison: "30-40% savings compared to Florida",
      description: "Nestled in Mexico's Yucatán Peninsula, Mérida offers Canadian snowbirds a perfect winter escape with its colonial charm, vibrant culture, and warm climate. The city boasts a unique blend of Mayan heritage and Spanish influences, evident in its colorful architecture, cuisine, and traditions. With year-round temperatures averaging 24°C in winter, Mérida provides reliable sunshine without Florida's humidity or hurricane risks. The city's affordable cost of living, excellent healthcare, and growing expat community make it increasingly popular among Canadians seeking authentic cultural immersion alongside modern amenities and safety.",
      visa_requirements: "Canadians can enter Mexico as tourists for 180 days visa-free with just a valid passport. For stays beyond 180 days, you'll need to exit and re-enter the country or apply for a Temporary Resident Visa (visa de residente temporal) at a Mexican consulate in Canada before traveling. This visa allows stays of 1-4 years and requires proof of financial solvency (approximately $2,200 CAD monthly income). Many snowbirds use the tourist entry which is simpler, though the exact days granted is at the immigration officer's discretion, so clearly state your intended stay length.",
      healthcare_access: "Mérida features excellent healthcare with several JCI-accredited private hospitals including Star Médica, Clínica de Mérida, and Centro Médico de las Américas. Medical costs are typically 50-70% lower than Canadian prices for out-of-pocket expenses. Most doctors are bilingual and many are U.S. trained. Purchase travel insurance with coverage for Mexico (around $125-200 CAD monthly depending on age/conditions). For prescription medications, pharmacies are plentiful and many medications are available without prescription. Consider signing up with IMSS, Mexico's public healthcare system, for approximately $500 CAD annually as an affordable backup option.",
      avg_accommodation_cost: "Long-term rentals in Mérida range from $600-1,200 CAD monthly for a comfortable 1-2 bedroom property. The Centro Histórico offers colonial charm at premium prices ($800-1,500 CAD), while northern neighborhoods like Montebello or Altabrisa provide modern amenities at moderate rates ($700-1,200 CAD). For luxury accommodations with pools and extensive gardens, expect $1,200-2,000 CAD monthly. Many snowbird rentals come furnished with utilities included. Pro tip: Prices drop significantly for 3+ month commitments, and booking directly through local property managers rather than international sites can save 15-20%.",
      flight_time: "Direct flights from Toronto to Mérida take approximately 4.5 hours. From Vancouver, flights typically require a connection in Mexico City or Dallas, with total journey times of 8-10 hours. Airlines serving this route include Aeromexico, WestJet (seasonally), and Air Canada (via connections). Consider flying into Cancún (a 3.5-hour drive from Mérida) for more direct flight options and potentially lower fares, especially during winter months when competition increases demand for Caribbean destinations.",
      language_barrier: "While Spanish is the primary language in Mérida, English proficiency varies throughout the city. In tourist areas, upscale restaurants, and among healthcare professionals, finding English speakers is relatively easy. However, in day-to-day interactions like grocery shopping or dealing with utilities, basic Spanish knowledge is highly beneficial. The expatriate community offers language exchange programs and affordable Spanish classes specifically designed for retirees. Many Canadians find the language barrier moderate but manageable with translation apps and patience from locals who are generally friendly and helpful toward foreigners trying to communicate.",
      canadian_expats: "Mérida hosts a thriving Canadian expat community of approximately 3,000-4,000 people, with numbers swelling during winter months. The Canadian Club of Mérida organizes regular social events, charity functions, and informational sessions. Facebook groups like 'Canadians in Mérida' and 'Mérida Snowbirds' provide valuable resources and connections. The city's North American presence is well-established, with neighborhoods like García Ginerés and Colonia México particularly popular among Canadian residents. Many expats volunteer at local charities or participate in cultural exchange activities, creating a supportive network that helps newcomers navigate healthcare, housing, and practical living concerns.",
      best_time_to_visit: "The optimal period for Canadian snowbirds in Mérida spans November through March. These months offer perfect weather with daytime temperatures of 24-29°C (75-84°F) and pleasantly cool evenings around 15-18°C (59-64°F). Humidity levels are significantly lower during this dry season, making outdoor activities comfortable. December through February provides the most reliable weather with minimal rainfall. April and May become increasingly hot, often exceeding 35°C (95°F) with high humidity, making these months less comfortable. The hurricane season (June-October) brings higher humidity and occasional heavy rainfall, though Mérida's inland location protects it from the worst coastal weather effects.",
      local_tips: "1. For more authentic and affordable experiences, explore the Mercado Lucas de Gálvez rather than tourist markets - prices are often 40-50% lower and the cultural immersion is unmatched. 2. Join the Sunday morning 'Bici Ruta' when main streets close to cars, allowing cyclists and pedestrians to safely enjoy the colonial architecture - many expats gather at Café Créme afterward. 3. Purchase a reloadable 'INAPAM' card if you're over 60, which provides significant discounts (25-50%) on transportation, cultural events, and even some restaurants and pharmacies - available at the government office on Calle 69.",
      cost_of_living: "Monthly expenses in Mérida typically range $1,500-2,200 CAD for a couple, compared to $3,000-4,500 in Florida. Accommodation: $600-1,200 for a comfortable 1-2 bedroom rental vs. $1,500-2,500 in Florida. Utilities: Electricity $50-150 (higher with AC usage), water $15, internet $30 vs. $200-350 total in Florida. Groceries: $350-450 for a couple, with local markets offering significant savings vs. $600-800 in Florida. Dining out: $5-15 for casual local meals, $15-30 for upscale dining vs. double those prices in Florida. Healthcare: Out-of-pocket doctor visits $25-40 vs. $100-200 in the US. Transportation: $200 monthly including occasional taxis and car rental vs. $400+ in car-dependent Florida locations. Entertainment: Cultural events and activities $100-200 vs. $300-500 in tourist-priced Florida."
    };

    try {
      // Insert the snowbird destination
      await db.insert(snowbirdDestinations).values(dest);
      
      console.log(`✅ Added ${dest.name}, ${dest.country} to snowbird destinations`);
    } catch (error) {
      console.error(`Error inserting content for ${dest.name}:`, error);
    }
    
    console.log('Mérida snowbird destination added successfully!');
    
  } catch (error) {
    console.error('Failed to add Mérida snowbird destination:', error);
  }
}

// Run the function
addMeridaPreset().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});