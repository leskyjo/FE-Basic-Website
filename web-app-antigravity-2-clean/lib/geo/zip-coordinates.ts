/**
 * ZIP Code to Coordinates Lookup
 *
 * For immediate location filtering without external API calls
 * Covers major Florida cities and can be expanded
 */

export interface ZipData {
  zip: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

// Florida ZIP codes (covering major areas)
export const FLORIDA_ZIPS: Record<string, ZipData> = {
  // Tampa Bay Area
  "34652": { zip: "34652", city: "New Port Richey", state: "FL", lat: 28.2444, lng: -82.7200 },
  "34653": { zip: "34653", city: "New Port Richey", state: "FL", lat: 28.2139, lng: -82.6729 },
  "34655": { zip: "34655", city: "New Port Richey", state: "FL", lat: 28.3050, lng: -82.6870 },
  "33602": { zip: "33602", city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
  "33603": { zip: "33603", city: "Tampa", state: "FL", lat: 27.9861, lng: -82.4528 },
  "33604": { zip: "33604", city: "Tampa", state: "FL", lat: 28.0256, lng: -82.4389 },
  "33605": { zip: "33605", city: "Tampa", state: "FL", lat: 27.9611, lng: -82.4453 },
  "33606": { zip: "33606", city: "Tampa", state: "FL", lat: 27.9361, lng: -82.4806 },
  "33607": { zip: "33607", city: "Tampa", state: "FL", lat: 27.9600, lng: -82.5064 },
  "33610": { zip: "33610", city: "Tampa", state: "FL", lat: 27.9775, lng: -82.4042 },
  "33612": { zip: "33612", city: "Tampa", state: "FL", lat: 28.0686, lng: -82.4542 },
  "33613": { zip: "33613", city: "Tampa", state: "FL", lat: 28.0772, lng: -82.3931 },
  "33614": { zip: "33614", city: "Tampa", state: "FL", lat: 28.0172, lng: -82.5153 },
  "33615": { zip: "33615", city: "Tampa", state: "FL", lat: 28.0692, lng: -82.5542 },
  "33616": { zip: "33616", city: "Tampa", state: "FL", lat: 27.8897, lng: -82.5103 },
  "33617": { zip: "33617", city: "Tampa", state: "FL", lat: 28.0917, lng: -82.4206 },
  "33618": { zip: "33618", city: "Tampa", state: "FL", lat: 28.0742, lng: -82.5031 },

  // Clearwater
  "33755": { zip: "33755", city: "Clearwater", state: "FL", lat: 27.9650, lng: -82.7381 },
  "33756": { zip: "33756", city: "Clearwater", state: "FL", lat: 27.9789, lng: -82.7589 },
  "33759": { zip: "33759", city: "Clearwater", state: "FL", lat: 28.0053, lng: -82.7211 },
  "33760": { zip: "33760", city: "Clearwater", state: "FL", lat: 27.9756, lng: -82.7967 },
  "33761": { zip: "33761", city: "Clearwater", state: "FL", lat: 27.9900, lng: -82.7578 },
  "33763": { zip: "33763", city: "Clearwater", state: "FL", lat: 28.0333, lng: -82.7375 },
  "33764": { zip: "33764", city: "Clearwater", state: "FL", lat: 28.0472, lng: -82.6953 },

  // St. Petersburg
  "33701": { zip: "33701", city: "St. Petersburg", state: "FL", lat: 27.7731, lng: -82.6789 },
  "33702": { zip: "33702", city: "St. Petersburg", state: "FL", lat: 27.8028, lng: -82.6594 },
  "33703": { zip: "33703", city: "St. Petersburg", state: "FL", lat: 27.8233, lng: -82.6492 },
  "33704": { zip: "33704", city: "St. Petersburg", state: "FL", lat: 27.8100, lng: -82.6850 },
  "33705": { zip: "33705", city: "St. Petersburg", state: "FL", lat: 27.7506, lng: -82.6503 },
  "33706": { zip: "33706", city: "St. Petersburg", state: "FL", lat: 27.7967, lng: -82.7294 },

  // Orlando
  "32801": { zip: "32801", city: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792 },
  "32803": { zip: "32803", city: "Orlando", state: "FL", lat: 28.5478, lng: -81.3622 },
  "32804": { zip: "32804", city: "Orlando", state: "FL", lat: 28.5653, lng: -81.3856 },
  "32805": { zip: "32805", city: "Orlando", state: "FL", lat: 28.5011, lng: -81.4142 },
  "32806": { zip: "32806", city: "Orlando", state: "FL", lat: 28.5244, lng: -81.3461 },
  "32807": { zip: "32807", city: "Orlando", state: "FL", lat: 28.5581, lng: -81.3208 },
  "32808": { zip: "32808", city: "Orlando", state: "FL", lat: 28.5939, lng: -81.4308 },
  "32809": { zip: "32809", city: "Orlando", state: "FL", lat: 28.4658, lng: -81.3856 },
  "32810": { zip: "32810", city: "Orlando", state: "FL", lat: 28.6078, lng: -81.4000 },
  "32811": { zip: "32811", city: "Orlando", state: "FL", lat: 28.5211, lng: -81.4358 },

  // Miami
  "33101": { zip: "33101", city: "Miami", state: "FL", lat: 25.7742, lng: -80.1936 },
  "33125": { zip: "33125", city: "Miami", state: "FL", lat: 25.7850, lng: -80.2333 },
  "33126": { zip: "33126", city: "Miami", state: "FL", lat: 25.7742, lng: -80.2881 },
  "33127": { zip: "33127", city: "Miami", state: "FL", lat: 25.8086, lng: -80.1953 },
  "33128": { zip: "33128", city: "Miami", state: "FL", lat: 25.7697, lng: -80.1906 },
  "33129": { zip: "33129", city: "Miami", state: "FL", lat: 25.7581, lng: -80.1906 },
  "33130": { zip: "33130", city: "Miami", state: "FL", lat: 25.7514, lng: -80.2072 },
  "33131": { zip: "33131", city: "Miami", state: "FL", lat: 25.7603, lng: -80.1906 },
  "33132": { zip: "33132", city: "Miami", state: "FL", lat: 25.7881, lng: -80.1917 },
  "33133": { zip: "33133", city: "Miami", state: "FL", lat: 25.7053, lng: -80.2547 },
  "33134": { zip: "33134", city: "Miami", state: "FL", lat: 25.7544, lng: -80.2781 },
  "33135": { zip: "33135", city: "Miami", state: "FL", lat: 25.7614, lng: -80.2297 },

  // Jacksonville
  "32202": { zip: "32202", city: "Jacksonville", state: "FL", lat: 30.3297, lng: -81.6558 },
  "32204": { zip: "32204", city: "Jacksonville", state: "FL", lat: 30.3108, lng: -81.6983 },
  "32205": { zip: "32205", city: "Jacksonville", state: "FL", lat: 30.2869, lng: -81.7081 },
  "32206": { zip: "32206", city: "Jacksonville", state: "FL", lat: 30.3172, lng: -81.6039 },
  "32207": { zip: "32207", city: "Jacksonville", state: "FL", lat: 30.2781, lng: -81.6203 },
  "32208": { zip: "32208", city: "Jacksonville", state: "FL", lat: 30.3747, lng: -81.6728 },
  "32209": { zip: "32209", city: "Jacksonville", state: "FL", lat: 30.3831, lng: -81.7042 },
  "32210": { zip: "32210", city: "Jacksonville", state: "FL", lat: 30.2264, lng: -81.7728 },
  "32211": { zip: "32211", city: "Jacksonville", state: "FL", lat: 30.2906, lng: -81.5817 },
  "32216": { zip: "32216", city: "Jacksonville", state: "FL", lat: 30.2706, lng: -81.5250 },
};

/**
 * Get coordinates for a ZIP code
 */
export function getZipCoordinates(zip: string): { lat: number; lng: number } | null {
  const zipData = FLORIDA_ZIPS[zip];
  if (zipData) {
    return { lat: zipData.lat, lng: zipData.lng };
  }
  return null;
}

/**
 * Get coordinates from location string (ZIP code, city/state, etc.)
 */
export function parseLocationToCoordinates(location: string): { lat: number; lng: number } | null {
  if (!location) return null;

  // Extract ZIP code if present
  const zipMatch = location.match(/\b(\d{5})\b/);
  if (zipMatch) {
    const coords = getZipCoordinates(zipMatch[1]);
    if (coords) return coords;
  }

  // Try to match city name
  const locationLower = location.toLowerCase();

  for (const zipData of Object.values(FLORIDA_ZIPS)) {
    if (locationLower.includes(zipData.city.toLowerCase())) {
      // Return coordinates of first ZIP in that city
      return { lat: zipData.lat, lng: zipData.lng };
    }
  }

  return null;
}
