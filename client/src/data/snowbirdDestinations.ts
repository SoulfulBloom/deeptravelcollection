export interface SnowbirdDestination {
  id: string;
  name: string;
  shortDescription: string;
  thumbnailImage: string;
  headerImage: string;
  showcaseImage?: string; // Optional, only for featured destinations
  altText: string;
  path: string;
  featured: boolean;
  region: 'latin-america' | 'europe' | 'asia' | 'africa' | 'caribbean' | 'north-america';
  benefits: string[];
}

export const snowbirdDestinations: SnowbirdDestination[] = [
  {
    id: 'panama-city',
    name: 'Panama City, Panama',
    shortDescription: 'Modern amenities with tropical climate',
    thumbnailImage: '/images/destinations/thumbs/panama-city.jpg',
    headerImage: '/images/destinations/headers/panama-city.jpg',
    showcaseImage: '/images/destinations/showcase/panama-city.jpg',
    altText: 'Panama City skyline with modern buildings and ocean view',
    path: '/canadian-snowbirds/destinations/panama-city',
    featured: true,
    region: 'latin-america',
    benefits: [
      'Uses US dollar',
      'Pensionado visa program',
      'Developed infrastructure'
    ]
  },
  {
    id: 'lisbon',
    name: 'Lisbon, Portugal',
    shortDescription: 'Beautiful Europe destination',
    thumbnailImage: '/images/destinations/thumbs/lisbon.jpg',
    headerImage: '/images/destinations/headers/lisbon.jpg',
    showcaseImage: '/images/destinations/showcase/lisbon.jpg',
    altText: 'Historic buildings and trams in Lisbon, Portugal with ocean view',
    path: '/canadian-snowbirds/destinations/lisbon',
    featured: true,
    region: 'europe',
    benefits: [
      'Schengen visa for 90 days, D7 visa available for longer stays',
      'Excellent public and private healthcare system',
      'Moderate, with affordable dining and transportation options'
    ]
  },
  {
    id: 'algarve',
    name: 'Algarve, Portugal',
    shortDescription: 'Stunning coastline and mild climate year-round',
    thumbnailImage: '/images/destinations/thumbs/algarve.jpg',
    headerImage: '/images/destinations/headers/algarve.jpg',
    showcaseImage: '/images/destinations/showcase/algarve.jpg',
    altText: 'Beautiful beaches and cliffs of the Algarve coast in Portugal',
    path: '/canadian-snowbirds/destinations/algarve',
    featured: true,
    region: 'europe',
    benefits: [
      'Schengen visa for 90 days, D7 visa available for longer stays',
      'Excellent healthcare facilities',
      '20-30% lower cost of living than Lisbon'
    ]
  },
  {
    id: 'chiang-mai',
    name: 'Chiang Mai, Thailand',
    shortDescription: 'Cultural hub with affordable living',
    thumbnailImage: '/images/destinations/thumbs/chiang-mai.jpg',
    headerImage: '/images/destinations/headers/chiang-mai.jpg',
    showcaseImage: '/images/destinations/showcase/chiang-mai.jpg',
    altText: 'Ancient temples and mountains in Chiang Mai, Thailand',
    path: '/canadian-snowbirds/destinations/chiang-mai',
    featured: true,
    region: 'asia',
    benefits: [
      '60-day tourist visa with extensions available',
      'High-quality international hospitals at affordable prices',
      'Very affordable cost of living'
    ]
  },
  {
    id: 'malaga',
    name: 'Malaga, Spain',
    shortDescription: 'Beautiful Europe destination',
    thumbnailImage: '/images/destinations/thumbs/malaga.jpg',
    headerImage: '/images/destinations/headers/malaga.jpg',
    showcaseImage: '/images/destinations/showcase/malaga.jpg',
    altText: 'Beautiful coastal view of Malaga, Spain with Mediterranean beaches and city skyline',
    path: '/canadian-snowbirds/destinations/malaga',
    featured: true,
    region: 'europe',
    benefits: [
      'Schengen visa for 90 days, Non-lucrative visa for longer stays',
      'Excellent public healthcare system, good private options',
      'Very reasonable compared to major Canadian cities'
    ]
  },
  {
    id: 'medellin',
    name: 'Medellín, Colombia',
    shortDescription: 'Beautiful South America destination',
    thumbnailImage: '/images/destinations/thumbs/medellin.jpg',
    headerImage: '/images/destinations/headers/medellin.jpg',
    showcaseImage: '/images/destinations/showcase/medellin.jpg',
    altText: 'Modern cityscape of Medellín, Colombia surrounded by mountains',
    path: '/canadian-snowbirds/destinations/medellin',
    featured: true,
    region: 'latin-america',
    benefits: [
      '90-day tourist visa, retirement visa available',
      'High-quality healthcare at affordable prices',
      'Very affordable, approximately 40-50% less than Canada'
    ]
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    shortDescription: 'Beautiful Central America destination',
    thumbnailImage: '/images/destinations/thumbs/san-jose.jpg',
    headerImage: '/images/destinations/headers/costa-rica.jpg',
    showcaseImage: '/images/destinations/showcase/costa-rica.jpg',
    altText: 'Lush green rainforest and beach in Costa Rica with tropical wildlife',
    path: '/canadian-snowbirds/destinations/costa-rica',
    featured: true,
    region: 'latin-america',
    benefits: [
      'No visa required for stays up to 90 days, can extend by leaving the country',
      'High quality private healthcare at a fraction of North American costs, many doctors are US-trained',
      'Moderate, with affordable food but imported goods can be expensive'
    ]
  },
  {
    id: 'varadero',
    name: 'Varadero, Cuba',
    shortDescription: 'Rich culture and beautiful beaches at unbeatable prices',
    thumbnailImage: '/images/destinations/thumbs/varadero.jpg',
    headerImage: '/images/destinations/headers/varadero.jpg',
    showcaseImage: '/images/destinations/showcase/varadero.jpg',
    altText: 'Beautiful white sand beach in Varadero, Cuba with turquoise water',
    path: '/canadian-snowbirds/destinations/varadero',
    featured: true,
    region: 'caribbean',
    benefits: [
      'Safe environment',
      'Excellent healthcare',
      'Unique cultural experience'
    ]
  },
  {
    id: 'punta-cana',
    name: 'Punta Cana, Dominican Republic',
    shortDescription: 'Caribbean paradise with established snowbird communities',
    thumbnailImage: '/images/destinations/thumbs/punta-cana.jpg',
    headerImage: '/images/destinations/headers/punta-cana.jpg',
    showcaseImage: '/images/destinations/showcase/punta-cana.jpg',
    altText: 'Palm trees and sandy beach in Punta Cana, Dominican Republic',
    path: '/canadian-snowbirds/destinations/punta-cana',
    featured: true,
    region: 'caribbean',
    benefits: [
      'All-inclusive options',
      'Affordable housing',
      'Direct flights from Canada'
    ]
  },
  {
    id: 'merida',
    name: 'Mérida, Mexico',
    shortDescription: 'Beautiful North America destination',
    thumbnailImage: '/images/destinations/thumbs/merida.jpg',
    headerImage: '/images/destinations/headers/merida.jpg',
    showcaseImage: '/images/destinations/showcase/merida.jpg',
    altText: 'Colonial architecture and plaza in Merida, Mexico',
    path: '/canadian-snowbirds/destinations/merida',
    featured: true,
    region: 'north-america',
    benefits: [
      'Canadians can enter Mexico as tourists for 180 days visa-free with just a valid passport',
      'Mérida features excellent healthcare with several JCI-accredited private hospitals including Star Médica, Clínica de Mérida, and Centro Médico de las Américas',
      'Monthly expenses in Mérida typically range $1,500-2,200 CAD for a couple, compared to $3,000-4,500 in Florida'
    ]
  },
  {
    id: 'puerto-vallarta',
    name: 'Puerto Vallarta, Mexico',
    shortDescription: 'Year-round warm temperatures and beautiful beaches',
    thumbnailImage: '/images/destinations/thumbs/puerto-vallarta.jpg',
    headerImage: '/images/destinations/headers/puerto-vallarta.jpg',
    showcaseImage: '/images/destinations/showcase/puerto-vallarta.jpg',
    altText: 'Beautiful beach in Puerto Vallarta, Mexico with palm trees and mountains in the background',
    path: '/canadian-snowbirds/destinations/puerto-vallarta',
    featured: true,
    region: 'north-america',
    benefits: [
      'Strong Canadian presence',
      'Affordable living',
      'Direct flights from Canada'
    ]
  }
];

// Helper function to get featured destinations
export const getFeaturedDestinations = (): SnowbirdDestination[] => {
  return snowbirdDestinations.filter(destination => destination.featured);
};

// Helper function to get destinations by region
export const getDestinationsByRegion = (region: string): SnowbirdDestination[] => {
  return snowbirdDestinations.filter(destination => destination.region === region);
};

// Helper function to get a destination by ID
export const getDestinationById = (id: string): SnowbirdDestination | undefined => {
  return snowbirdDestinations.find(destination => destination.id === id);
};

export default snowbirdDestinations;