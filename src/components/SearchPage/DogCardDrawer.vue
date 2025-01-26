<template>
  <v-card class="drawer-card">
    <v-skeleton-loader v-if="!dogData" class="drawer-card-loading" type="list-item-avatar, text" />
    <template v-else>
      <v-row align="center">
        <v-col cols="auto">
          <v-img
            :src="dogData.img"
            :alt="dogData.name"
            class="drawer-card-image"
            aspect-ratio="1"
            cover
          />
        </v-col>
        <v-col>
          <div class="drawer-card-details">
            <h3 class="drawer-card-name">{{ dogData.name }}</h3>
            <p class="drawer-card-breed">Breed: {{ dogData.breed }}</p>
            <p class="drawer-card-age">Age: {{ dogData.age }}</p>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn icon color="red" @click="removeFavorite">
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>


  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { useDogStore } from "@/stores/dogStore";
  import { fetchDogs } from "@/services/api";
  import type { Dog } from "@/types/dog";
  import { VCard, VSkeletonLoader } from "vuetify/components";
  export default defineComponent({
    name: "DogCardDrawer",
    components: {
      VCard,
      VSkeletonLoader
    },
    props: {
      dogId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const dogStore = useDogStore();

      const dogData = ref<Dog | null>(null);

      const loadDogData = async () => {
        try {
          const dogs = await fetchDogs([props.dogId]);
          if (dogs.length > 0) {
            dogData.value = dogs[0];
          }
        } catch (error) {
          console.error("Error fetching dog data:", error);
        }
      };

      const removeFavorite = () => {
        dogStore.removeFavorite(props.dogId);
      };

      onMounted(() => {
        loadDogData();
      });

      return {
        dogData,
        removeFavorite,
      };
    },
  });
  </script>

<style scoped>
.drawer-card {
  margin-bottom: 10px;
}

.drawer-card-image {
  width: 120px;
  height: 120px;
  border: 2px;
  overflow: hidden;
}

.drawer-card-details {
  flex-grow: 1;
}

.drawer-card-name {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}

.drawer-card-breed,
.drawer-card-age {
  margin: 0;
  font-size: 0.875rem;
}

.drawer-card-loading {
  padding: 10px;
}
</style>

