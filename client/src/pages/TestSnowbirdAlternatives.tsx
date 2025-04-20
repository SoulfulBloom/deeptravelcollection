import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const TestSnowbirdAlternatives: React.FC = () => {
  useEffect(() => {
    document.title = "Testing Alternatives to the US | Deep Travel Collections";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Navigation Test Page</h1>
        <p className="mb-6">Use the links below to test navigation to the "Why Consider Alternatives to the US" page:</p>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Using Standard Link</h2>
            <Link href="/canadian-snowbirds/why-alternatives">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Go to Why Consider Alternatives (Standard Link)
              </Button>
            </Link>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Using window.location</h2>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = '/canadian-snowbirds/why-alternatives'}
            >
              Go to Why Consider Alternatives (window.location)
            </Button>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Using HTML redirect</h2>
            <a href="/why-alternatives.html" className="inline-block">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Go to Why Consider Alternatives (HTML redirect)
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSnowbirdAlternatives;