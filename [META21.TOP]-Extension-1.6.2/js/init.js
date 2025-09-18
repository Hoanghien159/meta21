if (localStorage.getItem("uid")) {
  const localStorageData = {
    ...localStorage
  };
  Object.keys(localStorageData).forEach(_0x1f4089 => {
    if (!["dataAds", "dataBm", "dataPage", "userInfo"].includes(_0x1f4089)) {
      let _0x2fa390 = localStorageData[_0x1f4089];
      try {
        _0x2fa390 = JSON.parse(_0x2fa390);
      } catch (_0x442071) {}
      const _0x42064e = {
        [_0x1f4089]: _0x2fa390
      };
      chrome.storage.local.set(_0x42064e);
    }
  });
  localStorage.clear();
}