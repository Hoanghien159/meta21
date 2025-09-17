
//     async init(gettoken = false) {
//         return new Promise(async (_0x1d847e, _0x5c54e9) => {
//             for (let _0x22efc7 = 0; _0x22efc7 < 3; _0x22efc7++) {
//                 try {
//                     this.accessToken = await getLocalStorage("accessToken");
//                     this.accessToken2 = await getLocalStorage("accessToken2");
//                     this.dtsg = await getLocalStorage("dtsg");
//                     this.dtsg2 = await getLocalStorage("dtsg2");
//                     try {
//                         this.userInfo = await this.getUserInfo();
//                     } catch (_0xefb7fb) {
//                         this.accessToken = false;
//                         await removeLocalStorage("accessToken");
//                         await removeLocalStorage("accessToken2");
//                     }
//                     const picture = await this.checkImageExists(fb.userInfo?.picture?.data?.url||false);
//                     // 🔍 kiểm tra accessToken2 còn sống không
//                     const token2Valid = this.accessToken2 && await this.isAccessTokenValid(this.accessToken2);
//                     if (!this.accessToken || !this.dtsg || !token2Valid || gettoken || !picture) {
//                         const getin = gettoken || !picture;
//                         const _0x393b8a = await this.getAccessToken();
//                         this.accessToken = _0x393b8a.accessToken;
//                         this.accessToken2 = "";
//                         try {
//                             this.accessToken2 = await this.getAccessToken2();
//                         } catch { }

//                         this.userInfo = await this.getUserInfo(getin);
//                         this.dtsg = _0x393b8a.dtsg;
//                         this.dtsg2 = _0x393b8a.dtsg2;

//                         await setLocalStorage("accessToken", this.accessToken);
//                         await setLocalStorage("accessToken2", this.accessToken2);
//                         await setLocalStorage("dtsg", this.dtsg);
//                         await setLocalStorage("dtsg2", this.dtsg2);
//                     }

//                     this.uid = this.userInfo.id;
//                     break;
//                 } catch { }
//             }

//             if (this.accessToken && this.dtsg && this.userInfo) {
//                 _0x1d847e();
//             } else {
//                 _0x5c54e9();
//             }
//         });
//     }



// // Lấy một mục từ Local Storage theo tên.
// function getLocalStorage(name) {
//   return new Promise((resolve, reject) => {
//     try {
//       const message = {
//         type: "getLocalStorage",
//         name
//       };

//       chrome.runtime.sendMessage(extId, message, (response) => {
//         if (chrome.runtime.lastError) {
//           reject(chrome.runtime.lastError);
//         } else {
//           resolve(response);
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// // Xóa toàn bộ Local Storage.
// function clearLocalStorage() {
//   return new Promise((resolve, reject) => {
//     try {
//       const message = {
//         type: "clearLocalStorage"
//       };

//       chrome.runtime.sendMessage(extId, message, (response) => {
//         if (chrome.runtime.lastError) {
//           reject(chrome.runtime.lastError);
//         } else {
//           resolve(response);
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
