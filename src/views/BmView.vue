<template>
  <DataViewLayout>
    <template #datatable>
      <!-- prettier-ignore -->
      <DataTable :columns="columns" :items="paginatedAccounts" :total-items="filteredAccounts.length" :sort-key="sortKey"
        :sort-order="sortOrder" @sort="sortBy" selectable v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage" :total-pages="totalPages" :column-widths="columnWidths"
        @update:column-widths="columnWidths = $event" :status-counts="statusCounts" v-model:status-filter="statusFilter" @click.stop>
        <template #cell(stt)="{ item }"> {{ item.stt }} </template>
        <template #cell(name)="{ item }">
          <div class="d-flex align-items-center">
            <div class="avatar-letter me-3" :data-letter="item.name.charAt(0).toUpperCase()"></div>
            <div>
              <div class="text-sm fw-medium text-white">
                {{ item.name }}
              </div>
              <div class="text-xs text-white op-75">{{ item.id }}</div>
            </div>
          </div>
        </template>
        <template #cell(status)="{ item }">
          <span class="status-badge" :class="item.statusClass">{{ item.status }}</span>
        </template>
        <template #cell(spent)="{ item }">
          {{ item.spent.toLocaleString('vi-VN') }} {{ item.currency }}
        </template>
        <template #cell(threshold)="{ item }">
          {{ item.threshold.toLocaleString('vi-VN') }} {{ item.currency }}
        </template>
      </DataTable>
    </template>
    <template #automation-panel>
      <AutomationPanel :features="adsPageFeatures" />
    </template>
  </DataViewLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import AutomationPanel from '@/components/AutomationPanel.vue'
import DataViewLayout from '@/components/DataViewLayout.vue'
import { useSelection } from '@/composables/useSelection'

const adsPageFeatures = ref([
  {
    id: 'createSettings',
    title: 'Tạo Page',
    icon: 'ri-add-circle-line', // Icon from Remix Icon library
    iconBgClass: 'icon-bg-create', // Background class from main.css
    settings: [
      { id: 'pageName', label: 'Tên Page', type: 'text' },
      { id: 'pageCount', label: 'Số lượng', type: 'number', min: 1, value: 1 },
    ],
  },
  {
    id: 'renameSettings',
    title: 'Đổi tên Page',
    icon: 'ri-edit-line',
    iconBgClass: 'icon-bg-rename',
    settings: [{ id: 'newPageName', label: 'Tên mới', type: 'text' }],
  },
  {
    id: 'shareSettings',
    title: 'Share Page',
    icon: 'ri-share-line',
    iconBgClass: 'icon-bg-share',
    settings: [{ id: 'shareId', label: 'ID người nhận', type: 'text' }],
  },
  { id: 'accept', title: 'Chấp nhận Page', icon: 'ri-check-line', iconBgClass: 'icon-bg-accept' },
  { id: 'out', title: 'Out Page', icon: 'ri-logout-box-line', iconBgClass: 'icon-bg-out' },
])

const columns = ref([
  { key: 'stt', label: 'STT', sortable: true },
  { key: 'name', label: 'Tên Tài khoản', sortable: true },
  { key: 'id', label: 'ID Tài khoản', sortable: true },
  { key: 'status', label: 'Trạng thái', sortable: true },
  { key: 'currency', label: 'Tiền tệ', sortable: true },
  { key: 'spent', label: 'Đã chi tiêu', sortable: true },
  { key: 'threshold', label: 'Ngưỡng', sortable: true },
])

const adAccounts = ref([
  {
    id: '123456789012345',
    name: 'k Marketing ABC',
    status: 'Hoạt động',
    currency: 'VND',
    spent: 15500000,
    threshold: 20000000,
    statusClass: 'status-active',
  },
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `act_123456789${i}`,
    name: `Tài khoản bm ${i + 1}`,
    status: i % 3 === 0 ? 'Hoạt động' : i % 3 === 1 ? 'đóng hạn' : 'Đang xem xét',
    currency: 'VND',
    spent: Math.random() * 10000000,
    threshold: 15000000,
    statusClass: i % 3 === 0 ? 'status-active' : i % 3 === 1 ? 'status-inactive' : 'status-leave',
  })),
])

// --- State Management ---
const TABLE_SETTINGS_KEY = 'bm_table_settings'

function loadSettings() {
  const saved = localStorage.getItem(TABLE_SETTINGS_KEY)
  return saved ? JSON.parse(saved) : {}
}

const { sharedSelectedIds, setSelectedIds } = useSelection()

const settings = ref(loadSettings())

const statusFilter = ref(settings.value.statusFilter || '')
const sortKey = ref(settings.value.sortKey || 'spent')
const sortOrder = ref(settings.value.sortOrder || 'desc')
const currentPage = ref(settings.value.currentPage || 1)
const itemsPerPage = ref(settings.value.itemsPerPage || 5)
const columnWidths = ref(
  settings.value.columnWidths || {
    stt: 60, // Cột STT
    name: 350, // Cột Tên Tài khoản
    id: 180, // Cột ID Tài khoản
    status: 150, // Cột Trạng thái
    currency: 110, // Cột Tiền tệ
    spent: 160, // Cột Đã chi tiêu
    threshold: 160, // Cột Ngưỡng
  },
)

// --- Computed Properties ---

const filteredAccounts = computed(() => {
  if (!statusFilter.value) {
    return adAccounts.value
  }
  return adAccounts.value.filter((acc) => acc.status === statusFilter.value)
})

const statusCounts = computed(() => {
  return adAccounts.value.reduce((acc, account) => {
    acc[account.status] = (acc[account.status] || 0) + 1
    return acc
  }, {})
})

const totalPages = computed(() => {
  return Math.ceil(filteredAccounts.value.length / itemsPerPage.value)
})

const sortedAccounts = computed(() => {
  // Gán lại STT cho toàn bộ danh sách đã lọc
  const accountsWithStt = filteredAccounts.value.map((acc, index) => ({
    ...acc,
    stt: index + 1,
  }))

  return [...accountsWithStt].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    let modifier = sortOrder.value === 'asc' ? 1 : -1

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * modifier
    }

    if (String(valA) < String(valB)) return -1 * modifier
    if (String(valA) > String(valB)) return 1 * modifier
    return 0
  })
})

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedAccounts.value.slice(start, end)
})

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

function deleteSelected() {
  if (confirm(`Bạn có chắc muốn xóa ${sharedSelectedIds.value.length} tài khoản đã chọn?`)) {
    adAccounts.value = adAccounts.value.filter((acc) => !sharedSelectedIds.value.includes(acc.id))
    setSelectedIds([])
  }
}

// --- Watchers to save settings ---
watch(
  [statusFilter, sortKey, sortOrder, currentPage, itemsPerPage, columnWidths],
  () => {
    settings.value = {
      statusFilter: statusFilter.value,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value,
      currentPage: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      columnWidths: columnWidths.value,
    }
    localStorage.setItem(TABLE_SETTINGS_KEY, JSON.stringify(settings.value))
  },
  { deep: true },
)

// Watch for changes in totalPages and adjust currentPage if it becomes invalid
watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = Math.max(1, newTotalPages)
  }
})
</script>

<style>
/* Base Styles */
.main-content.expanded {
  margin-right: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  #adPanel {
    width: 280px;
  }

  .main-content {
    margin-right: 280px;
    padding: 20px;
  }
}
</style>
