// shared/schema.ts
import { pgTable, serial, varchar, text, timestamp, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Regions table
export const regions = pgTable('regions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  image: varchar('image', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow()
});

// Destinations table
export const destinations = pgTable('destinations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  regionId: integer('region_id').notNull(), // Database shows NOT NULL
  description: text('description').notNull(), // Database shows NOT NULL
  immersiveDescription: text('immersive_description'),
  imageUrl: text('image_url').notNull(), // Database shows NOT NULL
  featured: boolean('featured').default(false),
  downloadCount: integer('download_count').default(0),
  rating: text('rating').notNull(), // Changed from decimal to text to match DB
  bestTimeToVisit: text('best_time_to_visit'),
  localTips: text('local_tips'),
  geography: text('geography'),
  culture: text('culture'),
  cuisine: text('cuisine')
});

// Status enum for purchase tracking
export const purchaseStatusEnum = pgEnum('purchase_status', [
  'pending', 
  'processing', 
  'generating', 
  'completed', 
  'failed',
  'refunded'
]);

// Templates table for itinerary templates
export const itineraryTemplates = pgTable('itinerary_templates', {
  id: serial('id').primaryKey(),
  destinationId: integer('destination_id').references(() => destinations.id),
  durationDays: integer('duration_days').notNull(),
  theme: varchar('theme', { length: 100 }),
  promptTemplate: text('prompt_template').notNull(),
  styleGuide: text('style_guide'),
  isActive: boolean('is_active').default(true),
  // Note: price column was removed as it doesn't exist in the actual database
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// User purchases table
export const userPurchases = pgTable('user_purchases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().default(0),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  productType: varchar('product_type', { length: 50 }),
  orderNumber: varchar('order_number', { length: 50 }),
  destinationId: integer('destination_id').references(() => destinations.id),
  templateId: integer('template_id').references(() => itineraryTemplates.id),
  paymentId: varchar('payment_id', { length: 255 }),
  paymentAmount: varchar('payment_amount', { length: 50 }), // Changed to varchar to fix conversion issues
  pdfUrl: varchar('pdf_url', { length: 255 }),
  stripeSessionId: varchar('stripe_session_id', { length: 255 }),
  amount: varchar('amount', { length: 50 }), // Changed to varchar to fix conversion issues
  jobId: varchar('job_id', { length: 255 }),
  emailSent: boolean('email_sent').default(false),
  status: purchaseStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  completedAt: timestamp('completed_at')
});

// Favorites table
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Changed from varchar to text
  destinationId: integer('destination_id').references(() => destinations.id).notNull(), // DB shows NOT NULL
  addedAt: timestamp('added_at').defaultNow()
});

// Itinerary table
export const itineraries = pgTable('itineraries', {
  id: serial('id').primaryKey(),
  destinationId: integer('destination_id').references(() => destinations.id).notNull(),
  title: text('title').notNull(),
  duration: integer('duration').notNull(), // DB shows NOT NULL
  description: text('description').notNull(), // DB shows NOT NULL
  content: text('content').notNull() // DB shows NOT NULL
});

// Days table for itinerary days
export const days = pgTable('days', {
  id: serial('id').primaryKey(),
  itineraryId: integer('itinerary_id').references(() => itineraries.id).notNull(),
  dayNumber: integer('day_number').notNull(),
  title: text('title').notNull(), // Changed to text to match DB
  activities: text('activities').array()
  // Removed createdAt as it doesn't exist in the DB
});

// Newsletter subscriptions table
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  source: varchar('source', { length: 100 }), // Where they signed up (bali popup, travel guide, etc.)
  subscribed: boolean('subscribed').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Enhanced experiences table
export const enhancedExperiences = pgTable('enhanced_experiences', {
  id: serial('id').primaryKey(),
  destinationId: integer('destination_id').references(() => destinations.id).notNull(),
  title: text('title').notNull(),
  specificLocation: text('specific_location').notNull(),
  description: text('description').notNull(),
  personalNarrative: text('personal_narrative'),
  season: text('season'),
  seasonalEvent: text('seasonal_event'),
  bestTimeToVisit: text('best_time_to_visit'),
  localTip: text('local_tip')
});

// Collections table
export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // Changed from varchar to text
  description: text('description').notNull(), // Made NOT NULL
  slug: text('slug').notNull(), // Changed from varchar to text
  imageUrl: text('image_url').notNull(), // Renamed from 'image' to 'image_url' and made NOT NULL
  themeColor: text('theme_color').notNull(), // Added missing column
  icon: text('icon').notNull(), // Added missing column
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

// Collection items table
export const collectionItems = pgTable('collection_items', {
  id: serial('id').primaryKey(),
  collectionId: integer('collection_id').references(() => collections.id).notNull(),
  destinationId: integer('destination_id').references(() => destinations.id).notNull(),
  position: integer('position').default(0),
  highlight: text('highlight'),
  note: text('note')
  // No createdAt field in the actual database table
});

// Budget categories table
export const budgetCategories = pgTable('budget_categories', {
  id: serial('id').primaryKey(),
  destinationId: integer('destination_id').references(() => destinations.id).notNull(),
  name: text('name').notNull(), // Changed from varchar to text
  amount: integer('amount').notNull(), // Changed from decimal to integer
  icon: text('icon').notNull(), // Changed from varchar to text and made NOT NULL
  description: text('description').notNull(), // Made NOT NULL
  color: text('color').notNull(), // Added missing column
  milestoneEmoji: text('milestone_emoji').notNull(), // Added missing column
  milestoneMessage: text('milestone_message').notNull() // Added missing column
  // Removed createdAt as it doesn't exist in the DB
});

// Testimonials table
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  destinationName: varchar('destination_name', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  userAvatar: varchar('user_avatar', { length: 255 }),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  itineraryName: varchar('itinerary_name', { length: 255 })
});

// Snowbird destinations table
export const snowbirdDestinations = pgTable('snowbird_destinations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  region: text('region'),
  imageUrl: text('image_url'),
  avgWinterTemp: text('avg_winter_temp'),
  costComparison: text('cost_comparison'),
  description: text('description'),
  visaRequirements: text('visa_requirements'),
  healthcareAccess: text('healthcare_access'),
  avgAccommodationCost: text('avg_accommodation_cost'),
  flightTime: text('flight_time'),
  languageBarrier: text('language_barrier'),
  canadianExpats: text('canadian_expats'),
  bestTimeToVisit: text('best_time_to_visit'),
  localTips: text('local_tips'),
  costOfLiving: text('cost_of_living'),
  createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const destinationsRelations = relations(destinations, ({ one, many }) => ({
  region: one(regions, {
    fields: [destinations.regionId],
    references: [regions.id]
  }),
  itinerary: one(itineraries, {
    fields: [destinations.id],
    references: [itineraries.destinationId]
  }),
  collectionItems: many(collectionItems),
  enhancedExperiences: many(enhancedExperiences),
  budgetCategories: many(budgetCategories)
}));

export const itineraryTemplatesRelations = relations(itineraryTemplates, ({ one }) => ({
  destination: one(destinations, {
    fields: [itineraryTemplates.destinationId],
    references: [destinations.id]
  })
}));

export const userPurchasesRelations = relations(userPurchases, ({ one }) => ({
  destination: one(destinations, {
    fields: [userPurchases.destinationId],
    references: [destinations.id]
  }),
  template: one(itineraryTemplates, {
    fields: [userPurchases.templateId],
    references: [itineraryTemplates.id]
  })
}));

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [itineraries.destinationId],
    references: [destinations.id]
  }),
  days: many(days)
}));

export const daysRelations = relations(days, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [days.itineraryId],
    references: [itineraries.id]
  })
}));

export const enhancedExperiencesRelations = relations(enhancedExperiences, ({ one }) => ({
  destination: one(destinations, {
    fields: [enhancedExperiences.destinationId],
    references: [destinations.id]
  })
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  items: many(collectionItems)
}));

export const collectionItemsRelations = relations(collectionItems, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionItems.collectionId],
    references: [collections.id]
  }),
  destination: one(destinations, {
    fields: [collectionItems.destinationId],
    references: [destinations.id]
  })
}));

export const budgetCategoriesRelations = relations(budgetCategories, ({ one }) => ({
  destination: one(destinations, {
    fields: [budgetCategories.destinationId],
    references: [destinations.id]
  })
}));

// Insert schemas
export const insertItineraryTemplateSchema = createInsertSchema(itineraryTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserPurchaseSchema = createInsertSchema(userPurchases).omit({ id: true, createdAt: true, completedAt: true });
export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type Region = typeof regions.$inferSelect;
export type Destination = typeof destinations.$inferSelect;
export type ItineraryTemplate = typeof itineraryTemplates.$inferSelect;
export type UserPurchase = typeof userPurchases.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Itinerary = typeof itineraries.$inferSelect;
export type Day = typeof days.$inferSelect;
export type EnhancedExperience = typeof enhancedExperiences.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type CollectionItem = typeof collectionItems.$inferSelect;
export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type SnowbirdDestination = typeof snowbirdDestinations.$inferSelect;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
// TypeScript interface for strongly-typed seasonal data with proper nesting
export interface DestinationSeasonal {
  id: string;
  name: string;
  country: string;
  seasons: {
    summer: { startMonth: number; endMonth: number; },
    winter: { startMonth: number; endMonth: number; },
    shoulder: { periods: Array<{ startMonth: number; endMonth: number; }> }
  };
  peakTouristMonths: number[];
  weatherAlerts: string[];
  majorEvents: Array<{
    name: string;
    month: number;
    duration: number;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }>;
  lastUpdated: Date;
  nextUpdateDue: Date;
}

export type InsertItineraryTemplate = z.infer<typeof insertItineraryTemplateSchema>;
export type InsertUserPurchase = z.infer<typeof insertUserPurchaseSchema>;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;