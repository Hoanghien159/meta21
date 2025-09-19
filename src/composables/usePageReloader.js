import { useRoute } from 'vue-router'
import { ref } from 'vue'
import FB from './fbcode.js' // Import the FB class
import { useToast } from '@/composables/useToast'

const activeModal = ref(null)

/**
 * Composable để quản lý việc tải lại trang.
 * Cung cấp hàm để tải lại trang và ghi lại thông tin trang hiện tại.
 */
export function usePageReloader() {
  const route = useRoute()
  const { addToast } = useToast()
  const fb = new FB() // Create an instance of the FB class

  const showModal = (modalName) => {
    activeModal.value = modalName
  }

  const closeModal = () => {
    activeModal.value = null
  }

  const loadData = async (modalType, settings) => {
    console.log(`Đang tải dữ liệu cho modal: ${modalType} với cài đặt:`, settings)

    addToast(`Bắt đầu tải dữ liệu cho ${modalType.toUpperCase()}...`, 'info')
    if (modalType === 'ads') {
      const data = await fb.loadAds(settings)
      addToast('Dữ liệu quảng cáo đã được tải lại thành công!', 'success')
      closeModal()
      return data
    } else if (modalType === 'bm') {
      addToast('Dữ liệu Business Manager đã được tải lại thành công!', 'success')
    } else {
      addToast('Không xác định modal để tải dữ liệu.', 'error')
    }

    closeModal()
    return null
  }

  const reloadPage = () => {
    const modalMap = {
      '/ads': 'ads',
      '/bm': 'bm',
    }
    const modalToShow = modalMap[route.path]
    if (modalToShow) showModal(modalToShow)
    else window.location.reload()
  }

  return { reloadPage, activeModal, showModal, closeModal, loadData }
}
