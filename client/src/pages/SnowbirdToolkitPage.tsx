import React from 'react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import SnowbirdToolkit from '@/components/snowbird/SnowbirdToolkit';

const SnowbirdToolkitPage: React.FC = () => {
  return (
    <div className="bg-neutral-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/snowbird">
            <Button variant="link" className="text-primary p-0">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Snowbird Resources
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Snowbird Toolkit Resources</h1>
          <SnowbirdToolkit />
        </div>
      </div>
    </div>
  );
};

export default SnowbirdToolkitPage;