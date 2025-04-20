import { db } from "./db";
import { destinations } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Add more immersive descriptions to additional destinations
 */
async function addMoreImmersiveDescriptions() {
  try {
    // Get destinations without immersive descriptions
    const allDestinations = await db
      .select()
      .from(destinations)
      .where(eq(destinations.immersiveDescription, null));
    
    console.log(`Found ${allDestinations.length} destinations without immersive descriptions`);
    
    // Take the first 10 (or fewer if there are less)
    const destinationsToUpdate = allDestinations.slice(0, 10);
    
    // Sample immersive descriptions for additional destinations
    const descriptions = [
      "In Tokyo, ancient traditions flow beneath the neon glow as you join tea ceremonies performed by masters who've honed their craft over decades. Discover neighborhood izakayas where locals welcome you with sake toasts and culinary secrets passed down through generations.",
      "Amsterdam's true charm lies in its 'gezelligheid' – that untranslatable Dutch coziness felt when joining locals at canal-side cafés or in historic brown bars where strangers become friends. Cycle through hidden courtyards and witness how water shapes both the landscape and cultural identity.",
      "Prague invites you to lose yourself in its fairytale architecture while connecting with locals who share stories of resilience through coffee rituals in centuries-old cafés. Experience how Czech traditions of puppetry, folk music, and beer brewing create a uniquely immersive cultural tapestry.",
      "Cartagena's cobblestone streets pulse with Afro-Caribbean rhythms as local palenqueras share traditional fruits and stories of resilience. Step into family-run restaurants where grandmothers prepare ancestral recipes, revealing Colombia's soul through flavors and warm conversation.",
      "In Kyoto, ancient wisdom permeates everyday life – join morning meditation with monks, learn tea ceremony rituals from masters, and wander hidden gardens designed to connect humans with nature. Here, traditions aren't preserved for tourists but lived authentically.",
      "Marrakech's sensory tapestry unfolds as artisans in the medina invite you to witness centuries-old craft techniques while sharing mint tea and family stories. Experience the profound hospitality culture where strangers become honored guests through shared meals and cultural exchange.",
      "In Cape Town, apartheid's complex legacy transforms into hope through township tours led by residents who share personal stories of struggle and reconciliation. Connect with diverse communities through food, music, and meaningful conversations that reveal South Africa's ongoing journey.",
      "Vienna's coffee house culture transcends mere caffeine – join locals for hours of philosophical discussion, chess games, and artistic debate in marble-clad institutions where time slows down. Experience how Viennese traditions blend aristocratic grandeur with intimate community rituals.",
      "Havana wraps you in a time-bending embrace where music spills from doorways and locals share stories on sun-dappled plazas. Join multi-generational families for home-cooked meals and impromptu dance lessons that reveal Cuba's resilient spirit through authentic human connection.",
      "In Athens, ancient wisdom permeates modern life as locals passionately debate philosophy over ouzo at neighborhood tavernas. Experience the profound Greek concept of 'philoxenia' – the sacred duty of hospitality – through shared meals and multi-generational family celebrations."
    ];
    
    // Update each destination with its description
    for (let i = 0; i < destinationsToUpdate.length; i++) {
      const dest = destinationsToUpdate[i];
      const description = descriptions[i];
      
      console.log(`Updating ${dest.name}, ${dest.country} with immersive description...`);
      
      await db.update(destinations)
        .set({ immersiveDescription: description })
        .where(eq(destinations.id, dest.id));
      
      console.log(`Updated ${dest.name}, ${dest.country}`);
    }
    
    console.log("✅ More immersive descriptions added successfully");
  } catch (error) {
    console.error("Failed to add more immersive descriptions:", error);
  }
}

// Run the script
addMoreImmersiveDescriptions().then(() => {
  console.log("Script completed");
  process.exit(0);
}).catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});