// import { usePreloader } from './utils/preloader.js'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css' // Giữ lại CSS
// Chỉ import các module JS cần thiết, ví dụ:
// import { Modal, Dropdown } from 'bootstrap'
import 'remixicon/fonts/remixicon.css'
import './assets/main.css'

import App from './App.vue'
import FBsc from './composables/scripts.js'
import { getExtId } from './composables/extensionUtils.js'
import { useUserStore } from './stores/userStore.js'

// --- Preloader ---
// // Bắt đầu preloader và nhận hàm để dừng nó
// const { start } = usePreloader()
// const stopPreloaderInterval = start()

const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue') },
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


async function initializeAndMount() {
  // --- Khởi tạo FB ---
  const userStore = useUserStore(app.config.globalProperties.$pinia)
  const fbsc = new FBsc()
  try {
    const extId = getExtId();

    await fbsc.init()
    userStore.setUserInfo(fbsc.userInfo)
    const quality = await fbsc.getAccountQuality()
    userStore.setAccountQuality(quality)
    app.mount('#app')
  } catch (error) {
    console.error('Lỗi khởi tạo FB:', error)
    // Có thể hiển thị thông báo lỗi cho người dùng ở đây
  }
}

initializeAndMount()
// // Ẩn preloader khi ứng dụng đã sẵn sàng
// window.onload = () => {
//   const preloader = document.getElementById('preloader')
//   if (preloader) {
//     // Dừng cập nhật tiến trình giả
//     if (stopPreloaderInterval) stopPreloaderInterval()
//     const progressBar = document.getElementById('preloader-progress-bar')
//     if (progressBar) progressBar.style.width = '100%' // Hoàn thành thanh tiến trình

//     setTimeout(() => {
//       preloader.style.opacity = '0'
//       setTimeout(() => (preloader.style.display = 'none'), 500) // 500ms là thời gian transition trong CSS
//     }, 300) // Chờ một chút trước khi ẩn
//   }
// }
