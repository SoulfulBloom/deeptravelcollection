import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function TestPaymentButton() {
  const [email, setEmail] = useState('');
  const [destinationId, setDestinationId] = useState('24'); // Barcelona by default
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const { toast } = useToast();

  // Poll for status updates if we have a session ID
  useEffect(() => {
    if (!sessionId) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await apiRequest('GET', `/api/payments/download/${sessionId}`);
        const data = await response.json();
        
        setStatus(data.status || 'processing');
        
        if (data.success && data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
          clearInterval(interval);
          toast({
            title: "PDF Generation Complete!",
            description: "Your itinerary is ready for download.",
          });
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [sessionId, toast]);

  const handleSimulatePayment = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await apiRequest('POST', '/api/payments/simulate', {
        email,
        destinationId: parseInt(destinationId),
        templateId: 1,
        amount: 1999, // $19.99 in cents
        tier: 'premium'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.sessionId);
        setStatus('pending');
        toast({
          title: "Payment Simulated Successfully",
          description: "Your PDF is being generated...",
        });
      } else {
        toast({
          title: "Payment Simulation Failed",
          description: data.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment simulation error:', error);
      toast({
        title: "Payment Simulation Failed",
        description: "Server error processing your request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Test Payment Integration</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Destination ID</label>
        <Input
          type="number"
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          placeholder="Destination ID"
          required
        />
      </div>
      
      <Button
        onClick={handleSimulatePayment}
        disabled={isProcessing || !email}
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Simulate Payment ($19.99)"}
      </Button>
      
      {sessionId && (
        <div className="p-3 bg-gray-100 rounded-md mt-4">
          <p className="font-semibold">Session ID: {sessionId}</p>
          <p>Status: {status}</p>
          
          {pdfUrl && (
            <div className="mt-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download Your Itinerary PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}