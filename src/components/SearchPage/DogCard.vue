<template>
    <v-card class="dog-card" outlined>
      <div class="image-container">
        <v-img
          :src="dog.img"
          alt="Dog Image"
          height="200"
          @load="onImageLoad"
          @error="onImageError"
          cover
          @click="showDialog = true"
        >
          <template #placeholder>
            <v-progress-circular
              v-if="isLoading"
              indeterminate
              color="primary"
              class="image-spinner"
            ></v-progress-circular>
          </template>
        </v-img>
        <v-btn
          icon
          class="favorite-btn"
          :color="dogStore.isFavorite(dog.id) ? 'black'  : 'transparent'"
          @click.stop="handleFavorite"
        >
          <v-icon :style="{ color: dogStore.isFavorite(dog.id) ? 'red' : 'grey'}" >
            mdi-heart
          </v-icon>
        </v-btn>
      </div>

      <!-- Dog Details -->
      <v-card-title>{{ dog.name }}</v-card-title>
      <v-card-subtitle>{{ dog.breed }}</v-card-subtitle>
      <v-card-text>
        <p>Age: {{ dog.age }}</p>
        <p>Location: {{ dog.zip_code }}</p>
      </v-card-text>

      <!-- Image Dialog -->
      <v-dialog v-model="showDialog" max-width="600px">
        <v-img :src="dog.img" alt="Dog Image" class="dialog-image"></v-img>
      </v-dialog>
    </v-card>
  </template>

  <script lang="ts">
  import { defineComponent, ref } from "vue";
  import { useDogStore } from "@/stores/dogStore";
  import { VCard, VCardSubtitle, VCardText, VCardTitle } from "vuetify/components";
  export default defineComponent({
    name: "DogCard",
    components: {
      VCard,
      VCardSubtitle,
      VCardTitle,
      VCardText
    },
    props: {
      dog: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const dogStore = useDogStore();
      const isLoading = ref(true);
      const showDialog = ref(false); // Controls dialog visibility

      const handleFavorite = () => {
        if (dogStore.isFavorite(props.dog.id)) {
          dogStore.removeFavorite(props.dog.id);
        } else {
          dogStore.addFavorite(props.dog.id);
        }
      };

      const onImageLoad = () => {
        isLoading.value = false; // Hide spinner when the image loads
      };

      const onImageError = () => {
        console.error("Failed to load image for dog:", props.dog.name);
        isLoading.value = false; // Hide spinner even if the image fails
      };

      return {
        dogStore,
        isLoading,
        showDialog,
        handleFavorite,
        onImageLoad,
        onImageError,
      };
    },
  });
  </script>

  <style scoped>
  .dog-card {
    margin: 16px;
  }

  .image-container {
    position: relative;
    cursor: pointer;
  }

  .image-container > .v-img {
    display: block;
  }

  .favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 10;
  }

  .image-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .dialog-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  </style>
