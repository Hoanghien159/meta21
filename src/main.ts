import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css' // Giữ lại CSS
// Chỉ import các module JS cần thiết, ví dụ:
// import { Modal, Dropdown } from 'bootstrap'
import 'remixicon/fonts/remixicon.css'
import './assets/main.css'

import App from './App.vue'
const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue') },
  { path: '/ads', component: () => import('@/views/AdsView.vue') },
  { path: '/bm', component: () => import('@/views/BmView.vue') },
  { path: '/clone', component: () => import('@/views/CloneView.vue') },
  { path: '/page', component: () => import('@/views/PageView.vue') },
  { path: '/tool', component: () => import('@/views/ToolView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
