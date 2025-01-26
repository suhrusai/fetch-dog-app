import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import SearchPage from '@/views/SearchPage.vue';
import MatchPage from '@/views/MatchPage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage,
    },
    { path: "/search", name: "Search", component: SearchPage },
    { path: "/match/:id", name: "Match", component: MatchPage, props: true },
  ],
})

export default router
