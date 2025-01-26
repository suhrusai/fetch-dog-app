import type { Dog, DogSearchResult, Match } from "@/types/dog";
import type { DogSearchQuery } from "@/types/query";
import type { LoginRequest } from "@/types/auth";
import router from "@/router";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

/**
 * Reusable fetch wrapper with authentication handling
 */
const fetchWithAuth = async (url: string, options: RequestInit): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Ensure cookies are sent with each request
  });

  if (response.status === 401) {
    // Handle unauthorized response
    console.warn("Session expired. Redirecting to login.");
    router.push({ name: "Login" }); // Redirect to login page
    throw new Error("Session expired.");
  }

  return response;
};

/**
 * Login API call
 * @param {string} email - The email of the user
 * @param {string} name - The name of the user
 * @returns {Promise<void>} - Resolves if login is successful
 */
export const login = async (email: string, name: string): Promise<void> => {
  const payload: LoginRequest = { email, name };

  const response = await fetchWithAuth(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed.");
  }
};

/**
 * Fetch all available dog breeds
 * @returns {Promise<string[]>} - Array of breed names
 */
export const fetchBreeds = async (): Promise<string[]> => {
  const response = await fetchWithAuth(`${BASE_URL}/dogs/breeds`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch breeds.");
  }

  return await response.json();
};

/**
 * Search for dogs based on filters
 * @param {DogSearchQuery} filters - Filters for the search query
 * @returns {Promise<DogSearchResult>} - Search results
 */
export const searchDogs = async (filters: DogSearchQuery = {}): Promise<DogSearchResult> => {
  const filteredFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null)
    .reduce((acc, [key, value]) => {
      acc[key] = Array.isArray(value) ? value.join(",") : value.toString();
      return acc;
    }, {} as Record<string, string>);

  const query = new URLSearchParams(filteredFilters).toString();

  const response = await fetchWithAuth(`${BASE_URL}/dogs/search?${query}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to search dogs.");
  }

  return await response.json();
};

/**
 * Fetch details for specific dogs
 * @param {string[]} dogIds - Array of dog IDs
 * @returns {Promise<Dog[]>} - Array of dog objects
 */
export const fetchDogs = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await fetchWithAuth(`${BASE_URL}/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dogIds),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dog details.");
  }

  return await response.json();
};

/**
 * Match favorite dogs
 * @param {string[]} dogIds - Array of favorite dog IDs
 * @returns {Promise<Match>} - Matched dog ID
 */
export const matchDogs = async (dogIds: string[]): Promise<Match> => {
  const response = await fetchWithAuth(`${BASE_URL}/dogs/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dogIds),
  });

  if (!response.ok) {
    throw new Error("Failed to match dogs.");
  }

  return await response.json();
};
