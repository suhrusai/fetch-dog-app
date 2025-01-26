<template>
  <!-- Drawer for Favorite Dogs -->
  <v-navigation-drawer
    v-model="drawer"
    app
    left
    width="400"
  >
    <div class="text-h6 pa-4">Favorite Dogs</div>
    <DogCardDrawer
      v-for="dogId in favorites"
      :key="dogId"
      :dogId="dogId"
    />
  </v-navigation-drawer>

  <!-- Main Container -->
  <v-container>
    <!-- Filters Row -->
    <v-row class="filters" justify="space-between" align="center" no-gutters>
      <!-- Select Breeds Filter -->
      <v-col cols="12" sm="2">
        <v-autocomplete
          v-model="filters.selectedBreed"
          :items="breeds"
          label="Select Breeds"
          chips
          multiple
          outlined
        ></v-autocomplete>
      </v-col>

      <!-- Enter Zip Codes Filter -->
      <v-col cols="12" sm="2">
        <v-combobox
          v-model="filters.zipCode"
          label="Enter Zip Codes"
          clearable
          multiple
          outlined
        ></v-combobox>
      </v-col>

      <!-- Age Range Filter -->
      <v-col cols="12" sm="3">
        <v-range-slider
          v-model="filters.ageRange"
          :min="0"
          :max="20"
          :step="1"
          range
          thumb-label="always"
          label="Age Range"
        ></v-range-slider>
      </v-col>

      <!-- Sort By Filter -->
      <v-col cols="12" sm="2">
        <v-select
          v-model="filters.sortOption"
          :item-props="itemProps"
          :items="sortOptions"
          label="Sort By"
          outlined
          dense
        ></v-select>
      </v-col>

      <!-- Search Button -->
      <v-col cols="12" sm="2" class="text-right">
        <v-btn
          color="primary"
          class="ma-2"
          block
          @click="performSearch"
        >
          Search
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dog Cards Grid -->
    <DogGridWithInfiniteScroll
      :dogs="dogs"
      :isLoading="isLoading"
      @loadMore="loadMoreDogs"
    />

    <!-- Floating Button Centered in Dog Grid -->
    <v-btn
      color="surface-variant"
      extended
      variant="tonal"
      class="fab-in-grid"
      @click="triggerMatchDialog"
    >
      Find your furr-fect match
    </v-btn>

    <!-- Floating Heart Button with Badge -->
    <v-badge
      :content="favorites.length"
      color="error"
      overlap
      class="fab-heart-badge"
    >
      <v-btn
        fab
        color="error"
        class="fab-heart"
        @click="drawer = !drawer"
      >
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-badge>

    <!-- Match Dialog -->
    <MatchDialog v-model:visible="isMatchDialogVisible" />
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  computed,
  ref,
  onMounted,
  watch,
} from "vue";
import { useDogStore } from "@/stores/dogStore";

type SortType = "breed" | "age" | "name";
type OrderType = "asc" | "desc";

interface SortOption {
  name: string;
  value: {
    sort: SortType;
    order: OrderType;
  };
}

export default defineComponent({
  name: "DogSearchPage",
  components: {
    // Dynamically load components to reduce bundle size
    DogGridWithInfiniteScroll: defineAsyncComponent(() =>
      import("@/components/SearchPage/DogGridWithInfiniteScroll.vue")
    ),
    DogCardDrawer: defineAsyncComponent(() =>
      import("@/components/SearchPage/DogCardDrawer.vue")
    ),
    MatchDialog: defineAsyncComponent(() =>
      import("@/components/MatchDogDialog.vue")
    ),
  },
  setup() {
    const sortOptions: SortOption[] = [
      { name: "Breed (Ascending)", value: { sort: "breed", order: "asc" } },
      { name: "Breed (Descending)", value: { sort: "breed", order: "desc" } },
      { name: "Age (Ascending)", value: { sort: "age", order: "asc" } },
      { name: "Age (Descending)", value: { sort: "age", order: "desc" } },
      { name: "Name (Ascending)", value: { sort: "name", order: "asc" } },
      { name: "Name (Descending)", value: { sort: "name", order: "desc" } },
    ];

    const dogStore = useDogStore();
    const isLoading = ref(false);

    const breeds = computed(() => dogStore.breeds);
    const dogs = computed(() => dogStore.dogs);
    const favorites = computed(() => dogStore.favorites);

    const drawer = ref(false);
    const isMatchDialogVisible = ref(false);

    const filters = ref({
      selectedBreed: [] as string[],
      zipCode: [] as string[],
      ageRange: [0, 20] as [number, number],
      sortOption: { sort: "breed", order: "asc" } as SortOption["value"],
    });

    const itemProps = (item: SortOption) => ({
      title: item.name,
    });

    const loadMoreDogs = async () => {
      if (isLoading.value) return;
      isLoading.value = true;
      dogStore.filters = {
        ...dogStore.filters,
        sort: filters.value.sortOption.sort,
        order: filters.value.sortOption.order,
        ageMin: filters.value.ageRange[0],
        ageMax: filters.value.ageRange[1],
        selectedBreed: filters.value.selectedBreed,
        zipCode: filters.value.zipCode,
      };
      await dogStore.loadNextPage();
      isLoading.value = false;
    };

    const performSearch = async () => {
      dogStore.filters = {
        ...dogStore.filters,
        sort: filters.value.sortOption.sort,
        order: filters.value.sortOption.order,
        ageMin: filters.value.ageRange[0],
        ageMax: filters.value.ageRange[1],
        selectedBreed: filters.value.selectedBreed,
        zipCode: filters.value.zipCode,
      };
      isLoading.value = true;
      await dogStore.handleSearch();
      isLoading.value = false;
    };

    const triggerMatchDialog = () => {
      if (favorites.value.length > 0) {
        isMatchDialogVisible.value = true;
      }
    };

    watch(
      filters,
      () => {
        console.log("Filters updated:", filters.value);
      },
      { deep: true }
    );

    onMounted(async () => {
      await dogStore.loadBreeds();
      await dogStore.handleSearch();
    });

    return {
      breeds,
      dogs,
      filters,
      loadMoreDogs,
      performSearch,
      sortOptions,
      itemProps,
      isLoading,
      favorites,
      drawer,
      isMatchDialogVisible,
      triggerMatchDialog,
    };
  },
});
</script>

<style scoped>
.fab-in-grid {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 10;
  border-radius: 90px;
}

.fab-heart {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 11;
}

.fab-heart-badge {
  position: fixed;
  right: 20px;
  bottom: 65px;
  z-index: 12;
}
</style>
