window.onload = async () => {
  const _0x142cb1 = location.href;
  if (_0x142cb1 === "https://www.facebook.com/login/" || _0x142cb1 === "https://web.facebook.com/login/") {
    const _0xa77973 = await getLocalStorage("dataFB");
    console.log(_0xa77973);
    if (_0xa77973) {
      const _0x1ec1eb = document.getElementById("email");
      if (_0x1ec1eb) {
        _0x1ec1eb.value = _0xa77973.uid;
        document.getElementById("pass").value = _0xa77973.password;
        document.querySelector("button[name='login']").click();
      }
    }
  } else if (_0x142cb1 === "https://www.facebook.com/" || _0x142cb1 === "https://web.facebook.com/") {
    try {
      await removeLocalStorage("dataFB");
    } catch (_0x5214f4) {}
  } else if (_0x142cb1 === "https://www.facebook.com/checkpoint/?next" || _0x142cb1 === "https://web.facebook.com/checkpoint/?next") {
    const _0x3c7de2 = await getLocalStorage("dataFB");
    if (_0x3c7de2) {
      const _0x48845b = document.getElementById("approvals_code");
      if (_0x48845b) {
        const _0x5b97ab = {
          action: "BGrequest",
          url: "https://2fa.live/tok/" + _0x3c7de2.two_fa
        };
        const _0x1f3e2b = await chrome.runtime.sendMessage(_0x5b97ab);
        if (_0x1f3e2b.token) {
          _0x48845b.value = _0x1f3e2b.token;
          document.querySelector("button[type='submit']").click();
        }
      } else {
        const _0x44e4ea = document.querySelector("button[type='submit']");
        if (_0x44e4ea) {
          _0x44e4ea.click();
        }
      }
    }
  } else if (_0x142cb1.includes("facebook.com/two_factor/remember_browser/?")) {
    try {
      document.querySelectorAll("[role='button'][tabindex='0']")[1].click();
    } catch (_0x123517) {}
  } else if (_0x142cb1.startsWith("https://login.live.com/")) {
    const _0x14190c = await getLocalStorage("dataHM");
    if (_0x14190c) {
      setInterval(async () => {
        const _0x238272 = document.querySelector("input[type='email']");
        if (_0x238272) {
          _0x238272.focus();
          document.execCommand("insertText", false, _0x14190c.email);
          document.querySelector("#idSIButton9").click();
        }
        const _0x4bbced = document.querySelector("input[type='password']");
        if (_0x4bbced && _0x4bbced.getAttribute("aria-hidden") !== "true") {
          _0x4bbced.focus();
          document.execCommand("insertText", false, _0x14190c.passwordEmail);
          document.querySelector("#idSIButton9").click();
          await removeLocalStorage("dataHM");
        }
      }, 1000);
    }
  }
};
function removeLocalStorage(_0x4b438b) {
  return new Promise(_0x3348b3 => {
    chrome.storage.local.remove([_0x4b438b], function () {
      _0x3348b3();
    });
  });
}
function getLocalStorage(_0x2353f1) {
  return new Promise(_0x2cd705 => {
    chrome.storage.local.get(_0x2353f1, function (_0x22dc40) {
      _0x2cd705(_0x22dc40[_0x2353f1]);
    });
  });
}
//  function getAllDataAdsForUid(uid) {
//     return new Promise((resolve, reject) => {
//       try {
//         chrome.storage.local.get(null, async (items) => {
//           const matchingKeys = Object.keys(items).filter(key => key.startsWith("dataAds_" + uid + "_"));
//           const allData = [];

//           for (const key of matchingKeys) {
//             const data = await getLocalStorage(key);
//             if (Array.isArray(data)) {
//               allData.push(...data);
//             }
//           }

//           resolve(allData);

//         });
//       } catch (error) { console.log(error) }
//     });

//   }
function sleep(_0x3e53f7) {
  return new Promise(_0x366256 => setTimeout(_0x366256, _0x3e53f7 * 1000));
}
function submit_2fa(_0x434162, _0x3c176c, _0x314735) {
  return new Promise(_0x9df2f4 => {
    fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      headers: {
        "x-fb-friendly-name": "useTwoFactorLoginValidateCodeMutation"
      },
      body: new URLSearchParams({
        av: "0",
        __aaid: "0",
        __user: "0",
        __a: "1",
        dpr: "1",
        __comet_req: "1",
        fb_dtsg: _0x434162,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "useTwoFactorLoginValidateCodeMutation",
        variables: "{\"code\":{\"sensitive_string_value\":\"" + _0x3c176c + "\"},\"method\":\"TOTP\",\"flow\":\"TWO_FACTOR_LOGIN\",\"encryptedContext\":\"" + _0x314735 + "\",\"maskedContactPoint\":null}",
        server_timestamps: "true",
        doc_id: "7404767032917067"
      })
    }).then(_0x56710c => _0x56710c.json()).then(_0x400d34 => _0x9df2f4(_0x400d34));
  });
}