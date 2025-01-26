import { defineStore } from "pinia";
import { fetchBreeds, searchDogs, fetchDogs } from "@/services/api";
import type { Dog } from "@/types/dog";

export const useDogStore = defineStore("dogStore", {
  state: () => ({
    breeds: [] as string[],
    dogs: [] as Dog[],
    totalDogs: 0,
    favorites: [] as string[],
    filters: {
      sort: 'breed' as 'breed' | 'age' | 'name',
      order: 'asc' as 'asc' | 'desc',
      selectedBreed: [] as string[],
      zipCode: [] as string[],
      ageMin: null as number | null,
      ageMax: null as number | null,
    },
    temporaryFilters: {
      sort: 'breed' as 'breed' | 'age' | 'name',
      order: 'asc' as 'asc' | 'desc',
      selectedBreed: [] as string[],
      zipCode: [] as string[],
      ageMin: null as number | null,
      ageMax: null as number | null,
    },
    pagination: {
      first: 0,
      pageSize: 10,
      page: 1,
    },
  }),
  actions: {
    async handleSearch() {
      this.dogs = [];
      try {
        // Apply temporaryFilters to active filters
        this.filters = { ...this.temporaryFilters };

        // Reset pagination and fetch fresh data
        this.pagination.first = 0;
        this.pagination.page = 1;

        const { first, pageSize } = this.pagination;
        const filters = {
          breeds: this.filters.selectedBreed.length ? this.filters.selectedBreed : undefined,
          zipCodes: this.filters.zipCode.length ? this.filters.zipCode : undefined,
          ageMin: this.filters.ageMin || undefined,
          ageMax: this.filters.ageMax || undefined,
          size: pageSize,
          from: first,
          sort: `${this.filters.sort}:${this.filters.order}`,
        };

        const results = await searchDogs(filters);
        this.totalDogs = results.total;
        this.dogs = results.resultIds.length > 0 ? await fetchDogs(results.resultIds) : [];
      } catch (error) {
        console.error("Error searching for dogs:", error);
      }
    },

    async loadNextPage() {
      try {
        const { first, pageSize } = this.pagination;
        const nextPageStart = first + pageSize;

        // Check if there are more results to load
        if (nextPageStart >= this.totalDogs) {
          console.info("No more results to load.");
          return;
        }

        this.pagination.first = nextPageStart;
        this.pagination.page += 1;

        const filters = {
          breeds: this.filters.selectedBreed.length ? this.filters.selectedBreed : undefined,
          zipCodes: this.filters.zipCode.length ? this.filters.zipCode : undefined,
          ageMin: this.filters.ageMin || undefined,
          ageMax: this.filters.ageMax || undefined,
          size: pageSize,
          from: this.pagination.first,
        };

        const results = await searchDogs(filters);
        const newDogs = results.resultIds.length > 0 ? await fetchDogs(results.resultIds) : [];

        this.dogs = [...this.dogs, ...newDogs]; // Append new results
      } catch (error) {
        console.error("Error loading the next page of dogs:", error);
      }
    },

    async loadBreeds() {
      try {
        this.breeds = await fetchBreeds();
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    },

    addFavorite(dogId: string) {
      if (!this.favorites.includes(dogId)) {
        this.favorites.push(dogId);
      }
    },

    removeFavorite(dogId: string) {
      const index = this.favorites.indexOf(dogId);
      if (index !== -1) {
        this.favorites.splice(index, 1);
      }
    },

    isFavorite(dogId: string) {
      return this.favorites.includes(dogId);
    },
  },
});
