import { defineStore } from "pinia";
import router from "@/router";
import { login as apiLogin, fetchBreeds } from "@/services/api";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isAuthenticated: false,
    user: null as { name: string; email: string } | null,
  }),
  actions: {
    /**
     * Login action to authenticate the user.
     * @param {string} name - User's name.
     * @param {string} email - User's email.
     */
    async login(name: string, email: string) {
      try {
        await apiLogin(email, name); // Use the API's login function
        this.user = { name, email };
        this.isAuthenticated = true;
        router.push({ name: "Search" }); // Redirect to the Search page
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    /**
     * Logout action to clear the session and user state.
     */
    async logout() {
      try {
        // Clear session state
        this.isAuthenticated = false;
        this.user = null;
        router.push({ name: "Login" }); // Redirect to Login page
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },

    /**
     * Verify authentication state by checking API accessibility.
     */
    async verifyAuthentication() {
      try {
        // Call an API endpoint to verify session (e.g., `fetchBreeds` from api.ts)
        const response = await fetchBreeds();
        if (response) {
          this.isAuthenticated = true;
        }
      } catch {
        this.isAuthenticated = false;
        this.user = null;
        router.push({ name: "Login" }); // Redirect to Login page if not authenticated
      }
    },
  },
});
