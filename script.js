(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  /* ---------- Header state ---------- */
  const header = document.querySelector("[data-header]");
  if (header) {
    let scrollFrame = null;

    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
      scrollFrame = null;
    };

    updateHeader();
    window.addEventListener(
      "scroll",
      () => {
        if (scrollFrame === null) {
          scrollFrame = window.requestAnimationFrame(updateHeader);
        }
      },
      { passive: true }
    );
  }

  /* ---------- Mobile navigation ---------- */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (menuToggle && nav) {
    const setMenu = (open, returnFocus = false) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);

      if (!open && returnFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, true);
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setMenu(false);
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 821px)");
    const closeOnDesktop = (event) => {
      if (event.matches) {
        setMenu(false);
      }
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", closeOnDesktop);
    } else {
      desktopQuery.addListener(closeOnDesktop);
    }
  }

  /* ---------- Scroll reveals ---------- */
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

  if (revealItems.length) {
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      root.classList.add("reveal-enabled");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -7% 0px",
          threshold: 0.08,
        }
      );

      revealItems.forEach((item) => observer.observe(item));

      // Anything already on screen should not wait for a scroll event.
      window.requestAnimationFrame(() => {
        revealItems.forEach((item) => {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            item.classList.add("is-visible");
          }
        });
      });
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  /* ---------- Subtle pointer glow ---------- */
  const glowVars = () => {
    if (!finePointer.matches || reduceMotion.matches) {
      return;
    }

    let frame = null;
    let pointerX = 0;
    let pointerY = 0;

    document.addEventListener(
      "pointermove",
      (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        document.body.classList.add("has-pointer");

        if (frame === null) {
          frame = window.requestAnimationFrame(() => {
            root.style.setProperty("--mx", `${pointerX}px`);
            root.style.setProperty("--my", `${pointerY}px`);
            frame = null;
          });
        }
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => {
      document.body.classList.remove("has-pointer");
    });
  };

  glowVars();

  /* ---------- Copy email ---------- */
  const copyButton = document.querySelector("[data-copy-email]");
  if (copyButton) {
    const copyLabel = copyButton.querySelector("[data-copy-label]");
    const feedback = document.querySelector("[data-copy-feedback]");
    let resetTimer = null;

    const fallbackCopy = (text) => {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "-9999px";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();

      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }

      field.remove();
      return copied;
    };

    const copyEmail = async () => {
      const email = copyButton.getAttribute("data-copy-email") || "";

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          return true;
        } catch {
          // Fall back to the selection method below.
        }
      }

      return fallbackCopy(email);
    };

    const resetCopyState = () => {
      copyButton.classList.remove("is-copied");
      if (copyLabel) {
        copyLabel.textContent = "Copy address";
      }
      if (feedback) {
        feedback.classList.remove("is-visible");
        feedback.textContent = "";
      }
    };

    copyButton.addEventListener("click", async () => {
      window.clearTimeout(resetTimer);
      const copied = await copyEmail();

      if (copied) {
        copyButton.classList.add("is-copied");
        if (copyLabel) {
          copyLabel.textContent = "Copied";
        }
        if (feedback) {
          feedback.textContent = "Email copied";
          feedback.classList.add("is-visible");
        }
      } else {
        if (feedback) {
          feedback.textContent = "Copy failed — select the address above";
          feedback.classList.add("is-visible");
        }
      }

      resetTimer = window.setTimeout(resetCopyState, 2400);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
})();
