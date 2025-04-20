// This file contains the dropdown menu structures for the main navigation
import snowbirdDestinations, { getDestinationById } from './snowbirdDestinations';

// Helper function to get destination name by ID
const getDestinationName = (id: string): string => {
  const destination = getDestinationById(id);
  return destination ? destination.name : id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
};

// Main navigation items as requested
export const mainNavItems = [
  {
    label: "Canadian Snowbirds",
    path: "/canadian-snowbirds",
    dropdown: [
      {
        label: "Why Consider Alternatives to the US",
        path: "/canadian-snowbirds/why-alternatives"
      },
      {
        label: "Destination Quiz",
        path: "/canadian-snowbirds/destination-finder"
      },
      {
        label: "Snowbird Destinations",
        path: "/canadian-snowbirds/destinations",
        hasSubmenu: true
      },
      {
        label: "Practical Resources",
        path: "/canadian-snowbirds/practical-resources",
        hasSubmenu: true
      },
      {
        label: "Canadian Communities Abroad",
        path: "/canadian-snowbirds/communities-abroad"
      }
    ]
  },
  {
    label: "Immersive Experiences",
    path: "/immersive-experiences"
    // No dropdown needed for this item
  },
  {
    label: "Pricing",
    path: "/pricing"
  },
  {
    label: "About",
    path: "/about"
  }
];

// Canadian Snowbirds dropdown (legacy, maintained for compatibility)
export const canadianSnowbirdsMenu = [
  {
    label: "Why Consider Alternatives to the US",
    href: "/canadian-snowbirds/why-alternatives"
  },
  {
    label: "Destination Quiz",
    href: "/canadian-snowbirds/destination-finder"
  },
  {
    label: "Snowbird Destinations",
    href: "/canadian-snowbirds/destinations",
    items: [
      {
        label: "Browse All Destinations",
        href: "/canadian-snowbirds/destinations"
      },
      {
        label: "North America",
        items: [
          {
            label: getDestinationName('merida'),
            href: "/canadian-snowbirds/destinations/merida"
          },
          {
            label: getDestinationName('puerto-vallarta'),
            href: "/canadian-snowbirds/destinations/puerto-vallarta"
          }
        ]
      },
      {
        label: "Central America",
        items: [
          {
            label: getDestinationName('costa-rica'),
            href: "/canadian-snowbirds/destinations/costa-rica"
          },
          {
            label: getDestinationName('panama-city'),
            href: "/canadian-snowbirds/destinations/panama-city"
          },
          {
            label: "Belize City (Coming Soon)",
            href: "#"
          }
        ]
      },
      {
        label: "Caribbean",
        items: [
          {
            label: getDestinationName('punta-cana'),
            href: "/canadian-snowbirds/destinations/punta-cana"
          },
          {
            label: getDestinationName('varadero'),
            href: "/canadian-snowbirds/destinations/varadero"
          }
        ]
      },
      {
        label: "South America",
        items: [
          {
            label: getDestinationName('medellin'),
            href: "/canadian-snowbirds/destinations/medellin"
          },
          {
            label: "Cuenca, Ecuador (Coming Soon)",
            href: "#"
          }
        ]
      },
      {
        label: "Europe",
        items: [
          {
            label: getDestinationName('lisbon'),
            href: "/canadian-snowbirds/destinations/lisbon"
          },
          {
            label: getDestinationName('malaga'),
            href: "/canadian-snowbirds/destinations/malaga"
          },
          {
            label: getDestinationName('algarve'),
            href: "/canadian-snowbirds/destinations/algarve"
          }
        ]
      },
      {
        label: "Asia",
        items: [
          {
            label: getDestinationName('chiang-mai'),
            href: "/canadian-snowbirds/destinations/chiang-mai"
          },
          {
            label: "Penang, Malaysia (Coming Soon)",
            href: "#"
          },
          {
            label: "Vietnam",
            href: "/canadian-snowbirds/destinations/vietnam"
          }
        ]
      },
      {
        label: "Africa",
        items: [
          {
            label: "Morocco",
            href: "/canadian-snowbirds/destinations/morocco"
          }
        ]
      }
    ]
  },
  {
    label: "Practical Resources",
    href: "/canadian-snowbirds/practical-resources",
    items: [
      {
        label: "Provincial Health Coverage",
        href: "/canadian-snowbirds/practical-resources#provincial-health"
      },
      {
        label: "Healthcare",
        href: "/canadian-snowbirds/practical-resources#healthcare"
      },
      {
        label: "Financial Management",
        href: "/canadian-snowbirds/practical-resources#financial"
      },
      {
        label: "Housing",
        href: "/canadian-snowbirds/practical-resources#housing"
      },
      {
        label: "Legal Documentation",
        href: "/canadian-snowbirds/practical-resources#legal"
      }
    ]
  },
  {
    label: "Canadian Communities Abroad",
    href: "/canadian-snowbirds/communities-abroad"
  }
];

// Destinations dropdown
export const destinationsMenu = [
  {
    label: "By Region",
    items: [
      {
        label: "Latin America",
        href: "/destinations/region/latin-america"
      },
      {
        label: "Europe",
        href: "/destinations/region/europe"
      },
      {
        label: "Asia",
        href: "/destinations/region/asia"
      },
      {
        label: "Caribbean",
        href: "/destinations/region/caribbean"
      }
    ]
  },
  {
    label: "By Experience Type",
    items: [
      {
        label: "Beach & Coastal",
        href: "/destinations/experience/beach-coastal"
      },
      {
        label: "Mountain & Nature",
        href: "/destinations/experience/mountain-nature"
      },
      {
        label: "Cultural & Historic",
        href: "/destinations/experience/cultural-historic"
      },
      {
        label: "Urban Exploration",
        href: "/destinations/experience/urban-exploration"
      }
    ]
  },
  {
    label: "Featured Destinations",
    href: "/destinations/featured"
  }
];

// Immersive Experiences dropdown
export const immersiveExperiencesMenu = [
  {
    label: "Cultural Immersion Guides",
    href: "/immersive-experiences/cultural-immersion"
  },
  {
    label: "Regional Collections",
    items: [
      {
        label: "Europe",
        href: "/immersive-experiences/region/europe"
      },
      {
        label: "Asia",
        href: "/immersive-experiences/region/asia"
      },
      {
        label: "North America",
        href: "/immersive-experiences/region/north-america"
      },
      {
        label: "Latin America",
        href: "/immersive-experiences/region/latin-america"
      },
      {
        label: "Africa",
        href: "/immersive-experiences/region/africa"
      }
    ]
  },
  {
    label: "Popular Destinations",
    items: [
      {
        label: "Barcelona",
        href: "/immersive-experiences/destination/barcelona"
      },
      {
        label: "Tokyo",
        href: "/immersive-experiences/destination/tokyo"
      },
      {
        label: "Bali",
        href: "/immersive-experiences/destination/bali"
      },
      {
        label: "Rome",
        href: "/immersive-experiences/destination/rome"
      },
      {
        label: "New York",
        href: "/immersive-experiences/destination/new-york"
      }
    ]
  },
  {
    label: "Themed Experiences",
    items: [
      {
        label: "Food & Culinary",
        href: "/immersive-experiences/theme/food"
      },
      {
        label: "Art & Architecture",
        href: "/immersive-experiences/theme/art"
      },
      {
        label: "History & Heritage",
        href: "/immersive-experiences/theme/history"
      },
      {
        label: "Local Living",
        href: "/immersive-experiences/theme/local-living"
      },
      {
        label: "Nature & Outdoors",
        href: "/immersive-experiences/theme/nature"
      }
    ]
  },
  {
    label: "Browse All Experiences",
    href: "/immersive-experiences"
  },
  {
    label: "Create Custom Experience",
    href: "/immersive-experiences/custom"
  }
];