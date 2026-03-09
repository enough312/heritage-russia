(function () {
  const content = window.siteContent;

  if (!content) {
    return;
  }

  const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];
  const VIDEO_EXTENSIONS = ["mp4"];
  const AUDIO_EXTENSIONS = ["mp3"];
  const IMAGE_FILE_OVERRIDES = {
    "Ысыах": ["Ысыах.webp"],
    "Блюда из оленины и северной рыбы": ["Блюда из оленины и северной рыбы.jpeg"]
  };

  const MUSIC_AUDIO_OVERRIDES = {
    "Кантеле и руническое пение": [
      "Рунический напев Калевальского района на кантеле.mp4"
    ],
    "Татарские баиты и лирическая песня": [
      "Карьят Батыр — баит сибирских татар. Исполняет мужской хор Гос ансамбля песни и танца РТ, 2019 год.mp4"
    ],
    "Курай": [
      "Урал -  башкирская народная музыка  - курай.mp4"
    ],
    "Чувашские обрядовые напевы": [
      "Чувашский фольклорный обрядовый танец Аххаяс [get.gt].mp4"
    ],
    "Осетинский Симд": [
      "Осетинский танец Симд Ансамбль Сармат Ossetian dance Simd Ensemble Sarmat [get.gt].mp4"
    ],
    "Бурятский ёхор": [
      "Бурятский танец - Ёхор на канале ZaanOnline [get.gt].mp4"
    ],
    "Олонхо": [
      "Якутский героический эпос Олонхо Олоҥхо Olonkho yakut [get.gt].mp4"
    ],
    "Ненецкие личные песни": [
      "ненецкие песни.mp4"
    ]
  };

  const TELEGRAM_PREFIX = "https://t.me/";
  const HEADER_COLLAPSE_KEY = "heritageHeaderCollapsed";

  document.addEventListener("DOMContentLoaded", function () {
    const pageId = document.body.dataset.page || "home";

    renderSiteShell(pageId);
    renderMediaLightbox();
    renderHome();
    renderPeoples();
    renderTraditions();
    renderCrafts();
    renderCuisine();
    renderMusic();
    renderRoutes();
    renderPreservation();
    initNavigation();
    initHeaderToggle();
    initHints();
    initMediaInteractions();
    initReveal();
  });

  function renderSiteShell(pageId) {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    const year = new Date().getFullYear();
    const tgLink = resolveTelegramLink(content.site.feedback.telegram);

    if (header) {
      const navLinks = content.pages
        .map(function (page) {
          const current = page.id === pageId ? ' aria-current="page"' : "";
          return `<a class="site-nav__link" href="${page.href}"${current}>${escapeHtml(page.label)}</a>`;
        })
        .join("");

      header.innerHTML = `
        <div class="site-header__inner">
          <div class="site-header__top">
            <a class="brand" href="index.html" aria-label="На главную">
              <span class="brand__seal" aria-hidden="true"></span>
              <span class="brand__meta">
                <span class="brand__title">${escapeHtml(content.site.title)}</span>
                <span class="brand__subtitle">${escapeHtml(content.site.subtitle)}</span>
              </span>
            </a>
            <div class="site-header__controls">
              <div class="site-header__contacts" aria-label="Контакты автора">
                <a class="contact-pill" href="mailto:${escapeHtml(content.site.feedback.email)}">Почта</a>
                <a class="contact-pill" href="${escapeHtml(tgLink)}" target="_blank" rel="noreferrer">Telegram</a>
              </div>
              <button class="header-toggle" type="button" data-header-toggle aria-controls="site-nav" aria-expanded="true">Скрыть вкладки</button>
            </div>
          </div>
          <nav id="site-nav" class="site-nav" aria-label="Основная навигация">
            ${navLinks}
          </nav>
        </div>
      `;
    }

    if (footer) {
      footer.innerHTML = `
        <div class="site-footer__inner site-footer__inner--compact">
          <div class="footer-bottom">
            <span>Конкурсный сайт о культурном наследии народов России</span>
            <span>${year}</span>
          </div>
        </div>
      `;
    }
  }

  function renderMediaLightbox() {
    let root = document.getElementById("media-lightbox-root");

    if (!root) {
      root = document.createElement("div");
      root.id = "media-lightbox-root";
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div class="media-lightbox" aria-hidden="true">
        <div class="media-lightbox__backdrop" data-close-lightbox></div>
        <div class="media-lightbox__stage">
          <button class="media-lightbox__close" type="button" aria-label="Закрыть" data-close-lightbox>×</button>
          <div class="media-lightbox__head">
            <div class="media-lightbox__meta"></div>
            <p class="media-lightbox__title"></p>
          </div>
          <img class="media-lightbox__image" alt="">
          <button class="media-lightbox__caption" type="button" data-close-lightbox>
            <span class="media-lightbox__info"></span>
            <span class="media-lightbox__details"></span>
            <span class="media-lightbox__caption-hint">Нажми на плашку, чтобы закрыть</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderHome() {
    const statsContainer = document.getElementById("home-stats");
    const regionsContainer = document.getElementById("home-regions");
    const spotlightsContainer = document.getElementById("home-spotlights");

    if (statsContainer) {
      statsContainer.innerHTML = content.site.stats
        .map(function (stat) {
          return `
            <article class="stat-card" data-reveal>
              <span class="stat-card__value">${escapeHtml(stat.value)}</span>
              <span class="stat-card__label">${escapeHtml(stat.label)}</span>
            </article>
          `;
        })
        .join("");
    }

    if (regionsContainer) {
      const grouped = groupBy(content.peoples, "macroRegion");
      regionsContainer.innerHTML = Object.keys(grouped)
        .map(function (region) {
          const peoples = grouped[region];
          return `
            <article class="feature-card" data-reveal>
              <div class="feature-card__topline">
                <span class="badge">${escapeHtml(region)}</span>
                <span class="token">${peoples.length} культурных акцента</span>
              </div>
              <h3>${escapeHtml(region)}</h3>
              <p>${escapeHtml(peoples.map(function (item) { return item.name; }).join(", "))}.</p>
            </article>
          `;
        })
        .join("");
    }

    if (spotlightsContainer) {
      const items = [
        {
          title: "Народы и регионы",
          subtitle: "Обзор",
          description: "Сравните восемь культурных маршрутов от Карелии до Арктики и проследите, как меняются дом, костюм, орнамент и музыка.",
          chips: ["регионы", "традиции", "образы"],
          accent: "#8f4326"
        },
        {
          title: "Праздники и календарь",
          subtitle: "Сезоны",
          description: "Летние и осенние праздники, зимние посиделки, ярмарки и кочевые циклы показывают живой ритм культуры.",
          chips: ["Сабантуй", "Ысыах", "Сурхарбан"],
          accent: "#2f5648"
        },
        {
          title: "Кухня, музыка и ремесла",
          subtitle: "Практика",
          description: "Новые разделы сайта связывают блюда, фольклор, эпос и предметный мир в единый культурный маршрут.",
          chips: ["кухня", "фольклор", "ремесло"],
          accent: "#b45f3f"
        },
        {
          title: "Маршруты и сохранение",
          subtitle: "Современность",
          description: "Виртуальные музеи, архивы и локальные маршруты помогают увидеть наследие как часть сегодняшней жизни.",
          chips: ["музеи", "архивы", "карты"],
          accent: "#496f81"
        }
      ];

      spotlightsContainer.innerHTML = items.map(buildCard).join("");
    }
  }

  function renderPeoples() {
    const filterContainer = document.getElementById("peoples-filters");
    const grid = document.getElementById("peoples-grid");

    if (!filterContainer || !grid) {
      return;
    }

    renderFilterButtons(filterContainer, "peoples-grid", ["Все"].concat(uniqueValues(content.peoples, "macroRegion")));

    grid.innerHTML = content.peoples
      .map(function (person) {
        return `
          <article class="card card--media" data-filter-value="${escapeAttribute(person.macroRegion)}" style="--card-accent:${escapeAttribute(person.accent)};" data-reveal>
            <div class="card__toolbar">
              ${buildImageThumb(person.name, person.name, person.summary)}
            </div>
            <div class="card__title-row">
              <h3>${escapeHtml(person.name)}</h3>
              <span class="badge">${escapeHtml(person.macroRegion)}</span>
            </div>
            <div class="card__meta">
              <span class="token">${escapeHtml(person.region)}</span>
            </div>
            <p>${escapeHtml(person.summary)}</p>
            <div class="chip-list">${person.markers.map(function (marker) {
              return `<span class="chip">${escapeHtml(marker)}</span>`;
            }).join("")}</div>
          </article>
        `;
      })
      .join("");
  }

  function renderTraditions() {
    const filterContainer = document.getElementById("traditions-filters");
    const timeline = document.getElementById("traditions-timeline");

    if (!filterContainer || !timeline) {
      return;
    }

    renderFilterButtons(filterContainer, "traditions-timeline", ["Все"].concat(uniqueValues(content.festivals, "season")));

    timeline.classList.add("tradition-grid");
    timeline.innerHTML = content.festivals
      .map(function (festival) {
        const candidates = buildImageCandidates(festival.name);
        return `
          <button class="tradition-card" type="button" data-filter-value="${escapeAttribute(festival.season)}" data-open-tradition data-media-title="${escapeAttribute(festival.name)}" data-media-description="${escapeAttribute(festival.description)}" data-media-meta="${escapeAttribute([festival.season, festival.people, festival.region].join("|"))}" data-media-details="${escapeAttribute((festival.details || []).join("|"))}" data-image-candidates="${escapeAttribute(candidates.join("|"))}" data-reveal>
            <img class="media-source media-source--image" data-candidates="${escapeAttribute(candidates.join("|"))}" alt="${escapeAttribute(festival.name)}">
            <span class="media-source__fallback">${escapeHtml(initials(festival.name))}</span>
            <span class="tradition-card__overlay">
              <span class="tradition-card__meta">
                <span class="token">${escapeHtml(festival.season)}</span>
                <span class="token">${escapeHtml(festival.people)}</span>
              </span>
              <strong>${escapeHtml(festival.name)}</strong>
            </span>
          </button>
        `;
      })
      .join("");
  }

  function renderCrafts() {
    const filterContainer = document.getElementById("crafts-filters");
    const grid = document.getElementById("crafts-grid");

    if (!filterContainer || !grid) {
      return;
    }

    renderFilterButtons(filterContainer, "crafts-grid", ["Все"].concat(uniqueValues(content.crafts, "category")));

    grid.innerHTML = content.crafts
      .map(function (craft) {
        return `
          <article class="card card--media" data-filter-value="${escapeAttribute(craft.category)}" style="--card-accent:${escapeAttribute(craft.accent)};" data-reveal>
            <div class="card__toolbar">
              ${buildImageThumb(craft.name, craft.name, craft.description)}
            </div>
            <div class="card__title-row">
              <h3>${escapeHtml(craft.name)}</h3>
              <span class="badge">${escapeHtml(craft.category)}</span>
            </div>
            <div class="card__meta">
              <span class="token">${escapeHtml(craft.people)}</span>
              <span class="token">${escapeHtml(craft.region)}</span>
              <span class="token">${escapeHtml(craft.material)}</span>
            </div>
            <p>${escapeHtml(craft.description)}</p>
          </article>
        `;
      })
      .join("");
  }

  function renderCuisine() {
    const grid = document.getElementById("cuisine-grid");

    if (!grid) {
      return;
    }

    grid.innerHTML = content.cuisines
      .map(function (dish) {
        return `
          <article class="card card--media" style="--card-accent:#c29c54;" data-reveal>
            <div class="card__toolbar">
              ${buildImageThumb(dish.name, dish.name, dish.description)}
            </div>
            <div class="card__title-row">
              <h3>${escapeHtml(dish.name)}</h3>
              <span class="badge">${escapeHtml(dish.region)}</span>
            </div>
            <div class="card__meta">
              <span class="token">${escapeHtml(dish.people)}</span>
              <span class="token">${escapeHtml(dish.ingredients)}</span>
            </div>
            <p>${escapeHtml(dish.description)}</p>
          </article>
        `;
      })
      .join("");
  }

  function renderMusic() {
    const grid = document.getElementById("music-grid");

    if (!grid) {
      return;
    }

    grid.innerHTML = content.music
      .map(function (item) {
        const imageThumb = buildImageThumb(item.name, item.name, item.description);
        const videoCandidates = buildMusicMediaCandidates(item.name);
        const motifMarkup = (item.motifs || [])
          .map(function (motif) {
            return `<span class="chip">${escapeHtml(motif)}</span>`;
          })
          .join("");

        return `
          <article class="flip-card" data-reveal>
            <div class="flip-card__inner">
              <section class="flip-card__face flip-card__face--front card card--media" style="--card-accent:#4b6d62;">
                <div class="card__toolbar card__toolbar--music">
                  <div class="card__toolbar-main">
                    ${imageThumb}
                    <button class="card__flip" type="button" data-flip-card aria-label="Перевернуть карточку" title="Перевернуть карточку">↺</button>
                  </div>
                  <span class="badge">${escapeHtml(item.form)}</span>
                </div>
                <div class="card__title-row card__title-row--solo">
                  <h3>${escapeHtml(item.name)}</h3>
                </div>
                <div class="card__meta">
                  <span class="token">${escapeHtml(item.people)}</span>
                  <span class="token">${escapeHtml(item.region)}</span>
                </div>
                <p>${escapeHtml(item.description)}</p>
                <div class="music-note">
                  <p class="music-note__label">Культурный образ</p>
                  <p class="music-note__text">${escapeHtml(item.focus || item.description)}</p>
                </div>
                ${motifMarkup ? `<div class="chip-list chip-list--music">${motifMarkup}</div>` : ""}
              </section>
              <section class="flip-card__face flip-card__face--back card card--media" style="--card-accent:#4b6d62;">
                <div class="card__toolbar card__toolbar--music">
                  <div class="card__toolbar-main">
                    ${buildImageThumb(item.name, item.name, item.description)}
                    <button class="card__flip" type="button" data-flip-card aria-label="Вернуть карточку назад" title="Вернуть карточку назад">↻</button>
                  </div>
                  <span class="badge">Фрагмент фольклора</span>
                </div>
                <div class="card__title-row card__title-row--solo">
                  <h3>${escapeHtml(item.name)}</h3>
                </div>
                <div class="music-fragment">
                  <p class="music-fragment__label">Фольклорный фрагмент</p>
                  <blockquote class="music-fragment__quote">${escapeHtml(item.excerpt || "Голос, ритм и память народа соединяются в живом звучании.")}</blockquote>
                </div>
                <div class="player-shell">
                  <video class="player-shell__media" controls playsinline preload="metadata" data-candidates="${escapeAttribute(videoCandidates.join("|"))}"></video>
                </div>
                <div class="player-shell__actions">
                  <button class="button button--secondary" type="button" data-media-fullscreen>Полный экран</button>
                  <button class="button button--secondary" type="button" data-flip-card>Перевернуть обратно</button>
                </div>
              </section>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderRoutes() {
    const grid = document.getElementById("routes-grid");

    if (!grid) {
      return;
    }

    grid.innerHTML = content.routes
      .map(function (route) {
        return `
          <article class="card card--media" style="--card-accent:#496f81;" data-reveal>
            <div class="card__toolbar">
              ${buildImageThumb(route.title, route.title, route.description)}
            </div>
            <div class="card__title-row">
              <h3>${escapeHtml(route.title)}</h3>
              <span class="badge">${escapeHtml(route.region)}</span>
            </div>
            <p>${escapeHtml(route.description)}</p>
            <div class="chip-list">${route.highlights.map(function (point) {
              return `<span class="chip">${escapeHtml(point)}</span>`;
            }).join("")}</div>
          </article>
        `;
      })
      .join("");
  }

  function renderPreservation() {
    const grid = document.getElementById("preservation-grid");
    const accordion = document.getElementById("preservation-accordion");

    if (grid) {
      grid.innerHTML = content.preservation
        .map(function (item) {
          return `
            <article class="feature-card" data-reveal>
              <div class="feature-card__topline">
                <span class="badge">${escapeHtml(item.type)}</span>
              </div>
              <h3>${escapeHtml(item.title)}</h3>
              <p><strong>Пример:</strong> ${escapeHtml(item.example)}</p>
              <p>${escapeHtml(item.value)}</p>
            </article>
          `;
        })
        .join("");
    }

    if (accordion) {
      accordion.innerHTML = content.preservation
        .map(function (item, index) {
          const isOpen = index === 0 ? " open" : "";
          return `
            <details class="accordion__item"${isOpen} data-reveal>
              <summary class="accordion__summary">
                <div>
                  <p class="eyebrow">${escapeHtml(item.type)}</p>
                  <h3>${escapeHtml(item.title)}</h3>
                </div>
              </summary>
              <div class="accordion__body">
                <p><strong>Почему это важно:</strong> ${escapeHtml(item.value)}</p>
                <p><strong>Что можно сделать:</strong> ${escapeHtml(item.action)}</p>
              </div>
            </details>
          `;
        })
        .join("");
    }
  }

  function initNavigation() {
    const nav = document.getElementById("site-nav");

    if (!nav) {
      return;
    }

    nav.addEventListener("click", function (event) {
      const link = event.target.closest("a");
      if (link) {
        nav.classList.remove("is-open");
      }
    });

    document.addEventListener("click", function (event) {
      const button = event.target.closest(".filter-button");
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const targetId = button.dataset.target;
      const value = button.dataset.value;

      if (!targetId || !value) {
        return;
      }

      const container = document.getElementById(targetId);
      if (!container) {
        return;
      }

      Array.from(document.querySelectorAll(".filter-button")).forEach(function (item) {
        if (item.dataset.target === targetId) {
          item.classList.remove("is-active");
        }
      });
      button.classList.add("is-active");

      Array.from(container.children).forEach(function (item) {
        const shouldShow = value === "Все" || item.getAttribute("data-filter-value") === value;
        item.classList.toggle("is-hidden", !shouldShow);
      });
    });
  }

  function initHints() {
    const hints = Array.from(document.querySelectorAll(".hint"));

    hints.forEach(function (hint) {
      hint.addEventListener("click", function (event) {
        event.preventDefault();

        const isOpen = hint.classList.toggle("is-open");
        hint.setAttribute("aria-expanded", String(isOpen));

        hints.forEach(function (otherHint) {
          if (otherHint !== hint) {
            otherHint.classList.remove("is-open");
            otherHint.setAttribute("aria-expanded", "false");
          }
        });
      });
    });

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      hints.forEach(function (hint) {
        if (!hint.contains(target)) {
          hint.classList.remove("is-open");
          hint.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  function initMediaInteractions() {
    initImageElements();

    document.addEventListener("click", function (event) {
      const imageButton = event.target.closest("[data-open-image]");
      if (imageButton) {
        openLightbox(
          imageButton.dataset.mediaTitle || "",
          imageButton.dataset.mediaDescription || "",
          splitCandidates(imageButton.dataset.imageCandidates)
        );
        return;
      }

      const traditionButton = event.target.closest("[data-open-tradition]");
      if (traditionButton) {
        openLightbox(
          traditionButton.dataset.mediaTitle || "",
          traditionButton.dataset.mediaDescription || "",
          splitCandidates(traditionButton.dataset.imageCandidates),
          {
            showInfoPanel: true,
            meta: splitCandidates(traditionButton.dataset.mediaMeta),
            details: splitCandidates(traditionButton.dataset.mediaDetails)
          }
        );
        return;
      }

      const flipButton = event.target.closest("[data-flip-card]");
      if (flipButton) {
        const card = flipButton.closest(".flip-card");
        if (card) {
          card.classList.toggle("is-flipped");
          if (card.classList.contains("is-flipped")) {
            ensureFlipCardMedia(card);
          }
        }
        return;
      }

      const fullscreenButton = event.target.closest("[data-media-fullscreen]");
      if (fullscreenButton) {
        const media = fullscreenButton.closest(".flip-card__face")?.querySelector(".player-shell__media");
        if (media) {
          ensureMediaLoaded(media);
          requestMediaFullscreen(media);
        }
        return;
      }

      if (event.target.closest("[data-close-lightbox]") || event.target.closest(".media-lightbox__image")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });
  }

  function initImageElements() {
    Array.from(document.querySelectorAll(".media-source--image")).forEach(function (image) {
      const candidates = splitCandidates(image.dataset.candidates);
      loadImageCandidate(image, candidates, 0);
    });
  }

  function ensureFlipCardMedia(card) {
    const media = card?.querySelector(".player-shell__media");
    if (media) {
      ensureMediaLoaded(media);
    }
  }

  function ensureMediaLoaded(media) {
    if (!media || media.dataset.mediaInitialized === "1") {
      return;
    }

    media.dataset.mediaInitialized = "1";
    const candidates = splitCandidates(media.dataset.candidates);
    loadMediaCandidate(media, candidates, 0);
  }

  function loadImageCandidate(image, candidates, index) {
    if (!image || !candidates.length || index >= candidates.length) {
      image?.classList.add("is-missing");
      image?.parentElement?.classList.add("is-missing");
      return;
    }

    image.src = encodeURI(candidates[index]);
    image.onload = function () {
      image.classList.add("is-ready");
      image.parentElement?.classList.add("is-ready");
    };
    image.onerror = function () {
      loadImageCandidate(image, candidates, index + 1);
    };
  }

  function loadMediaCandidate(media, candidates, index) {
    if (!media || !candidates.length || index >= candidates.length) {
      media.removeAttribute("src");
      media.removeAttribute("controls");
      media.load();
      media.closest(".player-shell")?.classList.add("is-empty");
      return;
    }

    media.src = encodeURI(candidates[index]);
    media.load();

    media.onloadeddata = function () {
      media.closest(".player-shell")?.classList.add("is-ready");
    };

    media.onerror = function () {
      loadMediaCandidate(media, candidates, index + 1);
    };
  }

  function openLightbox(title, description, candidates, options) {
    const lightbox = document.querySelector(".media-lightbox");
    const image = document.querySelector(".media-lightbox__image");
    const headNode = document.querySelector(".media-lightbox__head");
    const metaNode = document.querySelector(".media-lightbox__meta");
    const titleNode = document.querySelector(".media-lightbox__title");
    const captionNode = document.querySelector(".media-lightbox__caption");
    const infoNode = document.querySelector(".media-lightbox__info");
    const detailsNode = document.querySelector(".media-lightbox__details");
    const settings = options || {};
    const showInfoPanel = Boolean(settings.showInfoPanel);
    const meta = Array.isArray(settings.meta) ? settings.meta : [];
    const details = Array.isArray(settings.details) ? settings.details : [];

    if (!lightbox || !image || !headNode || !metaNode || !titleNode || !captionNode || !infoNode || !detailsNode) {
      return;
    }

    image.alt = title;
    titleNode.textContent = title;
    metaNode.innerHTML = meta
      .map(function (item) {
        return `<span class="media-lightbox__meta-item">${escapeHtml(item)}</span>`;
      })
      .join("");
    infoNode.textContent = description;
    detailsNode.innerHTML = details
      .map(function (item) {
        return `<span class="media-lightbox__detail">${escapeHtml(item)}</span>`;
      })
      .join("");
    headNode.classList.toggle("is-visible", showInfoPanel);
    captionNode.classList.toggle("is-visible", showInfoPanel);
    lightbox.classList.toggle("is-tradition", Boolean(showInfoPanel));
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    loadLightboxImage(image, candidates, 0);
  }

  function closeLightbox() {
    const lightbox = document.querySelector(".media-lightbox");
    const headNode = document.querySelector(".media-lightbox__head");
    const captionNode = document.querySelector(".media-lightbox__caption");
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("is-open", "is-tradition");
    lightbox.setAttribute("aria-hidden", "true");
    headNode?.classList.remove("is-visible");
    captionNode?.classList.remove("is-visible");
    document.body.classList.remove("lightbox-open");
  }

  function loadLightboxImage(image, candidates, index) {
    if (!image || !candidates.length || index >= candidates.length) {
      image.removeAttribute("src");
      return;
    }

    image.src = encodeURI(candidates[index]);
    image.onerror = function () {
      loadLightboxImage(image, candidates, index + 1);
    };
  }

  function requestMediaFullscreen(media) {
    if (media.requestFullscreen) {
      media.requestFullscreen();
      return;
    }

    if (media.webkitRequestFullscreen) {
      media.webkitRequestFullscreen();
      return;
    }

    if (media.webkitEnterFullscreen) {
      media.webkitEnterFullscreen();
    }
  }

  function resolveTelegramLink(value) {
    const raw = String(value || "").trim();

    if (!raw) {
      return TELEGRAM_PREFIX;
    }

    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }

    return `${TELEGRAM_PREFIX}${raw.replace(/^@/, "")}`;
  }

  function initHeaderToggle() {
    const headerInner = document.querySelector(".site-header__inner");
    const toggleButton = document.querySelector("[data-header-toggle]");

    if (!headerInner || !toggleButton) {
      return;
    }

    function applyCollapsedState(isCollapsed) {
      headerInner.classList.toggle("is-nav-collapsed", isCollapsed);
      toggleButton.setAttribute("aria-expanded", String(!isCollapsed));
      toggleButton.textContent = isCollapsed ? "Показать вкладки" : "Скрыть вкладки";
    }

    let isCollapsed = false;

    try {
      isCollapsed = window.localStorage.getItem(HEADER_COLLAPSE_KEY) === "1";
    } catch (error) {
      isCollapsed = false;
    }

    applyCollapsedState(isCollapsed);

    toggleButton.addEventListener("click", function () {
      isCollapsed = !headerInner.classList.contains("is-nav-collapsed");
      applyCollapsedState(isCollapsed);

      try {
        window.localStorage.setItem(HEADER_COLLAPSE_KEY, isCollapsed ? "1" : "0");
      } catch (error) {
        return;
      }
    });
  }

  function initReveal() {
    const nodes = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function buildImageThumb(baseName, title, description) {
    const candidates = buildImageCandidates(baseName);
    return `
      <button class="card__thumb" type="button" data-open-image data-media-title="${escapeAttribute(title)}" data-media-description="${escapeAttribute(description)}" data-image-candidates="${escapeAttribute(candidates.join("|"))}">
        <img class="media-source media-source--image" data-candidates="${escapeAttribute(candidates.join("|"))}" alt="${escapeAttribute(title)}">
        <span class="media-source__fallback">${escapeHtml(initials(baseName))}</span>
      </button>
    `;
  }

  function buildMusicMediaCandidates(name) {
    const override = MUSIC_AUDIO_OVERRIDES[name] || [];
    if (override.length) {
      return uniqueList(override);
    }

    const directVideo = buildCandidates(name, VIDEO_EXTENSIONS);
    const directAudio = buildCandidates(name, AUDIO_EXTENSIONS);
    return uniqueList(directVideo.concat(directAudio));
  }

  function buildImageCandidates(name) {
    const override = IMAGE_FILE_OVERRIDES[name] || [];
    if (override.length) {
      return uniqueList(override);
    }

    return buildCandidates(name, IMAGE_EXTENSIONS);
  }

  function buildCandidates(name, extensions) {
    const baseVariants = uniqueList([
      name,
      String(name).replace(/[«»"]/g, ""),
      String(name).replace(/:/g, ""),
      String(name).replace(/\s+/g, " ").trim()
    ]);

    const candidates = [];

    baseVariants.forEach(function (base) {
      extensions.forEach(function (extension) {
        candidates.push(`${base}.${extension}`);
      });
    });

    return uniqueList(candidates);
  }

  function splitCandidates(value) {
    return String(value || "")
      .split("|")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function renderFilterButtons(container, targetId, values) {
    container.innerHTML = values
      .map(function (value, index) {
        const activeClass = index === 0 ? " is-active" : "";
        return `<button class="filter-button${activeClass}" type="button" data-target="${escapeAttribute(targetId)}" data-value="${escapeAttribute(value)}">${escapeHtml(value)}</button>`;
      })
      .join("");
  }

  function buildCard(data) {
    return `
      <article class="card" style="--card-accent:${escapeAttribute(data.accent || "#b45f3f")};" data-reveal>
        <span class="card__initial" aria-hidden="true">${escapeHtml(initials(data.title))}</span>
        <div class="card__title-row">
          <h3>${escapeHtml(data.title)}</h3>
          <span class="badge">${escapeHtml(data.subtitle)}</span>
        </div>
        <p>${escapeHtml(data.description)}</p>
        <div class="chip-list">${data.chips.map(function (chip) {
          return `<span class="chip">${escapeHtml(chip)}</span>`;
        }).join("")}</div>
      </article>
    `;
  }

  function uniqueValues(items, key) {
    return Array.from(
      items.reduce(function (result, item) {
        result.add(item[key]);
        return result;
      }, new Set())
    );
  }

  function groupBy(items, key) {
    return items.reduce(function (result, item) {
      if (!result[item[key]]) {
        result[item[key]] = [];
      }
      result[item[key]].push(item);
      return result;
    }, {});
  }

  function uniqueList(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function initials(value) {
    return String(value)
      .split(/\s+/)
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
