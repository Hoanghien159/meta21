import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null);
  const accountQuality = ref(null);

  function setUserInfo(info) {
    userInfo.value = info
  }

  function setAccountQuality(quality) {
    accountQuality.value = quality
  }

  function clearUserInfo() {
    userInfo.value = null
    accountQuality.value = null
  }

  return { userInfo, accountQuality, setUserInfo, setAccountQuality, clearUserInfo }
})
