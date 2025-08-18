export interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string; // URL
  language: string;
  people: string[]; // Array of URLs
  films: string[];  // Array of URLs
  created: string;  // ISO date string
  edited: string;   // ISO date string
  url: string;      // URL
}
