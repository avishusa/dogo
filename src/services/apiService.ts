import axios from "axios";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Match {
    match: string
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface DogSearchResponse {
    resultIds: string[]; //  List of dog IDs
    total: number; // Total results available
    next?: string; // Cursor for next page
    prev?: string; // Cursor for previous page
  }
  export interface Location {
    zip_code: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  }
  export interface LocationSearchParams {
    city?: string;
    states?: string[];
    // plus optional bounding box fields ...
  }
  export interface LocationSearchResponse {
    results: Location[];
    total: number;
  }
  


// **1️ Fetch all available breeds**
export const fetchBreeds = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(`/dogs/breeds`);
    return response.data;
  } catch (error) {
    console.error("Error fetching breeds:", error);
    return [];
  }
};

// **2️ Fetch dogs with filters, offset-based pagination, and sorting**
export const fetchDogs = async (
    breeds: string[] = [],
    zipCodes: string[] = [],
    ageMin?: number,
    ageMax?: number,
    size: number = 25,
    from?: string, 
    sort: "breed" | "name" | "age" = "breed",
    order: "asc" | "desc" = "asc",

  ): Promise<DogSearchResponse> => {
    try {
      const params = new URLSearchParams();
  
      params.append("size", size.toString());
      params.append("sort", `${sort}:${order}`);
  
      if (breeds.length) params.append("breeds", breeds.join(","));
      if (zipCodes.length) params.append("zipCodes", zipCodes.join(","));
      if (ageMin !== undefined) params.append("ageMin", ageMin.toString());
      if (ageMax !== undefined) params.append("ageMax", ageMax.toString());
  
      if (from) {
        params.append("from", from); 
      }
      const response = await axiosInstance.get(`/dogs/search?${params.toString()}`);
  
      return response.data;
    } catch (error) {
      console.error(" Error fetching dogs:", error);
      return { resultIds: [], total: 0, next: undefined, prev: undefined };
    }
  };
  
// **3️ Fetch dogs by IDs**
export const fetchDogsByIds = async (dogIds: string[]): Promise<Dog[]> => {
  try {
    if (!dogIds.length) return [];

    const response = await axiosInstance.post(`/dogs`, dogIds);
    return response.data;
  } catch (error) {
    console.error("Error fetching dogs by IDs:", error);
    return [];
  }
};

// **4️ Get a Match from Favorited Dogs**
export const fetchMatch = async (favoriteDogs: string[]): Promise<Match | null> => {
    try {
      if (!favoriteDogs.length) return null;
  
      const response = await axiosInstance.post(`/dogs/match`, favoriteDogs);
  
      if (response.data) {
        return  response.data; 
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching match:", error);
      return null;
    }
  };
  
  export const fetchLocations = async (zipCodes: string[]): Promise<Location[]> => {
    try {
      if (!zipCodes.length) return [];
      // POST an array of zip codes to /locations
      const response = await axiosInstance.post(`/locations`, zipCodes);
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };
  
  //       Only needed if you want to use /locations/search for advanced filtering.
  interface Coordinates {
    lat: number;
    lon: number;
  }
  
  //  Body params for /locations/search
  export interface LocationSearchParams {
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
  
  //  Return shape for /locations/search
  export interface LocationSearchResponse {
    results: Location[];
    total: number;
  }
  
  //  A function to do POST /locations/search
  export const searchLocations = async (
    params: LocationSearchParams
  ): Promise<LocationSearchResponse> => {
    try {
      const response = await axiosInstance.post(`/locations/search`, params);
      return response.data;
    } catch (error) {
      console.error("Error searching locations:", error);
      return { results: [], total: 0 };
    }
  };
  
