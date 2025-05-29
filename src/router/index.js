import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/cases',
    name: 'Cases',
    component: () => import('../views/CasesView.vue')
  },
  {
    path: '/legal-reference',
    name: 'LegalReference',
    component: () => import('../views/LegalReferenceView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
