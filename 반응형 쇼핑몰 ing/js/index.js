// <!-- scroll에 반응하는 header ------------------------------------------------------------------  -->
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


    const box = document.querySelector(".visual");

    // 초기 사이즈 설정
    function setHeight() {
      const width = window.innerWidth;
      // 폭 구간별로 비율 조정: 데스크톱 16:9, 태블릿 3:2, 모바일 4:3
      let ratioW = 2, ratioH = 1;      if (width <= 768) {
        ratioW = 1; ratioH = 1;
      }
      const height = (width * ratioH) / ratioW;
      box.style.height = `${height}px`;
    }

    // 페이지 로드 시 한 번 실행
    window.addEventListener("load", setHeight);

    // 창 크기 변경 시마다 실행
    window.addEventListener("resize", setHeight);

// <!-- AOS init ------------------------------------------------------------------  -->
  (function () {
    if (window.AOS) {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        mirror: false
      });
    }
  })();

// <!-- main-swiper ------------------------------------------------------------------  -->
  var swiper = new Swiper(".visual-swiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "bullets",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
    autoplay: {
      delay: 3000,
    },
    effect: "fade",
  });



// <!-- products-swiper ------------------------------------------------------------------ -->
  var swiper = new Swiper(".products-swiper", {
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoHeight: true,
    loop: true,
    slidesPerView: 4,
    spaceBetween: 20,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      }
    },
    autoplay: {
      delay:3000,
    }

  });



// <!-- category tabs ------------------------------------------------------------------ -->
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

// quick menu show/hide and actions ------------------------------------------------------
(function () {
  var quickMenu = document.getElementById('quickMenu');
  if (!quickMenu) return;

  function toggleQuickMenu() {
    if (window.scrollY > 0) quickMenu.classList.add('is-visible');
    else quickMenu.classList.remove('is-visible');
  }
  toggleQuickMenu();
  window.addEventListener('scroll', toggleQuickMenu);

  var scrollUpBtn = quickMenu.querySelector('.jsScrollUp');
  if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// 모바일 네비게이션 메뉴 ------------------------------------------------------
(function () {
  var menuBtn = document.getElementById('btn_menu');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavOverlay = document.getElementById('mobileNavOverlay');
  var mobileNavClose = document.getElementById('mobileNavClose');

  if (!menuBtn || !mobileNav || !mobileNavOverlay || !mobileNavClose) return;

  function openMobileNav() {
    mobileNav.classList.add('is-open');
    mobileNavOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    mobileNavOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openMobileNav();
  });

  mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavOverlay.addEventListener('click', closeMobileNav);

  // 모바일 메뉴 링크 클릭 시 메뉴 닫기
  var mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-menu a');
  mobileNavLinks.forEach(function(link) {
    link.addEventListener('click', closeMobileNav);
  });

  // ESC 키로 메뉴 닫기
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMobileNav();
    }
  });
})();