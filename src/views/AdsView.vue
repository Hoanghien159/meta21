<template>
  <DataViewLayout>
    <template #datatable>
      <ReloadModals modal-type="ads" @load-data="handleLoadData" />
      <!-- prettier-ignore -->
      <DataTable :columns="columns" :items="paginatedAccounts" :total-items="filteredAccounts.length" :sort-key="sortKey" @grid-ready="onGridReady"
        :sort-order="sortOrder" @sort="sortBy" selectable v-model:current-page="currentPage" :is-loading="isLoading" :row-data="adAccounts"
        v-model:items-per-page="itemsPerPage" :total-pages="totalPages" :column-widths="columnWidths"
        @reset-widths="resetColumnWidths"
        @update:column-widths="columnWidths = $event" :status-counts="statusCounts" v-model:status-filter="statusFilter" @click.stop >
        <template #cell(stt)="{ item }"> {{ item.stt }} </template>
        <template #cell(name)="{ item }">
          <div class=" d-flex align-items-center">
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
        <template #cell(automation_status)="{ item }">
          <span v-if="item.automation_status" class="status-badge" :class="getStatusClass(item.automation_status)">{{ item.automation_status }}</span>
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
      <AutomationPanel :features="adsPageFeatures" :items-on-page="paginatedAccounts" />
    </template>
  </DataViewLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import AutomationPanel from '@/components/AutomationPanel.vue'
import DataViewLayout from '@/components/DataViewLayout.vue'
import { useSelection } from '@/composables/useSelection'
import ReloadModals from '@/components/ReloadModals.vue'
import { useAutomationRunner } from '@/composables/useAutomationRunner'
import { usePageReloader } from '@/composables/usePageReloader'
import { useToast } from '@/composables/useToast'
import { useSettings } from '@/composables/useSettings'

const adsPageFeatures = ref([
{
    id: 'AccmanageSettings',
    title: 'Quản lý tài khoản',
    icon: 'ri-account-circle-line',
    settings: [{ id: 'addtogroup', label: 'Thêm vào nhóm', type: 'checkbox' },
      { id: 'removefromgroup', label: 'Xóa khỏi nhóm', type: 'checkbox' },
      { id: 'delfrombm', label: 'Xóa khỏi bm', type: 'checkbox' },
      { id: 'rename', label: 'Đổi tên', type: 'checkbox' },
      { id: 'newName', label: 'Tên mới', type: 'text', showIf: { id: 'rename', value: true }, class: 'full-width' },
      {
        type: 'container', // Đánh dấu đây là một container
        showIf: [
          { id: 'addtogroup', value: true },
          { id: 'removefromgroup', value: true },
        ],
        class: 'full-width-container', // Class cho container
        children: [ // Các trường con
          {
            id: 'btloadgroup',
            label: 'Load nhóm',
            type: 'button',
          },
          {
            id: 'slloadgroup',
            label: 'Chọn nhóm',
            type: 'select',
            options: [{ value: 'opt1', text: 'Lựa chọn 1' }, { value: 'opt2', text: 'Lựa chọn 2' }],
          },
          {
            id: 'btloaduser',
            label: 'load user',
            type: 'button',
          },
          {
            id: 'slloaduser',
            label: 'Chọn user',
            type: 'select',
            options: [{ value: 'opt1', text: 'Lựa chọn 1' }, { value: 'opt2', text: 'Lựa chọn 2' }],
          },
        ],
      },
    ],
  },

 {
    id: 'CampSetting',
    title: 'Set Campaign',
    icon: 'ri-bar-chart-fill',
    settings: [
      {
        type: 'container',
        class: 'full-width-container',
        children: [
          { id: 'cloneCD', label: 'Nhân CD có sẵn', type: 'checkbox' },
          { id: 'cloneInput', label: 'Số lượng', type: 'number' },
        ]
      },
       {
        type: 'container',
        class: 'full-width-container',
        children: [
          { id: 'delcamp', label: 'Xóa camp', type: 'checkbox' },
          { id: 'delcampInput', label: 'Số lượng', type: 'number' },
        ]
      },
       {
        type: 'container',
        class: 'full-width-container',
        children: [
         { id: 'adddraft', label: 'Nhân Nháp', type: 'checkbox' },
          { id: 'adddraftInput', label: 'Số lượng', type: 'number' },
        ]
      },

      { id: 'postCampaign', label: 'Đăng chiến dịch', type: 'checkbox' },
      { id: 'postGroup', label: 'Đăng nhóm', type: 'checkbox' },
      { id: 'postAd', label: 'Đăng quảng cáo', type: 'checkbox' },
      { id: 'enableAds', label: 'Bật ADS', type: 'checkbox' },
      { id: 'deleteDraft', label: 'Xóa nháp', type: 'checkbox' },
      { id: 'importPeDraft', label: 'Nhập nháp PE', type: 'checkbox' },
      {
        id: 'mainContent',
        label: '(IDs, Drafts...)',
        type: 'textarea',
        class: 'full-width',
      },
      {
        id: 'getDraft',
        label: 'Lấy nháp',
        type: 'button',
        class: 'half-width',
      },
      {
        id: 'editDraft',
        label: 'Edit nháp',
        type: 'button',
        class: 'half-width',
      },
    ],
  },
{
  id: 'EditCampaign',
  title: 'Edit Campaign',
  icon: 'ri-bar-chart-fill',
  settings: [
    { id: 'selectPostGroup', label: 'Campaign', type: 'select',  options: [{ value: 'opt1', text: 'Lựa chọn 1' }, { value: 'opt2', text: 'Lựa chọn 2' }], },
    {
      type: 'container',
      class: 'full-width-container',
      children: [
        { id: 'toggleCampaign', label: 'Chiến dịch', type: 'checkbox' },
        { id: 'toggleCampaignStatus', label: '(Tắt,Bật)', type: 'checkbox' },
      ]
    },
    {
      type: 'container',
      class: 'full-width-container',
      children: [
        { id: 'toggleGroup', label: 'Nhóm', type: 'checkbox' },
        { id: 'toggleGroupStatus', label: '(Tắt,Bật)', type: 'checkbox' },
      ]
    },
    {
      type: 'container',
      class: 'full-width-container',
      children: [
        { id: 'toggleAd', label: 'Quảng cáo', type: 'checkbox' },
        { id: 'toggleAdStatus', label: '(Tắt,Bật)', type: 'checkbox' },
      ]
    },
    { id: 'postCampaign', label: 'Đăng chiến dịch', type: 'checkbox' },
    { id: 'postGroup', label: 'Đăng nhóm', type: 'checkbox' },
    { id: 'selectPostGroup', label: 'Loại', type: 'select',  options: [{ value: 'opt1', text: 'Lựa chọn 1' }, { value: 'opt2', text: 'Lựa chọn 2' }], },
    { id: 'numberPostGroup', label: 'Số GS', type: 'number' },
  ],
},





  {
    id: 'createSettings',
    title: 'Tạo tài khoản',
    icon: 'ri-add-circle-line',
  },
  {
    id: 'tagSettings',
    title: 'Gắn thẻ tài khoản',
    icon: 'ri-price-tag-3-line',
    settings: [
      { id: 'tagName', label: 'Tên thẻ (tag)', type: 'text' },
      // Thêm 2 text inputs
      { id: 'textInput1', label: 'Text Input 1', type: 'text' },
      { id: 'textInput2', label: 'Text Input 2', type: 'text' },
      // Thêm 2 checkboxes
      { id: 'checkbox1', label: 'Checkbox 1', type: 'checkbox' },
      { id: 'checkbox2', label: 'Checkbox 2', type: 'checkbox' },
      // Thêm 2 selects
      { id: 'select1', label: 'Select 1', type: 'select', options: [{value: 'opt1', text: 'Lựa chọn 1'}, {value: 'opt2', text: 'Lựa chọn 2'}] },
      { id: 'select2', label: 'Select 2', type: 'select', options: [{value: 'a', text: 'Mục A'}, {value: 'b', text: 'Mục B'}] },
      // Thêm 2 buttons
      { id: 'button1', label: 'Button 1', type: 'button' },
      { id: 'button2', label: 'Button 2', type: 'button' },

    ],
  },
])

const columns = ref([
  { key: 'stt', label: 'STT', sortable: true, minWidth: 60, maxWidth: 100 },
  { key: 'status', label: 'Trạng thái', sortable: true, minWidth: 120 },
  { key: 'name', label: 'Tài khoản', sortable: true, minWidth: 250 },
  { key: 'id', label: 'ID TKQC', sortable: true, minWidth: 180 },
  { key: 'automation_status', label: 'Trạng thái chạy', sortable: false, minWidth: 150 },
  { key: 'balance', label: 'Số dư', sortable: true, minWidth: 120 }, // Đã có
  { key: 'threshold', label: 'Ngưỡng', sortable: true, minWidth: 150 },
  { key: 'remain', label: 'Ngưỡng còn lại', sortable: true, minWidth: 150 }, // Đã có
  { key: 'limit', label: 'Limit', sortable: true, minWidth: 120 },
  { key: 'spent', label: 'Tổng tiêu', sortable: true, minWidth: 150 },
  { key: 'currency', label: 'Tiền tệ', sortable: true, minWidth: 100 },
  { key: 'adminNumber', label: 'SL Admin', sortable: true, minWidth: 100 },
  { key: 'role', label: 'Quyền sở hữu', sortable: true, minWidth: 120 },
  { key: 'payment', label: 'Thanh toán', sortable: false, minWidth: 150 },
  { key: 'nextBillDate', label: 'Ngày lập HĐ', sortable: true, minWidth: 150 },
  { key: 'nextBillDay', label: 'Số ngày đến hạn TT', sortable: true, minWidth: 150 },
  { key: 'country', label: 'Quốc gia', sortable: true, minWidth: 100 },
  { key: 'reason', label: 'Lý do khóa', sortable: false, minWidth: 180 },
  { key: 'type', label: 'Loại', sortable: true, minWidth: 100 },
  { key: 'bm', label: 'BM', sortable: true, minWidth: 180 },
  { key: 'timezone', label: 'Múi giờ', sortable: true, minWidth: 180 },


])

const adAccounts = ref([])
const isLoading = ref(false)
const gridApi = ref(null) // Tham chiếu đến AG-Grid API

// --- State Management ---
const TABLE_SETTINGS_KEY = 'ads_table_settings'
const TABLE_DATA_KEY = 'ads_table_data' // Khóa mới để lưu dữ liệu bảng

function loadSettings() {
  const saved = localStorage.getItem(TABLE_SETTINGS_KEY)
  return saved ? JSON.parse(saved) : {}
}

const defaultColumnWidths = {
  stt: 60,
  name: 250,
  id: 165,
  status: 160,
  message: 200,
  balance: 120,
  threshold: 150,
  remain: 150,
  limit: 120,
  spent: 160,
  currency: 110,
  adminNumber: 100,
  role: 120,
  payment: 150,
  nextBillDate: 150,
  nextBillDay: 150,
  country: 100,
  reason: 180,
  type: 110,
  bm: 180,
  timezone: 180,
  automation_status: 150,
}

const { sharedSelectedIds, setSelectedIds } = useSelection()

const { loadData, showModal } = usePageReloader()
const { addToast } = useToast()

const settings = ref(loadSettings())

const statusFilter = ref(settings.value.statusFilter || '')
const sortKey = ref(settings.value.sortKey || 'spent')
const sortOrder = ref(settings.value.sortOrder || 'desc')
const currentPage = ref(settings.value.currentPage || 1)
const itemsPerPage = ref(settings.value.itemsPerPage || 10)
const columnWidths = ref(settings.value.columnWidths || { ...defaultColumnWidths })

const handleLoadData = async (settingsFromModal) => {
  isLoading.value = true
  adAccounts.value = [] // Xóa dữ liệu cũ
  try {
    // Truyền modal-type là 'ads'
    const data = await loadData('ads', settingsFromModal)
    if (data) {
      adAccounts.value = data
      localStorage.setItem(TABLE_DATA_KEY, JSON.stringify(data)) // Lưu dữ liệu vào localStorage
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu từ AdsView:', error)
    // Toast đã được hiển thị trong fbcode.js
  } finally {
    isLoading.value = false
  }
}

// --- Event Handling from Composables ---

const onGridReady = (params) => {
  gridApi.value = params.api
}

const handleUpdateAccountData = (event) => {
  if (gridApi.value) {
    gridApi.value.applyTransaction({
      update: [event.detail],
    })
  }
  const accountId = event.detail.id;
  const accountIndex = adAccounts.value.findIndex(acc => acc.id === accountId);
  if (accountIndex !== -1) {
    // Cập nhật dữ liệu trong mảng ref
    adAccounts.value[accountIndex] = { ...adAccounts.value[accountIndex], ...event.detail };
    // Ép Vue cập nhật lại computed properties
    adAccounts.value = [...adAccounts.value];
    // Lưu trạng thái mới nhất của mảng vào localStorage
    localStorage.setItem(TABLE_DATA_KEY, JSON.stringify(adAccounts.value));
  }
}

const handleUpdateRow = (event) => {
  if (gridApi.value) {
    const rowNode = gridApi.value.getRowNode(event.detail.id)
    if (rowNode) {
      rowNode.setDataValue(event.detail.field, event.detail.value)
    }
  }
}

const handleAddAccount = (event) => {
  if (gridApi.value) {
    gridApi.value.applyTransaction({
      add: event.detail,
    })
  } else {
    // Nếu grid chưa sẵn sàng, chỉ cần thêm vào mảng dữ liệu
    adAccounts.value.push(...event.detail);
  }
}

onMounted(() => {
  // Thử tải dữ liệu từ localStorage trước
  const savedData = localStorage.getItem(TABLE_DATA_KEY)
  if (savedData && JSON.parse(savedData).length > 0) {
    adAccounts.value = JSON.parse(savedData)
    addToast('Đã tải dữ liệu tài khoản từ phiên làm việc trước.', 'info')
  } else {
    // Nếu không có dữ liệu đã lưu, tự động mở modal để người dùng tải dữ liệu mới
    addToast('Không tìm thấy dữ liệu đã lưu. Vui lòng tải dữ liệu mới.', 'info')
    showModal('ads')
  }

  // Lắng nghe các sự kiện từ fbcode.js để cập nhật giao diện
  document.addEventListener('updateAccountData', handleUpdateAccountData)
  document.addEventListener('updateRow', handleUpdateRow)
  document.addEventListener('addAccount', handleAddAccount)
})

onUnmounted(() => {
  // Dọn dẹp listeners khi component bị hủy để tránh rò rỉ bộ nhớ
  document.removeEventListener('updateAccountData', handleUpdateAccountData)
  document.removeEventListener('updateRow', handleUpdateRow)
  document.removeEventListener('addAccount', handleAddAccount)
})


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

function resetColumnWidths() {
  columnWidths.value = { ...defaultColumnWidths }
}

function deleteSelected() {
  if (confirm(`Bạn có chắc muốn xóa ${sharedSelectedIds.value.length} tài khoản đã chọn?`)) {
    adAccounts.value = adAccounts.value.filter((acc) => !sharedSelectedIds.value.includes(acc.id))
    setSelectedIds([]) // Reset lựa chọn
  }
}

// --- Automation Logic ---
const { registerTask, sleep } = useAutomationRunner()

function getStatusClass(status) {
  if (status === 'Đang chạy') return 'status-leave'
  if (status === 'Thành công') return 'status-active'
  if (status === 'Thất bại') return 'status-inactive'
  return ''
}

const renameAccount = async (account, newName, delay) => {
  if (account) {
    try {
      account.automation_status = 'Đang chạy';
      // Lưu lại trạng thái "Đang chạy"

      // Giả lập một tác vụ bất đồng bộ
      await sleep(delay)
      account.name = `${newName} - ${account.id.slice(-4)}`
      account.automation_status = 'Thành công';
      console.log(`Đã đổi tên tài khoản ${account.id} thành công.`)
    } catch (error) {
      account.automation_status = 'Thất bại';

      console.error(`Lỗi khi đổi tên tài khoản ${account.id}:`, error)
    }
    localStorage.setItem(TABLE_DATA_KEY, JSON.stringify(adAccounts.value));
  }
}

registerTask('AccmanageSettings', async ({ itemId, settings, delay }) => {
  // Chỉ thực hiện đổi tên nếu checkbox 'rename' được chọn
  if (!settings.rename) return;

  const newName = settings.newName
  // Kiểm tra newName đã được thực hiện ở AutomationPanel,
  // nhưng chúng ta có thể kiểm tra lại ở đây để chắc chắn.
  if (!newName) {
    console.error('Tên mới là bắt buộc cho tác vụ đổi tên.');
    const accountToUpdate = adAccounts.value.find((acc) => acc.id === itemId);
    if (accountToUpdate) accountToUpdate.automation_status = 'Thất bại';
    return;
  }
  const account = adAccounts.value.find((acc) => acc.id === itemId);
  await renameAccount(account, newName, delay);
})

// 2. Viết hàm xử lý logic chính
const tagAccount = async (account, tagName, delay) => {
  if (account) {
    try {
      account.automation_status = 'Đang chạy';
      await sleep(delay); // Giả lập gọi API

      // Logic thêm thẻ: ở đây ta chỉ thêm vào một trường 'tags' cho đơn giản
      if (!account.tags) account.tags = [];
      if (!account.tags.includes(tagName)) {
        account.tags.push(tagName);
      }
      account.automation_status = 'Thành công';
      console.log(`Đã gắn thẻ '${tagName}' cho tài khoản ${account.id}.`);
    } catch (error) {
      account.automation_status = 'Thất bại';
      console.error(`Lỗi khi gắn thẻ cho tài khoản ${account.id}:`, error);
    }
    // Cập nhật lại localStorage sau khi thay đổi
    localStorage.setItem(TABLE_DATA_KEY, JSON.stringify(adAccounts.value));
  }
};

// 3. Đăng ký hàm xử lý với ID tương ứng từ bước 1
registerTask('tagSettings', async ({ itemId, settings, delay }) => {
  const tagName = settings.tagName;
  if (!tagName) {
    console.error('Tên thẻ là bắt buộc.');
    // Cập nhật trạng thái thất bại cho dòng này
    const account = adAccounts.value.find((acc) => acc.id === itemId);
    if (account) account.automation_status = 'Thất bại';
    return;
  }
  const account = adAccounts.value.find((acc) => acc.id === itemId);
  await tagAccount(account, tagName, delay);
});

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
