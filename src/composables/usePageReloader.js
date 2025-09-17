import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const activeModal = ref(null)

/**
 * Composable để quản lý việc tải lại trang.
 * Cung cấp hàm để tải lại trang và ghi lại thông tin trang hiện tại.
 */
export function usePageReloader() {
  const route = useRoute()
  const { addToast } = useToast()

  const showModal = (modalName) => {
    activeModal.value = modalName
  }

  const closeModal = () => {
    activeModal.value = null
  }

  const loadData = (settings) => {
    console.log(`Đang tải dữ liệu cho modal: ${activeModal.value} với cài đặt:`, settings)

    addToast(`Bắt đầu tải dữ liệu cho ${activeModal.value.toUpperCase()}...`, 'info')
    if (activeModal.value === 'ads') {
      getAdAccountsADS(IDKQC)
      addToast('Dữ liệu quảng cáo đã được tải lại thành công!', 'success')
    } else if (activeModal.value === 'bm') {
      addToast('Dữ liệu Business Manager đã được tải lại thành công!', 'success')
    } else {
      addToast('Không xác định modal để tải dữ liệu.', 'error')
    }
    // TODO: Thêm logic xử lý dữ liệu ở đây
    // Ví dụ: emit một sự kiện hoặc gọi một API
    // emit('load-data', settings);

    // Tùy chọn: hiển thị progress bar và đóng popup sau khi hoàn tất
    closeModal()
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
