import React, { useEffect } from 'react';
import WhyConsiderAlternatives from './WhyConsiderAlternatives';

const CanadianSnowbirdWhyAlternatives: React.FC = () => {
  useEffect(() => {
    // This is just a wrapper component for WhyConsiderAlternatives
    console.log('CanadianSnowbirdWhyAlternatives mounted');
  }, []);

  return <WhyConsiderAlternatives />;
};

export default CanadianSnowbirdWhyAlternatives;