<template>
  <v-container class="login-container" fluid>
    <!-- Marquee Section -->
    <div>
      <div class="marquee my-4" v-for="i in 3" :key="i">
        <div class="marquee__group">
          <img
            v-for="dogImage in getRandomImages()"
            :key="dogImage + '-' + i"
            :src="dogImage"
            alt="Dog Image"
          />
        </div>
      </div>
    </div>

    <!-- Login Card Section -->
    <div class="login-card-container">
      <v-card outlined width="400">
        <div class="pa-6 text-center">
          <v-img
            src="https://fetch.com/assets/images/graphics/footer-logo.svg"
            height="150"
            contain
          ></v-img>
        </div>
        <v-card-text>
          <v-form ref="loginForm" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              outlined
              dense
              :error-messages="errors.email"
              prepend-inner-icon="mdi-email"
              clearable
            ></v-text-field>
            <v-text-field
              v-model="name"
              label="Name"
              outlined
              dense
              :error-messages="errors.name"
              prepend-inner-icon="mdi-account"
              clearable
            ></v-text-field>
            <v-alert v-if="apiError" type="error" outlined>
              {{ apiError }}
            </v-alert>
            <v-btn type="submit" color="primary" block class="mt-4">
              Login
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/api";
import { VAlert, VBtn, VCard, VCardText, VContainer, VForm, VImg, VTextField } from "vuetify/components";

export default defineComponent({
  components:
  {
    VContainer,
    VCard,
    VImg,
    VCardText,
    VForm,
    VTextField,
    VAlert,
    VBtn,
  },
  setup() {
    const dogImages = ref<string[]>([]);
 // Shuffle utility function
 const shuffleArray = (array: string[]) => {
      return array
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    };

    // Load images dynamically
    for (let i = 1; i <= 33; i++) {
      import(`@/assets/dog-pictures/${i}.jpg`)
        .then((module) => {
          dogImages.value.push(module.default);
        })
        .catch(() => {
          console.warn(`Image ${i}.jpg not found`);
        });
    }

    // Generate random rows
    const getRandomImages = () => {
      return shuffleArray(dogImages.value);
    }


    dogImages.value = [...dogImages.value]
    const email = ref("");
    const name = ref("");
    const errors = ref<{ email: string; name: string }>({email: "", name: ""});
    const apiError = ref("");
    const router = useRouter();

    const validateForm = () => {
      const validationErrors: { email: string; name: string } = { email: "", name: "" };
      if (!email.value) {
        validationErrors.email = "Email is required.";
        console.log("Email is required.");
      } else if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
        validationErrors.email = "Please enter a valid email.";
        console.log("Please enter a valid email.");
      }
      if (!name.value) {
        validationErrors.name = "Name is required.";
        console.log("Name is required.");
      }
      errors.value = validationErrors;
      return Object.keys(validationErrors).length === 0;
    };

    const handleLogin = async () => {
      apiError.value = "";
      if (!validateForm()){
        console.log("Validation failed.");
        return;
      }

      try {
        console.log("Logging in...");
        await login(email.value, name.value);
        router.push("/search"); // Redirect to search page
      } catch (error: unknown) {
        apiError.value = (error as Error).message;
      }
    };

    return {
      email,
      name,
      errors,
      apiError,
      handleLogin,
      dogImages,
      getRandomImages,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  position: relative;
}

.marquee {
  --duration: 300s;
  --gap: 2rem;
  filter: blur(2px);
  display: flex;
  overflow: hidden;
  user-select: none;
  gap: 2rem;
  transform: skewY(-3deg);
}
.marquee__group {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
  min-width: max-content;
  animation: scroll var(--duration) linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% - 2rem));
  }
}

.marquee__group img {
  max-width: clamp(10rem, 1rem + 28vmin, 20rem);
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 1rem;
}

.login-card-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}


.v-card-title {
  color: #3c4043;
}

</style>
