import { useState, useEffect } from 'react';
import { Check, Download, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useFonts } from '@/components/ui/fonts';
import { Progress } from '@/components/ui/progress';

interface PurchaseStatus {
  success: boolean;
  status: 'pending' | 'processing' | 'generating' | 'completed' | 'failed' | 'error';
  stage: string;
  message: string;
  progress: number;
  downloadUrl?: string;
  jobId?: string;
  purchase?: {
    id: number;
    createdAt: string;
    completedAt: string | null;
    email: string;
    destinationId: number;
    templateId: number;
  };
}

export default function PaymentSuccess() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | null>(null);
  const { toast } = useToast();
  const { heading } = useFonts();

  useEffect(() => {
    // Extract the session_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    setSessionId(session);
    
    if (session) {
      // Start polling for status
      checkPurchaseStatus(session);
      startPolling(session);
    }
  }, []);
  
  const startPolling = (sessionId: string) => {
    setIsPolling(true);
    const interval = setInterval(() => {
      checkPurchaseStatus(sessionId);
    }, 5000); // Poll every 5 seconds
    
    // Stop polling after 5 minutes (300,000 ms)
    setTimeout(() => {
      clearInterval(interval);
      setIsPolling(false);
    }, 300000);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  };
  
  const checkPurchaseStatus = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/payments/status/${sessionId}`);
      const data = await response.json();
      
      setPurchaseStatus(data);
      
      // If status is terminal, stop polling
      if (['completed', 'error', 'failed'].includes(data.status)) {
        setIsPolling(false);
      }
    } catch (error: any) {
      console.error('Status check error:', error);
      setIsPolling(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!sessionId) {
        throw new Error('No session ID found');
      }
      
      setIsDownloading(true);
      
      // If we already have a downloadUrl from the purchase status, use it directly
      if (purchaseStatus?.downloadUrl) {
        window.location.href = purchaseStatus.downloadUrl;
        
        setTimeout(() => {
          setIsDownloading(false);
        }, 2000);
        return;
      }
      
      // Otherwise, get download URL from the API
      const response = await fetch(`/api/payments/download/${sessionId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get download link');
      }
      
      // Navigate to the download URL
      window.location.href = data.downloadUrl;
      
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: 'Download Error',
        description: error.message || 'An error occurred while downloading your itinerary.',
        variant: 'destructive',
      });
      setIsDownloading(false);
    }
  };

  // Render based on purchase status
  const renderContent = () => {
    if (!purchaseStatus) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p>Loading purchase status...</p>
        </div>
      );
    }
    
    if (purchaseStatus.status === 'error' || purchaseStatus.status === 'failed') {
      return (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${heading}`}>Processing Error</h1>
          <p className="text-gray-600 mb-8">
            We encountered an error while processing your itinerary. Please contact customer support.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <Link href="/">
              <Button variant="default" className="text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </>
      );
    }
    
    if (purchaseStatus.status === 'generating') {
      // Determine which tasks are highlighted based on progress percentage
      const progress = purchaseStatus.progress || 0;
      const taskStatuses = {
        preparation: progress >= 10,
        dayPlans: progress >= 30,
        localExperiences: progress >= 50,
        recommendations: progress >= 70,
        formatting: progress >= 90
      };
      
      return (
        <>
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="h-8 w-8 text-amber-600 animate-spin" />
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${heading}`}>Creating Your Itinerary!</h1>
          <p className="text-gray-600 mb-4">
            Payment confirmed! We're generating your personalized premium travel itinerary.
          </p>
          
          <div className="w-full max-w-md mx-auto mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{purchaseStatus.message || "Generating premium content..."}</span>
              <span>{purchaseStatus.progress}%</span>
            </div>
            <Progress value={purchaseStatus.progress} className="h-2" />
          </div>
          
          {purchaseStatus.jobId && (
            <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
              Job ID: {purchaseStatus.jobId} 
              <span className="ml-1 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </p>
          )}
          
          <div className="text-sm text-gray-700 bg-amber-50 p-4 rounded-lg mb-8 mx-auto max-w-md">
            <p className="font-medium mb-3">Generation Progress:</p>
            <ul className="space-y-2">
              <li className={`flex items-center ${taskStatuses.preparation ? 'text-green-700' : 'text-gray-500'}`}>
                <span className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${taskStatuses.preparation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {taskStatuses.preparation ? <Check className="h-3 w-3" /> : '1'}
                </span>
                <span>Preparing destination data</span>
              </li>
              <li className={`flex items-center ${taskStatuses.dayPlans ? 'text-green-700' : 'text-gray-500'}`}>
                <span className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${taskStatuses.dayPlans ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {taskStatuses.dayPlans ? <Check className="h-3 w-3" /> : '2'}
                </span>
                <span>Creating day-by-day activity plans</span>
              </li>
              <li className={`flex items-center ${taskStatuses.localExperiences ? 'text-green-700' : 'text-gray-500'}`}>
                <span className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${taskStatuses.localExperiences ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {taskStatuses.localExperiences ? <Check className="h-3 w-3" /> : '3'}
                </span>
                <span>Adding authentic local experiences</span>
              </li>
              <li className={`flex items-center ${taskStatuses.recommendations ? 'text-green-700' : 'text-gray-500'}`}>
                <span className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${taskStatuses.recommendations ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {taskStatuses.recommendations ? <Check className="h-3 w-3" /> : '4'}
                </span>
                <span>Generating dining recommendations</span>
              </li>
              <li className={`flex items-center ${taskStatuses.formatting ? 'text-green-700' : 'text-gray-500'}`}>
                <span className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${taskStatuses.formatting ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {taskStatuses.formatting ? <Check className="h-3 w-3" /> : '5'}
                </span>
                <span>Formatting your premium PDF</span>
              </li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500 mb-8">
            This process may take a few minutes. You can leave this page and come back later with your session ID.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <Link href="/">
              <Button variant="outline" className="text-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </>
      );
    }
    
    if (purchaseStatus.status === 'processing' || purchaseStatus.status === 'pending') {
      return (
        <>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${heading}`}>Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. We're preparing your premium itinerary.
          </p>
          
          <div className="w-full max-w-md mx-auto mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{purchaseStatus.message}</span>
              <span>{purchaseStatus.progress}%</span>
            </div>
            <Progress value={purchaseStatus.progress} className="h-2" />
          </div>
          
          {purchaseStatus.jobId && (
            <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
              Job ID: {purchaseStatus.jobId} 
              <span className="ml-1 inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            </p>
          )}
          
          <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg mb-8 max-w-md mx-auto">
            <p className="font-medium mb-2">Preparation Steps:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Connecting to destination database</li>
              <li>Loading itinerary template</li>
              <li>Preparing PDF document structure</li>
              <li>Setting up content generation queue</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500 mb-8">
            This may take a few minutes. You can leave this page and come back later with your session ID.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <Link href="/">
              <Button variant="outline" className="text-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </>
      );
    }
    
    // Default: completed
    return (
      <>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className={`text-3xl font-bold mb-2 ${heading}`}>Itinerary Ready!</h1>
        <p className="text-gray-600 mb-8">
          Your premium travel itinerary has been generated and is ready to download.
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Preparing download...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download Your Itinerary
              </>
            )}
          </Button>
          
          <Link href="/">
            <Button variant="ghost" className="text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </>
    );
  };

  const [manualSessionId, setManualSessionId] = useState<string>('');
  const [showSessionInput, setShowSessionInput] = useState<boolean>(false);
  
  const handleManualCheck = () => {
    if (!manualSessionId.trim()) {
      toast({
        title: "Session ID Required",
        description: "Please enter a valid session ID to check your purchase status.",
        variant: "destructive",
      });
      return;
    }
    
    setSessionId(manualSessionId);
    checkPurchaseStatus(manualSessionId);
    startPolling(manualSessionId);
    setShowSessionInput(false);
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {!sessionId && !showSessionInput ? (
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-4 ${heading}`}>Check Your Purchase</h1>
            <p className="text-gray-600 mb-6">
              Enter your session ID to check the status of your purchase
            </p>
            <Button 
              onClick={() => setShowSessionInput(true)}
              variant="default"
              className="mx-auto"
            >
              Enter Session ID
            </Button>
          </div>
        ) : showSessionInput ? (
          <div className="max-w-md mx-auto">
            <h2 className={`text-2xl font-bold mb-4 ${heading}`}>Enter Your Session ID</h2>
            <p className="text-gray-600 mb-4">
              If you left this page previously, you can check your purchase status by entering your session ID.
            </p>
            <div className="mb-4">
              <input
                type="text"
                value={manualSessionId}
                onChange={(e) => setManualSessionId(e.target.value)}
                placeholder="sess_123456789..."
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleManualCheck}
                  variant="default"
                  className="flex-1"
                >
                  Check Status
                </Button>
                <Button 
                  onClick={() => setShowSessionInput(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        {sessionId && (
          <>
            <p>
              If you encounter any issues, please contact our support team with your payment reference:
            </p>
            <p className="font-mono mt-1">{sessionId}</p>
            {isPolling && (
              <p className="mt-2 text-blue-500">
                <RefreshCw className="inline-block h-3 w-3 mr-1 animate-spin" />
                Automatically refreshing status...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}