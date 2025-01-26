<template>
  <v-app>
    <Navbar v-if="showNavbar" /> <!-- Conditionally render Navbar -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";
import { computed, defineAsyncComponent } from "vue";

const Navbar = defineAsyncComponent(() =>
  import("@/components/DogNavBar.vue")
);

const route = useRoute();
const showNavbar = computed(() => route.name !== "Login");
</script>

<style>
</style>
