import { type Destination, type Itinerary, type Day } from "@shared/schema";

// Function to create a basic PDF structure
export function generatePdfContent(
  destination: Destination,
  itinerary: Itinerary,
  days: Day[]
): string {
  // This is just a placeholder - in a real implementation,
  // we would use a proper PDF generation library on the server
  return `
    <html>
      <head>
        <title>${itinerary.title}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #2563EB; }
          .day { margin-bottom: 20px; }
          .day-title { font-weight: bold; }
          .activity { margin-left: 20px; }
        </style>
      </head>
      <body>
        <h1>${itinerary.title}</h1>
        <p><strong>${destination.name}, ${destination.country}</strong></p>
        <p>${destination.description}</p>
        
        <h2>Itinerary Overview</h2>
        ${days
          .map(
            (day) => `
          <div class="day">
            <div class="day-title">Day ${day.dayNumber}: ${day.title}</div>
            <ul>
              ${day.activities
                .map((activity) => `<li class="activity">${activity}</li>`)
                .join("")}
            </ul>
          </div>
        `
          )
          .join("")}
        
        <p>${itinerary.content}</p>
      </body>
    </html>
  `;
}
