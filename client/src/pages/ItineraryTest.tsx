import React, { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

// Sample list of destinations for testing
const TEST_DESTINATIONS = [
  { id: 35, name: 'Amsterdam', country: 'Netherlands' },
  { id: 24, name: 'Barcelona', country: 'Spain' },
  { id: 43, name: 'Tokyo', country: 'Japan' },
  { id: 57, name: 'New York', country: 'United States' },
];

// This page allows testing the various itinerary generation methods
export default function ItineraryTest() {
  const [selectedDestination, setSelectedDestination] = useState(TEST_DESTINATIONS[0]);
  const [selectedGenerator, setSelectedGenerator] = useState<string>('resilient');
  const [useCache, setUseCache] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState<number | null>(null);
  
  // Generate a complete itinerary using the selected generator
  const generateFullItinerary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      
      // Clear any existing interval
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
      
      // Start the generation process
      const response = await apiRequest('POST', '/api/v2/itinerary/generate', {
        destinationId: selectedDestination.id,
        generator: selectedGenerator,
        forceRefresh: !useCache,
        useCache
      });
      
      const data = await response.json();
      
      if (data.processing) {
        // Show processing state
        setResult({ processing: true, statusEndpoint: data.statusEndpoint });
        
        // Set up polling to check status
        const intervalId = window.setInterval(async () => {
          try {
            const statusResponse = await apiRequest('GET', data.statusEndpoint);
            const statusData = await statusResponse.json();
            
            if (statusData.ready) {
              // Clear interval when ready
              clearInterval(intervalId);
              setStatusCheckInterval(null);
              
              // Show result
              setResult(statusData);
              setIsLoading(false);
            }
          } catch (e) {
            console.error('Error checking status:', e);
          }
        }, 3000); // Check every 3 seconds
        
        setStatusCheckInterval(intervalId as unknown as number);
      } else {
        // Immediate result
        setResult(data);
        setIsLoading(false);
      }
    } catch (e: any) {
      console.error('Error generating itinerary:', e);
      setError(e.message || 'Failed to generate itinerary');
      setIsLoading(false);
    }
  };
  
  // Generate a single day's itinerary
  const generateDayItinerary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      
      const response = await apiRequest(
        'GET', 
        `/api/v2/itinerary/${selectedDestination.id}/day/${selectedDay}?generator=${selectedGenerator}&refresh=${!useCache}`
      );
      
      const data = await response.json();
      setResult(data);
      setIsLoading(false);
    } catch (e: any) {
      console.error('Error generating day itinerary:', e);
      setError(e.message || 'Failed to generate day itinerary');
      setIsLoading(false);
    }
  };
  
  // Configure the default generator
  const setDefaultGenerator = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiRequest('POST', '/api/v2/itinerary/config/default-generator', {
        generator: selectedGenerator
      });
      
      const data = await response.json();
      setResult({ defaultGeneratorSet: true, ...data });
      setIsLoading(false);
    } catch (e: any) {
      console.error('Error setting default generator:', e);
      setError(e.message || 'Failed to set default generator');
      setIsLoading(false);
    }
  };
  
  // Clean up the interval when component unmounts
  React.useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Itinerary Generator Test</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generator Configuration</CardTitle>
          <CardDescription>
            Test different itinerary generation strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Select 
                  value={selectedDestination.id.toString()} 
                  onValueChange={(value) => {
                    const dest = TEST_DESTINATIONS.find(d => d.id.toString() === value);
                    if (dest) setSelectedDestination(dest);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_DESTINATIONS.map((dest) => (
                      <SelectItem key={dest.id} value={dest.id.toString()}>
                        {dest.name}, {dest.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="generator">Generator Type</Label>
                <Select 
                  value={selectedGenerator} 
                  onValueChange={(value) => setSelectedGenerator(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a generator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Generator</SelectItem>
                    <SelectItem value="chunked">Chunked Generator</SelectItem>
                    <SelectItem value="efficient">Efficient Generator</SelectItem>
                    <SelectItem value="resilient">Resilient Generator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCache"
                  checked={useCache}
                  onChange={(e) => setUseCache(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="useCache">Use Cache</Label>
              </div>
              
              <div>
                <Label htmlFor="day">Day Number (for single day generation)</Label>
                <Select 
                  value={selectedDay.toString()} 
                  onValueChange={(value) => setSelectedDay(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        Day {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button 
              onClick={generateFullItinerary} 
              disabled={isLoading}
              variant="default"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Full Itinerary
            </Button>
            
            <Button 
              onClick={generateDayItinerary} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Day {selectedDay}
            </Button>
          </div>
          
          <Button 
            onClick={setDefaultGenerator} 
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Set As Default Generator
          </Button>
        </CardFooter>
      </Card>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Generator Result for {selectedDestination.name}, {selectedDestination.country}
              </span>
              {result.cached && (
                <Badge variant="secondary">Cached</Badge>
              )}
            </CardTitle>
            {result.processing && (
              <CardDescription className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing... Checking status every 3 seconds
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            {result.processing ? (
              <div className="p-8 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg">
                  Generating itinerary with {selectedGenerator} generator...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This may take up to 2-3 minutes for a full 7-day itinerary
                </p>
              </div>
            ) : result.defaultGeneratorSet ? (
              <Alert>
                <AlertTitle>Default Generator Updated</AlertTitle>
                <AlertDescription>
                  The default generator has been set to <strong>{result.generator}</strong>
                </AlertDescription>
              </Alert>
            ) : result.content ? (
              <div className="border rounded-md p-4 max-h-[70vh] overflow-auto">
                <ReactMarkdown className="prose max-w-none">
                  {result.content}
                </ReactMarkdown>
              </div>
            ) : (
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[70vh]">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}