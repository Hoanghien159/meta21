<template>
  <div class="dashboard-grid">
    <!-- User Profile Card -->
    <div class="neo-card profile-card floating-animation">
      <div class="profile-header">
        <img
          src="https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-1/343169584_629415035286003_7196487710421941260_n.jpg?stp=c0.0.252.252a_dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=79bf43&_nc_ohc=g1xDQF8gOzUQ7kNvwEON7Dv&_nc_oc=AdmavK1eeAkwxsTmOU76dfHIlrLAkTnveKb3KJe24N_eUoqlxrOros3cnv2RkVwYMvZmPYFCwb9hI0s4kCukTTUe&_nc_zt=24&_nc_ht=scontent.fhan4-3.fna&_nc_gid=csFm0acYPRyVfDyqV-ZZUA&oh=00_AfVsJztF9FcLjCr2ecfLaJ0RoyNGguD2IkTAb-NzyxWiTg&oe=68B9D00B"
          alt="User Avatar"
          class="profile-avatar"
        />
        <div class="profile-info">
          <h2 class="profile-name">Meo Meo</h2>
          <p class="profile-id">100015915101721</p>
        </div>
        <div class="status-indicator">
          <span class="pulse-dot"></span>
          <span>Online</span>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <i class="ri-user-line"></i>
          <span>1134 Friends</span>
        </div>
        <div class="stat-item">
          <i class="ri-mail-line"></i>
          <span>vickieluncefordvip@outlook.com</span>
        </div>
        <div class="stat-item">
          <i class="ri-calendar-line"></i>
          <span>04/28/2004</span>
        </div>
      </div>
    </div>

    <!-- Account Status Card -->
    <div class="neo-card account-status-card">
      <h3 class="card-title gradient-text">Mi Hawk Live Ads</h3>
      <p class="balance-label">Số dư tài khoản</p>
      <p class="balance-amount">{{ formatCurrency(balance) }}</p>
      <div class="account-details">
        <span>**** **** **** 1234</span>
        <span>Meta21.top</span>
      </div>
      <a href="https://meta21.top/client/recharge" target="_blank" class="recharge-button">
        <i class="ri-add-circle-line"></i> Nạp tiền
      </a>
    </div>

    <!-- Stats Cards -->
    <div class="neo-card stat-card">
      <div class="stat-icon icon-bg-bm"><i class="ri-briefcase-line"></i></div>
      <div class="stat-info">
        <p class="stat-label">Tài khoản BM</p>
        <p class="stat-value">{{ bmCount }}</p>
      </div>
    </div>
    <div class="neo-card stat-card">
      <div class="stat-icon icon-bg-ads"><i class="ri-megaphone-line"></i></div>
      <div class="stat-info">
        <p class="stat-label">Tài khoản QC</p>
        <p class="stat-value">{{ adsCount }}</p>
      </div>
    </div>
    <div class="neo-card stat-card">
      <div class="stat-icon icon-bg-page"><i class="ri-flag-line"></i></div>
      <div class="stat-info">
        <p class="stat-label">Trang</p>
        <p class="stat-value">{{ pageCount }}</p>
      </div>
    </div>

    <!-- Top BM Card -->
    <div class="neo-card list-card">
      <div class="list-header">
        <h3>Top BM</h3>
        <a href="/bm"><i class="ri-arrow-right-up-line"></i></a>
      </div>
      <ul class="list-content">
        <li v-for="item in topBm" :key="item.id">
          <span>{{ item.name }}</span>
          <span class="badge-spend">{{ formatCurrency(item.spend) }}</span>
        </li>
      </ul>
    </div>

    <!-- Top Ads Card -->
    <div class="neo-card list-card">
      <div class="list-header">
        <h3>Top TKQC</h3>
        <a href="/ads"><i class="ri-arrow-right-up-line"></i></a>
      </div>
      <ul class="list-content">
        <li v-for="item in topAds" :key="item.id">
          <span>{{ item.name }}</span>
          <span class="badge-spend">{{ formatCurrency(item.spend) }}</span>
        </li>
      </ul>
    </div>

    <!-- Top Page Card -->
    <div class="neo-card list-card">
      <div class="list-header">
        <h3>Top Page</h3>
        <a href="/page"><i class="ri-arrow-right-up-line"></i></a>
      </div>
      <ul class="list-content">
        <li v-for="item in topPages" :key="item.id">
          <span>{{ item.name }}</span>
          <span class="badge-like"><i class="ri-thumb-up-fill"></i> {{ item.likes }}</span>
        </li>
      </ul>
    </div>

    <!-- Update History Card -->
    <div class="neo-card history-card">
      <div class="list-header">
        <h3>Lịch sử cập nhật</h3>
      </div>
      <div class="history-content table-scroll">
        <div class="history-item" v-for="item in updateHistory" :key="item.version">
          <div class="history-version">
            <span class="version-tag">{{ item.version }}</span>
            <span class="version-date">{{ item.date }}</span>
          </div>
          <div class="history-details" v-html="item.details"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const balance = ref(12345678)
const bmCount = ref(15)
const adsCount = ref(42)
const pageCount = ref(23)

const topBm = ref([
  { id: 1, name: 'BM Chính', spend: 5000000 },
  { id: 2, name: 'BM Phụ 1', spend: 3200000 },
  { id: 3, name: 'BM Test', spend: 1500000 },
])

const topAds = ref([
  { id: 1, name: 'TKQC Chiến dịch A', spend: 12500000 },
  { id: 2, name: 'TKQC Sản phẩm B', spend: 8700000 },
  { id: 3, name: 'TKQC Retargeting', spend: 5400000 },
])

const topPages = ref([
  { id: 1, name: 'O Espelho', likes: '46k' },
  { id: 2, name: 'Manchester United Fans', likes: '23k' },
  { id: 3, name: 'Para cagarse de risa', likes: '19k' },
])

const updateHistory = ref([
  {
    version: 'v1.6.6',
    date: '2025-07-09',
    details:
      '- Cập nhập thêm mục mới (tool) <br>- Cập nhập tính năng xem thông tin tất cả các bài viết của trang các nhân, pages <br>- Cập nhập xuất ra file .json và .xlsx <br>- Sửa một số lỗi nhỏ',
  },
  {
    version: 'v1.6.5',
    date: '2025-05-21',
    details:
      '- Cập nhập thêm tạo mã thanh toán MoMo cho TKQC <br>- Cập nhập giao diện tối <br>- Cập nhập Xóa đối tác <br>- Thêm nút tạo phôi',
  },
  {
    version: 'v1.6.4',
    date: '2025-05-21',
    details: '- Cập nhập tính năng Edit Campaign <br>- Edit (Tắt,Bật) Ads <br>- Edit Ngân sách',
  },
])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

let intervalId

onMounted(() => {
  // Mô phỏng cập nhật dữ liệu
  intervalId = setInterval(() => {
    balance.value += Math.floor(Math.random() * 100000)
    bmCount.value += Math.floor(Math.random() * 3) - 1
    adsCount.value += Math.floor(Math.random() * 5) - 2
  }, 10000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .profile-card {
    grid-column: span 2;
  }
  .account-status-card {
    grid-column: span 1;
  }
  .history-card {
    grid-column: span 3;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .profile-card,
  .account-status-card,
  .history-card {
    grid-column: span 2;
  }
}

.neo-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: /* Đổ bóng tinh tế hơn */
    -5px -5px 10px rgba(50, 58, 77, 0.5),
    5px 5px 10px rgba(18, 21, 28, 0.5),
    inset -1px -1px 0px rgba(18, 21, 28, 0.3),
    inset 1px 1px 0px rgba(50, 58, 77, 0.3);
  transition: all 0.3s ease-in-out;
}

.neo-card:hover {
  transform: translateY(-3px);
  box-shadow: /* Đổ bóng khi hover nổi bật và rực rỡ hơn */
    -8px -8px 16px rgba(50, 58, 77, 0.6),
    8px 8px 16px rgba(18, 21, 28, 0.6),
    inset 0 0 15px rgba(96, 165, 250, 0.1),
    0 0 25px rgba(96, 165, 250, 0.2);
}

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid #60a5fa; /* Viền avatar dày và sáng hơn */
  padding: 3px;
  background: #1a1e28;
}

.profile-info {
  flex-grow: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff; /* Chữ trắng tinh để nổi bật */
}

.profile-id {
  color: #888;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(74, 222, 128, 0.15); /* Nền xanh lá cây mờ */
  color: #4ade80; /* Màu xanh lá cây rực rỡ (Live) */
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #4ade80; /* Màu xanh lá cây (Live) */
  border-radius: 50%;
  animation: pulse-animation 1.5s infinite;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.25rem; /* Tăng khoảng cách */
  color: #a0a0a0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.account-status-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.balance-label {
  color: #a0a0a0;
}

.balance-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4ade80; /* Màu xanh lá cây (tích cực) */
  margin: 0.5rem 0;
}

.account-details {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-family: monospace;
  margin-bottom: 1.5rem;
}

.recharge-button {
  background: linear-gradient(135deg, #4ade80, #16a34a); /* Gradient xanh lá */
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.recharge-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(74, 222, 128, 0.4); /* Đổ bóng màu xanh lá */
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-label {
  color: #a0a0a0;
  margin: 0;
}
.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0.25rem 0 0 0;
}

.list-card,
.history-card {
  padding: 1.5rem;
  border-radius: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #ffffff;
}

.list-header a {
  color: #888;
  transition: color 0.3s;
}
.list-header a:hover {
  color: #7dd3fc;
}

.list-content {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-content li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.badge-spend {
  background: rgba(244, 63, 94, 0.2); /* Nền đỏ hồng */
  color: #fb7185;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
}

.badge-like {
  background: rgba(56, 189, 248, 0.2); /* Nền xanh da trời */
  color: #7dd3fc;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.history-card {
  grid-column: 1 / -1;
}

.history-content {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 1rem;
}

.history-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.history-version {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.version-tag {
  background: #4ade80; /* Màu xanh lá cây rực rỡ */
  color: #0f172a; /* Màu chữ tối hơn để tăng độ tương phản */
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  font-weight: bold;
}

.version-date {
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.25rem;
}

.history-details {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  flex-grow: 1;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>
