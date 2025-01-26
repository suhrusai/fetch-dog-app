<template>
  <v-dialog v-model="visible" max-width="400">
    <v-card>
      <v-card-title class="headline text-center">Your Match</v-card-title>
      <v-card-text>
        <!-- Loading Indicator -->
        <div v-if="isLoading" class="loading-indicator">
          <v-progress-circular indeterminate color="primary" />
          <p>Finding your perfect match...</p>
        </div>

        <!-- Matched Dog Details -->
        <div v-else-if="matchedDog" class="matched-dog-details">
          <v-img
            :src="matchedDog.img"
            max-height="250"
            max-width="250"
            class="dog-image mx-auto"
            alt="Matched Dog"
            contain
          />
          <h3 class="dog-name mt-4 mb-2">{{ matchedDog.name }}</h3>
          <p class="dog-info"><strong>Breed:</strong> {{ matchedDog.breed }}</p>
          <p class="dog-info"><strong>Age:</strong> {{ matchedDog.age }}</p>
          <p class="dog-info"><strong>Location:</strong> {{ matchedDog.zip_code }}</p>
        </div>

        <!-- Error Message -->
        <div v-else class="error-message">
          <p>We couldn't find a match. Please try again!</p>
        </div>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { matchDogs, fetchDogs } from "@/services/api";
import { useDogStore } from "@/stores/dogStore";
import type { Dog } from "@/types/dog";

// Import necessary Vuetify components
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VProgressCircular,
  VImg,
  VBtn,
} from "vuetify/components";

export default defineComponent({
  name: "MatchDialog",
  components: {
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VProgressCircular,
    VImg,
    VBtn,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const dogStore = useDogStore();
    const favorites = computed(() => dogStore.favorites);

    const isLoading = ref(false);
    const matchedDog = ref<Dog | null>(null);

    watch(
      () => props.visible,
      async (newVal) => {
        if (newVal) await loadMatchedDog();
      }
    );

    const loadMatchedDog = async () => {
      if (!favorites.value.length) {
        console.warn("No favorites selected.");
        matchedDog.value = null;
        return;
      }

      isLoading.value = true;

      try {
        // Fetch the matched dog ID from the API
        const matchResponse = await matchDogs(favorites.value);

        // Fetch the matched dog's full details
        const matchedDogResponse = await fetchDogs([matchResponse.match]);
        matchedDog.value = matchedDogResponse[0];
      } catch (error) {
        console.error("Error generating match:", error);
        matchedDog.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const closeDialog = () => {
      emit("update:visible", false);
      matchedDog.value = null; // Reset matched dog when dialog is closed
    };

    return {
      isLoading,
      matchedDog,
      closeDialog,
    };
  },
});
</script>

<style scoped>
.loading-indicator {
  text-align: center;
}

.matched-dog-details {
  text-align: center;
  padding: 16px;
}

.dog-image {
  box-shadow: 0 4px 8px var(--v-theme-overlay);
  border: 2px solid var(--v-theme-surface);
}

.dog-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--v-theme-on-surface);
}

.dog-info {
  margin: 4px 0;
  font-size: 1rem;
  color: var(--v-theme-on-surface);
}

.error-message {
  text-align: center;
  color: var(--v-theme-error);
  font-weight: bold;
}

.v-card-title {
  background-color: var(--v-theme-surface);
  border-bottom: 1px solid var(--v-theme-overlay);
  padding: 16px 0;
  color: var(--v-theme-on-surface);
}
</style>
