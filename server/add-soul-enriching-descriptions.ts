import { db } from "./db";
import { destinations } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Add soul-enriching descriptions to key destinations
 */
async function addSoulEnrichingDescriptions() {
  try {
    // Map of destination names to their soul-enriching descriptions
    const destinationDescriptions: Record<string, string> = {
      'Barcelona': `
In Barcelona's Gothic Quarter, seek out Bar del Pla where locals gather for vermouth hour—join them at communal tables for impromptu conversations that often last until midnight. For a truly transformative experience, arrange a private workshop with multigenerational tile artisans in Poble Nou who still use 18th-century techniques; they'll invite you to their family lunch if you express genuine interest.

Beyond Gaudí's masterpieces, discover the hidden world of Gràcia neighborhood where autonomous community centers host underground concerts and Catalan language exchange nights every Thursday. Locals recommend visiting in late September when summer crowds disperse but the Mediterranean remains warm enough for dawn swims at Barceloneta beach followed by breakfast at family-run Ca la Nuri, where fishermen's wives serve seafood caught hours earlier.

The key to experiencing Barcelona's soul lies in embracing "la sobremesa"—the time after meals when meaningful conversations unfold. At El Xampanyet, a 1930s cava bar in El Born, owner Quim introduces regulars to visitors, creating cross-cultural dialogues over shared plates of anchovies and Iberian ham. Visit during La Mercè festival when neighborhood associations open their doors for communal meals, offering rare glimpses into Catalonian family traditions maintained despite centuries of political pressure.
      `,
      'Paris': `
Bypass the overexposed Marais for the 19th arrondissement's Canal de l'Ourcq, where multigenerational Parisians gather for pétanque games that welcome newcomers with glasses of pastis. Here at Rosa Bonheur, a former park keeper's house turned local hangout, Sunday afternoon impromptu dance sessions create friendships spanning decades and languages. For authentic connection, arrive before 11am and chat with the elder locals who've witnessed the neighborhood's evolution through war and peace.

The soul of Parisian food isn't found in Michelin stars but in modest bistros like La Fontaine de Belleville, where chef Thomas crafts perfect omelettes from his grandmother's recipes while sharing stories of Parisian resilience through occupation and liberation. Visit in mid-October when summer tourists have departed but before winter's chill, and ask for the "menu de confiance"—an off-menu experience where the chef chooses based on morning market finds and your personal story.

Experience the true spirit of intellectual Paris at Shakespeare & Company's weekly writing workshops, where aspiring authors from every continent share work in the back room while bookstore cats wind between chair legs. For cultural immersion beyond monuments, join the dawn photography walks along the Seine organized by the Les Berges collective—locals who communicate Paris's complex relationship with its river while introducing participants to breakfast spots like Café Fluctuat Nec Mergitur, whose name reflects the city's resilient spirit: "Tossed but not sunk."
      `,
      'Kyoto': `
Beyond Kyoto's temple circuit lies Fushikino Alley in the Nishijin district, where sixth-generation silk weavers invite visitors into workshops hidden behind traditional machiya façades. Here, Tanaka-san offers morning tea ceremonies in her family's 300-year-old weaving studio before tourists arrive at better-known sites. The transformative moment comes when she shares her grandfather's wartime diaries, revealing how artisanal traditions survived through Japan's most challenging era.

For intimate cultural exchange, visit Kyoto in early November when maple leaves begin changing but before peak koyo crowds. Join the Urasenke community center's biweekly chakai gatherings where local retirees practice English while teaching foreigners about seasonal wagashi making. The generational knowledge transmission continues at Manmaru izakaya, where owner Kenji-san introduces visitors to elderly neighborhood sake brewers who share family tasting techniques not recorded in any guidebook.

Immerse yourself in Kyoto's living traditions by participating in Nishiki Market's tsukemono workshop, where families have preserved seasonal vegetables for centuries. While tourists photograph the market's colorful displays, you'll be in back rooms learning preservation methods from Ishida-san, whose family has operated their pickle stall since 1781. The experience deepens at Yusoku Komachi, a modest restaurant where three generations of women prepare imperial court cuisine using recipes dating to the Heian period, served with stories of how these dishes connect modern Kyoto to its thousand-year history as Japan's cultural heart.
      `,
      'Rome': `
While tourists queue for the Colosseum, Rome's soul reveals itself in Testaccio's morning rituals. At Mercato Testaccio, third-generation vendor Marco invites early arrivals (before 7:30am) behind his cheese counter to taste sheep's milk ricotta while recounting how his grandmother fed the neighborhood during wartime. This exchange typically leads to introductions with local elders who gather at Caffè Barberini, where the price of your coffee includes their stories of Rome's transformation through fascism, liberation, and the economic miracle.

For authentic cultural immersion, visit during late October when local life resumes after summer exodus. In Monti district, the centuries-old tradition of aperitivo transforms at Fafiuché wine bar, where owner Alessandra introduces solo travelers to neighborhood regulars, creating impromptu cultural salons over glasses of obscure Lazio wines and family-recipe crostini. The real Rome emerges in these spontaneous gatherings where locals share access to restricted historical sites like the convent gardens of Santa Maria della Pace, typically closed to visitors but opened through personal connections.

Experience Rome's living heritage in the workshops of Via dei Giubbonari, where Signor Gambelli crafts made-to-measure shoes using tools inherited from his great-grandfather. Unlike touristic demonstrations, his invitation to Thursday afternoon wine and discussion sessions provides genuine insight into Roman craftsmanship philosophies. The most meaningful connection comes through participating in the hyper-local tradition of Sunday pranzo (lunch) — join multi-generational families at Trattoria Da Danilo where nonne still roll pasta by hand while debating politics and football, often inviting interested foreigners to continue conversations at their homes in Garbatella, Rome's most authentic yet overlooked neighborhood.
      `,
      'Tokyo': `
Beyond Tokyo's neon-lit corridors lies Yanaka, a neighborhood that survived both earthquakes and war bombings, preserving pre-war Japanese architectural traditions and community spirit. At Kamiya-san's kanban workshop, visitors who arrive before 9am are invited to morning tea while he demonstrates Edo-period signboard carving techniques that have sustained his family for six generations. This ritual often extends to introductions with local shopkeepers along Yanaka Ginza shopping street, creating a network of authentic connections impossible through conventional tourism.

Experience Tokyo's true culinary soul by joining the 5am tuna auction at Toyosu Market, then following the fishmongers to workers' breakfast at Yoshida-ya where third-generation owner Kenji serves traditional fisherman's breakfast while sharing how Tokyo's relationship with seafood reflects the city's resilient spirit. For cultural immersion beyond tourist experiences, visit during late October when mosquitoes are gone but winter hasn't arrived, and participate in the Nezu Shrine's community moon-viewing gatherings where local astronomy clubs and traditional poets welcome cultural exchange.

Tokyo reveals its most transformative experiences through "introduction culture" – at Kyu-Iwasaki-tei Gardens, volunteer guide Satomi-san doesn't just explain Meiji-era architecture but introduces visitors who show sincere interest to her calligraphy circle which meets in a 1920s tearoom nearby. This leads to invitation-only cultural exchanges where generation-spanning practitioners of arts from ikebana to kintsugi (gold joinery) share family techniques while discussing contemporary Japanese identity. The deepest connection comes at Maruichi shitamachi bar in Asakusa, where owner Yamada-san maintains a tradition where regular customers introduce new friends, creating an ever-expanding community of locals and visitors who often maintain relationships for decades.
      `,
      'New York': `
Beyond Manhattan's overhyped attractions, Jackson Heights in Queens offers New York's most authentic cultural immersion. Begin at Diversity Plaza at 7am where Ecuadorian bakers, Tibetan monks, and local hospital workers share communal tables – show genuine interest and you'll likely be invited to Tawa Foods where Mr. Sharma explains the significance of specific spices while introducing visitors to his extended family who run various neighborhood enterprises. This organic network provides access to underground Nepali dumpling-making sessions in apartment kitchens where three generations share recipes and migration stories.

Experience New York's lesser-known Jewish heritage through Arthur Avenue in the Bronx, where traditional Italian markets overshadow the area's earlier Eastern European influence. At Liebman's Kosher Deli, 90-year-old Mrs. Leibowitz still occasionally holds court, sharing neighborhood transformation stories spanning the 1930s through today. Visit in late September when summer humidity breaks but before winter chill, when multi-ethnic street festivals create natural opportunities for cross-cultural exchange between longtime residents and newcomers.

New York reveals its soul through the "stoop culture" of Bed-Stuy, Brooklyn where community elders gather at sunset on building steps to discuss everything from local politics to soul food recipes. Visitors who approach with respect are often invited to join Marcus Garvey Park's Saturday morning drumming circles where Senegalese immigrants teach traditional rhythms alongside Harlem residents preserving connection to ancestral musical forms. The most transformative experience comes through joining Clinton Hill's Repair Café movement, where fix-it experts from retired engineers to teenage tech wizards gather monthly in community centers, creating intergenerational bonds through collaborative problem-solving while sharing oral histories of neighborhoods perpetually in transition.
      `,
      'Marrakech': `
In Marrakech's less-traveled Kasbah district, morning bread baking begins at dawn when families bring homemade dough to communal wood-fired ovens. Arriving at Moulay El Yazid bakery before 6:30am with a small gift of tea leaves grants access to this daily ritual where baker Hassan marks each family's loaves with distinctive patterns while sharing stories of how bread connects every aspect of Moroccan social life. This introduction often leads to invitations for morning mint tea in courtyard homes where three generations discuss how the medina maintains traditions while embracing necessary change.

Experience Marrakech's authentic artisanal culture by visiting Tcharraada, a women's cooperative in the Jewish Quarter that preserves ancestral embroidery techniques. Unlike tourist demonstrations, arriving during actual production hours (Tuesday and Thursday afternoons) allows visitors to sit alongside craftswomen who share family histories while teaching specific stitches that tell cultural stories through pattern and color. Visit during early October when summer heat subsides but before winter rains, when neighborhood households gather for olive harvesting – respectful visitors are often invited to participate in this seasonal tradition followed by home-cooked tagines.

For spiritual immersion beyond superficial mosque visits, seek out the zawiya (Sufi lodge) of Sidi Bel Abbes during Thursday evening dhikr ceremonies when rhythmic chanting and movement create transcendent community experiences. Attending with a local guide like Ibrahim, who has family connections to multiple spiritual brotherhoods, provides context while facilitating introductions to elders who explain how Moroccan Islam incorporates Berber traditions and mystical practices. The most profound connection comes through participating in the communal couscous ritual at Dar Bellarj cultural foundation, where visitors roll semolina alongside local grandmothers while learning proverbs and folktales, creating bonds that frequently result in invitations to family celebrations that tourists rarely witness.
      `,
      'Amsterdam': `
Amsterdam reveals its authentic character through early morning rituals along the western canals, where houseboats host informal breakfast gatherings. At De Poezenboot (the cat boat sanctuary), volunteer Marieke welcomes visitors before official opening hours, sharing coffee while explaining how this floating animal shelter reflects Amsterdam's pragmatic compassion. This often leads to introductions with long-term canal residents who invite interested travelers onto their boats to discuss the challenges and joys of water-based living – a perspective that illuminates the city's historical relationship with water management and community cooperation.

Experience Amsterdam's genuine food culture in the overlooked Indische Buurt neighborhood, where colonial history manifests through Indonesian-Dutch fusion cuisine. At Toko Ramee, third-generation owner Suri explains how spice trade history connects to contemporary Amsterdam multicultural identity while introducing visitors to neighborhood elders whose families arrived from Indonesia in the 1950s. Visit during late April when locals celebrate King's Day, transforming the city into Europe's largest street party where cultural barriers dissolve as families sell heirlooms and homemade treats from their doorsteps.

The city's soul emerges through Amsterdam-Oost's urban gardening collectives, where retired dock workers tend plots alongside recent immigrants, creating intergenerational knowledge exchange. At Tuinpark Amstelglorie, gardener Willem invites visitors who show genuine interest to Thursday afternoon borrel (drinks) gatherings where conversation spans from sustainable urban living to personal stories of how the neighborhood evolved through deindustrialization. The most transformative experience comes through participating in Amsterdam's living gezelligheid (coziness) culture – join locals at brown café Café 't Smalle where third-generation owner Joost facilitates conversations between strangers, maintaining the centuries-old tradition of these establishments as democratic meeting grounds where philosophers, tradespeople, and visitors create community through dialogue.
      `,
      'Sydney': `
Sydney's soul resides not in its harbor icons but in the community markets of coastal suburbs like Bronte, where Saturday dawn reveals locals gathering at Eugene's fish stall for catch updates and neighborhood news. Arrive by 6am with a thermos of coffee to share, and you're likely to meet multi-generational families who've surfed the same breaks for decades. These connections often lead to invitations for "sausage sizzles" (barbecues) where retirees share Aboriginal place names and ecological knowledge passed down from indigenous elders who taught them to read ocean currents and weather patterns.

Experience authentic Sydney through the Vietnamese-Australian community in Cabramatta, where cultural fusion manifests beyond tourist-oriented restaurants. At Phu Quoc teahouse, morning seniors' tai chi sessions welcome respectful visitors, followed by impromptu language exchange over herb-picking lessons in the community garden. Visit during March-April (autumn) when humidity drops but water remains warm enough for dawn ocean pools swims at McIvers Bath, where female attendants have maintained women's swimming traditions since 1922, sharing stories of how these spaces created community for immigrant women across decades.

Sydney reveals its deepest character through volunteer-run "shed culture" in places like the Bower Reuse Center, where retired tradespeople and young apprentices collaborate on repair projects spanning from colonial-era furniture to contemporary electronics. Thursday afternoon "repair cafés" welcome travelers to bring broken items, creating natural opportunities for skill-sharing and storytelling across generational and cultural divides. The most transformative connection comes through joining the Little Bay Coast Care group's monthly rehabilitation efforts, where indigenous knowledge-keepers work alongside marine biologists and local families, creating space for meaningful exchange about Australia's complex relationship with land and sea while participating in tangible conservation efforts that extend beyond superficial tourism.
      `,
      'Bali': `
Bali's authentic spiritual landscape reveals itself not at crowded temple complexes but through dawn rituals in villages like Sidemen, where farmers make daily offerings before agricultural work begins. Arriving at Pura Dalem temple by 5:30am often results in invitations from the pemangku (priest) to join family prayer sessions followed by simple breakfast in traditional compounds where three generations explain how Balinese Hinduism adapts ancient practices to contemporary challenges. These connections frequently lead to participation in seasonal ceremonies rarely witnessed by tourists, providing insight into the living spiritual ecosystem that defines authentic Balinese identity.

Experience Bali's true culinary soul in Gianyar regency where warungs (family restaurants) preserve regional recipes without tourist modification. At Warung Babi Guling Ibu Oka in Mas village (not the famous tourist branch), grandmother Wayan still supervises the complex spice preparation for ceremonial suckling pig while explaining how specific ingredients connect to Hindu philosophical principles. Visit during April-May after rainy season ends but before high summer tourism, when villages conduct traditional mepeed processions where children learn ancestral performing arts – families often welcome respectful visitors who show genuine interest in cultural context rather than mere photography.

Bali's most transformative experiences emerge through participation in subak water temple communities, where thousand-year-old irrigation cooperatives maintain ecological and social harmony. In Tampaksiring, farmer Made invites travelers to join morning water allocation meetings where elders resolve conflicts through consensus-building that blends practical water management with spiritual stewardship. The deepest connection comes through extended stays in traditional compounds like those in Sideman valley, where multi-generational families welcome visitors into bamboo writing bales (pavilions) for daily informal language exchange. Here, elders share concerns about environmental change while young artists explain how they're adapting traditional crafts to contemporary needs, creating authentic dialogue about Bali's challenges beyond the simplified paradise narrative presented to conventional tourists.
      `
    };

    // Process each destination
    for (const [destName, description] of Object.entries(destinationDescriptions)) {
      console.log(`Looking for destination: ${destName}`);
      
      // Find destination in database
      const [destination] = await db
        .select()
        .from(destinations)
        .where(eq(destinations.name, destName));
      
      if (destination) {
        console.log(`Updating ${destName} with soul-enriching description`);
        
        // Update the destination with the enhanced description
        await db.update(destinations)
          .set({ immersiveDescription: description.trim() })
          .where(eq(destinations.id, destination.id));
        
        console.log(`✅ Updated ${destName} successfully`);
      } else {
        console.log(`⚠️ Destination ${destName} not found in database`);
      }
    }
    
    console.log("✅ Soul-enriching descriptions added successfully");
  } catch (error) {
    console.error("Failed to add soul-enriching descriptions:", error);
  }
}

// Run the script
addSoulEnrichingDescriptions().then(() => {
  console.log("Script completed");
  process.exit(0);
}).catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});