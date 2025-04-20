import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Purchase = {
  id: number;
  email: string;
  amount: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
  destinationId: number | null;
  productType: string | null;
};

export default function AdminDashboard() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const response = await fetch('/api/admin/purchases');
        
        if (!response.ok) {
          throw new Error('Failed to fetch purchase data');
        }
        
        const data = await response.json();
        setPurchases(data.purchases);
      } catch (err: any) {
        console.error('Error fetching purchases:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPurchases();
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Customer Purchases</CardTitle>
          <CardDescription>View all customer purchase information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-700">
              {error}
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No purchase records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Completion Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.id}</TableCell>
                      <TableCell>{purchase.email}</TableCell>
                      <TableCell>
                        {purchase.amount !== undefined && purchase.amount !== null
                          ? `$${typeof purchase.amount === 'number' 
                              ? purchase.amount.toFixed(2) 
                              : purchase.amount}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          purchase.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : purchase.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : purchase.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {purchase.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(purchase.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {purchase.completedAt 
                          ? new Date(purchase.completedAt).toLocaleString() 
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          This data is pulled directly from your database. 
        </CardFooter>
      </Card>
    </div>
  );
}