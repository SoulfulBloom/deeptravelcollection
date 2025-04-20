import React from 'react';
import { Link } from 'wouter';

const WhyAlternativesLink: React.FC = () => {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Link href="/canadian-snowbirds/why-alternatives">
        <a className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full shadow-lg">
          Why Consider Alternatives to the US?
        </a>
      </Link>
    </div>
  );
};

export default WhyAlternativesLink;