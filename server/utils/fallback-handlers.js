/**
 * Fallback Handlers for Missing API Keys
 * 
 * This module provides fallback functionality when API keys are missing.
 * It enables the application to function in a limited capacity without external services.
 */

// Stripe fallback handler
exports.stripeFallbackHandler = {
  createPaymentIntent: async (amount, currency = 'usd', metadata = {}) => {
    console.log(`[STRIPE FALLBACK] Creating payment intent for ${amount} ${currency}`);
    console.log(`[STRIPE FALLBACK] Metadata: ${JSON.stringify(metadata)}`);
    
    // Return a mock payment intent with a client secret
    return {
      id: `pi_fallback_${Date.now()}`,
      client_secret: `pi_fallback_secret_${Date.now()}`,
      amount,
      currency,
      status: 'requires_payment_method',
      created: Math.floor(Date.now() / 1000)
    };
  },
  
  retrievePaymentIntent: async (paymentIntentId) => {
    console.log(`[STRIPE FALLBACK] Retrieving payment intent ${paymentIntentId}`);
    
    // Check if it's a fallback payment intent
    if (paymentIntentId.startsWith('pi_fallback_')) {
      return {
        id: paymentIntentId,
        client_secret: `${paymentIntentId}_secret`,
        amount: 1000, // Default to $10.00
        currency: 'usd',
        status: 'succeeded',
        created: Math.floor(Date.now() / 1000) - 60 // Created 1 minute ago
      };
    }
    
    throw new Error('Payment intent not found');
  },
  
  createCustomer: async (email, name, metadata = {}) => {
    console.log(`[STRIPE FALLBACK] Creating customer for ${email}`);
    console.log(`[STRIPE FALLBACK] Metadata: ${JSON.stringify(metadata)}`);
    
    return {
      id: `cus_fallback_${Date.now()}`,
      email,
      name,
      created: Math.floor(Date.now() / 1000)
    };
  }
};

// SendGrid fallback handler
exports.sendgridFallbackHandler = {
  sendEmail: async (to, subject, text, html, from = 'noreply@deeptravel.collections') => {
    console.log(`[SENDGRID FALLBACK] Sending email to ${to}`);
    console.log(`[SENDGRID FALLBACK] From: ${from}`);
    console.log(`[SENDGRID FALLBACK] Subject: ${subject}`);
    console.log(`[SENDGRID FALLBACK] Text content: ${text}`);
    if (html) {
      console.log(`[SENDGRID FALLBACK] HTML content available (length: ${html.length})`);
    }
    
    return {
      success: true,
      message: 'Email logged to console (SendGrid fallback)'
    };
  }
};

// OpenAI fallback handler
exports.openAiFallbackHandler = {
  generateItinerary: async (destination, days, preferences) => {
    console.log(`[OPENAI FALLBACK] Generating itinerary for ${destination}`);
    console.log(`[OPENAI FALLBACK] Duration: ${days} days`);
    console.log(`[OPENAI FALLBACK] Preferences: ${JSON.stringify(preferences)}`);
    
    return {
      title: `${days}-Day ${destination} Adventure`,
      summary: `This is a fallback itinerary for ${destination}. In production, this would be generated by OpenAI.`,
      days: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: Exploring ${destination}`,
        activities: [
          'Morning: Breakfast at a local café',
          'Afternoon: Sightseeing tour',
          'Evening: Dinner at a recommended restaurant'
        ]
      }))
    };
  },
  
  enhanceDescription: async (text) => {
    console.log(`[OPENAI FALLBACK] Enhancing description: ${text.substring(0, 50)}...`);
    
    return `Enhanced: ${text}`;
  }
};

// Log all fallback activities to a central location
const fallbackLogs = [];

exports.logFallbackActivity = (service, action, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    service,
    action,
    details
  };
  
  fallbackLogs.push(logEntry);
  console.log(`[FALLBACK LOG] ${service} - ${action}`);
  
  // Keep only the last 100 logs
  if (fallbackLogs.length > 100) {
    fallbackLogs.shift();
  }
  
  return logEntry;
};

exports.getFallbackLogs = () => {
  return [...fallbackLogs];
};

// Function to check if fallbacks are active
exports.areFallbacksActive = () => {
  return {
    stripe: !process.env.STRIPE_SECRET_KEY,
    sendgrid: !process.env.SENDGRID_API_KEY,
    openai: !process.env.OPENAI_API_KEY
  };
};
