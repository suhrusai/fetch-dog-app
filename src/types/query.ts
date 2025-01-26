export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DogSearchQuery {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string;
  }

  export interface LocationSearchQuery {
    city?: string;
    states?: string[];
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
    size?: number;
    from?: number;
  }
