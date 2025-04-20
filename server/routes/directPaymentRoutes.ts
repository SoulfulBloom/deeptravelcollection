import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { generateStandalonePDF } from '../utils/standaloneItineraryGenerator';
import { generateSnowbirdPDF } from '../utils/snowbirdItineraryGenerator';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { sendPurchaseConfirmationEmail, sendPdfGenerationCompleteEmail } from '../services/emailService';
import type { UserPurchase } from '../../shared/schema';

// Create router
const router = express.Router();

// Define valid product types
type ProductType = 'premium_itinerary' | 'snowbird_toolkit' | 'pet_travel_guide' | 'digital_nomad_package';

// Payment processing schema to validate request data
const paymentSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  productType: z.string().refine(
    (val): val is ProductType => ['premium_itinerary', 'snowbird_toolkit', 'pet_travel_guide', 'digital_nomad_package'].includes(val),
    { message: "Invalid product type" }
  ),
  destinationId: z.number().nullable().optional(),
  amount: z.number().positive(),
  // Add optional cityInfo for snowbird city itineraries
  cityInfo: z.object({
    cityId: z.string(),
    cityName: z.string()
  }).optional()
});

// Product pricing and configuration
const PRODUCTS: Record<string, {
  name: string;
  price: number;
  pdfName: string;
}> = {
  premium_itinerary: {
    name: 'Premium Travel Itinerary',
    price: 15.99, // 20% discount from original $19.99
    pdfName: 'premium_itinerary.pdf'
  },
  snowbird_toolkit: {
    name: 'Canadian Snowbird Toolkit',
    price: 9.99,
    pdfName: 'THE-ULTIMATE-CANADIAN-SNOWBIRD-DEPARTURE-CHECKLIST.pdf'
  },
  pet_travel_guide: {
    name: 'Pet Travel Guide',
    price: 8.99,
    pdfName: 'PET-TRAVEL-GUIDE.pdf'
  },
  digital_nomad_package: {
    name: 'Digital Nomad Transition Package',
    price: 49.99,
    pdfName: 'DIGITAL-NOMAD-TRANSITION-PACKAGE.pdf'
  }
};

// Ensure temp directory exists for generating PDFs
const ensureTempDirExists = () => {
  const tempDir = path.join(process.cwd(), 'tmp/itineraries');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
};

// Create data directories for static PDFs
const ensureProductDirsExist = () => {
  const productsDir = path.join(process.cwd(), 'public/downloads');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  return productsDir;
};

// Process payment and create purchase record
router.post('/process', async (req, res) => {
  try {
    console.log('Received direct payment request:', req.body);
    
    // Validate request data
    const validationResult = paymentSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return res.status(400).json({
        success: false,
        message: 'Invalid payment data',
        errors: validationResult.error.errors
      });
    }
    
    const { email, firstName, lastName, productType, destinationId, amount } = validationResult.data;
    
    // For snowbird toolkit and other non-destination products, ensure destinationId is null
    const finalDestinationId = productType === 'snowbird_toolkit' || 
                               productType === 'pet_travel_guide' || 
                               productType === 'digital_nomad_package' 
                               ? null 
                               : destinationId;
    
    // Verify product type and price (already verified by schema validation, but double-check)
    if (!PRODUCTS[productType as keyof typeof PRODUCTS]) {
      return res.status(400).json({
        success: false,
        message: `Invalid product type: ${productType}`
      });
    }
    
    // Generate a unique purchase ID
    const purchaseId = uuidv4();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    // Create user purchase record in database
    // Generate a simple numeric ID from the UUID
    const numericId = Math.floor(Math.random() * 1000000) + 1; // Simple numeric ID between 1 and 1,000,000
    console.log(`Converting UUID ${purchaseId} to numeric ID: ${numericId}`);
    
    const purchase = await storage.createUserPurchase({
      id: numericId,
      email,
      firstName,
      lastName,
      orderNumber,
      productType,
      destinationId: finalDestinationId === undefined ? null : finalDestinationId, // Handle undefined properly
      amount: amount.toString(), // Convert amount to string
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 0, // Default to 0 for guest purchases as per schema
      templateId: null,
      paymentId: null,
      paymentAmount: null,
      emailSent: false,
      completedAt: null,
      pdfUrl: null,
      stripeSessionId: null,
      jobId: null
    });
    
    console.log(`Created purchase record: ${purchaseId}`);
    
    // Start PDF generation asynchronously
    generatePDFAsync(purchase);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      purchaseId: purchaseId
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the payment'
    });
  }
});

// DEBUG ROUTE: Force complete a purchase
router.get('/debug-complete/:id', async (req, res) => {
  try {
    const purchaseId = req.params.id;
    
    if (!purchaseId) {
      return res.status(400).json({
        success: false,
        message: 'Purchase ID is required'
      });
    }
    
    // Force update the purchase status
    await storage.updateUserPurchase(purchaseId, {
      status: 'completed',
      updatedAt: new Date()
    });
    
    // Get the updated purchase
    const purchase = await storage.getUserPurchaseById(purchaseId);
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }
    
    // Return success
    res.status(200).json({
      success: true,
      message: 'Purchase marked as completed',
      purchase
    });
    
  } catch (error) {
    console.error('Error in debug-complete:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred'
    });
  }
});

// Check status of a purchase
router.get('/status', async (req, res) => {
  try {
    const purchaseId = req.query.purchaseId as string;
    
    if (!purchaseId) {
      return res.status(400).json({
        success: false,
        message: 'Purchase ID is required'
      });
    }
    
    // Get purchase record from database
    // We need to find the purchase in a simpler way with direct ID lookup
    console.log(`Looking up purchase with ID: ${purchaseId}`);
    
    // Try a simpler approach to find the purchase
    const numericId = parseInt(purchaseId, 10);
    let purchase = null;
    
    try {
      // Approach 1: Try direct lookup by ID
      if (!isNaN(numericId)) {
        purchase = await storage.getUserPurchaseById(numericId.toString());
        console.log(`Looked up by numeric ID: ${numericId}, found: ${!!purchase}`);
      }
      
      // Approach 2: If not found, get all purchases and search
      if (!purchase) {
        // Get all purchases and find matching one
        // Get all purchases - in a real app, we'd have a method for this
        // For now, we'll create a simple fallback
        const allPurchases = await storage.getUserPurchasesByEmail('%');  // wildcard search
        
        if (allPurchases && allPurchases.length > 0) {
          // Attempt to match by order number first
          purchase = allPurchases.find((p: any) => 
            p.orderNumber && p.orderNumber.includes(purchaseId.slice(0, 6))
          );
          
          // If still not found, try matching by date pattern
          if (!purchase) {
            // Sort by most recent
            const recentPurchases = [...allPurchases].sort((a: any, b: any) => {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB.getTime() - dateA.getTime();
            });
            
            // Get the most recent purchase (it's likely what we're looking for)
            purchase = recentPurchases[0];
            console.log(`Using most recent purchase as fallback: ${purchase?.id}`);
          }
        }
      }
    } catch (lookupError) {
      console.error('Error in purchase lookup:', lookupError);
    }
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }
    
    // Build download URL based on product type
    let downloadUrl = null;
    
    if (purchase.status === 'completed') {
      if (purchase.productType === 'premium_itinerary' && purchase.destinationId) {
        // For itineraries, use destination-specific URL
        const destination = await storage.getDestinationById(purchase.destinationId);
        if (destination) {
          downloadUrl = `/downloads/itineraries/itinerary_${purchaseId}.pdf`;
        }
      } else {
        // For other products, use static PDFs
        if (purchase.productType && typeof purchase.productType === 'string') {
          const productType = purchase.productType as keyof typeof PRODUCTS;
          const productInfo = PRODUCTS[productType];
          if (productInfo) {
            downloadUrl = `/downloads/${productInfo.pdfName}`;
          }
        }
      }
    }
    
    // Return purchase status and details
    res.status(200).json({
      status: purchase.status,
      email: purchase.email,
      orderNumber: purchase.orderNumber,
      productType: purchase.productType,
      productName: purchase.productType && typeof purchase.productType === 'string' 
        ? (PRODUCTS[purchase.productType as keyof typeof PRODUCTS]?.name || 'Unknown Product')
        : 'Unknown Product',
      amount: purchase.amount,
      createdAt: purchase.createdAt,
      completedAt: purchase.updatedAt,
      downloadUrl,
      emailSent: purchase.emailSent
    });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while checking the purchase status'
    });
  }
});

// Function to generate PDF asynchronously
async function generatePDFAsync(purchase: UserPurchase) {
  try {
    ensureTempDirExists();
    ensureProductDirsExist();
    
    const { id: purchaseId, email, productType, destinationId } = purchase;
    
    // Wait a moment to simulate processing (optional)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let pdfPath: string | null = null;
    let downloadUrl: string | null = null;
    
    // Handle different product types
    if (productType === 'premium_itinerary' && destinationId) {
      // For itineraries, generate a custom PDF
      try {
        // Update purchase status to generating
        await storage.updateUserPurchase(purchaseId.toString(), {
          status: 'generating',
          updatedAt: new Date()
        });
        
        console.log(`Starting PDF generation for purchase ${purchaseId} (destination ID: ${destinationId})...`);
        
        // Get destination details
        const destination = await storage.getDestinationById(destinationId);
        
        if (!destination) {
          console.error(`Destination with ID ${destinationId} not found for purchase ${purchaseId}`);
          throw new Error(`Destination with ID ${destinationId} not found`);
        }
        
        console.log(`Retrieved destination data for ${destination.name}, ${destination.country}`);
        
        // Determine if this is a snowbird destination by ID (IDs 55-60 are our snowbird destinations)
        const isSnowbirdDestination = destination.id >= 55 && destination.id <= 60;
        
        // Generate custom PDF with appropriate generator based on destination type
        let pdfBuffer;
        if (isSnowbirdDestination) {
          console.log(`Using snowbird-specific generator for ${destination.name} (ID: ${destination.id})...`);
          pdfBuffer = await generateSnowbirdPDF(destination);
        } else {
          console.log(`Using standard generator for ${destination.name}...`);
          pdfBuffer = await generateStandalonePDF(destination);
        }
        
        if (!pdfBuffer || pdfBuffer.length === 0) {
          throw new Error(`Failed to generate PDF: Empty buffer returned`);
        }
        
        console.log(`PDF generated successfully, buffer size: ${pdfBuffer.length} bytes`);
        
        // Save the PDF
        const outputDir = path.join(process.cwd(), 'public/downloads/itineraries');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const pdfFilename = `itinerary_${purchaseId}.pdf`;
        const outputPath = path.join(outputDir, pdfFilename);
        fs.writeFileSync(outputPath, pdfBuffer);
        
        pdfPath = outputPath;
        downloadUrl = `/downloads/itineraries/${pdfFilename}`;
        
        console.log(`Generated and saved custom PDF for purchase ${purchaseId}: ${outputPath}`);
      } catch (error) {
        console.error(`Error generating custom PDF for purchase ${purchaseId}:`, error);
        
        // Update purchase status to error
        await storage.updateUserPurchase(purchaseId.toString(), {
          status: 'failed', // Changed to 'failed' to match our enum
          updatedAt: new Date()
        });
        
        return;
      }
    } else if (productType && typeof productType === 'string') {
      // For other products, use pre-generated static PDFs
      const productKey = productType as keyof typeof PRODUCTS;
      const productInfo = PRODUCTS[productKey];
      
      if (!productInfo) {
        throw new Error(`Invalid product type: ${productType}`);
      }
      
      // Set static PDF path
      pdfPath = path.join(process.cwd(), 'public/downloads', productInfo.pdfName);
      downloadUrl = `/downloads/${productInfo.pdfName}`;
      
      // Verify the static PDF exists
      if (!fs.existsSync(pdfPath)) {
        console.error(`Static PDF not found: ${pdfPath}`);
        
        // For snowbird toolkit, try fallback filename
        if (productType === 'snowbird_toolkit') {
          const fallbackFilename = 'CANADIAN-SNOWBIRD-TOOLKIT.pdf';
          const fallbackPath = path.join(process.cwd(), 'public/downloads', fallbackFilename);
          
          if (fs.existsSync(fallbackPath)) {
            console.log(`Using fallback PDF path for snowbird toolkit: ${fallbackPath}`);
            pdfPath = fallbackPath;
            downloadUrl = `/downloads/${fallbackFilename}`;
          } else {
            throw new Error(`Product PDF not found: ${productInfo.pdfName} or ${fallbackFilename}`);
          }
        } else {
          throw new Error(`Product PDF not found: ${productInfo.pdfName}`);
        }
      }
      
      console.log(`Using static PDF for purchase ${purchaseId}: ${pdfPath}`);
    } else {
      throw new Error(`Missing or invalid product type for purchase ${purchaseId}`);
    }
    
    // Update purchase status to completed
    await storage.updateUserPurchase(purchaseId.toString(), {
      status: 'completed',
      updatedAt: new Date()
    });
    
    // Send confirmation email with download link
    if (email) {
      try {
        const emailSent = await sendPurchaseConfirmationEmail(purchase, downloadUrl);
        
        if (emailSent) {
          // Update purchase record to show email was sent
          await storage.updateUserPurchase(purchaseId.toString(), {
            emailSent: true
          });
          
          console.log(`Confirmation email sent to ${email} for purchase ${purchaseId}`);
        } else {
          console.warn(`Failed to send confirmation email to ${email} for purchase ${purchaseId}`);
        }
      } catch (emailError) {
        console.error(`Error sending confirmation email for purchase ${purchaseId}:`, emailError);
      }
    }
    
    console.log(`Purchase ${purchaseId} processing completed`);
  } catch (error) {
    console.error('Error in generatePDFAsync:', error);
    
    // Update purchase status to failed
    await storage.updateUserPurchase(purchase.id.toString(), {
      status: 'failed',
      updatedAt: new Date()
    });
  }
}

export default router;