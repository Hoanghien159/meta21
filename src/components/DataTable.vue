<template>
  <!-- prettier-ignore -->
  <div class="metric-card rounded-xl shadow-lg overflow-hidden d-flex flex-column h-100 position-relative" ref="tableWrapper">
    <!-- Slot for filters -->
    <div
      v-if="$slots.filters || selectable"
      class="border-bottom dark-border d-flex justify-content-between align-items-center"
    >
      <div class="d-flex align-items-center gap-3"></div>
      <slot name="filters"></slot>
    </div>

    <!-- Table Container -->
    <div class="table-container custom-scrollbar flex-grow-1">
      <table class="table table-hover mb-0">
        <thead class="table-header">
          <tr>
            <th v-if="selectable" class="text-center" style="width: 50px">
              <input
                type="checkbox"
                class="form-check-input"
                :checked="areAllSelected"
                @change="toggleSelectAllOnPage"
              />
            </th>
            <th
              v-for="(column, index) in columns"
              :key="column.key"
              scope="col"
              class="text-start"
              :style="{
                width: columnWidths[column.key] ? `${columnWidths[column.key]}px` : 'auto',
              }"
              @click="column.sortable && $emit('sort', column.key)"
              :class="{ sortable: column.sortable }"
            >
              <div class="d-flex align-items-center">
                <slot :name="`header(${column.key})`" :column="column">
                  <span>{{ column.label }}</span>
                </slot>
                <i
                  v-if="sortKey === column.key"
                  class="ri-arrow-down-s-line sort-icon ms-1"
                  :class="{ asc: sortOrder === 'asc' }"
                ></i>
              </div>
              <div class="resizer" @mousedown="startResize($event, index)"></div>
            </th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-if="items.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="text-center py-4">
              Chưa có dữ liệu.
            </td>
          </tr>
          <tr
            v-for="(item, index) in items"
            :key="item.id || index"
            class="align-middle"
            @mousedown.left.prevent="handleRowMouseDown($event, item)"
            @mouseover="handleRowMouseOver(item)"
            @contextmenu.prevent="showContextMenu($event)"
          >
            <td v-if="selectable" class="text-center" :class="{ 'row-highlighted': highlightedRows.has(item.id) }">
              <!-- prettier-ignore -->
              <input
                type="checkbox"
                class="form-check-input"
                :checked="sharedSelectedIds.includes(item.id)"
                @change="toggleSelectItem(item)"
              />
            </td>
            <td v-for="column in columns" :key="column.key" :class="{ 'row-highlighted': highlightedRows.has(item.id) }">
              <!-- Slot for custom cell rendering -->
              <slot
                :name="`cell(${column.key})`"
                :item="item"
                :value="item[column.key]"
                :index="index"
              >
                <!-- Default cell rendering -->
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Context Menu -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      @click="hideContextMenu"
    >
      <div class="context-menu-item" @click="applySelection('add')">
        <i class="ri-check-line me-2"></i>Chọn các dòng đã bôi đen
      </div>
      <div class="context-menu-item" @click="applySelection('remove')">
        <i class="ri-close-line me-2"></i>Bỏ chọn các dòng đã bôi đen
      </div>
      <div class="context-menu-item" @click="deselectAll">
        <i class="ri-checkbox-multiple-blank-line me-2"></i>Bỏ chọn tất cả ({{
          sharedSelectedIds.length
        }})
      </div>
    </div>
    <!-- Footer -->
    <div class="table-footer flex-wrap position-absolute bottom-0 start-0 end-0">
      <div class="d-flex align-items-center gap-3">
        <slot name="bulk-actions">
          <!-- Bulk actions can be placed here -->
        </slot>
        <div v-if="selectable" class="text-sm footer-text ms-2">Đã chọn: {{ sharedSelectedIds.length }}</div>
        <div v-if="highlightedRows.size > 0" class="text-sm footer-text ms-3">
          Bôi đen: {{ highlightedRows.size }}
        </div>
        <div v-if="statusCounts" class="d-flex align-items-center gap-2 ms-4 footer-text text-sm">
          <button
            @click="$emit('update:statusFilter', '')"
            class="status-badge-filter"
            :class="{ active: statusFilter === '' }"
          >
            Tất cả: <strong>{{ totalItems }}</strong>
          </button>
          <span v-for="(item, index) in statusItems" :key="index">
            <button
              @click="$emit('update:statusFilter', item.status)"
              class="status-badge-filter"
              :class="[item.class, { active: statusFilter === item.status }]"
            >
              {{ item.status }}: <strong class="ms-1">{{ item.count }}</strong>
            </button>
          </span>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2 text-sm footer-text">
          <span>Số mục/trang:</span>
          <select
          class="form-select form-select-sm w-auto"
            :value="itemsPerPage"
            @change="$emit('update:itemsPerPage', +$event.target.value)"
          >
            <option v-for="option in [10, 20, 50, 100, 200, 500]" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="text-sm footer-text">
          Hiển thị {{ items.length }} trong tổng số {{ totalItems }} mục
        </div>
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="$emit('update:currentPage', currentPage - 1)"
          title="Trang trước"
        >
          &laquo;
        </button>

        <div class="d-flex align-items-center gap-1 footer-text text-sm">
          <span>Trang</span>
          <input
            type="number"
            class="form-control form-control-sm page-input"
            :value="currentPage"
            @keyup.enter="goToPage($event.target.value)"
            @blur="goToPage($event.target.value)"
            min="1"
            :max="totalPages"
          />
          <span>/ {{ totalPages }}</span>
        </div>

        <button
          class="pagination-button"
          :disabled="currentPage >= totalPages"
          @click="$emit('update:currentPage', currentPage + 1)"
          title="Trang sau"
        >
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, onBeforeUnmount, defineEmits } from 'vue'
import { useSelection } from '@/composables/useSelection'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  sortKey: {
    type: String,
    default: '',
  },
  sortOrder: {
    type: String,
    default: 'desc',
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  columnWidths: {
    type: Object,
    default: () => ({}),
  },
  statusCounts: {
    type: Object,
    default: () => ({}),
  },
  statusFilter: {
    type: String,
    default: '',
  },
})

const { sharedSelectedIds, setSelectedIds } = useSelection()

const statusItems = computed(() => {
  return Object.entries(props.statusCounts).map(([status, count]) => ({
    status,
    count,
    class: getStatusClass(status),
  }))
})

const isDragging = ref(false)
const lastHoveredRowId = ref(null)
const lastClickedRowId = ref(null)
const highlightedRows = ref(new Set())

const tableWrapper = ref(null)

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
})

function getStatusClass(status) {
  // Trạng thái chung
  if (status === 'Hoạt động') return 'status-active'
  if (status === 'Tạm dừng' || status === 'đóng hạn' || status === 'Lỗi') return 'status-inactive'
  if (status === 'Đang xem xét') return 'status-leave'
  // Trạng thái của trang Clone
  if (status === 'Đã clone') return 'status-active'
  if (status === 'Đang chờ') return 'status-leave'
  // Trạng thái chạy automation
  if (status === 'Thành công') return 'status-active'
  if (status === 'Đang chạy') return 'status-leave'
  if (status === 'Thất bại') return 'status-inactive'
  return ''
}

function handleRowMouseDown(event, item) {
  hideContextMenu()

  if (event.shiftKey && lastClickedRowId.value) {
    // Logic chọn với phím Shift
    const lastIndex = props.items.findIndex((i) => i.id === lastClickedRowId.value)
    const currentIndex = props.items.findIndex((i) => i.id === item.id)
    const start = Math.min(lastIndex, currentIndex)
    const end = Math.max(lastIndex, currentIndex)

    if (!event.ctrlKey && !event.metaKey) {
      highlightedRows.value.clear()
    }

    for (let i = start; i <= end; i++) {
      highlightedRows.value.add(props.items[i].id)
    }
  } else {
    isDragging.value = true
    lastHoveredRowId.value = item.id
    // Nếu không nhấn Ctrl (hoặc Cmd trên Mac), xóa các dòng đã bôi đen trước đó
    if (!event.ctrlKey && !event.metaKey) {
      highlightedRows.value.clear()
    }
    highlightedRows.value.add(item.id)
    highlightedRows.value.clear()
    highlightedRows.value.add(item.id)
  }

  lastClickedRowId.value = item.id
  // Thêm trình nghe sự kiện mouseup vào document để dừng việc kéo
  document.addEventListener('mouseup', handleMouseUp, { once: true })
}

function handleRowMouseOver(item) {
  if (isDragging.value) {
    highlightedRows.value.add(item.id)
  }
}

function handleMouseUp() {
  isDragging.value = false
  lastHoveredRowId.value = null
  // Không xóa highlightedRows ở đây để có thể dùng cho context menu
}

function showContextMenu(event) {
  if (highlightedRows.value.size > 0) {
    contextMenu.value.visible = true
    contextMenu.value.x = event.clientX
    contextMenu.value.y = event.clientY
  }
  // Lắng nghe sự kiện click bên ngoài để đóng menu và xóa bôi đen
  document.addEventListener('click', handleClickOutside, { once: true })
}
const emit = defineEmits([
  'sort',
  'update:currentPage',
  'update:itemsPerPage',
  'update:columnWidths',
  'update:statusFilter',
])
function goToPage(page) {
  const pageNumber = parseInt(page, 10)
  if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= props.totalPages) {
    emit('update:currentPage', pageNumber)
  }
  // Nếu người dùng nhập số trang không hợp lệ, có thể reset lại giá trị của input về trang hiện tại
}

function hideContextMenu() {
  contextMenu.value.visible = false
}
function handleClickOutside(event) {
  if (tableWrapper.value && !tableWrapper.value.contains(event.target)) {
    highlightedRows.value.clear()
  }
  // Không xóa bôi đen ở đây nữa, chỉ xóa khi bắt đầu bôi đen mới.
}

function applySelection(mode) {
  const currentSelected = new Set(sharedSelectedIds.value)
  if (mode === 'add') {
    highlightedRows.value.forEach((id) => currentSelected.add(id))
  } else {
    highlightedRows.value.forEach((id) => currentSelected.delete(id))
  }
  setSelectedIds(Array.from(currentSelected))
  hideContextMenu()
}

function deselectAll() {
  setSelectedIds([])
  hideContextMenu()
}
function updateSelection(itemId, mode) {
  const newSelected = new Set(sharedSelectedIds.value)
  if (mode === 'add') newSelected.add(itemId)
  else newSelected.delete(itemId)
  setSelectedIds(Array.from(newSelected))
}



const areAllSelected = computed(() => {
  if (!props.items.length || !sharedSelectedIds.value.length) return false
  // Chỉ kiểm tra các mục trên trang hiện tại
  return props.items.every((item) => sharedSelectedIds.value.includes(item.id))
})

function toggleSelectAllOnPage(event) {
  const allIdsOnPage = props.items.map((item) => item.id)
  const newSelected = event.target.checked
    ? [...new Set([...sharedSelectedIds.value, ...allIdsOnPage])]
    : sharedSelectedIds.value.filter((id) => !allIdsOnPage.includes(id))
  setSelectedIds(newSelected)
}

function toggleSelectItem(item) {
  updateSelection(item.id, sharedSelectedIds.value.includes(item.id) ? 'remove' : 'add')
}

const columnWidths = ref(props.columnWidths)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)
const activeColumnIndex = ref(-1)

const startResize = (event, index) => {
  event.stopPropagation() // Ngăn sự kiện lan truyền lên thẻ <tr>
  isResizing.value = true
  activeColumnIndex.value = index
  const th = event.target.parentElement
  startX.value = event.clientX
  startWidth.value = th.offsetWidth
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResize)
}

const handleMouseMove = (event) => {
  if (!isResizing.value) return
  const diffX = event.clientX - startX.value
  const newWidth = startWidth.value + diffX
  const columnKey = props.columns[activeColumnIndex.value].key
  if (newWidth > 50) {
    // Đặt chiều rộng tối thiểu
    columnWidths.value[columnKey] = newWidth
  }
}

const stopResize = () => {
  isResizing.value = false
  activeColumnIndex.value = -1
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
  emit('update:columnWidths', { ...columnWidths.value })
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Import font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Use Inter font for this component */
:host {
  font-family: 'Inter', sans-serif;
}

.table-body td.row-highlighted {
  background-color: rgba(13, 110, 253, 0.2) !important; /* Chỉ giữ lại màu nền mờ */
  position: relative;
  /* Nâng cao lớp của dòng được bôi đen để nó nổi lên trên các dòng khác */
  z-index: 11; /* Phải cao hơn z-index của thead (10) */
}

.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: var(--bs-dropdown-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--bs-dropdown-border-color);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 220px;
}

.context-menu-item {
  padding: 8px 12px;
  color: var(--bs-dropdown-link-color);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.context-menu-item:hover {
  background-color: var(--bs-dropdown-link-hover-bg);
}

/* Ensure table layout is consistent */
.table {
  table-layout: fixed;
  width: 100%;
}

.table th,
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}

.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
  background-color: rgba(139, 185, 254, 0.2);
  opacity: 0;
  transition: opacity 0.2s;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table th:hover .resizer {
  opacity: 1;
}

.sortable {
  cursor: pointer;
}

.sortable:hover {
  background-color: #3c414b;
}

.sort-icon {
  display: inline-block;
  transition: transform 0.2s;
}

.sort-icon.asc {
  transform: rotate(180deg);
}

.page-input {
  width: 60px;
  text-align: center;
  -moz-appearance: textfield; /* Firefox */
}

/* Ensure text-start is applied correctly */
.text-start {
  text-align: left !important;
}
</style>
