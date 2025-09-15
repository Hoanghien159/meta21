<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    @click.self="close"
  >
    <!-- Popup content -->
    <div
      :class="['bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[68vh] flex flex-col transform transition-all duration-300', { 'scale-100 opacity-100': showContent, 'scale-95 opacity-0': !showContent }]"
      id="popupContent"
    >
      <!-- Header cố định -->
      <div
        class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-xl flex-shrink-0"
      >
        <h2 class="text-xl font-semibold text-white">Cài đặt tải dữ liệu TKQC</h2>
        <button @click="close" id="closePopupBtn" class="text-white hover:text-gray-200 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Nội dung có thể cuộn -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-6 space-y-6">
          <!-- Phương thức tải dữ liệu -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 text-sm">Phương thức tải dữ liệu</h3>

            <div class="bg-blue-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-4">
              <!-- Tải toàn bộ -->
              <div class="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="loadMethod" value="all" v-model="loadMethod" class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Tải toàn bộ</span>
                </label>
                <div class="pl-7 mt-1">
                  <p class="relative pl-5 text-xs text-gray-500 dark:text-gray-400">
                    <span class="absolute left-0 top-1.5 w-3 h-px bg-gray-300 dark:bg-gray-600"></span><span class="absolute left-0 -top-0.5 w-px h-3 bg-gray-300 dark:bg-gray-600"></span>Tải tất cả dữ liệu có sẵn
                  </p>
                </div>
              </div>

              <!-- Tải theo ID -->
              <div class="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="loadMethod" value="byId" v-model="loadMethod" class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Tải theo ID</span>
                </label>
                <div class="pl-7 mt-1">
                  <p class="relative pl-5 text-xs text-gray-500 dark:text-gray-400">
                    <span class="absolute left-0 top-1.5 w-3 h-px bg-gray-300 dark:bg-gray-600"></span><span class="absolute left-0 -top-0.5 w-px h-3 bg-gray-300 dark:bg-gray-600"></span>Nhập danh sách ID cụ thể
                  </p>
                </div>
                <div v-if="loadMethod === 'byId'" id="idListContainer" class="mt-3">
                  <textarea
                    id="idList"
                    placeholder="Nhập danh sách ID, mỗi ID một dòng..."
                    class="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                  ></textarea>
                </div>
              </div>

              <!-- Tải theo ID BM -->
              <div class="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="loadMethod" value="byBmId" v-model="loadMethod" class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Tải theo danh sách ID BM</span>
                </label>
                <div class="pl-7 mt-1">
                  <p class="relative pl-5 text-xs text-gray-500 dark:text-gray-400">
                    <span class="absolute left-0 top-1.5 w-3 h-px bg-gray-300 dark:bg-gray-600"></span><span class="absolute left-0 -top-0.5 w-px h-3 bg-gray-300 dark:bg-gray-600"></span>Nhập ID Business Manager
                  </p>
                <div v-if="loadMethod === 'byBmId'" id="bmIdListContainer" class="mt-3">
                  <textarea
                    id="bmIdList"
                    placeholder="Nhập danh sách ID BM, mỗi ID một dòng..."
                    class="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                  ></textarea>
                </div>
                </div>
              </div>

              <!-- Tải theo BM -->
              <div class="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="loadMethod" value="byBm" v-model="loadMethod" class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Tải theo BM</span>
                </label>
                <div class="pl-7 mt-1">
                  <p class="relative pl-5 text-xs text-gray-500 dark:text-gray-400">
                    <span class="absolute left-0 top-1.5 w-3 h-px bg-gray-300 dark:bg-gray-600"></span><span class="absolute left-0 -top-0.5 w-px h-3 bg-gray-300 dark:bg-gray-600"></span>Chọn từ danh sách Business Manager
                  </p>
                </div>
                <div v-if="loadMethod === 'byBm'" id="bmSelectContainer" class="mt-3">
                  <div class="flex space-x-2">
                    <select
                      id="bmSelect"
                      class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                    >
                      <option value="">Chọn Business Manager...</option>
                      <option value="bm1">BM Marketing Team (ID: 123456)</option>
                      <option value="bm2">BM Sales Division (ID: 789012)</option>
                      <option value="bm3">BM Global Campaigns (ID: 345678)</option>
                    </select>
                    <button id="loadBmBtn" class="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/60 transition-colors font-medium">
                      Load BM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Đường phân cách -->
          <div class="border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Cài đặt dữ liệu -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 text-sm">Cài đặt dữ liệu</h3>

            <div class="bg-blue-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-4">
              <!-- Toggle theo hàng ngang -->
              <div class="grid grid-cols-2 gap-3">
                <!-- Toggle cho Tài khoản ẩn -->
                <div class="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between" @click="hiddenAccounts = !hiddenAccounts">
                  <label for="hiddenAccountsToggle" class="cursor-pointer">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Tài khoản ẩn</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 block">Bao gồm tài khoản ẩn</span>
                  </label>
                  <button
                    id="hiddenAccountsToggle"
                    @click.stop="hiddenAccounts = !hiddenAccounts"
                    :class="hiddenAccounts ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span :class="hiddenAccounts ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"></span>
                  </button>
                </div>

                <!-- Toggle cho Thanh toán -->
                <div class="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between" @click="includePayment = !includePayment">
                  <label for="paymentToggle" class="cursor-pointer">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Thanh toán</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 block">Bao gồm thông tin thanh toán</span>
                  </label>
                  <button
                    id="paymentToggle"
                    @click.stop="includePayment = !includePayment"
                    :class="includePayment ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span :class="includePayment ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"></span>
                  </button>
                </div>
              </div>

              <!-- Số trang -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Số trang</label>
                    <span class="text-xs text-gray-500 dark:text-gray-400">Giới hạn số trang tải về</span>
                  </div>
                  <input type="number" id="pageCount" value="500" min="1" max="10000" class="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
                </div>
              </div>
            </div>
          </div>

          <!-- Nút chức năng -->
          <div class="flex space-x-3 pt-2">
            <button id="loadDataBtn" class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Tải dữ liệu
            </button>
                <button @click="close" id="cancelBtn" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>

      <!-- Progress bar (ẩn ban đầu) -->
      <div id="progressContainer" class="hidden px-6 pb-6 flex-shrink-0 dark:bg-gray-800 rounded-b-xl">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div id="progressBar" class="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300 ease-out" style="width: 0%"></div>
        </div>
        <p id="progressText" class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">Đang tải dữ liệu...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close'])

// --- Popup visibility and animation state ---
const loadMethod = ref('all') // 'all', 'byId', 'byBmId', 'byBm'
const hiddenAccounts = ref(false)
const includePayment = ref(false)

const showContent = ref(false)

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    // Open popup
    document.addEventListener('keydown', handleEsc);
    nextTick(() => { // Đảm bảo DOM đã được cập nhật
      showContent.value = true
    });
  } else {
    // Close popup
    showContent.value = false;
    document.removeEventListener('keydown', handleEsc);
  }
})

const close = () => {
  showContent.value = false
  setTimeout(() => {
    emit('close');
  }, 300) // Match transition duration
}

const handleEsc = (e) => {
  if (e.key === 'Escape') {
    close()
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc);
})
</script>
