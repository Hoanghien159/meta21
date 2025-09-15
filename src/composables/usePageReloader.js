import { useRoute } from 'vue-router'
import { ref } from 'vue'

const activeModal = ref(null)

/**
 * Composable để quản lý việc tải lại trang.
 * Cung cấp hàm để tải lại trang và ghi lại thông tin trang hiện tại.
 */
export function usePageReloader() {
  const route = useRoute()

  const showModal = (modalName) => {
    activeModal.value = modalName
  }

  const closeModal = () => {
    activeModal.value = null
  }

  const reloadPage = () => {
    console.log('Người dùng đang ở trang:', route.path)
    console.log('Tên route:', route.name)
    if (route.path === '/ads') {
      showModal('ads')
    } else if (route.path === '/bm') {
      showModal('bm')
    } else if (route.path === '/page') {
      console.log('Người dùng đang ở trang page. Thực hiện hành động tương ứng.')
    } else {
      // Đối với các trang khác, chỉ cần tải lại
      window.location.reload()
    }
  }

  return { reloadPage, activeModal, closeModal }
}
