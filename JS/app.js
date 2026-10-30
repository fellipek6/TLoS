/* No framework or build step. Works with file:// and a static HTTP server. */
(() => {
  "use strict";
  const data = window.TLOS_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const images = "assents/images/";
  const iconPaths = {
    home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
    book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-2-1-6-2-10 1Z"/>',
    sword:
      '<path d="m5 20 3-3m-4-3 6 6m-3-6L18 3h3v3L10 17M4 20l-1 1m12-14 3 3"/>',
    rune: '<path d="m12 2 8 10-8 10L4 12Z"/><path d="M12 2v20M4 12h16m-12-5 8 10m0-10-8 10"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
    person:
      '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    play: '<path d="m9 5 11 7-11 7Z"/>',
    discord:
      '<path fill="currentColor" stroke="none" d="M19.7 5.2a18 18 0 0 0-4.5-1.4l-.6 1.3a17 17 0 0 0-5.2 0l-.6-1.3a18 18 0 0 0-4.5 1.4C1.5 9.3.7 13.3 1.1 17.2a18 18 0 0 0 5.5 2.8l1.1-1.8-1.7-.8.4-.3a13 13 0 0 0 11.2 0l.4.3-1.7.8 1.1 1.8a18 18 0 0 0 5.5-2.8c.5-4.5-.8-8.4-3.2-12ZM8.5 14.8c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>',
  };
  function icon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.rune}</svg>`;
  }
  $$("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });

  // Class state: the original sprite sheets use 96px frames, six columns.
  let selectedClass = 0;
  let gender = "body";
  const classCards = $("#class-cards");
  data.classes.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "class-card";
    button.type = "button";
    button.dataset.index = index;
    button.setAttribute("aria-pressed", String(index === 0));
    button.innerHTML = `<div class="sprite-well" aria-hidden="true"><div class="sprite"></div></div><h3>${item.name}</h3><p>${item.mechanic}</p>`;
    button.addEventListener("click", () => selectClass(index));
    classCards.append(button);
  });
  function updateSprites() {
    $$(".class-card").forEach((el, i) => {
      $(".sprite", el).style.backgroundImage =
        `url("assents/sprites/${data.classes[i].id}-${gender}.png")`;
    });
  }
  function selectClass(index) {
    selectedClass = index;
    const item = data.classes[index];
    $$(".class-card").forEach((el, i) =>
      el.setAttribute("aria-pressed", String(i === index)),
    );
    $("#class-detail").innerHTML =
      `<div><span class="detail-label">${item.tag}</span><h3>${item.name}</h3><p>${item.description}</p></div><div class="detail-block"><span class="detail-label">ESTILO DE COMBATE</span><strong>${item.style}</strong><p>${item.weapon}</p></div><div class="detail-block"><span class="detail-label">MECÂNICA EXCLUSIVA</span><strong>${item.mechanic}</strong><p>${item.detail}</p></div>`;
  }
  classCards.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    selectClass(
      (selectedClass +
        (event.key === "ArrowRight" ? 1 : -1) +
        data.classes.length) %
        data.classes.length,
    );
    classCards.children[selectedClass].focus();
  });
  $$("[data-gender]").forEach((button) =>
    button.addEventListener("click", () => {
      gender = button.dataset.gender;
      $$("[data-gender]").forEach((el) =>
        el.setAttribute("aria-pressed", String(el === button)),
      );
      updateSprites();
    }),
  );
  updateSprites();
  selectClass(0);

  // Manual character carousel: no automatic advance while reading.
  let characterIndex = 0;
  data.characters.forEach((item, i) => {
    const button = document.createElement("button");
    button.className = "thumbnail";
    button.type = "button";
    button.setAttribute("aria-label", item.name);
    button.innerHTML = `<img src="${images}${item.id}.png" alt="" loading="lazy">`;
    button.addEventListener("click", () => showCharacter(i));
    $("#character-thumbnails").append(button);
  });
  function showCharacter(index) {
    characterIndex = (index + data.characters.length) % data.characters.length;
    const item = data.characters[characterIndex];
    $("#character-image").src = `${images}${item.id}.png`;
    $("#character-image").alt = item.name;
    $("#character-role").textContent = item.role;
    $("#character-name").textContent = item.name;
    $("#character-description").textContent = item.description;
    $("#character-count").textContent =
      `${String(characterIndex + 1).padStart(2, "0")} / ${String(data.characters.length).padStart(2, "0")}`;
    $$(".thumbnail").forEach((el, i) =>
      el.setAttribute("aria-pressed", String(i === characterIndex)),
    );
  }
  $("#character-prev").addEventListener("click", () =>
    showCharacter(characterIndex - 1),
  );
  $("#character-next").addEventListener("click", () =>
    showCharacter(characterIndex + 1),
  );
  $("#character-thumbnails").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    showCharacter(characterIndex + (event.key === "ArrowRight" ? 1 : -1));
    $$(".thumbnail")[characterIndex].focus();
  });
  showCharacter(0);

  // Video cards use local game artwork; YouTube loads only after a click.
  function renderVideos(filter = "todos") {
    $("#video-grid").replaceChildren();
    data.videos
      .filter((video) => filter === "todos" || video.category === filter)
      .forEach((video) => {
        const button = document.createElement("button");
        button.className = "video-card";
        button.type = "button";
        button.dataset.video = video.id;
        button.dataset.title = video.title;
        button.innerHTML = `<div class="video-poster"><img src="${images}${video.image}" alt="" loading="lazy"><span class="video-play">${icon("play")}</span><span class="video-tag">${video.label}</span></div><h3>${video.title}</h3><p>${video.description}</p>`;
        $("#video-grid").append(button);
      });
  }
  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      $$("[data-filter]").forEach((el) =>
        el.setAttribute("aria-pressed", String(el === button)),
      );
      renderVideos(button.dataset.filter);
    }),
  );
  renderVideos();
  data.gallery.forEach((item) => {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";
    button.dataset.image = images + item.image;
    button.dataset.title = item.title;
    button.dataset.note = item.note;
    button.innerHTML = `<img src="${images}${item.image}" alt="${item.title}" loading="lazy"><span>${item.title} ↗</span>`;
    $("#gallery").append(button);
  });

  // Native dialog handles focus containment and Escape. Restore focus on close.
  const modal = $("#media-modal");
  let trigger = null;
  function openMedia(button) {
    trigger = button;
    $("#modal-title").textContent = button.dataset.title;
    $("#modal-content").replaceChildren();
    $("#modal-caption").replaceChildren();
    if (button.dataset.video) {
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.video}?rel=0`;
      frame.title = button.dataset.title;
      frame.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      $("#modal-content").append(frame);
      const link = document.createElement("a");
      link.href = `https://youtu.be/${button.dataset.video}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Assistir diretamente no YouTube ↗";
      $("#modal-caption").append(
        "Se o player não estiver disponível, ",
        link,
        ".",
      );
    } else {
      const img = new Image();
      img.src = button.dataset.image;
      img.alt = button.dataset.title;
      $("#modal-content").append(img);
      $("#modal-caption").textContent =
        button.dataset.note || "Captura de The Labyrinth of Six.";
    }
    modal.showModal();
    document.body.classList.add("modal-open");
    $("#modal-close").focus();
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-video], [data-image]");
    if (button) openMedia(button);
  });
  $("#modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      const rect = modal.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        modal.close();
    }
  });
  modal.addEventListener("close", () => {
    $("#modal-content").replaceChildren();
    document.body.classList.remove("modal-open");
    trigger?.focus({ preventScroll: true });
  });

  // Smooth eased scroll for in-page links.
  let scrollFrame = 0;
  function smoothScrollTo(target) {
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const start = window.scrollY;
    const end = Math.max(0, target.getBoundingClientRect().top + start - offset);
    const distance = end - start;
    if (Math.abs(distance) < 2) {
      window.scrollTo({ top: end, behavior: "instant" });
      return;
    }
    const duration = Math.min(1400, 500 + Math.abs(distance) * 0.25);
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const startTime = performance.now();
    cancelAnimationFrame(scrollFrame);
    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      window.scrollTo({ top: start + distance * ease(progress), behavior: "instant" });
      if (progress < 1) scrollFrame = requestAnimationFrame(step);
    };
    scrollFrame = requestAnimationFrame(step);
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.hash.length < 2) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    smoothScrollTo(target);
    history.pushState(null, "", link.hash);
  });
  ["wheel", "touchstart", "keydown"].forEach((type) =>
    window.addEventListener(type, () => cancelAnimationFrame(scrollFrame), { passive: true }),
  );

  // Active navigation follows the reading position.
  const sections = $$("main > section");
  const dockLinks = $$(".dock a");
  let ticking = false;
  function updateNavigation() {
    const marker = window.innerHeight * 0.35;
    let active = sections[0].id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) active = section.id;
    });
    dockLinks.forEach((link) => {
      const current = link.hash === `#${active}`;
      link.classList.toggle("active", current);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateNavigation);
        ticking = true;
      }
    },
    { passive: true },
  );
  updateNavigation();
  const progress = $("#dev-progress");
  if (progress && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        progress.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(progress);
  } else if (progress) {
    progress.classList.add("is-visible");
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let i = 0; i < 16; i++) {
      const ember = document.createElement("i");
      ember.className = "ember";
      ember.style.left = `${15 + Math.random() * 80}%`;
      ember.style.top = `${30 + Math.random() * 65}%`;
      ember.style.animationDelay = `${-Math.random() * 12}s`;
      ember.style.animationDuration = `${8 + Math.random() * 10}s`;
      $(".embers").append(ember);
    }
  }
})();
