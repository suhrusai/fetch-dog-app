export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DogSearchQuery {
    breeds?: string[]; // Array of breeds to filter by
    zipCodes?: string[]; // Array of zip codes to filter by
    ageMin?: number; // Minimum age for filtering
    ageMax?: number; // Maximum age for filtering
    size?: number; // Number of results to return per page
    from?: number; // Cursor for pagination
    sort?: string; // Sort field and order, e.g., "breed:asc"
  }
  
  export interface LocationSearchQuery {
    city?: string; // Partial or full city name
    states?: string[]; // Array of state abbreviations (e.g., ["CA", "NY"])
    geoBoundingBox?: {
      top?: Coordinates;
      left?: Coordinates;
      bottom?: Coordinates;
      right?: Coordinates;
      bottom_left?: Coordinates;
      top_left?: Coordinates;
      bottom_right?: Coordinates;
      top_right?: Coordinates;
    };
    size?: number; // Number of results to return per page
    from?: number; // Cursor for pagination
  }
  