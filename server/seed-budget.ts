import { db } from './db';
import { budgetCategories } from '@shared/schema';

async function seedBudgetCategories() {
  try {
    console.log("Starting budget categories seeding...");
    
    // Check if budget categories already exist
    const existingCategories = await db.select().from(budgetCategories);
    
    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing budget categories. Skipping seed.`);
      return;
    }
    
    // Bali budget categories (destinationId: 3)
    const baliBudgetCategories = [
      {
        destinationId: 3,
        name: "Accommodation",
        amount: 550,
        icon: "🏨",
        color: "#4F46E5",
        description: "Hotels, hostels, and Airbnb",
        milestoneEmoji: "🎉",
        milestoneMessage: "Accommodation funds secured! Time to book that dream villa!"
      },
      {
        destinationId: 3,
        name: "Food & Dining",
        amount: 350,
        icon: "🍲",
        color: "#10B981",
        description: "Restaurants, cafes, and street food",
        milestoneEmoji: "🍹",
        milestoneMessage: "Food budget ready! Prepare for amazing culinary experiences!"
      },
      {
        destinationId: 3,
        name: "Activities",
        amount: 400,
        icon: "🏄‍♂️",
        color: "#F59E0B",
        description: "Tours, attractions, and experiences",
        milestoneEmoji: "🌊",
        milestoneMessage: "Activities budget complete! Get ready for adventure!"
      },
      {
        destinationId: 3,
        name: "Transportation",
        amount: 200,
        icon: "🛵",
        color: "#EF4444",
        description: "Flights, taxis, and scooter rentals",
        milestoneEmoji: "✈️",
        milestoneMessage: "Transportation funds secured! Start booking those flights!"
      },
      {
        destinationId: 3,
        name: "Shopping",
        amount: 150,
        icon: "🛍️",
        color: "#8B5CF6",
        description: "Souvenirs and gifts",
        milestoneEmoji: "🎁",
        milestoneMessage: "Shopping budget ready! Time to plan for souvenirs!"
      }
    ];
    
    // Tokyo budget categories (destinationId: 1)
    const tokyoBudgetCategories = [
      {
        destinationId: 1,
        name: "Accommodation",
        amount: 750,
        icon: "🏙️",
        color: "#4F46E5",
        description: "Hotels and hostels in Tokyo",
        milestoneEmoji: "🎌",
        milestoneMessage: "Accommodation funds ready for Tokyo! Time to book!"
      },
      {
        destinationId: 1,
        name: "Food & Dining",
        amount: 450,
        icon: "🍣",
        color: "#10B981",
        description: "Sushi, ramen, and local cuisine",
        milestoneEmoji: "🍜",
        milestoneMessage: "Food budget complete! Ready for amazing Japanese cuisine!"
      },
      {
        destinationId: 1,
        name: "Activities",
        amount: 350,
        icon: "⛩️",
        color: "#F59E0B",
        description: "Temples, museums, and experiences",
        milestoneEmoji: "🏯",
        milestoneMessage: "Activities budget ready! Prepare for cultural experiences!"
      },
      {
        destinationId: 1,
        name: "Transportation",
        amount: 300,
        icon: "🚅",
        color: "#EF4444",
        description: "Flights, metro, and bullet trains",
        milestoneEmoji: "🚄",
        milestoneMessage: "Transportation budget secured! Ready to zoom around Japan!"
      },
      {
        destinationId: 1,
        name: "Shopping",
        amount: 250,
        icon: "🛒",
        color: "#8B5CF6",
        description: "Electronics, fashion, and gifts",
        milestoneEmoji: "🎁",
        milestoneMessage: "Shopping budget ready! Time for Akihabara electronics!"
      }
    ];

    // Insert Bali budget categories
    const baliInsertResult = await db.insert(budgetCategories).values(baliBudgetCategories);
    console.log(`Inserted ${baliBudgetCategories.length} Bali budget categories.`);
    
    // Insert Tokyo budget categories
    const tokyoInsertResult = await db.insert(budgetCategories).values(tokyoBudgetCategories);
    console.log(`Inserted ${tokyoBudgetCategories.length} Tokyo budget categories.`);
    
    console.log("Budget categories seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding budget categories:", error);
  } finally {
    process.exit(0);
  }
}

seedBudgetCategories();