<template>
  <v-app-bar app dense color="primary">
    <v-toolbar-title>
      <span class="ml-3">Dog Finder</span>
    </v-toolbar-title>
    <v-btn icon @click="toggleTheme" class="theme-toggle">
      <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
    </v-btn>
    <v-btn color="white" @click="handleLogout">
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "vuetify";

export default defineComponent({
  name: "DogNavbar",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const theme = useTheme();

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
    };

    const handleLogout = async () => {
      try {
        await authStore.logout(); // Call logout from store
        router.push({ name: "Login" }); // Redirect to login page
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    return {
      theme,
      toggleTheme,
      handleLogout,
    };
  },
});
</script>

<style scoped>
.logo {
  border-radius: 50%;
}

.search-bar {
  max-width: 300px;
}

.theme-toggle {
  margin-left: auto;
}
</style>
