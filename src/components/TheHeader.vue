<template>
  <header
    class="p-3 d-flex justify-content-between align-items-center header-glass"
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
        <span class="badge rounded-pill app-version fw-medium">
          Facebook Manager v3.2
        </span>
      </div>

      <!-- Navigation -->
      <nav class="nav-menu d-flex align-items-center gap-1">
        <router-link to="/" class="nav-link-item">HOME</router-link>
        <router-link to="/clone" class="nav-link-item">CLONE</router-link>
        <router-link to="/ads" class="nav-link-item">TKQC</router-link>
        <router-link to="/bm" class="nav-link-item">BM</router-link>
        <router-link to="/page" class="nav-link-item">PAGE</router-link>
        <router-link to="/tool" class="nav-link-item">TOOL</router-link>
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
        <span class="online-text">2,847 Accounts Online</span>
      </div>

      <!-- Settings Button -->

 <div class="d-flex align-items-center gap-2">
        <button
          class="btn btn-secondary fw-bold shadow-sm settings-btn"
          @click="reloadPage"
        >
          <i class="ri-refresh-line me-1"></i> Tải lại
        </button>
        <button
          class="btn btn-secondary fw-bold shadow-sm settings-btn"
          data-bs-toggle="modal"
          data-bs-target="#settingModal"
        >
          <i class="ri-settings-3-line me-1"></i> Cài đặt
        </button>
      </div>

      <!-- User Info -->
      <div
        class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 user-info"
      >
        <img
          src="https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-1/343169584_629415035286003_7196487710421941260_n.jpg?stp=c0.0.252.252a_dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=79bf43&_nc_ohc=g1xDQF8gOzUQ7kNvwEON7Dv&_nc_oc=AdmavK1eeAkwxsTmOU76dfHIlrLAkTnveKb3KJe24N_eUoqlxrOros3cnv2RkVwYMvZmPYFCwb9hI0s4kCukTTUe&_nc_zt=24&_nc_ht=scontent.fhan4-3.fna&_nc_gid=csFm0acYPRyVfDyqV-ZZUA&oh=00_AfVsJztF9FcLjCr2ecfLaJ0RoyNGguD2IkTAb-NzyxWiTg&oe=68B9D00B"
          alt="User Avatar"
          class="rounded-circle"
          style="width: 36px; height: 36px; object-fit: cover"
        />
        <div class="user-details">
          <div class="fw-bold">Mi Hawk</div>
          <div class="text-xs" style="color: rgba(255, 255, 255, 0.7)">100015915101</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { usePageReloader } from '@/composables/usePageReloader'

const { reloadPage } = usePageReloader()
</script>

<style scoped>
.header-glass {
  z-index: 101;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

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
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 3px 12px rgba(0, 0, 0, 0.3);
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
</style>
