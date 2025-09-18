import { ref } from 'vue'

const listeners = ref({})

export function useAutomation() {
  const on = (event, callback) => {
    if (!listeners.value[event]) {
      listeners.value[event] = []
    }
    listeners.value[event].push(callback)

    // Trả về một hàm để hủy đăng ký
    return () => {
      if (listeners.value[event]) {
        const index = listeners.value[event].indexOf(callback)
        if (index > -1) {
          listeners.value[event].splice(index, 1)
        }
      }
    }
  }

  const emit = (event, ...args) => {
    if (listeners.value[event]) {
      listeners.value[event].forEach((callback) => callback(...args))
    }
  }

  return { on, emit }
}
