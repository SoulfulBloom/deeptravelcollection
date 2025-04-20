import { useEffect } from 'react';
import { invalidateQueries } from '../lib/queryClient';

export default function ForceRefresh() {
  useEffect(() => {
    // Force refresh collections data
    invalidateQueries(['/api/collections/featured']);
    
    console.log('Forced refresh of collections data');
  }, []);
  
  return null;
}