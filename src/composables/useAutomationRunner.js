import { ref } from 'vue'
import { useAutomation } from '@/composables/useAutomation'
import { useToast } from '@/composables/useToast'

// Di chuyển các biến này ra ngoài để chúng trở thành state của module
const taskHandlers = ref({})

/**
 * Khởi tạo listener cho các tác vụ tự động hóa.
 * Hàm này chỉ nên được gọi một lần trong toàn bộ ứng dụng.
 */
export function initAutomationRunner() {
  const { on: onAutomation, emit: emitAutomation } = useAutomation()
  const { addToast } = useToast()
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  onAutomation('start', async (payload) => {
    emitAutomation('running', true)
    const { selectedIds, features, threads, delay } = payload

    console.log(`Bắt đầu chạy ${features.length} tác vụ trên ${selectedIds.length} mục với ${threads} luồng...`)

    for (const feature of features) {
      const handler = taskHandlers.value[feature.id]
      if (handler) {
        console.log(`Đang thực thi tác vụ: ${feature.id}`)

        const queue = [...selectedIds]
        const runningTasks = []

        const runTask = async () => {
          while (queue.length > 0) {
            const itemId = queue.shift()
            if (itemId) {
              try {
                await handler({ itemId, settings: feature.settings, threads, delay })
              } catch (error) {
                console.error(`Lỗi khi thực thi tác vụ ${feature.id} cho mục ${itemId}:`, error)
                addToast(`Tác vụ ${feature.id} thất bại cho mục ${itemId}.`, 'error')
              }
            }
          }
        }

        for (let i = 0; i < Math.min(threads, selectedIds.length); i++) {
          runningTasks.push(runTask())
        }

        await Promise.all(runningTasks)
      } else {
        console.warn(`Không tìm thấy hàm xử lý cho tác vụ: ${feature.id}`)
      }
    }

    console.log('Hoàn tất tất cả các tác vụ.')
    emitAutomation('running', false)
    emitAutomation('end')
  })
}

/**
 * Composable để chạy các tác vụ tự động hóa.
 */
export function useAutomationRunner() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Đăng ký một hàm xử lý cho một loại tác vụ cụ thể
  const registerTask = (featureId, handler) => {
    taskHandlers.value[featureId] = handler
  }

  return {
    registerTask,
    sleep,
  }
}
