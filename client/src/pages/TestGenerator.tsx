import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

// Creating a simple inline Spinner component since we're having import issues
const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
);

// Define generator types
const generatorTypes = [
  { value: 'default', label: 'Default Generator' },
  { value: 'chunked', label: 'Chunked Generator' },
  { value: 'resilient', label: 'Resilient Generator' },
  { value: 'efficient', label: 'Efficient Generator' }
];

export default function TestGenerator() {
  const [destinationName, setDestinationName] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [generatorType, setGeneratorType] = useState('efficient');
  const [dayNumber, setDayNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('create');
  const { toast } = useToast();

  const createDestination = async () => {
    if (!destinationName || !destinationCountry) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both destination name and country.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/test/destinations', {
        name: destinationName,
        country: destinationCountry
      });
      
      const data = await response.json();
      setDestinationId(data.id);
      
      toast({
        title: 'Destination Created',
        description: `Created ${data.name}, ${data.country} with ID ${data.id}`,
      });
      
      setActiveTab('itinerary');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create destination',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateItinerary = async () => {
    if (!destinationId) {
      toast({
        title: 'Missing Destination',
        description: 'Please create or select a destination first.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await apiRequest('POST', `/api/test/itinerary/${destinationId}`, {
        generatorType
      });
      
      const data = await response.json();
      setResult(data);
      
      toast({
        title: 'Itinerary Generated',
        description: `Generated in ${data.generationTime}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate itinerary',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDay = async () => {
    if (!destinationId) {
      toast({
        title: 'Missing Destination',
        description: 'Please create or select a destination first.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await apiRequest('POST', `/api/test/day/${destinationId}`, {
        dayNumber,
        generatorType
      });
      
      const data = await response.json();
      setResult(data);
      
      toast({
        title: 'Day Generated',
        description: `Generated day ${dayNumber} in ${data.generationTime}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate day',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">Itinerary Generator Test Suite</h1>
      <p className="text-gray-500 mb-8">
        Use this tool to test different itinerary generation methods and compare their performance and output quality.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Destination</TabsTrigger>
          <TabsTrigger value="itinerary">Full Itinerary</TabsTrigger>
          <TabsTrigger value="day">Single Day</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Test Destination</CardTitle>
              <CardDescription>
                Create a new destination for testing the itinerary generators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Destination Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Paris"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g., France"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={createDestination}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Create Destination'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="itinerary">
          <Card>
            <CardHeader>
              <CardTitle>Generate Full Itinerary</CardTitle>
              <CardDescription>
                Generate a complete 7-day itinerary using the selected generator type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="destination-id">Destination ID</Label>
                  <Input
                    id="destination-id"
                    type="number"
                    placeholder="Destination ID"
                    value={destinationId || ''}
                    onChange={(e) => setDestinationId(parseInt(e.target.value) || null)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="generator-type">Generator Type</Label>
                  <RadioGroup 
                    value={generatorType} 
                    onValueChange={setGeneratorType}
                    className="grid grid-cols-2 gap-2"
                  >
                    {generatorTypes.map((type) => (
                      <div className="flex items-center space-x-2" key={type.value}>
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value}>{type.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button 
                  className="w-full" 
                  onClick={generateItinerary}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Generate Itinerary'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle>Generate Single Day</CardTitle>
              <CardDescription>
                Generate content for a specific day using the selected generator type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="day-destination-id">Destination ID</Label>
                  <Input
                    id="day-destination-id"
                    type="number"
                    placeholder="Destination ID"
                    value={destinationId || ''}
                    onChange={(e) => setDestinationId(parseInt(e.target.value) || null)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="day-number">Day Number (1-7)</Label>
                  <Select
                    value={dayNumber.toString()}
                    onValueChange={(value) => setDayNumber(parseInt(value))}
                  >
                    <SelectTrigger id="day-number">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            Day {day}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="day-generator-type">Generator Type</Label>
                  <RadioGroup 
                    value={generatorType} 
                    onValueChange={setGeneratorType}
                    className="grid grid-cols-2 gap-2"
                  >
                    {generatorTypes.map((type) => (
                      <div className="flex items-center space-x-2" key={type.value}>
                        <RadioGroupItem value={type.value} id={`day-${type.value}`} />
                        <Label htmlFor={`day-${type.value}`}>{type.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button 
                  className="w-full" 
                  onClick={generateDay}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Generate Day'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              Generated in {result.generationTime} using {result.generatorType} generator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}