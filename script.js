document.addEventListener("DOMContentLoaded", function () {
  var appVersion = "20260526-10";
  var versionCookie = "carta_version=" + appVersion;

  if (!document.cookie.includes(versionCookie)) {
    document.cookie = versionCookie + "; path=/; max-age=31536000; SameSite=Lax";
  }

  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".main-menu");
  var backTop = document.querySelector(".back-top");
  var installPanel = document.querySelector("[data-install-panel]");
  var installAction = document.querySelector("[data-install-action]");
  var installAndroid = document.querySelector("[data-install-android]");
  var installIos = document.querySelector("[data-install-ios]");
  var installPrompt = null;
  var urlParams = new URLSearchParams(window.location.search);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(function () {});
  }

  if (urlParams.get("source") === "pwa") {
    localStorage.setItem("carta_installed", "true");
  }

  function isInstalledApp() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.navigator.standalone === true ||
      localStorage.getItem("carta_installed") === "true"
    );
  }

  function getDevice() {
    var platform = navigator.platform || "";
    var userAgent = navigator.userAgent || "";
    var touchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1;

    if (/android/i.test(userAgent)) {
      return "android";
    }

    if (/iphone|ipad|ipod/i.test(userAgent) || touchMac) {
      return "ios";
    }

    return "other";
  }

  function updateInstallPanel() {
    if (!installPanel) {
      return;
    }

    var device = getDevice();
    var shouldHide = isInstalledApp() || device === "other";

    if (installAndroid) {
      installAndroid.hidden = device !== "android";
    }

    if (installIos) {
      installIos.hidden = device !== "ios";
    }

    installPanel.hidden = shouldHide;
    document.body.classList.toggle("has-install-panel", !shouldHide);
  }

  updateInstallPanel();

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    installPrompt = event;
    if (installAction) {
      installAction.textContent = "Instalar la carta";
    }
    updateInstallPanel();
  });

  window.addEventListener("appinstalled", function () {
    installPrompt = null;
    localStorage.setItem("carta_installed", "true");
    updateInstallPanel();
  });

  if (installAction) {
    installAction.addEventListener("click", function () {
      if (!installPrompt) {
        installAction.textContent = "Abre Chrome y usa Instalar app";
        return;
      }

      installPrompt.prompt();
      installPrompt.userChoice.finally(function () {
        installPrompt = null;
        updateInstallPanel();
      });
    });
  }

  ["(display-mode: standalone)", "(display-mode: fullscreen)"].forEach(function (query) {
    var mediaQuery = window.matchMedia(query);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateInstallPanel);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(updateInstallPanel);
    }
  });

  if (toggle && menu) {
    var backdrop = document.createElement("div");
    backdrop.className = "menu-backdrop";
    document.body.appendChild(backdrop);

    function closeMenu() {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    }

    function openMenu() {
      toggle.classList.add("is-open");
      menu.classList.add("is-open");
      backdrop.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menu");
    }

    toggle.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    function goToMenuLink(link, event) {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      if (typeof event.button === "number" && event.button !== 0) {
        return;
      }

      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#") {
        closeMenu();
        return;
      }

      event.preventDefault();
      closeMenu();
      window.location.assign(new URL(href, window.location.href).href);
    }

    menu.querySelectorAll("a").forEach(function (link) {
      var navigating = false;

      ["pointerup", "touchend", "click"].forEach(function (eventName) {
        link.addEventListener(eventName, function (event) {
          if (navigating) {
            event.preventDefault();
            return;
          }

          navigating = true;
          goToMenuLink(link, event);
        });
      });
    });
  }

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
