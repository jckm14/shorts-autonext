// Shorts Auto-Next: advance to the next YouTube Short when the current one finishes.
(function () {
  if (window.__sanInstalled) return;
  window.__sanInstalled = true;
  if (typeof window.__sanEnabled === "undefined") window.__sanEnabled = true;

  var lastTime = new WeakMap();
  var lastAdvance = 0;
  var advancing = false;

  function onShorts() {
    return location.pathname.indexOf("/shorts") === 0;
  }

  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  // --- ways to move to the next Short, tried in order until the URL changes ---

  function clickNextButton() {
    var btn = document.querySelector(
      '#navigation-button-down button, button[aria-label="Next video"], button[aria-label*="Next video"]'
    );
    if (!btn) return false;
    btn.click();
    return true;
  }

  function scrollContainer(video) {
    for (var el = video && video.parentElement; el && el !== document.documentElement; el = el.parentElement) {
      var oy = getComputedStyle(el).overflowY;
      if ((oy === "scroll" || oy === "auto") && el.scrollHeight > el.clientHeight + 10) {
        el.scrollBy({ top: el.clientHeight, behavior: "smooth" });
        return true;
      }
    }
    return false;
  }

  async function swipeUp() {
    if (typeof Touch !== "function" || typeof TouchEvent !== "function") return false;
    var x = Math.round(window.innerWidth / 2);
    var startY = Math.round(window.innerHeight * 0.75);
    var endY = Math.round(window.innerHeight * 0.2);
    var target = document.elementFromPoint(x, startY) || document.body;
    function fire(type, y) {
      var t = new Touch({
        identifier: 1, target: target,
        clientX: x, clientY: y, pageX: x, pageY: y + window.scrollY, screenX: x, screenY: y,
        radiusX: 10, radiusY: 10, force: 1
      });
      var ended = type === "touchend";
      target.dispatchEvent(new TouchEvent(type, {
        bubbles: true, cancelable: true, composed: true,
        touches: ended ? [] : [t], targetTouches: ended ? [] : [t], changedTouches: [t]
      }));
    }
    fire("touchstart", startY);
    var steps = 8;
    for (var i = 1; i <= steps; i++) {
      await sleep(12);
      fire("touchmove", startY + ((endY - startY) * i) / steps);
    }
    fire("touchend", endY);
    return true;
  }

  function pressArrowDown() {
    var opts = { key: "ArrowDown", code: "ArrowDown", keyCode: 40, which: 40, bubbles: true, cancelable: true };
    document.dispatchEvent(new KeyboardEvent("keydown", opts));
    document.dispatchEvent(new KeyboardEvent("keyup", opts));
    return true;
  }

  async function advance(video) {
    var now = Date.now();
    if (advancing || now - lastAdvance < 1500) return;
    advancing = true;
    lastAdvance = now;
    var before = location.href;
    var methods = [
      clickNextButton,
      function () { return scrollContainer(video); },
      swipeUp,
      pressArrowDown
    ];
    try {
      for (var i = 0; i < methods.length; i++) {
        var tried = false;
        try { tried = await methods[i](); } catch (e) { tried = false; }
        if (!tried) continue;
        await sleep(900);
        if (location.href !== before) break;
      }
    } finally {
      lastAdvance = Date.now();
      advancing = false;
    }
  }

  // --- detect the end of the current Short ---

  function check(e) {
    var v = e.target;
    if (!v || v.tagName !== "VIDEO") return;
    if (!window.__sanEnabled || !onShorts()) return;
    if (v.paused && e.type !== "ended") return;
    var d = v.duration;
    if (!isFinite(d) || d < 1) return;

    var t = v.currentTime;
    var prev = lastTime.get(v) || 0;
    lastTime.set(v, t);

    var ended = e.type === "ended";
    var nearEnd = d - t < 0.25;                    // about to finish
    var looped = prev > d - 1 && t < 0.75;         // Shorts loop instead of ending
    if (ended || nearEnd || looped) {
      lastTime.set(v, 0);
      advance(v);
    }
  }

  // Media events don't bubble, so listen in the capture phase.
  document.addEventListener("timeupdate", check, true);
  document.addEventListener("ended", check, true);
})();
