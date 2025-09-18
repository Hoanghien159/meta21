import FB from './fbcode.js'
import { getLocalStorage, setLocalStorage, removeLocalStorage, fetch2 } from './extensionUtils.js'
class FBsc extends FB {
  constructor() {
    super() // Gọi constructor của class cha (FB)
    this.extId = null
  }

  async init(gettoken = false) {
    return new Promise(async (_0x1d847e, _0x5c54e9) => {
      for (let _0x22efc7 = 0; _0x22efc7 < 3; _0x22efc7++) {
        try {
          this.accessToken = await getLocalStorage('accessToken')
          this.accessToken2 = await getLocalStorage('accessToken2')
          this.dtsg = await getLocalStorage('dtsg')
          this.dtsg2 = await getLocalStorage('dtsg2')
          try {
            this.userInfo = await this.getUserInfo(gettoken)
          } catch (_0xefb7fb) {
            this.accessToken = false // Reset token nếu getUserInfo thất bại
            await removeLocalStorage('accessToken')
            await removeLocalStorage('accessToken2')
          }
          const picture = await this.checkImageExists(this.userInfo?.picture?.data?.url || false)
          // 🔍 kiểm tra accessToken2 còn sống không
          const token2Valid =
            this.accessToken2 && (await this.isAccessTokenValid(this.accessToken2))
          if (!this.accessToken || !this.dtsg || !token2Valid || gettoken || !picture) {
            const getin = gettoken || !picture
            const _0x393b8a = await this.getAccessToken()
            this.accessToken = _0x393b8a.accessToken
            this.accessToken2 = ''
            try {
              this.accessToken2 = await this.getAccessToken2()
            } catch {}

            this.userInfo = await this.getUserInfo(getin)
            this.dtsg = _0x393b8a.dtsg
            this.dtsg2 = _0x393b8a.dtsg2

            await setLocalStorage('accessToken', this.accessToken)
            await setLocalStorage('accessToken2', this.accessToken2)
            await setLocalStorage('dtsg', this.dtsg)
            await setLocalStorage('dtsg2', this.dtsg2)
          }

          this.uid = this.userInfo.id
          break
        } catch {}
      }

      if (this.accessToken && this.dtsg && this.userInfo) {
        _0x1d847e()
      } else {
        _0x5c54e9()
      }
    })
  }
}

export default FBsc
