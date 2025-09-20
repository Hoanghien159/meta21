<template>
  <header
    v-if="userStore.userInfo"
    class="p-3 d-flex justify-content-between align-items-center header-glass"
    style="position: relative; z-index: 1050"
  >
    <!-- Left Section -->
    <div class="d-flex align-items-center gap-4">
      <!-- Logo -->
      <div
        class="d-flex align-items-center justify-content-center fw-bold text-white rounded-3"
        style="
          width: 48px;
          height: 48px;
          font-size: 1.5rem;
          background: linear-gradient(to bottom right, #3b82f6, #8b5cf6, #ec4899);
        "
      >
        EX
      </div>

      <!-- App Name & Version -->
      <div>
        <h1 class="h4 fw-bold app-title m-0">ex.meta21.top</h1>
        <span class="badge rounded-pill app-version fw-medium"> Facebook Manager v3.2 </span>
      </div>

      <!-- Navigation -->
      <nav class="nav-menu d-flex align-items-center gap-1">
        <router-link to="/" class="underline-slide nav-link-item">HOME</router-link>
        <router-link to="/clone" class="underline-slide nav-link-item">CLONE</router-link>
        <router-link to="/ads" class="underline-slide nav-link-item">TKQC</router-link>
        <router-link to="/bm" class="underline-slide nav-link-item">BM</router-link>
        <router-link to="/page" class="underline-slide nav-link-item">PAGE</router-link>
        <router-link to="/tool" class="underline-slide nav-link-item">TOOL</router-link>
      </nav>
    </div>

    <!-- Right Section -->
    <div class="d-flex align-items-center gap-4">
      <!-- Online Status -->
      <div
        class="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
        style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3)"
      >
        <div class="pulse-dot"></div>
        <span class="online-text">{{ userStore.accountQuality?.status || 'Checking...' }}</span>
      </div>

      <!-- Settings Button -->

      <div class="d-flex align-items-center gap-2" @click.stop>
        <button class="btn btn-secondary fw-bold shadow-sm settings-btn underline-slide  " @click="reloadPage">
          <i class="ri-refresh-line me-1"></i> Tải lại
        </button>
        <button
          class="underline-slide btn btn-secondary fw-bold shadow-sm settings-btn"
          data-bs-toggle="modal"
          data-bs-target="#settingModal"
        >
          <i class="underline-slide ri-settings-3-line me-1"></i> Cài đặt
        </button>
      </div>

      <!-- User Info -->
      <div class="dropdown">
        <div
          class="underline-slide d-flex align-items-center gap-3 px-3 py-2 rounded-3 user-info"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style="cursor: pointer"
        >
          <img
            v-if="userStore.userInfo?.picture?.data?.url"
            :src="userStore.userInfo.picture.data.url"
            alt="User Avatar"
            class="rounded-circle"
            style="width: 36px; height: 36px; object-fit: cover"
          />
          <div class="user-details">
            <div class="fw-bold">{{ userStore.userInfo?.name || 'Loading...' }}</div>
            <div class="text-xs" style="color: rgba(255, 255, 255, 0.7)">
              {{ userStore.userInfo?.id || '' }}
            </div>
          </div>
        </div>
        <div
          class="dropdown-menu dropdown-menu-end overflow-hidden p-0 shadow"
          style="width: 320px; z-index: 1051"
        >
          <template v-if="userStore.userInfo">
            <div class="p-2" style="background: #f0ecf4">
              <div class="d-flex align-items-center justify-content-center">
                <div
                  class="rounded-circle overflow-hidden shadow bg-white"
                  style="width: 70px; margin-bottom: -35px"
                >
                  <img
                    class="w-100 p-1 rounded-circle"
                    :src="userStore.userInfo.picture?.data?.url"
                    alt="User Avatar"
                  />
                </div>
              </div>
            </div>
            <div class="p-3 mt-4 text-center">
              <div class="d-flex flex-column align-items-center">
                <span class="fw-bold fs-5">{{ userStore.userInfo.name }}</span>
                <span class="mb-2 text-muted">{{ userStore.userInfo.id }}</span>
                <a
                  :href="`https://www.facebook.com/business-support-home/${userStore.userInfo.id}`"
                  target="_BLANK"
                  class="text-decoration-none badge mb-1"
                  :class="accountQualityClass"
                  style="font-size: 12px"
                >
                  {{ userStore.accountQuality?.status || 'Checking...' }}
                </a>
              </div>
            </div>
            <ul class="p-3 m-0 border-top list-unstyled">
              <li>
                <span class="py-1 d-block fw-medium"
                  ><i class="ri-mail-line me-2"></i> Email:
                  {{ userStore.userInfo.email || 'N/A' }}</span
                >
              </li>
              <li>
                <span class="py-1 d-block fw-medium"
                  ><i class="ri-calendar-line me-2"></i> Ngày sinh:
                  {{ userStore.userInfo.birthday || 'N/A' }}</span
                >
              </li>
              <li>
                <span class="py-1 d-block fw-medium"
                  ><i class="ri-group-line me-2"></i> Bạn bè:
                  {{ userStore.userInfo.friends || 'N/A' }}</span
                >
              </li>
              <li>
                <span class="py-1 d-block fw-medium"
                  ><i class="ri-men-line me-2"></i> Giới tính:
                  {{ userStore.userInfo.gender || 'N/A' }}</span
                >
              </li>
            </ul>
            <ul class="border-top p-3 m-0 list-unstyled">
              <li>
                <a
                  href="#"
                  @click.prevent="switchAccount"
                  class="text-decoration-none py-1 d-block fw-medium dropdown-item"
                  ><i class="ri-repeat-line me-2"></i> Chuyển tài khoản</a
                >
              </li>
              <li>
                <a
                  href="#"
                  @click.prevent="logout"
                  class="text-decoration-none py-1 d-block fw-medium dropdown-item"
                  ><i class="ri-logout-box-r-line me-2"></i> Đăng xuất</a
                >
              </li>
            </ul>
          </template>
          <div v-else class="p-3 text-center">Đang tải dữ liệu người dùng...</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { usePageReloader } from '@/composables/usePageReloader'
import { useUserStore } from '@/stores/userStore'
import { useToast } from '@/composables/useToast'
import { removeLocalStorage } from '@/composables/extensionUtils'

const { reloadPage } = usePageReloader()
const userStore = useUserStore()
const { addToast } = useToast()

const accountQualityClass = computed(() => {
  const color = userStore.accountQuality?.color
  if (!color) return 'text-bg-secondary'
  return `text-bg-${color}`
})

const switchAccount = () => {
  addToast('Chức năng này đang được phát triển.', 'info')
}

const logout = async () => {
  await removeLocalStorage('accessToken')
  await removeLocalStorage('accessToken2')
  await removeLocalStorage('dtsg')
  await removeLocalStorage('dtsg2')
  await removeLocalStorage(`userInfo_${userStore.userInfo?.id}`)
  await removeLocalStorage('uid')
  userStore.clearUserInfo()
  window.location.reload()
}
</script>

<style scoped>
[data-bs-theme='dark'] .header-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

[data-bs-theme='light'] .header-glass {
  background: rgba(248, 249, 250, 0.8); /* Match light theme body bg */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #dee2e6;
}

[data-bs-theme='dark'] .app-title,
[data-bs-theme='dark'] .user-details,
[data-bs-theme='dark'] .nav-link-item {
  color: #fff;
}

[data-bs-theme='light'] .app-title,
[data-bs-theme='light'] .user-details {
  color: #212529;
}

.nav-menu {
  padding: 4px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

[data-bs-theme='dark'] .nav-menu {
  background: rgba(255, 255, 255, 0.1);
}

[data-bs-theme='light'] .nav-menu {
  background: rgba(0, 0, 0, 0.05);
}

.nav-link-item {
  position: relative;
  min-width: 48px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  z-index: 1;
  user-select: none;
  white-space: nowrap;
  padding: 8px 16px;
  text-decoration: none;
  text-align: center;
}

[data-bs-theme='dark'] .nav-link-item {
  background: rgba(255, 255, 255, 0.05);
}

[data-bs-theme='light'] .nav-link-item {
  background: rgba(0, 0, 0, 0.05);
  color: #495057;
}

.nav-link-item:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 3px 9px rgba(255, 255, 255, 0.2);
}

[data-bs-theme='dark'] .nav-link-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffe082;
}

[data-bs-theme='dark'] .nav-link-item.active,
.nav-link-item.router-link-exact-active {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  color: #222;
  font-weight: bold;
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.5),
    0 3px 12px rgba(0, 0, 0, 0.3);
  transform: scale(1) translateY(-3px);
}

[data-bs-theme='light'] .nav-link-item.active,
[data-bs-theme='light'] .nav-link-item.router-link-exact-active {
  background: var(--bs-primary);
  color: #fff;
}

[data-bs-theme='light'] .nav-link-item:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--bs-primary);
}

.nav-link-item:hover::before {
  animation: lightning-flash 0.6s ease-in-out;
  opacity: 1;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #10b981;
  animation: pulse-animation 1.5s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.online-text {
  color: #34d399;
  font-weight: 500;
}

.app-version {
  font-size: 0.75rem;
}

[data-bs-theme='dark'] .app-version {
  color: #93c5fd;
  background-color: rgba(96, 165, 250, 0.2);
}

[data-bs-theme='light'] .app-version {
  color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle);
}

.settings-btn {
  padding: 0.6rem 1.2rem;
}

.user-info {
  backdrop-filter: blur(4px);
}

.text-xs {
  font-size: 0.75rem;
}

@keyframes lightning-flash {
  0% {
    left: -75%;
    opacity: 0;
  }

  50% {
    left: 50%;
    opacity: 1;
  }

  100% {
    left: 125%;
    opacity: 0;
  }
}

.dropdown-menu {
  --bs-dropdown-link-hover-color: var(--bs-emphasis-color);
  --bs-dropdown-link-hover-bg: var(--bs-secondary-bg);
}
.dropdown-item {
  color: var(--bs-body-color);
}
.dropdown-item:hover {
  color: var(--bs-dropdown-link-hover-color);
  background-color: var(--bs-dropdown-link-hover-bg);
}
.dropdown-menu .p-2 {
  background-color: var(--bs-secondary-bg) !important;
}
</style>
