document.addEventListener("DOMContentLoaded", function () {
  var appVersion = "20260526-2";
  var versionCookie = "carta_version=" + appVersion;

  if (!document.cookie.includes(versionCookie)) {
    document.cookie = versionCookie + "; path=/; max-age=31536000; SameSite=Lax";
  }

  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".main-menu");
  var backTop = document.querySelector(".back-top");

  if (toggle && menu) {
    var backdrop = document.createElement("div");
    backdrop.className = "menu-backdrop";
    document.body.appendChild(backdrop);

    function closeMenu() {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    }

    function openMenu() {
      toggle.classList.add("is-open");
      menu.classList.add("is-open");
      backdrop.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menú");
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

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
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
