import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Ensure you import Vuetify styles
import { VApp, VAppBar, VAutocomplete, VBadge, VBtn, VCardActions, VCol, VCombobox, VContainer, VDialog, VIcon, VImg, VMain, VNavigationDrawer, VProgressCircular, VRangeSlider, VRow, VSelect, VToolbar, VToolbarTitle } from "vuetify/components"; // Tree-shake Vuetify components
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // Import Material Design Icons
import router from "./router"; // If you have a router
import { createPinia } from "pinia";

const getDefaultTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const vuetify = createVuetify({
  components: {
    VBtn,
    VIcon,
    VMain,
    VAppBar,
    VToolbarTitle,
    VApp,
    VDialog,
    VImg,
    VProgressCircular,
    VRow,
    VCol,
    VContainer,
    VCardActions,
    VBadge,
    VSelect,
    VRangeSlider,
    VCombobox,
    VAutocomplete,
    VNavigationDrawer,
    VToolbar
  },
  directives,
  icons: {
    defaultSet: "mdi", // Set Material Design Icons as default
  },
  theme: {
    defaultTheme: getDefaultTheme(),
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#BB86FC",
          secondary: "#121212",
          accent: "#3700B3",
          error: "#CF6679",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
        },
      },
    },
  },
});

const app = createApp(App);
app.use(router); // If you're using Vue Router
app.use(createPinia()); // Add Pinia
app.use(vuetify);
app.mount("#app");
