import { ref, readonly } from 'vue'

// Trạng thái lựa chọn chung cho toàn ứng dụng
const _sharedSelectedIds = ref([])

// Chỉ export phiên bản readonly để các component khác không thể sửa đổi trực tiếp
export const sharedSelectedIds = readonly(_sharedSelectedIds)

// Hàm để component cập nhật trạng thái lựa chọn
export function useSelection() {
  const setSelectedIds = (ids) => (_sharedSelectedIds.value = ids)

  const toggleSelection = (id) => {
    const index = _sharedSelectedIds.value.indexOf(id)
    if (index > -1) {
      _sharedSelectedIds.value.splice(index, 1)
    } else {
      _sharedSelectedIds.value.push(id)
    }
  }

  // Vẫn export sharedSelectedIds (readonly) để các component có thể đọc
  // và các hàm để thay đổi trạng thái một cách có kiểm soát.
  return { sharedSelectedIds, setSelectedIds, toggleSelection }
}
