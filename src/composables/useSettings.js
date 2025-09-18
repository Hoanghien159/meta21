import { ref, onMounted, watch } from 'vue'
import { getLocalStorage, setLocalStorage } from './extensionUtils.js'

export function useSettings() {
  const license = ref('')
  const cookie = ref('')
  const accessToken = ref('')
  const accessToken2 = ref('')
  onMounted(async () => {
    // Load initial values from localStorage
    license.value = (await getLocalStorage('license')) || ''
    // 'dataClone' is an array of account objects. We should get the cookie from the first account.
    const dataClone = (await getLocalStorage('dataClone')) || []
    cookie.value = dataClone[0]?.cookie || '' // Get cookie of the first account, or empty string
    accessToken.value = (await getLocalStorage('accessToken')) || ''
    accessToken2.value = (await getLocalStorage('accessToken2')) || ''
  })

  // Watch for changes and save to localStorage
  watch(accessToken, (newValue) => setLocalStorage('accessToken', newValue))
  watch(accessToken2, (newValue) => setLocalStorage('accessToken2', newValue))
  watch(cookie, async (newCookieValue) => {
    const dataClone = (await getLocalStorage('dataClone')) || []
    if (dataClone.length > 0 && dataClone[0]) {
      // Create a new array to avoid side effects
      const newDataClone = JSON.parse(JSON.stringify(dataClone))
      // Update the cookie for the first account
      newDataClone[0].cookie = newCookieValue
      newDataClone[0].account = newCookieValue // Also update the 'account' property
      await setLocalStorage('dataClone', newDataClone)
    }
  })

  return { license, cookie, accessToken, accessToken2 }
}
