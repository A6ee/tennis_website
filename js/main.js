document.addEventListener("DOMContentLoaded", function () {
        const siteNav = document.getElementById("siteNav");
        const navToggle = document.querySelector(".nav-toggle");
        const navLinks = document.querySelectorAll(".nav-links a");
        const backToTop = document.getElementById("backToTop");

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
      });
