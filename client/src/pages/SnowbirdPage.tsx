import React from 'react';
import { Link } from 'wouter';
import { useFonts } from "@/components/ui/fonts";
import SnowbirdSection from '@/components/snowbird/SnowbirdSection';
import SnowbirdLeadMagnet from '@/components/SnowbirdLeadMagnet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SnowbirdPage: React.FC = () => {
  const { heading } = useFonts();

  return (
    <div className="bg-neutral-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="link" className="text-primary p-0">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to home
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <SnowbirdLeadMagnet />
        </div>
        
        <div className="flex justify-center mb-8">
          <Link href="/snowbird-toolkit">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium text-lg px-8 py-6">
              View the Ultimate Snowbird Toolkit
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SnowbirdSection />
        </div>
      </div>
    </div>
  );
};

export default SnowbirdPage;