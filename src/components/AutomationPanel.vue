<template>
  <!-- Container cho Automation Panel và nút thu gọn -->
  <div id="automation-container" :class="{ 'is-collapsed': isCollapsed }" style="position: relative; display: flex; align-items: flex-start;">
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
          <div class="card-header">
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
          <div v-if="feature.settings" class="card-settings" :id="feature.id">
            <div v-for="setting in feature.settings" :key="setting.id" class="floating-input">
              <input
                :type="setting.type"
                placeholder=" "
                :id="setting.id"
                :min="setting.min"
                :value="setting.value"
              />
              <label :for="setting.id">{{ setting.label }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="control-panel">
        <div class="control-buttons">
          <button class="btn-start" id="startBtn" @click="startAutomation">
            <i class="ri-play-fill"></i>
            Bắt đầu
          </button>
          <button class="btn-stop" id="stopBtn" @click="stopAutomation">
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
import { onMounted, onUnmounted, defineProps, ref } from 'vue'
import { sharedSelectedIds } from '@/composables/useSelection'
import { useAutomation } from '@/composables/useAutomation'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  features: {
    type: Array,
    required: true,
  },
})

const { emit: emitAutomation, on: onAutomation } = useAutomation()
const { addToast } = useToast()

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
            settings[setting.id] = document.getElementById(setting.id)?.value
          })
        }

        // **VALIDATION LOGIC**
        // Kiểm tra các trường bắt buộc cho từng tính năng đang hoạt động
        if (feature.id === 'renameSettings' && !settings.newPageName) {
            addToast('Vui lòng nhập tên mới cho tính năng "Đổi tên tài khoản"!', 'error');
            return; // Dừng lại nếu thiếu thông tin
        }
        // Thêm các kiểm tra khác cho các tính năng khác ở đây nếu cần
        // Ví dụ: if (feature.id === 'shareSettings' && !settings.shareId) { ... }

        activeFeatures.push({ id: feature.id, settings })
      }
    }
  })

  if (activeFeatures.length === 0) {
    addToast('Vui lòng chọn ít nhất một tính năng để bắt đầu!', 'warning')
    return
  }

  if (sharedSelectedIds.value.length === 0) {
    addToast('Vui lòng chọn ít nhất một dòng trong bảng để thực hiện!', 'warning')
    return
  }

  startBtn.style.display = 'none'
  stopBtn.style.display = 'flex'

  // Đây là nơi bạn có thể truy cập các dòng đã chọn
  const payload = {
    selectedIds: sharedSelectedIds.value,
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

const unsubscribeEnd = onAutomation('end', handleAutomationEnd)

onUnmounted(() => {
  unsubscribeEnd() // Hủy đăng ký lắng nghe sự kiện khi component bị hủy
});

onMounted(() => {
  const inputs = document.querySelectorAll('.floating-input input')
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
  padding: 20px;
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
.floating-input input:not(:placeholder-shown) + label {
  top: -8px;
  left: 10px;
  font-size: 12px;
  padding: 0 5px;
}

/* Control Panel */
.control-panel {
  padding: 20px;
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-start,
.btn-stop {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.btn-start {
  background: #2ecc71;
  color: white;
}

.btn-start:hover {
  background: #27ae60;
  transform: translateY(-2px);
}

.btn-stop {
  background: #e74c3c;
  color: white;
  display: none;
}

.btn-stop:hover {
  background: #c0392b;
  transform: translateY(-2px);
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
  box-shadow: -5px -5px 10px rgba(50, 58, 77, 0.5), 5px 5px 10px rgba(18, 21, 28, 0.5);
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
[data-bs-theme='dark'] .floating-input input:not(:placeholder-shown) + label {
  color: #667eea;
  background: #272b34;
}

[data-bs-theme='dark'] .control-panel {
  background: rgba(47, 51, 61, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
</style>
