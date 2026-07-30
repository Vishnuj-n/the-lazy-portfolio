import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProjectDetail from '../views/ProjectDetail.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/project/:id', name: 'ProjectDetail', component: ProjectDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
