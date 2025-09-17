/**
 * Quản lý màn hình tải trang (preloader) cho ứng dụng.
 * Hiển thị thông báo và thanh tiến trình trước khi nội dung chính xuất hiện.
 */
export function usePreloader() {
  const preloader = document.getElementById('preloader')
  const progressText = document.getElementById('preloader-progress-text')
  const progressBar = document.getElementById('preloader-progress-bar')
  const messages = [
    'Đang khởi tạo ứng dụng...',
    'Đang tải các thành phần giao diện...',
    'Đang kết nối với máy chủ...',
    'Sắp hoàn tất, vui lòng chờ trong giây lát...',
  ]

  let currentProgress = 0
  let messageIndex = 0

  /**
   * Bắt đầu hiển thị preloader và cập nhật tiến trình.
   */
  const start = () => {
    if (!preloader || !progressText || !progressBar) return

    preloader.style.display = 'flex'

    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress > 100) {
        currentProgress = 100
      }

      progressBar.style.width = `${currentProgress}%`

      if (currentProgress >= (messageIndex + 1) * 25 && messageIndex < messages.length - 1) {
        messageIndex++
        progressText.textContent = messages[messageIndex]
      }
    }, 400)

    return () => clearInterval(interval)
  }

  return { start }
}
