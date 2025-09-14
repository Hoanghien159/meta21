import { ref, onMounted, readonly } from 'vue'

// Biến ref toàn cục để lưu trữ theme hiện tại
const _currentTheme = ref('dark')

// Chỉ export phiên bản readonly để các component khác không thể sửa đổi trực tiếp
export const currentTheme = readonly(_currentTheme)

/**
 * Composable để quản lý giao diện (theme) sáng/tối của ứng dụng.
 */
export function useTheme() {
  const setTheme = (theme) => {
    _currentTheme.value = theme
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Nếu không có theme nào được lưu, sử dụng theme mặc định của hệ thống
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }

  // Trả về các hàm và biến cần thiết
  return { currentTheme, setTheme, initTheme }
}
