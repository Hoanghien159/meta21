<script setup lang="ts">
import { onMounted } from 'vue'
import TheHeader from './components/TheHeader.vue'
import SettingsModal from './components/SettingsModal.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useTheme } from '@/composables/useTheme'
import { initAutomationRunner } from '@/composables/useAutomationRunner'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
  initAutomationRunner()
  import('bootstrap/dist/js/bootstrap.min.js')
})
</script>

<template>
  <div id="app-wrapper" class="d-flex flex-column h-100">
    <TheHeader />
    <main class="flex-grow-1 overflow-auto p-3">
      <router-view />
    </main>
    <ToastContainer />
    <SettingsModal />
  </div>
</template>

<style scoped>
/* Bạn có thể thêm các style chung cho App tại đây nếu cần */
</style>
