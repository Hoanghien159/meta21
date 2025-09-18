let extId = null

export function getExtId() {
  if (extId) return extId
  //
  const url = new URL(location.href)
  let id = url.searchParams.get('extId') || localStorage.getItem('extId')

  if (window.location.hostname === 'localhost' && !id) {
    id = 'lpacpknkhcdeknhlhbgclbocffnocldh' // ID extension mặc định cho môi trường devcflhededmnbflbcmjepnhfgojflfdfck
    console.warn(`Đang sử dụng extId mặc định cho môi trường dev: ${id}`)
    localStorage.setItem('extId', id)
  }

  extId = id
  return extId
}
export function fetch2(url, options = {}) {
  return new Promise((resolve, reject) => {
    const message = {
      type: 'fetch',
      url: url,
      options: options,
    }
    chrome.runtime.sendMessage(extId, message, function (response) {
      if (!response.error) {
        resolve(response)
      } else {
        reject(response.error)
      }
    })
  })
}
export function getLocalStorage(name) {
  return new Promise(async (resolve, reject) => {
    const currentExtId = getExtId()
    if (!currentExtId) return reject(new Error('Extension ID không tồn tại.'))
    try {
      const message = { type: 'getLocalStorage', name: name }
      const response = await chrome.runtime.sendMessage(currentExtId, message)
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}

export function getCookie() {
  return new Promise(async (resolve, reject) => {
    const currentExtId = getExtId()
    if (!currentExtId) return reject(new Error('Extension ID không tồn tại.'))
    try {
      const response = await chrome.runtime.sendMessage(currentExtId, {
        type: 'getCookie',
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}

export function setLocalStorage(key, data) {
  return new Promise(async (resolve, reject) => {
    const currentExtId = getExtId()
    if (!currentExtId) return reject(new Error('Extension ID không tồn tại.'))
    try {
      const message = { type: 'setLocalStorage', key: key, data: data }
      await chrome.runtime.sendMessage(currentExtId, message)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function removeLocalStorage(name) {
  return new Promise(async (resolve, reject) => {
    const currentExtId = getExtId()
    if (!currentExtId) return reject(new Error('Extension ID không tồn tại.'))
    try {
      const message = { type: 'removeLocalStorage', name: name }
      await chrome.runtime.sendMessage(currentExtId, message)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function clearLocalStorage() {
  return new Promise(async (resolve, reject) => {
    const currentExtId = getExtId()
    if (!currentExtId) return reject(new Error('Extension ID không tồn tại.'))
    try {
      const message = { type: 'clearLocalStorage' }
      await chrome.runtime.sendMessage(currentExtId, message)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
