<template>
    <v-row
      class="dog-grid"
      @scroll.passive="onScroll"
      style="overflow-y: auto;"
    >
      <v-col
        v-for="dog in dogs"
        :key="dog.id"
      >
        <div class="card-container">
          <DogCard :dog="dog" />
        </div>
      </v-col>
      <v-col cols="12" class="text-center" v-if="isLoading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
  </template>

  <script lang="ts">
  import { defineComponent } from "vue";
  import DogCard from "@/components/SearchPage/DogCard.vue";
  import type { Dog } from "@/types/dog";
  export default defineComponent({
    name: "DogGridWithInfiniteScroll",
    components: {
      DogCard,
    },
    props: {
      dogs: {
        type: Array as () => Dog[],
        required: true,
      },
      isLoading: {
        type: Boolean,
        required: true,
      },
    },
    emits: ["loadMore", "favorite"],
    data() {
      return {
        drawer: false,
      };
    },
    methods: {
      onScroll(event : Event) {
        const target = event.target as HTMLElement;
        if (
          target.scrollTop + target.clientHeight >= target.scrollHeight - 50 &&
          !this.isLoading
        ) {
          this.$emit("loadMore");
        }
      },
      toggleFavorite(dogId: string) {
        this.$emit("favorite", dogId);
      },
    },
  });
  </script>

  <style scoped>
  .dog-grid {
    height: calc(100vh - 14rem);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .card-container {
    margin: 0 auto; /* Center the card within its column */
  }

  .v-progress-circular {
    margin: 20px auto;
  }
  </style>
