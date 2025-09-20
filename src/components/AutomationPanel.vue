<template>
  <!-- Container cho Automation Panel và nút thu gọn -->
  <div
    id="automation-container"
    :class="{ 'is-collapsed': isCollapsed }"
    style="position: relative; display: flex; align-items: flex-start"
  >
    <div class="fold-button" @click="togglePanel">
      <i :class="isCollapsed ? 'ri-arrow-left-line' : 'ri-arrow-right-line'"></i>
    </div>
    <div id="adPanel" class="ad-panel">
      <div class="panel-header">
        <h4><i class="ri-settings-3-line me-2"></i>Automation Panel</h4>
      </div>

      <div class="cards-container">
        <!-- Loop through features and render cards dynamically -->
        <div v-for="feature in features" :key="feature.id" class="feature-card">
          <div class="underline-slide card-header">
            <h6 class="card-title">
              <div class="card-icon" :class="getIconBgClass(feature.id)">
                <i :class="feature.icon"></i>
              </div>
              {{ feature.title }}
            </h6>
            <label class="toggle-switch">
              <input
                type="checkbox"
                @change="
                  feature.settings
                    ? toggleSettings($event, feature.id)
                    : handleToggle($event, feature.id)
                "
              />
              <span class="slider"></span>
            </label>
          </div>
          <div v-if="feature.settings && feature.settings.length > 0" class="card-settings" :id="feature.id">
            <div v-if="feature.settings && feature.settings.length > 0" class="settings-grid">
              <template v-for="setting in feature.settings" :key="setting.id">
                <!-- Nếu là container, render các children bên trong -->
                <div v-if="setting.type === 'container' && shouldShowSetting(setting)" :class="setting.class">
                  <template v-for="child in setting.children" :key="child.id">
                    <div class="setting-item" :class="child.class">
                      <!-- Sao chép logic render từ bên ngoài vào đây -->
                      <div v-if="!['checkbox', 'select', 'button'].includes(child.type)" class="floating-input">
                        <input :type="child.type" placeholder=" " :id="child.id" :min="child.min" v-model="settingsValues[child.id]" />
                        <label :for="child.id">{{ child.label }}</label>
                      </div>
                      <div v-else-if="child.type === 'checkbox'" class="form-check form-switch custom-checkbox-setting">
                        <input class="form-check-input" type="checkbox" role="switch" :id="child.id" v-model="settingsValues[child.id]" />
                        <label class="form-check-label" :for="child.id">{{ child.label }}</label>
                      </div>
                      <div v-else-if="child.type === 'select'" class="floating-input">
                        <select :id="child.id" v-model="settingsValues[child.id]" class="form-select" @change="handleSelectChange">
                          <option v-for="option in child.options" :key="option.id" :value="option.id">{{ option.value }}</option>
                        </select>
                        <label :for="child.id">{{ child.label }}</label>
                      </div>
                      <button v-else-if="child.type === 'button'" class="underline-slide btn btn-secondary fw-bold shadow-sm settings-btn">
                        {{ child.label }}
                      </button>
                    </div>
                  </template>
                </div>

                <!-- Nếu không phải container, render như bình thường -->
                <div v-else-if="setting.type !== 'container' && shouldShowSetting(setting)" class="setting-item" :class="[{ 'w-100': setting.type === 'button' && !setting.class }, setting.class]">
                  <div v-if="setting.type === 'label'" class="static-label">
                    <span>{{ setting.label }}</span>
                  </div>
                  <div v-else-if="!['checkbox', 'select', 'button', 'label'].includes(setting.type)" class="floating-input">
                    <input :type="setting.type" placeholder=" " :id="setting.id" :min="setting.min" v-model="settingsValues[setting.id]" />
                    <label :for="setting.id">{{ setting.label }}</label>
                  </div>
                  <div v-else-if="setting.type === 'checkbox'" class="form-check form-switch custom-checkbox-setting">
                    <input class="form-check-input" type="checkbox" role="switch" :id="setting.id" v-model="settingsValues[setting.id]" />
                    <label class="form-check-label" :for="setting.id">{{ setting.label }}</label>
                  </div>
                  <div v-else-if="setting.type === 'select'" class="floating-input">
                    <select :id="setting.id" v-model="settingsValues[setting.id]" class="form-select" @change="handleSelectChange">
                      <option v-for="option in setting.options" :key="option.id" :value="option.id">{{ option.value }}</option>
                    </select>
                    <label :for="setting.id">{{ setting.label }}</label>
                  </div>
                  <button v-else-if="setting.type === 'button'" class="underline-slide btn btn-secondary fw-bold shadow-sm settings-btn">
                    {{ setting.label }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="control-panel">
        <div class="control-buttons">
          <button class="underline-slide btn-start" id="startBtn" @click="startAutomation">
            <i class="ri-play-fill"></i>
            Bắt đầu
          </button>
          <button class="underline-slide btn-stop" id="stopBtn" @click="stopAutomation">
            <i class="ri-stop-fill"></i>
            Dừng lại
          </button>
        </div>

        <div class="control-inputs">
          <div class="floating-input" style="flex: 1">
            <input type="number" placeholder=" " id="threads" min="1" value="1" />
            <label for="threads">Luồng</label>
          </div>
          <div class="floating-input" style="flex: 1">
            <input type="number" placeholder=" " id="delay" min="0" value="1000" />
            <label for="delay">Delay (ms)</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, defineProps, ref, watch } from 'vue'
import { sharedSelectedIds } from '@/composables/useSelection'
import { useAutomation } from '@/composables/useAutomation'
import { useToast } from '@/composables/useToast'
import TomSelect from 'tom-select/dist/js/tom-select.complete.min.js'
import 'tom-select/dist/css/tom-select.bootstrap5.min.css'


const props = defineProps({
  features: {
    type: Array,
    required: true,
  },
  itemsOnPage: {
    type: Array,
    default: () => [],
  },
})

const { emit: emitAutomation, on: onAutomation } = useAutomation()
const { addToast } = useToast()

const tomSelectInstances = ref({})

const settingsValues = ref({})

// Khởi tạo giá trị cho settingsValues khi features thay đổi
watch(
  () => props.features,
  (newFeatures) => {
    const initialValues = {}
    newFeatures.forEach((feature) => {
      if (feature.settings) {
        feature.settings.forEach((setting) => {
          if (setting.type === 'container' && setting.children) {
            setting.children.forEach(child => {
              initialValues[child.id] = child.type === 'checkbox' ? false : '';
            });
          }
          initialValues[setting.id] = setting.type === 'checkbox' ? false : ''
        })
      }
    })
    settingsValues.value = initialValues
  },
  { immediate: true, deep: true },
)

watch(
  settingsValues,
  (newValues) => {
    console.log('Settings changed:', newValues);
  }, { deep: true }
);

const isCollapsed = ref(false)

function getIconBgClass(featureId) {
  if (featureId.toLowerCase().includes('create')) {
    return 'icon-bg-bm' // Blue for create
  }
  if (featureId.toLowerCase().includes('rename')) {
    return 'icon-bg-page' // Purple for rename
  }
  if (featureId.toLowerCase().includes('share')) {
    return 'icon-bg-share' // Yellow for share
  }
  if (featureId.toLowerCase().includes('accept') || featureId.toLowerCase().includes('add')) {
    return 'icon-bg-ads' // Green for accept/add
  }
  return 'icon-bg-danger' // Red for others like 'out'
}
function togglePanel() {
  isCollapsed.value = !isCollapsed.value
}

function shouldShowSetting(setting) {
  if (!setting.showIf) {
    return true; // Luôn hiển thị nếu không có điều kiện
  }

  if (Array.isArray(setting.showIf)) {
    // Xử lý điều kiện OR: chỉ cần một điều kiện đúng
    return setting.showIf.some(condition => settingsValues.value[condition.id] === condition.value);
  } else {
    // Xử lý điều kiện đơn như cũ
    return settingsValues.value[setting.showIf.id] === setting.showIf.value;
  }
}

function toggleSettings(event, settingsId) {
  const settings = document.getElementById(settingsId)
  if (event.target.checked) {
    settings.classList.add('active')
  } else {
    settings.classList.remove('active')
  }
}

function handleToggle(event, action) {
  if (event.target.checked) {
    console.log(`${action} feature activated`)
  } else {
    console.log(`${action} feature deactivated`)
  }
}

function startAutomation() {
  const startBtn = document.getElementById('startBtn')
  const stopBtn = document.getElementById('stopBtn')
  const threads = document.getElementById('threads').value
  const delay = document.getElementById('delay').value

  const checkboxes = document.querySelectorAll('.toggle-switch input[type="checkbox"]')
  const activeFeatures = []

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const card = checkbox.closest('.feature-card')
      const featureId = card.querySelector('.card-settings')?.id
      const feature = props.features.find((f) => f.id === featureId)
      if (feature) {
        const settings = {}
        if (feature.settings) {
          feature.settings.forEach((setting) => {
            settings[setting.id] = settingsValues.value[setting.id]
          })
        }

        // **VALIDATION LOGIC**
        // Kiểm tra các trường bắt buộc cho từng tính năng đang hoạt động
        if (feature.id === 'renameSettings' && !settings.newPageName) {
          addToast('Vui lòng nhập tên mới cho tính năng "Đổi tên tài khoản"!', 'error')
          return // Dừng lại nếu thiếu thông tin
        }
        // Validation cho AccmanageSettings
        if (feature.id === 'AccmanageSettings' && settings.rename && !settings.newName) {
          addToast('Vui lòng nhập "Tên mới" khi chọn "Đổi tên"!', 'error')
          return
        }
        // Thêm các kiểm tra khác cho các tính năng khác ở đây nếu cần
        // Ví dụ: if (feature.id === 'shareSettings' && !settings.shareId) { ... }

        activeFeatures.push({ id: feature.id, settings })
      }
    }
  })
  const tagFeature = activeFeatures.find(f => f.id === 'tagSettings');
    if (tagFeature && !tagFeature.settings.tagName) {
      addToast('Vui lòng nhập tên thẻ cho tính năng "Gắn thẻ tài khoản"!', 'error');
      return;
    }

  if (activeFeatures.length === 0) {
    addToast('Vui lòng chọn ít nhất một tính năng để bắt đầu!', 'warning')
    return
  }

  if (sharedSelectedIds.value.length === 0) {
    addToast('Vui lòng chọn ít nhất một dòng trong bảng để thực hiện!', 'warning')
    return
  }

  // Sắp xếp lại các ID đã chọn theo thứ tự xuất hiện trên trang hiện tại
  const sortedSelectedIds = props.itemsOnPage
    .map((item) => item.id)
    .filter((id) => sharedSelectedIds.value.includes(id))

  // Nếu không có mục nào được chọn trên trang hiện tại, sử dụng danh sách gốc (mặc dù trường hợp này ít xảy ra nếu có validation)
  const finalSelectedIds = sortedSelectedIds.length > 0 ? sortedSelectedIds : sharedSelectedIds.value

  startBtn.style.display = 'none'
  stopBtn.style.display = 'flex'

  // Đây là nơi bạn có thể truy cập các dòng đã chọn
  const payload = {
    selectedIds: finalSelectedIds,
    features: activeFeatures,
    threads: parseInt(threads, 10),
    delay: parseInt(delay, 10),
  }

  console.log('Starting automation with payload:', payload)
  emitAutomation('start', payload)
}

function stopAutomation() {
  // Chỉ phát tín hiệu dừng, không thay đổi UI ở đây.
  // UI sẽ được cập nhật khi nhận được sự kiện 'end'.
  emitAutomation('stop')
  console.log('Stop signal sent to automation runner.')
  addToast('Đã gửi yêu cầu dừng. Hệ thống sẽ dừng sau khi hoàn tất các tác vụ đang chạy.', 'info')
}

const handleAutomationEnd = () => {
  const startBtn = document.getElementById('startBtn')
  const stopBtn = document.getElementById('stopBtn')
  startBtn.style.display = 'flex'
  stopBtn.style.display = 'none'
  console.log('Automation process has fully ended.')
}

const handleSelectChange = (event) => {
  if (event.target.value) {
    event.target.setAttribute('data-filled', 'true')
  } else {
    event.target.removeAttribute('data-filled')
  }
}

const unsubscribeEnd = onAutomation('end', handleAutomationEnd)

onUnmounted(() => {
  unsubscribeEnd() // Hủy đăng ký lắng nghe sự kiện khi component bị hủy
})

const initializeTomSelect = () => {
  // Hủy các instance cũ trước khi tạo mới
  Object.values(tomSelectInstances.value).forEach((instance) => instance.destroy())
  tomSelectInstances.value = {}

  const createTomSelect = (setting) => {
    if (setting.searchable) {
      const el = document.getElementById(setting.id)
      if (el && !el.tomselect) {
        const ts = new TomSelect(el, {
          dropdownParent: 'body',
          plugins: ['dropdown_input'],
          create: false,
          sortField: {
            field: 'text',
            direction: 'asc',
          },
          placeholder: setting.label,
        })

        // Thêm class vào thẻ cha để ẩn label gốc bằng CSS
        const parentFloatingInput = el.closest('.floating-input')
        if (parentFloatingInput) {
          parentFloatingInput.classList.add('tom-select-initialized')
        }
        // Thêm listener để xử lý việc thêm/xóa class khi có giá trị
        ts.on('change', (value) => {
          const wrapper = ts.wrapper
          if (value) {
            wrapper.classList.add('has-value')
          } else {
            wrapper.classList.remove('has-value')
          }
        })
      }
    }
  }

  props.features.forEach((feature) => {
    if (feature.settings) {
      feature.settings.forEach((setting) => {
        if (setting.type === 'container' && setting.children) {
          setting.children.forEach(createTomSelect)
        } else if (setting.type === 'select') {
          createTomSelect(setting)
        }
      })
    }
  })
}

// Khởi tạo TomSelect khi component được mounted và khi các features thay đổi
watch(
  () => props.features,
  () => {
    // nextTick đảm bảo rằng DOM đã được cập nhật trước khi khởi tạo TomSelect
    onMounted(initializeTomSelect)
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  const inputs = document.querySelectorAll('.floating-input input, .floating-input select')
  inputs.forEach((input) => {
    if (input.value) {
      input.setAttribute('data-filled', 'true')
    }

    input.addEventListener('input', function () {
      if (this.value) {
        this.setAttribute('data-filled', 'true')
      } else {
        this.removeAttribute('data-filled')
      }
    })

    // Thêm sự kiện change cho select để đảm bảo data-filled được cập nhật
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', function () {
        this.setAttribute('data-filled', 'true')
      })
    }
  })
})
</script>

<style scoped>
/* Panel Container */
#adPanel {
  position: static;
  right: 0;
  top: 0;
  width: 340px;
  height: calc(100% - 20px);
  margin: 10px 0;
  display: flex; /* This will be overridden by flex-shrink */
  flex-direction: column;
  transition: transform 0.3s ease;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1000;
}

#automation-container.is-collapsed #adPanel {
  width: 0;
}

/* Fold Button */
.fold-button {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  height: 40px;
  border-radius: 6px 0 0 6px;
  border-right: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;
  flex-shrink: 0;
}
.settings-grid {
  display: flex;
  flex-wrap: wrap;
  /* gap: 15px; Khoảng cách đều giữa các item */
row-gap: 10px;
/* column-gap: 30px; */
  align-items: center;
}
.setting-item {
  flex: 1 1 calc(50% - 8px); /* Mỗi item chiếm khoảng 50% chiều rộng, trừ đi gap */
}

.setting-item.half-width {
  flex-basis: calc(50% - 5px); /* Đảm bảo 2 item nằm trên 1 hàng */
  padding-right: 5px;
}

.setting-item.full-width {
  flex-basis: 100%;
}

.full-width-container {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap; /* Cho phép các item xuống hàng */
  row-gap: 10px; /* Khoảng cách giữa các hàng */
  column-gap: 10px; /* Khoảng cách giữa các cột */
  align-items: center; /* Căn chỉnh các item con theo chiều dọc */
}

.full-width-container > .setting-item {
  flex: 1 1 calc(50% - 5px); /* Mỗi item con chiếm 50% chiều rộng của container */
  min-width: 120px; /* Đảm bảo không bị co quá nhỏ */
}

.full-width-container .floating-input {
  margin-bottom: 0; /* Bỏ margin-bottom của floating-input bên trong container */
}

.setting-item.full-width .floating-input {
  margin-bottom: 0;
}


/* Panel Header */
.panel-header {
  padding: 15px;
  text-align: center;
}

.panel-header h4 {
  margin: 0;
  font-weight: 600;
}

/* Cards Container */
.cards-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

/* Feature Cards */
.feature-card {
  border-radius: 12px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  overflow: hidden; /* Đảm bảo bo tròn góc được áp dụng cho card-header bên trong */
}

.card-header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Đường viền mỏng hơn */
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-weight: 600;
}

/* Card Icons */
.card-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider:before {
  transform: translateX(24px);
}

/* Card Settings */
.card-settings {
  padding: 10px;
  display: none;
}

.card-settings.active {
  display: block;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Floating Input */
.floating-input {
  position: relative;
  margin-bottom: 20px;
}

.floating-input input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.floating-input label {
  position: absolute;
  left: 15px;
  top: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.floating-input input:focus + label,
.floating-input input:not(:placeholder-shown) + label,
.floating-input select[data-filled='true'] + label {
  top: -8px;
  left: 10px;
  font-size: 12px;
  padding: 0 5px;
}
/* Custom style cho checkbox setting */
.custom-checkbox-setting {
  padding-left: 2.5em; /* Tăng khoảng cách để không bị chồng chéo */
  margin-bottom: 0; /* Bỏ margin-bottom để grid quản lý */
}

.setting-button {
  margin-bottom: 10px;
}
/* Ẩn label gốc khi TomSelect đã được khởi tạo */
.floating-input.tom-select-initialized > label {
  display: none !important;
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-start, .btn-stop {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-start {
  background: linear-gradient(145deg, #34d399, #28a745);
  color: white;
  border: 1px solid #28a745;
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
}

.btn-start:hover {
  background: #27ae60;
  transform: translateY(-2px);
}

.btn-stop {
  background: linear-gradient(145deg, #ef4444, #dc3545);
  color: white;
  display: none;
  border: 1px solid #dc3545;
}

.btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
}

.control-inputs {
  display: flex;
  gap: 15px;
}

/* --- Dark Theme Styles --- */
[data-bs-theme='dark'] #adPanel {
  background: rgba(30, 35, 46, 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    -5px -5px 10px rgba(50, 58, 77, 0.5),
    5px 5px 10px rgba(18, 21, 28, 0.5);
}

[data-bs-theme='dark'] .fold-button {
  background: #2f333d;
  border: 1px solid #444857;
  color: white;
}

[data-bs-theme='dark'] .fold-button:hover {
  background: #3c414b;
}

[data-bs-theme='dark'] .panel-header {
  background: rgba(47, 51, 61, 0.5);
  color: white;
}

[data-bs-theme='dark'] .feature-card {
  background: rgba(47, 51, 61, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-bs-theme='dark'] .feature-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

[data-bs-theme='dark'] .card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

[data-bs-theme='dark'] .card-title {
  color: #a0aec0;
}

[data-bs-theme='dark'] .slider {
  background-color: #495057;
}

[data-bs-theme='dark'] input:checked + .slider {
  background-color: #667eea;
}

[data-bs-theme='dark'] .card-settings {
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

[data-bs-theme='dark'] .floating-input input {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(47, 51, 61, 0.7);
  color: #dee2e6;
}

[data-bs-theme='dark'] .floating-input input:focus {
  outline: none;
  border-color: #667eea;
  background: #3c414b;
}

[data-bs-theme='dark'] .floating-input label {
  color: #6c757d;
}

[data-bs-theme='dark'] .floating-input input:focus + label,
[data-bs-theme='dark'] .floating-input input:not(:placeholder-shown) + label,
[data-bs-theme='dark'] .floating-input select[data-filled='true'] + label {
  color: #667eea;
  background: #272b34;
}

[data-bs-theme='dark'] .static-label span {
  color: #a0aec0; /* Màu xám sáng, dễ đọc hơn */
}

[data-bs-theme='dark'] .control-panel {
  padding: 20px;
}

/* Cải thiện màu chữ cho TomSelect trên nền tối */
[data-bs-theme='dark'] .ts-control,
[data-bs-theme='dark'] .ts-control input {
  color: #dee2e6 !important; /* Màu chữ sáng hơn cho dễ đọc */
}

[data-bs-theme='dark'] .ts-dropdown .option {
  color: #dee2e6; /* Màu chữ cho các tùy chọn trong dropdown */
  background: rgba(47, 51, 61, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

[data-bs-theme='dark'] .ts-control .item {
  color: #ffffff !important; /* Màu chữ trắng cho mục đã chọn */
}

[data-bs-theme='dark'] .ts-control input::placeholder {
  color: #adb5bd; /* Màu cho placeholder */
  opacity: 1; /* Đảm bảo placeholder không bị mờ */
}
/* Fix TomSelect dropdown z-index issue */
:deep(.ts-dropdown) {
  z-index: 1056; /* Higher than Bootstrap's modal z-index (1055) */
}
/* --- Light Theme Styles --- */
[data-bs-theme='light'] #adPanel {
  background-color: #ffffff;
  border: 1px solid var(--bs-border-color);
  box-shadow: -2px 0 15px rgba(0, 0, 0, 0.05);
}

[data-bs-theme='light'] .fold-button {
  background: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
  border-right: none;
  color: var(--bs-body-color);
}

[data-bs-theme='light'] .panel-header {
  background-color: var(--bs-tertiary-bg);
  border-bottom: 1px solid var(--bs-border-color);
}

[data-bs-theme='light'] .feature-card {
  background-color: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color-translucent);
}

[data-bs-theme='light'] .card-header {
  border-bottom: 1px solid var(--bs-border-color-translucent);
}

[data-bs-theme='light'] .card-settings {
  border-top: 1px solid var(--bs-border-color-translucent);
}

[data-bs-theme='light'] .floating-input input:focus + label,
[data-bs-theme='light'] .floating-input input:not(:placeholder-shown) + label {
  background: var(--bs-tertiary-bg);
}

[data-bs-theme='light'] .form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
}

[data-bs-theme='light'] .control-panel {
  background-color: var(--bs-tertiary-bg);
  border-top: 1px solid var(--bs-border-color);
}

[data-bs-theme='light'] .slider {
  background-color: #ccc;
}

[data-bs-theme='light'] input:checked + .slider {
  background-color: var(--bs-primary);
}

.form-select {
  padding-top: 1.0rem;
  padding-bottom: 0.4rem;
}

.floating-input .form-select {
  padding-top: 1.625rem;
  padding-bottom: 0.625rem;
}

[data-bs-theme='dark'] .form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23adb5bd' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(47, 51, 61, 0.7);
  color: #dee2e6;
}

</style>
