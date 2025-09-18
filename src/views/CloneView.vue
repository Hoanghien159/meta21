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
        <template #cell(info)="{ item }">
          {{ item.info }}
        </template>
      </DataTable>
    </template>
  </DataViewLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DataTable from '@/components/DataTable.vue'
import DataViewLayout from '@/components/DataViewLayout.vue'
import { useSelection } from '@/composables/useSelection'

const columns = ref([
  { key: 'stt', label: 'STT', sortable: true },
  { key: 'name', label: 'Tên', sortable: true },
  { key: 'id', label: 'UID', sortable: true },
  { key: 'status', label: 'Trạng thái', sortable: true },
  { key: 'info', label: 'Thông tin', sortable: true },
])

const cloneAccounts = ref([
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `1000${String(Math.random()).slice(2, 14)}`,
    name: `Người dùng Clone ${i + 1}`,
    status: i % 4 === 0 ? 'Đã clone' : i % 4 === 1 ? 'Đang chờ' : 'Lỗi',
    info: `Thông tin clone mẫu ${i + 1}`,
    statusClass: i % 4 === 0 ? 'status-active' : i % 4 === 1 ? 'status-leave' : 'status-inactive',
  })),
])

// --- State Management ---
const TABLE_SETTINGS_KEY = 'clone_table_settings'

function loadSettings() {
  const saved = localStorage.getItem(TABLE_SETTINGS_KEY)
  return saved ? JSON.parse(saved) : {}
}

const { sharedSelectedIds, setSelectedIds } = useSelection()

const settings = ref(loadSettings())

const statusFilter = ref(settings.value.statusFilter || '')
const sortKey = ref(settings.value.sortKey || 'stt')
const sortOrder = ref(settings.value.sortOrder || 'asc')
const currentPage = ref(settings.value.currentPage || 1)
const itemsPerPage = ref(settings.value.itemsPerPage || 10)
const columnWidths = ref(
  settings.value.columnWidths || {
    stt: 60,
    name: 350,
    id: 180,
    status: 150,
    info: 200,
  },
)

// --- Computed Properties ---

const filteredAccounts = computed(() => {
  if (!statusFilter.value) {
    return cloneAccounts.value
  }
  return cloneAccounts.value.filter((acc) => acc.status === statusFilter.value)
})

const statusCounts = computed(() => {
  return cloneAccounts.value.reduce((acc, account) => {
    acc[account.status] = (acc[account.status] || 0) + 1
    return acc
  }, {})
})

const totalPages = computed(() => {
  return Math.ceil(filteredAccounts.value.length / itemsPerPage.value)
})

const sortedAccounts = computed(() => {
  const accountsWithStt = filteredAccounts.value.map((acc, index) => ({ ...acc, stt: index + 1 }))
  return [...accountsWithStt].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    let modifier = sortOrder.value === 'asc' ? 1 : -1
    if (typeof valA === 'number' && typeof valB === 'number') return (valA - valB) * modifier
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
  if (confirm(`Bạn có chắc muốn xóa ${sharedSelectedIds.value.length} mục đã chọn?`)) {
    cloneAccounts.value = cloneAccounts.value.filter(
      (acc) => !sharedSelectedIds.value.includes(acc.id),
    )
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

watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = Math.max(1, newTotalPages)
  }
})
</script>
