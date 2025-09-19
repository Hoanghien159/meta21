import {
  getCookie,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  fetch2,
} from './extensionUtils.js'
import { useToast } from '@/composables/useToast.js'

let fbtkqc
const { addToast } = useToast()
class FB {
  constructor() {
    this.userInfo = false
    this.accessToken = false
    this.dtsg = false
  }

  async handleCheck(action) {
    const config = await saveSetting()
    let tasks = await getSelectedRows()
    if (tasks.length === 0) return
    let temporaryCardUsage = {} // Lưu trữ { cardKey: anticipatedCountIncrease }

    tasks.forEach((row) => {
      accountGrid.api.getRowNode(row.id).setDataValue('process', '')
    })
    $('#start').prop('disabled', true)
    setTimeout(() => {
      $('#start').addClass('d-none').prop('disabled', false)
      $('#stop').removeClass('d-none')
    }, 2000)
    let maxConcurrentTasks = config.general.limit.value
    let runningTasks = []
    let stopRequested = false
    const processTask = async function (taskId) {
      if (!runningTasks.includes(taskId)) {
        const taskIndex = tasks.findIndex((task) => task.id === taskId)
        const task = tasks[taskIndex]
        $(document).trigger('running', [task.id])
        $(document).trigger('message', [{ id: task.id, message: '' }])
        tasks[taskIndex].process = 'RUNNING'
        runningTasks.push(task.id)
        try {
          await action(
            task,
            config,
            (event, eventData) => {
              $(document).trigger(event, [{ id: task.id, ...eventData }])
            },
            temporaryCardUsage,
          )
        } catch {}

        $(document).trigger('finished', [task.id])
        tasks[taskIndex].process = 'FINISHED'
      }
    }

    let taskInterval = setInterval(async () => {
      const running = tasks.filter((task) => task.process === 'RUNNING')
      const pending = tasks.filter(
        (task) => task.process !== 'FINISHED' && task.process !== 'RUNNING',
      )
      const remaining = tasks.filter((task) => task.process !== 'FINISHED')

      if (!stopRequested && remaining.length > 0) {
        if (running.length < maxConcurrentTasks && pending.length > 0) {
          pending.slice(0, maxConcurrentTasks - running.length).forEach((task) => {
            if (!stopRequested) processTask(task.id)
          })
        }
      } else if (running.length === 0) {
        clearInterval(taskInterval)
        $(document).trigger('stopped')
      }
    }, 500)

    $(document).on('stop', () => (stopRequested = true))
  }
  checkLive() {
    return new Promise(async (_0x21f634, _0x1c0eeb) => {
      try {
        const _0x43c860 = await fetch2('https://facebook.com')
        const _0x10db97 = await getCookie()
        let _0x1eb6a4 = 0
        let _0x56f5dc = 0
        try {
          _0x1eb6a4 = (await getCookie()).split('c_user=')[1].split(';')[0] ?? 0
          try {
            _0x56f5dc = (await getLocalStorage('userInfo_' + this.uid)).id ?? 0
          } catch {}
        } catch (_0x1f8d22) {}
        if (
          _0x43c860.url.includes('login') ||
          _0x43c860.url.includes('index.php?next') ||
          _0x1eb6a4 === 0
        ) {
          _0x21f634('not_login')
        } else if (_0x1eb6a4 !== 0 && _0x56f5dc !== 0 && _0x1eb6a4 != _0x56f5dc) {
          _0x21f634('new_login')
        } else if (_0x43c860.url.includes('/checkpoint/601051028565049')) {
          try {
            const _0x1e7308 = await fetch2(_0x43c860.url)
            const _0x5def6d = _0x1e7308.text
            const _0x160fcb = _0x5def6d
              .match(/(?<=\"token\":\")[^\"]*/g)
              .filter((_0x5b220a) => _0x5b220a.startsWith('NA'))[0]
            const _0x191849 = _0x5def6d.match(/(?<=\"actorID\":\")[^\"]*/g)[0]
            await fetch2('https://www.facebook.com/api/graphql/', {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                _0x191849 +
                '&__user=' +
                _0x191849 +
                '&__a=1&__req=f&__hs=20093.HYP%3Acomet_pkg.2.1.0.2.1&dpr=1&__ccg=EXCELLENT&__rev=1019152241&__s=3r0i1l%3Adoygjs%3Arl8pzq&__hsi=7456304789546566464&__dyn=7xeUmwlEnwn8K2Wmh0no6u5U4e0yoW3q32360CEbo19oe8hw2nVE4W099w8G1Dz81s8hwnU2lwv89k2C1Fwc60D8vwRwlE-U2zxe2GewbS361qw8Xwn82Lw5XwSyES1Mw9m0Lo6-1Fw4mwr86C0No7S3m1TwLwHwea&__csr=iNP8qDzqVpK79p9bDmXDyd3F6mVGxF1h4yoKcwABwEx213yU8oK0G83zw5iwbW0IEa8W0D84C09gw5VxO0lO05988U01DqU1xE08mE&__comet_req=15&fb_dtsg=' +
                _0x160fcb +
                '&jazoest=25482&lsd=pzKOpDZ-eJ0rLdRdpFloMd&__spin_r=1019152241&__spin_b=trunk&__spin_t=1736056243&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=FBScrapingWarningMutation&variables=%7B%7D&server_timestamps=true&doc_id=6339492849481770',
              method: 'POST',
            })
          } catch (_0x57ec6b) {
            console.log(_0x57ec6b)
          }
        } else if (_0x43c860.url.includes('/checkpoint/1501092823525282')) {
          _0x21f634('282')
        } else if (_0x43c860.url.includes('/checkpoint/828281030927956')) {
          _0x21f634('956')
        } else {
          _0x21f634('success')
        }
      } catch (_0x2b5d8c) {
        console.log(_0x2b5d8c)
        _0x21f634('error')
      }
    })
  }

  getAccessToken() {
    return new Promise(async (_0x59dca2, _0x31622d) => {
      try {
        const _0x3f9154 = await fetch2(
          'https://business.facebook.com/billing_hub/payment_settings/',
        )
        const _0x3fd22f = _0x3f9154.text
        if (_0x3f9154.url.includes('login') || _0x3f9154.url.includes('index.php?next')) {
          _0x59dca2('not_login')
        } else if (_0x3f9154.url.includes('/checkpoint/1501092823525282')) {
          _0x59dca2('282')
        } else if (_0x3f9154.url.includes('/checkpoint/828281030927956')) {
          _0x59dca2('956')
        } else {
          const _0x23735d = _0x3fd22f
            .match(/(?<=\"accessToken\":\")[^\"]*/g)
            .filter((_0x342c40) => _0x342c40.includes('EAAG'))
          const _0x5ae47b = _0x3fd22f
            .match(/(?<=\"token\":\")[^\"]*/g)
            .filter((_0x16a2d4) => _0x16a2d4.startsWith('NA'))
          const _0x8a0649 = _0x3fd22f.match(/(?<=\"async_get_token\":\")[^\"]*/g)
          if (_0x23735d[0] && _0x5ae47b[0]) {
            const _0x3280a0 = {
              accessToken: _0x23735d[0],
              dtsg: _0x5ae47b[0],
              dtsg2: _0x8a0649[0],
            }
            _0x59dca2(_0x3280a0)
          } else {
            _0x31622d()
          }
        }
      } catch {
        _0x31622d()
      }
    })
  }
  getAccessToken2() {
    return new Promise(async (_0x3ddbf7, _0x2d7e92) => {
      try {
        const _0xc3e33d = await fetch2(
          'https://adsmanager.facebook.com/adsmanager/manage/campaigns',
        )
        let _0x2314c5 = _0xc3e33d.text
        try {
          let _0x1909dc = _0x2314c5.match(/window.location\.replace\("(.+)"/)
          _0x1909dc = _0x1909dc[1].replace(/\\/g, '')
          const _0x1d9f52 = await fetch2(_0x1909dc)
          _0x2314c5 = _0x1d9f52.text
        } catch {}
        const _0x16687f = _0x2314c5.match(/window.__accessToken="(.*)";/)
        _0x3ddbf7(_0x16687f[1])
      } catch (_0x5e0e18) {
        _0x2d7e92(_0x5e0e18)
      }
    })
  }
  getFriends() {
    return new Promise(async (_0x2ba9c3, _0x43a321) => {
      try {
        const _0x5b10f3 = await fetch2(
          'https://graph.facebook.com/me?fields=friends&access_token=' + this.accessToken2,
        )
        const _0x1dc7df = _0x5b10f3.json
        _0x2ba9c3(_0x1dc7df.friends.summary.total_count)
      } catch (_0x9ae0ef) {
        _0x43a321()
      }
    })
  }
  getUserInfo(gettoken = false) {
    return new Promise(async (_0x155406, _0x2ea043) => {
      try {
        const _0x48b91b = await getCookie()
        const _0x46d780 = _0x48b91b.split('c_user=')[1].split(';')[0]
        let _0x4d13bb = await getLocalStorage('userInfo_' + _0x46d780)
        if (!_0x4d13bb || gettoken) {
          const _0x3f30f2 = await fetch2(
            'https://graph.facebook.com/me?fields=name,first_name,last_name,gender,email,picture.width(200).height(200),username,link,birthday&access_token=' +
              this.accessToken,
          )
          const _0x24bc08 = _0x3f30f2.json
          try {
            _0x24bc08.friends = await this.getFriends()
          } catch {}
          if (!_0x24bc08.error) {
            await setLocalStorage('userInfo_' + _0x24bc08.id, _0x24bc08)
            await setLocalStorage('uid', _0x24bc08.id)
            _0x4d13bb = _0x24bc08
          } else {
            _0x2ea043() // Reject the promise
            return // Stop further execution in this function
          }
        }
        try {
          const _0x327ddc = (await getLocalStorage('dataClone')) || []
          const _0x5f00aa = _0x327ddc.filter((_0x298d1b) => _0x298d1b.uid === _0x4d13bb.id)
          if (!_0x5f00aa[0] && _0x4d13bb.id) {
            let _0x3bec63
            if (_0x327ddc.length === 0) {
              _0x3bec63 = 0
            } else {
              _0x3bec63 = _0x327ddc.length + 1
            }
            const _0x1ff33a = await getCookie()
            const _0x2024c3 = {
              id: _0x3bec63,
              cookie: _0x1ff33a,
              status: 0,
              account: _0x1ff33a,
              uid: _0x4d13bb.id,
              dob: _0x4d13bb.birthday,
              gender: _0x4d13bb.gender,
              friends: _0x4d13bb.friends,
              name: _0x4d13bb.name,
              avatar: _0x4d13bb.picture.data.url,
            }
            _0x327ddc.push(_0x2024c3)
            await setLocalStorage('dataClone', _0x327ddc)
          }
        } catch (_0x12e481) {
          console.log(_0x12e481)
        }
        _0x155406(_0x4d13bb)
      } catch (_0x25d96b) {
        _0x2ea043(_0x25d96b)
      }
    })
  }

  updateBmEmail(_0x2f0f56, _0x7fa5cb) {
    return new Promise(async (_0x25bd66, _0x55b48c) => {
      try {
        const _0x2aa0ba = await fbbm.getMainBmAccounts(_0x2f0f56)
        const _0x5846ac = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=4936&_triggerFlowletID=4932',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              this.uid +
              '&__usid=6-Tskj0szsrnqcv%3APskj1vrgneeya%3A0-Askj0sz1xmluja-RV%3D6%3AF%3D&__aaid=0&__bid=' +
              _0x2f0f56 +
              '&__user=' +
              this.uid +
              '&__a=1&__req=j&__hs=19994.HYP%3Abizweb_comet_pkg.2.1..0.0&dpr=1&__ccg=GOOD&__rev=1016895490&__s=o81toq%3Aaxxdno%3Av9875l&__hsi=7419702681638436524&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU7SbzEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgEbUy742p046xO2O1VwBwXwEw-G2mcwuE2OwgECu1vwoEcE7O2l0Fwqo5W1bxq0D8gwNxq1izXx-ewt8jwGzEaE8o4-222SU5G4E5yexfwjESq1qwjokGvwOwem32fwLCyKbwzwea0Lo6-3u36iU9E2cwNwDwjouwqo4e220hi7E5y1rwGw9q&__csr=g9_cykBWdbkhsAYSBPkRFitQJDvWZTiq9iHR49HZ44vRKhbFt_tWsTjFFKRjnqqVadaJtCnTR-W-iIx5h2qFuFaLqWKCAlah6HA_iXhbKql4GOtW9eR-DDoCh2enK9puUSurpBuGFBhepypXWGuVuUOl9BiznWDV5ybBKSl5WWJ4gG8BF4mEKvG8xCVHLLyenGA-Kimm5o-anJG44miqAKAaBm48KpAGWm-m48Wm8Vrz4m79UpK5VbWgGquq4bxBx9a68jwLwwgKWBG3S58iyVHxVk2m49EyE8Ulx6u365VqyokCxZ7yElyoK6QUf8nxvwTCwEG3u10wxwYxbwhpo1cbV9oqzQcgpG322C1Ixp0axw2rMljQsbz3G4wl04Zw1CS04wE0HO0dfwrU0NaE0jcwf2EcEpwBDkywda0umtk3S4pK00HSo0cDE1uE2Zabw0z9g8Jm0pO3KbzU1Hy6wKw1eG0f4ARpE0u5U0YBw8J08Khw2rVZwe60x80sUxi05Ny02mk6Q0O2xF6Dw960ciU5e0PA0wpErw288&__comet_req=11&fb_dtsg=' +
              this.dtsg +
              '&jazoest=25474&lsd=uzpgvQzTYIVG48bw-8QIlT&__spin_r=1016895490&__spin_b=trunk&__spin_t=1727534151&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BizKitSettingsUpdateBusinessUserInfoMutation&variables=%7B%22businessUserID%22%3A%22' +
              _0x2aa0ba.id +
              '%22%2C%22firstName%22%3A%22' +
              encodeURIComponent(_0x2aa0ba.first_name) +
              '%22%2C%22lastName%22%3A%22' +
              encodeURIComponent(_0x2aa0ba.last_name) +
              '%22%2C%22email%22%3A%22' +
              encodeURIComponent(_0x7fa5cb) +
              '%22%2C%22clearPendingEmail%22%3Anull%2C%22surface_params%22%3A%7B%22entry_point%22%3A%22BIZWEB_SETTINGS_BUSINESS_INFO_TAB%22%2C%22flow_source%22%3A%22BIZ_WEB%22%2C%22tab%22%3A%22business_info%22%7D%7D&server_timestamps=true&doc_id=8454950507853345',
            method: 'POST',
          },
        )
        const _0x179822 = _0x5846ac.json
        if (
          _0x179822.data.business_settings_update_business_user_personal_info.pending_email ===
          _0x7fa5cb
        ) {
          _0x25bd66()
        } else {
          _0x55b48c()
        }
      } catch {
        _0x55b48c()
      }
    })
  }

  getInsta(_0x5d58ba) {
    return new Promise(async (_0x4b4ae2, _0xe23d4d) => {
      try {
        const _0x139970 = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            _0x5d58ba +
            '/owned_instagram_accounts?access_token=' +
            this.accessToken +
            '&__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abusiness%2Fowned_instagram_accounts&_reqSrc=BusinessConnectedOwnedInstagramAccountsStore.brands&date_format=U&fields=%5B%22id_v2%22%2C%22username%22%2C%22profile_pic%22%2C%22owner_business%22%2C%22is_professional%22%2C%22is_reauth_required_for_permissions%22%2C%22is_ig_app_message_toggle_enabled%22%2C%22is_mv4b_profile_locked%22%5D&limit=25&locale=vi_VN&method=get&pretty=0&sort=name_ascending&suppress_http_code=1&xref=f8a7bc4b52c89b1ad&_flowletID=2683&_triggerFlowletID=2683',
        )
        const _0x2dc5ba = _0x139970.json
        _0x4b4ae2(_0x2dc5ba)
      } catch (_0xf01353) {
        _0xe23d4d(_0xf01353)
      }
    })
  }
  async sleeptime(_0x1c2b3f = 1) {
    await delayTime(_0x1c2b3f * 10)
  }
  generateCustomId() {
    // z3kqldmn-6xb3-l9j2-jt9x-w0u7smc4r7he
    let chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let pattern = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // Định dạng mong muốn

    return pattern.replace(/x/g, () => chars[Math.floor(Math.random() * chars.length)])
  }
  generateActiveScenarioIDs() {
    //__activeScenarioIDs ["6e1d364f-9d74-4535-b6a6-df0e57ec2067"]
    return JSON.stringify([crypto.randomUUID()])
  }
  generateFlowInstanceIdidNumber() {
    //flow_instance_id  "462173849"
    let idNumber = Math.floor(Math.random() * 1000000000)
    return `${idNumber}`
  }
  generateFlowInstanceIduniqueString() {
    //flow_instance_id  "f3c5d1e2b6a9c473"
    let uniqueString = crypto.randomUUID().replace(/-/g, '').substring(0, 16)
    return `${uniqueString}`
  }
  generateCallFlowletID() {
    //_callFlowletID "47285"
    return Math.floor(10000 + Math.random() * 90000)
  }

  generateSessionID() {
    //_sessionID "3fa49c2b1e74a6d0"
    let array = new Uint8Array(8)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  generateXref() {
    //xref "18f1be3c8f6d4d90"
    return (Date.now().toString(16) + Math.random().toString(16).slice(2, 10)).toLowerCase()
  }

  addAdmin(_0x4eae62, _0x1dc64c) {
    return new Promise(async (_0x136916, _0x343428) => {
      try {
        const _0x36ece6 = await fetch2(
          'https://adsmanager-graph.facebook.com/v19.0/act_' +
            _0x4eae62 +
            '/users?_reqName=adaccount%2Fusers&access_token=' +
            this.accessToken +
            '&method=post&__cppo=1&_callFlowletID=7348&_triggerFlowletID=7349',
          {
            headers: {
              accept: '*/*',
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__ad_account_id=' +
              _0x4eae62 +
              '&__interactionsMetadata=%5B%5D&_callFlowletID=7348&_reqName=adaccount%2Fusers&_reqSrc=AdsPermissionDialogController&_sessionID=556dc890ec046797&_triggerFlowletID=7349&account_id=' +
              _0x4eae62 +
              '&include_headers=false&locale=vi_VN&method=post&pretty=0&role=281423141961500&suppress_http_code=1&uid=' +
              _0x1dc64c +
              '&xref=f4838500204229be7',
            method: 'POST',
          },
        )
        const _0x148e18 = await fetch2(
          'https://adsmanager.facebook.com/ads/manage/settings/permissions/?action=add_user_confirm&_callFlowletID=9287&_triggerFlowletID=9281',
          {
            headers: {
              accept: '*/*',
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'jazoest=25520&fb_dtsg=' +
              this.dtsg +
              '&is_cm=1&act=' +
              _0x4eae62 +
              '&was_success=1&error_code=&user_id=' +
              _0x1dc64c +
              '&search_query=&add_user_permission=281423141961500&__usid=6-Tsjjz1o1pttdlc%3APsjk0aw25pkra%3A0-Asjjz1o19kla0-RV%3D6%3AF%3D&__aaid=' +
              _0x4eae62 +
              '&__user=' +
              this.uid +
              '&__a=1&__req=1i&__hs=19975.BP%3Aads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1016325924&__s=ipvh6d%3A1elzm6%3Awcjrck&__hsi=7412680376252426657&__dyn=7AgSXgWGgWEjgDBxmSudg9omoiyoK6FVpkihG5Xx2m2q3K2KmeGqKi5axeqaScCCG225pojACjyocuF98SmqnK7GzUuwDxq4EOezoK26UKbC-mdwTxOESegGbwgEmK9y8Gdz8hyUuxqt1eiUO4EgCyku4oS4EWfGUhwyg9p44889EScxyu6UGq13yHGmmUTxJe9LgbeWG9DDl0zlBwyzp8KUV2U8oK1IxO4VAcKmieyp8BlBUK2O4UOi3Kdx29wgojKbUO1Wxu4GBwkEuz478shECumbz8KiewwBK68eF8pK1vDyojyUix92UtgKi3a6Ex0RyQcKazQ3G5EbpEtzA6Sax248GUgz98hAy8kybKfxefKaxWi2y2i7VEjCx6EO489UW5ohwZAxK4U-dwMxeayEiwAgCmq6UCQubxu3ydDxG8wRyK4UoLzokGp5yrz8C9wGLg-9wFy9oCagixi48hyUix6cG228BCyKbwzxa10yUG1LDDV8sw8KmbwVzi1y4fz8coiGQU9EeVVUWrUlUym5UpU9oeUhxWUnposxx7KAfwxCwyDxm5V9UWaV-bxhem9xq2K9AwHxq5kiV89bx5e8wAAAVQEhyeucyEy68WaJ129ho&__csr=&__comet_req=25&lsd=o_cxfnmTRU9tXHvOIjv5ic&__spin_r=1016325924&__spin_b=trunk&__spin_t=1725899143&__jssesw=1',
            method: 'POST',
          },
        )
        _0x136916()
      } catch (_0x58fbf8) {
        console.log(_0x58fbf8)
        _0x343428()
      }
    })
  }

  getAdAccountsBM(IDB, onProgress = null) {
    return new Promise(async (_0x2b8d6b, _0x478980) => {
      try {
        let adAccountsData = { data: [] } // Khởi tạo với một mảng dữ liệu rỗng
        fb.updateLoadingProgress(35)
        let total
        let adsProcessed = 0
        try {
          // Lấy tài khoản quảng cáo trực tiếp từ Graph API (v14.0)

          const graphApiResponse = await fetch2(
            'https://graph.facebook.com/v19.0/' +
              IDB +
              '/client_ad_accounts?fields=account_id,owner_business,name,disable_reason,account_status,currency,adspaymentcycle,account_currency_ratio_to_usd,adtrust_dsl,balance,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,amount_spent,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions{user,role},owner,is_prepay_account,spend_cap&summary=true&limit=200&access_token=' +
              this.accessToken,
          )
          adAccountsData = graphApiResponse.json
          total = adAccountsData.data.length
          if (typeof onProgress === 'function') {
            onProgress({ adsProcessed, total })
          }
          fb.updateLoadingProgress(45)
          // Lọc ra các tài khoản quảng cáo do doanh nghiệp sở hữu
          //  adAccountsData.data = adAccountsData.data.filter(_0x355ff7 => !_0x355ff7.owner_business);
          // Ensure adAccountsData.data exists before filtering
          if (adAccountsData && Array.isArray(adAccountsData.data)) {
            adAccountsData.data = adAccountsData.data.filter((account) => !account.owner_business)
          } else {
            adAccountsData.data = [] // Initialize as empty array if data is missing
          }

          fb.updateLoadingProgress(55)
        } catch {
          // Nếu lệnh gọi Graph API không thành công, hãy thử Ads Manager Graph API (v16.0)
          const _0x4f9680 = await fetch2(
            'https://graph.facebook.com/v19.0/' +
              IDB +
              '/client_ad_accounts?access_token=' +
              this.accessToken +
              '&pretty=1&fields=id%2Cname%2Ccurrency%2Cadtrust_dsl%2Cadspaymentcycle%7Bthreshold_amount%7D%2Cbalance%2Camount_spent%2Cfunding_source_details%2Cbusiness_country_code%2Ctimezone_name%2Caccount_status%2Cspend_cap%2Ccreated_time%2Cads.limit%281%29%2Cbusiness%2Cbusiness_city%2Cbusiness_name%2Cbusiness_state%2Cbusiness_street%2Cbusiness_street2%2Cbusiness_zip&limit=200',
          )
          adAccountsData = _0x4f9680.json
          // Yêu cầu hàng loạt để có thêm thông tin chi tiết cho từng tài khoản quảng cáo
          const _0xc10c79 = Math.ceil(adAccountsData.data.length / 50)
          for (let batchIndex = 1; batchIndex <= _0xc10c79; batchIndex++) {
            const _0x35a970 = (batchIndex - 1) * 50
            const _0x24da9b = adAccountsData.data.slice(_0x35a970, batchIndex * 50)
            const _0x2d5cf7 = []
            _0x24da9b.forEach((_0x3df428) => {
              _0x2d5cf7.push({
                id: _0x3df428.account.id.replace('act_', ''),
                relative_url:
                  '/act_' +
                  _0x3df428.account_id +
                  '?fields=is_prepay_account,next_bill_date,balance,users{id,is_active,name,permissions,role,roles}',
                method: 'GET',
              })
            })
            const batchResponse = await fetch2(
              'https://adsmanager-graph.facebook.com/v16.0?access_token=' +
                this.accessToken +
                '&suppress_http_code=1&locale=en_US',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body: 'include_headers=false&batch=' + JSON.stringify(_0x2d5cf7),
                method: 'POST',
              },
            )
            const _0x48bec1 = batchResponse.json
            // Cập nhật dữ liệu tài khoản quảng cáo với thông tin chi tiết từ phản hồi hàng loạt
            for (let i = 0; i < _0x48bec1.length; i++) {
              if (_0x48bec1[i].code == 200) {
                const _0xe1a15d = JSON.parse(_0x48bec1[i].body)
                const _0x2b55c9 = adAccountsData.data.findIndex(
                  (_0x5ef525) => _0x5ef525.id === _0xe1a15d.id,
                )
                adAccountsData.data[_0x2b55c9] = {
                  ...adAccountsData.data[_0x2b55c9],
                  ..._0xe1a15d,
                }
              }
              adsProcessed++
            }
          }
        }
        if (adAccountsData.data) {
          // Bản đồ vô hiệu hóa lý do thành chuỗi dễ đọc hơn
          const disableReasons = {
            0: '',
            1: 'Vi phạm chính sách',
            2: 'Hoạt động IP bất thường',
            3: 'Thanh toán bất thường',
            4: 'Tài khoản không hợp lệ hoặc bị nghi ngờ giả mạo',
            5: 'Bị xem xét theo hệ thống kiểm duyệt tự động',
            6: 'Bị hạn chế do liên quan đến độ tin cậy',
            7: 'Tài khoản đã bị đóng vĩnh viễn',
            8: 'Tài khoản reseller (đại lý) không sử dụng và bị đóng',
          }
          fb.updateLoadingProgress(65)
          // Bản đồ vô hiệu hóa do thành chuỗi dễ đọc hơn
          _0x2b8d6b(
            adAccountsData.data.map((account) => {
              account.limit = account.adtrust_dsl
              account.prePay = account.is_prepay_account ? 'TT' : 'TS'
              account.threshold = account.adspaymentcycle
                ? account.adspaymentcycle.data[0].threshold_amount
                : ''
              account.remain = account.threshold - account.balance
              account.spend = account.insights ? account.insights.data[0].spend : '0'
              account.users = account.users ? account.users.data : []
              const _0x501172 = moment(account.next_bill_date)
              const _0x440a6c = moment()
              const _0x5084bc = _0x501172.diff(_0x440a6c, 'days')
              const _0x195090 = [
                'EUR',
                'BRL',
                'USD',
                'CNY',
                'MYR',
                'UAH',
                'QAR',
                'THB',
                'THB',
                'TRY',
                'GBP',
                'PHP',
                'INR',
              ]
              if (_0x195090.includes(account.currency)) {
                account.balance = Number(account.balance) / 100
                account.threshold = Number(account.threshold) / 100
                account.remain = Number(account.remain) / 100
              }
              account.limit = new Intl.NumberFormat('en-US')
                .format(account.limit)
                .replace('NaN', '')
              account.spend = new Intl.NumberFormat('en-US')
                .format(account.spend)
                .replace('NaN', '')
              account.remain = new Intl.NumberFormat('en-US')
                .format(account.remain)
                .replace('NaN', '')
              account.balance = new Intl.NumberFormat('en-US')
                .format(account.balance)
                .replace('NaN', '')
              account.threshold = new Intl.NumberFormat('en-US')
                .format(account.threshold)
                .replace('NaN', '')
              if (!account.cards) {
                account.cards = []
              }
              const _0x3f7a95 =
                account.userpermissions?.data.filter((_0x47a85e) => _0x47a85e.role === 'ADMIN') ||
                []
              return {
                status: account.account_status,
                type: account.owner_business ? 'Business' : 'Cá nhân',
                reason: disableReasons[account.disable_reason],
                account: account.name,
                adId: account.id.replace('act_', ''),
                limit: account.limit,
                spend: account.spend,
                remain: account.remain,
                adminNumber: _0x3f7a95.length,
                nextBillDate: _0x501172.format('DD/MM/YYYY'),
                nextBillDay: _0x5084bc < 0 ? 0 : _0x5084bc,
                createdTime: moment(account.created_time).format('DD/MM/YYYY'),
                timezone: account.timezone_name,
                currency: account.currency + '-' + account.prePay,
                threshold: account.threshold,
                role: account.userpermissions?.data[0]?.role || 'UNKNOWN',
                balance: account.balance,
                bm: account.owner_business ? account.owner_business.id : null,
              }
            }),
          )
        } else {
          _0x478980()
        }
      } catch (_0x48cd7e) {
        _0x478980(_0x48cd7e)
      }
    })
  }
  getAdAccountsADS(IDKQC) {
    return new Promise(async (resolve, reject) => {
      try {
        let trangThaiTaiKhoan2
        let trangThaiTaiKhoan3
        const url = `https://graph.facebook.com/v15.0/act_${IDKQC}?fields=business,owner_business,name,account_id,disable_reason,account_status,currency,adspaymentcycle,adtrust_dsl,balance,amount_spent,account_currency_ratio_to_usd,users,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions,owner,is_prepay_account&summary=true&access_token=${this.accessToken2}`
        const { json: account } = await fetch2(url)

        if (!account?.account_id) return reject('Không có dữ liệu tài khoản quảng cáo hợp lệ.')
        try {
          const thongTinHold = await this.checkHold(IDKQC)
          // Nếu tài khoản bị hold, đặt trạng thái là 999
          if (thongTinHold.status) {
            trangThaiTaiKhoan2 = 999
          }
          if (idBm) {
            // Nếu có idBm, kiểm tra trạng thái tài khoản quảng cáo qua API GraphQL
            const _0x1f0f37 = await fetch2(
              'https://business.facebook.com/api/graphql/?_callFlowletID=1&_triggerFlowletID=2',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  'av=' +
                  this.uid +
                  '&__usid=6-Tse1ovt1j8u6wd%3APse1oxj1m4rr33%3A0-Ase1ovtochuga-RV%3D6%3AF%3D&session_id=144e97c8e5fc4969&__aaid=' +
                  IDKQC +
                  '&__bid=' +
                  idBm +
                  '&__user=' +
                  this.uid +
                  '&__a=1&__req=1&__hs=19868.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1013767953&__s=qxxa8s%3Ax39hkh%3Apw4cw7&__hsi=7372940659475198570&__dyn=7xeUmxa2C5rgydwn8K2abBAjxu59o9E6u5VGxK5FEG484S4UKewSAxam4EuGfwnoiz8WdwJzUmxe1kx21FxG9xedz8hw9yq3a4EuCwQwCxq1zwCCwjFFpobQUTwJBGEpiwzlwXyXwZwu8sxF3bwExm3G4UhwXxW9wgo9oO1Wxu0zoO12ypUuwg88EeAUpK19xmu2C2l0Fz98W2e2i3mbgrzUiwExq1yxJUpx2awCx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sq6UfEO32fxiFUd8bGwgUy1kx6bCyUhzawLCyKbwzweau0Jo6-1FAyo884KeCK2q362u1dxW6U98a85Ou0DU7i1TwUw&__csr=&fb_dtsg=' +
                  this.dtsg +
                  '&jazoest=25134&lsd=nZD2aEOcch1tFKEE4sGoAT&__spin_r=1013767953&__spin_b=trunk&__spin_t=1716646518&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AccountQualityHubAssetViewQuery&variables=%7B%22assetOwnerId%22%3A%223365254127037950%22%2C%22assetId%22%3A%22' +
                  IDKQC +
                  '%22%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=6875615999208668',
                method: 'POST',
              },
            )

            const thongTinChiTiet = _0x1f0f37.json
            const thongTinHanChe = thongTinChiTiet.data.adAccountData.advertising_restriction_info

            // Kiểm tra các loại hạn chế và đặt trạng thái tương ứng
            if (
              thongTinHanChe.ids_issue_type === 'AD_ACCOUNT_ALR_DISABLE' &&
              thongTinHanChe.status === 'APPEAL_PENDING'
            ) {
              trangThaiTaiKhoan3 = 4 // Đang kháng nghị
            }
            if (
              thongTinHanChe.ids_issue_type === 'AD_ACCOUNT_ALR_DISABLE' &&
              (thongTinHanChe.status === 'VANILLA_RESTRICTED' ||
                thongTinHanChe.status === 'APPEAL_REJECTED')
            ) {
              trangThaiTaiKhoan3 = 5 // Bị hạn chế hoặc kháng nghị bị từ chối
            }
            if (
              thongTinHanChe.ids_issue_type === 'PREHARM_AD_ACCOUNT_BANHAMMER' &&
              thongTinHanChe.status === 'APPEAL_INCOMPLETE'
            ) {
              trangThaiTaiKhoan3 = 6 // Hạn chế chưa hoàn thành kháng nghị
            }
            if (
              thongTinHanChe.ids_issue_type === 'PREHARM_AD_ACCOUNT_BANHAMMER' &&
              thongTinHanChe.status === 'APPEAL_REJECTED'
            ) {
              trangThaiTaiKhoan3 = 7 // Hạn chế và kháng nghị bị từ chối
            }
          }
        } catch {}
        // Xử lý dữ liệu chính
        const disableReasons = {
          0: '',
          1: 'Vi phạm chính sách',
          2: 'Hoạt động IP bất thường',
          3: 'Thanh toán bất thường',
          4: 'Tài khoản không hợp lệ hoặc bị nghi ngờ giả mạo',
          5: 'Bị xem xét theo hệ thống kiểm duyệt tự động',
          6: 'Bị hạn chế do liên quan đến độ tin cậy',
          7: 'Tài khoản đã bị đóng vĩnh viễn',
          8: 'Tài khoản reseller (đại lý) không sử dụng và bị đóng',
        }

        const nf = new Intl.NumberFormat('en-US')
        const safeNum = (val) => Number(val) || 0

        const threshold = safeNum(account.adspaymentcycle?.data?.[0]?.threshold_amount)
        let balance = safeNum(account.balance)
        const currencies = [
          'EUR',
          'BRL',
          'USD',
          'CNY',
          'MYR',
          'UAH',
          'QAR',
          'THB',
          'TRY',
          'GBP',
          'PHP',
          'INR',
        ]
        if (currencies.includes(account.currency)) {
          balance /= 100
        }

        const remain = threshold - balance
        const spend = safeNum(account.insights?.data?.[0]?.spend)
        const created = moment(account.created_time)
        const nextBill = moment(account.next_bill_date)
        const admins = account.userpermissions?.data?.filter((u) => u.role === 'ADMIN') || []

        resolve([
          {
            status: [account.account_status, trangThaiTaiKhoan2, trangThaiTaiKhoan3],
            type: account.owner_business ? 'Business' : 'Cá nhân',
            reason: disableReasons[account.disable_reason] || '',
            account: account.name,
            adId: account.account_id,
            limit: nf.format(safeNum(account.adtrust_dsl)),
            spend: nf.format(spend),
            remain: nf.format(remain),
            adminNumber: admins.length,
            nextBillDate: nextBill.isValid() ? nextBill.format('DD/MM/YYYY') : 'N/A',
            nextBillDay: Math.max(0, nextBill.diff(moment(), 'days')),
            createdTime: created.isValid() ? created.format('DD/MM/YYYY') : 'N/A',
            timezone: account.timezone_name,
            currency: `${account.currency}-${account.is_prepay_account ? 'TT' : 'TS'}`,
            threshold: nf.format(threshold),
            role: account.userpermissions?.data?.[0]?.role || 'UNKNOWN',
            balance: nf.format(balance),
            bm: account.owner_business?.id || null,
            payment: JSON.stringify(account.all_payment_methods?.pm_credit_card || []),
          },
        ])
      } catch (error) {
        reject(error)
      }
    })
  }
  checkHold(_0x4b9fbf) {
    return new Promise(async (_0x5d57cb, _0x523aca) => {
      const _0x474516 = {
        status: false,
        country: '',
      }
      try {
        const _0x1d0307 = await fetch2('https://business.facebook.com/api/graphql/?_flowletID=1', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'av=' +
            this.uid +
            '&__usid=6-Ts51f1w1gfkvpj%3APs51f2gvheire%3A0-As51f1wdhal3d-RV%3D6%3AF%3D&__user=' +
            this.uid +
            '&__a=1&__req=8&__hs=19693.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010170946&__s=ew2ohe%3Afdtegc%3A7il5yk&__hsi=7307960693527437806&__dyn=7xe6Eiw_K5U5ObwyyVp6Eb9o6C2i5VGxK7oG484S7UW3qiidBxa7GzU721nzUmxe1Bw8W4Uqx619g5i2i221qwa62qq1eCBBwLghUbpqG6kE8Ro4uUfo7y78qggwExm3G4UhwXwEwlU-0DU2qwgEhxW10wv86eu1fgaohzE8U6q78-3K5E7VxK48W2a4p8y26UcXwAyo98gxu5ogAzEowwwTxu1cwwwzzobEaUiwYwGxe1uwciawaG13xC4oiyVV98OEdEGdwzweau0Jomwm8gU5qi2G1bzEG2q362u1IxK321VDx27o72&__csr=&fb_dtsg=' +
            this.dtsg +
            '&jazoest=25595&lsd=_WnEZ0cRpYEKpFXHPcY7Lg&__aaid=' +
            _0x4b9fbf +
            '&__spin_r=1010170946&__spin_b=trunk&__spin_t=1701517192&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingHubPaymentSettingsViewQuery&variables=%7B%22assetID%22%3A%22' +
            _0x4b9fbf +
            '%22%7D&server_timestamps=true&doc_id=6747949808592904',
        })
        const _0x5b168b = _0x1d0307.text
        const _0x1310e0 = _0x5b168b.match(/(?<=\"predicated_business_country_code\":\")[^\"]*/g)
        if (_0x1310e0[0]) {
          _0x474516.country = _0x1310e0[0]
        }
        if (_0x5b168b.includes('RETRY_FUNDS_HOLD')) {
          _0x474516.status = true
        } else {
          _0x474516.status = false
        }
      } catch {
        _0x474516.status = false
      }
      _0x5d57cb(_0x474516)
    })
  }
  checkADSlive(adInfo, _0x4c4040) {
    return new Promise(async (_0x567957, _0x4cb824) => {
      let trangThaiTaiKhoan1
      let trangThaiTaiKhoan2
      try {
        const response = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            adInfo.adId +
            '?fields=id,name,currency,adtrust_dsl,adspaymentcycle{threshold_amount},balance,amount_spent,funding_source_details,business_country_code,timezone_name,account_status,spend_cap,created_time,business,business_city,business_name,business_state,business_street,business_street2,business_zip&access_token=' +
            fb.accessToken,
        )
        const data = await response.json
        if (response?.errors ?? response?.error) {
          addToast(`❌ Lỗi check live: ${error.message || error}`, 'error')
        }
        trangThaiTaiKhoan1 = data.account_status
        const idBm = $("select[name='accountSelect']").val()
        const thongTinHold = await this.checkHold(adInfo.adId)
        // Nếu tài khoản bị hold, đặt trạng thái là 999
        if (thongTinHold.status) {
          trangThaiTaiKhoan2 = 999
        } else if (idBm != 0) {
          await delayTime(400)
          // Nếu có idBm, kiểm tra trạng thái tài khoản quảng cáo qua API GraphQL
          const _0x1f0f37 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=1&_triggerFlowletID=2',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tse1ovt1j8u6wd%3APse1oxj1m4rr33%3A0-Ase1ovtochuga-RV%3D6%3AF%3D&session_id=144e97c8e5fc4969&__aaid=' +
                adInfo.adId +
                '&__bid=' +
                idBm +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=1&__hs=19868.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1013767953&__s=qxxa8s%3Ax39hkh%3Apw4cw7&__hsi=7372940659475198570&__dyn=7xeUmxa2C5rgydwn8K2abBAjxu59o9E6u5VGxK5FEG484S4UKewSAxam4EuGfwnoiz8WdwJzUmxe1kx21FxG9xedz8hw9yq3a4EuCwQwCxq1zwCCwjFFpobQUTwJBGEpiwzlwXyXwZwu8sxF3bwExm3G4UhwXxW9wgo9oO1Wxu0zoO12ypUuwg88EeAUpK19xmu2C2l0Fz98W2e2i3mbgrzUiwExq1yxJUpx2awCx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sq6UfEO32fxiFUd8bGwgUy1kx6bCyUhzawLCyKbwzweau0Jo6-1FAyo884KeCK2q362u1dxW6U98a85Ou0DU7i1TwUw&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25134&lsd=nZD2aEOcch1tFKEE4sGoAT&__spin_r=1013767953&__spin_b=trunk&__spin_t=1716646518&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AccountQualityHubAssetViewQuery&variables=%7B%22assetOwnerId%22%3A%223365254127037950%22%2C%22assetId%22%3A%22' +
                adInfo.adId +
                '%22%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=6875615999208668',
              method: 'POST',
            },
          )
          const thongTinChiTiet = _0x1f0f37.json
          const thongTinHanChe = thongTinChiTiet?.data?.adAccountData?.advertising_restriction_info
          if (!thongTinHanChe) {
            trangThaiTaiKhoan2 = null
          } else {
            // Kiểm tra các loại hạn chế và đặt trạng thái tương ứng
            if (
              thongTinHanChe.ids_issue_type === 'AD_ACCOUNT_ALR_DISABLE' &&
              thongTinHanChe.status === 'APPEAL_PENDING'
            ) {
              trangThaiTaiKhoan2 = 4 // Đang kháng nghị
            }
            if (
              thongTinHanChe.ids_issue_type === 'AD_ACCOUNT_ALR_DISABLE' &&
              (thongTinHanChe.status === 'VANILLA_RESTRICTED' ||
                thongTinHanChe.status === 'APPEAL_REJECTED')
            ) {
              trangThaiTaiKhoan2 = 5 // Bị hạn chế hoặc kháng nghị bị từ chối
            }
            if (
              thongTinHanChe.ids_issue_type === 'PREHARM_AD_ACCOUNT_BANHAMMER' &&
              thongTinHanChe.status === 'APPEAL_INCOMPLETE'
            ) {
              trangThaiTaiKhoan2 = 6 // Hạn chế chưa hoàn thành kháng nghị
            }
            if (
              thongTinHanChe.ids_issue_type === 'PREHARM_AD_ACCOUNT_BANHAMMER' &&
              thongTinHanChe.status === 'APPEAL_REJECTED'
            ) {
              trangThaiTaiKhoan2 = 7 // Hạn chế và kháng nghị bị từ chối
            }
          }
        }
      } catch (error) {
        _0x4c4040('message', { message: 'Check lỗi' })
        console.log(error)
      }
      _0x4c4040('status', { status: [trangThaiTaiKhoan1, trangThaiTaiKhoan2] })
      _0x567957()
    })
  }

  getCard(adId) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch2('https://business.facebook.com/api/graphql/?_flowletID=1', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            `variables={"paymentAccountID":"${adId}"}` +
            `&doc_id=5746473718752934` +
            `&__user=${this.uid}` +
            `&fb_dtsg=${this.dtsg}` +
            `&__a=1&__req=s&__rev=1010282616&__spin_r=1010282616&__spin_b=trunk&__spin_t=1702003435`,
        })

        const json = res.json

        if (json?.errors || json?.error)
          addToast(`❌ Lỗi lấy thẻ: ${json?.errors?.[0]?.message || json?.error}`, 'error')

        const cards =
          json.data?.billable_account_by_payment_account?.billing_payment_account
            ?.billing_payment_methods || []
        resolve(cards)
      } catch (err) {
        reject(err)
      }
    })
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 9) + 1
  }
  updateCardCount(cardKey, status, retry = 5) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < retry; i++) {
        try {
          let storedCard = JSON.parse(localStorage.getItem(cardKey))

          // Nếu dữ liệu không tồn tại, khởi tạo mới
          if (!storedCard || typeof storedCard.count !== 'number') {
            storedCard = { count: 0 }
          }
          if (status) {
            storedCard.count += 1 // Tăng số lượng thẻ
          } else {
            storedCard.count -= 1
          }

          // Lưu lại dữ liệu mới vào localStorage
          localStorage.setItem(cardKey, JSON.stringify(storedCard))

          resolve(storedCard.count) // ✅ Trả về giá trị count mới và kết thúc Promise
          return
        } catch (error) {
          console.error('Lỗi khi cập nhật thẻ, thử lại...', error)
          await new Promise((res) => setTimeout(res, 100)) // Đợi 100ms rồi thử lại
        }
      }
      reject(new Error('Không thể cập nhật số lượng thẻ sau nhiều lần thử!')) // ❌ Báo lỗi nếu thất bại
    })
  }

  currentProgress = 0
  progressInterval = null
  targetProgress = 0

  updateLoadingProgress(targetPercentage) {
    const loadingElement = document.getElementById('loadingData')
    if (!loadingElement) return

    const percentTarget = Math.round(targetPercentage)

    // Nếu target mới nhỏ hơn current => bỏ qua (hoặc cho phép giảm thì xử lý riêng)
    if (percentTarget <= fb.currentProgress) return

    // Cập nhật target mới
    fb.targetProgress = percentTarget

    // Nếu chưa có interval thì bắt đầu chạy
    if (!fb.progressInterval) {
      fb.progressInterval = setInterval(() => {
        if (fb.currentProgress < fb.targetProgress) {
          fb.currentProgress++
          loadingElement.style.setProperty('--progress-value', fb.currentProgress)
        } else {
          clearInterval(fb.progressInterval)
          fb.progressInterval = null
        }
      }, 100)
    }
  }
  loadAds(settings) {
    return new Promise(async (_0x3a98dc, _0x21b95a) => {
      try {
        const _0x1d83c4 = settings.loadMethod
        const _0x1d83c5 = settings.accountSelect
        const _0x354a4b = settings.hiddenAccounts
        const _0x32f813 = settings.idList
        const _0xac0386 = settings.bmIdList
        const _0x65ee0b = settings.pageCount || 500
        if (_0x1d83c4 === 'byId') {
          $(document).trigger('addAccount', [
            _0x32f813.map((_0x11010c) => {
              const _0x1ece5d = {
                status: '-',
                account: 'Unknown',
                adId: _0x11010c,
              }
              return _0x1ece5d
            }),
          ])
        } else if (_0x1d83c4 === 'byBmId') {
          loadingDataAds()
          await fbtkqc.getBmAdsAccount(_0xac0386)
        } else if (_0x1d83c4 === 'bmlist') {
          loadingDataAds()
          await fbtkqc.getBmAdsAccount(_0x1d83c5)
        } else {
          loadingDataAds()
          const accounts = await fbtkqc.getAdAccounts(_0x354a4b, _0x65ee0b)
          const event = new CustomEvent('addAccount', { detail: accounts })
          document.dispatchEvent(event)
          // Thêm một khoảng chờ nhỏ để giả lập thời gian tải dữ liệu
          // và đảm bảo người dùng thấy được trạng thái "Đang tải..."
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }

        const doneEvent = new CustomEvent('loadDone')
        document.dispatchEvent(doneEvent)
        _0x3a98dc()
      } catch (_0x3cc1a8) {
        console.log(_0x3cc1a8)
      }
    })
  }
  loadBm() {
    return new Promise(async (_0x17cf6f, _0x54d324) => {
      try {
        // const _0x2e06af = (await getLocalStorage("dataBm_" + fb.uid)) || [];
        // if (_0x2e06af.length > 0) {
        //     $(document).trigger("loadSavedBm", [_0x2e06af]);
        // } else {}
        const _0x4e69f4 = await getSetting()
        const _0x32b058 = _0x4e69f4.loadBm?.listBmIds?.value?.split(/\r?\n|\r|\n/g)
        if (_0x4e69f4.loadBm.type.value === 'id') {
          await fbbm.getBm(_0x4e69f4.loadBm.page.value, _0x32b058)
        } else {
          await fbbm.getBm(_0x4e69f4.loadBm.page.value, [])
        }
        $(document).trigger('saveData')

        _0x17cf6f()
      } catch (_0x59fd69) {
        console.log(_0x59fd69)
        _0x54d324(_0x59fd69)
      }
    })
  }

  getPage() {
    return new Promise(async (resolve, reject) => {
      try {
        const pageToBMMap = {}
        const ownedPageIds = new Set()
        const allPages = []
        const bmRes = await fetch2(
          `https://graph.facebook.com/v17.0/me/businesses?access_token=${fb.accessToken2}`,
        )
        const bmJson = await bmRes.json
        const businessList = bmJson.data || []
        for (const bm of businessList) {
          const bmId = bm.id
          const ownedRes = await fetch2(
            `https://graph.facebook.com/v19.0/${bmId}?fields=owned_pages.limit(100){id}&access_token=${fb.accessToken2}`,
          )
          const ownedJson = await ownedRes.json
          const ownedPages = ownedJson.owned_pages?.data || []

          for (const page of ownedPages) {
            pageToBMMap[page.id] = { id: bmId, name: bm.name }
            ownedPageIds.add(page.id)
          }
          const clientRes = await fetch2(
            `https://graph.facebook.com/v19.0/${bmId}?fields=client_pages.limit(100){id}&access_token=${fb.accessToken2}`,
          )
          const clientJson = await clientRes.json
          const clientPages = clientJson.client_pages?.data || []

          for (const page of clientPages) {
            if (!ownedPageIds.has(page.id)) {
              pageToBMMap[page.id] = { id: bmId, name: bm.name }
            }
          }
        }
        const pageRes = await fetch2(
          `https://graph.facebook.com/me/accounts?type=page&fields=id,additional_profile_id,birthday,name,likes,followers_count,is_published,page_created_time,business,perms&access_token=${fb.accessToken}`,
        )
        const pageJson = await pageRes.json
        const personalPages = pageJson.data || []
        const finalPages = personalPages.map((p) => ({
          id: p.id,
          name: p.name || '',
          followers_count: p.followers_count || 0,
          likes: p.likes || 0,
          fan_count: p.fan_count || 0,
          perms: p.perms || [],
          business: pageToBMMap[p.id] || null,
          isInvited: !ownedPageIds.has(p.id),
        }))
        resolve(finalPages)
      } catch (err) {
        console.error('Lỗi getPage:', err)
        reject(err)
      }
    })
  }
  getPost(idpages) {
    return new Promise(async (_0x185a77, _0x2d4926) => {
      try {
        const _0x5c31e4 = await fetch2(
          'https://graph.facebook.com/v16.0/' +
            idpages +
            '/posts?fields=call_to_action,message,is_eligible_for_promotion,promotable_id,attachments.limit(10){description,description_tags,media,media_type,target,title,type,subattachments,unshimmed_url,url},likes.summary(total_count),shares,comments.summary(total_count).limit(0)&access_token=' +
            this.accessToken,
        )
        const _0x4d3c45 = _0x5c31e4.json.data
        _0x185a77(_0x4d3c45)
      } catch {
        _0x2d4926()
      }
    })
  }
  checkPage(_0x2e815e) {
    return new Promise(async (_0x37c9eb, _0x296c6b) => {
      let _0xcc6bde = ''
      try {
        const _0x17bdcf = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body:
            'av=' +
            fb.uid +
            '&__user=' +
            fb.uid +
            '&__a=1&__req=1&__hs=19552.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1007841040&__s=779bk7%3Adtflwd%3Al2ozr1&__hsi=7255550840262710485&__dyn=7xeUmxa2C5rgydwn8K2abBWqxu59o9E4a2i5VGxK5FEG484S4UKewSAxam4EuGfwnoiz8WdwJzUmxe1kx21FxG9xedz8hwgo5qq3a4EuCwQwCxq1zwCCwjFFpobQUTwJHiG6kE8RoeUKUfo7y78qgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2C4oW2e2i3mbxOfxa2y5E5WUru6ogyHwyx6i8wxK2efK2W1dx-q4VEhG7o4O1fwQzUS2W2K4E5yeDyU52dCgqw-z8c8-5aDBwEBwKG13y85i4oKqbDyoOEbVEHyU8U3yDwbm1Lwqp8aE4KeCK2q362u1dxW10w8mu&__csr=&fb_dtsg=' +
            fb.dtsg +
            '&jazoest=25578&lsd=pdtuMMg6hmB03Ocb2TuVkx&__spin_r=1007841040&__spin_b=trunk&__spin_t=1689314572&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AccountQualityHubAssetViewV2Query&variables=%7B%22assetOwnerId%22%3A%22' +
            fb.uid +
            '%22%2C%22assetId%22%3A%22' +
            _0x2e815e +
            '%22%7D&server_timestamps=true&doc_id=6228297077225495',
          method: 'POST',
        })
        const _0x473f4c = _0x17bdcf.json
        if (
          _0x473f4c.data.pageData.advertising_restriction_info.status === 'APPEAL_REJECTED_NO_RETRY'
        ) {
          _0xcc6bde = 1
        }
        if (_0x473f4c.data.pageData.advertising_restriction_info.status === 'VANILLA_RESTRICTED') {
          _0xcc6bde = 2
        }
        if (_0x473f4c.data.pageData.advertising_restriction_info.status === 'APPEAL_PENDING') {
          _0xcc6bde = 3
        }
        if (_0x473f4c.data.pageData.advertising_restriction_info.status === 'NOT_RESTRICTED') {
          _0xcc6bde = 4
        }
        if (
          _0x473f4c.data.pageData.advertising_restriction_info.restriction_type ===
          'BI_IMPERSONATION'
        ) {
          _0xcc6bde = 5
        }
        if (
          !_0x473f4c.data.pageData.advertising_restriction_info.is_restricted &&
          _0x473f4c.data.pageData.advertising_restriction_info.restriction_type === 'ALE'
        ) {
          _0xcc6bde = 6
        }
      } catch {}
      _0x37c9eb(_0xcc6bde)
    })
  }
  loadPage(onProgress) {
    return new Promise(async (resolve, reject) => {
      try {
        if (window.pageGridApi) {
          window.pageGridApi.setRowData([])
        }

        fb.updateLoadingProgress(35)

        fb.updateLoadingProgress(40)
        const pageList = await this.getPage()
        $(document).trigger('loadPageSuccess', [pageList])

        const checkPageStatus = (page) => {
          return new Promise(async (res) => {
            try {
              fb.updateLoadingProgress(50)
              const status = await this.checkPage(page.id)
              const data = {
                id: page.id,
                status,
              }
              $(document).trigger('updatePageStatus', [data])
            } catch {}
            res()
          })
        }

        fb.updateLoadingProgress(70)

        let pageProcessed = 0
        const total = pageList.length

        const tasks = pageList.map((page) => {
          return new Promise(async (res) => {
            await checkPageStatus(page)
            pageProcessed++

            if (typeof onProgress === 'function') {
              onProgress({
                pageProcessed,
                total,
              })
            }

            res()
          })
        })

        await Promise.all(tasks)
        fb.updateLoadingProgress(90)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
  loadGroup() {
    return new Promise(async (_0x3a7875, _0x4a5828) => {
      try {
        const _0x1bce61 = (await getLocalStorage('dataGroup_' + fb.uid)) || []
        if (_0x1bce61.length > 0) {
          $(document).trigger('loadSavedGroup', [_0x1bce61])
        } else {
          const _0x2a2db2 = await this.getGroup()
          $(document).trigger('loadGroupSuccess', [_0x2a2db2])
        }
        _0x3a7875()
      } catch {
        _0x4a5828()
      }
    })
  }
  getInvites() {
    return new Promise(async (_0x3eccf3, _0x4a86a1) => {
      let _0xb7785f = []
      try {
        const _0x28c2f1 = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'av=' +
            this.uid +
            '&__aaid=0&__user=' +
            this.uid +
            '&__a=1&__req=1n&__hs=19809.HYP2%3Acomet_pkg.2.1..2.1&dpr=1&__ccg=GOOD&__rev=1012346269&__s=hlz3t5%3Aqps39g%3Aphae8m&__hsi=7350991099154827576&__dyn=7AzHK4HwBgDx-5Q1ryaxG4Qih09y2O5U4e2CEf9UKbgS3qi7UK360CEboG4E762S1DwUx60xU8k1sw9u0LVEtwMw65xO321Rwwwg8a8462mcw8a1TwgEcEhwGxu782lwj8bU9kbxS210hU31wiE567Udo5qfK0zEkxe2Gexe5E5e7oqBwJK2W5olwUwOzEjUlDw-wQK2616DBx_xWcwoE2mBwFKq2-azo6O14wwwOg2cwMwhEkxebwHwNxe6Uak2-1vwxyo566k1FwgU4q3G3WfKufxa3m7E&__csr=gtgoR2fk4IQZjElbEttlNidNa5h6yN29bOhdvRqaJGBjNQJidZ8Fz9RFGpCkGKJlZ4iOFfFXjmt6GFaFHLt4ABQh4RF997pnjhpGAJER7l5qZCinDRgJkBVanABnh9uZmVppd4QXjLybXvK-KrApp5z8y9FenWRjyBznyFCrGVbGGAAVUTVUgyBhWyV8zxi4p9UqAzUmx2uczrpK-7RCKagCiW-hmcgC4otwNAxeUC4EfF9rUKu9zeexmlabADxycG32E8Qdxi8AwAKFUKUhwyxiu58y2a3y7UmUvg9pHh8lDwhUC5UaJ1ui4-9wLwOwQwKzBwEK8z8KdK5UyUqxO291i4orxuexTAwFxC225EhwtVFA5Egxe3xei8w8Si0jW9KEG4WwUG8h8K2B0Gx0iqaEE8Q3qESB6PRAGl4OQ8AbkJQwyEbonw8aewjA19UaU2MwYgSq9tt1DgCcwjo6q2a0z9rCwLxZx1wbW1owcK19wjA2y58lic3O227Udo6-0HUc8VyHCyFU56Ue-fyqhpU0Li06ro34w32UC1nDw18i8xm0MXwzwcW0fjU6J03dU0P201M8wr804X20H40kyCewh8iBG0rSQ5U5e1lwzg1Fk1awyxu0bdw7tw1Au0P83pw12a68K0LqUqw7hw189wdm0QU0jbw6dwKx61nwlo14Uy0dwg0WW0e5AG0dSo4Whyo3zw1Ni3Nw2041rxe5to2Xwd60mq8yEc8F1504Jziw1iu1Uw16au8w&__comet_req=15&fb_dtsg=' +
            this.dtsg +
            '&jazoest=25312&lsd=EM5XT5VIDQF8uzBNd5t2fD&__spin_r=1012346269&__spin_b=trunk&__spin_t=1711535989&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=PageCometLaunchpointInvitesRootQuery&variables=%7B%22id%22%3A%22' +
            this.uid +
            '%22%7D&server_timestamps=true&doc_id=7224925170868877',
        })
        const _0x5c9af5 = _0x28c2f1.json
        _0xb7785f = _0x5c9af5.data.user.profile_admin_invites.map((_0x335519) => {
          const _0x494fa7 = {
            inviteId: _0x335519.profile_admin_invite_id,
            pageId: _0x335519.profile_admin_inviter.id,
          }
          return _0x494fa7
        })
      } catch (_0xcd7e40) {
        console.log(_0xcd7e40)
      }
      _0x3eccf3(_0xb7785f)
    })
  }
  acceptPage(_0x524fee) {
    return new Promise(async (_0x491c8e, _0x2565f4) => {
      try {
        const _0x2a88ef = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'av=' +
            this.uid +
            '&__aaid=0&__user=' +
            this.uid +
            '&__a=1&__req=1t&__hs=19809.HYP2%3Acomet_pkg.2.1..2.1&dpr=1&__ccg=GOOD&__rev=1012346269&__s=58dfwt%3Aqps39g%3Ad4ou37&__hsi=7350991530179737815&__dyn=7AzHK4HwkEng5K8G6EjBAg2owIxu13wFwnUW3q2ibwNw9G2Saw8i2S1DwUx60GE3Qwb-q7oc81xoswMwto886C11wBz83WwgEcEhwGxu782lwv89kbxS2218wc61awkovwRwlE-U2exi4UaEW2G1jxS6FobrwKxm5o7G4-5pUfEe88o4Wm7-7EO0-poarCwLyES1Iwh888cA0z8c84q58jyUaUcojxK2B08-269wkopg6C13whEeE4WVU-4Edouw&__csr=gtgoR6itgmjRlEnTIrsKx3dOi8l4qTP8AL9kHvRqayGBjEnOH8T8K8Fd9paDDi8EBRVkLqjW-8m8ypWFADQiimXh8JetCmbDUCPoJ2HozHDHy-mdKaABx24payV8izXLHzobUS7ERwKBGaxqUozosyd2U9FpUO58mx27VEzKU89EWaAKq9zoC18xy68ym1rx62-5ob85a17zk1Txi7898fWxO1HAxS0B81dEiAwCwo88Ukw50w-w7bw5hw1jy0oG0ii1So88mwEwd2037a07j40XpU092U03g4g0TKQ5U5e1lwzg0yO04GU0p7wcO0So04va09Yw0pPk1rxe5to6m1lw2go0sXw3oU&__comet_req=15&fb_dtsg=' +
            this.dtsg +
            '&jazoest=25593&lsd=DKpGY6WjRs4LdeRqjPDpX2&__spin_r=1012346269&__spin_b=trunk&__spin_t=1711536089&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=ProfilePlusCometAcceptOrDeclineAdminInviteMutation&variables=%7B%22input%22%3A%7B%22client_mutation_id%22%3A%221%22%2C%22actor_id%22%3A%22' +
            this.uid +
            '%22%2C%22is_accept%22%3Atrue%2C%22profile_admin_invite_id%22%3A%22' +
            _0x524fee.inviteId +
            '%22%2C%22user_id%22%3A%22' +
            this.uid +
            '%22%7D%2C%22scale%22%3A1%2C%22__relay_internal__pv__VideoPlayerRelayReplaceDashManifestWithPlaylistrelayprovider%22%3Afalse%7D&server_timestamps=true&doc_id=25484830601161332',
        })
        const _0x51218f = _0x2a88ef.json
        if (_0x51218f.data.accept_or_decline_profile_plus_admin_invite.id === this.uid) {
          _0x491c8e()
        } else {
          _0x2565f4()
        }
      } catch (_0x3169c2) {
        _0x2565f4(_0x3169c2)
      }
    })
  }
  getAccountQuality() {
    return new Promise(async (_0x22e811, _0x2ef3b4) => {
      try {
        const _0x1cd74a = await fetch2(
          'https://www.facebook.com/api/graphql/?_flowletID=1&_triggerFlowletID=2',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              this.uid +
              '&__usid=6-Tsas5n6h0it5h%3APsas5n4jqrxdy%3A0-Asas5ms1bzoc6y-RV%3D6%3AF%3D&session_id=2791d1615dda0cb8&__aaid=0&__user=' +
              this.uid +
              '&__a=1&__req=1&__hs=19805.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1012251909&__s=p9dz00%3A3ya0mx%3Aafup89&__hsi=7349388123137635674&__dyn=7xeUmxa2C5rgydwn8K2abBAjxu59o9E6u5VGxK5FEG484S4UKewSAxam4EuGfwnoiz8WdwJzUmxe1kx21FxG9xedz8hw9yq3a4EuCwQwCxq1zwCCwjFFpobQUTwJBGEpiwzlwXyXwZwu8sxF3bwExm3G4UhwXxW9wgo9oO1Wxu0zoO12ypUuwg88EeAUpK19xmu2C2l0Fx6ewzwAwRyQ6U-4Ea8mwoEru6ogyHwyx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sq6UfEO32fxiFUd8bGwgUy1kx6bCyVUCcG2-qaUK2e18w9Cu0Jo6-4e1mAyo884KeCK2q362u1dxW6U98a85Ou0DU7i&__csr=&fb_dtsg=' +
              this.dtsg +
              '&jazoest=25334&lsd=' +
              this.lsd +
              '&__spin_r=1012251909&__spin_b=trunk&__spin_t=1711162767&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AccountQualityHubAssetOwnerViewQuery&variables=%7B%22assetOwnerId%22%3A%22' +
              this.uid +
              '%22%7D&server_timestamps=true&doc_id=7327539680662016',
            method: 'POST',
          },
        )
        const _0x24e03a = _0x1cd74a.json
        if (!_0x24e03a.errors) {
          let _0x125742 = 'N/A'
          let _0x1b2e4e = ''
          const _0x14b14c = _0x24e03a.data.assetOwnerData.advertising_restriction_info.is_restricted
          const _0x2bb129 = _0x24e03a.data.assetOwnerData.advertising_restriction_info.status
          const _0x4bcc20 =
            _0x24e03a.data.assetOwnerData.advertising_restriction_info.restriction_type
          if (!_0x14b14c) {
            if (_0x4bcc20 == 'PREHARM' && _0x2bb129 == 'APPEAL_ACCEPTED') {
              _0x125742 = 'Tích Xanh XMDT'
              _0x1b2e4e = 'success'
            }
            if (_0x4bcc20 == 'ALE' && _0x2bb129 == 'APPEAL_ACCEPTED') {
              _0x125742 = 'Tích Xanh 902'
              _0x1b2e4e = 'success'
            }
            if (_0x2bb129 == 'NOT_RESTRICTED') {
              _0x125742 = 'Live Ads - Không Sao Cả'
              _0x1b2e4e = 'success'
            }
            if (_0x4bcc20 == 'ADS_ACTOR_SCRIPTING') {
              _0x125742 = 'Tích xanh XMDT ẩn tích'
              _0x1b2e4e = 'success'
            }
            if (_0x2bb129 == 'NOT_RESTRICTED' && _0x4bcc20 == 'BUSINESS_INTEGRITY') {
              _0x125742 = 'Tích xanh 902 ẩn tích'
              _0x1b2e4e = 'success'
            }
          } else {
            if (_0x2bb129 == 'VANILLA_RESTRICTED' && _0x4bcc20 == 'BUSINESS_INTEGRITY') {
              _0x125742 = 'HCQC 902 XMDT'
              _0x1b2e4e = 'danger'
            }
            if (_0x2bb129 == 'APPEAL_INCOMPLETE' && _0x4bcc20 == 'BUSINESS_INTEGRITY') {
              _0x125742 = 'XMDT 902 CHƯA XONG'
              _0x1b2e4e = 'danger'
            }
            if (_0x2bb129 == 'APPEAL_PENDING' && _0x4bcc20 == 'BUSINESS_INTEGRITY') {
              _0x125742 = 'Đang Kháng 902'
              _0x1b2e4e = 'danger'
            }
            if (_0x2bb129 == 'APPEAL_REJECTED' && _0x4bcc20 == 'BUSINESS_INTEGRITY') {
              _0x125742 = 'HCQC 902 xịt - Xmdt lại 273'
              _0x1b2e4e = 'danger'
            }
            if (_0x14b14c && _0x4bcc20 == 'PREHARM') {
              if (_0x2bb129 == 'VANILLA_RESTRICTED') {
                _0x125742 = 'Hạn Chế Quảng Cáo'
                _0x1b2e4e = 'danger'
              }
              if (_0x2bb129 == 'APPEAL_PENDING') {
                _0x125742 = 'Đang kháng XMDT'
                _0x1b2e4e = 'danger'
              }
              if (_0x2bb129 == 'APPEAL_INCOMPLETE') {
                _0x125742 = 'Xmdt Chưa Xong'
                _0x1b2e4e = 'danger'
              }
              if (
                _0x2bb129 == 'APPEAL_REJECTED_NO_RETRY' ||
                _0x2bb129 == 'APPEAL_TIMEOUT' ||
                _0x2bb129 == 'APPEAL_TIMEOUT'
              ) {
                _0x125742 = 'XMDT Xịt - Xmdt lại 273'
                _0x1b2e4e = 'danger'
              }
            }
            if (_0x14b14c && _0x4bcc20 == 'ALE') {
              if (_0x2bb129 == 'APPEAL_PENDING') {
                _0x125742 = 'Đang Kháng 902'
                _0x1b2e4e = 'warning'
              }
              if (_0x2bb129 == 'APPEAL_REJECTED_NO_RETRY') {
                _0x125742 = 'HCQC Vĩnh Viễn'
                _0x1b2e4e = 'danger'
              }
              const _0x133585 =
                _0x24e03a.data.assetOwnerData.advertising_restriction_info.additional_parameters
                  .ufac_state
              const _0xe4b1c0 =
                _0x24e03a.data.assetOwnerData.advertising_restriction_info.additional_parameters
                  .appeal_friction
              const _0x23704a =
                _0x24e03a.data.assetOwnerData.advertising_restriction_info.additional_parameters
                  .appeal_ineligibility_reason
              if (
                (_0x2bb129 == 'VANILLA_RESTRICTED' && _0x133585 == 'FAILED') ||
                (_0x2bb129 == 'VANILLA_RESTRICTED' && _0x133585 == 'TIMEOUT')
              ) {
                _0x125742 = 'HCQC 902 xịt - Xmdt lại 273'
                _0x1b2e4e = 'danger'
              }
              if (_0x2bb129 == 'VANILLA_RESTRICTED' && _0x133585 == null && _0xe4b1c0 == 'UFAC') {
                _0x125742 = 'HCQC 902 XMDT'
                _0x1b2e4e = 'danger'
              }
              if (
                _0x2bb129 == 'VANILLA_RESTRICTED' &&
                _0x133585 == null &&
                _0xe4b1c0 == null &&
                _0x23704a == 'ENTITY_APPEAL_LIMIT_REACHED'
              ) {
                _0x125742 = 'HCQC 902 xịt - Xmdt lại 273'
                _0x1b2e4e = 'danger'
              } else {
                if (_0x2bb129 == 'VANILLA_RESTRICTED' && _0x133585 == null && _0xe4b1c0 == null) {
                  _0x125742 = 'HCQC 902 Chọn Dòng'
                  _0x1b2e4e = 'danger'
                }
                if (
                  _0x2bb129 == 'VANILLA_RESTRICTED' &&
                  _0x133585 == 'SUCCESS' &&
                  _0xe4b1c0 == null
                ) {
                  _0x125742 = 'HCQC 902 Chọn Dòng'
                  _0x1b2e4e = 'danger'
                }
              }
            }
            if ((_0x14b14c && _0x4bcc20 == 'ACE') || _0x4bcc20 === 'GENERIC') {
              _0x125742 = 'XMDT Xịt - Xmdt lại 273'
              _0x1b2e4e = 'danger'
            }
            if (
              (_0x14b14c && _0x4bcc20 == 'RISK_REVIEW') ||
              _0x4bcc20 === 'RISK_REVIEW_EMAIL_VERIFICATION'
            ) {
              _0x125742 = 'XMDT Checkpoint'
              _0x1b2e4e = 'danger'
            }
            if (_0x4bcc20 == 'ADS_ACTOR_SCRIPTING') {
              if (_0x2bb129 == 'APPEAL_REJECTED') {
                _0x125742 = 'XMDT Xịt - Xmdt lại 273'
                _0x1b2e4e = 'danger'
              } else if (_0x2bb129 == 'APPEAL_PENDING') {
                _0x125742 = 'Đang kháng XMDT'
                _0x1b2e4e = 'warning'
              } else if (_0x2bb129 == 'APPEAL_ACCEPTED') {
                _0x125742 = 'Tích Xanh 902'
                _0x1b2e4e = 'success'
              } else if (_0x2bb129 == 'APPEAL_INCOMPLETE') {
                _0x125742 = 'Xmdt Chưa Xong'
                _0x1b2e4e = 'danger'
              } else {
                _0x125742 = 'Hạn Chế Quảng Cáo'
                _0x1b2e4e = 'danger'
              }
            }
          }
          const _0xe340e9 = {
            status: _0x125742,
            color: _0x1b2e4e,
          }
          _0x22e811(_0xe340e9)
        } else {
          _0x2ef3b4(_0x24e03a.errors[0].summary)
        }
      } catch (_0x54b94c) {
        _0x2ef3b4(_0x54b94c)
      }
    })
  }
  getLinkAn() {
    return new Promise(async (_0x42a32d, _0x5a9520) => {
      try {
        const _0x5e4b4c = await fetch2('https://business.facebook.com/api/graphql/?_flowletID=1', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'av=' +
            this.uid +
            '&__usid=6-Ts626y2arz8fg%3APs626xy1mafk6f%3A0-As626x5t9hdw-RV%3D6%3AF%3D&session_id=3f06e26e24310de8&__user=' +
            this.uid +
            '&__a=1&__req=1&__hs=19713.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010574318&__s=bgx31o%3A93y1un%3Aj1i0y0&__hsi=7315329750708113449&__dyn=7xeUmxa2C5ryoS1syU8EKmhG5UkBwqo98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczEeU-5Ejwl8gwqoqyojzoO4o2oCwOxa7FEd89EmwoU9FE4Wqmm2ZedUbpqG6kE8RoeUKUfo7y78qgOUa8lwWxe4oeUuyo465o-0xUnw8ScwgECu7E422a3Gi6rwiolDwjQ2C4oW2e1qyQ6U-4Ea8mwoEru6ogyHwyx6i8wxK3eUbE4S7VEjCx6Etwj84-224U-dwKwHxa1ozFUK1gzpErw-z8c89aDwKBwKG13y85i4oKqbDyoOEbVEHyU8U3yDwbm1Lx3wlF8C221bzFHwCwNwDwjouxK2i2y1sDw9-&__csr=&fb_dtsg=' +
            this.dtsg +
            '&jazoest=25595&lsd=XBGCglH3K63SPddlSyNKgf&__aaid=0&__bid=745415083846542&__spin_r=1010574318&__spin_b=trunk&__spin_t=1703232934&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AccountQualityHubAssetOwnerViewQuery&variables=%7B%22assetOwnerId%22%3A%22' +
            this.uid +
            '%22%7D&server_timestamps=true&doc_id=24196151083363204',
        })
        const _0x111d91 = _0x5e4b4c.json
        const _0x2170f8 =
          _0x111d91.data.assetOwnerData.advertising_restriction_info.additional_parameters
            ?.paid_actor_root_appeal_container_id
        const _0x475b08 =
          _0x111d91.data.assetOwnerData.advertising_restriction_info.additional_parameters
            ?.decision_id
        const _0x206842 =
          _0x111d91.data.assetOwnerData.advertising_restriction_info.additional_parameters
            ?.friction_decision_id
        const _0x1e9602 =
          _0x111d91.data.assetOwnerData.advertising_restriction_info.ids_issue_ent_id
        if (_0x2170f8) {
          const _0x5ae862 = await fetch2(
            'https://business.facebook.com/accountquality/ufac/?entity_id=' +
              this.uid +
              '&paid_actor_root_appeal_container_id=' +
              _0x2170f8 +
              '&entity_type=3&_callFlowletID=2181&_triggerFlowletID=2181',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                '__usid=6-Tsc6xu718a07sn%3APsc6xui6pgn2f%3A0-Asc6xtp1nh4rnc-RV%3D6%3AF%3D&session_id=15e5a69ec0978238&__aaid=0&__bid=' +
                this.uid +
                '&__user=' +
                this.uid +
                '&__a=1&__req=u&__hs=19832.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1012906458&__s=9ubr7j%3Arv9koe%3Ads4ihh&__hsi=7359564425697670285&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhe5UkBwCwpUnCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx60C9EcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo462mcwuEnw8ScwgECu7E422a3Fe6rwiolDwFwBgak48W2e2i3mbgrzUiwExq1yxJUpx2awCx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sq6UfEO32fxiFUd8bGwgUy1kx6bCyVUCcG2-qaUK2e0UFU2RwrU6CiVo884KeCK2q362u1dxW6U98a85Ou0DU7i1Tw&__csr=&fb_dtsg=' +
                this.dtsg +
                '&jazoest=25352&lsd=MPaEvH-IKd3rimyUrjtr5C&__spin_r=1012906458&__spin_b=trunk&__spin_t=1713532122&__jssesw=1',
              method: 'POST',
            },
          )
          const _0x280785 = JSON.parse(_0x5ae862.text.replace('for (;;);', ''))
          const _0x470f7f = _0x280785.payload.enrollment_id
          _0x42a32d(_0x470f7f)
        } else if (_0x475b08) {
          const _0x5cb016 = await fetch2(
            'https://www.facebook.com/accountquality/ufac/?decision_id=' +
              _0x475b08 +
              '&ids_issue_id=' +
              _0x1e9602 +
              '&entity_type=5&entity_id=' +
              this.uid +
              '&_flowletID=9999',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                '__usid=6-Ts2rbmo1223bxs:Ps2rbmm1pafisj:0-As2rbmcwf48js-RV=6:F=&session_id=4d371069f94ed908&__user=' +
                this.uid +
                '&__a=1&__req=q&__hs=19649.BP:DEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009336620&__s=vkojb0:tpoa7e:m367w6&__hsi=7291509895584633584&__dyn=7xeUmxa2C5rgydwCwRyU8EKnFG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx611wlFEcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyUszUiwExq1yxJUpx2aK2a4p8y26U8U-UbE4S7VEjCx6Etwj84-3ifzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzwi82pDwbm1Lx3wlFbBwwwiUWqU9Eco9U4S7ErwAwEwn9U&__csr=&fb_dtsg=' +
                this.dtsg +
                '&jazoest=25489&lsd=QTfKpPcJRl9RAFTWridNry&__aaid=0&__spin_r=1009336620&__spin_b=trunk&__spin_t=1697686941',
            },
          )
          const _0x526afc = JSON.parse(_0x5cb016.text.replace('for (;;);', ''))
          const _0xc57d4 = _0x526afc.payload.enrollment_id
          _0x42a32d(_0xc57d4)
        } else if (_0x206842) {
          const _0x5a143a = await fetch2(
            'https://www.facebook.com/accountquality/ufac/?decision_id=' +
              _0x206842 +
              '&ids_issue_id=' +
              _0x1e9602 +
              '&entity_type=5&entity_id=' +
              this.uid +
              '&_flowletID=2169',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                '__usid=6-Ts32udfp2ieqb%3APs32udrqbzoxh%3A0-As32ud2p8mux0-RV%3D6%3AF%3D&session_id=2478ab408501cdea&__user=' +
                this.uid +
                '&__a=1&__req=u&__hs=19655.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009465523&__s=417qpb%3Alchip2%3Ayq4pb1&__hsi=7293818531390316856&__dyn=7xeUmxa2C5rgydwCwRyU8EKnFG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx611wlFEcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyUszUiwExq1yxJUpx2aK2a4p8y26U8U-UbE4S7VEjCx6Etwj84-3ifzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzwi82pDwbm15wFx3wlFbBwwwiUWqU9Eco9U4S7ErwAwEwn9U2vw&__csr=&fb_dtsg=' +
                this.dtsg +
                '&jazoest=25548&lsd=A-HDfPRVoR7YG2zHwlCDBx&__aaid=0&__spin_r=1009465523&__spin_b=trunk&__spin_t=1698224463',
            },
          )
          const _0x17063a = JSON.parse(_0x5a143a.text.replace('for (;;);', ''))
          const _0x3bcb74 = _0x17063a.payload.enrollment_id
          _0x42a32d(_0x3bcb74)
        } else {
          _0x5a9520()
        }
      } catch (_0x3d6830) {
        console.log(_0x3d6830)
        _0x5a9520(_0x3d6830)
      }
    })
  }
  createBm(_0x4a1313, _0x188bd1) {
    return new Promise(async (_0x99dc75, _0x2010c9) => {
      let _0x13d4a7 = false
      try {
        if (_0x4a1313 === '350') {
          const _0x4d5feb = await fetch2('https://business.facebook.com/api/graphql/', {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              'av=' +
              this.uid +
              '&__usid=6-Trf0mkxer7rg4%3APrf0mkv1xg9ie7%3A0-Arf0mkxurlzsp-RV%3D6%3AF%3D&__user=' +
              this.uid +
              '&__a=1&__dyn=7xeUmwkHgmwn8K2WnFwn84a2i5U4e1Fx-ewSyo9Euxa0z8S2S7o760Boe8hwem0nCq1ewcG0KEswaq1xwEwlU-0nSUS1vwnEfU7e2l0Fwwwi85W1ywnEfogwh85qfK6E28xe3C16wlo5a2W2K1HwywnEhwxwuUvwbW1fxW4UpwSyES0gq5o2DwiU8UdUco&__csr=&__req=s&__hs=19187.BP%3Abizweb_pkg.2.0.0.0.0&dpr=1&__ccg=GOOD&__rev=1005843971&__s=xpxflz%3A1mkqgj%3Avof03o&__hsi=7120240829090214250&__comet_req=0&fb_dtsg=' +
              this.dtsg +
              '&jazoest=25414&lsd=8VpPvx4KH5-Ydq-I0JMQcK&__spin_r=1005843971&__spin_b=trunk&__spin_t=mftool&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=FBEGeoBMCreation_CreateBusinessMutation&variables=%7B%22input%22%3A%7B%22client_mutation_id%22%3A%226%22%2C%22actor_id%22%3A%22' +
              this.uid +
              '%22%2C%22business_name%22%3A%22' +
              encodeURIComponent(_0x188bd1) +
              '%22%7D%7D&server_timestamps=true&doc_id=5232196050177866',
          })
          const _0x3c0b9b = _0x4d5feb.text
          if (_0x3c0b9b.includes('{"data":{"fbe_create_business":{"id":"')) {
            _0x13d4a7 = true
          }
        }
        if (_0x4a1313 === '50') {
          const _0x4007a4 = await fetch2('https://business.facebook.com/api/graphql/', {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              'fb_dtsg=' +
              this.dtsg +
              '&variables={"input":{"client_mutation_id":"4","actor_id":"' +
              this.uid +
              '","business_name":"' +
              encodeURIComponent(_0x188bd1) +
              '","user_first_name":"Meta","user_last_name":"21%20' +
              randomNumberRange(111111, 99999) +
              '","user_email":"meta21' +
              randomNumberRange(111111, 99999) +
              '@gmail.com","creation_source":"MBS_BUSINESS_CREATION_PROMINENT_HOME_CARD"}}&server_timestamps=true&doc_id=7183377418404152',
          })
          const _0x393da7 = _0x4007a4.text
          if (_0x393da7.includes('{"data":{"bizkit_create_business":{"id":"')) {
            _0x13d4a7 = true
          }
        }
        if (_0x4a1313 === 'over') {
          const _0x2ec01b = await fetch2(
            'https://business.facebook.com/business/create_account/?brand_name=' +
              encodeURIComponent(_0x188bd1) +
              '&first_name=' +
              encodeURIComponent(_0x188bd1) +
              '&last_name=21%20' +
              randomNumberRange(111111, 99999) +
              '&email=meta21' +
              randomNumberRange(111111, 99999) +
              '@gmail.com&timezone_id=132&business_category=OTHER',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                '__user=' +
                this.uid +
                '&__a=1&__dyn=7xeUmwkHg7ebwKBWo5O12wAxu13wqovzEdEc8uw9-dwJwCw4sxG4o2vwho1upE4W0OE2WxO0FE662y0umUS1vwnE2Pwk8884y1uwc63S482rwKxe0y83mwkE5G0zE5W0HUvw5rwSyES0gq0Lo6-1FwbO&__csr=&__req=1b&__hs=19300.BP:brands_pkg.2.0.0.0.0&dpr=1&__ccg=EXCELLENT&__rev=1006542795&__s=fx337t:hidf4p:qkhu11&__hsi=7162041770829218151&__comet_req=0&fb_dtsg=' +
                this.dtsg +
                '&jazoest=25796&lsd=7qUeMnkz4xy0phFCtNnkTI&__aaid=523818549297438&__spin_r=1006542795&__spin_b=trunk&__spin_t=1667542795&__jssesw=1',
            },
          )
          const _0x50bf83 = _0x2ec01b.text
          if (_0x50bf83.includes('"payload":"https:')) {
            _0x13d4a7 = true
          }
        }
      } catch (_0x371864) {
        console.log(_0x371864)
      }
      if (_0x13d4a7) {
        _0x99dc75()
      } else {
        _0x2010c9()
      }
    })
  }
  createPage(_0x30dcc1) {
    return new Promise(async (_0x192d4c, _0x1bb3ae) => {
      try {
        const _0x3794e0 = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'av=' +
            this.uid +
            '&__user=' +
            this.uid +
            '&__a=1&__req=1v&__hs=19694.HYP%3Acomet_pkg.2.1..2.1&dpr=1&__ccg=EXCELLENT&__rev=1010174206&__s=zgpvzb%3A8cqk4o%3A8gvuf9&__hsi=7308188588785296006&__dyn=7AzHK4HzE4e5Q1ryaxG4Vp62-m1xDwAxu13wFwhUngS3q5UObwNwnof8boG0x8bo6u3y4o2Gwn82nwb-q7oc81xoswIK1Rwwwg8a8465o-cwfG12wOx62G5Usw9m1YwBgK7o884y0Mo4G1hx-3m1mzXw8W58jwGzE8FU5e7oqBwJK2W5olwUwOzEjUlDw-wUwxwjFovUy2a1ywtUuBwFKq2-azqwqo4i223908O3216xi4UdUcojxK2B0oobo8oC1hxB0qo4e16wWw-zXDzU&__csr=gacagBmDE9hthJN4jQB6NT5Os_6Av7nR4IZft4RSAXAjeGOrRtmKmhHQkDWWVBhdeQhd9pumfJ2J4_gyfGymiKHKj-W8rDK-QicCy6mnh995zfZ1iiEHDWyt4JpaCAG2WehemGG8hECudmcxt5z8gBCByk9zEuDJ4hHhA48yh5WDwCxh6xe6uUGGz4EyEaoKuFUkCy9eaLCwywMUnhp9FQm3GA6VU8oix-q26kwhwVyo5Hy8oQi4obpV8cEgzFGwge3yexpzEtwm8gwNxa1RwCyVoS0PU8U1krwfm0he0A83EwbO0Eyw4sw8-16whqg31yaQ1aw8Si0gF0Yw28j06gwrU0Fa0nu020i030m0cZU0now0ac-08kDyo1j84Nk1koyeo1p80AC0h-04Z80uug0za08ew3pE5u2e2mnEM1yA1Rw2Co1vHw2sogw1hm4S13zEao0H603xC0ty4oiwiFE21w15W08nwn8EUeC5UPDw2zu16w&__comet_req=15&fb_dtsg=' +
            this.dtsg +
            '&jazoest=25563&lsd=R1sWlP5eu_-q_qVd0jpuf1&__aaid=0&__spin_r=1010174206&__spin_b=trunk&__spin_t=1701570253&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AdditionalProfilePlusCreationMutation&variables=%7B%22input%22%3A%7B%22bio%22%3A%22%22%2C%22categories%22%3A%5B%222705%22%5D%2C%22creation_source%22%3A%22comet%22%2C%22name%22%3A%22' +
            encodeURIComponent(_0x30dcc1) +
            '%22%2C%22page_referrer%22%3A%22launch_point%22%2C%22actor_id%22%3A%22' +
            this.uid +
            '%22%2C%22client_mutation_id%22%3A%223%22%7D%7D&server_timestamps=true&doc_id=5296879960418435',
        })
        const _0x3ed31d = _0x3794e0.text
        if (_0x3ed31d.includes('"page":{"id":"')) {
          const _0xc98720 = JSON.parse(_0x3794e0)
          _0x192d4c(_0xc98720.data.additional_profile_plus_create.page.id)
        } else {
          _0x1bb3ae('cccc')
        }
      } catch (_0x4b4440) {
        _0x1bb3ae(_0x4b4440)
      }
    })
  }
  getSiteKey(_0x8d92a9) {
    return new Promise(async (_0xb0b4db, _0x598c02) => {
      try {
        const _0x426932 = await fetch2(_0x8d92a9)
        const _0x634d03 = _0x426932.text
        const _0x52de1e = new DOMParser()
        const _0x18067c = _0x52de1e.parseFromString(_0x634d03, 'text/html')
        _0xb0b4db($(_0x18067c).find('.g-recaptcha').attr('data-sitekey'))
      } catch {
        _0x598c02()
      }
    })
  }
  khang902Api2(_0x17facf, _0x1c0400 = '', _0x2a75ce = {}) {
    return new Promise(async (_0x4faf2c, _0x4e47c2) => {
      const _0x3fe67a = this.dtsg
      const _0x8849d8 = '5FnEglTcQSfqnuBkn03g'
      const _0xeaa61b = this.accessToken
      const _0x4e96d0 = '902'
      const _0x2a3bce = this.uid
      let _0x23afac = _0x2a3bce
      let _0x12f901 = 5
      if (_0x1c0400) {
        _0x23afac = _0x1c0400
        _0x12f901 = 3
      }
      try {
        const _0x1efeeb = ['policy', 'unauthorized_use', 'other']
        const _0x33febe = _0x1efeeb[Math.floor(Math.random() * _0x1efeeb.length)]
        const _0x18e232 =
          _0x2a75ce.bm.chooseLine.value === 'random' ? _0x33febe : _0x2a75ce.bm.chooseLine.value
        const _0x25bbe3 =
          _0x2a75ce.bm.chooseLine.value === 'other'
            ? encodeURIComponent(_0x2a75ce.bm.noiDungKhang.value)
            : encodeURIComponent('I think there was unauthorized use of my Facebook account.')
        const _0x46a510 = {
          policy: 1,
          unauthorized_use: 2,
          other: 3,
        }
        const _0x3b6825 = _0x46a510[_0x18e232]
        if (_0x4e96d0 !== '902' && _0x4e96d0 !== '902_line') {
          return _0x4e47c2('Không thể kháng 902')
        }
        const _0x4c0966 = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryOMix6XnzisxiE316',
          },
          method: 'POST',
          body:
            '------WebKitFormBoundaryOMix6XnzisxiE316\r\nContent-Disposition:form-data;name="fb_dtsg"\r\n\r\n' +
            _0x3fe67a +
            '\r\n------WebKitFormBoundaryOMix6XnzisxiE316\r\nContent-Disposition:form-data;name="lsd"\r\n\r\n' +
            _0x8849d8 +
            '\r\n------WebKitFormBoundaryOMix6XnzisxiE316\r\nContent-Disposition:form-data;name="variables"\r\n\r\n{"assetOwnerId":"' +
            _0x23afac +
            '"}\r\n------WebKitFormBoundaryOMix6XnzisxiE316\r\nContent-Disposition:form-data;name="doc_id"\r\n\r\n5816699831746699\r\n------WebKitFormBoundaryOMix6XnzisxiE316--\r\n',
        })
        const _0x4a67dd = _0x4c0966.json
        const _0x10e5e7 =
          _0x4a67dd.data.assetOwnerData.advertising_restriction_info.ids_issue_ent_id
        if (_0x2a75ce.bm.chooseLineOnly?.value || this.quality === '902_line') {
          _0x17facf('Đang chọn dòng')
          const _0x44c4e1 = await fetch2(
            'https://business.facebook.com/api/graphql/?_flowletID=2423',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                'av=' +
                _0x2a3bce +
                '&__usid=6-Ts62bj38e5dcl%3APs62bqs19mjhs3%3A0-As62bhb1qhfddh-RV%3D6%3AF%3D&session_id=26399276ba0973c5&__user=' +
                _0x2a3bce +
                '&__a=1&__req=w&__hs=19713.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010574604&__s=pyhonq%3Azkdiwa%3A6yn1u0&__hsi=7315356470129303763&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx60C9EcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyQ6U-4Ea8mwoEru6ogyHwyx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzweau0Jo6-4e1mAKm221bzFHwCwNwDwjouxK2i2y1sDw9-&__csr=&fb_dtsg=' +
                _0x3fe67a +
                '&jazoest=25180&lsd=5FnEglTcQSfqnuBkn03g8c&__aaid=0&__bid=212827131149567&__spin_r=1010574604&__spin_b=trunk&__spin_t=1703239154&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useALEBanhammerAppealMutation&variables=%7B%22input%22%3A%7B%22client_mutation_id%22%3A%22' +
                _0x3b6825 +
                '%22%2C%22actor_id%22%3A%22100050444678752%22%2C%22entity_id%22%3A%22' +
                _0x23afac +
                '%22%2C%22ids_issue_ent_id%22%3A%22' +
                _0x10e5e7 +
                '%22%2C%22appeal_comment%22%3A%22' +
                encodeURIComponent(_0x25bbe3) +
                '%22%2C%22callsite%22%3A%22ACCOUNT_QUALITY%22%7D%7D&server_timestamps=true&doc_id=6816769481667605',
            },
          )
          const _0x2bed33 = _0x44c4e1.text
          if (_0x2bed33.includes('"success":true')) {
            return _0x4faf2c()
          } else {
            return _0x4e47c2()
          }
        }
        const _0x3c37f3 =
          _0x4a67dd.data.assetOwnerData.advertising_restriction_info.additional_parameters
            .friction_decision_id
        const _0x329e11 = await fetch2(
          'https://www.facebook.com/accountquality/ufac/?decision_id=' +
            _0x3c37f3 +
            '&ids_issue_id=' +
            _0x10e5e7 +
            '&entity_type=' +
            _0x12f901 +
            '&entity_id=' +
            _0x23afac +
            '&_flowletID=2169',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              '__usid=6-Ts32udfp2ieqb%3APs32udrqbzoxh%3A0-As32ud2p8mux0-RV%3D6%3AF%3D&session_id=2478ab408501cdea&__user=' +
              _0x2a3bce +
              '&__a=1&__req=u&__hs=19655.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009465523&__s=417qpb%3Alchip2%3Ayq4pb1&__hsi=7293818531390316856&__dyn=7xeUmxa2C5rgydwCwRyU8EKnFG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx611wlFEcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyUszUiwExq1yxJUpx2aK2a4p8y26U8U-UbE4S7VEjCx6Etwj84-3ifzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzwi82pDwbm15wFx3wlFbBwwwiUWqU9Eco9U4S7ErwAwEwn9U2vw&__csr=&fb_dtsg=' +
              _0x3fe67a +
              '&jazoest=25548&lsd=A-HDfPRVoR7YG2zHwlCDBx&__aaid=0&__spin_r=1009465523&__spin_b=trunk&__spin_t=1698224463',
          },
        )
        const _0x27a84a = JSON.parse(_0x329e11.text.replace('for (;;);', ''))
        const _0x331eea = _0x27a84a.payload.enrollment_id
        const _0x31466e = () => {
          return new Promise(async (_0x3ecc1b, _0x191628) => {
            try {
              const _0x5ad2b8 = await fetch2(
                'https://www.facebook.com/api/graphql/?_flowletID=2667',
                {
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  method: 'POST',
                  body:
                    'av=' +
                    _0x2a3bce +
                    '&__usid=6-Ts32uok1y9xfvn:Ps32uol13ql4xy:0-As32unzppjifr-RV=6:F=&session_id=39a4ef7cb4471bc7&__user=' +
                    _0x2a3bce +
                    '&__a=1&__req=v&__hs=19655.BP:DEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009465523&__s=66oim1:rc1h95:79wmnc&__hsi=7293820200761279392&__dyn=7xeUmxa2C5rgydwCwRyU8EKnFG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx611wlFEcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyUszUiwExq1yxJUpx2aK2a4p8y26U8U-UbE4S7VEjCx6Etwj84-3ifzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzwi82pDwbm15wFx3wlFbBwwwiUWqU9Eco9U4S7ErwAwEwn9U2vw&__csr=&fb_dtsg=' +
                    _0x3fe67a +
                    '&jazoest=25374&lsd=gxYcaWGy-YhTSvBKDhInoq&__aaid=0&__spin_r=1009465523&__spin_b=trunk&__spin_t=1698224851&__jssesw=247&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=UFACAppQuery&variables={"enrollmentID":' +
                    _0x331eea +
                    ',"scale":1}&server_timestamps=true&doc_id=7089047377805579',
                },
              )
              const _0x45e6a9 = _0x5ad2b8.json
              _0x3ecc1b(_0x45e6a9.data.ufac_client.state)
            } catch {
              _0x191628()
            }
          })
        }
        let _0x488d0f = await _0x31466e()
        const _0xadee7d = _0x488d0f.__typename === 'UFACBotCaptchaState'
        if (_0xadee7d) {
          _0x17facf('Đang giải captcha')
          const _0x4dbecd = await fetch2(
            'https://www.facebook.com/business-support-home/' + _0x2a3bce,
          )
          const _0x4d3596 = _0x4dbecd.text
          const _0x3d0e4c = _0x488d0f.captcha_persist_data
          const _0x277611 = _0x4d3596.match(/(?<=\"consent_param\":\")[^\"]*/g)[0]
          const _0x416380 = _0x4d3596.match(/(?<=\"code\":\")[^\"]*/g)[0]
          const _0x4d08f7 =
            'https://www.fbsbx.com/captcha/recaptcha/iframe/?referer=https%253A%252F%252Fwww.facebook.com&locale=' +
            _0x416380 +
            '&__cci=' +
            encodeURIComponent(_0x277611)
          const _0x31437a = await fb.getSiteKey(_0x4d08f7)
          let _0x2b8860 = false
          for (let _0x257fa7 = 0; _0x257fa7 < 3; _0x257fa7++) {
            if (_0x257fa7 > 0) {
              _0x17facf('Đang thử giải lại captcha')
            }
            try {
              const _0x3708ad = await resolveCaptcha(_0x2a75ce, _0x31437a, _0x4d08f7)
              const _0x4e176a = await fetch2('https://www.facebook.com/api/graphql/', {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                body:
                  'av=' +
                  _0x2a3bce +
                  '&__user=' +
                  _0x2a3bce +
                  '&__a=1&__req=6&__hs=19608.HYP:comet_pkg.2.1..2.1&dpr=1&__ccg=GOOD&__rev=1008510432&__s=wixma6:3lwxjd:w1cvvj&__hsi=7276285233254120568&__dyn=7xeXxa2C2O5U5O8G6EjBWo2nDwAxu13w8CewSwAyUco2qwJyEiw9-1DwUx60GE3Qwb-q1ew65xO2OU7m0yE465o-cw5Mx62G3i0Bo7O2l0Fwqo31w9O7Udo5qfK0zEkxe2Gew9O22362W5olw8Xxm16wa-7U1boarCwLyESE6S0B40z8c86-1Fwmk1xwmo6O1Fw9O2y&__csr=gQNdJ-OCcBGBG8WB-F4GHHCjFZqAS8LKaAyqhVHBGAACJde48jiKqqqGy4bK8zmbxi5onGfgiw9Si1uBwJwFw9N2oaEW3m1pwKwr835wywaG0vK0u-ewCwbS01aPw0d9O05uo4Wcwp8cJAx6U21w1420kKdxCQ063U12U0QK0midgsw1mR00H9w5VxS9DAw0gCvw0Opw&__comet_req=15&fb_dtsg=' +
                  _0x3fe67a +
                  '&jazoest=25277&lsd=' +
                  _0x8849d8 +
                  '&__spin_r=1008510432&__spin_b=trunk&__spin_t=1694142174&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useUFACSubmitActionMutation&variables={"input":{"client_mutation_id":"2","actor_id":"' +
                  _0x2a3bce +
                  '","action":"SUBMIT_BOT_CAPTCHA_RESPONSE","bot_captcha_persist_data":"' +
                  _0x3d0e4c +
                  '","bot_captcha_response":"' +
                  _0x3708ad +
                  '","enrollment_id":"' +
                  _0x331eea +
                  '"},"scale":1}&server_timestamps=true&doc_id=6495927930504828',
              })
              if (_0x4e176a.text.includes('body_text')) {
                _0x2b8860 = true
                break
              }
            } catch {}
          }
          if (_0x2b8860) {
            _0x488d0f = await _0x31466e()
            _0x17facf('Giải captcha thành công')
          } else {
            return _0x4e47c2('Giải captha thất bại')
          }
        }
        const _0x37ec0c = _0x488d0f.__typename === 'UFACContactPointChallengeSubmitCodeState'
        if (_0x37ec0c) {
          _0x17facf('Đang gỡ số điện thoại cũ')
          const _0x1b5da6 = await fetch2(
            'https://adsmanager.facebook.com/api/graphql/?_flowletID=6844',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                'av=' +
                _0x2a3bce +
                '&__usid=6-Ts32wgfj93yg8:Ps32wghqo2o2z:0-As32wgf5csdw0-RV=6:F=&session_id=3b23e41ba7202d8a&__user=' +
                _0x2a3bce +
                '&__a=1&__req=2e&__hs=19655.BP:ads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1009466057&__s=hveynz:5ecvmf:ccuxta&__hsi=7293830080792611326&__dyn=7AgSXghF3Gxd2um5rpUR0Bxpxa9yaxGuml4WqxuUgBwCwWhE99oWFGCxiEjCyJz9FGwwxmm4V9AUC37GiidBCBXxWE-7E9UmxaczESbwxKqibC-mdwTxOESegHyo4a5HyoyazoO4oK7EmDgjAKcxa49EB7x6dxaezWK4o8A2mh1222qdz8oDxKaCwgUGWBBKdUrjyrQ2PKGypVRg8Rpo8ESibKegK26bwr8sxep3bLAzECi9lpubwIxecAwXzogyo465ubUO9ws8nxaFo5a7EN1O74q9DByUObAzE89osDwOAxCUdoapVGxebxa4AbxR2V8W2e6Ex0RyUSUGfwXx6i2Sq7oV1JyAfx2aK48OimbAy8tKU-4U-UG7F8a898OidCxeq4qz8gwDzElx63Si2-fzobK4UGaxa2h2pqK6UCQubxu3ydDxG3WaUjxy-dxiFAm9KcyrBwGLg-3e8ByoF1a58gx6bCyVUCuQFEpy9pEHCAG224EdomBAwrVAvAwvoaFoK3Cd868g-cwNxaHjxa4Uak48-eCK5u8BwNU9oboS4ouK5Qq6KeykuWg-26q6oyu5osAGeyK5okyEC8w&__csr=&__comet_req=25&fb_dtsg=' +
                _0x3fe67a +
                '&jazoest=25640&lsd=6Ne_nXUdqyapLuYMHYV87_&__aaid=3545839135664163&__spin_r=1009466057&__spin_b=trunk&__spin_t=1698227152&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useUFACSubmitActionMutation&variables={"input":{"client_mutation_id":"2","actor_id":"' +
                _0x2a3bce +
                '","action":"UNSET_CONTACT_POINT","enrollment_id":"' +
                _0x331eea +
                '"},"scale":1}&server_timestamps=true&doc_id=6856852124361122',
            },
          )
          if (_0x1b5da6.text.includes('REVERIFY_PHONE_NUMBER_WITH_NEW_ADDED_PHONE_AND_WHATSAPP')) {
            _0x488d0f = await _0x31466e()
          } else {
            return _0x4e47c2('Không thể gỡ số điện thoại cũ')
          }
        }
        const _0x49956e = _0x488d0f.__typename === 'UFACContactPointChallengeSetContactPointState'
        if (_0x49956e) {
          let _0xc3c6ab = false
          for (let _0x10d188 = 0; _0x10d188 < 6; _0x10d188++) {
            let _0x1d5372 = false
            let _0x38963f = false
            let _0x4ac30c = false
            for (let _0x525dc4 = 0; _0x525dc4 < 6; _0x525dc4++) {
              _0x488d0f = await _0x31466e()
              const _0x341cf8 =
                _0x488d0f.__typename === 'UFACContactPointChallengeSetContactPointState'
              if (_0x341cf8) {
                if (_0x525dc4 > 0) {
                  _0x17facf('Đang thử lấy số điện thoại khác')
                } else {
                  _0x17facf('Đang lấy số điện thoại')
                }
                try {
                  _0x1d5372 = await getPhone(
                    _0x2a75ce.general.phoneService.value,
                    _0x2a75ce.general.phoneServiceKey.value,
                  )
                  _0x17facf('Đang thêm số điện thoại')
                  const _0xc35aa5 = await fetch2(
                    'https://adsmanager.facebook.com/api/graphql/?_flowletID=5799',
                    {
                      headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                      },
                      method: 'POST',
                      body:
                        'av=' +
                        _0x2a3bce +
                        '&__usid=6-Ts32vzy5lbbnm:Ps32w00w7ep8k:0-As32vzy8nfhuf-RV=6:F=&session_id=392d588c9fe08fb9&__user=' +
                        _0x2a3bce +
                        '&__a=1&__req=2a&__hs=19655.BP:ads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1009466057&__s=v3r9g5:6bpvyp:rynm6b&__hsi=7293827532840545377&__dyn=7AgSXghF3Gxd2um5rpUR0Bxpxa9yaxGuml4WqxuUgBwCwWhE99oWFGCxiEjCyJz9FGwwxmm4V9AUC37GiidBCBXxWE-7E9UmxaczESbwxKqibC-mdwTxOESegHyo4a5HyoyazoO4oK7EmDgjAKcxa49EB7x6dxaezWK4o8A2mh1222qdz8oDxKaCwgUGWBBKdUrjyrQ2PKGypVRg8Rpo8ESibKegK26bwr8sxep3bLAzECi9lpubwIxecAwXzogyo465ubUO9ws8nxaFo5a7EN1O74q9DByUObAzE89osDwOAxCUdoapVGxebxa4AbxR2V8W2e6Ex0RyUSUGfwXx6i2Sq7oV1JyAfx2aK48OimbAy8tKU-4U-UG7F8a898OidCxeq4qz8gwDzElx63Si2-fzobK4UGaxa2h2pqK6UCQubxu3ydDxG3WaUjxy-dxiFAm9KcyrBwGLg-3e8ByoF1a58gx6bCyVUCuQFEpy9pEHCAG224EdomBAwrVAvAwvoaFoK3Cd868g-cwNxaHjxa4Uak48-eCK5u8BwNU9oboS4ouK5Qq6KeykuWg-26q6oyu5osAGeyK5okyEC8w&__csr=&__comet_req=25&fb_dtsg=' +
                        _0x3fe67a +
                        '&jazoest=25259&lsd=_m2P87owOD8j6w2xxN6rHw&__aaid=3545839135664163&__spin_r=1009466057&__spin_b=trunk&__spin_t=1698226559&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useUFACSubmitActionMutation&variables={"input":{"client_mutation_id":"1","actor_id":"' +
                        _0x2a3bce +
                        '","action":"SET_CONTACT_POINT","contactpoint":"' +
                        _0x1d5372.number +
                        '","country_code":"VN","enrollment_id":"' +
                        _0x331eea +
                        '"},"scale":1}&server_timestamps=true&doc_id=6856852124361122',
                    },
                  )
                  const _0x4b1ff2 = _0xc35aa5.json
                  if (!_0x4b1ff2.errors) {
                    _0x38963f = true
                    break
                  } else {
                    _0x17facf(_0x4b1ff2.errors[0].summary)
                  }
                } catch (_0x3231b7) {
                  console.log(_0x3231b7)
                }
              } else {
                return _0x4e47c2()
              }
            }
            if (_0x38963f && _0x1d5372) {
              _0x488d0f = await _0x31466e()
              const _0x579d6f = _0x488d0f.__typename === 'UFACContactPointChallengeSubmitCodeState'
              if (_0x579d6f) {
                _0x17facf('Đang chờ mã kích hoạt')
                try {
                  const _0x2353fe = await getPhoneCode(
                    _0x2a75ce.general.phoneService.value,
                    _0x2a75ce.general.phoneServiceKey.value,
                    _0x1d5372.id,
                  )
                  _0x17facf('Đang nhập mã kích hoạt')
                  const _0x1f91bf = await fetch2(
                    'https://adsmanager.facebook.com/api/graphql/?_flowletID=6114',
                    {
                      headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                      },
                      method: 'POST',
                      body:
                        'av=' +
                        _0x2a3bce +
                        '&__usid=6-Ts32wgfj93yg8:Ps32wghqo2o2z:0-As32wgf5csdw0-RV=6:F=&session_id=3b23e41ba7202d8a&__user=' +
                        _0x2a3bce +
                        '&__a=1&__req=2a&__hs=19655.BP:ads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1009466057&__s=bi5lni:5ecvmf:ccuxta&__hsi=7293830080792611326&__dyn=7AgSXghF3Gxd2um5rpUR0Bxpxa9yaxGuml4WqxuUgBwCwWhE99oWFGCxiEjCyJz9FGwwxmm4V9AUC37GiidBCBXxWE-7E9UmxaczESbwxKqibC-mdwTxOESegHyo4a5HyoyazoO4oK7EmDgjAKcxa49EB7x6dxaezWK4o8A2mh1222qdz8oDxKaCwgUGWBBKdUrjyrQ2PKGypVRg8Rpo8ESibKegK26bwr8sxep3bLAzECi9lpubwIxecAwXzogyo465ubUO9ws8nxaFo5a7EN1O74q9DByUObAzE89osDwOAxCUdoapVGxebxa4AbxR2V8W2e6Ex0RyUSUGfwXx6i2Sq7oV1JyAfx2aK48OimbAy8tKU-4U-UG7F8a898OidCxeq4qz8gwDzElx63Si2-fzobK4UGaxa2h2pqK6UCQubxu3ydDxG3WaUjxy-dxiFAm9KcyrBwGLg-3e8ByoF1a58gx6bCyVUCuQFEpy9pEHCAG224EdomBAwrVAvAwvoaFoK3Cd868g-cwNxaHjxa4Uak48-eCK5u8BwNU9oboS4ouK5Qq6KeykuWg-26q6oyu5osAGeyK5okyEC8w&__csr=&__comet_req=25&fb_dtsg=' +
                        _0x3fe67a +
                        '&jazoest=25640&lsd=6Ne_nXUdqyapLuYMHYV87_&__aaid=3545839135664163&__spin_r=1009466057&__spin_b=trunk&__spin_t=1698227152&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useUFACSubmitActionMutation&variables={"input":{"client_mutation_id":"1","actor_id":"' +
                        _0x2a3bce +
                        '","action":"SUBMIT_CODE","code":"' +
                        _0x2353fe +
                        '","enrollment_id":"' +
                        _0x331eea +
                        '"},"scale":1}&server_timestamps=true&doc_id=6856852124361122',
                    },
                  )
                  const _0x2b33aa = _0x1f91bf.text
                  if (_0x2b33aa.includes('"ufac_client":{"id"')) {
                    _0x17facf('Thêm số điện thoại thành công')
                    _0x4ac30c = true
                  }
                  if (_0x2b33aa.includes('UFACOutroState')) {
                    _0x488d0f.__typename = 'UFACAwaitingReviewState'
                  }
                } catch (_0x2a1a90) {
                  console.log(_0x2a1a90)
                }
                if (_0x4ac30c) {
                  _0xc3c6ab = true
                  break
                } else {
                  _0x17facf('Đang gỡ số điện thoại cũ')
                  const _0x5d52fe = await fetch2(
                    'https://adsmanager.facebook.com/api/graphql/?_flowletID=6844',
                    {
                      headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                      },
                      method: 'POST',
                      body:
                        'av=' +
                        _0x2a3bce +
                        '&__usid=6-Ts32wgfj93yg8:Ps32wghqo2o2z:0-As32wgf5csdw0-RV=6:F=&session_id=3b23e41ba7202d8a&__user=' +
                        _0x2a3bce +
                        '&__a=1&__req=2e&__hs=19655.BP:ads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1009466057&__s=hveynz:5ecvmf:ccuxta&__hsi=7293830080792611326&__dyn=7AgSXghF3Gxd2um5rpUR0Bxpxa9yaxGuml4WqxuUgBwCwWhE99oWFGCxiEjCyJz9FGwwxmm4V9AUC37GiidBCBXxWE-7E9UmxaczESbwxKqibC-mdwTxOESegHyo4a5HyoyazoO4oK7EmDgjAKcxa49EB7x6dxaezWK4o8A2mh1222qdz8oDxKaCwgUGWBBKdUrjyrQ2PKGypVRg8Rpo8ESibKegK26bwr8sxep3bLAzECi9lpubwIxecAwXzogyo465ubUO9ws8nxaFo5a7EN1O74q9DByUObAzE89osDwOAxCUdoapVGxebxa4AbxR2V8W2e6Ex0RyUSUGfwXx6i2Sq7oV1JyAfx2aK48OimbAy8tKU-4U-UG7F8a898OidCxeq4qz8gwDzElx63Si2-fzobK4UGaxa2h2pqK6UCQubxu3ydDxG3WaUjxy-dxiFAm9KcyrBwGLg-3e8ByoF1a58gx6bCyVUCuQFEpy9pEHCAG224EdomBAwrVAvAwvoaFoK3Cd868g-cwNxaHjxa4Uak48-eCK5u8BwNU9oboS4ouK5Qq6KeykuWg-26q6oyu5osAGeyK5okyEC8w&__csr=&__comet_req=25&fb_dtsg=' +
                        _0x3fe67a +
                        '&jazoest=25640&lsd=6Ne_nXUdqyapLuYMHYV87_&__aaid=3545839135664163&__spin_r=1009466057&__spin_b=trunk&__spin_t=1698227152&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useUFACSubmitActionMutation&variables={"input":{"client_mutation_id":"2","actor_id":"' +
                        _0x2a3bce +
                        '","action":"UNSET_CONTACT_POINT","enrollment_id":"' +
                        _0x331eea +
                        '"},"scale":1}&server_timestamps=true&doc_id=6856852124361122',
                    },
                  )
                  if (
                    _0x5d52fe.text.includes(
                      'REVERIFY_PHONE_NUMBER_WITH_NEW_ADDED_PHONE_AND_WHATSAPP',
                    )
                  ) {
                    _0x488d0f = await _0x31466e()
                  } else {
                    return _0x4e47c2('Không thể gỡ số điện thoại cũ')
                  }
                }
              }
            }
          }
          if (_0xc3c6ab) {
            try {
              _0x488d0f = await _0x31466e()
            } catch {}
          } else {
            return _0x4e47c2()
          }
        }
        const _0x344b37 = _0x488d0f.__typename === 'UFACImageUploadChallengeState'
        if (_0x344b37) {
          _0x17facf('Đang tạo phôi')
          const _0x10fc38 = _0x2a75ce.bm.phoiId.value
          const _0x22dd09 = await getLocalStorage('userInfo_' + this.uid)
          const _0x2e7f28 = await getLocalStorage(_0x10fc38)
          const _0x539027 = {
            firstName: _0x22dd09.first_name,
            lastName: _0x22dd09.last_name,
            fullName: _0x22dd09.name,
            birthday: _0x22dd09.birthday,
            gender: _0x22dd09.gender,
          }
          const _0x2a448b = _0x539027
          const _0x427a29 = {
            data: _0x2a448b,
            template: _0x2e7f28,
          }
          const _0x11136b = await fetch2('https://app.Meta21.top/phoi', {
            headers: {
              'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(_0x427a29),
          })
          const _0x3bfda8 = await _0x11136b.blob()
          _0x17facf('Đang upload phôi')
          let _0x176e4f = new XMLHttpRequest()
          _0x176e4f.withCredentials = true
          _0x176e4f.open(
            'POST',
            'https://rupload.facebook.com/checkpoint_1501092823525282_media_upload/a06d268a-bad7-49d7-b553-24d6f07c64ba?__usid=6-Tsc6xzrdp0tcu%3APsc78vt5c5znb%3A0-Asc78484bm17t-RV%3D6%3AF%3D&session_id=1f53971e4d475672&__aaid=0&__bid=' +
              _0x1c0400 +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=15&__hs=19832.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1012908546&__s=j9683f%3Abgcl6p%3Avjr471&__hsi=7359625851859447619&__dyn=7xeXxa4EaolJ28S2q3m8G2abBAjxu59o9EeEb8nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2SaAxq4U5i48swj8qyoyazoO4o2oCyE9UixWq3i2q5E884a2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOXwAxm3G4UhwXxW9wgo9oO1Wxu0zoO12ypUuyUd88EeAUpK19xmu2C2l0FggzE8U98doJ1Kfxa2y5E6a6TxC48G2q4p8y26U8U-UbE4S4oSq4VEhG7o4O1fwwxefzobElxm4E5yeDyUnwUzpErw-z8c8-5aDwQwKG13y85i4oKqbDyoOFEa9EHyU8U3xhU24wMwrU6CiVo88ak22eCK2q362u1dxW6U98a85Ou3u1Dxeu1owtU&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25676&lsd=6qUyi5kQucC-XaTIr34bGR&__spin_r=1012908546&__spin_b=trunk&__spin_t=1713546424&__jssesw=1&_callFlowletID=3740&_triggerFlowletID=2359',
          )
          _0x176e4f.setRequestHeader('accept', '*/*')
          _0x176e4f.setRequestHeader(
            'accept-language',
            'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
          )
          _0x176e4f.setRequestHeader('offset', '0')
          _0x176e4f.setRequestHeader('priority', 'u=1, i')
          _0x176e4f.setRequestHeader('x-entity-length', _0x11136b.headers.get('content-length'))
          _0x176e4f.setRequestHeader('x-entity-name', 'phoi.png')
          _0x176e4f.setRequestHeader('x-entity-type', 'image/png')
          _0x176e4f.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
          _0x176e4f.onload = async function () {
            const _0x1db6b0 = JSON.parse(_0x176e4f.response)
            if (_0x1db6b0.h) {
              _0x17facf('Upload phôi thành công')
              const _0x39bcf1 = await fetch2(
                'https://adsmanager.facebook.com/api/graphql/?_flowletID=6162',
                {
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  method: 'POST',
                  body:
                    'av=' +
                    _0x2a3bce +
                    '&__usid=6-Ts32xbmx9zp07:Ps32xbo1dw875c:0-As32xbmnpvjk8-RV=6:F=&session_id=31c62e5eed2d0ee6&__user=' +
                    _0x2a3bce +
                    '&__a=1&__req=2a&__hs=19655.BP:ads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1009466057&__s=rnpwbw:po0pjn:3801to&__hsi=7293834906630568386&__dyn=7AgSXghF3Gxd2um5rpUR0Bxpxa9yaxGuml4WqxuUgBwCwWhE99oWFGCxiEjCyJz9FGwwxmm4V9AUC37GiidBCBXxWE-7E9UmxaczESbwxKqibC-mdwTxOESegHyo4a5HyoyazoO4oK7EmDgjAKcxa49EB7x6dxaezWK4o8A2mh1222qdz8oDxKaCwgUGWBBKdUrjyrQ2PKGypVRg8Rpo8ESibKegK26bwr8sxep3bLAzECi9lpubwIxecAwXzogyo465ubUO9ws8nxaFo5a7EN1O74q9DByUObAzE89osDwOAxCUdoapVGxebxa4AbxR2V8W2e6Ex0RyUSUGfwXx6i2Sq7oV1JyAfx2aK48OimbAy8tKU-4U-UG7F8a898OidCxeq4qz8gwSxm4ofp8bU-dwKUjyEG4E949BGUryrhUK5Ue8Su6EfEHxe6bUS5aChoCUO9Km2GZ3UcUym9yA4Ekx24oKqbDypXiCxC8BCyKqiE88iwRxqmi1LCh-i1ZwGByUeoQwox3UO364GJe4EjwFggzUWqUlUym37wBwJzohxWUnhEqUW9hXF3U8pEpy9UlxOiEWaUlxiayoy&__csr=&__comet_req=25&fb_dtsg=' +
                    _0x3fe67a +
                    '&jazoest=25539&lsd=rJwxW05TW9fxOrWZ5HZ2UF&__aaid=3545839135664163&__spin_r=1009466057&__spin_b=trunk&__spin_t=1698228276&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useUFACSubmitActionMutation&variables={"input":{"client_mutation_id":"1","actor_id":"' +
                    _0x2a3bce +
                    '","action":"UPLOAD_IMAGE","image_upload_handle":"' +
                    _0x1db6b0.h +
                    '","enrollment_id":"' +
                    _0x331eea +
                    '"},"scale":1}&server_timestamps=true&doc_id=6856852124361122',
                },
              )
              if (_0x39bcf1.text.includes('UFACAwaitingReviewState')) {
                _0x17facf('Upload phôi thành công')
                _0x488d0f = await _0x31466e()
              } else {
                return _0x4e47c2('Không thể upload phôi')
              }
            } else {
              return _0x4e47c2('Không thể upload phôi')
            }
          }
          _0x176e4f.send(_0x3bfda8)
          _0x488d0f = await getState()
        }
        const _0x4d4152 = _0x488d0f.__typename === 'UFACAwaitingReviewState'
        if (_0x4d4152) {
          _0x17facf('Đang chọn dòng')
          const _0x24000b = await fetch2(
            'https://business.facebook.com/api/graphql/?_flowletID=2423',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                'av=' +
                _0x2a3bce +
                '&__usid=6-Ts62bj38e5dcl%3APs62bqs19mjhs3%3A0-As62bhb1qhfddh-RV%3D6%3AF%3D&session_id=26399276ba0973c5&__user=' +
                _0x2a3bce +
                '&__a=1&__req=w&__hs=19713.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010574604&__s=pyhonq%3Azkdiwa%3A6yn1u0&__hsi=7315356470129303763&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx60C9EcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyQ6U-4Ea8mwoEru6ogyHwyx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzweau0Jo6-4e1mAKm221bzFHwCwNwDwjouxK2i2y1sDw9-&__csr=&fb_dtsg=' +
                _0x3fe67a +
                '&jazoest=25180&lsd=5FnEglTcQSfqnuBkn03g8c&__aaid=0&__bid=212827131149567&__spin_r=1010574604&__spin_b=trunk&__spin_t=1703239154&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useALEBanhammerAppealMutation&variables=%7B%22input%22%3A%7B%22client_mutation_id%22%3A%22' +
                _0x3b6825 +
                '%22%2C%22actor_id%22%3A%22100050444678752%22%2C%22entity_id%22%3A%22' +
                _0x23afac +
                '%22%2C%22ids_issue_ent_id%22%3A%22' +
                _0x10e5e7 +
                '%22%2C%22appeal_comment%22%3A%22' +
                encodeURIComponent(_0x25bbe3) +
                '%22%2C%22callsite%22%3A%22ACCOUNT_QUALITY%22%7D%7D&server_timestamps=true&doc_id=6816769481667605',
            },
          )
          if (_0x24000b.text.includes('"success":true')) {
            _0x4faf2c()
          } else {
            _0x4e47c2()
          }
        }
      } catch (_0x56a039) {
        _0x4e47c2()
      }
    })
  }
  getuid(link) {
    return new Promise(async (_0x32bcd4, _0x106576) => {
      try {
        const _0x84baf0 = await fetch2(link)
        const _0x2bfcd7 = await _0x84baf0.text // nhớ gọi .text()
        const match = _0x2bfcd7.match(/"userID":"(\d+)"/)

        if (match) {
          const userId = match[1]
          _0x32bcd4(userId)
        } else {
          _0x106576()
        }
      } catch (_0x4e4020) {
        _0x106576(_0x4e4020)
      }
    })
  }
  getalbums(Idalbum) {
    return new Promise(async (_0x32bcd4, _0x106576) => {
      try {
        let allPhotos = []
        let lastCursor = null
        let totalLoaded = 0
        const updateProgress = () => {
          const el = document.getElementById('progress')
          if (el) {
            el.textContent = `${totalLoaded} ảnh`
          }
        }

        // 1. Lấy thông tin ID album
        const _0x5d52fe = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&fb_api_req_friendly_name=CometSinglePostContentQuery&variables=' +
            encodeURIComponent(
              JSON.stringify({
                feedbackSource: 2,
                feedLocation: 'PERMALINK',
                focusCommentID: null,
                privacySelectorRenderLocation: 'COMET_STREAM',
                renderLocation: 'permalink',
                scale: 2,
                storyID: Idalbum,
                useDefaultActor: false,
                __relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider: false,
                __relay_internal__pv__IsWorkUserrelayprovider: false,
                __relay_internal__pv__IsMergQAPollsrelayprovider: false,
                __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
                __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: true,
                __relay_internal__pv__IncludeCommentWithAttachmentrelayprovider: true,
                __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: true,
                __relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider: false,
              }),
            ) +
            '&doc_id=8457098094310209',
        })

        const input = await _0x5d52fe.text
        const result = input.split(',"extensions":{')[0] + '}'
        const _0x3e1855 = JSON.parse(result)
        const albumId =
          _0x3e1855?.data?.node?.comet_sections?.content?.story?.attachments?.[0]?.target?.id

        if (!albumId) return _0x32bcd4([])

        // 2. Tải trang đầu tiên
        const _0x5d52f3s = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body: `dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=${fb.dtsg}&fb_api_req_friendly_name=CometAlbumPhotoCollagePaginationQuery&variables=${encodeURIComponent(
            JSON.stringify({
              cursor: '',
              count: 14,
              renderLocation: 'permalink',
              scale: 2,
              id: albumId,
            }),
          )}&doc_id=7250936985006590`,
        })

        const _0x5d52f3 = await _0x5d52f3s.json
        const edges2 = _0x5d52f3?.data?.node?.media?.edges

        if (Array.isArray(edges2) && edges2.length > 0) {
          allPhotos = allPhotos.concat(edges2.map((e) => e?.node?.image?.uri).filter(Boolean))
          totalLoaded += edges2.length
          updateProgress()
          lastCursor = edges2[edges2.length - 1]?.cursor || null
        }

        // 3. Lặp các trang sau
        while (lastCursor) {
          const body = `dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=${fb.dtsg}&fb_api_req_friendly_name=CometAlbumPhotoCollagePaginationQuery&variables=${encodeURIComponent(
            JSON.stringify({
              cursor: lastCursor,
              count: 14,
              renderLocation: 'permalink',
              scale: 2,
              id: albumId,
            }),
          )}&doc_id=7250936985006590`

          try {
            const response = await fetch2('https://www.facebook.com/api/graphql/', {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body,
            })

            const text = await response.text
            const cleanText = text.split(',"extensions":{')[0] + '}'
            const data = JSON.parse(cleanText)
            const edges = data?.data?.node?.media?.edges

            if (Array.isArray(edges) && edges.length > 0) {
              allPhotos.push(...edges.map((e) => e?.node?.image?.uri).filter(Boolean))
              totalLoaded += edges.length
              updateProgress()
              lastCursor = edges[edges.length - 1]?.cursor || null
            } else {
              lastCursor = null
            }
          } catch (err) {
            console.error('Lỗi khi tải ảnh:', err)
            break
          }
        }

        _0x32bcd4(allPhotos)
      } catch (_0x4e4020) {
        _0x106576(_0x4e4020)
      }
    })
  }
  loadvideo(id) {
    return new Promise(async (_0x32bcd4, _0x106576) => {
      try {
        const _0x5d52fe = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&fb_api_req_friendly_name=CometTahoeRootQuery&variables=%7B%22caller%22%3A%22TAHOE%22%2C%22chainingCursor%22%3Anull%2C%22chainingSeedVideoId%22%3Anull%2C%22channelEntryPoint%22%3A%22TAHOE%22%2C%22channelID%22%3A%22%22%2C%22feedbackSource%22%3A41%2C%22feedLocation%22%3A%22TAHOE%22%2C%22focusCommentID%22%3Anull%2C%22isCrawler%22%3Afalse%2C%22privacySelectorRenderLocation%22%3A%22COMET_STREAM%22%2C%22renderLocation%22%3A%22video_channel%22%2C%22scale%22%3A1%2C%22streamChainingSection%22%3Afalse%2C%22useDefaultActor%22%3Afalse%2C%22videoChainingContext%22%3Anull%2C%22videoID%22%3A%22' +
            id +
            '%22%2C%22__relay_internal__pv__CometUFIShareActionMigrationrelayprovider%22%3Atrue%2C%22__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__StoriesLWRVariantrelayprovider%22%3A%22www_new_reactions%22%7D&doc_id=26374037368876407',
        })
        const input = await _0x5d52fe.text
        const result = input.split(',"extensions":{')[0] + '}'
        const _0x3e1855 = JSON.parse(result)
        const videoData = _0x3e1855?.data?.video?.browser_native_hd_url
        _0x32bcd4(videoData || '')
      } catch {}
      _0x106576()
    })
  }
  downloadmore(id, startCursor, onProgress, total = 0, countPhotos = 0, countVideos = 0) {
    return new Promise(async (resolve, reject) => {
      let allPosts = []
      let nextCursor = startCursor
      let hasNextPage = true
      let pageCount = 0 // ← Biến đếm số lần lặp

      try {
        while (hasNextPage && nextCursor && pageCount < 1) {
          pageCount++ // ← Tăng sau mỗi vòng lặp

          const response = await fetch2('https://www.facebook.com/api/graphql/', {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            body:
              'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
              fb.dtsg +
              '&fb_api_req_friendly_name=CometManagePostsFeedRefetchQuery&variables=' +
              encodeURIComponent(
                JSON.stringify({
                  cursor: nextCursor,
                  afterTime: null,
                  beforeTime: null,
                  gridMediaWidth: 230,
                  includeGroupScheduledPosts: false,
                  includeScheduledPosts: false,
                  omitPinnedPost: false,
                  postedBy: null,
                  privacy: null,
                  privacySelectorRenderLocation: 'COMET_STREAM',
                  scale: 2,
                  taggedInOnly: false,
                  renderLocation: 'timeline',
                  id: id,
                  __relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider: true,
                }),
              ) +
              '&doc_id=8847372595369742',
          })

          const input = await response.text
          const jsonStr = input.split(',"extensions":{')[0] + '}'
          const data = JSON.parse(jsonStr)

          const edges = data?.data?.node?.timeline_manage_feed_units?.edges
          if (!edges || edges.length === 0) {
            hasNextPage = false
            break
          }

          for (let edge of edges) {
            const node = edge.node

            let mediaUrls = []
            let mediaType = 'Không có'
            let Idvideo = 'Không có'
            let Idalbum = 'Không có'

            const firstAttachment = node.attachments?.[0]
            if (firstAttachment) {
              const subNodes =
                firstAttachment.style_type_renderer?.attachment?.all_subattachments?.nodes

              if (Array.isArray(subNodes) && subNodes.length > 0) {
                let allArePhotos = true
                for (const sub of subNodes) {
                  if (sub.media?.__isNode === 'Photo') {
                    mediaType = 'Ảnh'
                  } else if (sub.media?.__isNode === 'Video') {
                    allArePhotos = false
                    Idvideo = sub.media?.id
                    try {
                      const videoUrl = await fb.loadvideo(Idvideo)
                      if (videoUrl) mediaUrls.push(videoUrl)
                    } catch (e) {
                      console.warn('Lỗi tải video', Idvideo, e)
                    }
                    mediaType = 'Video'
                  } else {
                    allArePhotos = false
                  }
                }

                if (allArePhotos && subNodes.length > 1) {
                  Idalbum = node.id || ''
                  try {
                    const albumUrl = await fb.getalbums(Idalbum)
                    if (albumUrl) {
                      mediaUrls.push(...(Array.isArray(albumUrl) ? albumUrl : [albumUrl]))
                    }
                  } catch (e) {
                    console.warn('Lỗi tải ảnh từ album', Idalbum, e)
                  }
                }
              } else {
                const media = firstAttachment.style_type_renderer?.attachment?.media
                if (media?.__isNode === 'Photo') {
                  mediaUrls.push(media?.image?.uri)
                  mediaType = 'Ảnh'
                } else if (media?.__isNode === 'Video') {
                  Idvideo = media?.id
                  try {
                    const videoUrl = await fb.loadvideo(Idvideo)
                    if (videoUrl) mediaUrls.push(videoUrl)
                  } catch (e) {
                    console.warn('Lỗi tải video', Idvideo, e)
                  }
                  mediaType = 'Video'
                }
              }
            }

            // Đếm loại
            if (mediaType === 'Ảnh') countPhotos++
            else if (mediaType === 'Video') countVideos++
            else if (mediaType === 'Ảnh & Video') {
              countPhotos++
              countVideos++
            }

            const likeInfo = await fb.likepost(node.url || '')
            allPosts.push({
              Author: node.comet_sections?.actor_photo?.story?.actors?.[0]?.name || 'Không rõ',
              MediaType: mediaType,
              MediaUrls: mediaUrls,
              url: node.url || '',
              title: node.title?.text || '',
              Content: node.message?.text || node.summary?.text || 'Không có nội dung',
              PostTime: new Date(node.creation_time * 1000).toLocaleString('vi-VN'),
              Privacy:
                node.comet_sections?.audience?.story?.privacy_scope?.privacy_scope_renderer
                  ?.entry_point_renderer?.source?.scope?.label ||
                node.comet_sections?.audience?.story?.privacy_scope?.description ||
                'Không rõ',
              Likes: likeInfo.allReactions || [],
            })

            // ✅ Cập nhật tiến độ sau mỗi post
            if (typeof onProgress === 'function') {
              onProgress({
                postsProcessed: allPosts.length + total,
                photosLoaded: countPhotos,
                videosLoaded: countVideos,
              })
            }
          }

          // Lấy cursor mới
          const matches = [...input.matchAll(/"cursor"\s*:\s*"([^"]+)"/g)]
          if (matches.length > 0) {
            nextCursor = matches[matches.length - 1][1]
            await setLocalStorage('matches', nextCursor)
          } else {
            hasNextPage = false
          }
        }

        if (allPosts.length === 0) {
          reject('Không tìm thấy bài viết nào.')
        } else {
          resolve(allPosts)
        }
      } catch (error) {
        console.error('Lỗi khi tải thêm bài viết:', error)
        reject(error)
      }
    })
  }
  splitJsonObjects(str) {
    const result = []
    let level = 0
    let start = 0
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '{') level++
      else if (str[i] === '}') level--
      if (level === 0 && str[i] === '}') {
        result.push(str.slice(start, i + 1))
        start = i + 1
      }
    }
    return result
  }
  getphotoid(id, cursor = '', onProgress = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const encodedid = btoa('app_collection:' + id + ':2305272732:5')

        const response = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&doc_id=4820192058049838&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=ProfileCometAppCollectionPhotosRendererPaginationQuery' +
            '&variables=' +
            encodeURIComponent(
              JSON.stringify({
                count: 8,
                cursor: cursor,
                scale: 1,
                id: encodedid,
              }),
            ),
        })

        const input = await response.json
        const edges = input?.data?.node?.pageItems?.edges || []

        const viewerImages = []
        for (const edge of edges) {
          const uri = edge?.node?.node?.viewer_image?.uri
          if (uri) viewerImages.push(uri)
          if (typeof onProgress === 'function') {
            onProgress(viewerImages.length)
          }
        }

        const lastCursor = edges.length > 0 ? edges[edges.length - 1]?.cursor || null : null

        resolve({ images: viewerImages, nextCursor: lastCursor })
      } catch (error) {
        reject(new Error('Đã xảy ra lỗi: ' + error.message))
      }
    })
  }
  getvideoid(id, cursor = '', onProgress = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const encodedid = btoa('app_collection:' + id + ':1560653304174514:133')
        const response = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&doc_id=4820192058049838&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=ProfileCometAppCollectionPhotosRendererPaginationQuery' +
            '&variables=' +
            encodeURIComponent(
              JSON.stringify({
                count: 8,
                cursor: cursor,
                scale: 1,
                id: encodedid,
              }),
            ),
        })

        const input = await response.json
        const edges = input?.data?.node?.pageItems?.edges || []

        const viewervideo = []
        for (const edge of edges) {
          const idvideo = edge?.node?.node?.id
          const uri = await fb.getvideo(idvideo, '')
          if (uri) {
            viewervideo.push(uri)
            // Gọi callback cập nhật tiến độ
            if (typeof onProgress === 'function') {
              onProgress(viewervideo.length)
            }
          }
        }

        const lastCursor = edges.length > 0 ? edges[edges.length - 1]?.cursor || null : null

        resolve({ video: viewervideo, nextCursor: lastCursor })
      } catch (error) {
        reject(new Error('Đã xảy ra lỗi: ' + error.message))
      }
    })
  }
  getvideo(idvideo, cursor = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&fb_api_req_friendly_name=CometTahoeRootQuery&variables=%7B%22caller%22%3A%22TAHOE%22%2C%22chainingCursor%22%3Anull%2C%22chainingSeedVideoId%22%3Anull%2C%22channelEntryPoint%22%3A%22TAHOE%22%2C%22channelID%22%3A%22%22%2C%22feedbackSource%22%3A41%2C%22feedLocation%22%3A%22TAHOE%22%2C%22focusCommentID%22%3Anull%2C%22isCrawler%22%3Afalse%2C%22privacySelectorRenderLocation%22%3A%22COMET_STREAM%22%2C%22renderLocation%22%3A%22video_channel%22%2C%22scale%22%3A1%2C%22streamChainingSection%22%3Afalse%2C%22useDefaultActor%22%3Afalse%2C%22videoChainingContext%22%3Anull%2C%22videoID%22%3A%22' +
            idvideo +
            '%22%2C%22__relay_internal__pv__CometUFIShareActionMigrationrelayprovider%22%3Atrue%2C%22__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__StoriesLWRVariantrelayprovider%22%3A%22www_new_reactions%22%7D&doc_id=26374037368876407',
        })

        const inputText = await response.text
        const regex = new RegExp('"browser_native_hd_url":"(https:\\\\/\\\\/[^"]+?\\.mp4[^"]*)"')
        const regex2 = new RegExp('"browser_native_sd_url":"(https:\\\\/\\\\/[^"]+?\\.mp4[^"]*)"')
        const match = inputText.match(regex) || inputText.match(regex2)

        if (match && match[1]) {
          const videoUrl = match[1].replace(/\\\//g, '/')
          resolve(videoUrl)
        }
      } catch (error) {
        reject(new Error('Đã xảy ra lỗi: ' + error.message))
      }
    })
  }

  getpostid(id, onProgress, nextpage = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&fb_api_req_friendly_name=ProfileCometManagePostsTimelineRootQuery&variables=%7B%22cursor%22%3A%22%22%2C%22afterTime%22%3Anull%2C%22beforeTime%22%3Anull%2C%22gridMediaWidth%22%3A230%2C%22includeGroupScheduledPosts%22%3Afalse%2C%22includeScheduledPosts%22%3Afalse%2C%22omitPinnedPost%22%3Afalse%2C%22postedBy%22%3Anull%2C%22privacy%22%3Anull%2C%22privacySelectorRenderLocation%22%3A%22COMET_STREAM%22%2C%22scale%22%3A2%2C%22taggedInOnly%22%3Afalse%2C%22renderLocation%22%3A%22timeline%22%2C%22userID%22%3A%22' +
            id +
            '%22%2C%22__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider%22%3Atrue%7D&doc_id=8218825384885789',
        })

        const input = await response.text
        const parts = fb.splitJsonObjects(input)
        const results = []

        for (let i = 0; i < parts.length; i++) {
          try {
            const parsed = JSON.parse(parts[i])
            results.push(parsed)
            globalThis[`json${i + 1}`] = parsed
          } catch (e) {
            console.error(`Lỗi parse JSON thứ ${i + 1}:`, e)
          }
        }

        const json1data = results[0]?.data?.user?.timeline_manage_feed_units?.edges
        if (!json1data) {
          const errorMessage = results[0]?.errors?.[0]?.message || ''
          reject(new Error(errorMessage))
          return
        }

        const total = json1data.length
        let posts = []
        let countPhotos = 0
        let countVideos = 0

        // Xử lý json1
        for (let i = 0; i < total; i++) {
          const node = json1data[i].node
          const result = await fb.parseNode(node)
          if (result) {
            posts.push(result.post)
            countPhotos += result.photos
            countVideos += result.videos

            if (typeof onProgress === 'function') {
              onProgress({
                postsProcessed: i + 1,
                photosLoaded: countPhotos,
                videosLoaded: countVideos,
              })
            }
          }
        }

        // Xử lý json2, json3...
        for (let i = 1; i < results.length; i++) {
          const node = results[i]?.data?.node
          if (!node) continue

          const result = await fb.parseNode(node)
          if (result) {
            posts.push(result.post)
            countPhotos += result.photos
            countVideos += result.videos

            if (typeof onProgress === 'function') {
              onProgress({
                postsProcessed: posts.length,
                photosLoaded: countPhotos,
                videosLoaded: countVideos,
              })
            }
          }
        }

        if (posts.length === 0) {
          reject('Không tìm thấy bài viết nào.')
          return
        }

        // Tải thêm nếu có cursor (next page)
        try {
          const matches = [...input.matchAll(/"cursor"\s*:\s*"([^"]+)"/g)]
          if (matches.length > 0) {
            const lastCursorValue = matches[matches.length - 1][1]
            await setLocalStorage('matches', lastCursorValue)

            const morePosts = await fb.downloadmore(
              id,
              lastCursorValue,
              onProgress,
              posts.length,
              countPhotos,
              countVideos,
            )

            for (let i = 0; i < morePosts.length; i++) {
              const post = morePosts[i]
              posts.push(post)

              // Cập nhật số ảnh/video theo post.MediaType
              if (post.MediaType === 'Ảnh') {
                countPhotos++
              } else if (post.MediaType === 'Video') {
                countVideos++
              } else if (post.MediaType === 'Ảnh & Video') {
                countPhotos++
                countVideos++
              }
            }
          }
        } catch (e) {
          console.error('Lỗi khi phân tích cursor hoặc tải thêm:', e)
        }

        resolve(posts)
      } catch (error) {
        reject(new Error('Đã xảy ra lỗi khi lấy bài viết: ' + error.message))
      }
    })
  }

  async parseNode(node) {
    try {
      let mediaUrls = []
      let mediaType = 'Không có'
      let Idvideo = 'Không có'
      let Idalbum = 'Không có'
      let countPhotos = 0
      let countVideos = 0

      const attachments = node.attachments || []
      const firstAttachment = attachments[0]

      if (firstAttachment?.style_type_renderer?.attachment?.all_subattachments?.nodes?.length > 0) {
        const subNodes = firstAttachment.style_type_renderer.attachment.all_subattachments.nodes

        let allArePhotos = true
        let mixedMedia = false

        for (const sub of subNodes) {
          const media = sub.media
          if (media?.__isNode === 'Video') {
            mixedMedia = true
            allArePhotos = false
            break
          }
        }

        if (mixedMedia) {
          for (const sub of subNodes) {
            const media = sub.media
            if (media?.__isNode === 'Photo') {
              const photoUrl = media?.image?.uri
              if (photoUrl) mediaUrls.push(photoUrl)
              countPhotos++
            } else if (media?.__isNode === 'Video') {
              Idvideo = media?.id
              const videoUrl = await fb.loadvideo(Idvideo)
              if (videoUrl) mediaUrls.push(videoUrl)
              countVideos++
            }
          }
        } else if (allArePhotos && subNodes.length > 1) {
          Idalbum = node.id || ''
          const albumUrls = await fb.getalbums(Idalbum)
          if (Array.isArray(albumUrls)) mediaUrls.push(...albumUrls)
          else if (albumUrls) mediaUrls.push(albumUrls)
          countPhotos = mediaUrls.length
        }

        if (countPhotos > 0 && countVideos > 0) {
          mediaType = 'Ảnh & Video'
        } else if (countPhotos > 0) {
          mediaType = 'Ảnh'
        } else if (countVideos > 0) {
          mediaType = 'Video'
        }
      } else {
        const media = firstAttachment?.style_type_renderer?.attachment?.media

        if (media?.__isNode === 'Photo') {
          const photoUrl = media?.image?.uri
          if (photoUrl) mediaUrls.push(photoUrl)
          mediaType = 'Ảnh'
          countPhotos++
        } else if (media?.__isNode === 'Video') {
          Idvideo = media?.id
          const videoUrl = await fb.loadvideo(Idvideo)
          if (videoUrl) mediaUrls.push(videoUrl)
          mediaType = 'Video'
          countVideos++
        }
      }

      const likeInfo = await fb.likepost(node.url || '')

      return {
        post: {
          Author: node.comet_sections?.actor_photo?.story?.actors?.[0]?.name || 'Không rõ',
          MediaType: mediaType,
          MediaUrls: mediaUrls,
          url: node.url || '',
          title: node.title?.text || '',
          Content:
            node.message?.text ||
            node.summary?.text ||
            node.comet_sections?.message?.story?.message?.text ||
            'Không có nội dung',
          PostTime: new Date(node.creation_time * 1000).toLocaleString('vi-VN'),
          Privacy:
            node.comet_sections?.audience?.story?.privacy_scope?.privacy_scope_renderer
              ?.entry_point_renderer?.source?.scope?.label ||
            node.comet_sections?.audience?.story?.privacy_scope?.description ||
            'Không rõ',
          Likes: likeInfo.allReactions || [],
        },
        photos: countPhotos,
        videos: countVideos,
      }
    } catch (err) {
      console.warn('Lỗi xử lý node:', err)
      return null
    }
  }

  likepost(url) {
    return new Promise(async (_0x32bcd4, _0x106576) => {
      let id = null
      const matchPost = url.match(/\/(pfbid\w+)/) || url.match(/story_fbid=(pfbid\w+)/)
      if (matchPost) {
        const postId = matchPost[1]
        const response = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&q=node(' +
            postId +
            ')%7Bid%7D',
        })
        const input = await response.json
        id = 'feedback:' + Object.keys(input)[0]
      } else {
        let postId = null
        const matchVideo = url.match(/\/videos\/(\d+)/)
        const matchReel = url.match(/\/reel\/(\d+)/)
        const matchColonPost = url.match(/\/posts\/(\d+)(?=:|\/|$)/)

        if (matchColonPost) {
          postId = matchColonPost[1]
          id = 'feedback:' + postId
        } else if (matchVideo) {
          postId = matchVideo[1]
        } else if (matchReel) {
          postId = matchReel[1]
        }
        if (!id && postId) {
          const response = await fetch2('https://www.facebook.com/api/graphql/', {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            body:
              'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
              fb.dtsg +
              '&fb_api_req_friendly_name=CometTahoeRootQuery&variables=' +
              encodeURIComponent(
                JSON.stringify({
                  caller: 'TAHOE',
                  chainingCursor: null,
                  chainingSeedVideoId: null,
                  channelEntryPoint: 'TAHOE',
                  channelID: '',
                  feedbackSource: 41,
                  feedLocation: 'TAHOE',
                  focusCommentID: null,
                  isCrawler: false,
                  privacySelectorRenderLocation: 'COMET_STREAM',
                  renderLocation: 'video_channel',
                  scale: 2,
                  streamChainingSection: false,
                  useDefaultActor: false,
                  videoChainingContext: null,
                  videoID: postId,
                  __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: true,
                  __relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider: false,
                  __relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider: false,
                  __relay_internal__pv__IsWorkUserrelayprovider: false,
                  __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
                  __relay_internal__pv__StoriesLWRVariantrelayprovider: 'www_new_reactions',
                }),
              ) +
              '&doc_id=9471108166319679',
          })
          const inputText = await response.text
          const match = inputText.match(/"subscription_target_id":"(\d+)"/)
          if (match && match[1]) {
            id = 'feedback:' + match[1]
          }
        }
      }
      try {
        const encodedid = btoa(id)
        const response2 = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&fb_api_req_friendly_name=CometUFIReactionsDialogQuery&variables=%7B%22feedbackTargetID%22%3A%22' +
            encodedid +
            '%22%2C%22scale%22%3A2%7D&doc_id=9234461370009918',
        })
        const input2 = await response2.json
        const reactionsData = input2.data?.node?.top_reactions || ''
        const result = {
          totalCount: reactionsData.count ?? '0',
          mainReactionType: reactionsData.summary?.[0]?.reaction.localized_name ?? '',
          mainReactionCountReduced: reactionsData.summary?.[0]?.reaction_count_reduced ?? '0',
          allReactions: (reactionsData.summary ?? []).map((item) => ({
            count: item.reaction_count ?? 0,
            countReduced: item.reaction_count_reduced ?? '',
            localizedName: item.reaction?.localized_name ?? '',
            color: item.reaction?.color ?? '',
            iconUri: item.reaction?.face_image?.uri ?? '',
          })),
        }
        _0x32bcd4(result)
      } catch (_0x4e4020) {
        console.log(url)
        _0x106576(_0x4e4020)
      }
    })
  }

  getarticle(ID) {
    return new Promise(async (_0x32bcd4, _0x106576) => {
      try {
        const _0x4fbd03 = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body:
            'dpr=1&__a=1&__aaid=0&__ccg=GOOD&__comet_req=15&server_timestamps=true&fb_dtsg=' +
            fb.dtsg +
            '&fb_api_req_friendly_name=CometHovercardQueryRendererQuery&variables=%7B%22actionBarRenderLocation%22%3A%22WWW_COMET_HOVERCARD%22%2C%22context%22%3A%22DEFAULT%22%2C%22entityID%22%3A%22' +
            ID +
            '%22%2C%22scale%22%3A2%7D&doc_id=27838033792508877',
          method: 'POST',
        })

        const _0x3826fe = await _0x4fbd03.json
        const user = _0x3826fe?.data?.node?.comet_hovercard_renderer?.user

        // Trích xuất raw status/gender
        const friendshipStatusRaw =
          user?.primaryActions?.find((action) => action.__typename === 'ProfileActionFriendRequest')
            ?.client_handler?.profile_action?.restrictable_profile_owner?.friendship_status ?? ''

        const genderRaw =
          user?.gender ??
          user?.primaryActions?.find((action) => action.__typename === 'ProfileActionFriendRequest')
            ?.client_handler?.profile_action?.restrictable_profile_owner?.gender ??
          ''

        // Chuyển đổi sang tiếng Việt
        const friendshipStatusMap = {
          ARE_FRIENDS: 'Đã là bạn bè',
          CAN_REQUEST: 'Chưa kết bạn',
          OUTGOING_REQUEST: 'Đã gửi lời mời',
          INCOMING_REQUEST: 'Chờ chấp nhận',
        }
        const genderMap = {
          MALE: 'Nam',
          FEMALE: 'Nữ',
        }

        const timelineItems = user?.timeline_context_items?.nodes ?? []

        const birthdate =
          timelineItems.find((item) => /sinh|birthday/i.test(item.title?.text || ''))?.title
            ?.text ?? ''

        const mutualFriends =
          timelineItems.find((item) => /bạn chung|mutual/i.test(item.title?.text || ''))?.title
            ?.text ?? ''

        const result = {
          id: user?.id ?? null,
          name: user?.name ?? null,
          profileUrl: user?.profile_url ?? null,
          profilePicture: user?.profile_picture?.uri ?? null,
          is_verified: user?.is_verified ?? false,
          birthdate: birthdate,
          mutualFriends: mutualFriends,
          friendshipStatus: friendshipStatusMap[friendshipStatusRaw] || '',
          gender: genderMap[genderRaw] || '',
        }

        _0x32bcd4(result)
      } catch (_0x4e4020) {
        _0x106576(_0x4e4020)
      }
    })
  }

  getGroup() {
    return new Promise(async (_0x32bcd4, _0x106576) => {
      try {
        let _0x590958 = []
        const _0x57f1e3 = await fetch2(
          'https://graph.facebook.com/v22.0/' +
            fb.uid +
            '/groups?debug=all&fields=administrator%2Cname%2Cid%2Cmember_count%2Cprivacy%2Cpicture&limit=10&access_token=' +
            this.accessToken,
        )
        const _0x3e1855 = _0x57f1e3.json
        _0x3e1855.data.forEach((_0x1815fc) => {
          _0x590958.push(_0x1815fc)
        })
        if (_0x3e1855.paging.next) {
          let _0x1bb78c = _0x3e1855.paging.next
          for (let _0x5b9625 = 0; _0x5b9625 < 9999; _0x5b9625++) {
            await delayTime(1000)
            const _0x53d29e = await fetch2(_0x1bb78c)
            const _0x3826fe = _0x53d29e.json
            _0x3826fe.data.forEach((_0x49bdac) => {
              _0x590958.push(_0x49bdac)
            })
            if (_0x3826fe.paging.next) {
              _0x1bb78c = _0x3826fe.paging.next
            } else {
              break
            }
          }
        }
        _0x32bcd4(
          _0x590958.map((_0x2a47ea) => {
            const _0x5296e3 = {
              groupId: _0x2a47ea.id,
              name: _0x2a47ea.name,
              avatar: _0x2a47ea.picture.data.url,
              role: _0x2a47ea.administrator ? 'ADMIN' : 'MEMBER',
              members: _0x2a47ea.member_count,
              status: _0x2a47ea.privacy,
            }
            return _0x5296e3
          }),
        )
      } catch (_0x4e4020) {
        _0x106576(_0x4e4020)
      }
    })
  }
  searchGroup(_0x3b1097, _0x23a6e5, _0x49bffa) {
    return new Promise(async (_0x3b6d54, _0x4cceea) => {
      try {
        let _0x34e1d7 = 0
        const _0x7e4559 = []
        const _0x12dbcd = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            accept: '*/*',
            'content-type': 'application/x-www-form-urlencoded',
          },
          body:
            'av=' +
            this.uid +
            '&__aaid=0&__user=' +
            this.uid +
            '&__a=1&__req=6f&__hs=20135.HYP%3Acomet_pkg.2.1...1&dpr=1&__ccg=EXCELLENT&__rev=1020156942&__s=9lelic%3A16clb1%3Alb0vmg&__hsi=7472025301829894075&__dyn=7xeXzWK1ixt0mUyEqxemh0noeEb8nwgUao4ubyQdwSwAyUco5S3O2Saw8i2S1DwUx60GE5O0BU2_CxS320qa2OU7m221Fwgo9oO0-E4a3a4oaEnxO0Bo7O2l2Utwqo31wiE567Udo5qfK0zEkxe2GewyDwkUe9obrwh8lwUwgojUlDw-wUwxwjFovUuz86a1TxW2-awLyESE2KwwwOg2cwMwhEkxebwHwKG4UrwFg2fwxyo566k1FwgUjwOwWzUfHDzUiBG2OUqwjVqwLwHwa211xq19wVw&__csr=gekYh3kcsaMN2Df3kYYr5mwH2IlkBbs8ivcBlOLsBqnRcgZtZb8B9iTiHncIkWlEDHsQGkDsGbOjq9ipeJfV5ldOqQBbnibIzFbmHnjhaABlQDAQmhcO8h5j8RQDBBhmQXBAipaQFFa-lrpaGjWBHmjFtyuqVayy4F4FF3uYEW8G9GdGnjVZ7BQKdyHh9miW4nVQm8KjijCCWgLmil4zWAjADVoWibGijz5i-F5UGVJ2UyhDKiAuhFGmiAFVGBUmykqUCiFKmucCBAFBK8GJ95GvxiazpQiqhurh9Vt2u9xm8FoBK5V8yjSqicF1fzppufy-q68sgGmmdCAyEZe8J2FoO32i2eahQaxB2lyopHwFyo9EmBRGhbzeqbBVoKmeh8Gm6UKaw_AUsxa9-bwyye1hUtwnEpwQwzzUy1nwBla4qo4x0HwjUf4by610GQiaoOq0SE9Hzy1ecgTwgo5a0xA9g3mDQG-1jx14xOawooPxyqETxCHggijUK4y0hAVoGJapwfR0ooK4E8E98DhWzVU8U3DU9EnU2IEK9HogwlooKbK0CUy1AwqE4yha263mmblyUgxmGm2itpIU5WEggKFaosK444XxO4XiTc0gi10w0wGy80mhyo18E4y9w1I-1cw2qU0Vu01UOw3580VG2-03Kp0UwbW15wfFa4A5sPG0Ko3fyk0DsZwedxCu0nWpk09kg4t6Dg11o5i1tg763q0tC0z4u0BmiiUEi12w7rwi8429xy1TwKwlU-0wpZw8y8xO9wey2J6wbJ0ro1Ro0MC0HQ09_g0hLy84i048pE0Fa0kl0p82DwLojK1Gg0glOw7Zw9SEK0_Q0D80pew6FwfJ0cy2J0tU0A-07Ey02WAqt2oTBDgG2q1lw21A588U3hCBi86YMBcpoXQEiglF0&__comet_req=15&fb_dtsg=' +
            this.dtsg +
            '&jazoest=25564&lsd=OrfNVF3SWNkvM6lhAjXbWo&__spin_r=1020156942&__spin_b=trunk&__spin_t=1739716460&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=SearchCometResultsPaginatedResultsQuery&variables=%7B%22allow_streaming%22%3Afalse%2C%22args%22%3A%7B%22callsite%22%3A%22COMET_GLOBAL_SEARCH%22%2C%22config%22%3A%7B%22exact_match%22%3Afalse%2C%22high_confidence_config%22%3Anull%2C%22intercept_config%22%3Anull%2C%22sts_disambiguation%22%3Anull%2C%22watch_config%22%3Anull%7D%2C%22context%22%3A%7B%22bsid%22%3A%22b02d2974-5915-4d36-a5ff-cb21cac9e6fa%22%2C%22tsid%22%3A%220.0406180842980719%22%7D%2C%22experience%22%3A%7B%22client_defined_experiences%22%3A%5B%22ADS_PARALLEL_FETCH%22%5D%2C%22encoded_server_defined_params%22%3Anull%2C%22fbid%22%3Anull%2C%22type%22%3A%22GROUPS_TAB%22%7D%2C%22filters%22%3A%5B%5D%2C%22text%22%3A%22' +
            encodeURIComponent(_0x3b1097) +
            '%22%7D%2C%22feedLocation%22%3A%22SEARCH%22%2C%22feedbackSource%22%3A23%2C%22fetch_filters%22%3Atrue%2C%22focusCommentID%22%3Anull%2C%22locale%22%3Anull%2C%22privacySelectorRenderLocation%22%3A%22COMET_STREAM%22%2C%22renderLocation%22%3A%22search_results_page%22%2C%22scale%22%3A1%2C%22stream_initial_count%22%3A0%2C%22useDefaultActor%22%3Afalse%2C%22__relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__IsWorkUserrelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometFeedStoryDynamicResolutionPhotoAttachmentRenderer_experimentWidthrelayprovider%22%3A600%2C%22__relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider%22%3Afalse%2C%22__relay_internal__pv__WorkCometIsEmployeeGKProviderrelayprovider%22%3Afalse%2C%22__relay_internal__pv__IsMergQAPollsrelayprovider%22%3Afalse%2C%22__relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometUFIShareActionMigrationrelayprovider%22%3Atrue%2C%22__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider%22%3Atrue%2C%22__relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider%22%3Afalse%7D&server_timestamps=true&doc_id=8537102933057513',
          method: 'POST',
        })
        const _0x7bc14f = _0x12dbcd.json
        _0x7bc14f.data.serpResponse.results.edges.forEach((_0x49203a) => {
          if (
            _0x49203a.rendering_strategy.view_model.ctas.primary[0].profile.viewer_join_state ===
              'CAN_JOIN' &&
            _0x34e1d7 < _0x23a6e5 &&
            !this.groupMap.includes(_0x49203a.rendering_strategy.view_model.profile.id)
          ) {
            this.groupMap.push(_0x49203a.rendering_strategy.view_model.profile.id)
            _0x7e4559.push({
              name: _0x49203a.rendering_strategy.view_model.profile_name_with_possible_nickname,
              question: _0x49203a.rendering_strategy.view_model.ctas.primary[0].profile
                .has_membership_questions
                ? 'Có'
                : 'Không',
              groupId: _0x49203a.rendering_strategy.view_model.profile.id,
              avatar: _0x49203a.rendering_strategy.view_model.profile.profile_picture.uri,
              status:
                _0x49203a.rendering_strategy.view_model.primary_snippet_text_with_entities.text.split(
                  ' · ',
                )[0],
              members:
                _0x49203a.rendering_strategy.view_model.primary_snippet_text_with_entities.text.split(
                  ' · ',
                )[1],
              posts:
                _0x49203a.rendering_strategy.view_model.primary_snippet_text_with_entities.text.split(
                  ' · ',
                )[2],
              source: _0x3b1097,
            })
            _0x34e1d7++
          }
        })
        _0x49bffa(_0x7e4559)
        if (_0x7bc14f.data.serpResponse.results.page_info.has_next_page && _0x34e1d7 < _0x23a6e5) {
          let _0xba02e3 = _0x7bc14f.data.serpResponse.results.page_info.end_cursor
          for (let _0xb9a83f = 0; _0xb9a83f < 9999; _0xb9a83f++) {
            await delayTime(1000)
            const _0x2ca53f = await fetch2('https://www.facebook.com/api/graphql/', {
              headers: {
                accept: '*/*',
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                this.uid +
                '&__aaid=0&__user=' +
                this.uid +
                '&__a=1&__req=6f&__hs=20135.HYP%3Acomet_pkg.2.1...1&dpr=1&__ccg=EXCELLENT&__rev=1020156942&__s=9lelic%3A16clb1%3Alb0vmg&__hsi=7472025301829894075&__dyn=7xeXzWK1ixt0mUyEqxemh0noeEb8nwgUao4ubyQdwSwAyUco5S3O2Saw8i2S1DwUx60GE5O0BU2_CxS320qa2OU7m221Fwgo9oO0-E4a3a4oaEnxO0Bo7O2l2Utwqo31wiE567Udo5qfK0zEkxe2GewyDwkUe9obrwh8lwUwgojUlDw-wUwxwjFovUuz86a1TxW2-awLyESE2KwwwOg2cwMwhEkxebwHwKG4UrwFg2fwxyo566k1FwgUjwOwWzUfHDzUiBG2OUqwjVqwLwHwa211xq19wVw&__csr=gekYh3kcsaMN2Df3kYYr5mwH2IlkBbs8ivcBlOLsBqnRcgZtZb8B9iTiHncIkWlEDHsQGkDsGbOjq9ipeJfV5ldOqQBbnibIzFbmHnjhaABlQDAQmhcO8h5j8RQDBBhmQXBAipaQFFa-lrpaGjWBHmjFtyuqVayy4F4FF3uYEW8G9GdGnjVZ7BQKdyHh9miW4nVQm8KjijCCWgLmil4zWAjADVoWibGijz5i-F5UGVJ2UyhDKiAuhFGmiAFVGBUmykqUCiFKmucCBAFBK8GJ95GvxiazpQiqhurh9Vt2u9xm8FoBK5V8yjSqicF1fzppufy-q68sgGmmdCAyEZe8J2FoO32i2eahQaxB2lyopHwFyo9EmBRGhbzeqbBVoKmeh8Gm6UKaw_AUsxa9-bwyye1hUtwnEpwQwzzUy1nwBla4qo4x0HwjUf4by610GQiaoOq0SE9Hzy1ecgTwgo5a0xA9g3mDQG-1jx14xOawooPxyqETxCHggijUK4y0hAVoGJapwfR0ooK4E8E98DhWzVU8U3DU9EnU2IEK9HogwlooKbK0CUy1AwqE4yha263mmblyUgxmGm2itpIU5WEggKFaosK444XxO4XiTc0gi10w0wGy80mhyo18E4y9w1I-1cw2qU0Vu01UOw3580VG2-03Kp0UwbW15wfFa4A5sPG0Ko3fyk0DsZwedxCu0nWpk09kg4t6Dg11o5i1tg763q0tC0z4u0BmiiUEi12w7rwi8429xy1TwKwlU-0wpZw8y8xO9wey2J6wbJ0ro1Ro0MC0HQ09_g0hLy84i048pE0Fa0kl0p82DwLojK1Gg0glOw7Zw9SEK0_Q0D80pew6FwfJ0cy2J0tU0A-07Ey02WAqt2oTBDgG2q1lw21A588U3hCBi86YMBcpoXQEiglF0&__comet_req=15&fb_dtsg=' +
                this.dtsg +
                '&jazoest=25564&lsd=OrfNVF3SWNkvM6lhAjXbWo&__spin_r=1020156942&__spin_b=trunk&__spin_t=1739716460&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=SearchCometResultsPaginatedResultsQuery&variables=%7B%22allow_streaming%22%3Afalse%2C%22args%22%3A%7B%22callsite%22%3A%22COMET_GLOBAL_SEARCH%22%2C%22config%22%3A%7B%22exact_match%22%3Afalse%2C%22high_confidence_config%22%3Anull%2C%22intercept_config%22%3Anull%2C%22sts_disambiguation%22%3Anull%2C%22watch_config%22%3Anull%7D%2C%22context%22%3A%7B%22bsid%22%3A%22b02d2974-5915-4d36-a5ff-cb21cac9e6fa%22%2C%22tsid%22%3A%220.0406180842980719%22%7D%2C%22experience%22%3A%7B%22client_defined_experiences%22%3A%5B%22ADS_PARALLEL_FETCH%22%5D%2C%22encoded_server_defined_params%22%3Anull%2C%22fbid%22%3Anull%2C%22type%22%3A%22GROUPS_TAB%22%7D%2C%22filters%22%3A%5B%5D%2C%22text%22%3A%22' +
                encodeURIComponent(_0x3b1097) +
                's%22%7D%2C%22feedLocation%22%3A%22SEARCH%22%2C%22feedbackSource%22%3A23%2C%22fetch_filters%22%3Atrue%2C%22focusCommentID%22%3Anull%2C%22locale%22%3Anull%2C%22privacySelectorRenderLocation%22%3A%22COMET_STREAM%22%2C%22renderLocation%22%3A%22search_results_page%22%2C%22scale%22%3A1%2C%22stream_initial_count%22%3A0%2C%22useDefaultActor%22%3Afalse%2C%22__relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__IsWorkUserrelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometFeedStoryDynamicResolutionPhotoAttachmentRenderer_experimentWidthrelayprovider%22%3A600%2C%22__relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider%22%3Afalse%2C%22__relay_internal__pv__WorkCometIsEmployeeGKProviderrelayprovider%22%3Afalse%2C%22__relay_internal__pv__IsMergQAPollsrelayprovider%22%3Afalse%2C%22__relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometUFIShareActionMigrationrelayprovider%22%3Atrue%2C%22__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider%22%3Atrue%2C%22__relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider%22%3Afalse%2C%22cursor%22%3A%22' +
                _0xba02e3 +
                '%22%7D&server_timestamps=true&doc_id=8537102933057513',
              method: 'POST',
            })
            const _0x152430 = _0x2ca53f.json
            const _0x478dc8 = []
            _0x152430.data.serpResponse.results.edges.forEach((_0x39dbbc) => {
              if (
                _0x39dbbc.rendering_strategy.view_model.ctas.primary[0].profile
                  .viewer_join_state === 'CAN_JOIN' &&
                _0x34e1d7 < _0x23a6e5 &&
                !this.groupMap.includes(_0x39dbbc.rendering_strategy.view_model.profile.id)
              ) {
                this.groupMap.push(_0x39dbbc.rendering_strategy.view_model.profile.id)
                _0x478dc8.push({
                  name: _0x39dbbc.rendering_strategy.view_model.profile_name_with_possible_nickname,
                  question: _0x39dbbc.rendering_strategy.view_model.ctas.primary[0].profile
                    .has_membership_questions
                    ? 'Có'
                    : 'Không',
                  groupId: _0x39dbbc.rendering_strategy.view_model.profile.id,
                  avatar: _0x39dbbc.rendering_strategy.view_model.profile.profile_picture.uri,
                  status:
                    _0x39dbbc.rendering_strategy.view_model.primary_snippet_text_with_entities.text.split(
                      ' · ',
                    )[0],
                  members:
                    _0x39dbbc.rendering_strategy.view_model.primary_snippet_text_with_entities.text.split(
                      ' · ',
                    )[1],
                  posts:
                    _0x39dbbc.rendering_strategy.view_model.primary_snippet_text_with_entities.text.split(
                      ' · ',
                    )[2],
                  source: _0x3b1097,
                })
                _0x34e1d7++
              }
            })
            _0x49bffa(_0x478dc8)
            if (_0x34e1d7 === _0x23a6e5) {
              break
            }
            if (_0x152430.data.serpResponse.results.page_info.has_next_page) {
              _0xba02e3 = _0x152430.data.serpResponse.results.page_info.end_cursor
            } else {
              break
            }
          }
        }
        _0x3b6d54(true)
      } catch (_0xb76d1e) {
        _0x4cceea(_0xb76d1e)
      }
    })
  }
  searchByUid(_0x2d98a5, _0xea3f76, _0x590c63) {
    return new Promise(async (_0x485303, _0x11b70d) => {
      try {
        const _0xc91d48 = await fetch2('https://graph.facebook.com/graphql', {
          method: 'POST',
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarydMoMY9fpXzuyAiLb',
          },
          body:
            '------WebKitFormBoundarydMoMY9fpXzuyAiLb\nContent-Disposition: form-data; name="q"\n\nnodes(' +
            _0x2d98a5 +
            '){groups{nodes{id,name,viewer_post_status,visibility,group_member_profiles{count}}}}\n------WebKitFormBoundarydMoMY9fpXzuyAiLb\nContent-Disposition: form-data; name="access_token"\n\n' +
            this.accessToken +
            '\n------WebKitFormBoundarydMoMY9fpXzuyAiLb--\n',
        })
        const _0x588cfd = _0xc91d48.json
        _0x590c63(
          _0x588cfd[_0x2d98a5].groups.nodes
            .map((_0x330ad1) => {
              return {
                name: _0x330ad1.name,
                question:
                  _0x330ad1.viewer_post_status === 'CAN_POST_AFTER_APPROVAL' ? 'Có' : 'Không',
                groupId: _0x330ad1.id,
                avatar: '',
                status: _0x330ad1.visibility === 'OPEN' ? 'Công khai' : 'Riêng tư',
                members: _0x330ad1.group_member_profiles.count,
                posts: '',
                source: _0x2d98a5,
              }
            })
            .slice(0, _0xea3f76),
        )
        _0x485303(true)
      } catch (_0x5ea2db) {
        _0x11b70d(_0x5ea2db)
      }
    })
  }
  async isAccessTokenValid(token) {
    try {
      const res = await fetch2(`https://graph.facebook.com/me?access_token=${token}`)
      const json = await res.json
      return !!json.id
    } catch {
      return false
    }
  }
  async checkImageExists(url) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
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
            this.accessToken = false
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

export default FB

/**
 * Hiển thị dữ liệu giả (placeholder) để cho người dùng biết quá trình tải đang diễn ra.
 * - Tạo 5 dòng dữ liệu mẫu.
 * - Cập nhật bảng với dữ liệu này.
 */
function loadingDataAds() {
  const placeholderData = Array.from({ length: 5 }, (_, i) => ({
    id: `Đang tải...`,
    name: 'Đang tải dữ liệu, vui lòng chờ...',
    status: 'Đang tải...',
    spent: 0, // Giá trị mặc định cho các trường số
    threshold: 0,
    currency: '',
  }))

  // Gửi sự kiện tùy chỉnh để cập nhật bảng với dữ liệu giả
  const event = new CustomEvent('addAccount', {
    detail: placeholderData,
  })
  document.dispatchEvent(event)
}

/**
 * Chuyển đổi mã trạng thái tài khoản thành chuỗi và lớp CSS.
 * @param {number} status - Mã trạng thái từ API Facebook.
 * @returns {{statusText: string, statusClass: string}}
 */
function getAccountStatusInfo(status) {
  const statusMap = {
    101: { text: 'Đóng', class: 'status-inactive' },
    999: { text: 'Hold', class: 'status-leave' },
    1: { text: 'Hoạt động', class: 'status-active' },
    100: { text: 'Hoạt động', class: 'status-active' },
    2: { text: 'Vô hiệu hóa', class: 'status-danger' },
    3: { text: 'Cần thanh toán', class: 'status-warning' },
    4: { text: 'Đang kháng 3 dòng', class: 'status-warning' },
    5: { text: 'Die 3 dòng', class: 'status-danger' },
    6: { text: 'Die XMDT', class: 'status-danger' },
    7: { text: 'Die vĩnh viễn', class: 'status-danger' },
  }
  const info = statusMap[status] || { text: `Không rõ (${status})`, class: 'status-secondary' }
  return {
    statusText: info.text,
    statusClass: info.class,
  }
}

export class FBTKQC {
  getAdAccountsData(_0x68362c, _0x1cb94c = false) {
    return new Promise(async (_0x51fe09, _0x1dacc0) => {
      $('#app').addClass('loading')
      try {
        const totalAccounts = _0x68362c.length
        const batchSize = 50
        let accountsLoaded = 0
        let startIdx = 0

        while (true) {
          const endIdx = startIdx + batchSize
          const currentBatch = _0x68362c.slice(startIdx, endIdx)

          if (currentBatch.length === 0) break
          if (accountsLoaded != 0) {
            addToast(`⏳ Đã tải xong ${accountsLoaded} /  ${totalAccounts} tài khoản.`, 'info')
          }
          // Chuẩn bị batch request cho Graph API
          const batchRequests = currentBatch.map((account) => ({
            id: account.adId,
            relative_url:
              '/act_' +
              account.adId +
              '?fields=account_id,name,account_status,is_prepay_account,next_bill_date,balance,owner_business,created_time,currency,adtrust_dsl,timezone_name,timezone_offset_hours_utc,disable_reason,adspaymentcycle{threshold_amount},owner,insights.date_preset(maximum){spend},userpermissions.user(' +
              fb.uid +
              '){role},users{id,is_active,name,permissions,role,roles}',
            method: 'GET',
          }))
          // Gửi request batch tới Graph API
          const response = await fetch2(
            'https://adsmanager-graph.facebook.com/v16.0?access_token=' +
              fb.accessToken +
              '&suppress_http_code=1&locale=en_US',
            {
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              body: 'include_headers=false&batch=' + JSON.stringify(batchRequests),
              method: 'POST',
            },
          )
          const results = response.json
          for (let i = 0; i < results.length; i++) {
            try {
              if (results[i].code == 200) {
                const accountData = JSON.parse(results[i].body)
                const index = _0x68362c.findIndex((acc) => acc.adId === accountData.account_id)
                // Format dữ liệu, tính toán các trường cần thiết
                accountData.limit = accountData.adtrust_dsl
                accountData.prePay = accountData.is_prepay_account ? 'TT' : 'TS'
                accountData.threshold = accountData.adspaymentcycle
                  ? accountData.adspaymentcycle.data[0].threshold_amount
                  : ''
                accountData.remain = accountData.threshold - accountData.balance
                accountData.spend = accountData.insights ? accountData.insights.data[0].spend : '0'
                accountData.users = accountData.users ? accountData.users.data : []

                const nextBillMoment = moment(accountData.next_bill_date)
                const now = moment()
                const daysToNextBill = nextBillMoment.diff(now, 'days')

                const currenciesThatNeedDivide = [
                  'EUR',
                  'CHF',
                  'BRL',
                  'USD',
                  'CNY',
                  'MYR',
                  'UAH',
                  'QAR',
                  'THB',
                  'TRY',
                  'GBP',
                  'PHP',
                  'INR',
                ]
                if (currenciesThatNeedDivide.includes(accountData.currency)) {
                  accountData.balance = Number(accountData.balance) / 100
                  accountData.threshold = Number(accountData.threshold) / 100
                  accountData.remain = Number(accountData.remain) / 100
                }

                // Định dạng số
                const formatNumber = (val) =>
                  new Intl.NumberFormat('en-US').format(val).replace('NaN', '')

                accountData.limit = formatNumber(accountData.limit)
                accountData.spend = formatNumber(accountData.spend)
                accountData.remain = formatNumber(accountData.remain)
                accountData.balance = formatNumber(accountData.balance)
                accountData.threshold = formatNumber(accountData.threshold)

                if (!accountData.cards) {
                  accountData.cards = []
                }

                // Lọc admin số lượng role 1001
                const adminNumber = accountData.users.filter((u) => u.role === 1001).length

                // Mapping disable reason
                const reasonMap = {
                  0: '',
                  1: 'ADS_INTEGRITY_POLICY',
                  2: 'ADS_IP_REVIEW',
                  3: 'RISK_PAYMENT',
                  4: 'GRAY_ACCOUNT_SHUT_DOWN',
                  5: 'ADS_AFC_REVIEW',
                  6: 'BUSINESS_INTEGRITY_RAR',
                  7: 'PERMANENT_CLOSE',
                  8: 'UNUSED_RESELLER_ACCOUNT',
                }

                accountGrid.api.applyTransaction({
                  update: [
                    {
                      id: _0x68362c[index].id,
                      status: accountData.account_status,
                      type: accountData.owner_business ? 'Business' : 'Cá nhân',
                      reason: reasonMap[accountData.disable_reason],
                      account: accountData.name,
                      adId: accountData.account_id,
                      balance: convertNumberFormat(accountData.balance),
                      limit: convertNumberFormat(accountData.limit),
                      spend: convertNumberFormat(accountData.spend),
                      oriSpend: convertNumberFormat(accountData.spend),
                      remain: convertNumberFormat(accountData.remain),
                      threshold: convertNumberFormat(accountData.threshold),
                      adminNumber: adminNumber,
                      nextBillDate: nextBillMoment.format('DD/MM/YYYY'),
                      nextBillDay: daysToNextBill < 0 ? 0 : daysToNextBill,
                      createdTime: moment(accountData.created_time).format('DD/MM/YYYY'),
                      timezone: accountData.timezone_name,
                      currency: accountData.currency,
                      country: '-',
                      payment: '-',
                      prePay: accountData.prePay,
                      role: accountData.userpermissions?.data[0]?.role || 'UNKNOWN',
                      bm: accountData.owner_business ? accountData.owner_business.id : null,
                    },
                  ],
                })
              }
            } catch (err) {
              addToast(`❌ Lỗi khi tải tài khoản: ${err.message || err}`, 'error')
            }
          }

          // Lấy dữ liệu bổ sung async cho từng account (ví dụ payment, country, status...)
          const promises = []
          const fetchExtraData = async (rowId, adId, businessId = false) => {
            try {
              // Giả sử hàm fb.checkHold và fb.getCard có sẵn
              const holdStatus = await fb.checkHold(adId)
              await delayTime(3)
              let paymentData = []
              try {
                const cards = await fb.getCard(adId)
                paymentData =
                  JSON.stringify(
                    cards.filter((c) => c.credential.__typename !== 'StoredBalance'),
                  ) || '[]'
              } catch (err) {
                addToast(`❌ Lỗi khi tải thẻ: ${err.message || err}`, 'error')
              }

              let specialStatus = ''
              if (holdStatus.status) {
                specialStatus = 999
              } else if (businessId) {
                // Gửi thêm request fetch GraphQL nếu cần
                const res = await fetch2(
                  'https://business.facebook.com/api/graphql/?_callFlowletID=1&_triggerFlowletID=2',
                  {
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    body: `av=${fb.uid}&__usid=...&__aaid=${adId}&__bid=${businessId}&__user=${fb.uid}&...`, // Cần thay đúng body request
                    method: 'POST',
                  },
                )
                const data = res.json
                const adRestrictInfo = data.data.adAccountData.advertising_restriction_info
                if (
                  adRestrictInfo.ids_issue_type === 'AD_ACCOUNT_ALR_DISABLE' &&
                  adRestrictInfo.status === 'APPEAL_PENDING'
                ) {
                  specialStatus = 4
                }
                if (
                  (adRestrictInfo.ids_issue_type === 'AD_ACCOUNT_ALR_DISABLE' &&
                    adRestrictInfo.status === 'VANILLA_RESTRICTED') ||
                  (adRestrictInfo.ids_issue_type === 'AD_ACCOUNT_ALR_DISABLE' &&
                    adRestrictInfo.status === 'APPEAL_REJECTED')
                ) {
                  specialStatus = 5
                }
                if (
                  adRestrictInfo.ids_issue_type === 'PREHARM_AD_ACCOUNT_BANHAMMER' &&
                  adRestrictInfo.status === 'APPEAL_INCOMPLETE'
                ) {
                  specialStatus = 6
                }
                if (
                  adRestrictInfo.ids_issue_type === 'PREHARM_AD_ACCOUNT_BANHAMMER' &&
                  adRestrictInfo.status === 'APPEAL_REJECTED'
                ) {
                  specialStatus = 7
                }
              }

              accountGrid.api.getRowNode(rowId).setDataValue('country', holdStatus.country)
              accountGrid.api.getRowNode(rowId).setDataValue('payment', paymentData)
              if (specialStatus) {
                accountGrid.api.getRowNode(rowId).setDataValue('status', specialStatus)
              }
            } catch (err) {
              addToast(`❌ Lỗi khi tải tài khoản: ${err.message || err}`, 'error')
            }
          }

          currentBatch.forEach((acc) => {
            const businessId = acc.owner_business ? acc.owner_business.id : null
            promises.push(fetchExtraData(acc.id, acc.adId, businessId))
          })
          // const tasks = currentBatch.map(acc => {
          //     const businessId = acc.owner_business?.id || null;
          //     return () => fetchExtraData(acc.id, acc.adId, businessId);
          // });
          // await runWithConcurrencyLimit(tasks, 1);
          await Promise.all(promises)

          accountsLoaded += currentBatch.length

          startIdx += batchSize
        }
        addToast('🎉 Hoàn tất tải toàn bộ dữ liệu tài khoản quảng cáo!', 'success')
        _0x51fe09()
      } catch (err) {
        addToast(`❌ Lỗi khi tải tài khoản: ${err.message || err}`, 'error')
        _0x1dacc0(err)
      }
      $('#app').removeClass('loading')
    })
  }

  getAdAccounts(_0x3eb1ec = true, _0x460b62 = 500) {
    return new Promise(async (_0x4a6c72, _0x4e5170) => {
      try {
        loadingDataAds()
        let allAccounts = []
        let _0x276480
        const accessToken = await getLocalStorage('accessToken')
        const _0x21f1cd = await fetch2(
          'https://graph.facebook.com/v14.0/me/adaccounts?limit=' +
            _0x460b62 +
            '&fields=name,profile_picture,account_id,account_status&access_token=' +
            accessToken +
            '&summary=1&locale=en_US',
        )
        _0x276480 = _0x21f1cd.json

        if (_0x276480 && Array.isArray(_0x276480.data)) {
          allAccounts.push(..._0x276480.data)
        }
        addToast(`🚀 Đã tải được ${allAccounts.length} tài khoản.`, 'success')
        let _0x13ba81 = _0x276480.paging.next
        if (_0x13ba81) {
          for (let _0x38f638 = 0; _0x38f638 < 9999; _0x38f638++) {
            const _0x1ea732 = await fetch2(_0x13ba81)
            const _0x451041 = _0x1ea732.json
            if (_0x451041.data) {
              allAccounts.push(..._0x451041.data)

              // Hiển thị toastr cập nhật số tài khoản đã tải
              addToast(`🚀 Đã tải được ${allAccounts.length} tài khoản.`, 'success')
            }
            if (_0x451041.paging.next) {
              _0x13ba81 = _0x451041.paging.next
            } else {
              break
            }
          }
        }
        if (_0x3eb1ec) {
          try {
            // Giả sử getHiddenAdAccount trả về một mảng các đối tượng tài khoản ẩn
            const hiddenAccounts = await this.getHiddenAdAccount(
              allAccounts.map((a) => a.account_id),
            )
            if (Array.isArray(hiddenAccounts)) {
              allAccounts.push(...hiddenAccounts)
            }
          } catch (err) {
            console.warn('Lỗi khi tải tài khoản ẩn:', err)
          }
        }
        // Resolve promise với dữ liệu đã được định dạng
        _0x4a6c72(
          allAccounts.map((acc) => {
            const { statusText, statusClass } = getAccountStatusInfo(acc.account_status)
            return {
              id: acc.account_id,
              name: acc.name || 'Không có tên',
              status: statusText,
              statusClass: statusClass,
            }
          }),
        )
      } catch (err) {
        addToast(`❌ Lỗi khi tải tài khoản: ${err.message || err}`, 'error')
        _0x4e5170(err)
      }
    })
  }

  /**
   * Lấy tài khoản quảng cáo từ một hoặc nhiều Business Manager.
   * @param {string[]} _0x100116 - Mảng các ID của Business Manager.
   */
  getBmAdsAccount(_0x100116) {
    return new Promise(async (_0x4f1727, _0x4ba977) => {
      try {
        const _0x564472 = (_0x44d3a1, _0x1afb39) => {
          return new Promise(async (_0x450d22, _0x55422a) => {
            try {
              const _0x5021e9 = await fetch2(
                'https://graph.facebook.com/v14.0/' +
                  _0x44d3a1 +
                  '/' +
                  _0x1afb39 +
                  '?access_token=' +
                  fb.accessToken +
                  '&pretty=1&fields=name,profile_picture,account_id,account_status&limit=100',
              )
              const _0xb82359 = _0x5021e9.json
              accountGrid.api.setRowData([])
              accountGrid.api.hideOverlay()
              const _0x345386 = []
              _0xb82359.data.forEach((_0x226cd9) => {
                _0x345386.push(_0x226cd9)
              })
              $(document).trigger('addAccount', [
                _0x345386.map((_0x44d1d8) => {
                  const _0x4667b6 = {
                    status: _0x44d1d8.account_status,
                    account: _0x44d1d8.name,
                    adId: _0x44d1d8.account_id,
                  }
                  return _0x4667b6
                }),
              ])
              let _0xb0053c = _0xb82359.paging.next
              if (_0xb0053c) {
                for (let _0x45c141 = 0; _0x45c141 < 9999; _0x45c141++) {
                  const _0x532e9a = await fetch2(_0xb0053c)
                  const _0x408402 = _0x532e9a.json
                  if (_0x408402.data) {
                    const _0x2449c6 = []
                    _0x408402.data.forEach((_0x2a78da) => {
                      _0x2449c6.push(_0x2a78da)
                    })
                    $(document).trigger('addAccount', [
                      _0x2449c6.map((_0x1fbdff) => {
                        const _0x3bc2d5 = {
                          status: _0x1fbdff.account_status,
                          account: _0x1fbdff.name,
                          adId: _0x1fbdff.account_id,
                        }
                        return _0x3bc2d5
                      }),
                    ])
                  }
                  if (_0x408402.paging.next) {
                    _0xb0053c = _0x408402.paging.next
                  } else {
                    break
                  }
                }
              }
            } catch (_0x22076b) {}
            _0x450d22()
          })
        }
        const _0x392a6b = []
        for (let _0x27fb35 = 0; _0x27fb35 < _0x100116.length; _0x27fb35++) {
          const _0x58d25c = _0x100116[_0x27fb35]
          _0x392a6b.push(_0x564472(_0x58d25c, 'owned_ad_accounts'))
          _0x392a6b.push(_0x564472(_0x58d25c, 'client_ad_accounts'))
        }
        await Promise.all(_0x392a6b)
        _0x4f1727()
      } catch (_0x14a2c0) {
        _0x4ba977(_0x14a2c0)
      }
    })
  }

  async CampPE(_0x434779, adsConfig, _0x4c4041) {
    return new Promise(async (_0x2ac995, _0x124383) => {
      try {
        _0x4c4041('Đang lấy ID TKQC')
        let campaign = 0
        let group = 0
        let adset = 0
        const graphApiResponse = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            _0x434779.adId +
            '?fields=addrafts%7Bid%7D&access_token=' +
            fb.accessToken,
        )
        const jsonData = await graphApiResponse.json // Chuyển response thành JSON
        // Kiểm tra xem dữ liệu có tồn tại không
        const adidcamp = jsonData?.addrafts?.data?.[0]?.id || null
        await fb.sleeptime()
        for (let i = 0; i < adsConfig.ads.adddraft1.value; i++) {
          const currentValue = $("textarea[name='draft']").val() // Lấy dữ liệu từ textarea
          if (currentValue) {
            const valuesArray = currentValue.split('|') // Tách dữ liệu theo dấu "|"
            const jsonData0 = valuesArray[0]
            const jsonData1 = valuesArray[1]
            const jsonData2 = valuesArray[2]
            let jsonData3 = valuesArray[3]
            let jsonData4 = valuesArray[4]
            let jsonData5 = valuesArray[5]
            const activeScenarioIDs = fb.generateActiveScenarioIDs() //__activeScenarioIDs=["fdac43b0-1580-4468-ad04-4a975e9a6337"]
            const flowid1n = fb.generateFlowInstanceIdidNumber() // 270231368
            const flowid2n = fb.generateFlowInstanceIdidNumber() // 270296634
            let callFlowletID = fb.generateCallFlowletID() //22433
            let callFlowletID2 = fb.generateCallFlowletID()
            let callFlowletID3 = fb.generateCallFlowletID()
            const flowid1u = fb.generateFlowInstanceIduniqueString() //_6af9f93f009cb465aad
            const sessionID = fb.generateSessionID() //64c29f78b8587af3
            const xref = fb.generateXref() //fcb465aad7edcf538
            const xref2 = fb.generateXref()
            const xref3 = fb.generateXref()

            // tạo chiến dịch
            const _0x325a1d = await fetch2(
              'https://adsmanager-graph.facebook.com/v19.0/' +
                adidcamp +
                '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                fb.accessToken +
                '&method=post&qpl_active_flow_ids=270209052%2C270220209%2C544221525&qpl_active_flow_instance_ids=270209052_96fa8fd59b37cbf4d4d%2C270220209_96f33fcfb7f1b42f073%2C544221525_96f2e002548c385f3b1%2C544221525_96fc2fa60305d96241f&__cppo=1&_callFlowletID=26&_triggerFlowletID=42206&qpl_active_flow_instance_ids=270220209_96f33fcfb7f1b42f073,544221525_96f2e002548c385f3b1,544221525_96fc2fa60305d96241f',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  '__activeScenarioIDs=%5B%22' +
                  activeScenarioIDs +
                  '%22%5D&__activeScenarios=%5B%22am.draft.create_draft%22%5D&__ad_account_id=' +
                  _0x434779.adId +
                  '&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3A' +
                  flowid1n +
                  '_' +
                  flowid1u +
                  '%2Cmedia_format%3Anull%2Cname%3Aam.draft.create_draft%2Crevisit%3A1%2Cstart_callsite%3AQUICK_CREATION%2Ccampaign_objective%3Anull%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=' +
                  callFlowletID +
                  '&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=' +
                  sessionID +
                  '&_triggerFlowletID=' +
                  (callFlowletID + 1) +
                  '&account_id=' +
                  _0x434779.adId +
                  '&action=add&ad_draft_id=' +
                  adidcamp +
                  '&ad_object_type=campaign&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&pretty=0&qpl_active_flow_ids=' +
                  flowid1n +
                  '%2C' +
                  flowid2n +
                  '&qpl_active_flow_instance_ids=' +
                  flowid1n +
                  '_' +
                  flowid1u +
                  '%2C' +
                  flowid2n +
                  '_' +
                  flowid1u +
                  '&source=click_quick_create&suppress_http_code=1&validate=false&values=' +
                  jsonData3 +
                  '&xref=' +
                  xref,
                method: 'POST',
              },
            )
            const _0x94bb9a = _0x325a1d.json
            // Kiểm tra xem dữ liệu có tồn tại không
            const adidcamp2 = _0x94bb9a?.ad_object_id || null
            // Kiểm tra xem jsonData0 và jsonData1 có trong jsonData4 không
            if (jsonData4.includes(jsonData0) || jsonData4.includes(jsonData1)) {
              jsonData4 = jsonData4
                .replace(new RegExp(jsonData0, 'g'), _0x434779.adId)
                .replace(new RegExp(jsonData1, 'g'), adidcamp2)
            }
            campaign++
            _0x4c4041(campaign + '-' + group + '-' + adset)
            await fb.sleeptime()
            // tạo nhóm
            const _0x325a1d2 = await fetch2(
              'https://adsmanager-graph.facebook.com/v19.0/' +
                adidcamp +
                '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                fb.accessToken +
                '&method=post&qpl_active_flow_ids=270209052%2C270220209%2C544221525&qpl_active_flow_instance_ids=270209052_96fa8fd59b37cbf4d4d%2C270220209_96f33fcfb7f1b42f073%2C544221525_96f2e002548c385f3b1%2C544221525_96fc2fa60305d96241f&__cppo=1&_callFlowletID=26&_triggerFlowletID=42206&qpl_active_flow_instance_ids=270220209_96f33fcfb7f1b42f073,544221525_96f2e002548c385f3b1,544221525_96fc2fa60305d96241f',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  '__activeScenarioIDs=%5B%22' +
                  activeScenarioIDs +
                  '%22%5D&__activeScenarios=%5B%22am.draft.create_draft%22%5D&__ad_account_id=' +
                  _0x434779.adId +
                  '&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3A' +
                  flowid1n +
                  '_' +
                  flowid1u +
                  '%2Cmedia_format%3Anull%2Cname%3Aam.draft.create_draft%2Crevisit%3A1%2Cstart_callsite%3AQUICK_CREATION%2Ccampaign_objective%3Anull%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=' +
                  callFlowletID2 +
                  '&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=' +
                  sessionID +
                  '&_triggerFlowletID=' +
                  (callFlowletID2 + 1) +
                  '&account_id=' +
                  _0x434779.adId +
                  '&action=add&ad_draft_id=' +
                  adidcamp +
                  '&ad_object_type=ad_set&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&parent_ad_object_id=' +
                  adidcamp2 +
                  '&pretty=0&qpl_active_flow_ids=' +
                  flowid1n +
                  '%2C' +
                  flowid2n +
                  '&qpl_active_flow_instance_ids=' +
                  flowid1n +
                  '_' +
                  flowid1u +
                  '%2C' +
                  flowid2n +
                  '_' +
                  flowid1u +
                  '&source=click_quick_create&suppress_http_code=1&validate=false&values=' +
                  jsonData4 +
                  '&xref=' +
                  xref2,
                method: 'POST',
              },
            )
            const _0x94bb9b = _0x325a1d2.json
            // Kiểm tra xem dữ liệu có tồn tại không
            const adidcamp3 = _0x94bb9b?.ad_object_id || null
            // Kiểm tra xem jsonData0 và jsonData1 có trong jsonData4 không
            if (jsonData5.includes(jsonData0) || jsonData5.includes(jsonData1)) {
              jsonData5 = jsonData5
                .replace(new RegExp(jsonData0, 'g'), _0x434779.adId)
                .replace(new RegExp(jsonData1, 'g'), adidcamp2)
                .replace(new RegExp(jsonData2, 'g'), adidcamp3)
            }

            group++
            _0x4c4041(campaign + '-' + group + '-' + adset)
            await fb.sleeptime()

            // tạo quảng cáo
            const _0x325a1d3 = await fetch2(
              'https://adsmanager-graph.facebook.com/v19.0/' +
                adidcamp +
                '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                fb.accessToken +
                '&method=post&qpl_active_flow_ids=270209052%2C270220209%2C544221525&qpl_active_flow_instance_ids=270209052_96fa8fd59b37cbf4d4d%2C270220209_96f33fcfb7f1b42f073%2C544221525_96f2e002548c385f3b1%2C544221525_96fc2fa60305d96241f&__cppo=1&_callFlowletID=26&_triggerFlowletID=42206&qpl_active_flow_instance_ids=270220209_96f33fcfb7f1b42f073,544221525_96f2e002548c385f3b1,544221525_96fc2fa60305d96241f',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  '__activeScenarioIDs=%5B%22' +
                  activeScenarioIDs +
                  '%22%5D&__activeScenarios=%5B%22am.draft.create_draft%22%5D&__ad_account_id=' +
                  _0x434779.adId +
                  '&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3A' +
                  flowid1n +
                  '_' +
                  flowid1u +
                  '%2Cmedia_format%3Anull%2Cname%3Aam.draft.create_draft%2Crevisit%3A1%2Cstart_callsite%3AQUICK_CREATION%2Ccampaign_objective%3Anull%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=' +
                  callFlowletID3 +
                  '&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=' +
                  sessionID +
                  '&_triggerFlowletID=' +
                  (callFlowletID3 + 1) +
                  '&account_id=' +
                  _0x434779.adId +
                  '&action=add&ad_draft_id=' +
                  adidcamp +
                  '&ad_object_type=ad&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&parent_ad_object_id=' +
                  adidcamp3 +
                  '&pretty=0&qpl_active_flow_ids=' +
                  flowid1n +
                  '%2C' +
                  flowid2n +
                  '&qpl_active_flow_instance_ids=' +
                  flowid1n +
                  '_' +
                  flowid1u +
                  '%2C' +
                  flowid2n +
                  '_' +
                  flowid1u +
                  '&source=click_quick_create&suppress_http_code=1&validate=false&values=' +
                  jsonData5 +
                  '&xref=' +
                  xref3,
                method: 'POST',
              },
            )
            const _0x94bb9c = _0x325a1d3.json
            adset++
            _0x4c4041(campaign + '-' + group + '-' + adset)
            fb.sleeptime()
          } else {
            _0x124383(false)
            console.warn('Textarea trống, không có dữ liệu để xử lý.')
          }
        }
        _0x2ac995()
      } catch (error) {
        _0x124383(false)
        console.error('Lỗi khi xử lý dữ liệu:', error)
      }
    })
  }
  checkPTTT(_0x434779, _0x307b45, _0x4c4040) {
    return new Promise(async (_0x567957, _0x4cb824) => {
      let thongTinTheThanhToan = '[]'
      try {
        try {
          const danhSachTheThanhToan = await fb.getCard(_0x434779.adId)
          thongTinTheThanhToan =
            JSON.stringify(
              danhSachTheThanhToan.filter((the) => the.credential.__typename !== 'StoredBalance'),
            ) || '[]'
        } catch {}
        //  await fb.checkADSlive(_0x434779, _0x4c4040);
        _0x4c4040('payment', {
          payment: thongTinTheThanhToan,
        })
        _0x4c4040('message', { message: 'Check Xong' })
      } catch (error) {
        _0x4c4040('message', { message: 'Check Lỗi' })
      }

      const _0x26bc0e = _0x307b45.general.delay.value * 100
      await delayTime(_0x26bc0e)
      _0x567957()
    })
  }
  checkbd(_0x434779, _0x307b45, _0x4c4040) {
    return new Promise(async (_0x567957, _0x4cb824) => {
      try {
        try {
          const _0x522800 = {
            message: 'Đang check thẻ ',
          }
          _0x4c4040('message', _0x522800)
          let thongTinTheThanhToan = '[]'
          try {
            try {
              // Lấy thông tin thẻ thanh toán của tài khoản quảng cáo
              const danhSachTheThanhToan = await fb.getCard(_0x434779.adId)

              // Lọc bỏ các thẻ có loại 'StoredBalance' và chuyển thành chuỗi JSON
              thongTinTheThanhToan =
                JSON.stringify(
                  danhSachTheThanhToan.filter(
                    (the) => the.credential.__typename !== 'StoredBalance',
                  ),
                ) || '[]'
            } catch {
              // Nếu có lỗi khi lấy thông tin thẻ, bỏ qua và để chuỗi JSON rỗng
            }
            await fb.checkADSlive(_0x434779, _0x4c4040)
            // Tạo đối tượng thông tin tài khoản quảng cáo
            _0x4c4040('payment', {
              payment: thongTinTheThanhToan,
            })
          } catch (error) {}
          const _0x522801 = {
            message: 'Đang check tài khoản',
          }
          _0x4c4040('message', _0x522801)
          const _0x174ebb = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=1&_triggerFlowletID=2',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                'variables=%7B%22paymentAccountID%22%3A%22' +
                _0x434779.adId +
                '%22%7D&doc_id=5746473718752934&__usid=6-Tscyowzn6jy8i%3APsczxuimcugzp%3A0-Asczvtr1dr572d-RV%3D6%3AF%3D&__aaid=' +
                _0x434779.adId +
                '&__bid=&__user=' +
                fb.uid +
                '&__a=1&__req=n&__hs=19848.BP%3ADEFAULT.2.0..0.0&dpr=3&__ccg=EXCELLENT&__rev=1013281346&__s=j3lvk4%3Awebeyo%3Askn8so&__hsi=7365375615401665772&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y1pzo2vw9G12x67EK3i1uK6o6eu2C2l0FggzE8U98451KfwXxq1-orx2364p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabDAAzawSyES2e0UFU6K19xq1owqpbwCwiUWawCwNwDwr8rwMxO1sDx27o721QwtU&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25497&lsd=dz_bG2uZlg-q7WYmKnmNTZ&__spin_r=1013281346&__spin_b=trunk&__spin_t=1714885145&__jssesw=1',
            },
          )
          const _0x288e69 = _0x174ebb.json
          // Kiểm tra xem _0x288e69 có phải là một đối tượng (object) và có thuộc tính "data" hay không
          if (typeof _0x288e69 === 'object' && _0x288e69.hasOwnProperty('data')) {
            // Kiểm tra xem _0x288e69.data có phải là một đối tượng và có thuộc tính "billable_account_by_payment_account" hay không
            if (
              typeof _0x288e69.data === 'object' &&
              _0x288e69.data.hasOwnProperty('billable_account_by_payment_account')
            ) {
              // Lấy đối tượng billable_account_by_payment_account
              const billableAccount = _0x288e69.data.billable_account_by_payment_account

              // Kiểm tra xem billableAccount có phải là một đối tượng và có thuộc tính "payment_modes" hay không
              if (
                typeof billableAccount === 'object' &&
                billableAccount.hasOwnProperty('payment_modes')
              ) {
                // Lấy mảng payment_modes
                const paymentModes = billableAccount.payment_modes
                // Xử lý kết quả
                _0x4c4040('message', {
                  message: 'Check ok',
                })
                if (paymentModes.includes('SUPPORTS_AUTO_RELOAD')) {
                  _0x4c4040('paytype', {
                    paytype: 'Thường',
                  })
                } else if (paymentModes.includes('SUPPORTS_POSTPAY')) {
                  _0x4c4040('paytype', {
                    paytype: 'Lưỡng tính',
                  })
                } else {
                  _0x4c4040('message', {
                    message: 'Check xong',
                  })
                  _0x4c4040('paytype', {
                    paytype: 'Thường',
                  })
                }
              } else {
                // Trường hợp không có payment_modes
                _0x4c4040('message', {
                  message: 'Check lỗi',
                })
                _0x4c4040('paytype', {
                  paytype: 'Check lỗi không xác định',
                })
              }
            } else {
              // Trường hợp không có billable_account_by_payment_account
              _0x4c4040('message', {
                message: 'Check lỗi',
              })
              _0x4c4040('paytype', {
                paytype: 'Check lỗi không xác định',
              })
            }
          } else {
            // Trường hợp _0x288e69 không phải là object hoặc không có data
            _0x4c4040('message', {
              message: 'Check lỗi',
            })
            _0x4c4040('paytype', {
              paytype: 'Check lỗi không xác định',
            })
          }
        } catch (_0x59b8fa) {
          _0x4c4040('message', {
            message: 'Check lỗi',
          })
          _0x4c4040('paytype', {
            paytype: 'Check lỗic',
          })
        }
      } catch (_0x505d42) {
        console.log(_0x505d42)
      }

      const _0x26bc0e = _0x307b45.general.delay.value * 100
      await delayTime(_0x26bc0e)

      _0x567957()
    })
  }

  checkADS(adInfo, adsConfig, _0x4c4040) {
    return new Promise(async (_0x567957, _0x4cb824) => {
      try {
        _0x4c4040('message', { message: 'Đang check ADS' })
        const response = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            adInfo.adId +
            '?fields=campaigns%7Bdelivery_status,status,effective_status%7D,ads%7Bdelivery_status,%20status,effective_status%7D,adsets.limit(200)%7Bdelivery_status,%20status,effective_status%7D,average_lifetime_campaign_budget,average_lifetime_campaign_group_budget,average_daily_campaign_group_budget,average_daily_campaign_budget&access_token=' +
            fb.accessToken2,
        )
        const data = await response.json
        if (!data || typeof data !== 'object') {
          throw new Error('Dữ liệu không hợp lệ!')
        }
        await fb.checkADSlive(adInfo, _0x4c4040)
        // Hàm đếm số lượng theo trạng thái
        const countStatus = (items) => {
          return items.reduce((acc, item) => {
            let status = item.status || 'UNKNOWN'
            acc[status] = (acc[status] || 0) + 1
            return acc
          }, {})
        }

        // Lấy dữ liệu và kiểm tra null/undefined
        const campaigns = data.campaigns?.data || []
        const adsets = data.adsets?.data || []
        const ads = data.ads?.data || []

        // Đếm số lượng
        const totalCampaigns = campaigns.length
        const totalAdsets = adsets.length
        const totalAds = ads.length

        // Đếm trạng thái thực tế
        const campaignStatus = countStatus(campaigns)
        const adsetStatus = countStatus(adsets)
        const adStatus = countStatus(ads)

        // Chuỗi kết quả
        const result =
          `(${totalCampaigns} - ${totalAdsets} - ${totalAds})_` +
          `( ${JSON.stringify(campaignStatus)} - ` +
          `${JSON.stringify(adsetStatus)} - ` +
          `${JSON.stringify(adStatus)})`

        _0x4c4040('campaings', { campaings: result })
        _0x4c4040('message', { message: 'Check OK' })
      } catch (error) {
        _0x4c4040('message', { message: 'Check lỗi' })
        console.log(error)
      }

      const _0x26bc0e = adsConfig.general.delay.value * 100
      await delayTime(_0x26bc0e)
      _0x567957()
    })
  }
  getLinkXmdtAds(_0x510fbc) {
    return new Promise(async (_0x5358dd, _0x4aa080) => {
      try {
        const _0x16fbd1 = await fetch2('https://business.facebook.com/api/graphql/?_flowletID=1', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'variables={"paymentAccountID":"' +
            _0x510fbc +
            '"}&doc_id=5746473718752934&__usid=6-Ts5btmh131oopb:Ps5bu98bb7oey:0-As5btmhrwegfg-RV=6:F=&__user=' +
            fb.uid +
            '&__a=1&__req=s&__hs=19699.BP:DEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010282616&__s=flj1ty:75294s:o83s9c&__hsi=7310049091311550655&__dyn=7xeUmxa3-Q5E9EdoK2abBAqwIBwCwgE98nCG6UtyEgwjojyUW3qiidBxa7GzU726US2Sfxq4U5i4824yoyaxG4o4B0l898885G0Eo9FE4Wqmm2Z17wJBGEpiwzlBwgrxK261UxO4VA48a8lwWxe4oeUa85vzo2vw9G12x67EK3i1uK6o6fBwFwBgak48W2e2i11grzUeUmwvC6UgzE8EhAy88rwzzXwAyo98gxu5ogAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W1Ez84e6ohxabDAAzawSyES2e0UFU6K19xq1ox3wlFbwCwiUWawCwNwDwr8rwMxO1sDx27o72&__csr=&fb_dtsg=' +
            fb.dtsg +
            '&jazoest=25610&lsd=HExoeF2styyeq_LWWUo9db&__aaid=' +
            _0x510fbc +
            '&__spin_r=1010282616&__spin_b=trunk&__spin_t=1702003435&__jssesw=1',
        })
        const _0x54969a = _0x16fbd1.json
        const _0x140329 = _0x54969a.data.billable_account_by_payment_account.id
        const _0x32535c = await fetch2(
          'https://www.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=370',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsptewb4bad6z%3APsptfos1fajaid%3A0-Asptet91igfuw1-RV%3D6%3AF%3D&session_id=5d3404452e9bd1f&__aaid=0&__user=' +
              fb.uid +
              '&__a=1&__req=14&__hs=20097.BP%3ADEFAULT.2.0.0.0.0&dpr=1&__ccg=EXCELLENT&__rev=1019227852&__s=0iltbe%3Advrmaz%3A103jkm&__hsi=7457852865934213148&__dyn=7xeUmxa3-Q5E9EdoK2Wmhe2Om2q1Dxuq3O1Fx-ewSAxam4Euxa1twKzobo9E6y4824yoyaxG4o2oCwho5G0O85mqbwgEbUy742ppU467U8o2lxe68a8522m3K7EC11wBz8188O12x67E421uxS1zDwFwBgak1EwRwEwiUmwvDxC48W2a4p8aHwzzXwKwjo9EjxyEtw9O222edwmEiwm8W4U5W0DU-58fU7m1LxW4o-3qazo8U3yDwbm1LwqpbBwwwiUWawCwNwDwr8rwjk1rDw4kwtU5K2G0yVHwwxS&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25406&lsd=ezom4RfqRqejfUWS5IqHv-&__spin_r=1019227852&__spin_b=trunk&__spin_t=1736416683&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useAccountQualityHubIssueQueryWrapperQuery&variables=%7B%22id%22%3A%22' +
              _0x140329 +
              '%22%2C%22startTime%22%3Anull%7D&server_timestamps=true&doc_id=8742430529208614',
            method: 'POST',
          },
        )
        const _0x2a6ba2 = _0x32535c.json
        const _0x4ef3a0 =
          _0x2a6ba2.data.node.advertising_restriction_info.additional_parameters
            .paid_actor_root_appeal_container_id
        const _0x4eb5ed = _0x2a6ba2.data.node.advertising_restriction_info.ids_issue_ent_id
        const _0x66425 =
          _0x2a6ba2.data.node.advertising_restriction_info.additional_parameters.decision_id
        const _0x19ac3a =
          _0x2a6ba2.data.node.advertising_restriction_info.additional_parameters
            .friction_decision_id
        if (_0x4ef3a0) {
          const _0xba99a4 = await fetch2(
            'https://business.facebook.com/accountquality/ufac/?entity_id=' +
              _0x510fbc +
              '&paid_actor_root_appeal_container_id=' +
              _0x4ef3a0 +
              '&entity_type=2&_callFlowletID=2181&_triggerFlowletID=2181',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                '__usid=6-Tsc6xu718a07sn%3APsc6xui6pgn2f%3A0-Asc6xtp1nh4rnc-RV%3D6%3AF%3D&session_id=15e5a69ec0978238&__aaid=0&__bid=' +
                _0x510fbc +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=u&__hs=19832.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1012906458&__s=9ubr7j%3Arv9koe%3Ads4ihh&__hsi=7359564425697670285&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhe5UkBwCwpUnCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx60C9EcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo462mcwuEnw8ScwgECu7E422a3Fe6rwiolDwFwBgak48W2e2i3mbgrzUiwExq1yxJUpx2awCx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sq6UfEO32fxiFUd8bGwgUy1kx6bCyVUCcG2-qaUK2e0UFU2RwrU6CiVo884KeCK2q362u1dxW6U98a85Ou0DU7i1Tw&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25352&lsd=MPaEvH-IKd3rimyUrjtr5C&__spin_r=1012906458&__spin_b=trunk&__spin_t=1713532122&__jssesw=1',
              method: 'POST',
            },
          )
          const _0x5500ab = JSON.parse(_0xba99a4.text.replace('for (;;);', ''))
          const _0x1f795f = _0x5500ab.payload.enrollment_id
          _0x5358dd(_0x1f795f)
        } else if (_0x66425) {
          const _0x193e7a = await fetch2(
            'https://www.facebook.com/accountquality/ufac/?decision_id=' +
              _0x66425 +
              '&ids_issue_id=' +
              _0x4eb5ed +
              '&entity_type=2&entity_id=' +
              _0x510fbc +
              '&_flowletID=9999',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                '__usid=6-Ts2rbmo1223bxs:Ps2rbmm1pafisj:0-As2rbmcwf48js-RV=6:F=&session_id=4d371069f94ed908&__user=' +
                fb.uid +
                '&__a=1&__req=q&__hs=19649.BP:DEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009336620&__s=vkojb0:tpoa7e:m367w6&__hsi=7291509895584633584&__dyn=7xeUmxa2C5rgydwCwRyU8EKnFG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx611wlFEcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyUszUiwExq1yxJUpx2aK2a4p8y26U8U-UbE4S7VEjCx6Etwj84-3ifzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzwi82pDwbm1Lx3wlFbBwwwiUWqU9Eco9U4S7ErwAwEwn9U&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25489&lsd=QTfKpPcJRl9RAFTWridNry&__aaid=0&__spin_r=1009336620&__spin_b=trunk&__spin_t=1697686941',
            },
          )
          const _0x4e0f97 = JSON.parse(_0x193e7a.text.replace('for (;;);', ''))
          const _0x232c07 = _0x4e0f97.payload.enrollment_id
          _0x5358dd(_0x232c07)
        } else if (_0x19ac3a) {
          const _0x33bd41 = await fetch2(
            'https://www.facebook.com/accountquality/ufac/?decision_id=' +
              _0x19ac3a +
              '&ids_issue_id=' +
              _0x4eb5ed +
              '&entity_type=2&entity_id=' +
              _0x510fbc +
              '&_flowletID=2169',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                '__usid=6-Ts32udfp2ieqb%3APs32udrqbzoxh%3A0-As32ud2p8mux0-RV%3D6%3AF%3D&session_id=2478ab408501cdea&__user=' +
                fb.uid +
                '&__a=1&__req=u&__hs=19655.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009465523&__s=417qpb%3Alchip2%3Ayq4pb1&__hsi=7293818531390316856&__dyn=7xeUmxa2C5rgydwCwRyU8EKnFG5UkBwCwgE98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx611wlFEcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo465udz87G5U2dz84a9DxW10wywWjxCU4C5pUao9k2B12ewzwAwRyUszUiwExq1yxJUpx2aK2a4p8y26U8U-UbE4S7VEjCx6Etwj84-3ifzobEaUiwm8Wubwk8Sp1G3WcwMzUkGum2ym2WE4e8wl8hyVEKu9zawLCyKbwzwi82pDwbm15wFx3wlFbBwwwiUWqU9Eco9U4S7ErwAwEwn9U2vw&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25548&lsd=A-HDfPRVoR7YG2zHwlCDBx&__aaid=0&__spin_r=1009465523&__spin_b=trunk&__spin_t=1698224463',
            },
          )
          const _0x15ae13 = JSON.parse(_0x33bd41.text.replace('for (;;);', ''))
          const _0x3792cb = _0x15ae13.payload.enrollment_id
          _0x5358dd(_0x3792cb)
        } else {
          _0x4aa080()
        }
      } catch (_0x18aec1) {
        console.log(_0x18aec1)
        _0x4aa080(_0x18aec1)
      }
    })
  }
  removeAdsUser(_0x119fdf, _0x375ca4) {
    return new Promise(async (_0x1447b8, _0x29af71) => {
      try {
        const _0x30e9ee = await fetch2(
          'https://graph.facebook.com/v14.0/act_' +
            _0x119fdf +
            '/users/' +
            _0x375ca4 +
            '?method=DELETE&access_token=' +
            fb.accessToken,
        )
        const _0x5d83fa = _0x30e9ee.json
        if (_0x5d83fa.success) {
          _0x1447b8()
        } else {
          _0x29af71()
        }
      } catch (_0x470041) {
        console.log(_0x470041)
        _0x29af71()
      }
    })
  }
  getAdsUser(_0x45b509) {
    return new Promise(async (_0x504bc6, _0x2dca74) => {
      try {
        const _0x193716 = await fetch2(
          'https://graph.facebook.com/v16.0/act_' +
            _0x45b509 +
            '?access_token=' +
            fb.accessToken +
            '&__cppo=1&__activeScenarioIDs=[]&__activeScenarios=[]&__interactionsMetadata=[]&_reqName=adaccount&fields=["users{id,is_active,name,permissions,role,roles}"]&locale=en_US&method=get&pretty=0&suppress_http_code=1&xref=f3b1944e6a8b33c&_flowletID=1',
        )
        const _0x21d82b = _0x193716.json
        _0x504bc6(_0x21d82b.users.data)
      } catch (_0x2627f6) {
        _0x2dca74()
      }
    })
  }
  checkHiddenAdmin(_0xeb3506, _0x1d3784 = false) {
    return new Promise(async (_0x48c764, _0x539418) => {
      try {
        let _0x43e945
        if (_0x1d3784) {
          _0x43e945 = await fetch2(
            'https://business.facebook.com/ads/manager/account_settings/information/?act=' +
              _0xeb3506 +
              '&pid=p1&business_id=' +
              _0x1d3784 +
              '&page=account_settings&tab=account_information',
          )
        } else {
          _0x43e945 = await fetch2(
            'https://www.facebook.com/ads/manager/account_settings/information/?act=' + _0xeb3506,
          )
        }
        const _0x5787f9 = _0x43e945.text
        const _0x345a5b = _0x5787f9.match(/\b(\d+)\,(name:null)\b/g)
        if (_0x345a5b) {
          _0x48c764(
            _0x345a5b.map((_0x16050f) => {
              return _0x16050f.replace(',name:null', '')
            }),
          )
        } else {
          _0x48c764([])
        }
      } catch (_0x177a12) {
        _0x539418(_0x177a12)
      }
    })
  }
  addCardtay(_0xa8a8c8, _0x45df85) {
    return new Promise(async (_0x43c454, _0x346fcc) => {
      // Loại bỏ khoảng trắng trong số thẻ và chuyển thành chuỗi số liên tục
      const _0x18be63 = _0x45df85.cardNumber.toString().replaceAll(' ', '')
      try {
        const popupWidth = 350
        const popupHeight = 450
        const spacing = 20
        const screenWidth = window.screen.availWidth
        const screenHeight = window.innerHeight || screen.height
        console.log(`⏳ Đang mở tab mới...`)
        let left = leftOffset
        let top = topOffset

        leftOffset += popupWidth + spacing
        // Nếu vượt quá chiều rộng màn hình, reset về đầu dòng và tăng top
        if (leftOffset + popupWidth > screenWidth) {
          leftOffset = fb.getRandomNumber() * 10
          topOffset += popupHeight + spacing
        }

        // Nếu vượt quá chiều cao màn hình, reset vị trí top
        if (topOffset + popupHeight > screenHeight) {
          topOffset = 0 // Hoặc có thể dùng `screenHeight - popupHeight` để giữ popup trong màn hình
        }
        // Mở từng tab và xử lý ngay khi mở xong
        newTabwin(
          'https://business.facebook.com/billing_hub/payment_settings?asset_id=' + _0xa8a8c8,
          left,
          top,
          popupWidth,
          popupHeight,
        )
          .then(async (tabnew) => {
            try {
              console.log(`✅ Tab đã mở, bắt đầu xử lý...`)
              await new Promise((resolve) => setTimeout(resolve, 1000))
              console.log(`⏳ [Tab ] Click vào nút...`)
              await clickButtonInTab(
                tabnew,
                "//div[@role='button' and contains(., 'Thêm phương thức thanh toán')]",
                5000000,
              )
              console.log(`⏳ [Tab ] Click vào nút next...`)
              await clickButtonInTab(
                tabnew,
                "//div[@role='button' and contains(., 'Tiếp')]",
                10000000,
              )
              await new Promise((resolve) => setTimeout(resolve, 1000))
              console.log(`⏳ [Tab ] Nhập thông tin...`)
              await inputTextInTab(
                tabnew,
                '//input[(preceding-sibling::*[contains(., "Tên trên thẻ")] or following-sibling::*[contains(., "Tên trên thẻ")])]',
                '' + _0x45df85.cardName + '',
                10000000,
              )
              await inputTextInTab(
                tabnew,
                '//input[(preceding-sibling::*[contains(., "Số thẻ")] or following-sibling::*[contains(., "Số thẻ")])]',
                _0x18be63,
              )
              await inputTextInTab(
                tabnew,
                "//input[@type='text' and (preceding-sibling::label[contains(., 'MM/YY')] or following-sibling::label[contains(., 'MM/YY')] or ancestor::*[label[contains(., 'MM/YY')]])]",
                _0x45df85.expDate,
              )
              await inputTextInTab(
                tabnew,
                "//input[@name='securityCode' and @type='password']",
                _0x45df85.cardCsv,
              )
              console.log(`⏳ [Tab ] Click vào nút checkbox...`)
              await Promise.race([
                clickButtonInTab(
                  tabnew,
                  "//div[@class='x6s0dn4 xat24cr xcud41i x139jcc6 x1nhvcw1 x78zum5 x1iyjqo2 xgqtt45 x1a02dak']//input[@type='checkbox']",
                ),
                new Promise((resolve) => setTimeout(resolve, 2000)), // Timeout sau 2 giây
              ])
              await Promise.race([
                clickButtonInTab(
                  tabnew,
                  "input[type='//div[contains(@class, 'x9f619')]//input[@type='checkbox']']",
                ),
                new Promise((resolve) => setTimeout(resolve, 2000)), // Timeout sau 2 giây
              ])
              console.log(`⏳ [Tab ] Click vào nút Save...`)
              await clickButtonInTab(tabnew, "//div[@role='button' and contains(., 'Lưu')]", 500000)
              //  await new Promise((resolve) => setTimeout(resolve, 10000));
              // Lấy nội dung trang sau khi nhập thẻ
              let _0x13586a
              try {
                _0x13586a = await checkXpathInTab(
                  tabnew,
                  "//span[@dir='auto' and contains(., 'Đã xảy ra lỗi')]",
                  50000,
                )
              } catch (error) {
                _0x13586a = false
              }
              // let pageContent = await getPageContent(tabnew);
              // console.log("📜 Nội dung trang sau khi nhập thẻ:", pageContent);
              // _0x13586a = pageContent; // Gán dữ liệu để kiểm tra
              // console.log(`⏳ Đang đóng tab  ] ...`);
              // await closeTab(tabnew);
              // console.log(`✅ [Tab ] Hoàn thành!`);
              if (!_0x13586a) {
                _0x43c454()
              } else {
                _0x346fcc()
              }
            } catch (error) {}
            console.log(`⏳ Đang đóng tab  ] ...`)
            await closeTab(tabnew)
            console.log(`✅ [Tab ] Hoàn thành!`)
            _0x346fcc()
          })
          .catch((error) => {
            console.error(`❌ Lỗi mở tab :`, error)
            _0x346fcc(error)
          })
      } catch (_0x2558e4) {
        _0x346fcc(_0x2558e4)
      } finally {
        // Ẩn loading
        $('#loadgroup').prop('disabled', false).html('Load ')
      }
    })
  }
  addCard(_0xa8a8c8, _0x45df85, _0x259501) {
    return new Promise(async (_0x43c454, _0x346fcc) => {
      const _0x5027a9 = fb.uid
      const _0x8a0186 = fb.dtsg
      console.log(_0x5027a9, _0x8a0186)
      try {
        const _0x18be63 = _0x45df85.cardNumber.toString().replaceAll(' ', '')
        const _0x5b20fa = parseInt(_0x45df85.expMonth)
        const _0x49e3de = parseInt(_0x45df85.expYear)
        const _0x1ecadb = _0x18be63.toString().substr(0, 6)
        const _0x455ff7 = _0x18be63.toString().slice(-4)
        let _0x13586a = false
        if (_0x259501 == 1) {
          _0x13586a = await fetch2(
            'https://business.secure.facebook.com/ajax/payment/token_proxy.php?tpe=%2Fapi%2Fgraphql%2F&_flowletID=5755',
            {
              headers: {
                accept: '*/*',
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                _0x5027a9 +
                '&payment_dev_cycle=prod&__usid=6-Ts5n9f71tgu6bi%3APs5n9f71o4wo1d%3A0-As5n9es1ukf1sd-RV%3D6%3AF%3D&__user=' +
                _0x5027a9 +
                '&__a=1&__req=23&__hs=19705.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010409196&__s=tsyyte%3Aca3toj%3Ap91ad2&__hsi=7312337759778035971&__dyn=7xeUmxa3-Q5E9EdoK2abBAqwIBwCwgE98nCG6UtyEgwjojyUW3qiidBxa7GzU726US2Sfxq4U5i4824yoyaxG4o4B0l898885G0Eo9FE4Wqmm2Z17wJBGEpiwzlBwgrxK261UxO4VA48a8lwWxe4oeUa8465udw9-0CE4a4ouyUd85WUpwo-m2C2l0FggzE8U98451KfwXxq1-orx2ewyx6i8wxK2efK2i9wAx25Ulx2iexy223u5U4O222edwKwHxa3O6UW4UnwhFA0FUkyFobE6ycwgUpx64EKuiicG3qazo8U3yDwqU4C5E5y4e1mAK2q1bzEG2q362u1IxK32785Ou48tws8&fb_dtsg=' +
                _0x8a0186 +
                '&jazoest=25632&lsd=8pbDxyOWVFHU8ZQqBPXwiA&__aaid=' +
                _0xa8a8c8 +
                '&__spin_r=1010409196&__spin_b=trunk&__spin_t=1702536307&__jssesw=1&qpl_active_flow_ids=270206296&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingAddCreditCardMutation&variables=%7B%22input%22%3A%7B%22billing_address%22%3A%7B%22country_code%22%3A%22VN%22%7D%2C%22billing_logging_data%22%3A%7B%22logging_counter%22%3A56%2C%22logging_id%22%3A%221695426641%22%7D%2C%22cardholder_name%22%3A%22' +
                encodeURIComponent(_0x45df85.cardName) +
                '%22%2C%22credit_card_first_6%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x1ecadb +
                '%22%7D%2C%22credit_card_last_4%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x455ff7 +
                '%22%7D%2C%22credit_card_number%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x18be63 +
                '%22%7D%2C%22csc%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x45df85.cardCsv +
                '%22%7D%2C%22expiry_month%22%3A%22' +
                _0x5b20fa +
                '%22%2C%22expiry_year%22%3A%2220' +
                _0x49e3de +
                '%22%2C%22payment_account_id%22%3A%22' +
                _0xa8a8c8 +
                '%22%2C%22payment_type%22%3A%22MOR_ADS_INVOICE%22%2C%22unified_payments_api%22%3Atrue%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingcreditcard%22%2C%22target_name%22%3A%22useBillingAddCreditCardMutation%22%2C%22user_session_id%22%3A%22upl_1702536309339_5f530bbf-fed6-4f28-8d5c-48c42769f959%22%2C%22wizard_session_id%22%3A%22upl_wizard_1702536309339_859290be-8180-4b68-a810-97e329d6ff00%22%7D%2C%22actor_id%22%3A%22' +
                _0x5027a9 +
                '%22%2C%22client_mutation_id%22%3A%2211%22%7D%7D&server_timestamps=true&doc_id=7203358526347017&fb_api_analytics_tags=%5B%22qpl_active_flow_ids%3D270206296%22%5D',
              method: 'POST',
            },
          )
        }
        if (_0x259501 == 2) {
          _0x13586a = await fetch2(
            'https://business.secure.facebook.com/ajax/payment/token_proxy.php?tpe=%2Fapi%2Fgraphql%2F&_flowletID=5602',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                _0x5027a9 +
                '&payment_dev_cycle=prod&__usid=6-Ts5nbs384tvjc%3APs5nbs31x3roaz%3A0-As5nbrg12abp26-RV%3D6%3AF%3D&__user=' +
                _0x5027a9 +
                '&__a=1&__req=2c&__hs=19705.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010409196&__s=vva7lu%3Ai7twp6%3Ai6haj9&__hsi=7312350885137944044&__dyn=7xeUmxa3-Q5E9EdoK2abBAqwIBwCwgE98nCG6UtyEgwjojyUW3qiidBxa7GzU726US2Sfxq4U5i4824yoyaxG4o4B0l898885G0Eo9FE4Wqmm2Z17wJBGEpiwzlBwgrxKaxq1UxO4VA48a8lwWxe4oeUa8465udw9-0CE4a4ouyUd85WUpwo-m2C2l0FggzE8U98451KfwXxq3O11orx2ewyx6i8wxK2efK2i9wAx25Ulx2iexy223u5U4O222edwKwHxa3O6UW4UnwhFA0FUkyFobE6ycwgUpx64EKuiicG3qazo8U3yDwqU4C5E5y4e1mAK2q1bzEG2q362u1IxK32785Ou48tws8&fb_dtsg=' +
                _0x8a0186 +
                '&jazoest=25632&lsd=atclR6VUVMWqcQJ9vPCgdL&__aaid=' +
                _0xa8a8c8 +
                '&__spin_r=1010409196&__spin_b=trunk&__spin_t=1702539363&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingAddCreditCardMutation&variables=%7B%22input%22%3A%7B%22billing_address%22%3A%7B%22country_code%22%3A%22VN%22%7D%2C%22billing_logging_data%22%3A%7B%22logging_counter%22%3A36%2C%22logging_id%22%3A%222195093243%22%7D%2C%22cardholder_name%22%3A%22' +
                encodeURIComponent(_0x45df85.cardName) +
                '%22%2C%22credit_card_first_6%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x1ecadb +
                '%22%7D%2C%22credit_card_last_4%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x455ff7 +
                '%22%7D%2C%22credit_card_number%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x18be63 +
                '%22%7D%2C%22csc%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x45df85.cardCsv +
                '%22%7D%2C%22expiry_month%22%3A%22' +
                _0x5b20fa +
                '%22%2C%22expiry_year%22%3A%2220' +
                _0x49e3de +
                '%22%2C%22payment_account_id%22%3A%22' +
                _0xa8a8c8 +
                '%22%2C%22payment_type%22%3A%22MOR_ADS_INVOICE%22%2C%22unified_payments_api%22%3Atrue%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingcreditcard%22%2C%22target_name%22%3A%22useBillingAddCreditCardMutation%22%2C%22user_session_id%22%3A%22upl_1702539365385_4aba71a2-a333-4dba-9816-d502aa296ad1%22%2C%22wizard_session_id%22%3A%22upl_wizard_1702539445087_1069a84b-5462-4e7c-b503-964f5da85c9e%22%7D%2C%22actor_id%22%3A%22' +
                _0x5027a9 +
                '%22%2C%22client_mutation_id%22%3A%228%22%7D%7D&server_timestamps=true&doc_id=7203358526347017',
              method: 'POST',
            },
          )
        }
        if (_0x259501 == 3) {
          _0x13586a = await fetch2(
            'https://adsmanager.secure.facebook.com/ajax/payment/token_proxy.php?tpe=%2Fapi%2Fgraphql%2F&_flowletID=8308',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                _0x5027a9 +
                '&payment_dev_cycle=prod&__usid=6-Ts5ncpg15yixvw%3APs5ncpg19n5k27%3A0-As5nco9x6xrcn-RV%3D6%3AF%3D&__user=' +
                _0x5027a9 +
                '&__a=1&__req=2h&__hs=19705.BP%3Aads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1010412528&__s=0oatf1%3A21wtco%3A7hru27&__hsi=7312356040330685281&__dyn=7AgSXgWGgWEjgDBxmSudg9omoiyoK6FVpkihG5Xx2m2q3Kq2imeGqFEkG4VEHoOqqE88lBxeipe9wNWAAzppFuUuGfxW2u5Eiz8WdyU8ryUKrVoS3u7azoV2EK12xqUC8yEScx6bxW5FQ4Vbz8ix2q9hUhzoizE-Hx6290BAggwwCzoO69UryFE4eaKFprzu6QUCZ0IXGECutk2dmm2adAyXzAbwxyU6O78jCgOVp8W9AylmnyUb8jz98eUS48C11xny-cyo725UiGm1ixWcgsxN6ypVoKcyV8W22m78eF8pK3m2DBCG4UK4EigK7kbAzE8Uqy43mbgOUGfgeEhAwJCxSegroG48gyHx2cAByV8y7rKfxefKaxWi2y2icxaq4VEhGcx22uexm4ofp8rxefzobK4UGaxa2h2pqK6UCQubxu3ydCgqw-yK4UoLzokGp5yrz8CVoaHQfwCz8ym9yA4Ekx24oKqbDypVawwy9pEHCAwzxa3m5EG1LDDV8swhU4embwVzi1y4fz8coiGQU9EeU-eC-5u8BwNU9oboS4ouK5Qq78ohXF3U8pE8FUlxuiueyK5okyEC8wVw&__comet_req=25&fb_dtsg=' +
                _0x8a0186 +
                '&jazoest=25300&lsd=kQwoj2grbvdlOnXmuC9nTM&__aaid=' +
                _0xa8a8c8 +
                '&__spin_r=1010412528&__spin_b=trunk&__spin_t=1702540563&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingAddCreditCardMutation&variables=%7B%22input%22%3A%7B%22billing_address%22%3A%7B%22country_code%22%3A%22US%22%7D%2C%22billing_logging_data%22%3A%7B%22logging_counter%22%3A60%2C%22logging_id%22%3A%224034760264%22%7D%2C%22cardholder_name%22%3A%22' +
                encodeURIComponent(_0x45df85.cardName) +
                '%22%2C%22credit_card_first_6%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x1ecadb +
                '%22%7D%2C%22credit_card_last_4%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x455ff7 +
                '%22%7D%2C%22credit_card_number%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x18be63 +
                '%22%7D%2C%22csc%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x45df85.cardCsv +
                '%22%7D%2C%22expiry_month%22%3A%22' +
                _0x5b20fa +
                '%22%2C%22expiry_year%22%3A%2220' +
                _0x49e3de +
                '%22%2C%22payment_account_id%22%3A%22' +
                _0xa8a8c8 +
                '%22%2C%22payment_type%22%3A%22MOR_ADS_INVOICE%22%2C%22unified_payments_api%22%3Atrue%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingcreditcard%22%2C%22target_name%22%3A%22useBillingAddCreditCardMutation%22%2C%22user_session_id%22%3A%22upl_1702540566252_4f062482-d4e4-4c40-b8c5-c0d643d0e5b4%22%2C%22wizard_session_id%22%3A%22upl_wizard_1702540566252_5d97ef95-3809-4231-a8b3-f487855c965d%22%7D%2C%22actor_id%22%3A%22' +
                _0x5027a9 +
                '%22%2C%22client_mutation_id%22%3A%2212%22%7D%7D&server_timestamps=true&doc_id=7203358526347017',
              method: 'POST',
            },
          )
        }
        if (_0x259501 == 4) {
          _0x13586a = await fetch2(
            'https://business.secure.facebook.com/ajax/payment/token_proxy.php?tpe=%2Fapi%2Fgraphql%2F&_flowletID=3823',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                _0x5027a9 +
                '&payment_dev_cycle=prod&__usid=6-Ts5nduusqru6%3APs5nduu1s4ryxb%3A0-As5nduuzgap66-RV%3D6%3AF%3D&__user=' +
                _0x5027a9 +
                '&__a=1&__req=1o&__hs=19705.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010413747&__s=a9ss2l%3Aptab0y%3Ae2tqc1&__hsi=7312362442079618026&__dyn=7xeUmxa3-Q5E9EdoK2abBAqwIBwCwgE98nCG6UtyEgwjojyUW3qiidBxa7GzU726US2Sfxq4U5i4824yoyaxG4o4B0l898885G0Eo9FE4Wqmm2Z17wJBGEpiwzlBwgrxKaxq1UxO4VA48a8lwWxe4oeUa85vzo2vw9G12x67EK3i1uK6o6fBwFwBgak48W2e2i11grzUeUmwYwgm6UgzE8EhAy88rwzzXwAyo98gxu5ogAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W1Ez84e6ohxabDAAzawSyES2e0UFU6K19xq1ox3wlFbwCwiUWawCwNwDwr8rwMxO1sDx27o72&fb_dtsg=' +
                _0x8a0186 +
                '&jazoest=25289&lsd=WCAAksbHDq9ktWk0fRV9iq&__aaid=' +
                _0xa8a8c8 +
                '&__spin_r=1010413747&__spin_b=trunk&__spin_t=1702542054&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingAddCreditCardMutation&variables=%7B%22input%22%3A%7B%22billing_address%22%3A%7B%22country_code%22%3A%22VN%22%7D%2C%22billing_logging_data%22%3A%7B%22logging_counter%22%3A45%2C%22logging_id%22%3A%223760170890%22%7D%2C%22cardholder_name%22%3A%22' +
                encodeURIComponent(_0x45df85.cardName) +
                '%22%2C%22credit_card_first_6%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x1ecadb +
                '%22%7D%2C%22credit_card_last_4%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x455ff7 +
                '%22%7D%2C%22credit_card_number%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x18be63 +
                '%22%7D%2C%22csc%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x45df85.cardCsv +
                '%22%7D%2C%22expiry_month%22%3A%22' +
                _0x5b20fa +
                '%22%2C%22expiry_year%22%3A%2220' +
                _0x49e3de +
                '%22%2C%22payment_account_id%22%3A%22' +
                _0xa8a8c8 +
                '%22%2C%22payment_type%22%3A%22MOR_ADS_INVOICE%22%2C%22unified_payments_api%22%3Atrue%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingcreditcard%22%2C%22target_name%22%3A%22useBillingAddCreditCardMutation%22%2C%22user_session_id%22%3A%22upl_1702542056078_4b48c676-8dff-447d-8576-be8eace3fa70%22%2C%22wizard_session_id%22%3A%22upl_wizard_1702542056078_63cbaee3-ff87-45c3-8093-96bbd0331e68%22%7D%2C%22actor_id%22%3A%22' +
                _0x5027a9 +
                '%22%2C%22client_mutation_id%22%3A%227%22%7D%7D&server_timestamps=true&doc_id=7203358526347017',
              method: 'POST',
            },
          )
        }
        if (_0x259501 == 5) {
          _0x13586a = await fetch2(
            'https://adsmanager.secure.facebook.com/ajax/payment/token_proxy.php?tpe=%2Fapi%2Fgraphql%2F&_flowletID=3674',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                _0x5027a9 +
                '&payment_dev_cycle=prod&__usid=6-Ts5nebgytlglm%3APs5ned212v0lbj%3A0-As5nebgnh3ghe-RV%3D6%3AF%3D&__user=' +
                _0x5027a9 +
                '&__a=1&__req=1d&__hs=19705.BP%3Aads_manager_pkg.2.0..0.0&dpr=1&__ccg=UNKNOWN&__rev=1010413747&__s=338clt%3Ahvf4zf%3Afrhk6f&__hsi=7312365256460775839&__dyn=7AgSXgWGgWEjgDBxmSudgf64ECbxGuml4AqxuUgBwCwXCwABzGCGq5axeqaScCCG225pojACjyocuF98SmqnK7GzUuwDxq4EOezoK26UKbC-mdwTxOESegGbwgEmK9y8Gdz8hyUuxqt1eiUO4EgCyku4oS4EWfGUhwyg9p44889EScxyu6UGq13yHGmmUTxJe9LgbeWG9DDl0zlBwyzp8KUV0JyU6O78qgOVp8W9AylmnyUb8jz98eUS48C11xny-cyo725UiGm1ixWcgsxN6ypVoKcyV8W22m78eF8pK3m2DBCG4UK4EigK7oOiewzxG8gdoJ3byEZ0Wx6i2Sq7oV1JyEgx2aK48OimbAy8tKU-4U-UG7F8a898O4FEjCx6EO489UW5ohwZAxK4U-dwKUjyEG4E949BGUryrhUK5Ue8Sp1G3WaUjxy-dxiFAm9KcyrBwGLg-2qcy9oCagixi48hyVEKu9DAG228BCyKqi2e4EdomyE6-uvAxO17wgVoK3Cd868g-cwNxaHgaEeU-eC-5u8BwNU9oboS4ouK5Qq78ohXF3U8pE8FUlxuiueyK5okyEC8wVw&__comet_req=25&fb_dtsg=' +
                _0x8a0186 +
                '&jazoest=25466&lsd=V93_40ILei7NAmQfSh_tls&__aaid=' +
                item.ad +
                '&__spin_r=1010413747&__spin_b=trunk&__spin_t=1702542709&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingAddCreditCardMutation&variables=%7B%22input%22%3A%7B%22billing_address%22%3A%7B%22country_code%22%3A%22VN%22%7D%2C%22billing_logging_data%22%3A%7B%22logging_counter%22%3A41%2C%22logging_id%22%3A%223115641264%22%7D%2C%22cardholder_name%22%3A%22' +
                encodeURIComponent(_0x45df85.cardName) +
                '%22%2C%22credit_card_first_6%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x1ecadb +
                '%22%7D%2C%22credit_card_last_4%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x455ff7 +
                '%22%7D%2C%22credit_card_number%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x18be63 +
                '%22%7D%2C%22csc%22%3A%7B%22sensitive_string_value%22%3A%22' +
                _0x45df85.cardCsv +
                '%22%7D%2C%22expiry_month%22%3A%22' +
                _0x5b20fa +
                '%22%2C%22expiry_year%22%3A%2220' +
                _0x49e3de +
                '%22%2C%22payment_account_id%22%3A%22' +
                _0xa8a8c8 +
                '%22%2C%22payment_type%22%3A%22MOR_ADS_INVOICE%22%2C%22unified_payments_api%22%3Atrue%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingcreditcard%22%2C%22target_name%22%3A%22useBillingAddCreditCardMutation%22%2C%22user_session_id%22%3A%22upl_1702542711187_368e9941-43bc-4e54-8a9a-78e0e48980fd%22%2C%22wizard_session_id%22%3A%22upl_wizard_1702542711187_088ec65b-5388-4d82-8e28-12533de0fff5%22%7D%2C%22actor_id%22%3A%22' +
                _0x5027a9 +
                '%22%2C%22client_mutation_id%22%3A%228%22%7D%7D&server_timestamps=true&doc_id=7203358526347017',
              method: 'POST',
            },
          )
        }
        if (_0x13586a) {
          const _0x3ea7b8 = _0x13586a.text
          if (_0x3ea7b8.includes('{"credit_card":{"card_association":"')) {
            _0x43c454()
          } else {
            _0x346fcc()
          }
        } else {
          _0x346fcc()
        }
      } catch (_0x2558e4) {
        _0x346fcc(_0x2558e4)
      }
    })
  }
  Pushcard(IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const _0x4fbd03 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=1&_triggerFlowletID=2',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'variables=%7B%22paymentAccountID%22%3A%22' +
              IDTK +
              '%22%7D&doc_id=5746473718752934&__usid=6-Tscyowzn6jy8i%3APsczxuimcugzp%3A0-Asczvtr1dr572d-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=n&__hs=19848.BP%3ADEFAULT.2.0..0.0&dpr=3&__ccg=EXCELLENT&__rev=1013281346&__s=j3lvk4%3Awebeyo%3Askn8so&__hsi=7365375615401665772&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y1pzo2vw9G12x67EK3i1uK6o6eu2C2l0FggzE8U98451KfwXxq1-orx2364p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabDAAzawSyES2e0UFU6K19xq1owqpbwCwiUWawCwNwDwr8rwMxO1sDx27o721QwtU&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25497&lsd=dz_bG2uZlg-q7WYmKnmNTZ&__spin_r=1013281346&__spin_b=trunk&__spin_t=1714885145&__jssesw=1',
            method: 'POST',
          },
        )
        const _0x94b8b9 = _0x4fbd03.json

        const methods =
          _0x94b8b9?.data?.billable_account_by_payment_account?.billing_payment_account
            ?.billing_payment_methods || []
        const credentialid =
          methods
            .find((m) => m.credential?.__typename === 'ExternalCreditCard')
            ?.credential?.credential_id?.trim() || null

        const _0x4fbd12 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=2483&_triggerFlowletID=2176',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsdy0a7hiuhwr%3APsdy0ne1t3a9a8%3A0-Asdy0a1cm9hmf-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=15&__hs=19866.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013712485&__s=kkjw10%3Aytkybb%3Awnvy73&__hsi=7372204343302817774&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y11xudw9-0CE4a4ouyUd85WUpwoVUao9k2B12ewzwAwgk6U-3K5E7VxK48cohAy88rwzzXwAyo98gxu2qiexy223u5U4O222edwKwHxa3O6UW4UnwhFA0FUkyFobE462qcwgUpx64EKcAzawSyES2e0UFU6K19xq1ox3wlFbwCwiUWawCwNwDwr8rwMxO1sDx27o721awFwtU&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25417&lsd=Qn7ZmA_Evs9olxS8Kbr-Ek&__spin_r=1013712485&__spin_b=trunk&__spin_t=1716475082&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingTurnOnAutopayCreditCardLandingScreenQuery&variables=%7B%22creditCardID%22%3A%22' +
              credentialid +
              '%22%7D&server_timestamps=true&doc_id=7612504135477665',
            method: 'POST',
          },
        )

        const _0x4fbd22 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=3188&_triggerFlowletID=3188',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsdy0a7hiuhwr%3APsdy0ne1t3a9a8%3A0-Asdy0a1cm9hmf-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=1h&__hs=19866.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013712485&__s=rk89qt%3Aytkybb%3Awnvy73&__hsi=7372204343302817774&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y11xudw9-0CE4a4ouyUd85WUpwoVUao9k2B12ewzwAwgk6U-3K5E7VxK48cohAy88rwzzXwAyo98gxu2qiexy223u5U4O222edwKwHxa3O6UW4UnwhFA0FUkyFobE462qcwgUpx64EKcAzawSyES2e0UFU6K19xq1ox3wlFbwCwiUWawCwNwDwr8rwMxO1sDx27o721awFwtU&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25417&lsd=Qn7ZmA_Evs9olxS8Kbr-Ek&__spin_r=1013712485&__spin_b=trunk&__spin_t=1716475082&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=billingQEContextFactoryMutation&variables=%7B%22input%22%3A%7B%22param%22%3A%22show_text_v3%22%2C%22payment_legacy_account_id%22%3A%22' +
              IDTK +
              '%22%2C%22type%22%3A%22PAYMENT_ACCOUNT%22%2C%22universe_name%22%3A%22billing_dynamic_loading_screen%22%2C%22actor_id%22%3A%22' +
              fb.uid +
              '%22%2C%22client_mutation_id%22%3A%224%22%7D%7D&server_timestamps=true&doc_id=6399580870111681',
            method: 'POST',
          },
        )

        const _0x4fbd32 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=3188&_triggerFlowletID=3188',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsdxz4i1lwtvgu%3APsdxz5bcn63i0%3A0-Asdxz4e1l3np3a-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=1t&__hs=19866.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013712485&__s=w9hxms%3Actpibf%3Aajxawi&__hsi=7372195976293952099&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y11xudw9-0CE4a4ouyUd85WUpwoVUao9k2B12ewzwAwgk6U-3K5E7VxK48cohAy88rwzzXwAyo98gxu2qiexy223u5U4O222edwKwHxa3O6UW4UnwhFA0FUkyFobE462qcwgUpx64EKcAzawSyES2e0UFU6K19xq1ox3wlFbwCwiUWawCwNwDwr8rwMxO1sDx27o721awFwtU&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25535&lsd=_pEM9K0ph8gh6QHGGuabhk&__spin_r=1013712485&__spin_b=trunk&__spin_t=1716473134&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingTryToActivateCreditCardStateQuery&variables=%7B%22paymentAccountID%22%3A%22' +
              IDTK +
              '%22%2C%22paymentMethodID%22%3A%22' +
              credentialid +
              '%22%2C%22country%22%3Anull%7D&server_timestamps=true&doc_id=7175474629172280',
            method: 'POST',
          },
        )
        const _0x4fbd32s = _0x4fbd32.json

        const data = _0x4fbd32s?.data?.billable_account_by_payment_account
        const currency = data?.currency || null
        const paymentitemtype = data?.payment_item_type || null
        const _0x4fbd42 = await fetch2(
          'https://business.secure.facebook.com/ajax/payment/token_proxy.php?tpe=%2Fapi%2Fgraphql%2F&_callFlowletID=3624&_triggerFlowletID=3521',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&payment_dev_cycle=prod&__usid=6-Tsdy0a7hiuhwr%3APsdy11l15x24e2%3A0-Asdy0a1cm9hmf-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=1t&__hs=19866.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013712485&__s=nwvdkx%3Aytkybb%3Avub2fv&__hsi=7372206537506594749&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y11xudw9-0CE4a4ouyUd85WUpwo-m2C2l0FggzE8U98451KfwXxq1-orx2364p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabz98OEdEGdwzweau1Hwiomwm8gU5qiU9E4KeyE9Eco9U6O6Uc8swn9UgxS1MwiEao7u&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25525&lsd=gJAdek3r2LyF8c2NdHnR_a&__spin_r=1013712485&__spin_b=trunk&__spin_t=1716475593&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingTryToActivateCreditCardStateMutation&variables=%7B%22input%22%3A%7B%22account_currency%22%3A%22' +
              currency +
              '%22%2C%22authentication_response_type%22%3A%22REDIRECT%22%2C%22authentication_response_url%22%3A%22https%3A%2F%2Fbusiness.facebook.com%2Fbilling_interfaces%2Fexternal_result%2F%3Fnonce%3DUR1UkpzSFHa6oy9CecVMnqYqzUrIKNHH%22%2C%22billing_logging_data%22%3A%7B%22logging_counter%22%3A38%2C%22logging_id%22%3A%224069905198%22%7D%2C%22csc%22%3A%7B%22sensitive_string_value%22%3A%22%22%7D%2C%22payment_item_type%22%3A%22' +
              paymentitemtype +
              '%22%2C%22sender_credential_id%22%3A%22' +
              credentialid +
              '%22%2C%22sender_payment_account_id%22%3A%22' +
              IDTK +
              '%22%2C%22tax_country%22%3A%22PH%22%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingcreditcard%22%2C%22target_name%22%3A%22useBillingAddCreditCardMutation%22%2C%22user_session_id%22%3A%22upl_1716475595835_b343ce0a-e51c-4a00-9a3e-b3e44b8d0095%22%2C%22wizard_session_id%22%3A%22upl_wizard_1716475595835_1c429083-1e01-4025-9134-9081ddeb125b%22%7D%2C%22actor_id%22%3A%22' +
              fb.uid +
              '%22%2C%22client_mutation_id%22%3A%226%22%7D%7D&server_timestamps=true&doc_id=4772731529517495',
            method: 'POST',
          },
        )

        const _0x4fbd52 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=3570&_triggerFlowletID=3521',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsdy0a7hiuhwr%3APsdy11l15x24e2%3A0-Asdy0a1cm9hmf-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=1u&__hs=19866.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013712485&__s=nwvdkx%3Aytkybb%3Avub2fv&__hsi=7372206537506594749&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y11xudw9-0CE4a4ouyUd85WUpwo-m2C2l0FggzE8U98451KfwXxq1-orx2364p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabz98OEdEGdwzweau1Hwiomwm8gU5qiU9E4KeyE9Eco9U6O6Uc8swn9UgxS1MwiEao7u&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25525&lsd=gJAdek3r2LyF8c2NdHnR_a&__spin_r=1013712485&__spin_b=trunk&__spin_t=1716475593&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingActivateCreditCardCompletionStateQuery&variables=%7B%22paymentAccountID%22%3A%22' +
              IDTK +
              '%22%2C%22creditCardID%22%3A%22' +
              credentialid +
              '%22%7D&server_timestamps=true&doc_id=5658846610906400',
            method: 'POST',
          },
        )

        const _0x4fbd62 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=3706&_triggerFlowletID=3521',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsdy0a7hiuhwr%3APsdy11l15x24e2%3A0-Asdy0a1cm9hmf-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=1v&__hs=19866.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013712485&__s=nwvdkx%3Aytkybb%3Avub2fv&__hsi=7372206537506594749&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y11xudw9-0CE4a4ouyUd85WUpwo-m2C2l0FggzE8U98451KfwXxq1-orx2364p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabz98OEdEGdwzweau1Hwiomwm8gU5qiU9E4KeyE9Eco9U6O6Uc8swn9UgxS1MwiEao7u&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25525&lsd=gJAdek3r2LyF8c2NdHnR_a&__spin_r=1013712485&__spin_b=trunk&__spin_t=1716475593&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingActivateCreditCardCompletionStateMutation&variables=%7B%22input%22%3A%7B%22credential_id%22%3A%22' +
              credentialid +
              '%22%2C%22logging_data%22%3A%7B%22logging_counter%22%3A44%2C%22logging_id%22%3A%224069905198%22%7D%2C%22payment_account_id%22%3A%22' +
              IDTK +
              '%22%2C%22skip_settle%22%3Afalse%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingcreditcard%22%2C%22credential_id%22%3A%22' +
              credentialid +
              '%22%2C%22credential_type%22%3A%22CREDIT_CARD%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%221561718783%22%2C%22target_name%22%3A%22BillingActivateCreditCardCompletionStateMutation%22%2C%22user_session_id%22%3A%22upl_1716475595835_b343ce0a-e51c-4a00-9a3e-b3e44b8d0095%22%2C%22wizard_config_name%22%3A%22ACTIVATE_CREDIT_CARD_SUB_CONFIG%22%2C%22wizard_name%22%3A%22TURN_ON_AUTOPAY%22%2C%22wizard_screen_name%22%3A%22enter_cvv_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1716475595835_1c429083-1e01-4025-9134-9081ddeb125b%22%2C%22wizard_state_name%22%3A%22activate_credit_card_completion_state_decision%22%7D%2C%22actor_id%22%3A%22' +
              fb.uid +
              '%22%2C%22client_mutation_id%22%3A%227%22%7D%7D&server_timestamps=true&doc_id=6423622687694848',
            method: 'POST',
          },
        )
        const _0x4fbd72 = await fetch2('https://business.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body:
            'av=' +
            fb.uid +
            '&__usid=6-Tshehz0pr6vox%3APshej38x28fhm%3A0-Ashehyq1bnee5a-RV%3D6%3AF%3D&__aaid=' +
            IDTK +
            '&__bid=&__user=' +
            fb.uid +
            '&__a=1&__req=1n&__hs=19933.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=MODERATE&__rev=1015220516&__s=vfwotw%3Ab7xezr%3Aholn7x&__hsi=7397154843446345983&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y11xudw9-0CE4a4ouyUd85WUpwoVUao9k2B2V8cE98451KfwXxq1-orx2ewyx6i2GU8U-U98C2i48nwCAzEowwwTxu1cwwwzzo5G4Ef8rzEjxu16Cg2DxiaBwKwgo9EO13xC4oiyUOicG3qazo8U3yDwqU4C5E5y4e1mAK2q1bzEG2q362u1IxK32785Ou48twbK2C1TwmUvw&__csr=&fb_dtsg=' +
            fb.dtsg +
            '&jazoest=25360&lsd=sLBgejlwOsJKrsbWR7H0_Y&__spin_r=1015220516&__spin_b=trunk&__spin_t=1722284323&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingMakePrimaryMutation&variables=%7B%22input%22%3A%7B%22billable_account_payment_legacy_account_id%22%3A%22' +
            IDTK +
            '%22%2C%22primary_funding_id%22%3A%22' +
            credentialid +
            '%22%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingaddpm%22%2C%22credential_id%22%3A%22' +
            credentialid +
            '%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%223905048907%22%2C%22target_name%22%3A%22useBillingMakePrimaryMutation%22%2C%22user_session_id%22%3A%22upl_1722284330261_d37eanuc-4371-ngk4-2wvn-ce3gms7k3ky0%22%2C%22wizard_config_name%22%3A%22MAKE_PRIMARY%22%2C%22wizard_name%22%3A%22MAKE_PRIMARY%22%2C%22wizard_screen_name%22%3A%22make_primary_display_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1722284330261_8ca5wn2e-vtwi-7608-9c3b-h2ayuyy49dgu%22%2C%22wizard_state_name%22%3A%22make_primary_display_state_display%22%7D%2C%22actor_id%22%3A%22' +
            fb.uid +
            '%22%2C%22client_mutation_id%22%3A%228%22%7D%2C%22billingEntryPoint%22%3A%22BILLING_HUB%22%7D&server_timestamps=true&doc_id=7103464963093222',
          method: 'POST',
        })

        const _0x94bbb2 = _0x4fbd72.json
        if (!_0x94bbb2.errors) {
          _0x1de5a2(true)
        } else {
          _0x47e12d(false)
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d(false)
      }
    })
  }
  Paymomo(_0xfbde40) {
    return new Promise(async (_0x3fd239, _0x582b15) => {
      try {
        const id1 = fb.generateCustomId()
        const id2 = fb.generateCustomId()
        const IDTK =
          'av=' +
          fb.uid +
          '&__usid=6-Tsn3vk91va0931%3APsn3vj51622inx%3A0-Asn3vk41ug96fh-RV%3D6%3AF%3D&__aaid=' +
          _0xfbde40 +
          '&__bid=&__user=' +
          fb.uid +
          '&__a=1&__req=1v&__hs=20044.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1018271799&__s=g7sqvk%3Al7pwl1%3A0orepy&__hsi=7438303228818369873&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxiFGxK7oG484S4UKewSAAzpoixW4E726US2Sfxq4U5i4824yoyaxG4o4B0l898888oe82xwCCwjFEK2Z17wJyaxBa2dmm11K6U8o2lxep122y5oeEjx63K2y1pzo2vw9G12x67EK3i1uK6o6eu2C2l0FgKi3a2i11grzUeUmwvC6UgzE8EhAwGK2efK2i9wAx25U9F8W6888dUnwj8888US1qxa3O6UW4UnwhFA2W1Uxi48bE462qcwgUaUuz98OEdEGdwzweau1Hwiomwm8gU5qiU9E4KeyE9Eco9U6O6Uc8sg5Ku48twem1TwmUvyEeUvwWwwxS2O&__csr=&fb_dtsg=' +
          fb.dtsg +
          '&jazoest=25563&lsd=mPCBqFWEUg7IayP28kQklh&__spin_r=1018271799&__spin_b=trunk&__spin_t=1731864928&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingNewUserUtilsLockIntoStandardMutation&variables=%7B%22input%22%3A%7B%22billable_account_payment_legacy_account_id%22%3A%22' +
          _0xfbde40 +
          '%22%2C%22logging_data%22%3A%7B%22logging_counter%22%3A24%2C%22logging_id%22%3A%223235430996%22%7D%2C%22recurring_enabled%22%3Afalse%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingaddpm%22%2C%22credential_id%22%3A%22platformized_lpm_momo_wallet_vn%22%2C%22credential_type%22%3A%22ALT_PAY%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%22639773720%22%2C%22target_name%22%3A%22BillingNewUserUtilsLockIntoStandardMutation%22%2C%22user_session_id%22%3A%22upl_1722535985155_' +
          id1 +
          '%22%2C%22wizard_config_name%22%3A%22ADD_PM%22%2C%22wizard_name%22%3A%22ADD_PM%22%2C%22wizard_screen_name%22%3A%22wizard_landing_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1722535985155_' +
          id2 +
          '%22%2C%22wizard_state_name%22%3A%22account_initialize_state_decision%22%7D%2C%22actor_id%22%3A%22' +
          fb.uid +
          '%22%2C%22client_mutation_id%22%3A%2213%22%7D%7D&server_timestamps=true&doc_id=7791185067596896'
        const _0x4f6682 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=3868&_triggerFlowletID=3791',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body: IDTK,
            method: 'POST',
          },
        )
        const _0x5a8642 = _0x4f6682.json

        const id3 = fb.generateCustomId()
        const id4 = fb.generateCustomId()
        const _0x4f6681 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=3868&_triggerFlowletID=3791',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsn3wpj15l8hfa%3APsn3wo849v1n6%3A0-Asn3wpe8atkbg-RV%3D6%3AF%3D&__aaid=' +
              _0xfbde40 +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=27&__hs=20044.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1018271799&__s=hewp8c%3Atzh5x9%3Acgfnjb&__hsi=7438309579535058669&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxiFGxK7oG484S4UKewSAAzpoixW4E726US2Sfxq4U5i4824yoyaxG4o4B0l898888oe82xwCCwjFEK2Z17wJyaxBa2dmm11K6U8o2lxep122y5oeEjx63K2y1pzo2vw9G12x67EK3i1uK6o6eu2C2l0FgKi3a2i11grzUeUmwvC6UgzE8EhAwGK2efK2i9wAx25U9F8W6888dUnwj8888US1qxa3O6UW4UnwhFA2W1Uxi48bE462qcwgUaUuz98OEdEGdwzweau1Hwiomwm8gU5qiU9E4KeyE9Eco9U6O6Uc8sg5Ku48twem1TwmUvyEeUvwWwwxS2O&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25270&lsd=KUZE-nyJV5-wBxoO6hWZAR&__spin_r=1018271799&__spin_b=trunk&__spin_t=1731866407&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingThirdPartyAddFundsStateInitMutation&variables=%7B%22input%22%3A%7B%22billable_account_payment_legacy_account_id%22%3A%22' +
              _0xfbde40 +
              '%22%2C%22credential_id%22%3A%22platformized_lpm_momo_wallet_vn%22%2C%22draft_auto_reload_info%22%3Anull%2C%22intent%22%3A%22ADD_PM%22%2C%22logging_data%22%3A%7B%22logging_counter%22%3A66%2C%22logging_id%22%3A%223291234085%22%7D%2C%22lpm_additional_data%22%3A%7B%7D%2C%22network_id%22%3A%22platformized_lpm_momo_wallet_vn%22%2C%22payment_amount%22%3A%7B%22amount%22%3A%2210000%22%2C%22currency%22%3A%22VND%22%7D%2C%22payment_credential_provider%22%3A%22platformized_adyen_checkout%22%2C%22payment_credential_type%22%3A%22ALTPAY%22%2C%22save_lpm_for_recurring%22%3Afalse%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingthirdparty%22%2C%22credential_id%22%3A%22platformized_lpm_momo_wallet_vn%22%2C%22credential_type%22%3A%22ALT_PAY%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%22626117387%22%2C%22target_name%22%3A%22BillingThirdPartyAddFundsStateInitMutation%22%2C%22user_session_id%22%3A%22upl_1722535985155_' +
              id3 +
              '%22%2C%22wizard_config_name%22%3A%22NON_RECURRING_PAYMENT_METHOD%22%2C%22wizard_name%22%3A%22ADD_PM%22%2C%22wizard_screen_name%22%3A%22alt_pay_add_funds_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1722535985155_' +
              id4 +
              '%22%2C%22wizard_state_name%22%3A%22third_party_add_funds_state_display%22%7D%2C%22actor_id%22%3A%22' +
              fb.uid +
              '%22%2C%22client_mutation_id%22%3A%2213%22%7D%7D&server_timestamps=true&doc_id=8627252047329650',
            method: 'POST',
          },
        )
        const _0x5a864d = _0x4f6681.json
        if (!_0x5a864d.errors) {
          const data = _0x5a864d?.data?.billing_add_funds?.next_action?.uri
          _0x3fd239(data)
        } else {
          _0x582b15()
        }
      } catch (_0x107a17) {
        console.log(_0x107a17)
        _0x582b15()
      }
    })
  }
  // thẻ thanh toán
  delcard(IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const _0x4fbd03 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=1&_triggerFlowletID=2',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'variables=%7B%22paymentAccountID%22%3A%22' +
              IDTK +
              '%22%7D&doc_id=5746473718752934&__usid=6-Tscyowzn6jy8i%3APsczxuimcugzp%3A0-Asczvtr1dr572d-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=n&__hs=19848.BP%3ADEFAULT.2.0..0.0&dpr=3&__ccg=EXCELLENT&__rev=1013281346&__s=j3lvk4%3Awebeyo%3Askn8so&__hsi=7365375615401665772&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y1pzo2vw9G12x67EK3i1uK6o6eu2C2l0FggzE8U98451KfwXxq1-orx2364p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabDAAzawSyES2e0UFU6K19xq1owqpbwCwiUWawCwNwDwr8rwMxO1sDx27o721QwtU&__csr=&fb_dtsg=NAcMcJbBVSJMN7R22IDHAnW8lQDDuk29Bfu7IzyFSnDMPrDpgLWlBng:43:1743820961&jazoest=25497&lsd=dz_bG2uZlg-q7WYmKnmNTZ&__spin_r=1013281346&__spin_b=trunk&__spin_t=1714885145&__jssesw=1',
            method: 'POST',
          },
        )
        const _0x94b8b9 = _0x4fbd03.json
        // Truy cập mảng billing_payment_methods
        const methods =
          _0x94b8b9?.data?.billable_account_by_payment_account?.billing_payment_account
            ?.billing_payment_methods || []
        let credentialId = null
        for (const method of methods) {
          const cred = method?.credential
          if (cred?.credential_id) {
            credentialId = cred.credential_id
            break
          } else if (cred?.id) {
            credentialId = cred.id
            break
          }
        }
        // const methods = _0x94b8b9?.data?.billable_account_by_payment_account?.billing_payment_account?.billing_payment_methods || [];
        // const credentialIds = methods
        //     .map(method => method?.credential?.credential_id)
        //     .filter(id => !!id);
        const _0x4fbd02 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=2727&_triggerFlowletID=2727',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tscwbg318404ui%3APscyh0v6x1y8x%3A0-Ascye0w9cszrr-RV%3D6%3AF%3D&__aaid=' +
              IDTK +
              '&__bid=&__user=' +
              fb.uid +
              '&__a=1&__req=18&__hs=19847.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013276317&__s=ujgsou%3A9j3m41%3Aqmz9zh&__hsi=7365081586036242351&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i22263y0Eo9FE4WqbwLghUbpqG6kE8Rpo46Urwxwu8sxep122y5oeEjx63K2y1pzo2vw9G12x67EK3i1uK6o6eu2C2l0FggzE8U98451KfwXxq1-orx2364p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabDAAzawSyES2e0UFU6K19xq1owqpbwCwiUWawCwNwDwr8rwMxO1sDx27o721QwtU&__csr=&fb_dtsg=NAcMcJbBVSJMN7R22IDHAnW8lQDDuk29Bfu7IzyFSnDMPrDpgLWlBng:43:1743820961&jazoest=25540&lsd=64cqEpY8xCtXBU6dQzb8Rs&__spin_r=1013276317&__spin_b=trunk&__spin_t=1714816686&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingRemovePMMutation&variables=%7B%22input%22%3A%7B%22logging_data%22%3A%7B%22logging_counter%22%3A16%2C%22logging_id%22%3A%22373230714%22%7D%2C%22payment_account_id%22%3A%22' +
              IDTK +
              '%22%2C%22payment_method_id%22%3A%22' +
              credentialId +
              '%22%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingremovepm%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%222959290404%22%2C%22target_name%22%3A%22useBillingRemovePMMutation%22%2C%22user_session_id%22%3A%22upl_1714816688750_bf07cb16-f1c1-45e1-929e-4d1549f67073%22%2C%22wizard_config_name%22%3A%22REMOVE_PM%22%2C%22wizard_name%22%3A%22REMOVE_PM%22%2C%22wizard_screen_name%22%3A%22remove_pm_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1714816688750_798c8a41-15bd-4db6-b298-6a374c75caf2%22%2C%22wizard_state_name%22%3A%22remove_pm_state_display%22%7D%2C%22actor_id%22%3A%22' +
              fb.uid +
              '%22%2C%22client_mutation_id%22%3A%223%22%7D%7D&server_timestamps=true&doc_id=6325673510865212',
            method: 'POST',
          },
        )
        const _0x94bbb2 = _0x4fbd02.json
        if (!_0x94bbb2.errors) {
          _0x1de5a2()
        } else {
          _0x47e12d()
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d()
      }
    })
  }
  changeInfoAds(_0xfbde40, _0x41522c, _0x507be4, _0x5f4eda, _0x58b30f) {
    return new Promise(async (_0x3fd239, _0x582b15) => {
      try {
        const _0x4f6681 = await fetch2('https://business.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body:
            'av=' +
            fb.uid +
            '&__usid=6-Tsd0dk94q8t2g%3APsd0dk8102tqjd%3A0-Asd0diwu6aejd-RV%3D6%3AF%3D&__aaid=' +
            _0xfbde40 +
            '&__user=' +
            fb.uid +
            '&__a=1&__req=1d&__hs=19848.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1013281915&__s=7t3vrw%3A8sxn8j%3Aaqaqt0&__hsi=7365463091282519195&__dyn=7xeUmxa2C5rgmwCwRyU8EKmhe2Om2q1DxuqErxSax21dxebzEdF98Sm4Euxa1MxKdwJzUmxe1kx20x8C8yEqx619g5i2i221qwa62qq1eCyUbQ4u2SmGxBa2dmm11K6U8o7y78jCggwExm3G4UhwXwEwmoS0DU2qwgEhxWbwQwnHxC1zDwFwBgak48W2e2i11grzUeUmwvC6UgwNx6i8wxK2efK2i9wAx25U9F8W6888dUnwj8888US2W2K4Ef8rzEjxu16Cg2DxiaBwKwgo9EO13xC4oiyVV98OEdEGdwzweau1Hwiomwm86CiU9E4KeyE9Eco9U6O6Uc8swn9UgxS1Mwt87u&__csr=&fb_dtsg=' +
            fb.dtsg +
            '&jazoest=25318&lsd=FPyMVc7LpMWKx_NzwO0yXD&__spin_r=1013281915&__spin_b=trunk&__spin_t=1714905512&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingAccountInformationUtilsUpdateAccountMutation&variables=%7B%22input%22%3A%7B%22billable_account_payment_legacy_account_id%22%3A%22' +
            _0xfbde40 +
            '%22%2C%22currency%22%3A%22' +
            _0x507be4 +
            '%22%2C%22logging_data%22%3A%7B%22logging_counter%22%3A32%2C%22logging_id%22%3A%22997005896%22%7D%2C%22tax%22%3A%7B%22business_address%22%3A%7B%22city%22%3A%22%22%2C%22country_code%22%3A%22' +
            _0x58b30f +
            '%22%2C%22state%22%3A%22%22%2C%22street1%22%3A%22%22%2C%22street2%22%3A%22%22%2C%22zip%22%3A%22%22%7D%2C%22business_name%22%3A%22%22%2C%22is_personal_use%22%3Afalse%2C%22second_tax_id%22%3A%22%22%2C%22tax_id%22%3A%22%22%2C%22tax_registration_status%22%3A%22%22%7D%2C%22timezone%22%3A%22' +
            _0x5f4eda +
            '%22%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingaccountinfo%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%223310255550%22%2C%22target_name%22%3A%22BillingAccountInformationUtilsUpdateAccountMutation%22%2C%22user_session_id%22%3A%22upl_1714905514185_23a43b03-af4d-4f25-89a0-0afab439b6c3%22%2C%22wizard_config_name%22%3A%22BUSINESS_INFO_SUB%22%2C%22wizard_name%22%3A%22COLLECT_ACCOUNT_INFO%22%2C%22wizard_screen_name%22%3A%22account_information_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1714905514185_42cdb719-9815-43a7-a026-5bebc0910ae4%22%2C%22wizard_state_name%22%3A%22account_information_state_display%22%7D%2C%22actor_id%22%3A%' +
            fb.uid +
            '%22%2C%22client_mutation_id%22%3A%224%22%7D%2C%22billingEntryPoint%22%3A%22BILLING_HUB%22%7D&server_timestamps=true&doc_id=7337595416289831',
          method: 'POST',
        })
        const _0x5a864d = _0x4f6681.json
        if (!_0x5a864d.errors) {
          _0x3fd239(_0x5a864d)
        } else {
          _0x582b15()
        }
      } catch (_0x107a17) {
        console.log(_0x107a17)
        _0x582b15()
      }
    })
  }
  renameAds(_0x2a724f, _0x362325, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        if (_0x4b3957) {
          try {
            await fetch2(
              'https://business.facebook.com/api/graphql/?_flowletID=2182&_triggerFlowletID=2182',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  'av=' +
                  fb.uid +
                  '&__usid=6-Tsasi9v2r9bil%3APsasi9u1lu74br%3A0-Asasi9n1il9kfa-RV%3D6%3AF%3D&__aaid=' +
                  _0x2a724f +
                  '&__bid=' +
                  _0x2a724f +
                  '&__user=' +
                  fb.uid +
                  '&__a=1&__req=14&__hs=19805.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1012269162&__s=qijlev%3Aq1pucg%3A43coip&__hsi=7349458436577797102&__dyn=7xeUmxa3-Q5E9EdoK2abBAjwIBwCwpUnCG6UtyEgwjojyUW3qiidBxa7Eiws8rzobo-5Ejwl8gw8i9y8G6Ehwik1kwAwwwxwUwa62qq1eCyUbQ4u2SmGxBa2dmm11K6U8o7y78jCggwExm3G4UhwXwEwmoS0DU2qwgEhxWbwQwnHxC1zVoao9k2B12ewzwAwgk6U-3K5E7VxK48W2a4p8y26U8U-U98C2i48nwCAzEowwwTxu1cwwwzzobEaUiwYxKexe5U4qp0au58Gm2W11wCz84e6ohxabDAAzawSyES2e0UFU6K19xq1ox3wlFbwCwiUWawCwNwDwr8rwMxO1sDx27o721Qw&__csr=&fb_dtsg=' +
                  fb.dtsg +
                  '&jazoest=25369&lsd=ALHtLDNNnDi8qX8bQH8hT0&__spin_r=1012269162&__spin_b=trunk&__spin_t=1711179138&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBillingSelfGrantManageAdAccountMutation&variables=%7B%22input%22%3A%7B%22business_id%22%3A%22' +
                  _0x4b3957 +
                  '%22%2C%22payment_legacy_account_id%22%3A%22' +
                  _0x2a724f +
                  '%22%2C%22actor_id%22%3A%22' +
                  fb.uid +
                  '%22%2C%22client_mutation_id%22%3A%222%22%7D%7D&server_timestamps=true&doc_id=6600383160000030',
                method: 'POST',
              },
            )
          } catch (_0x2147ba) {
            console.log(_0x2147ba)
          }
        }
        const _0x4fbd03 = await fetch2(
          'https://graph.facebook.com/v18.0/act_' + _0x2a724f + '?access_token=' + fb.accessToken,
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body: 'name=' + encodeURIComponent(_0x362325),
            method: 'POST',
          },
        )
        const _0x94bbb9 = _0x4fbd03.json
        if (_0x94bbb9.success) {
          _0x1de5a2()
        } else {
          _0x47e12d()
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d()
      }
    })
  }
  postADS(adsConfig, IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const graphApiResponse = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            IDTK +
            '?fields=addrafts%7Baddraft_fragments.limit(500)%7Bid%2Cad_object_type%7D%7D&access_token=' +
            fb.accessToken2,
        )
        const jsonData = await graphApiResponse.json
        // Kiểm tra xem dữ liệu có tồn tại không
        const fragments = jsonData?.addrafts?.data?.[0]?.addraft_fragments?.data || []
        const addraftId = jsonData?.addrafts?.data?.[0]?.id || null
        // Tạo Set các loại được chọn
        const allowedTypes = new Set()
        if (adsConfig.ads.Postads.value) allowedTypes.add('ad')
        if (adsConfig.ads.Postgroup.value) allowedTypes.add('ad_set')
        if (adsConfig.ads.Postcamp.value) allowedTypes.add('campaign')

        // Lọc theo đúng thứ tự gốc
        const ids = fragments
          .filter((item) => allowedTypes.has(item.ad_object_type))
          .map((item) => item.id)

        const activeScenarioIDs = fb.generateActiveScenarioIDs() //__activeScenarioIDs=["fdac43b0-1580-4468-ad04-4a975e9a6337"]
        let callFlowletID = fb.generateCallFlowletID() //22433
        const flowid1n = fb.generateFlowInstanceIdidNumber() // 270231368
        const sessionID = fb.generateSessionID() //64c29f78b8587af3
        const flowid1u = fb.generateFlowInstanceIduniqueString() //_6af9f93f009cb465aad
        const xref = fb.generateXref() //fcb465aad7edcf538

        const _0x4fbd03 = await fetch2(
          'https://adsmanager-graph.facebook.com/v18.0/' +
            addraftId +
            '/publish?_reqName=object%3Adraft_id%2Fpublish&access_token=' +
            fb.accessToken2 +
            '&method=post&qpl_active_flow_ids=' +
            flowid1n +
            '&qpl_active_flow_instance_ids=' +
            flowid1n +
            '_' +
            flowid1u +
            '&%20__cppo=1',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%22' +
              activeScenarioIDs +
              '%22%5D&__activeScenarios=%5B%22am.publish_ads.in_review_and_publish%22%5D&__ad_account_id=' +
              IDTK +
              '&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3Anull%2Cmedia_format%3Anull%2Cname%3Aam.publish_ads.in_review_and_publish%2Crevisit%3A0%2Cstart_callsite%3AAdsManagerPerfScenarioTriggerController_AdsPEUploadPreviewDialog.react%2Ccampaign_objective%3ANONE%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=' +
              callFlowletID +
              '&_reqName=object%3Adraft_id%2Fpublish&_reqSrc=AdsDraftPublishDataManager&_sessionID=64c29f12c42a4653&_triggerFlowletID=' +
              (callFlowletID + 1) +
              '&fragments=' +
              ids +
              '&ignore_errors=true&include_fragment_statuses=true&include_headers=false&locale=en_GB&method=post&pretty=0&qpl_active_flow_ids=' +
              flowid1n +
              '&qpl_active_flow_instance_ids=' +
              flowid1n +
              '_' +
              flowid1u +
              '&suppress_http_code=1&xref=' +
              xref,
            method: 'POST',
          },
        )
        const _0x94bbb9 = _0x4fbd03.json
        if (_0x94bbb9.success) {
          _0x1de5a2()
        } else {
          _0x47e12d()
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d()
      }
    })
  }
  EditCamp(adsConfig, IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      let statusads = ''
      try {
        const graphApiResponse = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            IDTK +
            '?fields=ads.limit(999)%7Bid%2Ccampaign_id%2Cadset_id%7D%2Caddrafts&access_token=' +
            fb.accessToken2,
        )
        const jsonData = await graphApiResponse.json

        const addraftId = jsonData?.addrafts?.data?.[0]?.id || null
        const adsList = jsonData?.ads?.data || []

        const allAdsData = adsList.map((ad) => ({
          adidADS: ad.id,
          campaign_id: ad.campaign_id,
          adset_id: ad.adset_id,
        }))
        if (allAdsData.length === 0) {
          _0x1de5a2('Tài khoản không có quảng cáo nào')
          return
        }
        // const campaign_id = jsonData?.ads?.data?.[0]?.campaign_id || null;
        // const adset_id = jsonData?.ads?.data?.[0]?.adset_id || null;
        // const adidADS = jsonData?.ads?.data?.[0]?.id || null;

        try {
          if (adsConfig.ads.oncamp.value) {
            let campaign1,
              campaign2,
              campaign = 0
            if (adsConfig.ads.sttcamp.value) {
              campaign1 = 'PAUSED'
              campaign2 = 'ACTIVE'
              statusads += 'Bật '
            } else {
              campaign1 = 'ACTIVE'
              campaign2 = 'PAUSED'
              statusads += 'Tắt '
            }
            const fragmentsArray = []
            const uniqueCampaignIds = [...new Set(allAdsData.map((ad) => ad.campaign_id))]
            const results = await Promise.all(
              uniqueCampaignIds.map(async (campaign_id) => {
                const flowid2n = fb.generateFlowInstanceIdidNumber()
                const graphApiResponse2 = await fetch2(
                  'https://adsmanager-graph.facebook.com/v18.0/' +
                    addraftId +
                    '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                    fb.accessToken2 +
                    '&method=post&qpl_active_flow_ids=' +
                    flowid2n +
                    '%2C270216430%2C270230590&qpl_active_flow_instance_ids=' +
                    flowid2n +
                    '_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&__cppo=1&_callFlowletID=19718&_triggerFlowletID=19718',
                  {
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded',
                    },
                    body:
                      '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__ad_account_id=' +
                      IDTK +
                      '&__interactionsMetadata=%5B%5D&_callFlowletID=19522&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=7d4131c37d137d5b&_triggerFlowletID=19523&account_id=' +
                      IDTK +
                      '&action=modify&ad_object_id=' +
                      campaign_id +
                      '&ad_object_type=campaign&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&parent_ad_object_id=' +
                      IDTK +
                      '&pretty=0&qpl_active_flow_ids=' +
                      flowid2n +
                      '%2C270216430%2C270230590&qpl_active_flow_instance_ids=' +
                      flowid2n +
                      '_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&suppress_http_code=1&validate=false&values=[{"field":"status","old_value":"' +
                      campaign1 +
                      '","new_value":"' +
                      campaign2 +
                      '"}]&xref=fba1efe616136017e',
                    method: 'POST',
                  },
                )
                const jsonData2 = await graphApiResponse2.json
                const fragment = jsonData2?.id || null
                if (fragment) {
                  fragmentsArray.push(`"${fragment}"`)
                }

                if (!jsonData2.error) {
                  campaign += 1
                }
              }),
            )
            // const graphApiResponse3 = await fetch2("https://graph.facebook.com/v19.0/act_" + IDTK + "?fields=ads.limit(999)%7Bid%2Ccampaign_id%2Cadset_id%7D%2Caddrafts&access_token=" + fb.accessToken2);
            // const jsonData3 = await graphApiResponse3.json;
            // console.log("Danh sách fragments cuối cùng:", fragmentsArray.join(','));
            // let callFlowletID4 = fb.generateCallFlowletID();
            // const activeScenarioIDs4 = fb.generateActiveScenarioIDs();
            // const flowid4n = fb.generateFlowInstanceIdidNumber();
            // const xref4 = fb.generateXref();
            // const graphApiResponse4 = await fetch2("https://adsmanager-graph.facebook.com/v18.0/" + addraftId + "/publish?_reqName=object%3Adraft_id%2Fpublish&access_token=" + fb.accessToken2 + "&method=post&qpl_active_flow_ids=" + flowid4n + "&qpl_active_flow_instance_ids=" + flowid4n + "_a7ff0e05c22e7905179&__cppo=1", {
            //   headers: {
            //     "content-type": "application/x-www-form-urlencoded"
            //   },
            //   body: "__activeScenarioIDs=%5B%22  " + activeScenarioIDs4 + "  %22%5D&__activeScenarios=%5B%22am.publish_ads.in_review_and_publish%22%5D&__ad_account_id=" + IDTK + "&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3Anull%2Cmedia_format%3Anull%2Cname%3Aam.publish_ads.in_review_and_publish%2Crevisit%3A0%2Cstart_callsite%3AAdsManagerPerfScenarioTriggerController_AdsPEUploadPreviewDialog.react%2Ccampaign_objective%3ANONE%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=" + callFlowletID4 + "&_reqName=object%3Adraft_id%2Fpublish&_reqSrc=AdsDraftPublishDataManager&_sessionID=378dc015583d32a7&_triggerFlowletID=" + (callFlowletID4 + 1) + "&fragments=%5B%22" + fragmentsArray.join(',') + "%22%5D&ignore_errors=true&include_fragment_statuses=true&include_headers=false&locale=en_GB&method=post&pretty=0&qpl_active_flow_ids=" + flowid4n + "&qpl_active_flow_instance_ids=" + flowid4n + "_a7ff0e05c22e7905179&suppress_http_code=1&xref=" + xref4,
            //   method: "POST"
            // });
            // const jsonData4 = graphApiResponse4.json;
            // if (jsonData4.success) {
            //   statusads += "chiến dịch thành công (" + campaign + ") - ";
            // }
            statusads += 'chiến dịch thành công (' + campaign + ') - '
          }
        } catch {
          statusads += 'chiến dich thất bại - '
        }

        try {
          if (adsConfig.ads.ongroup.value) {
            let group1,
              group2,
              group = 0
            if (adsConfig.ads.sttgroup.value) {
              group1 = 'PAUSED'
              group2 = 'ACTIVE'
              statusads += 'Bật '
            } else {
              group1 = 'ACTIVE'
              group2 = 'PAUSED'
              statusads += 'Tắt '
            }
            const fragmentsArray = []
            const uniqueCampaignIds = [...new Set(allAdsData.map((ad) => ad.adset_id))]
            const results = await Promise.all(
              uniqueCampaignIds.map(async (adset_id) => {
                const flowid2n = fb.generateFlowInstanceIdidNumber()
                const graphApiResponse2 = await fetch2(
                  'https://adsmanager-graph.facebook.com/v18.0/' +
                    addraftId +
                    '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                    fb.accessToken2 +
                    '&method=post&qpl_active_flow_ids=' +
                    flowid2n +
                    '%2C270216430%2C270230590&qpl_active_flow_instance_ids=' +
                    flowid2n +
                    '_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&__cppo=1&_callFlowletID=19718&_triggerFlowletID=19718',
                  {
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded',
                    },
                    body:
                      '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__ad_account_id=' +
                      IDTK +
                      '&__interactionsMetadata=%5B%5D&_callFlowletID=19522&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=7d4131c37d137d5b&_triggerFlowletID=19523&account_id=' +
                      IDTK +
                      '&action=modify&ad_object_id=' +
                      adset_id +
                      '&ad_object_type=campaign&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&parent_ad_object_id=' +
                      IDTK +
                      '&pretty=0&qpl_active_flow_ids=' +
                      flowid2n +
                      '%2C270216430%2C270230590&qpl_active_flow_instance_ids=' +
                      flowid2n +
                      '_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&suppress_http_code=1&validate=false&values=[{"field":"status","old_value":"' +
                      group1 +
                      '","new_value":"' +
                      group2 +
                      '"}]&xref=fba1efe616136017e',
                    method: 'POST',
                  },
                )
                const jsonData2 = graphApiResponse2.json
                const fragments = jsonData2.id || null
                if (!jsonData2.error) {
                  group += 1
                }
              }),
            )

            // const graphApiResponse3 = await fetch2("https://graph.facebook.com/v19.0/act_" + IDTK + "?fields=ads.limit(999)%7Bid%2Ccampaign_id%2Cadset_id%7D%2Caddrafts&access_token=" + fb.accessToken2);
            // const jsonData3 = await graphApiResponse3.json;

            // let callFlowletID4 = fb.generateCallFlowletID();
            // const activeScenarioIDs4 = fb.generateActiveScenarioIDs();
            // const flowid4n = fb.generateFlowInstanceIdidNumber();
            // const xref4 = fb.generateXref();
            // const graphApiResponse4 = await fetch2("https://adsmanager-graph.facebook.com/v18.0/" + addraftId + "/publish?_reqName=object%3Adraft_id%2Fpublish&access_token=" + fb.accessToken2 + "&method=post&qpl_active_flow_ids=" + flowid4n + "&qpl_active_flow_instance_ids=" + flowid4n + "_a7ff0e05c22e7905179&__cppo=1", {
            //   headers: {
            //     "content-type": "application/x-www-form-urlencoded"
            //   },
            //   body: "__activeScenarioIDs=%5B%22  " + activeScenarioIDs4 + "  %22%5D&__activeScenarios=%5B%22am.publish_ads.in_review_and_publish%22%5D&__ad_account_id=" + IDTK + "&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3Anull%2Cmedia_format%3Anull%2Cname%3Aam.publish_ads.in_review_and_publish%2Crevisit%3A0%2Cstart_callsite%3AAdsManagerPerfScenarioTriggerController_AdsPEUploadPreviewDialog.react%2Ccampaign_objective%3ANONE%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=" + callFlowletID4 + "&_reqName=object%3Adraft_id%2Fpublish&_reqSrc=AdsDraftPublishDataManager&_sessionID=378dc015583d32a7&_triggerFlowletID=" + (callFlowletID4 + 1) + "&fragments=%5B%22" + fragments + "%22%5D&ignore_errors=true&include_fragment_statuses=true&include_headers=false&locale=en_GB&method=post&pretty=0&qpl_active_flow_ids=" + flowid4n + "&qpl_active_flow_instance_ids=" + flowid4n + "_a7ff0e05c22e7905179&suppress_http_code=1&xref=" + xref4,
            //   method: "POST"
            // });
            // const jsonData4 = graphApiResponse4.json;
            // if (jsonData4.success) {
            //   statusads += "nhóm thành công - ";
            // }
            // else {
            //   statusads += "nhóm thất bại - ";
            // }
            statusads += 'nhóm thành công (' + group + ') - '
          }
        } catch {
          statusads += 'nhóm thất bại - '
        }
        try {
          if (adsConfig.ads.onads.value) {
            let ads1,
              ads2,
              ADS = 0
            if (adsConfig.ads.sttads.value) {
              ads1 = 'PAUSED'
              ads2 = 'ACTIVE'
              statusads += 'Bật '
            } else {
              ads1 = 'ACTIVE'
              ads2 = 'PAUSED'
              statusads += 'Tắt '
            }
            const fragmentsArray = []
            const uniqueCampaignIds = [...new Set(allAdsData.map((ad) => ad.adidADS))]
            const results = await Promise.all(
              uniqueCampaignIds.map(async (adidADS) => {
                const flowid2n = fb.generateFlowInstanceIdidNumber()
                const graphApiResponse2 = await fetch2(
                  'https://adsmanager-graph.facebook.com/v18.0/' +
                    addraftId +
                    '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                    fb.accessToken2 +
                    '&method=post&qpl_active_flow_ids=' +
                    flowid2n +
                    '%2C270216430%2C270230590&qpl_active_flow_instance_ids=' +
                    flowid2n +
                    '_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&__cppo=1&_callFlowletID=19718&_triggerFlowletID=19718',
                  {
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded',
                    },
                    body:
                      '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__ad_account_id=' +
                      IDTK +
                      '&__interactionsMetadata=%5B%5D&_callFlowletID=19522&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=7d4131c37d137d5b&_triggerFlowletID=19523&account_id=' +
                      IDTK +
                      '&action=modify&ad_object_id=' +
                      adidADS +
                      '&ad_object_type=ad&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&parent_ad_object_id=' +
                      IDTK +
                      '&pretty=0&qpl_active_flow_ids=' +
                      flowid2n +
                      '%2C270216430%2C270230590&qpl_active_flow_instance_ids=' +
                      flowid2n +
                      '_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&suppress_http_code=1&validate=false&values=[{"field":"status","old_value":"' +
                      ads1 +
                      '","new_value":"' +
                      ads2 +
                      '"}]&xref=fba1efe616136017e',
                    method: 'POST',
                  },
                )
                const jsonData2 = graphApiResponse2.json
                const fragments = jsonData2.id || null
                if (!jsonData2.error) {
                  ADS += 1
                }
              }),
            )
            // const graphApiResponse3 = await fetch2("https://graph.facebook.com/v19.0/act_" + IDTK + "?fields=ads.limit(999)%7Bid%2Ccampaign_id%2Cadset_id%7D%2Caddrafts&access_token=" + fb.accessToken2);
            // const jsonData3 = await graphApiResponse3.json;
            // let callFlowletID4 = fb.generateCallFlowletID();
            // const activeScenarioIDs4 = fb.generateActiveScenarioIDs();
            // const flowid4n = fb.generateFlowInstanceIdidNumber();
            // const xref4 = fb.generateXref();
            // const graphApiResponse4 = await fetch2("https://adsmanager-graph.facebook.com/v18.0/" + addraftId + "/publish?_reqName=object%3Adraft_id%2Fpublish&access_token=" + fb.accessToken2 + "&method=post&qpl_active_flow_ids=" + flowid4n + "&qpl_active_flow_instance_ids=" + flowid4n + "_a7ff0e05c22e7905179&__cppo=1", {
            //   headers: {
            //     "content-type": "application/x-www-form-urlencoded"
            //   },
            //   body: "__activeScenarioIDs=%5B%22  " + activeScenarioIDs4 + "  %22%5D&__activeScenarios=%5B%22am.publish_ads.in_review_and_publish%22%5D&__ad_account_id=" + IDTK + "&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3Anull%2Cmedia_format%3Anull%2Cname%3Aam.publish_ads.in_review_and_publish%2Crevisit%3A0%2Cstart_callsite%3AAdsManagerPerfScenarioTriggerController_AdsPEUploadPreviewDialog.react%2Ccampaign_objective%3ANONE%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=" + callFlowletID4 + "&_reqName=object%3Adraft_id%2Fpublish&_reqSrc=AdsDraftPublishDataManager&_sessionID=378dc015583d32a7&_triggerFlowletID=" + (callFlowletID4 + 1) + "&fragments=%5B%22" + fragments + "%22%5D&ignore_errors=true&include_fragment_statuses=true&include_headers=false&locale=en_GB&method=post&pretty=0&qpl_active_flow_ids=" + flowid4n + "&qpl_active_flow_instance_ids=" + flowid4n + "_a7ff0e05c22e7905179&suppress_http_code=1&xref=" + xref4,
            //   method: "POST"
            // });
            // const jsonData4 = graphApiResponse4.json;
            // if (jsonData4.success) {
            //   statusads += "ADS thành công";
            // }
            // else {
            //   statusads += "ADS thất bại";
            // }
            statusads += 'ADS thành công (' + ADS + ') - '
          }
        } catch {
          statusads += 'ADS thất bại'
        }
        _0x1de5a2(statusads)
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d(statusads)
      }
    })
  }
  addtogroupADS(IDTK, IDGR, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const _0x4fbd03 = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            IDGR +
            '/contained_adaccounts?access_token=' +
            fb.accessToken +
            '&__cppo=1&_callFlowletID=6599&_triggerFlowletID=6599',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abusiness-asset-groups%2Fcontained_adaccounts&_reqSrc=WorksetDataManager.brands&asset_id=' +
              IDTK +
              '&locale=en_GB&method=post&pretty=0&suppress_http_code=1&xref=f5167b70d427ee58e',
            method: 'POST',
          },
        )
        const _0x94bbb9 = _0x4fbd03.json
        if (_0x94bbb9.success) {
          _0x1de5a2()
        } else {
          _0x47e12d()
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d()
      }
    })
  }
  AddInfo(IDTK, adsConfig, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const namebusiness = $("input[name='namebusiness']").val()
        const streetbusiness1 = $("input[name='streetbusiness1']").val()
        const streetbusiness2 = $("input[name='streetbusiness2']").val()
        const citybusiness = $("input[name='citybusiness']").val()
        const statebusiness = adsConfig.ads.statebusiness.value
        const IDBM = $("select[name='accountSelect']").val()
        const zipbusiness = $("input[name='zipbusiness']").val()
        let madata = fb.generateCustomId()
        let madat2 = fb.generateCustomId()
        let responseData
        // const response = await fetch2("https://graph.facebook.com/graphql", {
        //   headers: {
        //     "content-type": "application/x-www-form-urlencoded"
        //   },
        //   body: "access_token=" + fb.accessToken2 + "&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingAccountInformationUtilsUpdateAccountMutation&variables=%7B%22input%22%3A%7B%22billable_account_payment_legacy_account_id%22%3A%22" + IDTK + "%22%2C%22currency%22%3Anull%2C%22logging_data%22%3A%7B%22logging_counter%22%3A18%2C%22logging_id%22%3A%22719436929%22%7D%2C%22tax%22%3A%7B%22business_address%22%3A%7B%22city%22%3A%22" + citybusiness + "%22%2C%22country_code%22%3Anull%2C%22state%22%3A%22" + statebusiness + "%22%2C%22street1%22%3A%22" + streetbusiness1 + "%22%2C%22street2%22%3A%22" + streetbusiness2 + "%22%2C%22zip%22%3A%22" + zipbusiness + "%22%7D%2C%22business_name%22%3A%22" + namebusiness + "%22%2C%22is_personal_use%22%3Afalse%2C%22second_tax_id%22%3A%22%22%2C%22tax_id%22%3A%22%22%2C%22tax_registration_status%22%3A%22%22%7D%2C%22timezone%22%3Anull%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingaccountinfo%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%2286596744%22%2C%22target_name%22%3A%22BillingAccountInformationUtilsUpdateAccountMutation%22%2C%22user_session_id%22%3A%22upl_1701947386789_" + madata + "%22%2C%22wizard_config_name%22%3A%22COLLECT_ACCOUNT_INFO%22%2C%22wizard_name%22%3A%22COLLECT_ACCOUNT_INFO%22%2C%22wizard_screen_name%22%3A%22account_information_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1701947386789_" + madata + "%22%7D%2C%22actor_id%22%3A%22" + fb.uid + "%22%2C%22client_mutation_id%22%3A%224%22%7D%7D&server_timestamps=true&doc_id=8295419703883633",
        //   body: "",

        //   method: "POST"
        // });
        // responseData = await response.json;
        if (true) {
          const response = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=5681&_triggerFlowletID=1',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__aaid=' +
                IDTK +
                '&__bid=' +
                IDBM +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=1g&__hs=20234.BP%3ADEFAULT.2.0...0&dpr=1&__ccg=EXCELLENT&__rev=1023185876&__s=1b1vxy%3A2yxcu0%3Al6wgq7&__hsi=7508660095960132343&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhe2Om2q1DxiFGxK7oG484S4UKewSAAzpoixW4E726US2Sfxq4U5i4824yoyaxG4o4B0l898888oe82xwCCwjFEK2Z162-8G6kE8Rpo46Urwxw9m4VA48a8lwWxe4oeUa85CbU2vw9G12x67EK3i1uK6o2lwBgakbAwOwAwgk6U-3K5E7VxK48W2a4p8aHwzzXwAyo98gxu2qiexy223u5U4O14zo5G4Ef8rzEjxu16CgbE7y58gwKwgo9EO13wHxWcAz8eoGdwzweau1Hwiomwm86CiU9E4KeyE9Eco9U6O6Uc8sg5qiu3a0Uo7u1rwGwto8888tw8S2i1WxBxa&__hsdp=gSMP6P2PHigmA68o5OdeEzhQClbcSA2C9x6rK9Uu8uuGLV2kIEC3a5NwjF0UwBOp4EFQbKu9pmCQzcECJAJjaum4AdgngS9zS7obeNKHzp-lmm4E4S15QU9vg9oK0OkCqiucbgijk58bS10c8xhkahQqewxxh4edyqlc5weQ13wwwmF81HVk483w81kyE0IO013Dw1B2q0bpw16K0No0gox6&__hblp=0Wwaa1tz8S14w4Bwa-2G1ywb-0mu1ywsofE451K3jwXxS79EeU2pw4cwh82hgcU4a2WawOK0HF4lz8lwipE1bohxybw8q1_xq3C1FCU8oy2O3a5o7S1KxabwGw9JxO1pw4gxy1lwno9986q0QXyo8U5O0Jk3aqAfDAwQwnLy8yawOz8y12xW2i5E3gw5rAwFG2a0FUkxqbxObyK6S78R1WmbwkQ9zpqwwBxeqeBy8Z0AIwSm5Eyq2eqgwoGu5o9o612Ee8982AwPzoGcBx62Wm58WE4t0EwSAy8txam48lgpBwRwQwiFXxO7Uoh9Ec-2ObzUOi6o7x1mmbz8cpubyAcx139p9K2y2y9wzy8aokwgVU4ufxOm78bomgW8z9A5e19g-9yUkwOBl3uAEyh4UiKfxmSiexZ7xyeUjFQewDCxF12bg6iXx-Ukw865oWiFE4i3yEcUoUbouU4e484u7E9-u3m2-2q786W4o6i2W3O5FUyaK4UG48O2y10wvomxmfFa78y2e5o4S0Ao663e2rwEwCw-x65EKm1pw&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25615&lsd=' +
                fb.lsd +
                '&__spin_r=1023185876&__spin_b=trunk&__spin_t=1748246163&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingAccountInformationUtilsUpdateAccountMutation&variables=%7B%22input%22%3A%7B%22billable_account_payment_legacy_account_id%22%3A%22' +
                IDTK +
                '%22%2C%22currency%22%3Anull%2C%22tax%22%3A%7B%22business_address%22%3A%7B%22city%22%3A%22' +
                citybusiness +
                '%22%2C%22country_code%22%3A%22null%22%2C%22state%22%3A%22' +
                statebusiness +
                '%22%2C%22street1%22%3A%22' +
                streetbusiness1 +
                '%22%2C%22street2%22%3A%22' +
                streetbusiness2 +
                '%22%2C%22zip%22%3A%22' +
                zipbusiness +
                '%22%7D%2C%22business_name%22%3A%22' +
                namebusiness +
                '%22%2C%22is_personal_use%22%3Afalse%2C%22second_tax_id%22%3A%22%22%2C%22tax_id%22%3A%22%22%2C%22tax_registration_status%22%3A%22%22%7D%2C%22timezone%22%3Anull%2C%22upl_logging_data%22%3A%7B%22context%22%3A%22billingaccountinfo%22%2C%22entry_point%22%3A%22BILLING_HUB%22%2C%22external_flow_id%22%3A%22upl_1748246168459_0ff4c595-71c3-4dcb-b862-0e57da4a5208%22%2C%22target_name%22%3A%22BillingAccountInformationUtilsUpdateAccountMutation%22%2C%22user_session_id%22%3A%22upl_1748246168459_0ff4c595-71c3-4dcb-b862-0e57da4a5208%22%2C%22wizard_config_name%22%3A%22BUSINESS_INFO_SUB%22%2C%22wizard_name%22%3A%22COLLECT_ACCOUNT_INFO%22%2C%22wizard_screen_name%22%3A%22account_information_state_display%22%2C%22wizard_session_id%22%3A%22upl_wizard_1748246168459_dedd6dcc-b29b-46e0-b14f-692d0ef5dd84%22%2C%22wizard_state_name%22%3A%22account_information_state_display%22%7D%2C%22actor_id%22%3A%22' +
                fb.uid +
                '%22%2C%22client_mutation_id%22%3A%226%22%7D%7D&server_timestamps=true&doc_id=9779568892125528',
              method: 'POST',
            },
          )
          responseData = await response.json
        }

        if (responseData.errors || responseData.error) {
          _0x47e12d(false)
        } else {
          _0x1de5a2(true)
        }
      } catch (error) {
        _0x47e12d(false)
      }
    })
  }
  delfrombm(IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const idBm = $("select[name='accountSelect']").val()
        const response = await fetch2(
          'https://business.facebook.com/business/objects/remove/connections/?business_id=' +
            idBm +
            '&from_id=' +
            idBm +
            '&from_asset_type=brand&to_id=' +
            IDTK +
            '&to_asset_type=ad-account',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__usid=6-Tsfu3o71617man%3APsfu3su1fvo6nd%3A0-Asfu3nxyyr9sb-RV%3D6%3AF%3D&__aaid=0&__bid=' +
              idBm +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=1a&__hs=19903.BP%3Abrands_pkg.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1014577673&__s=zp1rk3%3Aqwv57z%3A5p1iwo&__hsi=7385848130633132306&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhe5UkBwCwpUnCG6Wxeqax2366UjyUV0RAAzpoixWE-1txaczES2Sfxq4UdUsx21FxG9y8Gdz8hw9-3a4EuCwQg9omwoU9FE4Wqmm2ZedUbpqG6kE8RpodoKUrwxwu8sxep3bBwyxm3G4UhwXwEw-G2mcwuEnw8ScwgECu7E422a3Fe6rwnVU8FE9k2B2V8cE98doJ1KfwXxq1yxJxK48GU8EhAy88rwzzXx-ewjoiz9EjCx6EtwSxm1fAxK4U-dwKwHxa1ozkubwk8Sq6UfEO32fxiFUd8bGwgUyfyUe8hyVEK4oOEbVEHyU8U3yDwa-m1Lx3wlFbwCwiUWqU9Eco9U4S7ErwAwEg5Ku0hi1TwmU&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25404&lsd=eXyvFaQUIu0kjPDX-D3ktp&__spin_r=1014577673&__spin_b=trunk&__spin_t=1719651774&__jssesw=1',
            method: 'POST',
          },
        )
        const responseData = await response.json
        if (responseData.errors && responseData.errors.length > 0) {
          _0x47e12d(false)
        } else {
          _0x1de5a2(true)
        }
      } catch (error) {
        _0x47e12d(false)
      }
    })
  }
  removefromgroup(IDTK, IDGR, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const _0x4fbd03 = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            IDGR +
            '/contained_adaccounts?access_token=' +
            fb.accessToken +
            '&__cppo=1&_callFlowletID=15453&_triggerFlowletID=15453',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abusiness-asset-group%2Fcontained_adaccounts&_reqSrc=WorksetDataManager.brands&asset_id=' +
              IDTK +
              '&locale=en_GB&method=delete&pretty=0&suppress_http_code=1&xref=fe2ba7dd76a9f22c4',
            method: 'POST',
          },
        )
        const _0x94bbb9 = _0x4fbd03.json
        if (_0x94bbb9.success) {
          _0x1de5a2()
        } else {
          _0x47e12d()
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d()
      }
    })
  }
  Deldraft(IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        const graphApiResponse = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            IDTK +
            '?fields=addrafts%7Bid%7D&access_token=' +
            fb.accessToken,
        )
        const jsonData = await graphApiResponse.json // Chuyển response thành JSON
        // Kiểm tra xem dữ liệu có tồn tại không
        const adidcamp = jsonData?.addrafts?.data?.[0]?.id || null

        const _0x4fbd03 = await fetch2(
          'https://adsmanager-graph.facebook.com/v18.0/' +
            adidcamp +
            '/discard_fragments?_reqName=object%3Adraft_id%2Fdiscard_fragments&access_token=' +
            fb.accessToken2 +
            '&method=post&__cppo=1&_callFlowletID=7297&_triggerFlowletID=7298',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__ad_account_id=' +
              IDTK +
              '&__interactionsMetadata=%5B%5D&_callFlowletID=8031&_reqName=object%3Adraft_id%2Fdiscard_fragments&_reqSrc=AdsDraftDataManager&_sessionID=5cdd7fc605174928&_triggerFlowletID=8032&include_headers=false&locale=en_US&method=post&pretty=0&suppress_http_code=1&xref=fe8e54a78dff8b2eb',
            method: 'POST',
          },
        )
        const _0x94bbb9 = _0x4fbd03.json
        if (_0x94bbb9.success) {
          _0x1de5a2()
        } else {
          _0x47e12d()
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d()
      }
    })
  }
  campaignClone(IDTK, _0x4b3957 = false) {
    return new Promise(async (_resolve, _reject) => {
      let campaignClone = 0
      let statusads = ''

      try {
        const graphApiResponse = await fetch2(
          `https://graph.facebook.com/v19.0/act_${IDTK}?fields=addrafts%7Bid%7D&access_token=${fb.accessToken2}`,
        )
        const jsonData = await graphApiResponse.json
        const adidcamp = jsonData?.addrafts?.data?.[0]?.id || null

        const campaignClonevalue = parseInt($("input[name='campaignClonevalue']").val()) || 0
        const graphApiResponse2 = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            IDTK +
            '?fields=ads%7Bcampaign_id%7D&access_token=' +
            fb.accessToken2,
        )
        const jsonData2 = await graphApiResponse2.json // Chuyển response thành JSON
        // Kiểm tra xem dữ liệu có tồn tại không
        const campaign_id = jsonData2?.ads?.data?.[0]?.campaign_id || null
        for (let i = 0; i < Math.min(campaignClonevalue); i++) {
          const {
            activeScenarioIDs,
            flowInstanceIdNumber,
            flowInstanceIdUnique,
            callFlowletID,
            sessionID,
            xref,
          } = generateAllFlowParams()
          const a =
            '__activeScenarioIDs=%5B%22' +
            activeScenarioIDs +
            '%22%5D&__activeScenarios=%5B%22am.duplication.processing_duplication%22%5D&__ad_account_id=' +
            IDTK +
            '&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3A' +
            flowInstanceIdNumber +
            '_' +
            flowInstanceIdUnique +
            '%2Cmedia_format%3Anull%2Cname%3Aam.duplication.processing_duplication%2Crevisit%3A0%2Cstart_callsite%3AAdsCopyDataManager%2Ccampaign_objective%3Anull%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=' +
            callFlowletID +
            '&_reqName=adaccount%2Fasyncadcopiesfullfragments&_reqSrc=AdsCopyDataManager&_sessionID=' +
            sessionID +
            '&_triggerFlowletID=' +
            (callFlowletID + 1) +
            '&ad_object_ids=%5B%22' +
            campaign_id +
            '%22%5D&addraft_id=' +
            adidcamp +
            '&auto_conversion=CONVERSION&conversion_option=%7B%7D&copy_count=1&copy_options=%5B%22REUSE_CREATIVE%22%5D&deep_copy=true&draft_conversion=DRAFT_CONVERSION&ig_login_update_campaign_group_to_odax=false&include_headers=false&locale=en_GB&method=post&opt_in_duplication_automated_chat_upgrade_recommendations=false&opt_in_duplication_budget_recommendations=false&opt_in_duplication_call_cta_upgrade_recommendations=false&opt_in_duplication_cta_upgrade_recommendations=false&opt_in_duplication_dc_optimization_recommendations=false&pretty=0&qpl_active_flow_ids=' +
            flowInstanceIdNumber +
            '%2C' +
            (flowInstanceIdNumber + 21) +
            '&qpl_active_flow_instance_ids=' +
            flowInstanceIdNumber +
            '_' +
            flowInstanceIdUnique +
            '%2C' +
            (flowInstanceIdNumber + 21) +
            '_' +
            flowInstanceIdUnique +
            '&rename_strategy=ONLY_TOP_LEVEL_RENAME&skip_tracking_specs=true&source=click_campaign_group_duplicate&suppress_http_code=1&website_conversion_ad_default_extension_option=NOT_SELECTED&xref=' +
            xref

          const _0x4fbd03 = await fetch2(
            'https://adsmanager-graph.facebook.com/v18.0/act_' +
              IDTK +
              '/asyncadcopiesfullfragments?_reqName=adaccount%2Fasyncadcopiesfullfragments&access_token=' +
              fb.accessToken2 +
              '&method=post&qpl_active_flow_ids=' +
              flowInstanceIdNumber +
              '%2C ' +
              (flowInstanceIdNumber + 21) +
              '&qpl_active_flow_instance_ids=' +
              flowInstanceIdNumber +
              '_' +
              flowInstanceIdUnique +
              '%2C' +
              (flowInstanceIdNumber + 21) +
              '_' +
              flowInstanceIdUnique +
              '&__cppo=1',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                '__activeScenarioIDs=%5B%22' +
                activeScenarioIDs +
                '%22%5D&__activeScenarios=%5B%22am.duplication.processing_duplication%22%5D&__ad_account_id=' +
                IDTK +
                '&__interactionsMetadata=%5B%22%7Bat_section%3AL3%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3A' +
                flowInstanceIdNumber +
                '_' +
                flowInstanceIdUnique +
                '%2Cmedia_format%3Anull%2Cname%3Aam.duplication.processing_duplication%2Crevisit%3A0%2Cstart_callsite%3AAdsCopyDataManager%2Ccampaign_objective%3Anull%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=' +
                callFlowletID +
                '&_reqName=adaccount%2Fasyncadcopiesfullfragments&_reqSrc=AdsCopyDataManager&_sessionID=' +
                sessionID +
                '&_triggerFlowletID=' +
                (callFlowletID + 1) +
                '&ad_object_ids=%5B%22' +
                campaign_id +
                '%22%5D&addraft_id=' +
                adidcamp +
                '&auto_conversion=CONVERSION&conversion_option=%7B%7D&copy_count=1&copy_options=%5B%22REUSE_CREATIVE%22%5D&deep_copy=true&draft_conversion=DRAFT_CONVERSION&ig_login_update_campaign_group_to_odax=false&include_headers=false&locale=en_GB&method=post&opt_in_duplication_automated_chat_upgrade_recommendations=false&opt_in_duplication_budget_recommendations=false&opt_in_duplication_call_cta_upgrade_recommendations=false&opt_in_duplication_cta_upgrade_recommendations=false&opt_in_duplication_dc_optimization_recommendations=false&pretty=0&qpl_active_flow_ids=' +
                flowInstanceIdNumber +
                '%2C' +
                (flowInstanceIdNumber + 21) +
                '&qpl_active_flow_instance_ids=' +
                flowInstanceIdNumber +
                '_' +
                flowInstanceIdUnique +
                '%2C' +
                (flowInstanceIdNumber + 21) +
                '_' +
                flowInstanceIdUnique +
                '&rename_strategy=ONLY_TOP_LEVEL_RENAME&skip_tracking_specs=true&source=click_campaign_group_duplicate&suppress_http_code=1&website_conversion_ad_default_extension_option=NOT_SELECTED&xref=' +
                xref,
              method: 'POST',
            },
          )

          const jsonRes = await _0x4fbd03.json
          if (!jsonRes.error) {
            campaignClone++
          }
        }

        statusads = `Nhân CD thành công (${campaignClone})`
        _resolve(statusads)
      } catch (error) {
        console.error(error)
        statusads = `Có lỗi xảy ra khi nhân CD`
        _reject(statusads)
      }
    })
  }
  Turnads(IDTK, _0x4b3957 = null) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        _0x4b3957 && _0x4b3957('message', { message: 'Bật ADS' })
        let allIds = []
        let idcamp
        const graphApiResponse1 = await fetch2(
          'https://graph.facebook.com/v18.0/act_' +
            IDTK +
            '/addrafts?fields=name,ad_object_id&access_token=' +
            fb.accessToken2 +
            '&limit=1',
        )
        const jsonData1 = await graphApiResponse1.json // Chuyển response thành JSON
        // Kiểm tra xem dữ liệu có tồn tại không
        const draftId = jsonData1?.data?.[0]?.id || null

        const graphApiResponse2 = await fetch2(
          ' https://graph.facebook.com/v18.0/act_' +
            IDTK +
            '/ads?fields=id&access_token=' +
            fb.accessToken2 +
            '&limit=200',
        )
        const jsonData2 = await graphApiResponse2.json // Chuyển response thành JSON
        // Kiểm tra xem dữ liệu có tồn tại không
        const adList1 = jsonData2?.data || []
        // Lấy danh sách ad IDs
        const graphApiResponse3 = await fetch2(
          'https://graph.facebook.com/v2.1/act_' +
            IDTK +
            '/light_adsets?fields=ame,id,ad_object_id,fragments&access_token=' +
            fb.accessToken2 +
            '&limit=100',
        )
        const jsonData3 = await graphApiResponse3.json
        const adList2 = jsonData3?.data || []
        _0x4b3957 && _0x4b3957('message', { message: 'Chờ bật ADS' })
        for (let i = 0; i < adList1.length; i++) {
          const adsId = adList1[i].id
          const adset = adList2[i].id
          const response = await fetch2(
            'https://graph.facebook.com/v19.0/' +
              draftId +
              '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&qpl_active_flow_ids=270206350%2C270214832&qpl_active_flow_instance_ids=270206350_6ff3f2d14e462910316%2C270214832_6ff3c8ac96399dc0b84&access_token=' +
              fb.accessToken2,
            {
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body: `__ad_account_id=${IDTK}&_callFlowletID=104465&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_triggerFlowletID=104466&account_id=${IDTK}&action=modify&ad_object_id=${adsId}&ad_object_type=ad&is_archive=false&is_delete=false&locale=vi_VN&parent_ad_object_id=${adset}&qpl_active_flow_ids=270206350%2C270214832&qpl_active_flow_instance_ids=270206350_6ff3f2d14e462910316%2C270214832_6ff3c8ac96399dc0b84&validate=false&values=%5B%7B%22field%22%3A%22status%22%2C%22old_value%22%3A%22PAUSED%22%2C%22new_value%22%3A%22ACTIVE%22%7D%5D&xref=f74fb41aefba05d34`,
            },
          )
          const data = await response.json
          if (data?.id) {
            allIds.push(data.id)
          }
          idcamp = '[' + allIds.join(',') + ',]'
        }
        const activeScenarioIDs = fb.generateActiveScenarioIDs()
        const xref = fb.generateXref()
        const _0x4fbd03 = await fetch2(
          'https://adsmanager-graph.facebook.com/v19.0/' +
            draftId +
            '/publish?_reqName=object%3Adraft_id%2Fpublish&access_token=' +
            fb.accessToken2 +
            '&method=post&qpl_active_flow_ids=270208286&qpl_active_flow_instance_ids=270208286_01f5974524ff1c07e56&__cppo=1&_callFlowletID=23368&_triggerFlowletID=23369',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%22' +
              activeScenarioIDs +
              '%22%5D&__activeScenarios=%5B%22am.publish_ads.in_review_and_publish%22%5D&__ad_account_id=' +
              IDTK +
              '&__interactionsMetadata=%5B%22%7Bat_section%3AL1%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3A270208286_82f900967348db45f2f%2Cmedia_format%3Anull%2Cname%3Aam.publish_ads.in_review_and_publish%2Crevisit%3A0%2Cstart_callsite%3AAdsManagerPerfScenarioTriggerController_AdsPEUploadPreviewDialog.react%2Ccampaign_objective%3AOUTCOME_ENGAGEMENT%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=25053&_reqName=object%3Adraft_id%2Fpublish&_reqSrc=AdsDraftPublishDataManager&_sessionID=63b21639&_triggerFlowletID=25054&fragments=' +
              idcamp +
              '&ignore_errors=true&include_fragment_statuses=true&include_headers=false&locale=vi_VN&method=post&pretty=0&qpl_active_flow_ids=270208286&qpl_active_flow_instance_ids=270208286_82f900967348db45f2f&suppress_http_code=1&xref=' +
              xref,
            method: 'POST',
          },
        )
        const _0x94bbb9 = _0x4fbd03.json
        if (_0x94bbb9.success) {
          _0x1de5a2(true)
        } else {
          _0x47e12d(false)
        }
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d()
      }
    })
  }
  Delcamp(adsConfig, IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      for (let i = 0; i < adsConfig.ads.Delcamp.value; i++) {
        try {
          const graphApiResponse = await fetch2(
            'https://graph.facebook.com/v19.0/act_' +
              IDTK +
              '?fields=campaigns%7Bdelivery_status,status%7D&access_token=' +
              fb.accessToken2,
          )
          const jsonData = await graphApiResponse.json // Chuyển response thành JSON
          // Kiểm tra xem dữ liệu có tồn tại không
          const adidcamp = jsonData?.campaigns?.data?.[0]?.id || null

          const _0x4fbd03 = await fetch2(
            'https://adsmanager-graph.facebook.com/v19.0/' + adidcamp,
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                '_reqName=object%3Aaddraft_fragment&access_token=' +
                fb.accessToken2 +
                '&method=delete&__cppo=1&_callFlowletID=22&_triggerFlowletID=7739&__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__ad_account_id=' +
                IDTK +
                '&__interactionsMetadata=%5B%5D&_callFlowletID=7767&_reqName=object%3Aaddraft_fragment&_reqSrc=AdsDraftFragmentDataManager&_sessionID=616fb1b1&_triggerFlowletID=7768&include_headers=false&locale=en_GB&method=delete&pretty=0',
              method: 'POST',
            },
          )
          const _0x94bbb9 = _0x4fbd03.json
          if (_0x94bbb9.success) {
            _0x1de5a2()
          } else {
            _0x47e12d()
          }
        } catch (_0x1f988f) {
          console.log(_0x1f988f)
          _0x47e12d()
        }
      }
    })
  }
  BudgetCD(adsConfig, IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        let statusads = ''
        let Budget = 0
        let field = ''
        const BudgetValue = $("input[name='typeBudget']").val()
        if (adsConfig.ads.Budget.value == 1) {
          field = 'daily_budget'
        } else if (adsConfig.ads.Budget.value == 2) {
          field = 'lifetime_budget'
        }
        const graphApiResponse = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            IDTK +
            '?fields=ads.limit(999)%7Bid%2Ccampaign_id%2Cadset_id%7D%2Caddrafts&access_token=' +
            fb.accessToken2,
        )
        const jsonData = await graphApiResponse.json

        const addraftId = jsonData?.addrafts?.data?.[0]?.id || null
        const adsList = jsonData?.ads?.data || []

        const allAdsData = adsList.map((ad) => ({
          adidADS: ad.id,
          campaign_id: ad.campaign_id,
          adset_id: ad.adset_id,
        }))
        if (allAdsData.length === 0) {
          _0x1de5a2('Tài khoản không có quảng cáo nào')
          return
        }
        const uniqueCampaignIds = [...new Set(allAdsData.map((ad) => ad.campaign_id))]
        const results = await Promise.all(
          uniqueCampaignIds.map(async (campaign_id) => {
            const graphApiResponse2 = await fetch2(
              'https://adsmanager-graph.facebook.com/v18.0/' +
                addraftId +
                '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                fb.accessToken2 +
                '&method=post&qpl_active_flow_ids=270211726%2C270216430%2C270230590&qpl_active_flow_instance_ids=270211726_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&__cppo=1&_callFlowletID=19718&_triggerFlowletID=19718',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__ad_account_id=' +
                  IDTK +
                  '&__interactionsMetadata=%5B%5D&_callFlowletID=19522&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=7d4131c37d137d5b&_triggerFlowletID=19523&account_id=' +
                  IDTK +
                  '&action=modify&ad_object_id=' +
                  campaign_id +
                  '&ad_object_type=campaign&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&parent_ad_object_id=' +
                  IDTK +
                  '&pretty=0&qpl_active_flow_ids=270211726%2C270216430%2C270230590&qpl_active_flow_instance_ids=270211726_5bfbd5ae8dc413a3d02%2C270216430_5bf2362a747a763b314&suppress_http_code=1&validate=false&values=[{"field":"' +
                  field +
                  '","old_value":"2000","new_value":"' +
                  BudgetValue +
                  '"}]&xref=fba1efe616136017e',
                method: 'POST',
              },
            )
            const jsonData2 = await graphApiResponse2.json

            if (!jsonData2.error) {
              Budget += 1
            }
          }),
        )
        statusads += 'Edit thành công (' + Budget + ')'

        _0x1de5a2(statusads)
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d(statusads)
      }
    })
  }
  Budgetgroup(adsConfig, IDTK, _0x4b3957 = false) {
    return new Promise(async (_0x1de5a2, _0x47e12d) => {
      try {
        let statusads = ''
        let Budget = 0
        let field = ''

        const BudgetValue = $("input[name='typeBudget']").val()
        if (adsConfig.ads.Budget.value == 1) {
          field = 'daily_budget'
        } else if (adsConfig.ads.Budget.value == 2) {
          field = 'lifetime_budget'
        }
        const graphApiResponse = await fetch2(
          'https://graph.facebook.com/v19.0/act_' +
            IDTK +
            '?fields=ads.limit(999)%7Bid%2Ccampaign_id%2Cadset_id%7D%2Caddrafts&access_token=' +
            fb.accessToken2,
        )
        const jsonData = await graphApiResponse.json

        const addraftId = jsonData?.addrafts?.data?.[0]?.id || null
        const adsList = jsonData?.ads?.data || []

        const allAdsData = adsList.map((ad) => ({
          adidADS: ad.id,
          campaign_id: ad.campaign_id,
          adset_id: ad.adset_id,
        }))
        if (allAdsData.length === 0) {
          _0x1de5a2('Tài khoản không có quảng cáo nào')
          return
        }
        const {
          activeScenarioIDs,
          flowInstanceIdNumber,
          flowInstanceIdUnique,
          callFlowletID,
          sessionID,
          xref,
        } = generateAllFlowParams()
        const uniqueCampaignIds = [...new Set(allAdsData.map((ad) => ad.campaign_id))]
        const results = await Promise.all(
          uniqueCampaignIds.map(async (campaign_id) => {
            const graphApiResponse2 = await fetch2(
              'https://adsmanager-graph.facebook.com/v18.0/' +
                addraftId +
                '/addraft_fragments?_reqName=object%3Aaddraft%2Faddraft_fragments&access_token=' +
                fb.accessToken2 +
                '&method=post&qpl_active_flow_ids=270208708%2C270211506%2C270213183%2C270214027%2C270230590&qpl_active_flow_instance_ids=270208708_c4fe94b9a500daa4000%2C270211506_c4fbf0ad904276df34a%2C270213183_c4f3bc3d4d20c6c7baf%2C270214027_c4fcbf3d32ba6e1c514&__cppo=1&_callFlowletID=17788&_triggerFlowletID=17788',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  '__activeScenarioIDs=%5B%223a9f6b9d-c89e-415e-83dc-61d095990a4a%22%2C%22813d7759-8533-4221-a436-16cd0e63b1dd%22%5D&__activeScenarios=%5B%22am.edit_delivery.delivery_estimates%22%2C%22am.editor.save_changes%22%5D&__ad_account_id=' +
                  IDTK +
                  '&__interactionsMetadata=%5B%22%7Bat_section%3AL2%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3Anull%2Cmedia_format%3Anull%2Cname%3Aam.edit_delivery.delivery_estimates%2Crevisit%3A1%2Cstart_callsite%3Aam%3Aedit_delivery%3Achange_budget_amount%2Ccampaign_objective%3Anull%2Cad_creation_package_config_id%3Anull%2C%7D%22%2C%22%7Bat_section%3AL2%2Ccurrent_action_objects_total_count%3A0%2Cflow_instance_id%3Anull%2Cmedia_format%3Anull%2Cname%3Aam.editor.save_changes%2Crevisit%3A1%2Cstart_callsite%3Aam%3Aedit_delivery%3Achange_budget_amount%2Ccampaign_objective%3AOUTCOME_ENGAGEMENT%2Cad_creation_package_config_id%3Anull%2C%7D%22%5D&_callFlowletID=17803&_priority=HIGH&_reqName=object%3Aaddraft%2Faddraft_fragments&_reqSrc=AdsDraftFragmentDataManager&_sessionID=2ad76628b7bc7ac4&_triggerFlowletID=17804&account_id=' +
                  IDTK +
                  '&action=modify&ad_object_id=' +
                  adset_id +
                  '&ad_object_type=ad_set&include_headers=false&is_archive=false&is_delete=false&locale=en_GB&method=post&parent_ad_object_id=' +
                  campaign_id +
                  '&pretty=0&qpl_active_flow_ids=270208708%2C270211506%2C270213183%2C270214027%2C270230590&qpl_active_flow_instance_ids=270208708_c4fe94b9a500daa4000%2C270211506_c4fbf0ad904276df34a%2C270213183_c4f3bc3d4d20c6c7baf%2C270214027_c4fcbf3d32ba6e1c514&suppress_http_code=1&validate=false&values=[{"field":"' +
                  field +
                  '","old_value":2000,"new_value":' +
                  BudgetValue +
                  '}]&xref=ff1a0b5705b384919',
                method: 'POST',
              },
            )
            const jsonData2 = await graphApiResponse2.json

            if (!jsonData2.error) {
              Budget += 1
            }
          }),
        )
        statusads += 'Edit thành công (' + Budget + ')'

        _0x1de5a2(statusads)
      } catch (_0x1f988f) {
        console.log(_0x1f988f)
        _0x47e12d(statusads)
      }
    })
  }
  loadSpendRange(_0xe00b86, _0x3d68ad, _0x48fc2a) {
    return new Promise(async (_0x4a0598, _0x3ce0e4) => {
      $('#app').addClass('loading')
      try {
        const _0x1735a6 = Math.ceil(_0x48fc2a.length / 50)
        for (let _0x2f5b50 = 1; _0x2f5b50 <= _0x1735a6; _0x2f5b50++) {
          const _0x47a9cd = (_0x2f5b50 - 1) * 50
          const _0x160669 = _0x48fc2a.slice(_0x47a9cd, _0x2f5b50 * 50)
          const _0x45be0a = []
          _0x160669.forEach((_0x5777ad) => {
            _0x45be0a.push({
              id: _0x5777ad.adId,
              relative_url:
                '/act_' +
                _0x5777ad.adId +
                "?fields=account_id,insights.time_range({since:'" +
                _0xe00b86 +
                "',until:'" +
                _0x3d68ad +
                "'}){spend}",
              method: 'GET',
            })
          })
          const _0x2afa46 = await fetch2(
            'https://adsmanager-graph.facebook.com/v16.0?access_token=' +
              fb.accessToken +
              '&suppress_http_code=1&locale=en_US',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body: 'include_headers=false&batch=' + JSON.stringify(_0x45be0a),
              method: 'POST',
            },
          )
          const _0x3f32d6 = _0x2afa46.json
          for (let _0x4b5528 = 0; _0x4b5528 < _0x3f32d6.length; _0x4b5528++) {
            const _0x5307f9 = JSON.parse(_0x3f32d6[_0x4b5528].body)
            const _0x4394a8 = _0x48fc2a.findIndex(
              (_0x1f8ebe) => _0x1f8ebe.adId === _0x5307f9.account_id,
            )
            if (_0x5307f9.insights?.data[0]?.spend) {
              const _0x52516c = {
                id: _0x48fc2a[_0x4394a8].id,
                spend: _0x5307f9.insights?.data[0]?.spend,
              }
              $(document).trigger('loadSpend', [_0x52516c])
            } else {
              const _0x35ffdd = {
                id: _0x48fc2a[_0x4394a8].id,
                spend: 0,
              }
              $(document).trigger('loadSpend', [_0x35ffdd])
            }
            // countTotal(accountGrid);
          }
          break
        }
      } catch (_0x300d6d) {
        console.log(_0x300d6d)
      }
    })
  }
}
fbtkqc = new FBTKQC()
class FBBM {
  getBmOwnedAccount(_0x22e8e4) {
    return new Promise(async (_0xf8e2ab, _0x2b784c) => {
      const _0x498bf4 = []
      try {
        const _0x12726f = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            _0x22e8e4 +
            '/owned_ad_accounts?fields=adtrust_dsl,currency,account_status&limit=100&access_token=' +
            fb.accessToken,
        )
        const _0x2cb35e = _0x12726f.json
        _0x2cb35e.data.forEach((_0x33d03a) => {
          _0x498bf4.push(_0x33d03a)
        })
        let _0x372670 = _0x2cb35e.paging.next
        if (_0x372670) {
          for (let _0xc7dfda = 0; _0xc7dfda < 9999; _0xc7dfda++) {
            const _0x2ba780 = await fetch2(_0x372670)
            const _0xf3aa36 = _0x2ba780.json
            if (_0xf3aa36.data) {
              _0xf3aa36.data.forEach((_0x4f7a6a) => {
                _0x498bf4.push(_0x4f7a6a)
              })
            }
            if (_0xf3aa36.paging.next) {
              _0x372670 = _0xf3aa36.paging.next
            } else {
              break
            }
          }
        }
      } catch (_0x441c46) {}
      _0xf8e2ab(_0x498bf4)
    })
  }
  getBmClientAccount(_0x177019) {
    return new Promise(async (_0x576f95, _0x30e17c) => {
      const _0x13c5a9 = []
      try {
        const _0x1e8701 = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            _0x177019 +
            '/client_ad_accounts?fields=account_status&limit=100&access_token=' +
            fb.accessToken,
        )
        const _0x264c47 = _0x1e8701.json
        _0x264c47.data.forEach((_0x54388f) => {
          _0x13c5a9.push(_0x54388f)
        })
        let _0x5f3459 = _0x264c47.paging.next
        if (_0x5f3459) {
          for (let _0x29b3ae = 0; _0x29b3ae < 9999; _0x29b3ae++) {
            const _0x2fd573 = await fetch2(_0x5f3459)
            const _0x17b26b = _0x2fd573.json
            if (_0x17b26b.data) {
              _0x17b26b.data.forEach((_0x304bd3) => {
                _0x13c5a9.push(_0x304bd3)
              })
            }
            if (_0x17b26b.paging.next) {
              _0x5f3459 = _0x17b26b.paging.next
            } else {
              break
            }
          }
        }
        _0x13c5a9
      } catch (_0x242278) {}
      _0x576f95(_0x13c5a9)
    })
  }
  getBmPartners(_0x370018) {
    return new Promise(async (_0x410678, _0x38f355) => {
      try {
        const _0x64a5b9 = await fetch2(
          'https://business.facebook.com/latest/settings/partners?business_id=' + _0x370018,
          {
            headers: {
              accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
              dpr: '1',
              priority: 'u=0, i',
              'sec-ch-prefers-color-scheme': 'light',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-model': '""',
              'sec-ch-ua-platform-version': '"19.0.0"',
              'sec-fetch-dest': 'document',
              'sec-fetch-mode': 'navigate',
              'sec-fetch-site': 'none',
              'sec-fetch-user': '?1',
              'upgrade-insecure-requests': '1',
              'viewport-width': '617',
            },
            body: null,
            method: 'GET',
          },
        )
        const _0x16ffaf = _0x64a5b9.text
        const _0x4d0fae = JSON.parse(
          _0x16ffaf.split('{"all_partners_businesses":{"edges":')[1].split(',"page_info"')[0],
        ).map((_0x580722) => _0x580722.node)
        _0x410678(_0x4d0fae)
      } catch (_0x111b4d) {
        _0x38f355(_0x111b4d)
      }
    })
  }
  getBmLimit(_0x1b51aa) {
    return new Promise(async (_0x117220, _0x22a00a) => {
      try {
        const _0x3289fb = await fetch2(
          'https://business.facebook.com/business/adaccount/limits/?business_id=' + _0x1b51aa,
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            referrer: 'https://business.facebook.com',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: '__a=1&fb_dtsg=' + fb.dtsg + '&lsd=' + fb.lsd,
            method: 'POST',
          },
        )
        let _0x412f45 = _0x3289fb.text
        _0x412f45 = JSON.parse(_0x412f45.replace('for (;;);', ''))
        if (_0x412f45.payload) {
          _0x117220(_0x412f45.payload.adAccountLimit)
        } else if (_0x412f45.blockedAction) {
          _0x117220(-1)
        } else {
          _0x22a00a()
        }
      } catch (_0x4274e9) {
        _0x22a00a()
      }
    })
  }
  getBmPage() {
    return new Promise(async (_0x1ea353, _0x39fbe1) => {
      try {
        const _0x327dc6 = await fetch2('https://business.facebook.com/select')
        const _0x3bfc79 = _0x327dc6.text
        const _0x1d263a = JSON.parse(
          _0x3bfc79
            .split(
              'requireLazy(["TimeSliceImpl","ServerJS"],function(TimeSlice,ServerJS){var s=(new ServerJS());s.handle(',
            )[1]
            .split(');requireLazy(["Run"]')[0],
        )
        _0x1ea353(_0x1d263a.require[2][3][1].businesses)
      } catch (_0x341174) {
        _0x39fbe1(_0x341174)
      }
    })
  }
  getBmData(_0xb50316) {
    return new Promise(async (_0x24cc31, _0x28c9da) => {
      const _0xe17e1f = await getSetting()
      const _0x5e50fc = (_0x37dcc0) => {
        return new Promise(async (_0x26d84a, _0x4dbd49) => {
          if (_0x37dcc0.status === '-') {
            try {
              const _0x4b212d = await fetch2('https://www.facebook.com/api/graphql/', {
                headers: {
                  accept: '*/*',
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  '__a=1&fb_dtsg=' +
                  fb.dtsg +
                  '&lsd=' +
                  fb.lsd +
                  '&locale=en_US&dpr=1&variables={"id":' +
                  _0x37dcc0.bmId +
                  '}&doc_id=7820136481365487&server_timestamps=true',
                method: 'POST',
              })
              const _0xecbf2e = _0x4b212d.json
              let _0xe3b62d = ''
              if (!_0xecbf2e.data.node.advertising_restriction_info.restriction_type) {
                _0xe3b62d = 'LIVE'
              } else {
                _0xe3b62d = 'DIE'
              }
              const _0x23ffa6 = {
                id: _0x37dcc0.id,
                status: _0xe3b62d,
              }
              $(document).trigger('loadStatusSuccess', [_0x23ffa6])
            } catch (_0x416a25) {
              const _0x3d183b = {
                id: _0x37dcc0.id,
                status: '',
              }
              $(document).trigger('loadStatusSuccess', [_0x3d183b])
            }
          }
          if (_0xe17e1f.loadBm.bmLimit.value) {
            try {
              const _0x42784c = await fbbm.getBmLimit(_0x37dcc0.bmId)
              $(document).trigger('loadLimitSuccess', [
                {
                  id: _0x37dcc0.id,
                  type:
                    'BM' + _0x42784c + ' - ' + moment(_0x37dcc0.createdTime).format('DD/MM/YYYY'),
                },
              ])
            } catch (_0x1adee2) {
              $(document).trigger('loadLimitSuccess', [
                {
                  id: _0x37dcc0.id,
                  type: moment(_0x37dcc0.createdTime).format('DD/MM/YYYY'),
                },
              ])
            }
          } else {
            $(document).trigger('loadLimitSuccess', [
              {
                id: _0x37dcc0.id,
                type: moment(_0x37dcc0.createdTime).format('DD/MM/YYYY'),
              },
            ])
          }
          if (_0xe17e1f.loadBm.bmPartner.value) {
            try {
              const _0x17ff87 = await fbbm.getBmPartners(_0x37dcc0.bmId)
              const _0x1fcfc7 = {
                id: _0x37dcc0.id,
                count: _0x17ff87.length,
              }
              $(document).trigger('loadPartnerSuccess', [_0x1fcfc7])
            } catch (_0x336884) {
              const _0x2a36ac = {
                id: _0x37dcc0.id,
                count: '0',
              }
              $(document).trigger('loadPartnerSuccess', [_0x2a36ac])
            }
          } else {
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('partnerCount', '')
          }
          if (_0xe17e1f.loadBm.bmQtv.value) {
            try {
              const _0x5a2b5e = await fbbm.getBmAccounts(_0x37dcc0.bmId)
              const _0x486c0a = {
                id: _0x37dcc0.id,
                count: _0x5a2b5e.length,
              }
              $(document).trigger('loadQtvSuccess', [_0x486c0a])
            } catch {
              const _0x3533c6 = {
                id: _0x37dcc0.id,
                count: '0',
              }
              $(document).trigger('loadQtvSuccess', [_0x3533c6])
            }
          } else {
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('adminAccount', '')
          }
          if (_0xe17e1f.loadBm.bmInsta.value) {
            try {
              const _0x16e17e = await fbbm.getInsta(_0x37dcc0.bmId)
              const _0xb337f7 = {
                id: _0x37dcc0.id,
                count: _0x16e17e.data.length,
              }
              $(document).trigger('loadInstaSuccess', [_0xb337f7])
            } catch {
              const _0xee9df3 = {
                id: _0x37dcc0.id,
                count: '',
              }
              $(document).trigger('loadInstaSuccess', [_0xee9df3])
            }
          } else {
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('instaAccount', '')
          }
          if (_0xe17e1f.loadBm.bmAccountShare.value) {
            try {
              const _0xf21234 = await fbbm.getBmClientAccount(_0x37dcc0.bmId)
              const _0x57d66b = {
                id: _0x37dcc0.bmId,
                data: _0xf21234,
              }
              $(document).trigger('loadClientAccountsSuccess', [_0x57d66b])
            } catch {
              const _0x1a7aa1 = {
                id: _0x37dcc0.bmId,
                data: [],
              }
              $(document).trigger('loadClientAccountsSuccess', [_0x1a7aa1])
            }
          } else {
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('adAccountShare', '')
          }
          if (_0xe17e1f.loadBm.bmAccount.value) {
            try {
              const _0x47979a = await fbbm.getBmOwnedAccount(_0x37dcc0.bmId)
              const _0x374079 = {
                id: _0x37dcc0.id,
                data: _0x47979a,
              }
              $(document).trigger('loadOwnedAccountsSuccess', [_0x374079])
            } catch {
              const _0x1d696e = {
                id: _0x37dcc0.id,
                data: [],
              }
              $(document).trigger('loadOwnedAccountsSuccess', [_0x1d696e])
            }
          } else {
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('adAccount', '')
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('adAccount', '')
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('limit', '')
            accountGrid.api.getRowNode(_0x37dcc0.id).setDataValue('currency', '')
          }
          _0x26d84a()
        })
      }
      const _0x54cc04 = []
      for (let _0x26cfac = 0; _0x26cfac < _0xb50316.length; _0x26cfac++) {
        _0x54cc04.push(_0x5e50fc(_0xb50316[_0x26cfac]))
      }
      await Promise.all(_0x54cc04)
      _0x24cc31()
    })
  }
  getBm(_0x30626b = 50, _0x3b90cf = []) {
    return new Promise(async (_0xf46cd0, _0x59a310) => {
      try {
        loadingDataBm()
        const _0x3558aa = await getSetting()
        let _0x3664ba = []
        let _0x1c5e4c = []
        if (_0x3558aa.loadBm.bmStatus.value && _0x3558aa.loadBm.bmStatusApi.value === 'api1') {
          try {
            _0x3664ba = await fbbm.getBmStatus()
          } catch {}
        }
        if (_0x3558aa.loadBm.bmPage.value) {
          try {
            _0x1c5e4c = await fbbm.getBmPage()
          } catch {}
        }
        let _0x29af7e = {}
        const _0x4ce527 = await fetch2(
          'https://graph.facebook.com/v14.0/me/businesses?fields=name,id,is_disabled_for_integrity_reasons,verification_status,business_users,allow_page_management_in_www,sharing_eligibility_status,created_time,permitted_roles&limit=' +
            _0x30626b +
            '&access_token=' +
            fb.accessToken,
        )
        const _0x1b1d29 = _0x4ce527.json
        if (_0x1b1d29.data.length) {
          _0x29af7e = _0x1b1d29
        }
        accountGrid.api.setRowData([])
        accountGrid.api.hideOverlay()
        const _0x1fd46f = (_0x2faa4b) => {
          const _0x160777 = {
            ..._0x2faa4b,
          }
          const _0x27d3c1 = _0x160777
          try {
            const _0x5c62b6 = _0x3664ba.findIndex((_0x54f853) => _0x54f853.id === _0x2faa4b.id)
            _0x27d3c1.avatar = _0x3664ba[_0x5c62b6].avatar || ''
            _0x27d3c1.is_restricted = _0x3664ba[_0x5c62b6].is_restricted || ''
            _0x27d3c1.restriction_type = _0x3664ba[_0x5c62b6].restriction_type || ''
            _0x27d3c1.status = _0x3664ba[_0x5c62b6].type || ''
            _0x27d3c1.text = _0x3664ba[_0x5c62b6].text || ''
          } catch (_0x292d17) {
            _0x27d3c1.avatar = ''
            _0x27d3c1.is_restricted = ''
            _0x27d3c1.restriction_type = ''
            if (_0x3558aa.loadBm.bmStatusApi.value === 'api3') {
              _0x27d3c1.status = _0x27d3c1.is_disabled_for_integrity_reasons ? 'DIE' : 'LIVE'
            } else if (_0x3558aa.loadBm.bmStatusApi.value === 'api2') {
              _0x27d3c1.status = '-'
            } else {
              _0x27d3c1.status = ''
            }
            _0x27d3c1.text = ''
          }
          try {
            const _0x39b3a0 = _0x3664ba.findIndex((_0x500800) => _0x500800.id === _0x2faa4b.id)
            _0x27d3c1.bmPage = _0x1c5e4c[_0x39b3a0]?.pageNumber || ''
          } catch {
            _0x27d3c1.bmPage = ''
          }
          return _0x27d3c1
        }
        if (_0x29af7e.data) {
          if (_0x3b90cf.length > 0) {
            $(document).trigger('addBm', [
              _0x1b1d29.data
                .filter((_0x417d2f) => !_0x3b90cf.includes(_0x417d2f.id))
                .map(_0x1fd46f),
            ])
          } else {
            $(document).trigger('addBm', [_0x1b1d29.data.map(_0x1fd46f)])
          }
          $('#gridLoading').addClass('d-none')
          let _0x2100ec = _0x29af7e.paging.next
          if (_0x2100ec) {
            for (let _0x66e56e = 0; _0x66e56e < 9999; _0x66e56e++) {
              const _0x1a8a60 = await fetch2(_0x2100ec)
              const _0x976d16 = _0x1a8a60.json
              if (_0x3b90cf.length > 0) {
                $(document).trigger('addBm', [
                  _0x976d16.data
                    .filter((_0x2888c6) => !_0x3b90cf.includes(_0x2888c6.id))
                    .map(_0x1fd46f),
                ])
              } else {
                $(document).trigger('addBm', [_0x976d16.data.map(_0x1fd46f)])
              }
              if (_0x976d16.paging?.next) {
                _0x2100ec = _0x976d16.paging.next
              } else {
                break
              }
            }
          }
          _0xf46cd0()
        } else {
          _0x59a310()
        }
      } catch (_0x370597) {
        console.log(_0x370597)
        _0x59a310()
      }
    })
  }
  getBmStatus(_0x2bb815 = true) {
    return new Promise(async (_0x118c07, _0x2b6feb) => {
      try {
        const _0x5a42b5 = await fetch2('https://business.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: 'fb_dtsg=' + fb.dtsg + '&variables={}&doc_id=4941582179260904',
          method: 'POST',
        })
        const _0x5f13a5 = _0x5a42b5.json
        const _0x4224e3 = _0x5f13a5.data.viewer.ad_businesses.nodes.map((_0xa75fbc) => {
          let _0x50bda4 = ''
          let _0x2a40f4 = ''
          if (
            _0xa75fbc.advertising_restriction_info.status === 'NOT_RESTRICTED' &&
            !_0xa75fbc.advertising_restriction_info.is_restricted
          ) {
            _0x50bda4 = 'LIVE'
            _0x2a40f4 = 'Live'
          }
          if (
            (_0xa75fbc.advertising_restriction_info.status === 'VANILLA_RESTRICTED' &&
              _0xa75fbc.advertising_restriction_info.is_restricted) ||
            _0xa75fbc.advertising_restriction_info.status === 'APPEAL_INCOMPLETE'
          ) {
            if (_0xa75fbc.advertising_restriction_info.restriction_type === 'ALE') {
              _0x50bda4 = 'DIE_3DONG'
              _0x2a40f4 = 'Die 3 dòng'
            } else {
              _0x50bda4 = 'DIE'
              _0x2a40f4 = 'Die'
            }
          }
          if (
            _0xa75fbc.advertising_restriction_info.restriction_type === 'ALE' &&
            _0xa75fbc.advertising_restriction_info.status === 'APPEAL_TIMEOUT'
          ) {
            _0x50bda4 = 'DIE_3DONG'
            _0x2a40f4 = 'Die 3 dòng'
          }
          if (
            _0xa75fbc.advertising_restriction_info.status === 'APPEAL_REJECTED_NO_RETRY' &&
            _0xa75fbc.advertising_restriction_info.is_restricted
          ) {
            _0x50bda4 = 'DIE_VV'
            _0x2a40f4 = 'Die vĩnh viễn'
          }
          if (_0xa75fbc.advertising_restriction_info.status === 'APPEAL_REJECTED') {
            _0x50bda4 = 'DIE_VV'
            _0x2a40f4 = 'Die vĩnh viễn'
          }
          if (_0xa75fbc.advertising_restriction_info.status === 'APPEAL_PENDING') {
            _0x50bda4 = 'DIE_DK'
            _0x2a40f4 = 'Die đang kháng'
          }
          if (_0xa75fbc.advertising_restriction_info.status === 'APPEAL_ACCEPTED') {
            if (_0xa75fbc.advertising_restriction_info.restriction_type === 'ALE') {
              _0x50bda4 = 'BM_KHANG_3DONG'
              _0x2a40f4 = 'BM kháng 3 dòng'
            } else if (!_0xa75fbc.advertising_restriction_info.is_restricted) {
              _0x50bda4 = 'BM_KHANG'
              _0x2a40f4 = 'BM kháng'
            } else {
              _0x50bda4 = 'BM_XANHVO'
              _0x2a40f4 = 'BM xanh vỏ'
            }
          }
          const _0x702c9e = {
            id: _0xa75fbc.id,
            type: _0x50bda4,
            name: _0xa75fbc.name,
            text: _0x2a40f4,
            status: _0xa75fbc.advertising_restriction_info.status,
            is_restricted: _0xa75fbc.advertising_restriction_info.is_restricted,
            restriction_type: _0xa75fbc.advertising_restriction_info.restriction_type,
            avatar: _0xa75fbc.profile_picture.uri,
          }
          return _0x702c9e
        })
        if (_0x2bb815) {
          let _0x24c809 = []
          for (let _0x104bbb = 0; _0x104bbb < _0x4224e3.length; _0x104bbb++) {
            if (_0x4224e3[_0x104bbb].type === 'DIE') {
              const _0x4d2b50 = () => {
                return new Promise(async (_0x345066, _0x253eb8) => {
                  try {
                    const _0x559c3b = await fetch2(
                      'https://business.facebook.com/api/graphql/?_flowletID=1',
                      {
                        headers: {
                          'content-type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                        body:
                          'av=' +
                          fb.uid +
                          '&__usid=6-Ts626y2arz8fg%3APs626xy1mafk6f%3A0-As626x5t9hdw-RV%3D6%3AF%3D&session_id=3f06e26e24310de8&__user=' +
                          fb.uid +
                          '&__a=1&__req=1&__hs=19713.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010574318&__s=bgx31o%3A93y1un%3Aj1i0y0&__hsi=7315329750708113449&__dyn=7xeUmxa2C5ryoS1syU8EKmhG5UkBwqo98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczEeU-5Ejwl8gwqoqyojzoO4o2oCwOxa7FEd89EmwoU9FE4Wqmm2ZedUbpqG6kE8RoeUKUfo7y78qgOUa8lwWxe4oeUuyo465o-0xUnw8ScwgECu7E422a3Gi6rwiolDwjQ2C4oW2e1qyQ6U-4Ea8mwoEru6ogyHwyx6i8wxK3eUbE4S7VEjCx6Etwj84-224U-dwKwHxa1ozFUK1gzpErw-z8c89aDwKBwKG13y85i4oKqbDyoOEbVEHyU8U3yDwbm1Lx3wlF8C221bzFHwCwNwDwjouxK2i2y1sDw9-&__csr=&fb_dtsg=' +
                          fb.dtsg +
                          '&jazoest=25595&lsd=XBGCglH3K63SPddlSyNKgf&__aaid=0&__bid=745415083846542&__spin_r=1010574318&__spin_b=trunk&__spin_t=1703232934&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AccountQualityHubAssetOwnerViewQuery&variables=%7B%22assetOwnerId%22%3A%22' +
                          _0x4224e3[_0x104bbb].id +
                          '%22%7D&server_timestamps=true&doc_id=24196151083363204',
                      },
                    )
                    const _0x48a4b3 = _0x559c3b.json
                    const _0x29c865 = _0x48a4b3.data.assetOwnerData.advertising_restriction_info
                    const _0x33b5a8 = _0x29c865.restriction_date
                    if (
                      _0x29c865.status === 'VANILLA_RESTRICTED' &&
                      _0x29c865.is_restricted &&
                      _0x29c865.additional_parameters.ufac_state === 'FAILED'
                    ) {
                      _0x4224e3[_0x104bbb].type = 'DIE_VV'
                      _0x4224e3[_0x104bbb].text = 'Die vĩnh viễn'
                    }
                    if (
                      _0x33b5a8 === '2025-01-26' ||
                      _0x33b5a8 === '2025-01-27' ||
                      _0x33b5a8 === '2025-01-28'
                    ) {
                      _0x4224e3[_0x104bbb].type = 'DIE_CAPTCHA'
                      _0x4224e3[_0x104bbb].text = 'Die Captcha'
                      _0x4224e3[_0x104bbb].dieDate = _0x33b5a8
                    }
                  } catch {}
                  _0x345066()
                })
              }
              _0x24c809.push(_0x4d2b50())
            }
          }
          await Promise.all(_0x24c809)
        }
        _0x118c07(_0x4224e3)
      } catch (_0x55d566) {
        _0x2b6feb()
      }
    })
  }
  nhanLink(_0x2ed220) {
    return new Promise(async (_0x397fb9, _0x54d27c) => {
      const _0x29b050 = await saveSetting()
      await fetch2(
        'https://m.facebook.com/password/reauth/?next=https%3A%2F%2Fmbasic.facebook.com%2Fsecurity%2F2fac%2Fsettings%2F%3Fpaipv%3D0%26eav%3DAfZfmwJnXhbeLP6m-giW1oCoZD0faAw6x_1LxHqf1nvS-tew9Vl6iEkBMuwwPNYH7Zw&paipv=0&eav=AfbC-ToI9zgklrUncTH4S-pXjfy5d5SPf9ZLf_iWIHepbPFg8mMnmmsnW0Or3AkCflI',
        {
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'content-type': 'application/x-www-form-urlencoded',
          },
          body:
            'fb_dtsg=' +
            fb.dtsg +
            '&jazoest=25494&encpass=#PWD_BROWSER:0:1111:' +
            _0x29b050.bm.nhanLinkPassword.value,
          method: 'POST',
        },
      )
      let _0x13251f = false
      const _0x357b18 = _0x29b050.general.limit.value
      $(document).on('stop', function (_0x15d2a2) {
        _0x13251f = true
      })
      let _0x4a23bf = []
      let _0x28b659 = 0
      for (let _0x4cb8f9 = 0; _0x4cb8f9 < 999; _0x4cb8f9++) {
        let _0x58094a = _0x2ed220.filter((_0x24fd23) => !_0x4a23bf.includes(_0x24fd23))
        if (_0x58094a.length > 0 && !_0x13251f) {
          _0x58094a = _0x58094a.slice(0, _0x357b18)
          const _0x5c701a = []
          const _0x2fabd4 = []
          const _0x204386 = []
          for (let _0x354572 = 0; _0x354572 < _0x58094a.length; _0x354572++) {
            if (!_0x13251f) {
              const _0x406058 = (_0x1a320d) => {
                return new Promise(async (_0x351f60, _0x430fe9) => {
                  setTimeout(_0x351f60, 120000)
                  try {
                    let _0xec699 = ''
                    _0x4a23bf.push(_0x58094a[_0x354572])
                    if (!_0x58094a[_0x354572].includes('|')) {
                      _0xec699 = _0x58094a[_0x354572]
                    } else {
                      _0xec699 = _0x58094a[_0x354572].split('|')[1]
                    }
                    $(document).trigger('checkProcess', [
                      '<strong>[' +
                        _0x4a23bf.length +
                        '/' +
                        _0x2ed220.length +
                        ']</strong> Đang nhận link: <strong>' +
                        _0xec699 +
                        '</strong>',
                    ])
                    const _0x478f84 = await fetch2(_0xec699)
                    const _0x466b77 = decodeURIComponent(_0x478f84.url).replace(
                      'https://business.facebook.com/business/loginpage/?next=',
                      '',
                    )
                    if (_0x466b77.includes('https://business.facebook.com/invitation/?token=')) {
                      const _0x455b44 = new URL(_0x466b77).searchParams
                      const _0x8dbc6f = _0x455b44.get('token')
                      const _0x43fce4 = await fetch2(
                        'https://business.facebook.com/business/invitation/login/',
                        {
                          headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                          },
                          method: 'POST',
                          body:
                            'first_name=' +
                            _0x1a320d +
                            '&last_name=' +
                            randomNumberRange(11111, 99999) +
                            '&invitation_token=' +
                            _0x8dbc6f +
                            '&receive_marketing_messages=false&user_preferred_business_email&__user=' +
                            fb.userInfo.id +
                            '&__a=1&__req=2&__hs=19664.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009675755&__s=voml6w%3Aorwnqa%3A3cyaaa&__hsi=7297248857485608221&__dyn=7xeUmwkHgydwn8K2WnFwn84a2i5U4e1Fx-ewSwMxW0DUS2S0lW4o3Bw5VCwjE3awbG78b87C1xwEwlU-0nS4o5-1uwbe2l0Fwwwi85W0_Ugw9KfwbK0RE5a1qwqU8E5W0HUvw5rwSxy0gq0Lo6-1FwbO0NE1rE&__csr=&fb_dtsg=' +
                            fb.dtsg +
                            '&jazoest=25503&lsd=VjWEsSvVwDyPvLUmreGFgG&__spin_r=1009675755&__spin_b=trunk&__spin_t=1699023148&__jssesw=1',
                        },
                      )
                      const _0x2197c0 = _0x43fce4.text
                      if (_0x2197c0.includes('"payload":null') && !_0x2197c0.includes('error')) {
                        _0x28b659++
                        _0x2fabd4.push(_0x58094a[_0x354572])
                      } else {
                        _0x204386.push(_0x58094a[_0x354572])
                      }
                    } else {
                      _0x204386.push(_0x58094a[_0x354572])
                    }
                  } catch (_0x232244) {
                    console.log(_0x232244)
                    _0x204386.push(_0x58094a[_0x354572])
                  }
                  _0x351f60()
                })
              }
              _0x5c701a.push(_0x406058(_0x29b050.bm.nhanLinkName.value))
            } else {
              break
            }
          }
          await Promise.all(_0x5c701a)
          if (_0x4a23bf.length > 0) {
            $(document).trigger('updateLinkAll', [_0x4a23bf])
          }
          if (_0x204386.length > 0) {
            $(document).trigger('updateLinkError', [_0x204386])
          }
          if (_0x2fabd4.length > 0) {
            $(document).trigger('updateLinkSuccess', [_0x2fabd4])
          }
        } else {
          break
        }
      }
      $(document).trigger('checkProcess', [
        'Nhận thành công: <strong>' + _0x28b659 + '/' + _0x2ed220.length + '</strong> link',
      ])
      await delayTime(3000)
      _0x397fb9()
    })
  }
  shareDoiTacBm(_0x3f9af8, _0x3db7c7, _0x5e6f06) {
    return new Promise(async (_0x2fdbd7, _0xfc7197) => {
      console.log(_0x3f9af8, _0x3db7c7, _0x5e6f06)
      try {
        const _0x2f4d66 = await fetch2(
          'https://graph.facebook.com/v17.0/act_' +
            _0x3db7c7 +
            '/agencies?access_token=' +
            fb.accessToken +
            '&_callFlowletID=21473&_triggerFlowletID=21459',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=adaccount%2Fagencies&_reqSrc=BrandAgencyActions.brands&accountId=' +
              _0x3db7c7 +
              '&acting_brand_id=' +
              _0x3f9af8 +
              '&business=' +
              _0x5e6f06 +
              '&locale=vi_VN&method=post&permitted_tasks=%5B%22ADVERTISE%22%2C%22ANALYZE%22%2C%22DRAFT%22%2C%22MANAGE%22%5D&pretty=0&suppress_http_code=1&xref=f7186d9b4189f5231',
            method: 'POST',
          },
        )
        const _0x5c37a3 = _0x2f4d66.json
        if (_0x5c37a3.success) {
          _0x2fdbd7()
        } else {
          _0xfc7197()
        }
      } catch (_0xaebfab) {
        console.log(_0xaebfab)
        _0xfc7197(_0xaebfab)
      }
    })
  }

  getLinkkhangBm(_0x33f1ef, _0x5c1bcd) {
    return new Promise(async (_0x3f82be, _0x3fc65d) => {
      let _0x1aa26f = false
      let _0x486d5e = false
      try {
        _0x5c1bcd('Đang lấy link kháng BM')
        const _0x1617bf = await fetch2(
          'https://www.facebook.com/business-support-home/' + _0x33f1ef,
        )
        const _0x5b2e53 = _0x1617bf.text
        if (_0x5b2e53.includes('idesEnforcementInstanceID')) {
          const _0x267587 = _0x5b2e53.match(/(?<=\"idesEnforcementInstanceID\":\")[^\"]*/g)[0]
          const _0x2e5bbe = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=1661',
            {
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&session_id=17e613b789f86fcc&__aaid=0&__bid=' +
                _0x33f1ef +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=j&__hs=20151.BP:DEFAULT.2.0...0&dpr=1&__ccg=GOOD&__rev=1020564878&__s=dr1ti4:103eex:hjfkpz&__hsi=7477848285631838275&__dyn=7xeUmxa3-Q5E9EdoK2Wmhe2Om2q1Dxuq3O1Fx-ewSxum4Euxa0z8S2S2q1Ex20zEyaxG4o2oCwho5G0O85mqbwgEbUy742ppU467U8o2lxe68a8522m3K7EC1Dw4WwgEhxW10wnEtwoVUao9k2B0q85W1bxq1-orx2ewyx6i2GU8U-UbE4S2q4UoG7o2swh8S1qxa1ozEjwnE2Lxi3-1RwrUux616yES2e0UFU2RwrU6CiU9E4KeyE9Eco9U6O6U4R0mVU1587u1rwc6227o&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25737&lsd=' +
                fb.lsd +
                '&__spin_r=1020564878&__spin_b=trunk&__spin_t=1741072229&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBSHGAMEOpenXFACAppealActionMutation&variables={"input":{"client_mutation_id":"2","actor_id":"' +
                fb.uid +
                '","enforcement_instance":"' +
                _0x267587 +
                '"}}&server_timestamps=true&doc_id=8036119906495815',
            },
          )
          const _0x380de0 = await _0x2e5bbe.json
          const _0x9eb1bb =
            _0x380de0.data.xfb_XFACGraphQLAppealManagerFetchOrCreateAppeal.xfac_appeal_id
          const _0x552523 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=1420',
            {
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&session_id=1b39647eb945a644&__aaid=0&__bid=' +
                _0x33f1ef +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=i&__hs=20151.BP:DEFAULT.2.0...0&dpr=1&__ccg=GOOD&__rev=1020564878&__s=g139k8:103eex:hwphka&__hsi=7477845871681707178&__dyn=7xeUmxa3-Q5E9EdoK2Wmhe2Om2q1Dxuq3O1Fx-ewSxum4Euxa0z8S2S2q1Ex20zEyaxG4o2oCwho5G0O85mqbwgEbUy742ppU467U8o2lxe68a8522m3K7EC1Dw4WwgEhxW10wnEtwoVUao9k2B0q85W1bxq1-orx2ewyx6i2GU8U-UbE4S2q4UoG7o2swh8S1qxa1ozEjwnE2Lxi3-1RwrUux616yES2e0UFU2RwrU6CiU9E4KeyE9Eco9U6O6U4R0mVU1587u1rwc6227o&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25762&lsd=' +
                fb.lsd +
                '&__spin_r=1020564878&__spin_b=trunk&__spin_t=1741071667&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometIXTFacebookXfacActorAppealTriggerRootQuery&variables={"input":{"trigger_event_type":"XFAC_ACTOR_APPEAL_ENTRY","ufac_design_system":"GEODESIC","xfac_id":"' +
                _0x9eb1bb +
                '","nt_context":null,"trigger_session_id":"d289e01d-ffc9-43ef-905b-0ee4a5807fd5"},"scale":1}&server_timestamps=true&doc_id=29439169672340596',
            },
          )
          const _0x368b77 =
            _0x552523.json.data.ixt_xfac_actor_appeal_trigger.screen.view_model.enrollment_id
          if (_0x368b77) {
            _0x5c1bcd(
              _0x33f1ef + '|https://www.facebook.com/checkpoint/1501092823525282/' + _0x368b77,
            )
            _0x1aa26f = true
            _0x486d5e = _0x368b77
          }
        } else {
          const _0x1d485f = await fetch2(
            'https://business.facebook.com/api/graphql/?_flowletID=1',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Ts626y2arz8fg%3APs626xy1mafk6f%3A0-As626x5t9hdw-RV%3D6%3AF%3D&session_id=3f06e26e24310de8&__user=' +
                fb.uid +
                '&__a=1&__req=1&__hs=19713.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010574318&__s=bgx31o%3A93y1un%3Aj1i0y0&__hsi=7315329750708113449&__dyn=7xeUmxa2C5ryoS1syU8EKmhG5UkBwqo98nCG6UmCyEgwjojyUW3qi4FoixWE-1txaczEeU-5Ejwl8gwqoqyojzoO4o2oCwOxa7FEd89EmwoU9FE4Wqmm2ZedUbpqG6kE8RoeUKUfo7y78qgOUa8lwWxe4oeUuyo465o-0xUnw8ScwgECu7E422a3Gi6rwiolDwjQ2C4oW2e1qyQ6U-4Ea8mwoEru6ogyHwyx6i8wxK3eUbE4S7VEjCx6Etwj84-224U-dwKwHxa1ozFUK1gzpErw-z8c89aDwKBwKG13y85i4oKqbDyoOEbVEHyU8U3yDwbm1Lx3wlF8C221bzFHwCwNwDwjouxK2i2y1sDw9-&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25595&lsd=XBGCglH3K63SPddlSyNKgf&__aaid=0&__bid=745415083846542&__spin_r=1010574318&__spin_b=trunk&__spin_t=1703232934&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=AccountQualityHubAssetOwnerViewQuery&variables=%7B%22assetOwnerId%22%3A%22' +
                _0x33f1ef +
                '%22%7D&server_timestamps=true&doc_id=24196151083363204',
            },
          )
          const _0x964a68 = await _0x1d485f.json
          const _0x50c6f0 =
            _0x964a68.data.assetOwnerData.advertising_restriction_info.additional_parameters
              .paid_actor_root_appeal_container_id
          const _0x38e61e =
            _0x964a68.data.assetOwnerData.advertising_restriction_info.restriction_type
          const _0x11e128 = await fetch2(
            'https://business.facebook.com/accountquality/ufac/?entity_id=' +
              _0x33f1ef +
              '&paid_actor_root_appeal_container_id=' +
              _0x50c6f0 +
              '&entity_type=3&_callFlowletID=2181&_triggerFlowletID=2181',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                '__usid=6-Tsc6xu718a07sn%3APsc6xui6pgn2f%3A0-Asc6xtp1nh4rnc-RV%3D6%3AF%3D&session_id=15e5a69ec0978238&__aaid=0&__bid=' +
                _0x33f1ef +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=u&__hs=19832.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1012906458&__s=9ubr7j%3Arv9koe%3Ads4ihh&__hsi=7359564425697670285&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhe5UkBwCwpUnCG6UmCyEgwjojyUW3qi4FoixWE-1txaczES2Sfxq4U5i486C6EC8yEScx60C9EcEixWq3i2q5E6e2qq1eCBBwLjzu2SmGxBa2dmm3mbK6U8o7y78jCgOUa8lwWxe4oeUuyo462mcwuEnw8ScwgECu7E422a3Fe6rwiolDwFwBgak48W2e2i3mbgrzUiwExq1yxJUpx2awCx6i8wxK2efK2W1dx-q4VEhG7o4O1fwwxefzobEaUiwm8Wubwk8Sq6UfEO32fxiFUd8bGwgUy1kx6bCyVUCcG2-qaUK2e0UFU2RwrU6CiVo884KeCK2q362u1dxW6U98a85Ou0DU7i1Tw&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25352&lsd=MPaEvH-IKd3rimyUrjtr5C&__spin_r=1012906458&__spin_b=trunk&__spin_t=1713532122&__jssesw=1',
              method: 'POST',
            },
          )
          const _0x4e88c4 = JSON.parse(_0x11e128.text.replace('for (;;);', ''))
          const _0x2722ef = _0x4e88c4.payload.enrollment_id
          if (_0x2722ef) {
            _0x5c1bcd(
              _0x33f1ef +
                '|https://www.facebook.com/checkpoint/1501092823525282/' +
                _0x2722ef +
                '|Dạng Die : ' +
                _0x38e61e,
            )
            _0x1aa26f = true
            _0x486d5e = _0x2722ef
          }
        }
      } catch (_0xa931d2) {
        console.log(_0xa931d2)
      }
      if (!_0x1aa26f) {
        _0x5c1bcd('Lấy link kháng BM thất bại')
      }
      _0x3f82be(_0x486d5e)
    })
  }
  outBm(_0x40b858) {
    return new Promise(async (_0x1bb02a, _0x5873aa) => {
      try {
        const _0x5b25b5 = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            fb.uid +
            '/businesses?access_token=' +
            fb.accessToken +
            '&__cppo=1',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=path%3A%2F' +
              fb.uid +
              '%2Fbusinesses&_reqSrc=adsDaoGraphDataMutator&business=' +
              _0x40b858 +
              '&endpoint=%2F' +
              fb.uid +
              '%2Fbusinesses&locale=vi_VN&method=delete&pretty=0&suppress_http_code=1&userID=' +
              fb.uid +
              '&version=17.0&xref=f2e80f8533bb1f4',
          },
        )
        const _0x3bad23 = _0x5b25b5.json
        if (_0x3bad23.success) {
          _0x1bb02a()
        } else {
          _0x5873aa()
        }
      } catch {
        _0x5873aa()
      }
    })
  }
  cancelPending(_0x471e38, _0x4b2b1a) {
    return new Promise(async (_0x9b503e, _0x4cf21e) => {
      try {
        const _0x2e485f = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            _0x471e38 +
            '/pending_users?access_token=' +
            fb.accessToken +
            '&__cppo=1&_reqName=object%3Abusiness%2Fpending_users&_reqSrc=BusinessConnectedPendingUsersStore.brands&date_format=U&fields=%5B%22id%22%2C%22role%22%2C%22email%22%2C%22decrypted_email%22%2C%22invite_link%22%2C%22invited_user_type%22%2C%22status%22%2C%22permitted_business_account_task_ids%22%2C%22sensitive_action_reviews%22%5D&limit=9999&locale=vi_VN&method=get&pretty=0&sort=name_ascending&suppress_http_code=1&xref=f0e174657d4c29859&_flowletID=1&_triggerFlowletID=2',
        )
        const _0x1204ac = _0x2e485f.json
        const _0x13d494 = _0x1204ac.data.map((_0x50d316) => _0x50d316.id)
        if (_0x13d494.length > 0) {
          const _0x191d78 = _0x1204ac.data.length
          let _0x242510 = 0
          const _0x4e6858 = []
          const _0xb176a9 = (_0x51e40a) => {
            return new Promise(async (_0x31873f, _0x12141b) => {
              try {
                const _0x15194e = await fetch2(
                  'https://graph.facebook.com/v17.0/' +
                    _0x51e40a +
                    '?access_token=' +
                    fb.accessToken +
                    '&__cppo=1&_flowletID=2480&_triggerFlowletID=2480',
                  {
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abusiness_role_request&_reqSrc=UserServerActions.brands&locale=vi_VN&method=delete&pretty=0&suppress_http_code=1&xref=f0067a98f89047e57',
                    method: 'POST',
                    mode: 'cors',
                  },
                )
                const _0x4463f6 = _0x15194e.json
                if (_0x4463f6.success) {
                  _0x242510++
                }
              } catch {}
              _0x31873f()
            })
          }
          _0x4b2b1a('Đang hủy ' + _0x191d78 + ' lời mời')
          for (let _0x1a4115 = 0; _0x1a4115 < _0x13d494.length; _0x1a4115++) {
            const _0x5151fc = _0x13d494[_0x1a4115]
            _0x4e6858.push(_0xb176a9(_0x5151fc))
          }
          await Promise.all(_0x4e6858)
          _0x4b2b1a('Hủy thành công ' + _0x242510 + '/' + _0x191d78 + ' lời mời')
          _0x9b503e()
        } else {
          _0x4b2b1a('Không có lời mời')
          _0x4cf21e()
        }
      } catch {
        _0x4b2b1a('Hủy lời mời thất bại')
        _0x4cf21e()
      }
    })
  }
  createAdAccount2(_0xcb2334, _0x3f37fd, _0x3d9dbd, _0x5189bf, _0x5c7c5e) {
    return new Promise(async (_0x293bec, _0x3ab36b) => {
      try {
        const _0x1e1ed1 = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            _0xcb2334 +
            '/adaccount?access_token=' +
            fb.accessToken +
            '&_callFlowletID=6343&_triggerFlowletID=6343',
          {
            headers: {
              accept: '*/*',
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abrand%2Fadaccount&_reqSrc=AdAccountActions.brands&ad_account_created_from_bm_flag=true&currency=' +
              _0x3f37fd +
              '&end_advertiser=' +
              _0x5c7c5e +
              '&invoicing_emails=%5B%5D&locale=vi_VN&media_agency=UNFOUND&method=post&name=' +
              _0x5189bf +
              '&partner=UNFOUND&po_number=&pretty=0&suppress_http_code=1&timezone_id=' +
              _0x3d9dbd +
              '&xref=f050d1e55a85bee6d',
            method: 'POST',
          },
        )
        const _0x156e3d = _0x1e1ed1.json
        if (_0x156e3d.account_id) {
          _0x293bec()
        } else {
          _0x3ab36b()
        }
      } catch (_0x5b5aab) {
        console.log(_0x5b5aab)
        _0x3ab36b()
      }
    })
  }
  createAdAccount(_0x4c079e, _0x54af42, _0x44c399, _0x14dcf5) {
    return new Promise(async (_0x27ca47, _0x5524a3) => {
      try {
        const _0x1a9699 = await fbbm.getMainBmAccounts(_0x4c079e)
        const _0x5a0609 = await fetch2(
          'https://z-p3-graph.facebook.com/v17.0/' +
            _0x4c079e +
            '/adaccount?access_token=' +
            fb.accessToken +
            '&__cppo=1',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abrand%2Fadaccount&_reqSrc=AdAccountActions.brands&ad_account_created_from_bm_flag=true&currency=' +
              _0x54af42 +
              '&end_advertiser=' +
              _0x4c079e +
              '&invoicing_emails=%5B%5D&locale=vi_VN&media_agency=UNFOUND&method=post&name=' +
              encodeURIComponent(_0x14dcf5) +
              '&partner=UNFOUND&po_number=&pretty=0&suppress_http_code=1&timezone_id=' +
              _0x44c399 +
              '&xref=f240a980fd9969',
          },
        )
        const _0x28a125 = _0x5a0609.json
        if (_0x28a125.account_id) {
          try {
            await fetch2(
              'https://business.facebook.com/business/business_objects/update/permissions/',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                body:
                  'asset_ids[0]=' +
                  _0x28a125.account_id +
                  '&asset_type=ad-account&business_id=' +
                  _0x4c079e +
                  '&roles[0]=151821535410699&roles[1]=610690166001223&roles[2]=864195700451909&roles[3]=186595505260379&user_ids[0]=' +
                  _0x1a9699.id +
                  '&__user=' +
                  fb.uid +
                  '&__a=1&__req=t&__hs=19662.BP%3Abrands_pkg.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1009606682&__s=2zimvz%3A8blg31%3A9mxlfz&__hsi=7296403044252789266&__dyn=7xeUmxa2C5rgydwCwRyU8EKnFG5UkBwCwgE98nCG6UmCyE4a6UjyUV0RAAzpoixW4E5S7UWdwJwCwq8gwqoqyoyazoO4o461twOxa7FEd89EmwoU9FE4WqbwLjzobVqG6k2ppUdoKUrwxwu8sxe5bwExm3G2m3K2y3WElUScwuEnw8ScwgECu7E422a3Fe6rwnVU8FE9k2B12ewi8doa84K5E6a6S6UgyHwyx6i8wxK2efK7UW1dxacCxeq4o884O1fAwLzUS2W2K4E5yeDyU52dCgqw-z8K2ifxiFVoa9obGwSz8y1kx6bCyVUCfwLCyKbwzweau1Hwio4m2C4e1mAK2q1bzFHwCwmo4S7ErwAwEwn82Dw&__csr=&fb_dtsg=' +
                  fb.dtsg +
                  '&jazoest=25484&lsd=M7V3k5fl_jTcOKm-KVKVe3&__aaid=0&__bid=' +
                  _0x4c079e +
                  '&__spin_r=1009606682&__spin_b=trunk&__spin_t=1698826216&__jssesw=1',
              },
            )
          } catch {}
          _0x27ca47(_0x28a125.account_id)
        } else {
          _0x5524a3()
        }
      } catch (_0x2983d1) {
        console.log(_0x2983d1)
        _0x5524a3()
      }
    })
  }
  removePartners(_0x2e5978, _0x38f68d) {
    return new Promise(async (_0x505b5f, _0x1ac19c) => {
      try {
        const _0x442cce = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=32647&_triggerFlowletID=32644&qpl_active_e2e_trace_ids=',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__aaid=0&__bid=' +
              _0x38f68d +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=6h&__hs=20243.HYP%3Abizweb_comet_pkg.2.1...0&dpr=1&__ccg=GOOD&__rev=1023482657&__s=z05ic9%3Aa1ibox%3A36319m&__hsi=7512115286616801705&__dyn=7xeUmxa2C6oCdwn8K2Wmhe5UkBwCwpUnCwRCwqojyUW3qi4FoiwNwnof8bo9E7C1FxG9xedz8hw9-3a36q3i2q5E2aCwjFEK3idwLy8sg9BwZyU460BoabwEwk89oeUa8465UScwuE2Bz84a9DxW10wywWAxCUkwv89k2C1FwRwEwiUmwoErorx2aK2a4p8aHwzzXwKwjohzpEjCx64oW2G261fwwxefyrwmEiwm8WubU4WdCgqw-z8c8-5ayrwKwKG13y86qbxa4omwECyKbwzweau0Jo6-3u36iU9Eak22eCK2q5UpwDwjouxK2i2x0gEjADwOwuE6q7E5y1rwGwxwkU8888twv83aoiw&__csr=gRf4ghh4l2Qpf4kwEx7W5uAARAYyh74iaZQjalWiKDjORRYDQBTHdvGLEF7h92Na7TsBbQTt9JcSOl8AO8CGnaAKD9iKP4dfAFJrZRiim9aRWGKFiye8GHzXyaH8_AyfijAFaGuqDQZGnFQbCiyeqCZpuiqVuRhemmGtfAAGK-KA8gOKuAXJkuSVAmp4hfiBAgJaaz-UyrgBetoHGqrWRVfBXiG9AAyenF3F6aA88ByWXGvAVF-cDAmjunRWCiDFQF9ESdK9DGcxWtt3--q8AiKUg8U9axzGVVAKH-h2EylfymaghKiiubxy2mi9Jt2FKqnxmczHAwyy-EF13jUWqh5y-fDAyEgyUhGiaUOdG4-bxilQ698nwmUC2i8zUyeAzokCwAUK7FoC9Cwl8cGx-68dEd8co4O14wJiiL_zp4aG-mcK3SXotF0cCC0qSlwbK1wZ03ao2fAw7HwWCkgFoNiRIdwm8c9k0yhy8Ea65CcA2Ekg1lUW161l4tr2M0lWwSwRADQ8w3BU8Uog0PLci0e4w5vKu5V5xC1igkyFm15ih84m0m7g24zK2-2ygwy0bN-exm7o8pVEjPPqvG9i66bdhE9bwww8Qx8x2Xa2e3a091B9a0avw1Elw1p609qw3IWDa2q0Oo5l1cw-2x11G4MF2M0EZ3Ql02fP1y1jg5q5hkw0PilN2xdh99ca02IrFy4CDJkElAbaQ2MgzRC60Jw3y40p93E0KAWy820xyay8lwJCqp80Cqpw37EBam4VVah6aV404D8aE36ydw2RBg1YE0NLG04dpngS1-Fdi0bCfwmUhwFyU8o0mbyd011agE0b7Am2Jwi8mxeUR1aUpc0aswfK0p20gWUjx2ew0EJw8y8yU1tU0xm2yFtwYUjU0Y608qw3U84m0v6&__comet_req=11&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25490&lsd=IFZkpjmv_hCtLPDyBbvA4c&__spin_r=1023482657&__spin_b=trunk&__spin_t=1749050637&__jssesw=1&__crn=comet.bizweb.BusinessCometBizSuiteSettingsBMPartnersRoute&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BizKitSettingsRemoveBusinessPartnerMutation&variables=%7B%22businessID%22%3A%22' +
              _0x38f68d +
              '%22%2C%22partnerBusinessID%22%3A%22' +
              _0x2e5978 +
              '%22%7D&server_timestamps=true&doc_id=9742323712551273',
            method: 'POST',
          },
        )
        const _0x5f1c3a = _0x442cce.text
        if (_0x5f1c3a.includes(_0x2e5978)) {
          _0x505b5f(true)
        } else {
          _0x505b5f(false)
        }
      } catch (_0x467018) {
        console.log(_0x467018)
        _0x505b5f(false)
      }
    })
  }
  removeAccount2(_0x5146a3, _0x3aa229) {
    return new Promise(async (_0x19826c, _0x32f633) => {
      try {
        const _0x14769f = await fetch2(
          'https://business.facebook.com/business/asset_onboarding/business_remove_admin/',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              'business_id=' +
              _0x3aa229 +
              '&admin_id=' +
              _0x5146a3 +
              '&session_id=2e942068-0721-40b7-a912-4f89f3a72b0e&event_source=PMD&__aaid=0&__bid=' +
              _0x3aa229 +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=8&__hs=20010.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1017311549&__s=n0exl1%3An9jvpp%3Af8agky&__hsi=7425567271958688187&__dyn=7xeUmF3EfXolwCwRyUbFp62-m2q3K2K5U4e1Fx-ewSxu68uxa0z8S2S0zU2EwBx60DU4m0nCq1eK2K8xN0CgC11x-7U7G78jxy1VwBwXwEwpU1eE4a4o5-0ha2l2Utg6y1uwiU7y3G48comwkE-3a0y83mwkE5G4E6u4U5W0HUkyE16Ec8-3qazo8U3ywbS1Lwqp8aE5G360NE1UU7u1rwGwbu&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25473&lsd=lAqaEcMivHToYG0Fq_qw4b&__spin_r=1017311549&__spin_b=trunk&__spin_t=1728899607&__jssesw=1',
          },
        )
        const _0x7d48d4 = _0x14769f.text
        if (_0x7d48d4.includes('error')) {
          _0x19826c(true)
        } else {
          _0x19826c(false)
        }
      } catch (_0x2367fb) {
        console.log(_0x2367fb)
        _0x19826c(false)
      }
    })
  }
  removeAccount(_0x4e6187, _0x3376d5, _0x118135) {
    return new Promise(async (_0x112e79, _0x416852) => {
      try {
        const _0xc27b8a = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=4255',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsp3zazukdpi%3APsp3zay15biznw%3A0-Asp3z7rm1c7vw-RV%3D6%3AF%3D&__aaid=0&__bid=' +
              _0x3376d5 +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=q&__hs=20083.HYP%3Abizweb_comet_pkg.2.1.0.0.0&dpr=1&__ccg=GOOD&__rev=1019078593&__s=h7tq5u%3A0xfovi%3Axmbuqq&__hsi=7452752022536676552&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU29zEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R04zwIwuo9oeUa8462mcw5MypU5-0Bo7O2l0Fwqo5W1yw9O48comwkE-UbE7i4UaEW2G261fwwwJK1qxa1ozEjU4Wdwoo4S5ayouxe0hqfwLCyKbw46wbS1LwTwNAK2q0z8co9U4S7E6C13www4kxW1owmUaEeE5K22&__csr=glgDFT5ELRkaOWNmx5aYHnRS-yRsGTp5n-B9uhR8DThmCDNfAjfqFy9dtmuG_HjTF8yVeW-DO__qlkldyti9pbCQ-mFfA-hQlkGAiXiCp4F9LJ2AVRSWtQF5YHLABGV4GGil2J6hdipWyWLhk8huHF7XAX-EzhHQeiFVFJ5AG8Gl4KluuGGqQEWqihABiDoCVHAKF2eq4qGZ4CmiXzFp8ydGm8AgymSVujcECu4agKmrCWCHxDCmA58Km27Z1amXy9oJe7oG5oZ1oMyFu5oWnAz88e4AbG8yVEF1i6EKq4XwMwzxa6EGeyk2KUuF5K6UbEgBwTy8sx60GF8O59o9VU762e08pw3-QQV4ufjg0jPgmw8w2MbxZ8Yg5Q1pxolo5G1dg0ncw4dw57wioeohyHaV20vUsw3EVUswe20KU3BK0oC2G1fw5Oxu5u16wGx2rw4da01X7w3qE0fJz0aW2O0km0dJw26Vnw6ng2da1Mg0kzw1Yx6cewKwsk3Xa680jCw3NXTg0fsE1o40d2O01aq1Lw14x03YpU0MR02-U2CwGDDo4J03iU20g2GxK&__comet_req=11&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25731&lsd=3lg94FqqYWrhBLOzqUqzlY&__spin_r=1019078593&__spin_b=trunk&__spin_t=1735229050&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=GetBusinessSensitiveActionEnumQuery&variables=%7B%22reviewParams%22%3A%7B%22action_type%22%3A%22BUSINESS_REMOVE_USER%22%2C%22business_id%22%3A%22' +
              _0x3376d5 +
              '%22%2C%22remove_user_params%22%3A%7B%22target_user_id%22%3A%22' +
              _0x4e6187 +
              '%22%7D%7D%2C%22roleRequestId%22%3A%22%22%2C%22isNotAddAdmin%22%3Atrue%7D&server_timestamps=true&doc_id=7112725228756755',
            method: 'POST',
          },
        )
        const _0xc82869 = _0xc27b8a.text
        if (_0xc82869.includes('"review_process":"NONE"')) {
          const _0x57ec24 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=4297',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsp3zuu16muqan%3APsp3zuu1y3hh81%3A0-Asp3z7rm1c7vw-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                _0x3376d5 +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=u&__hs=20083.HYP%3Abizweb_comet_pkg.2.1.0.0.0&dpr=1&__ccg=GOOD&__rev=1019078593&__s=jegcdv%3A6i9kbw%3As98h1x&__hsi=7452755096790988499&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU29zEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R04zwIwuo9oeUa8462mcw5MypU5-0Bo7O2l0Fwqo5W1yw9O48comwkE-UbE7i4UaEW2G261fwwwJK1qxa1ozEjU4Wdwoo4S5ayouxe0hqfwLCyKbw46wbS1LwTwNAK2q0z8co9U4S7E6C13www4kxW1owmUaEeE5K22&__csr=glgDFT5ELRkaOWNmx5aYHnRS-yRsGTp5n-B9uhR8DThmCDNfAjfqFy9dtmuG_HjTF8yVeW-DO__qlkldyti9pbCQ-mFfA-hQlkGAiXiCp4F9LJ2AVRSWtQF5YHLABGV4GGil2J6hdipWyWLhk8huHF7XAX-EzhHQeiFVFJ5AG8Gl4KluuGGqQEWqihABiDoCVHAKF2eq4qGZ4CmiXzFp8ydGm8AgymSVujcECu4agKmrCWCHxDCmA58Km27Z1amXy9oJe7oG5oZ1oMyFu5oWnAz88e4AbG8yVEF1i6EKq4XwMwzxa6EGeyk2KUuF5K6UbEgBwTy8sx60GF8O59o9VU762e08pw3-QQV4ufjg0jPgmw8w2MbxZ8Yg5Q1pxolo5G1dg0ncw4dw57wioeohyHaV20vUsw3EVUswe20KU3BK0oC2G1fw5Oxu5u16wGx2rw4da01X7w3qE0fJz0aW2O0km0dJw26Vnw6ng2da1Mg0kzw1Yx6cewKwsk3Xa680jCw3NXTg0fsE1o40d2O01aq1Lw14x03YpU0MR02-U2CwGDDo4J03iU20g2GxK&__comet_req=11&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25602&lsd=qst8LNj_XF01FbsYja7ruZ&__spin_r=1019078593&__spin_b=trunk&__spin_t=1735229766&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BizKitSettingsRemoveBusinessUserMutation&variables=%7B%22businessID%22%3A%22' +
                _0x3376d5 +
                '%22%2C%22businessUserID%22%3A%22' +
                _0x4e6187 +
                '%22%7D&server_timestamps=true&doc_id=24401670346098526',
              method: 'POST',
            },
          )
          const _0x14e58f = _0x57ec24.text
          if (_0x14e58f.includes('"removed_business_user_id":"' + _0x4e6187 + '"')) {
            _0x112e79(true)
          } else {
            _0x112e79(false)
          }
        } else if (_0x118135 && _0xc82869.includes('EMAIL_VERIFICATION')) {
          const _0xc9800c = await getNewEmail()
          const _0x323d2a = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=14254',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsp5238al5avw%3APsp523617ulfhv%3A0-Asp51sr4mptu7-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                _0x3376d5 +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=21&__hs=20084.BP%3Abrands_pkg.2.0.0.0.0&dpr=1&__ccg=GOOD&__rev=1019084625&__s=o7y020%3A72s3d7%3Ayv2miq&__hsi=7452967898814735127&__dyn=7xeUmxa2C5rgydwCwRyUbFp4Unxim2q1DxuqErxqqawgErxebzA3miidBxa7EiwnovzES2S2q1Ex21FxG9y8Gdz8hw9-3a4EuCwQwCxq0yFE4WqbwLjzobUyEpg9BDwRyXxK260BojxiUa8lwWwBwXwEw-G2mcwuEnw8ScwgECu7E422a3Fe6rwnVUao9k2B0q8doa84K5E6a6S6UgyHwyx6i2GU8U-UvzE4S4EOq4VEhwwwj84-i6UjzUS1qxa1ozFUK1gzo8EfEO32fxiEf8bGwgUy1CyUix6fwLCyKbwzweau0Jo6-4e1mAK2q1bzFHwCxu6o9U4S7ErwAwEg5Ku0hi1TwmUaEeE5K227o&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25388&lsd=tD-h8jfAcIJCp9QTA2mzVt&__spin_r=1019084625&__spin_b=trunk&__spin_t=1735279313&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=RequestBusinessRemoveUserReviewMutation&variables=%7B%22business_user_id%22%3A%22' +
                _0x4e6187 +
                '%22%2C%22verification%22%3A%22EMAIL_VERIFICATION%22%7D&server_timestamps=true&doc_id=6588385494564438',
              method: 'POST',
            },
          )
          const _0x53f9ab =
            _0x323d2a.json.data.xfb_business_settings_request_business_remove_user_review.id
          const _0x21c528 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=17812&_triggerFlowletID=17800',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsprjwxgxjbxt%3APsprkothunup6%3A0-Asprjldnfqxvs-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                _0x3376d5 +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=30&__hs=20096.HYP%3Abizweb_comet_pkg.2.1.0.0.0&dpr=1&__ccg=MODERATE&__rev=1019207539&__s=bwo10m%3A3ynzfz%3A8smij2&__hsi=7457479931389853262&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU29zEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R04zwIwuo9oeUa8462mcw4JwgECu1vw9m1YwBgao6C3m2y1bxq0D8gwNxq1izXwKwt8jwGzEaE8o4-222SU5G4E5yexfwjES1xwjokG9wOwem32fwLCyKbwzwea0Lo6-3u36iU9E2cxu6o9U4S7E6C13www4kxW1owmUaE2mwww&__csr=giMPbEIptgPcDmGskADjhbR9rZmHP8purlFR4FHOdYyQyRXmyrWaJKjiLQXV5mHJFOrKN2h5imnRRgDGBQjZaFExrJboDVD8sFidlKlbQV4-WH8JiF-DAJKBLmajADAKBHgjHoACiqcF2XyfAEGmXla-CHQVZ2F8XBFaJJ7CBChaGFrh9KaGrHABJ4nJ9d7DxSifFeqXhaGicyefF7Gu9CmHighQeyoDVeaGh7zQbz98S49oRbzFFk8Gay-UGiaG2IwyunVEnySeG22iUlz8a8C69UrVQ2yfg-8Biy8jGdwAzEhDDxuuiaAwCwMwjoOiUjxK1Iwwwi8b87mh03mU1rExehd5xS2h015Bw2uFc5iwlA1p1oze82Ud85S9y80gKw23jxq0KE8UME3BhExeqgw7i16G0bdw6qHw6Nw4KG0GpUgyoGm0xUrw6wghwDg5unxy0eXw0nio0hpw0iL981UFBo0j4Bw69Iw0Fu486501de0deg0hFghwDgaEF0r82ccmu5od80NW02iu9c06oE0jVg1880juBu08-w9S0biw2TE2AU0zkE3yg0Zt021Vk1igSvg1nk1DwWo0LG0g-3u&__comet_req=11&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25226&lsd=ZRF0ToV6zypnXO7gW8m6G6&__spin_r=1019207539&__spin_b=trunk&__spin_t=1736329852&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometIXTFacebookXfacBvTriggerRootQuery&variables=%7B%22input%22%3A%7B%22authenticatable_entity_id%22%3A%22' +
                _0x53f9ab +
                '%22%2C%22xfac_config%22%3A%22XFAC_BUSINESS_VERIFICATION_STANDALONE_EMAIL%22%2C%22xfac_appeal_type%22%3A%22BUSINESS_VERIFICATION_STANDALONE_EMAIL%22%2C%22business_verification_design_system%22%3A%22GEODESIC%22%2C%22business_verification_ui_type%22%3A%22BUSINESS_MANAGER_COMET%22%2C%22trigger_event_type%22%3A%22XFAC_BV_ENTRY%22%2C%22nt_context%22%3Anull%2C%22trigger_session_id%22%3A%22e81e7065-6d6e-4a26-8984-3e8bc7df09dd%22%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=8748278645220835',
              method: 'POST',
            },
          )
          const _0x57ecb8 = _0x21c528.json
          const _0x3a5734 = _0x57ecb8.data.ixt_xfac_bv_trigger.screen.view_model.serialized_state
          _0xc9800c.email =
            _0x57ecb8.data.ixt_xfac_bv_trigger.screen.view_model.content_renderer.advertiser_authenticity_email_challenge_screen.email_addresses[0]
          const _0x3045d2 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=15580',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsprjwxgxjbxt%3APsprkothunup6%3A0-Asprjldnfqxvs-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                _0x3376d5 +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=31&__hs=20096.HYP%3Abizweb_comet_pkg.2.1.0.0.0&dpr=1&__ccg=MODERATE&__rev=1019207539&__s=rjlsyf%3A3ynzfz%3A8smij2&__hsi=7457479931389853262&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU29zEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R04zwIwuo9oeUa8462mcw4JwgECu1vw9m1YwBgao6C3m2y1bxq0D8gwNxq1izXwKwt8jwGzEaE8o4-222SU5G4E5yexfwjES1xwjokG9wOwem32fwLCyKbwzwea0Lo6-3u36iU9E2cxu6o9U4S7E6C13www4kxW1owmUaE2mwww&__csr=giMPbEIptgPcDmGskADjhbR9rZmHP8purlFR4FHOdYyQyRXmyrWaJKjiLQXV5mHJFOrKN2h5imnRRgDGBQjZaFExrJboDVD8sFidlKlbQV4-WH8JiF-DAJKBLmajADAKBHgjHoACiqcF2XyfAEGmXla-CHQVZ2F8XBFaJJ7CBChaGFrh9KaGrHABJ4nJ9d7DxSifFeqXhaGicyefF7Gu9CmHighQeyoDVeaGh7zQbz98S49oRbzFFk8Gay-UGiaG2IwyunVEnySeG22iUlz8a8C69UrVQ2yfg-8Biy8jGdwAzEhDDxuuiaAwCwMwjoOiUjxK1Iwwwi8b87mh03mU1rExehd5xS2h015Bw2uFc5iwlA1p1oze82Ud85S9y80gKw23jxq0KE8UME3BhExeqgw7i16G0bdw6qHw6Nw4KG0GpUgyoGm0xUrw6wghwDg5unxy0eXw0nio0hpw0iL981UFBo0j4Bw69Iw0Fu486501de0deg0hFghwDgaEF0r82ccmu5od80NW02iu9c06oE0jVg1880juBu08-w9S0biw2TE2AU0zkE3yg0Zt021Vk1igSvg1nk1DwWo0LG0g-3u&__comet_req=11&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25226&lsd=ZRF0ToV6zypnXO7gW8m6G6&__spin_r=1019207539&__spin_b=trunk&__spin_t=1736329852&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometFacebookIXTNextMutation&variables=%7B%22input%22%3A%7B%22advertiser_authenticity_email_challenge%22%3A%7B%22email_address%22%3A%22' +
                encodeURIComponent(_0xc9800c.email) +
                '%22%2C%22org_id%22%3A%22' +
                _0x53f9ab +
                '%22%2C%22serialized_state%22%3A%22' +
                _0x3a5734 +
                '%22%2C%22website%22%3A%22%22%7D%2C%22actor_id%22%3A%22' +
                fb.uid +
                '%22%2C%22client_mutation_id%22%3A%223%22%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=8466997430071660',
              method: 'POST',
            },
          )
          const _0x1001f4 = _0x3045d2.json.data.ixt_screen_next.view_model.serialized_state
          let _0xcdc78d = false
          for (let _0x29dadd = 0; _0x29dadd < 12; _0x29dadd++) {
            try {
              const _0x54654d = (await getEmailInbox(_0xc9800c.id)).filter(
                (_0x1487cf) => _0x1487cf.email === 'notification@facebookmail.com',
              )
              if (_0x54654d[0]) {
                _0xcdc78d = _0x54654d[0].content.match(/([0-9]{6})/)[0]
                break
              }
            } catch {}
            await delayTime(2000)
          }
          if (_0xcdc78d) {
            const _0x6ac5be = await fetch2(
              'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=16772',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  'av=' +
                  fb.uid +
                  '&__usid=6-Tsp5238al5avw%3APsp523617ulfhv%3A0-Asp51sr4mptu7-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                  _0x3376d5 +
                  '&__user=' +
                  fb.uid +
                  '&__a=1&__req=25&__hs=20084.BP%3Abrands_pkg.2.0.0.0.0&dpr=1&__ccg=GOOD&__rev=1019084625&__s=bh7b95%3A72s3d7%3Ayv2miq&__hsi=7452967898814735127&__dyn=7xeUmxa2C5rgydwCwRyUbFp4Unxim2q1DxuqErxqqawgErxebzA3miidBxa7EiwnovzES2S2q1Ex21FxG9y8Gdz8hw9-3a4EuCwQwCxq0yFE4WqbwLjzobUyEpg9BDwRyXxK260BojxiUa8lwWwBwXwEw-G2mcwuEnw8ScwgECu7E422a3Fe6rwnVUao9k2B0q8doa84K5E6a6S6UgyHwyx6i2GU8U-UvzE4S4EOq4VEhwwwj84-i6UjzUS1qxa1ozFUK1gzo8EfEO32fxiEf8bGwgUy1CyUix6fwLCyKbwzweau0Jo6-4e1mAK2q1bzFHwCxu6o9U4S7ErwAwEg5Ku0hi1TwmUaEeE5K227o&__csr=&fb_dtsg=' +
                  fb.dtsg +
                  '&jazoest=25388&lsd=tD-h8jfAcIJCp9QTA2mzVt&__spin_r=1019084625&__spin_b=trunk&__spin_t=1735279313&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometFacebookIXTNextMutation&variables=%7B%22input%22%3A%7B%22advertiser_authenticity_enter_email_code%22%3A%7B%22check_id%22%3Anull%2C%22code%22%3A%22' +
                  _0xcdc78d +
                  '%22%2C%22serialized_state%22%3A%22' +
                  _0x1001f4 +
                  '%22%7D%2C%22actor_id%22%3A%22' +
                  fb.uid +
                  '%22%2C%22client_mutation_id%22%3A%223%22%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=8680151995437244',
                method: 'POST',
              },
            )
            const _0x1b2cf3 = _0x6ac5be.json.data.ixt_screen_next.view_model.serialized_state
            if (_0x1b2cf3) {
              _0x112e79(true)
            } else {
              _0x112e79(false)
            }
          } else {
            _0x112e79(false)
          }
        } else {
          _0x112e79(false)
        }
      } catch (_0x50d038) {
        console.log(_0x50d038)
        _0x112e79(false)
      }
    })
  }
  upgradeRole(_0x2f5ce8, _0x31cd23) {
    return new Promise(async (_0x2d0421, _0x189866) => {
      try {
        const _0x38af5b = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=3129',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsmxjub117xs4l%3APsmxjw7sgqyks%3A0-Asmxjub15hrye4-RV%3D6%3AF%3D&__aaid=0&__bid=' +
              _0x2f5ce8 +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=s&__hs=20041.BP%3Abrands_pkg.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1018195279&__s=e39j42%3Ax5tt51%3Af3d1fd&__hsi=7437036134981410251&__dyn=7xeUmxa2C5rgydwCwRyUbFp4Unxim2q1DxuqErxqqawgErxebzA3miidBxa7EiwnovzES2S2q1Ex21FxG9y8Gdz8hw9-3a4EuCwQwCxq0yFE4WqbwLjzobUyEpg9BDwRyXxK260BojxiUa8lwWwBwXwEw-G2mcwuEnw8ScwgECu7E422a3Fe6rwnVUao9k2B0q8doa84K5E6a6S6UgyHwyx6i2GU8U-UvzE4S4EOq4VEhwwwj84-i6UjzUS1qxa1ozFUK1gzo8EfEO32fxiEf8bGwgUy1kx6bxa4o-2-qaUK2e0UFU2RwrUgU5qiU9E4KeCK2q5UpwDwjouxK2i2x0mVU1587u1rwGw9q227o&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25465&lsd=swInxA34gvK9OSwF57p5Lb&__spin_r=1018195279&__spin_b=trunk&__spin_t=1731569910&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BusinessAccountPermissionTasksForUserModalMutation&variables=%7B%22businessUserID%22%3A%22' +
              _0x31cd23 +
              '%22%2C%22business_account_task_ids%22%3A%5B%22926381894526285%22%2C%22603931664885191%22%2C%221327662214465567%22%2C%22862159105082613%22%2C%226161001899617846786%22%2C%221633404653754086%22%2C%22967306614466178%22%2C%222848818871965443%22%2C%22245181923290198%22%2C%22388517145453246%22%5D%2C%22isUnifiedSettings%22%3Afalse%7D&server_timestamps=true&doc_id=7706501459456230',
            method: 'POST',
          },
        )
        const _0x4e8659 = _0x38af5b.json
        if (!_0x4e8659.errors) {
          _0x2d0421()
        } else {
          _0x189866()
        }
      } catch {
        _0x189866()
      }
    })
  }
  downgradeRole(_0x1051c2, _0x3c27e8) {
    return new Promise(async (_0x40de80, _0x99584d) => {
      try {
        const _0x185674 = await fetch2(
          'https://business.facebook.com/api/graphql/?_flowletID=11539&_triggerFlowletID=11539',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsasm111tcohsq%3APsasm0z1lqubxp%3A0-Asasjvisjl1bu-RV%3D6%3AF%3D&__aaid=0&__bid=' +
              _0x1051c2 +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=11&__hs=19805.BP%3Abrands_pkg.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1012269933&__s=0qa5cy%3Aa01ig3%3Ahy5hkd&__hsi=7349479331121257233&__dyn=7xeUmxa2C5rgydwCwRyU8EKmhe5UkBwCwpUnCG6UmCyEgwNxK4UKegdp98Sm4Euxa1txaczES2S2q4U5i486C6EC8yEScx60DUcEixWq3i2q5E6e2qq1eCyUbQUTwJBGEpiwzlBwRyXxK261UxO4VAcK2y5oeEjx63K2y3WE9oO1Wxu0zoO12ypUuwg88EeAUpK1vDwyCwBgak48W2e2i3mbgrzUeUmwoErorx2aK2a4p8y26U8U-UvzE4S4EOq4VEhwwwj84-i6UjzUS2W2K4E5yeDyU52dCxK3WcwMzUkGu3i2WEdEO8wl8hyVEKu9zawLCyKbwzweau1Hwio6-4e1mAK2q1bzFHwCwNwDwjouxK2i2y1sDw9-1Qw&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25471&lsd=e6ML1zklGHVeAjzT6hdE8_&__spin_r=1012269933&__spin_b=trunk&__spin_t=1711184003&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BusinessAccountPermissionTasksForUserModalMutation&variables=%7B%22businessUserID%22%3A%22' +
              _0x3c27e8 +
              '%22%2C%22business_account_task_ids%22%3A%5B%22926381894526285%22%5D%2C%22isUnifiedSettings%22%3Afalse%7D&server_timestamps=true&doc_id=7337443546298507',
            method: 'POST',
          },
        )
        const _0x2492ef = _0x185674.json
        if (!_0x2492ef.errors) {
          _0x40de80()
        } else {
          _0x99584d()
        }
      } catch {
        _0x99584d()
      }
    })
  }
  getBmAccounts(_0x2ef39b) {
    return new Promise(async (_0x30a440, _0x43d820) => {
      try {
        try {
          const _0x539b56 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=1',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'POST',
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsp3s4f1p0knjh%3APsp3s511vi2414%3A0-Asp3s4fwu59j7-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                _0x2ef39b +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=d&__hs=20083.HYP%3Abizweb_comet_pkg.2.1.0.0.0&dpr=1&__ccg=EXCELLENT&__rev=1019078392&__s=6a6pj6%3Azibb7t%3Awwnadh&__hsi=7452712138881246882&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU29zEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R04zwIwuo9oeUa8462mcw5MypU5-0Bo7O2l0Fwqo5W1yw9O48comwkE-UbE7i4UaEW2G261fwwwJK1qxa1ozEjU4Wdwoo4S5ayocE15E-2-qaUK0gq0Lo6-3u36iU9E2cwNwDwjouwqo4e220hi7E5y1rwGwWwmU88&__csr=gR7OhcCDsmy_lhQQJsRW4kHOJvnrWblOHtAlvWkBV7kyvt5rivP-hcZGC8ARRpWH-KjuABACKLFJ6BSBl5joDlJpbCQ-FpfA-hQlrGhbJarAiAC-QbKttKDtahvavABGVpqABgHhAjkCayWLhk9DGWh-Ve_G8QqZ3AGuqrhpayaBhbBnDGGCJaeCAAp9kFS9KqUyFdeq4prQippbKeBAxCm8AgymS9VcOx64agKmrCWCHxDCGA58Km27Z1amXy9oJe7oG5oZ1pUCFUlzFV8O23x92UKbCyA12xeUc88UixGazEB0HK7GwCwKx2m3u8xO4o2GAz8kBwDDwso8U0xC0fXjjAhUZd01fd1q0y0b0K7QzN0ng5C5xlwmE4R01sO0gS0ku19wVx6aIHA81_xO0ezDxO0U82XwemU1yoaE4-0na5UlU4q2G49K0gQE028Ow0-Sc0HEb81ho0SS08rBu0pt08QE7101ie07O4oMW2W1NgfIEow1eq0f7Lt00ZOw5wg0Qb804FE6-04i40fNDw33k0bXwaq2GutwiQ0dbw810aG6U&__comet_req=11&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25752&lsd=' +
                fb.lsd +
                '&__spin_r=1019078392&__spin_b=trunk&__spin_t=1735219764&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BizKitSettingsPeopleTableListPaginationQuery&variables=%7B%22asset_types%22%3Anull%2C%22businessAccessType%22%3A%5B%5D%2C%22businessUserStatusType%22%3A%5B%5D%2C%22cursor%22%3Anull%2C%22first%22%3A13%2C%22isBulkUserRemovalEnabled%22%3Afalse%2C%22isUnifiedSettings%22%3Atrue%2C%22orderBy%22%3A%22MOST_RECENTLY_CREATED%22%2C%22permissions%22%3A%5B%5D%2C%22searchTerm%22%3Anull%2C%22id%22%3A%22' +
                _0x2ef39b +
                '%22%7D&server_timestamps=true&doc_id=28428357753421675',
            },
          )
          const _0x23d7a8 = _0x539b56.json
          _0x30a440(
            _0x23d7a8.data.node.business_users_and_invitations.edges
              .filter((_0x34f8d8) => !_0x34f8d8.nameColumn.invited_email)
              .map((_0x581d12) => _0x581d12.nameColumn),
          )
        } catch {
          const _0x5a7be2 = await fetch2(
            'https://graph.facebook.com/v17.0/' +
              _0x2ef39b +
              '/business_users?access_token=' +
              fb.accessToken +
              '&_reqName=object%3Abusiness%2Fbusiness_users&_reqSrc=BusinessConnectedConfirmedUsersStore.brands&date_format=U&fields=%5B%22email%22%2C%22expiry_time%22%2C%22first_name%22%2C%22finance_permission%22%2C%22developer_permission%22%2C%22ip_permission%22%2C%22partner_center_admin_permission%22%2C%22partner_center_analyst_permission%22%2C%22partner_center_education_permission%22%2C%22partner_center_marketing_permission%22%2C%22partner_center_operations_permission%22%2C%22last_name%22%2C%22manage_page_in_www%22%2C%22marked_for_removal%22%2C%22pending_email%22%2C%22role%22%2C%22two_fac_status%22%2C%22is_two_fac_blocked%22%2C%22is_trusted_approver%22%2C%22was_integrity_demoted%22%2C%22sso_migration_status%22%2C%22backing_user_type%22%2C%22business_role_request.fields(creation_source.fields(name)%2Ccreated_by.fields(name)%2Ccreated_time%2Cupdated_time)%22%2C%22transparency_info_seen_by%22%2C%22work_profile_pic%22%2C%22is_pending_integrity_review%22%2C%22is_ineligible_developer%22%2C%22last_active_time%22%2C%22permitted_business_account_task_ids%22%2C%22sensitive_action_reviews%22%2C%22name%22%5D&limit=9999&locale=en_GB&method=get&pretty=0&sort=name_ascending&suppress_http_code=1&xref=f1ef8e0e120281148&_callFlowletID=0&_triggerFlowletID=1',
          )
          const _0x5ddd0f = _0x5a7be2.json
          _0x30a440(_0x5ddd0f.data)
        }
      } catch (_0x34b712) {
        _0x43d820(_0x34b712)
      }
    })
  }
  getMainBmAccounts(_0x4b12ae) {
    return new Promise(async (_0x10c19f, _0x18886e) => {
      try {
        const _0x52f0db = await fetch2(
          'https://business.facebook.com/settings/info?business_id=' + _0x4b12ae,
        )
        const _0x4ff146 = _0x52f0db.text
        let _0x492b08 = _0x4ff146.match(/(?<=\"business_user_id\":\")[^\"]*/g)
        let _0x3b1e2e = _0x4ff146.match(/(?<=\"first_name\":\")[^\"]*/g)
        let _0x6247b9 = _0x4ff146.match(/(?<=\"last_name\":\")[^\"]*/g)
        if (_0x492b08[0]) {
          const _0x4d861d = {
            id: _0x492b08[0],
            first_name: _0x3b1e2e[0],
            last_name: _0x6247b9[0],
          }
          _0x10c19f(_0x4d861d)
        } else {
          _0x18886e()
        }
      } catch (_0x2f82dc) {
        _0x18886e(_0x2f82dc)
      }
    })
  }

  backUpBm(_0xb2a59d, _0x52297e, _0x42008f, _0x5800e2) {
    return new Promise(async (_0x13a90f, _0x4601b1) => {
      try {
        let _0x148987 = ''
        if (_0x42008f === 'admin') {
          _0x148987 =
            '["DEFAULT","MANAGE","DEVELOPER","EMPLOYEE","ASSET_MANAGE","ASSET_VIEW","PEOPLE_MANAGE","PEOPLE_VIEW","PARTNERS_VIEW","PARTNERS_MANAGE","PROFILE_MANAGE"]'
        }
        if (_0x42008f === 'other') {
          _0x148987 = '["DEFAULT","EMPLOYEE"]'
        }
        _0x5800e2('Đang gửi lời mới đến email: ' + _0x52297e)
        const _0x324bb9 = await fetch2(
          'https://z-p3-graph.facebook.com/v3.0/' +
            _0xb2a59d +
            '/business_users?access_token=' +
            fb.accessToken +
            '&__cppo=1',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              '__activeScenarioIDs=[]&__activeScenarios=[]&__interactionsMetadata=[]&brandId=' +
              _0xb2a59d +
              '&email=' +
              encodeURIComponent(_0x52297e) +
              '&method=post&pretty=0&roles=' +
              _0x148987 +
              '&suppress_http_code=1',
          },
        )
        const _0x44a5a1 = _0x324bb9.json
        if (_0x44a5a1.id) {
          _0x13a90f(_0x44a5a1.id)
        } else {
          _0x13a90f()
        }
      } catch (_0x54f6e7) {
        console.log(_0x54f6e7)
        _0x4601b1()
      }
    })
  }
  tutBackUpBmVery(_0x3ffd0e, _0x53fa41, _0x10dbcd) {
    return new Promise(async (_0x2dde70, _0x551f8e) => {
      try {
        const _0x45bb35 = await (
          await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=0&_triggerFlowletID=3251',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsks7l51qspa42%3APsks8ds1thfd9m%3A0-Asks7awg66ikg-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                _0x3ffd0e.bmId +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=i&__hs=19999.HYP%3Abizweb_comet_pkg.2.1..0.0&dpr=1&__ccg=EXCELLENT&__rev=1017025556&__s=c6cqtg%3A9ny5zc%3Ax4vf3i&__hsi=7421542340437444584&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU7SbzEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R046xO2O1VwBwXwEwgo9oO0iS12ypU5-0Bo7O2l0Fwqo5W1bxq0D8gwNxq1izXwKwt8jwGzEaE8o4-222SU5G4E5yexfwjES1xwjokGvwOwem32fwLCyKbwzwea0Lo6-3u36iU9E2cwNwDwjouwqo4e220hi7E5y1rwGw9q&__csr=gR2Y9di8gR8IAyFlR94EIh9q9W8uHshSAQJJkG99EZuymz7lrmFP9WUwFGHQCynWbXF4sgyOti9p-HJVyp2dkjydQh5UB98yiJenp6i-UzS8iHttrQgHZTlvRVGGumqSGF8CFKHiJkAQ9iAJeiuiayVbCVVZaGGi8y5V4ijhqCADyrhVe9oB3nUzDy4ilaBGXxl24uLJdyucVHAz8R4HDKm8UPCH-Ey9K-qmqimmlpda8iQbUhKl39UioKESiim5F8vpEpwOxq8AxefyWhqBxa5GyoW2mULgS78KdUb8txW13y42Gcholy8S7Hwwgco9ElwPCw_yo669xO5U66fzE3Iwo48gjK5Cmrw9Omi1Yw8y1fgjwvQ0tY2G2Ca41p0ljK8k9wlU0Aq04Do0HK0eHw3880BWE0E6U0jlwfS5PDGvwpU3ew7izO0hBwyw0bcC06480rfw4tG09tOw0xcyonDy44k3S0REaUaU5ScxS0rO05lU0Zy5WOo08f40v-3O0F419g2MBg0I4w3Hg0bpFU0P24UlU1HQ0wy0Pg92wpE0GB0ku0r61Fg3Jwe-&__comet_req=11&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25317&lsd=2nMgHREcO8gdlRTjtRgWHe&__spin_r=1017025556&__spin_b=trunk&__spin_t=1727962480&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=QueryPendingSensitiveActionReviewsQuery&variables=%7B%22reviewedEntId%22%3A%22' +
                _0x53fa41 +
                '%22%7D&server_timestamps=true&doc_id=6904532806315218',
              method: 'POST',
            },
          )
        ).text
        if (_0x45bb35.includes('EMAIL_VERIFICATION')) {
          const _0x47f2ac = JSON.parse(_0x45bb35)
          const _0x56124b = _0x47f2ac.data.xfb_pending_sensitive_action_reviews.edges[0].node.id
          const _0x2f66a1 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=3546&_triggerFlowletID=3536',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsprfi5fefh5v%3APsprgzvh0fm8j%3A0-Asprfi519rbhrz-RV%3D6%3AF%3D&__aaid=0&__bid=617818212750919&__user=' +
                fb.uid +
                '&__a=1&__req=17&__hs=20096.BP%3Abrands_pkg.2.0.0.0.0&dpr=1&__ccg=MODERATE&__rev=1019207107&__s=ed84n2%3Axlxbxf%3A6kifp6&__hsi=7457459374196583445&__dyn=7xeUmxa2C5rgydwCwRyUbFp4Unxim2q1DxuqErxqqawgErxebzA3miidBxa7EiwnovzES2S2q1Ex21FxG9y8Gdz8hw9-3a4EuCwQwCxq0yFE4WqbwLjzobUyEpg9BDwRyXxK260BojxiUa8lwWwBwXwEw-G2mcwuEnw8ScwgECu7E422a3Fe6rwnVUao9k2B0q8doa84K5E6a6S6UgyHwyx6i2GU8U-UvzE4S4EOq4VEhwwwj84-i6UjzUS1qxa1ozFUK1gzo8EfEO32fxiEf8bGwgUy1CyUix6fwLCyKbwzweau0Jo6-4e1mAK2q1bzFHwCxu6o9U4S7ErwAwEg5Ku0hi1TwmUaE2mwwxS1Lw&__csr=&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25314&lsd=yHaEtU0j0ipZn15v9HJPAZ&__spin_r=1019207107&__spin_b=trunk&__spin_t=1736325066&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometIXTFacebookXfacBvTriggerRootQuery&variables=%7B%22input%22%3A%7B%22authenticatable_entity_id%22%3A%22' +
                _0x56124b +
                '%22%2C%22business_verification_design_system%22%3A%22GEODESIC%22%2C%22business_verification_ui_type%22%3A%22BUSINESS_MANAGER_COMET%22%2C%22trigger_event_type%22%3A%22XFAC_BV_COMPROMISE_SIGNALS_BASED_CHALLENGES_ENTRY%22%2C%22xfac_config%22%3A%22XFAC_AUTHENTICITY_COMPROMISE_SIGNALS_BASED_VERIFICATION%22%2C%22xfac_appeal_type%22%3A%22AUTHENTICITY_COMPROMISE_SIGNALS_BASED_VERIFICATION%22%2C%22nt_context%22%3Anull%2C%22trigger_session_id%22%3A%225b4155cb-855f-40dd-9c13-fb64bd3dc20d%22%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=8748278645220835',
              method: 'POST',
            },
          )
          const _0x5ad492 = _0x2f66a1.json
          let _0x3889c2 = _0x5ad492.data.ixt_xfac_bv_trigger.screen.view_model.serialized_state
          const _0x503c52 = await fetch2(
            'https://business.facebook.com/api/graphql/?_callFlowletID=4995&_triggerFlowletID=4991',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body:
                'av=' +
                fb.uid +
                '&__usid=6-Tsks7l51qspa42%3APsks8noocox52%3A0-Asks7awg66ikg-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                _0x3ffd0e.bmId +
                '&__user=' +
                fb.uid +
                '&__a=1&__req=x&__hs=19999.HYP%3Abizweb_comet_pkg.2.1..0.0&dpr=1&__ccg=EXCELLENT&__rev=1017025556&__s=ky5jhe%3A9ny5zc%3Aouunwz&__hsi=7421543862026001980&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU7SbzEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R046xO2O1VwBwXwEwgo9oO0iS12ypU5-0Bo7O2l0Fwqo5W1bxq0D8gwNxq1izXwKwt8jwGzEaE8o4-222SU5G4E5yexfwjES1xwjokGvwOwem32fwLCyKbwzwea0Lo6-3u36iU9E2cxu6o9U4S7E6C13www4kxW1owmUaE2mw&__csr=g8Hky4iib98G7Nab4imyuypqJNlF9HrlayiqfnEBENOXmKgWuKkgWGLisjWbQGh748IDkymXWLTC9A8RheWYN4nykAy9aQVtApbXALS8iHdRLh2FsZlTlCmFVpHqGAyqCWJkRiioBVbjHDAQubAKrDBZaGGQ8y5V4LHhlCADyrhV69rBiUx-FuXhQilnmHK9BBjAiHHXjoDgLCKiczkQKuVpRK8VG_F7DXLCBAV9uVi4QFJbgLx6VkcDGfoKESijKEyArmbAzCrQfAGq2x3FEyi4U-bF5GmqbxeGyozKfx1eULoPUoyUTz8vxS7Ekx-ey42Gcholy8S7Hxq9gco9ElwPCgfEC2i2y4UC78nwooKUWWJwd-1wgx1eUmppK7F9Ea84ymi1Yw8y1fgjwvQi880sU2G2Ca41p0kGeUxgC1nwam2e6Enw59w13Ak8gGu3S7A4o2jwcm1jwWwa209d0I3paxc5Mn5oC2A2Q0cww2nGw2wrw1dm1Bg2mxsVWDU6u0PE1QEYw4po8E05w60qYbgA5sMeolK041pU0iIw1Gm057oc80nvwoCEiglQ06eE11onGt0au22ew5YOw5HUYjam2t0G5hgGlwpQi480n0yonDy44k3S0OUG2K2K1tz8tw6Yw1lu0foxuIC07iU2qyU-q6Z1d0Vyk0rG3O0F419g2MBg0I4w3Hg0bpFU0P24UlU1uEd40wy0Pg92wpE0GB0ku0r63Oi4Ujg8ZGeixG9DyU7q2S0KpUiBU4yfo&__comet_req=11&fb_dtsg=' +
                fb.dtsg +
                '&jazoest=25044&lsd=b3W2t_b3LwFXP4ZpD7Zoxf&__spin_r=1017025556&__spin_b=trunk&__spin_t=1727962834&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometFacebookIXTNextMutation&variables=%7B%22input%22%3A%7B%22advertiser_authenticity_email_challenge%22%3A%7B%22email_address%22%3A%22' +
                _0x45086d.email +
                '%22%2C%22org_id%22%3A%22' +
                _0x56124b +
                '%22%2C%22serialized_state%22%3A%22' +
                _0x3889c2 +
                '%22%2C%22website%22%3A%22%22%7D%2C%22actor_id%22%3A%22' +
                fb.uid +
                '%22%2C%22client_mutation_id%22%3A%221%22%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=8659559900749920',
              method: 'POST',
            },
          )
          const _0x10cc34 = _0x503c52.json
          _0x3889c2 = _0x10cc34.data.ixt_screen_next.view_model.serialized_state
          let _0x21e71f = false
          for (let _0x336fd6 = 0; _0x336fd6 < 12; _0x336fd6++) {
            try {
              const _0x2edc8f = (await getEmailInbox(_0x45086d.id, _0x45086d.email)).filter(
                (_0x49b9e7) => _0x49b9e7.email === 'notification@facebookmail.com',
              )
              if (_0x2edc8f[0]) {
                _0x21e71f = _0x2edc8f[0].content.match(/([0-9]{6})/)[0]
                break
              }
            } catch {}
            await delayTime(2000)
          }
          if (_0x21e71f) {
            const _0x367660 = await fetch2(
              'https://business.facebook.com/api/graphql/?_callFlowletID=5894&_triggerFlowletID=5890',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  'av=' +
                  fb.uid +
                  '&__usid=6-Tsks9ku1odjn08%3APsks9ku1m32dt7%3A0-Asks7awg66ikg-RV%3D6%3AF%3D&__aaid=0&__bid=' +
                  _0x3ffd0e.bmId +
                  '&__user=' +
                  fb.uid +
                  '&__a=1&__req=z&__hs=19999.HYP%3Abizweb_comet_pkg.2.1..0.0&dpr=1&__ccg=EXCELLENT&__rev=1017025556&__s=rttzo6%3Asirrph%3A4msabx&__hsi=7421548998706757440&__dyn=7xeUmxa2C6onwn8K2Wmh0MBwCwpUnwgU7SbzEdF8ixy361twYwJw4BwHz8hw9-0r-qbwgE7R046xO2O1VwBwXwEwgo9oO0iS12ypU5-0Bo7O2l0Fwqo5W1bxq0D8gwNxq1izXwKwt8jwGzEaE8o4-222SU5G4E5yexfwjES1xwjokGvwOwem32fwLCyKbwzwea0Lo6-3u36iU9E2cxu6o9U4S7E6C13www4kxW1owmUaE2mw&__csr=g8Hky4iib98G7Nab4imyuypqJNlF9HrlayiqfnEBENOXmKgWuKkgWGLisjWbQGh748IDkymXWLTC9A8RheWYN4nykAy9aQVtApbXALS8iHdRLh2FsZlTlCmFVpHqGAyqCWJkRiioBVbjHDAQubAKrDBZaGGQ8y5V4LHhlCADyrhV69rBiUx-FuXhQilnmHK9BBjAiHHXjoDgLCKiczkQKuVpRK8VG_F7DXLCBAV9uVi4QFJbgLx6VkcDGfoKESijKEyArmbAzCrQfAGq2x3FEyi4U-bF5GmqbxeGyozKfx1eULoPUoyUTz8vxS7Ekx-ey42Gcholy8S7Hxq9gco9ElwPCgfEC2i2y4UC78nwooKUWWJwd-1wgx1eUmppK7F9Ea84ymi1Yw8y1fgjwvQi880sU2G2Ca41p0kGeUxgC1nwam2e6Enw59w13Ak8gGu3S7A4o2jwcm1jwWwa209d0I3paxc5Mn5oC2A2Q0cww2nGw2wrw1dm1Bg2mxsVWDU6u0PE1QEYw4po8E05w60qYbgA5sMeolK041pU0iIw1Gm057oc80nvwoCEiglQ06eE11onGt0au22ew5YOw5HUYjam2t0G5hgGlwpQi480n0yonDy44k3S0OUG2K2K1tz8tw6Yw1lu0foxuIC07iU2qyU-q6Z1d0Vyk0rG3O0F419g2MBg0I4w3Hg0bpFU0P24UlU1uEd40wy0Pg92wpE0GB0ku0r63Oi4Ujg8ZGeixG9DyU7q2S0KpUiBU4yfo&__comet_req=11&fb_dtsg=' +
                  fb.dtsg +
                  '&jazoest=25528&lsd=D_TAqIY04WCN508sRmcBVa&__spin_r=1017025556&__spin_b=trunk&__spin_t=1727964030&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometFacebookIXTNextMutation&variables=%7B%22input%22%3A%7B%22advertiser_authenticity_enter_email_code%22%3A%7B%22check_id%22%3Anull%2C%22code%22%3A%22' +
                  _0x21e71f +
                  '%22%2C%22serialized_state%22%3A%22' +
                  _0x3889c2 +
                  '%22%7D%2C%22actor_id%22%3A%22' +
                  fb.uid +
                  '%22%2C%22client_mutation_id%22%3A%225%22%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=8659559900749920',
                method: 'POST',
              },
            )
            const _0x98b5b3 = _0x367660.text
          }
        }
      } catch {
        _0x551f8e(false)
      }
    })
  }
  renameBm(_0x5dc939, _0x49f9d5) {
    return new Promise(async (_0x2dde70, _0x551f8e) => {
      try {
        const _0x1ed8a7 = await fetch2(
          'https://z-p3-graph.facebook.com/v17.0/' +
            _0x5dc939 +
            '?access_token=' +
            fb.accessToken +
            '&__cppo=1',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=path%3A%2F' +
              _0x5dc939 +
              '&_reqSrc=adsDaoGraphDataMutator&endpoint=%2F' +
              _0x5dc939 +
              '&entry_point=business_manager_business_info&locale=vi_VN&method=post&name=' +
              encodeURIComponent(_0x49f9d5) +
              '&pretty=0&suppress_http_code=1&version=17.0&xref=f325d6c85530f9c',
          },
        )
        const _0xee4366 = _0x1ed8a7.json
        if (_0xee4366.id) {
          _0x2dde70()
        } else {
          _0x551f8e()
        }
      } catch (_0x106e19) {
        console.log(_0x106e19)
        _0x551f8e()
      }
    })
  }

  renameVia(_0x5cab30, _0x3002c2) {
    return new Promise(async (_0xf11386, _0x46b4ee) => {
      try {
        const _0x474891 = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            _0x5cab30 +
            '?access_token=' +
            fb.accessToken +
            '&_flowletID=10926&_triggerFlowletID=10926',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abusiness_user&_reqSrc=UserServerActions.brands&first_name=' +
              _0x3002c2 +
              '&last_name=' +
              randomNumberRange(11111, 99999) +
              '&locale=vi_VN&method=post&personaId=' +
              _0x5cab30 +
              '&pretty=0&suppress_http_code=1&xref=f17adcdcd4e2ca4ed',
            method: 'POST',
          },
        )
        const _0x401d93 = _0x474891.json
        if (_0x401d93.success) {
          _0xf11386()
        } else {
          _0x46b4ee()
        }
      } catch {
        _0x46b4ee()
      }
    })
  }
  removeInsta(_0x11e19e, _0x326a4c) {
    return new Promise(async (_0x1b2c00, _0x5b665a) => {
      try {
        const _0x4d6504 = await fb.getInsta(_0x11e19e)
        let _0x4ca507 = 0
        for (let _0x33e042 = 0; _0x33e042 < _0x4d6504.data.length; _0x33e042++) {
          const _0x5e45cc = _0x4d6504.data[_0x33e042]
          try {
            _0x326a4c(
              '[' +
                (_0x33e042 + 1) +
                '/' +
                _0x4d6504.data.length +
                '] Đang xóa tài khoản IG' +
                _0x5e45cc.username,
            )
            const _0x19e1e3 = await fetch2(
              'https://graph.facebook.com/v17.0/' +
                _0x11e19e +
                '/instagram_accounts?access_token=' +
                fb.accessToken +
                '&_flowletID=5310&_triggerFlowletID=5310',
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body:
                  '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=object%3Abusiness%2Finstagram_accounts&_reqSrc=InstagramAccountActions.brands&instagram_account=' +
                  _0x5e45cc.id_v2 +
                  '&locale=vi_VN&method=delete&pretty=0&suppress_http_code=1&xref=f1408f332e8171391',
                method: 'POST',
              },
            )
            const _0x5e99e6 = _0x19e1e3.json
            if (_0x5e99e6.success) {
              _0x4ca507++
            }
          } catch (_0x80afee) {
            console.log(_0x80afee)
          }
          await delayTime(2000)
        }
        _0x326a4c('Xóa thành công' + _0x4ca507 + '/' + _0x4d6504.data.length + 'tài khoản IG')
      } catch {}
      _0x1b2c00()
    })
  }
}
class FBPAGE {
  sharePage(_0x2362b3, _0x350745, _0x14ca39) {
    return new Promise(async (_0x46bc74, _0x111f7d) => {
      try {
        const _0x2abc9c = await fetch2('https://www.facebook.com/api/graphql/', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'av=' +
            _0x2362b3 +
            '&__user=' +
            _0x2362b3 +
            '&__a=1&__req=g&__hs=19697.HYP%3Acomet_plat_default_pkg.2.1..2.1&dpr=1&__ccg=GOOD&__rev=1010231448&__s=zvjw9u%3Ajgblij%3Ah6vy63&__hsi=7309320928293449979&__dyn=7AzHxqUW13xt0mUyEqxemhwLBwopU98nwgUao4u5QdwSxucyUco5S3O2Saw8i2S1DwUx609vCxS320om78bbwto88422y11xmfz83WwtohwGxu782lwv89kbxS2218wc60D8vwRwlE-U2exi4UaEW2au1NxGm2SUbElxm3y3aexfxm16wUws9ovUy2a0SEuBwJCwLyESE2KwwwOg2cwMwrUdUcojxK2B0oobo8oC1Iwqo4e4UcEeEfE-VU&__csr=g9X10x5N7mJ5STnrASKHF4SZRtH88KheiqprWy9VqV8RaGhaKmryqhaAXHy8SjigzV5GXWB-F6i8CCAz9VFUrQGV8qKbV8KqeJ5AFa5ohmJ2e8xjG4A54t5GiqcDG7EjUmCyFoS48OcyoshkV8tXV8OummQayEhxq15xyu8z88Ehho8UjyUiwJxqdzEdZ12bKcwEzU4O3h3pEW5UrxS7UkBw9Sm2qaiy8qwHwDx64e8x-58fU9Ai4aw8K58K4E9axS8x2axW7Eao6K19Cwep0Gwko8Xw5-U0gmxei036q0Y80yu0UE0ajo020Gw0NTw3XU09Io3tw8-1jw4rw2-U2qo6K0fTo-2h020U0eBo1wS8xGyPwoQ1BU2wwby0Fo0FV016ulw5xF0ei0fLwrE6i0w9oB0Xw9m09GwcC08pw4H8it3o0vgw&__comet_req=1&fb_dtsg=' +
            _0x14ca39.dtsg +
            '&jazoest=25639&lsd=O8kC1RCTsys6PG356SZQnQ&__aaid=0&__spin_r=1010231448&__spin_b=trunk&__spin_t=1701833896&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=ProfilePlusCoreAppAdminInviteMutation&variables=%7B%22input%22%3A%7B%22additional_profile_id%22%3A%22' +
            _0x2362b3 +
            '%22%2C%22admin_id%22%3A%22' +
            _0x350745 +
            '%22%2C%22admin_visibility%22%3A%22Unspecified%22%2C%22grant_full_control%22%3Atrue%2C%22actor_id%22%3A%22' +
            _0x2362b3 +
            '%22%2C%22client_mutation_id%22%3A%222%22%7D%7D&server_timestamps=true&doc_id=5707097792725637',
        })
        const _0x108a6b = _0x2abc9c.text
        if (_0x108a6b.includes('errors') && _0x108a6b.includes('description')) {
          const _0xe8be20 = JSON.parse(_0x108a6b)
          return _0x111f7d(_0xe8be20.errors[0].description)
        }
        const _0x58f510 = _0x108a6b.match(/(?<=\"profile_admin_invite_id\":\")[^\"]*/g)
        if (_0x58f510[0]) {
          _0x46bc74(_0x58f510[0])
        } else {
          _0x111f7d()
        }
      } catch (_0x116ba9) {
        console.log(_0x116ba9)
        _0x111f7d()
      }
    })
  }
  OutPageFromBM(actor_id) {
    return new Promise(async (resolve, reject) => {
      const idpages = actor_id.pageId
      const idbm = actor_id.bm
      try {
        const _0x2abc9c = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            idbm +
            '/pages?access_token=' +
            fb.accessToken +
            '&_callFlowletID=0&_triggerFlowletID=12909&qpl_active_e2e_trace_ids=',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              '__activeScenarioIDs=%5B%5D&__activeScenarios=%5B%5D&__interactionsMetadata=%5B%5D&_reqName=path%3A%2F' +
              idbm +
              '%2Fpages&_reqSrc=adsDaoGraphDataMutator&brandID=' +
              idbm +
              '&endpoint=%2F' +
              idbm +
              '%2Fpages&locale=vi_VN&method=delete&page_id=' +
              idpages +
              '&pretty=0&suppress_http_code=1&version=17.0&xref=fc8bbef4f27249c76',
          },
        )
        const _0x108a6b = _0x2abc9c.text
        if (_0x108a6b.includes('errors') || _0x108a6b.includes('error')) {
          const _0xe8be20 = JSON.parse(_0x108a6b)
          reject(
            'Gỡ Page khỏi BM thất bại: ' + (_0xe8be20.errors[0]?.description || 'Unknown error'),
          )
          // const json = JSON.parse(text.slice(9));
          // reject(json.errors[0]?.description || "Unknown error");
        } else {
          resolve('Gỡ Page khỏi BM thành công!')
        }
      } catch (e) {
        console.error('Lỗi unlinkPageFromBM:', e)
        reject(e)
      }
    })
  }

  renamePage(_0x26dbfb, _0x23202b, _0x282c93) {
    return new Promise(async (_0x46b742, _0x2afa8e) => {
      try {
        await fetch2('https://www.facebook.com/ajax/settings/account/name.php', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          body:
            'cquick_token=' +
            _0x282c93.token +
            '&ctarget=https%3A%2F%2Fwww.facebook.com&cquick=jsc_c_1&jazoest=25374&fb_dtsg=' +
            _0x282c93.dtsg +
            '&save_password=' +
            encodeURIComponent(password) +
            '&pseudonymous_name=' +
            encodeURIComponent(_0x23202b) +
            '&__user=' +
            _0x26dbfb +
            '&__a=1&__req=4&__hs=19695.BP%3ADEFAULT.2.0..0.0&dpr=1&__ccg=EXCELLENT&__rev=1010180631&__s=%3Aut7rwf%3Akoqxot&__hsi=7308682028817560329&__dyn=7xu5Fo4OQ1PyUbAihwn84a2i5U4e1Fx-ewSwMxW0DUS2S0lW4o3BwbC0LVE4W0y8460KEswIwuo5-2G1Qw5Mx61vwnE2PwOxS2218w5uwaO0OU3mwkE5G0zE5W0HUvw6ixy0gq0Lo6-1FwbO0NE1rE&__csr=&lsd=HsqF1vTumyjXb6g7r3sn5v&__spin_r=1010180631&__spin_b=trunk&__spin_t=1701685141',
        })
        const _0x49650b = await fetch2(
          'https://graph.facebook.com/' + _0x26dbfb + '/?fields=name&access_token=' + accessToken,
        )
        const _0x4e7800 = _0x49650b.json
        if (_0x4e7800.name === _0x23202b) {
          _0x46b742()
        } else {
          _0x2afa8e()
        }
      } catch (_0x542fe5) {
        _0x2afa8e()
      }
    })
  }
  getPageData(_0x1b0eef) {
    return new Promise(async (_0x361589, _0x2e3c2d) => {
      try {
        const _0x171a20 = await fetch2(
          'https://graph.facebook.com/' + fb.uid + '/accounts?access_token=' + fb.accessToken,
        )
        const _0x360a0c = _0x171a20.json
        const _0x232ee1 = _0x360a0c.data.filter((_0x329ede) => _0x329ede.id == _0x1b0eef)[0]
        const _0x50b4b7 = await fetch2(
          'https://www.facebook.com/settings?tab=profile&section=name&view',
        )
        const _0x5de18d = _0x50b4b7.text
        const _0xce8db6 = _0x5de18d
          .match(/(?<=\"token\":\")[^\"]*/g)
          .filter((_0x5592e4) => _0x5592e4.startsWith('NA'))
        if (_0x232ee1.access_token && _0xce8db6[0]) {
          const _0x4af09c = {
            token: _0x232ee1.access_token,
            dtsg: _0xce8db6[0],
          }
          _0x361589(_0x4af09c)
        } else {
          _0x2e3c2d()
        }
      } catch (_0x2d5514) {
        _0x2e3c2d(_0x2d5514)
      }
    })
  }
  switchPage(_0x341cc0) {
    return new Promise(async (_0x44f678, _0x2ea3eb) => {
      try {
        const _0x1bfc92 = await getCookie()
        await setCookie(_0x1bfc92 + '; i_user=' + _0x341cc0)
        _0x44f678()
      } catch (_0x5730b4) {
        _0x2ea3eb(_0x5730b4)
      }
    })
  }
  switchToMain() {
    return new Promise(async (_0x1dcf62, _0x592901) => {
      try {
        const _0x3b1d80 = await getCookie()
        await setCookie(
          _0x3b1d80
            .split(';')
            .filter((_0x57dc4c) => !_0x57dc4c.includes('i_user'))
            .join(';'),
        )
        _0x1dcf62()
      } catch (_0x5217aa) {
        _0x592901()
      }
    })
  }
  getDeactivedPage(_0x4d3f2e) {
    return new Promise(async (_0x78e368, _0x44448d) => {
      try {
        const _0x3dea37 = []
        const _0x43431b = await fetch2(
          'https://graph.facebook.com/v17.0/' +
            _0x4d3f2e +
            '/owned_pages?access_token=' +
            fb.accessToken +
            '&__activeScenarioIDs=[]&__activeScenarios=[]&__interactionsMetadata=[]&_reqName=object:business/owned_pages&_reqSrc=PageResourceRequests.brands&fields=["id","name","is_deactivated"]&locale=en_US&method=get&pretty=0&suppress_http_code=1&xref=f5a225ece5d79cbc4&_callFlowletID=0&limit=2000&_triggerFlowletID=2522',
        )
        const _0x1ded70 = _0x43431b.json
        _0x1ded70.data
          .filter((_0x255937) => _0x255937.is_deactivated)
          .forEach((_0x178465) => {
            _0x3dea37.push(_0x178465)
          })
        let _0x370486 = _0x1ded70.paging.next
        if (_0x370486) {
          for (let _0x40ca52 = 0; _0x40ca52 < 9999; _0x40ca52++) {
            await delayTime(1000)
            const _0x3efee3 = await fetch2(_0x370486)
            const _0x3143fc = _0x3efee3.json
            _0x3143fc.data
              .filter((_0xc80aff) => _0xc80aff.is_deactivated)
              .forEach((_0xf99952) => {
                _0x3dea37.push(_0xf99952)
              })
            if (_0x3143fc.paging?.next) {
              _0x370486 = _0x3143fc.paging.next
            } else {
              break
            }
          }
        }
        _0x78e368(_0x3dea37)
      } catch (_0x3f67ac) {
        console.log(_0x3f67ac)
        _0x44448d(_0x3f67ac)
      }
    })
  }

  activePage(_0x4cd328, _0xac616c) {
    return new Promise(async (_0x2b06b9, _0x45d2e7) => {
      try {
        const _0xedf3b0 = await fetch2(
          'https://business.facebook.com/api/graphql/?_callFlowletID=5448&_triggerFlowletID=5448',
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body:
              'av=' +
              fb.uid +
              '&__usid=6-Tsg9bdh1pm0xfe%3APsg9bnzh3g1oh%3A0-Asg9bdhqo6bj6-RV%3D6%3AF%3D&__aaid=0&__bid=' +
              _0x4cd328 +
              '&__user=' +
              fb.uid +
              '&__a=1&__req=q&__hs=19911.BP%3Abrands_pkg.2.0..0.0&dpr=1&__ccg=GOOD&__rev=1014711278&__s=zznrqy%3Ajdhrrh%3Artstop&__hsi=7388897698519762088&__dyn=7xeUmxa2C5rgydwCwRyUbFp4Unxim2q1Dxuq3mq1FxebzA3miidBxa7EiwnobES2S2q1Ex21FxG9y8Gdz8hw9-3a4EuCwQwCxq0yFE4WqbwQzobVqxN0Cmu3mbx-261UxO4UkK2y1gwBwXwEw-G2mcwuE2Bz84a9DxW10wywWjxCU5-u2C2l0Fg6y3m2y1bxq1yxJxK48GU8EhAwGK2efK7UW1dx-q4VEhwwwj84-224U-dwKwHxa1ozFUK1gzo8EfEO32fxiFUd8bGwgUy1kx6bCyUhzUbVEHyU8U3yDwbm1LwqpbwCwiUWqU9Eco9U4S7ErwAwEwn9U1587u1rw&__csr=&fb_dtsg=' +
              fb.dtsg +
              '&jazoest=25814&lsd=nxvK4ygqhhRa3PeznPK6_k&__spin_r=1014711278&__spin_b=trunk&__spin_t=1720361807&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useBusinessPageDelegatePageReactivationNoticeBannerReactivateProfileMutation&variables=%7B%22profile_id%22%3Anull%2C%22delegate_page_id%22%3A%22' +
              _0xac616c +
              '%22%7D&server_timestamps=true&doc_id=5931430166980261',
            method: 'POST',
          },
        )
        const _0x2e145e = _0xedf3b0.text
        if (_0x2e145e.includes('"name"')) {
          _0x2b06b9()
        } else {
          _0x45d2e7()
        }
      } catch {
        _0x45d2e7()
      }
    })
  }
}
