/**
 * Email Service
 * 
 * Email service for sending purchase confirmations and download links
 * Uses SendGrid for delivery with a console fallback
 */
import { MailService } from '@sendgrid/mail';
import type { UserPurchase } from '../../shared/schema';

// Initialize SendGrid if API key is available
let mailService: MailService | null = null;

if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('SendGrid email service initialized');
} else {
  console.log('SENDGRID_API_KEY not found, falling back to console email logging');
}

// Product names for email subjects
const PRODUCT_NAMES = {
  premium_itinerary: 'Premium Travel Itinerary',
  snowbird_toolkit: 'Canadian Snowbird Toolkit',
  pet_travel_guide: 'Pet Travel Guide',
  digital_nomad_package: 'Digital Nomad Transition Package'
};

/**
 * Send a purchase confirmation email
 * 
 * @param purchase Purchase record
 * @param downloadUrl URL for downloading the purchased content
 * @returns Success status
 */
export async function sendPurchaseConfirmationEmail(
  purchase: UserPurchase,
  downloadUrl: string | null
): Promise<boolean> {
  try {
    const { email, firstName, productType, orderNumber } = purchase;
    
    if (!email) {
      console.error('Cannot send email: No email address provided');
      return false;
    }
    
    const productName = PRODUCT_NAMES[productType] || 'Travel Product';
    const subject = `Your Deep Travel Purchase: ${productName}`;
    
    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #3b82f6;
            padding: 20px;
            color: white;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
          .order-details {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Your Purchase!</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName || 'Valued Customer'},</p>
          
          <p>Thank you for purchasing <strong>${productName}</strong> from Deep Travel Collections. Your order has been successfully processed.</p>
          
          <div class="order-details">
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Amount:</strong> $${purchase.amount ? purchase.amount.toFixed(2) : '0.00'}</p>
          </div>
          
          ${downloadUrl ? `
          <p>You can download your purchase by clicking the button below:</p>
          
          <p style="text-align: center;">
            <a href="https://deeptravel.replit.app${downloadUrl}" class="button">Download Now</a>
          </p>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;"><a href="https://deeptravel.replit.app${downloadUrl}">https://deeptravel.replit.app${downloadUrl}</a></p>
          ` : ''}
          
          <p>If you have any questions about your purchase, please contact our customer support at <a href="mailto:support@deeptravel.com">support@deeptravel.com</a>.</p>
          
          <p>Happy travels!</p>
          <p>The Deep Travel Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Deep Travel Collections, a subsidiary of Soulful Bloom INC.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </body>
      </html>
    `;
    
    const textContent = `
      Thank You for Your Purchase!
      
      Hello ${firstName || 'Valued Customer'},
      
      Thank you for purchasing ${productName} from Deep Travel Collections. Your order has been successfully processed.
      
      Order Number: ${orderNumber}
      Product: ${productName}
      Amount: $${purchase.amount ? purchase.amount.toFixed(2) : '0.00'}
      
      ${downloadUrl ? `You can download your purchase at: https://deeptravel.replit.app${downloadUrl}` : ''}
      
      If you have any questions about your purchase, please contact our customer support at support@deeptravel.com.
      
      Happy travels!
      The Deep Travel Team
      
      © ${new Date().getFullYear()} Deep Travel Collections, a subsidiary of Soulful Bloom INC.
      This email was sent to ${email}
    `;
    
    // Check if SendGrid is available
    if (mailService) {
      // Send email using SendGrid
      await mailService.send({
        to: email,
        from: 'no-reply@deeptravel.com',
        subject,
        text: textContent,
        html: htmlContent
      });
      
      console.log(`Email sent to ${email} via SendGrid`);
    } else {
      // Log email to console as fallback
      console.log('------ EMAIL WOULD BE SENT (SendGrid API key not configured) ------');
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${textContent.substring(0, 100)}...`);
      console.log('------ END OF EMAIL CONTENT ------');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return false;
  }
}

/**
 * Send a PDF generation completion notification
 * 
 * @param purchase Purchase record
 * @param pdfUrl URL for downloading the generated PDF
 * @returns Success status
 */
export async function sendPdfGenerationCompleteEmail(
  purchase: UserPurchase,
  pdfUrl: string
): Promise<boolean> {
  try {
    const { email, firstName, productType } = purchase;
    
    if (!email) {
      console.error('Cannot send email: No email address provided');
      return false;
    }
    
    const productName = PRODUCT_NAMES[productType] || 'Travel Product';
    const subject = `Your ${productName} PDF is Ready`;
    
    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #10b981;
            padding: 20px;
            color: white;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Your PDF is Ready!</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName || 'Valued Customer'},</p>
          
          <p>Good news! Your <strong>${productName}</strong> PDF has been generated and is ready for download.</p>
          
          <p style="text-align: center;">
            <a href="https://deeptravel.replit.app${pdfUrl}" class="button">Download Your PDF</a>
          </p>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;"><a href="https://deeptravel.replit.app${pdfUrl}">https://deeptravel.replit.app${pdfUrl}</a></p>
          
          <p>We hope you enjoy your purchase! If you have any questions, please contact our customer support at <a href="mailto:support@deeptravel.com">support@deeptravel.com</a>.</p>
          
          <p>Happy travels!</p>
          <p>The Deep Travel Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Deep Travel Collections, a subsidiary of Soulful Bloom INC.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </body>
      </html>
    `;
    
    const textContent = `
      Your PDF is Ready!
      
      Hello ${firstName || 'Valued Customer'},
      
      Good news! Your ${productName} PDF has been generated and is ready for download.
      
      Download your PDF at: https://deeptravel.replit.app${pdfUrl}
      
      We hope you enjoy your purchase! If you have any questions, please contact our customer support at support@deeptravel.com.
      
      Happy travels!
      The Deep Travel Team
      
      © ${new Date().getFullYear()} Deep Travel Collections, a subsidiary of Soulful Bloom INC.
      This email was sent to ${email}
    `;
    
    // Check if SendGrid is available
    if (mailService) {
      // Send email using SendGrid
      await mailService.send({
        to: email,
        from: 'no-reply@deeptravel.com',
        subject,
        text: textContent,
        html: htmlContent
      });
      
      console.log(`PDF completion email sent to ${email} via SendGrid`);
    } else {
      // Log email to console as fallback
      console.log('------ EMAIL WOULD BE SENT (SendGrid API key not configured) ------');
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${textContent.substring(0, 100)}...`);
      console.log('------ END OF EMAIL CONTENT ------');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending PDF completion email:', error);
    return false;
  }
}