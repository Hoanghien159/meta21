chrome.storage.local.set({
  extId: chrome.runtime.id
});
document.addEventListener("DOMContentLoaded", function () {
  const _0x32359e = document.createElement("div");
  _0x32359e.innerHTML = "<iframe src=\"chrome-extension://" + chrome.runtime.id + "/init.html\"\n                                    style=\"border:0; overflow:hidden; width:0; height:0; position:absolute; visibility: hidden;\" aria-hidden=\"true\"></iframe>";
  document.body.appendChild(_0x32359e);
});
try {
  const observerPopup = new MutationObserver(() => {
    if (location.href.includes("business.facebook.com/billing_hub/payment_settings") || location.href.includes("business.facebook.com/billing_hub/accounts/details")) {
      const _0x458729 = document.querySelector(".x78zum5.xdt5ytf.xozqiw3.x2lwn1j.xeuugli.x1iyjqo2.x2lah0s.x1kxxb1g.xxc7z9f.x1cvmir6");
      const _0x370260 = document.querySelector("#meta21-popup-iframe");
      if (_0x458729 && !_0x370260) {
        const _0x2def58 = new URL(location.href);
        const _0x538c5e = _0x2def58.searchParams.get("asset_id") || "";
        const _0xf17629 = _0x2def58.searchParams.get("business_id") || "";
        const _0xf7f29d = document.createElement("div");
        _0xf7f29d.id = "meta21-popup-container";
        _0xf7f29d.className = "x1gzqxud x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1kmqopl x5yr21d xh8yej3";
        _0xf7f29d.style.overflow = "hidden";
        _0xf7f29d.style.lineHeight = "0";
        _0xf7f29d.style.marginTop = "20px";
        _0xf7f29d.innerHTML = "\n                    <iframe id=\"meta21-popup-iframe\" frameborder=\"0\" style=\"overflow:hidden;height:600px;width:100%\" height=\"600\" width=\"100%\" src=\"https://ex.meta21.top/popup?id=" + _0x538c5e + "&bm=" + _0xf17629 + "&bypass=meta21&extId=" + chrome.runtime.id + "\"></iframe>\n                ";
        _0x458729.appendChild(_0xf7f29d);
      }
    }
  });
  observerPopup.observe(document.body, {
    childList: true,
    subtree: true
  });
} catch (_0x3be48f) {}
function addSiblingContentBubble(_0x518b54) {
  if (_0x518b54.parentElement !== document.body) {
    return;
  }
  const _0x3647be = _0x518b54.nextElementSibling;
  if (!_0x3647be) {
    return;
  }
  if (_0x518b54.querySelector(".meta21-sibling-bubble")) {
    return;
  }
  const _0x326529 = document.createElement("div");
  _0x326529.className = "meta21-sibling-bubble";
  const _0x53edfb = chrome.runtime.getURL("/icon-48.png");
  _0x326529.innerHTML = "<img src=\"" + _0x53edfb + "\" alt=\"Meta21 Icon\" style=\"width: 100%; height: 100%; display: block; border-radius: 50%;\">";
  _0x326529.style.position = "absolute";
  _0x326529.style.bottom = "70px";
  _0x326529.style.right = "90px";
  _0x326529.style.width = "60px";
  _0x326529.style.height = "60px";
  _0x326529.style.backgroundColor = "#28a745";
  _0x326529.style.color = "white";
  _0x326529.style.borderRadius = "50%";
  _0x326529.style.display = "flex";
  _0x326529.style.alignItems = "center";
  _0x326529.style.justifyContent = "center";
  _0x326529.style.cursor = "pointer";
  _0x326529.style.zIndex = "999";
  _0x326529.title = "Nhấp để mở popup iframe";
  _0x326529.style.boxSizing = "border-box";
  _0x326529.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
  const _0x599dda = document.createElement("div");
  _0x599dda.className = "meta21-sibling-content-popup";
  _0x599dda.style.position = "absolute";
  _0x599dda.style.bottom = "30px";
  _0x599dda.style.right = "50px";
  _0x599dda.style.borderRadius = "8px";
  _0x599dda.style.padding = "0px";
  _0x599dda.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
  _0x599dda.style.display = "none";
  _0x599dda.style.zIndex = "1000";
  _0x599dda.style.width = "350px";
  _0x599dda.style.height = "600px";
  _0x599dda.style.overflow = "hidden";
  _0x326529.addEventListener("click", _0x2f6c01 => {
    _0x2f6c01.stopPropagation();
    const _0x46fb68 = new URL(location.href);
    let _0x46c2e2 = _0x46fb68.searchParams.get("asset_id") || "";
    const _0x10722b = _0x46fb68.searchParams.get("business_id") || "";
    const _0x49bd3c = _0x46fb68.searchParams.get("act");
    if (_0x49bd3c) {
      _0x46c2e2 = _0x49bd3c.replace("act_", "");
    }
    const _0x596ecb = "meta21-sibling-iframe-" + Math.random().toString(36).substring(2, 9);
    _0x599dda.innerHTML = "\n            <iframe id=\"" + _0x596ecb + "\"\n                    frameborder=\"0\"\n                    style=\"overflow:hidden; height:100%; width:100%; display: block; border-radius: 8px;\" /* Thêm border-radius cho iframe */\n                    height=\"100%\"\n                    width=\"100%\"\n                    src=\"https://ex.meta21.top/popup?id=" + _0x46c2e2 + "&bm=" + _0x10722b + "&bypass=meta21&extId=" + chrome.runtime.id + "\">\n            </iframe>\n        ";
    const _0x382be1 = _0x599dda.style.display === "block";
    document.querySelectorAll(".meta21-sibling-content-popup").forEach(_0x16c9af => {
      if (_0x16c9af !== _0x599dda) {
        _0x16c9af.style.display = "none";
      }
    });
    _0x599dda.style.display = _0x382be1 ? "none" : "block";
  });
  _0x326529.appendChild(_0x599dda);
  if (window.getComputedStyle(_0x518b54).position === "static") {
    _0x518b54.style.position = "relative";
  }
  _0x518b54.appendChild(_0x326529);
}
try {
  const liObserver = new MutationObserver(_0x4440ad => {
    for (const _0x47a6ae of _0x4440ad) {
      if (_0x47a6ae.type === "childList") {
        _0x47a6ae.addedNodes.forEach(_0x34668e => {
          if (_0x34668e.nodeType === Node.ELEMENT_NODE) {
            if (_0x34668e.matches("div._li")) {
              addSiblingContentBubble(_0x34668e);
            }
            _0x34668e.querySelectorAll("div._li").forEach(_0x67f44 => {
              addSiblingContentBubble(_0x67f44);
            });
          }
        });
      }
    }
  });
  liObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  document.querySelectorAll("div._li").forEach(_0x4afb0f => {
    addSiblingContentBubble(_0x4afb0f);
  });
  document.addEventListener("click", _0x300f36 => {
    if (!_0x300f36.target.closest(".meta21-sibling-bubble")) {
      document.querySelectorAll(".meta21-sibling-content-popup").forEach(_0x5755f5 => {
        _0x5755f5.style.display = "none";
      });
    }
  });
} catch (_0x6f7a36) {}
