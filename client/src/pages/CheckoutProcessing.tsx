import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, XCircle, Download, Mail, AlertTriangle, Clock } from 'lucide-react';

// Status types for the purchase processing and display
type ApiStatus = 'processing' | 'generating' | 'completed' | 'failed' | 'error';
type DisplayStatus = 'processing' | 'completed' | 'email_sent' | 'error';

export default function CheckoutProcessing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<DisplayStatus>('processing');
  const [message, setMessage] = useState<string>('Your purchase is being processed...');
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(10);

  // Get the purchaseId from URL
  const queryParams = new URLSearchParams(window.location.search);
  const purchaseId = queryParams.get('purchaseId');

  // Poll for status
  useEffect(() => {
    if (!purchaseId) {
      setStatus('error');
      setMessage('Invalid purchase ID. Please try again.');
      return;
    }

    // Check purchase status periodically
    const checkStatus = async () => {
      try {
        const response = await apiRequest(
          'GET', 
          `/api/direct-payment/status?purchaseId=${purchaseId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to check purchase status');
        }

        const data = await response.json();
        console.log('Purchase status data:', data);
        setPurchaseData(data);

        // Handle different API statuses and map to display statuses
        if (data.status === 'completed') {
          setStatus('completed');
          setMessage('Your purchase has been completed successfully!');
          
          if (data.downloadUrl) {
            setDownloadUrl(data.downloadUrl);
          }
          
          if (data.emailSent) {
            setStatus('email_sent');
            setMessage('Your purchase confirmation and download link have been sent to your email!');
          }
          
          // Stop polling once complete
          setIsPolling(false);
        } else if (data.status === 'processing') {
          setStatus('processing');
          setMessage('Your purchase is being processed...');
        } else if (data.status === 'generating') {
          setStatus('processing');
          setMessage('Generating your custom content...');
        } else if (data.status === 'failed') {
          setStatus('error');
          setMessage('There was an issue processing your purchase. Please contact support for assistance.');
          setIsPolling(false);
          
          // Special handling for Snowbird Toolkit - provide direct PDF download regardless of status
          if (data.productType === 'snowbird_toolkit') {
            // Try to get a quick fix by redirecting directly to the PDF
            setDownloadUrl('/downloads/THE-ULTIMATE-CANADIAN-SNOWBIRD-DEPARTURE-CHECKLIST.pdf');
            setMessage('Your Snowbird Toolkit is available for download below!');
            setStatus('completed');
          }
        } else if (data.status === 'error') {
          setStatus('error');
          setMessage(data.message || 'An error occurred while processing your purchase.');
          setIsPolling(false);
        }
      } catch (error) {
        console.error('Error checking purchase status:', error);
        setStatus('error');
        setMessage('Failed to check purchase status. Please try again later.');
        setIsPolling(false);
      }
    };

    // Poll every 2 seconds if still processing
    if (isPolling) {
      checkStatus();
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [purchaseId, isPolling]);

  // Handle auto-redirect after successful purchase
  useEffect(() => {
    if (status === 'completed' || status === 'email_sent') {
      // Countdown for automatic redirect
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect to home page after countdown
            setLocation('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, setLocation]);

  // Handle manual download
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      toast({
        title: 'Download unavailable',
        description: 'The download link is not available yet. Please wait or check your email.',
        variant: 'destructive',
      });
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: DisplayStatus }) => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Processing
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete
          </div>
        );
      case 'email_sent':
        return (
          <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm">
            <Mail className="w-4 h-4 mr-2" />
            Email Sent
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm">
            <XCircle className="w-4 h-4 mr-2" />
            Error
          </div>
        );
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Purchase Status</CardTitle>
            <CardDescription>Thank you for your purchase</CardDescription>
          </div>
          <StatusBadge status={status} />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === 'processing' && (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <LoadingSpinner size="large" className="mb-4" />
              <h3 className="text-lg font-medium">Processing Your Purchase</h3>
              <p className="text-muted-foreground mt-2">
                Please wait while we process your purchase. This typically takes less than a minute.
              </p>
            </div>
          )}
          
          {(status === 'completed' || status === 'email_sent') && (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium">Purchase Complete!</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                {message}
              </p>
              
              {purchaseData && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-md p-4 w-full text-left mt-4">
                  <h4 className="font-medium mb-2">Order Details</h4>
                  {purchaseData.orderNumber && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Order Number:</span> {purchaseData.orderNumber}
                    </p>
                  )}
                  {purchaseData.email && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Email:</span> {purchaseData.email}
                    </p>
                  )}
                  {purchaseData.productName && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Product:</span> {purchaseData.productName}
                    </p>
                  )}
                  {purchaseData.amount && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Amount:</span> ${Number(purchaseData.amount).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {downloadUrl && (
                  <Button 
                    variant="default" 
                    onClick={handleDownload} 
                    className="flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Now
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setLocation('/')}
                >
                  Return to Home
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                You'll be redirected to the home page in {countdown} seconds...
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium">Purchase Error</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                {message}
              </p>
              {downloadUrl && (
                <div className="mb-6">
                  <p className="text-amber-600 font-medium mb-3">
                    However, we can still provide your requested document:
                  </p>
                  <Button 
                    variant="default" 
                    onClick={handleDownload} 
                    className="flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Now
                  </Button>
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <Button
                  variant="default"
                  onClick={() => setLocation('/direct-checkout')}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/')}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-col text-sm text-muted-foreground border-t pt-6">
          <p>
            If you need assistance with your purchase, please contact our customer support at 
            <a href="mailto:support@deeptravel.com" className="text-primary mx-1">support@deeptravel.com</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}