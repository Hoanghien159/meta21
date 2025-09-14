<template>
  <!-- prettier-ignore -->
  <div>
    <div
      class="modal fade"
      id="settingModal"
      data-bs-backdrop="true"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content shadow-lg glass-modal">
          <div class="modal-header border-bottom-0">
            <h1 class="modal-title fs-5"><i class="ri-settings-3-line me-2"></i>Cài đặt</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-0">
            <div class="p-0" data-tool="general">
              <div class="row">
                <div class="col-3">
                  <div
                    class="nav flex-column nav-pills p-3"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <button
                      class="nav-link text-start fw-medium active"
                      data-bs-toggle="pill"
                      data-bs-target="#general"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      <i class="ri-equalizer-line me-2"></i>Cài đặt chung
                    </button>
                    <button
                      class="nav-link text-start fw-medium"
                      data-bs-toggle="pill"
                      data-bs-target="#api"
                      type="button"
                      role="tab"
                      aria-selected="false"
                      tabindex="-1"
                    >
                      <i class="ri-key-fill me-2"></i>Cài đặt API
                    </button>
                    <button
                      class="nav-link text-start fw-medium"
                      data-bs-toggle="pill"
                      data-bs-target="#theme"
                      type="button"
                      role="tab"
                      aria-selected="false"
                      tabindex="-1"
                    >
                      <i class="ri-palette-line me-2"></i>Cài đặt giao diện
                    </button>
                  </div>
                </div>
                <div class="col-9 ps-0 border-start">
                  <div class="tab-content p-3">
                    <div class="tab-pane" id="api" role="tabpanel" style="min-height: 400px">
                      <!-- API Settings Content -->
                      <div class="row mb-3">
                        <div class="col-6 floating-input">
                          <label class="fw-bold mb-2">API giải captcha</label>
                          <select class="form-select" name="captchaService">
                            <option value="none">Không sử dụng</option>
                            <option value="2captcha">2captcha.com</option>
                            <option value="capmonster">capMonster.cloud</option>
                            <option value="ezcaptcha">ez-captcha.com</option>
                            <option value="anticaptcha">anticaptcha.top</option>
                          </select>
                        </div>
                        <div class="col-6 floating-input">
                          <label class="fw-bold mb-2">API Key</label>
                          <input type="text" name="captchaServiceKey" class="form-control" />
                        </div>
                      </div>
                      <!-- More API settings... -->
                    </div>
                    <div
                      class="tab-pane show active"
                      id="general"
                      style="min-height: 400px"
                      role="tabpanel"
                    >
                      <div class="mb-3 floating-input">
                        <label class="fw-bold mb-2">License Key</label>
                        <input type="text" class="form-control" name="license" />
                      </div>

                      <div class="mb-3 floating-input">
                        <label class="fw-bold mb-2">Cookie</label>
                        <input type="text" class="form-control" id="cookie" />
                      </div>

                      <div class="mb-3 floating-input">
                        <label class="fw-bold mb-2">Access Token</label>
                        <input type="text" class="form-control" id="accessToken" />
                      </div>
                      <div class="floating-input">
                        <label class="fw-bold mb-2">Token</label>
                        <input type="text" class="form-control" id="accessToken2" />
                      </div>
                    </div>
                    <div class="tab-pane" id="theme" role="tabpanel" style="min-height: 400px">
                      <div class="mb-3">
                        <label class="fw-bold mb-2">Chọn giao diện</label>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="themeOptions"
                            id="lightTheme"
                            value="light"
                            :checked="currentTheme === 'light'" @change="setTheme('light')"
                          />
                          <label class="form-check-label" for="lightTheme"> Giao diện sáng </label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="themeOptions"
                            id="darkTheme"
                            value="dark"
                            :checked="currentTheme === 'dark'" @change="setTheme('dark')"
                          />
                          <label class="form-check-label" for="darkTheme"> Giao diện tối </label>
                        </div>
                      </div>
                      <div class="mb-3 border-top pt-3 mt-3">
                        <label class="fw-bold mb-2">Tùy chỉnh hiển thị</label>
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="compactMode"
                            id="compactMode"
                          />
                          <label class="form-check-label" for="compactMode">
                            Giao diện nhỏ gọn
                          </label>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="fw-bold mb-2"
                          >Ấn Ctrl + hoặc Ctrl - để Phóng to/Thu nhỏ giao diện</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between flex-wrap border-top-0">
            <!-- Nhóm bên trái -->
            <div class="d-flex flex-wrap gap-2">
              <a
                href="https://zalo.me/g/rgqgpi496"
                target="_blank"
                class="shadow-sm btn border pe-3 d-flex align-items-center support-btn"
              >
                <i class="ri-customer-service-line me-2 fs-6"></i> Hỗ trợ
              </a>

              <button
                type="button"
                class="shadow-sm btn border pe-3 d-flex align-items-center support-btn"
                data-bs-toggle="modal"
                data-bs-target="#baoLoiModal"
              >
                <i class="ri-alert-line me-2 fs-6"></i> <strong>Báo lỗi</strong>
              </button>
            </div>

            <!-- Nhóm bên phải -->
            <div class="d-flex flex-wrap gap-2">
              <button type="button" class="btn btn-danger" id="getTokenCookieButton">
                Get token cookie
              </button>
              <button type="button" data-bs-dismiss="modal" class="btn btn-primary-glass">
                Lưu cài đặt
              </button>
              <button type="button" data-bs-dismiss="modal" class="btn btn-secondary">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modals for Custom Phone Service -->
    <div class="modal fade" id="addPhoneModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content addPhoneForm">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm dịch vụ</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Tên</label>
                <input type="text" class="serviceName form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">API Get Phone</label>
                <input type="text" class="apiGetPhone form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Phone Value</label>
                <input type="text" class="phoneValue form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Phone Prefix</label>
                <input type="text" class="phonePrefix form-control" />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">ID Value</label>
                <input type="text" class="idValue form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Phone Delay</label>
                <input type="text" class="phoneDelay form-control" value="0" />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">API Get Code</label>
                <input type="text" class="apiGetCode form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Code Value</label>
                <input type="text" class="codeValue form-control" required />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Lưu cài đặt</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal fade" id="editPhoneModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content editPhoneForm">
          <input type="hidden" class="phoneId" />
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Sửa dịch vụ</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Tên</label>
                <input type="text" class="serviceName form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">API Get Phone</label>
                <input type="text" class="apiGetPhone form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Phone Value</label>
                <input type="text" class="phoneValue form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Phone Prefix</label>
                <input type="text" class="phonePrefix form-control" />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">ID Value</label>
                <input type="text" class="idValue form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Phone Delay</label>
                <input type="text" class="phoneDelay form-control" value="0" />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">API Get Code</label>
                <input type="text" class="apiGetCode form-control" required />
              </div>
              <div class="col-6 mb-3">
                <label class="fw-bold mb-2">Code Value</label>
                <input type="text" class="codeValue form-control" required />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Lưu cài đặt</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
const { currentTheme, setTheme } = useTheme()
</script>

<style scoped>
/* --- Dark Theme Styles --- */
[data-bs-theme='dark'] .glass-modal {
  background: rgba(30, 35, 46, 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e9ecef;
}
[data-bs-theme='dark'] .modal-header .modal-title {
  color: #fff;
}

[data-bs-theme='dark'] .modal-header,
[data-bs-theme='dark'] .modal-footer {
  border-color: rgba(255, 255, 255, 0.1);
}

[data-bs-theme='dark'] .nav-pills .nav-link {
  color: #adb5bd;
  transition: all 0.2s ease-in-out;
}

[data-bs-theme='dark'] .nav-pills .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

[data-bs-theme='dark'] .nav-pills .nav-link.active {
  background-color: rgba(13, 110, 253, 0.2);
  color: #6ea8fe;
  font-weight: 600;
  border-left: 3px solid #0d6efd;
  border-radius: 0 0.25rem 0.25rem 0;
}

[data-bs-theme='dark'] .col-9.border-start {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

[data-bs-theme='dark'] .form-control,
[data-bs-theme='dark'] .form-select {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

[data-bs-theme='dark'] .form-control:focus,
[data-bs-theme='dark'] .form-select:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  color: #fff;
}

[data-bs-theme='dark'] .form-check-input {
  background-color: #495057;
  border-color: #6c757d;
}

[data-bs-theme='dark'] .form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

[data-bs-theme='dark'] .btn-primary-glass {
  background-color: rgba(13, 110, 253, 0.8);
  border-color: rgba(13, 110, 253, 1);
  color: white;
}

[data-bs-theme='dark'] .btn-primary-glass:hover {
  background-color: rgba(13, 110, 253, 1);
}

[data-bs-theme='dark'] .support-btn {
  color: #adb5bd;
  border-color: rgba(255, 255, 255, 0.2);
}

[data-bs-theme='dark'] .support-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff !important;
}

/* --- Light Theme Styles --- */
[data-bs-theme='light'] .glass-modal {
  background-color: var(--bs-modal-bg);
  color: var(--bs-body-color);
}

[data-bs-theme='light'] .modal-header .btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

[data-bs-theme='light'] .nav-pills .nav-link {
  color: var(--bs-nav-link-color);
}

[data-bs-theme='light'] .nav-pills .nav-link.active {
  background-color: var(--bs-primary);
  color: #fff;
  border-left: 3px solid transparent;
}

[data-bs-theme='light'] .btn-primary-glass {
  /* Use standard primary button for light theme */
  background-color: var(--bs-btn-bg, #0d6efd);
  border-color: var(--bs-btn-border-color, #0d6efd);
  color: var(--bs-btn-color, #fff);
}

[data-bs-theme='light'] .btn-primary-glass:hover {
  background-color: var(--bs-btn-hover-bg, #0b5ed7);
  border-color: var(--bs-btn-hover-border-color, #0a58ca);
}

[data-bs-theme='light'] .support-btn:hover {
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-body-color) !important;
}

[data-bs-theme='light'] .support-btn {
  color: var(--bs-secondary-color);
}
</style>
