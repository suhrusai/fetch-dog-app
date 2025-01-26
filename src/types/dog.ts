export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
  }
  
  export interface Match {
    match: string; // The ID of the matched dog
  }
  
  export interface DogSearchResult {
    resultIds: string[]; // Array of dog IDs matching the search query
    total: number; // Total number of results
    next?: string; // Query to fetch the next page of results
    prev?: string; // Query to fetch the previous page of results
  }
  