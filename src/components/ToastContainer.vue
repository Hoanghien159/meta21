<template>
  <div class="toast-container">
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-${toast.type}`"
        @click="removeToast(toast.id)"
      >
        <i :class="getIcon(toast.type)" class="toast-icon"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return 'ri-checkbox-circle-fill'
    case 'error':
      return 'ri-close-circle-fill'
    case 'warning':
      return 'ri-error-warning-fill'
    default:
      return 'ri-information-fill'
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  min-width: 250px;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast-icon {
  font-size: 20px;
  margin-right: 10px;
}

.toast-info {
  background-color: #3498db;
}
.toast-success {
  background-color: #2ecc71;
}
.toast-warning {
  background-color: #f39c12;
}
.toast-error {
  background-color: #e74c3c;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
