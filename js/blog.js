/* ============================================================
   TRANS-KOP - BLOG SPECIFIC SCRIPTS
   Handles: blog filters (list) + post TOC & reading progress
   ============================================================ */
(function () {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [
    ...context.querySelectorAll(selector),
  ];

  /* Blog listing filters */
  const initBlogFilters = () => {
    const filterBar = $(".blog-filter-bar");
    if (!filterBar) return;

    const buttons = $$(".filter-chip", filterBar);
    const cards = $$(".blog-card");

    const applyFilter = (value) => {
      cards.forEach((card) => {
        const category = card.dataset.category;
        const show = value === "all" || category === value;
        card.style.display = show ? "" : "none";
      });
    };

    const handleClick = (btn) => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const value = btn.dataset.filter || "all";
      applyFilter(value);
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => handleClick(btn));
    });
  };

  /* Blog post TOC + reading progress + reading time */
  const initBlogPostEnhancements = () => {
    const content = $("#postContent");
    const tocList = $("#tocList");
    const progressBar = $("#readingProgress");
    const readingTimeEl = $(".reading-time");

    if (content && tocList) {
      const headings = $$("h2, h3", content);
      const slugify = (text) =>
        text
          .toLowerCase()
          .replace(/ą/g, "a")
          .replace(/ę/g, "e")
          .replace(/ł/g, "l")
          .replace(/ś/g, "s")
          .replace(/ć/g, "c")
          .replace(/ó/g, "o")
          .replace(/ń/g, "n")
          .replace(/[żź]/g, "z")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      tocList.innerHTML = "";
      headings.forEach((heading) => {
        if (!heading.id) {
          heading.id = slugify(heading.textContent.trim());
        }
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent.trim();
        a.dataset.targetId = heading.id;
        li.appendChild(a);
        tocList.appendChild(li);
      });

      tocList.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        e.preventDefault();
        const target = document.getElementById(link.dataset.targetId);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      const onScrollSpy = () => {
        const offset = 120;
        let activeId = "";
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top - offset <= 0) activeId = heading.id;
        });
        $$(".toc-list a", tocList).forEach((a) => {
          a.classList.toggle("active", a.dataset.targetId === activeId);
        });
      };
      window.addEventListener("scroll", onScrollSpy, { passive: true });
      onScrollSpy();
    }

    if (progressBar && content) {
      const updateProgress = () => {
        const articleHeight = content.scrollHeight;
        const viewport = window.innerHeight;
        const scrollY = window.scrollY;
        const offsetTop = content.getBoundingClientRect().top + scrollY;
        const progressRaw =
          ((scrollY - offsetTop) / (articleHeight - viewport)) * 100;
        const progress = Math.min(100, Math.max(0, progressRaw));
        progressBar.style.width = `${progress}%`;
      };
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      updateProgress();
    }

    if (readingTimeEl && content) {
      const text = content.textContent || "";
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const wpm = parseInt(readingTimeEl.dataset.wpm, 10) || 220;
      const minutes = Math.max(1, Math.round(words / wpm));
      const valueEl = readingTimeEl.querySelector(".reading-time__value");
      if (valueEl) {
        valueEl.textContent = minutes;
      } else {
        readingTimeEl.innerHTML = `<i class="fas fa-clock"></i> ${minutes} minut czytania`;
      }
    }
  };

  const init = () => {
    initBlogFilters();
    initBlogPostEnhancements();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
