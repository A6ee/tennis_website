document.addEventListener("DOMContentLoaded", function () {
  const siteNav = document.getElementById("siteNav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const backToTop = document.getElementById("backToTop");

  /* =========================
     分頁切換後回到頁面頂端
     只在點擊站內導覽連結後啟用，避免影響一般上一頁/下一頁操作
  ========================= */
  if (sessionStorage.getItem("joinPageNavToTop") === "1") {
    sessionStorage.removeItem("joinPageNavToTop");

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    window.requestAnimationFrame(function () {
      window.scrollTo(0, 0);
    });

    window.setTimeout(function () {
      window.scrollTo(0, 0);
    }, 100);
  }

  let ticking = false;

  function updateScrollState() {
    if (siteNav) {
      if (window.scrollY > 80) {
        siteNav.classList.add("scrolled");
      } else {
        siteNav.classList.remove("scrolled");
      }
    }

    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }

    ticking = false;
  }

  updateScrollState();

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    },
    { passive: true },
  );

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (siteNav) {
        siteNav.classList.remove("is-open");
      }

      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }

      const href = link.getAttribute("href");

      if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:")
      ) {
        sessionStorage.setItem("joinPageNavToTop", "1");
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* =========================
     首頁動畫
     About 使用 about-animation-ready，避免舊 reveal-ready 導致內容消失
  ========================= */

  const aboutItems = document.querySelectorAll(".js-about-reveal");
  const revealItems = document.querySelectorAll(".reveal");

  if (aboutItems.length) {
    document.documentElement.classList.add("about-animation-ready");
  }

  if (revealItems.length) {
    document.documentElement.classList.add("motion-ready");
  }

  function showElement(element) {
    element.classList.add("is-visible");
  }

  if ("IntersectionObserver" in window) {
    const aboutObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    aboutItems.forEach(function (element) {
      aboutObserver.observe(element);
    });

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.24,
        rootMargin: "0px 0px -16% 0px",
      },
    );

    revealItems.forEach(function (element, index) {
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 70, 420)}ms`,
      );
      revealObserver.observe(element);
    });
  } else {
    aboutItems.forEach(showElement);
    revealItems.forEach(showElement);
  }

  // 安全保險：若瀏覽器或 CSS 衝突導致觀察失敗，1.6 秒後強制顯示 About。
  window.setTimeout(function () {
    aboutItems.forEach(showElement);
  }, 1600);

  /* =========================
     課程頁：左右交錯滑入動畫
     桌機：第一張卡片獨立延遲進場，避免先合併再分開
     手機：四張卡片統一用滾動觸發，進場方式一致
  ========================= */
  const courseSlideCards = document.querySelectorAll(".js-course-slide");

  if (courseSlideCards.length) {
    document.documentElement.classList.add("course-animation-ready");

    const isDesktopCourseLayout =
      window.matchMedia("(min-width: 981px)").matches;
    const firstCourseCard = courseSlideCards[0];

    const cardsForObserver =
      isDesktopCourseLayout && firstCourseCard
        ? Array.from(courseSlideCards).slice(1)
        : Array.from(courseSlideCards);

    function showCourseCard(card) {
      if (!card) return;

      card.classList.add("is-visible");

      if (card === firstCourseCard) {
        window.setTimeout(function () {
          document.documentElement.classList.remove("course-first-preload");
        }, 1900);
      }
    }

    if (isDesktopCourseLayout && firstCourseCard) {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          window.setTimeout(function () {
            showCourseCard(firstCourseCard);
          }, 560);
        });
      });
    } else {
      document.documentElement.classList.remove("course-first-preload");
    }

    if ("IntersectionObserver" in window) {
      const courseObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              showCourseCard(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.28,
          rootMargin: "0px 0px -18% 0px",
        },
      );

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          cardsForObserver.forEach(function (card) {
            courseObserver.observe(card);
          });
        });
      });
    } else {
      cardsForObserver.forEach(showCourseCard);
    }
  }
});
