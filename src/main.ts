import { createApp } from 'vue'
import './style.css'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import {createPinia} from 'pinia'

const pinia = createPinia();

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


const app = createApp(App)
  .use(pinia)
  .use(router)


app.mount('#app');
