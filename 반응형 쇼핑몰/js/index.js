// <!-- scroll에 반응하는 header  -->
  (function () {
    function setVhVar() {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", vh + "px");
    }
    setVhVar();
    window.addEventListener("resize", setVhVar);

    var headerEl = document.querySelector("header");
    function toggleHeaderBg() {
      if (!headerEl) return;
      if (window.scrollY > 10) headerEl.classList.add("scrolled");
      else headerEl.classList.remove("scrolled");
    }
    toggleHeaderBg();
    window.addEventListener("scroll", toggleHeaderBg);
  })();

// <!-- Swiper  -->
  var swiper = new Swiper(".visual-swiper", {
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
  });

// <!-- community -->
  var swiper = new Swiper(".community-swiper", {
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

// <!-- category tabs -->
(function () {
  var categoryInner = document.querySelector('.category-inner');
  if (!categoryInner) return;

  var tabs = categoryInner.querySelectorAll('ul li');
  var boxes = categoryInner.querySelectorAll('.category-box');
  if (!tabs.length || !boxes.length) return;

  function activate(index) {
    tabs.forEach(function (tab, i) {
      if (i === index) tab.classList.add('on');
      else tab.classList.remove('on');
    });
    boxes.forEach(function (box, i) {
      if (i === index) box.classList.add('on');
      else box.classList.remove('on');
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activate(index);
    });
  });
})();