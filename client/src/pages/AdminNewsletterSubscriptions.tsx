import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: number;
  email: string;
  source: string;
  subscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNewsletterSubscriptions() {
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState(false);
  
  // Fetch all newsletter subscriptions
  const { data: subscriptions = [], isLoading, isError, refetch } = useQuery<Subscription[]>({
    queryKey: ['/api/admin/newsletter-subscriptions'],
    retry: false
  });
  
  useEffect(() => {
    document.title = "Admin - Newsletter Subscriptions";
  }, []);
  
  const handleExportCSV = () => {
    if (!subscriptions || subscriptions.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no newsletter subscriptions to export.",
        variant: "destructive"
      });
      return;
    }
    
    setExportLoading(true);
    
    try {
      // Create CSV content
      const headers = ["Email", "Source", "Subscribed", "Date"];
      const csvContent = [
        headers.join(","),
        ...subscriptions.map((sub: Subscription) => [
          sub.email,
          sub.source || 'Unknown',
          sub.subscribed ? 'Yes' : 'No',
          new Date(sub.createdAt).toLocaleDateString()
        ].join(","))
      ].join("\n");
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${subscriptions.length} subscribers exported to CSV.`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  const getSourceLabel = (source: string) => {
    const sourceMap: Record<string, string> = {
      'bali_popup': 'Bali Popup',
      'travel_guide': 'Travel Guide',
      'newsletter': 'Main Newsletter'
    };
    
    return sourceMap[source] || source;
  };
  
  const getSourceColor = (source: string) => {
    const colorMap: Record<string, string> = {
      'bali_popup': 'bg-blue-500',
      'travel_guide': 'bg-green-500',
      'newsletter': 'bg-purple-500'
    };
    
    return colorMap[source] || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Newsletter Subscribers</CardTitle>
              <CardDescription>View and manage all newsletter subscriptions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleExportCSV}
                disabled={isLoading || exportLoading || !subscriptions || subscriptions.length === 0}
              >
                {exportLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading subscribers. Please try again.
            </div>
          ) : !subscriptions || subscriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No newsletter subscribers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Total subscribers: {subscriptions.length}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub: Subscription) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getSourceColor(sub.source)} text-white`}>
                          {getSourceLabel(sub.source || 'Unknown')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sub.subscribed ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Subscribed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Unsubscribed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-gray-500">
            All email data is stored securely in your database.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}