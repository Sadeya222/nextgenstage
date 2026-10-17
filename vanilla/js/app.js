/* ==========================================================================
   NexGen Portable Staging — vanilla JavaScript application
   No React, no TypeScript, no build step. Everything runs in the browser.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.NX_DATA;
  var ICONS = window.NX_ICONS || {};
  if (!D) return;

  /* ------------------------------------------------------------------ */
  /* Tiny helpers                                                        */
  /* ------------------------------------------------------------------ */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  var fmtGBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
  var fmtGBP2 = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  function gbp(n) {
    return fmtGBP.format(Math.round(n));
  }
  function gbp2(n) {
    return fmtGBP2.format(n);
  }
  function icon(name, cls, opts) {
    opts = opts || {};
    return (
      '<svg class="lucide lucide-' +
      name +
      (cls ? " " + cls : "") +
      '" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' +
      (opts.fill || "none") +
      '" stroke="currentColor" stroke-width="' +
      (opts.strokeWidth || 2) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") +
      "</svg>"
    );
  }
  function scrollToId(id) {
    var el = document.getElementById(String(id).replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ------------------------------------------------------------------ */
  /* Application state                                                   */
  /* ------------------------------------------------------------------ */
  var state = {
    funding: null,
    cart: [
      {
        id: "pkg-3x2",
        name: "NexGen Portable Staging Package 3×2m",
        price: 1579,
        qty: 1,
        image: D.IMAGES.pkg3x2,
        meta: "6 SteelCity modules · inc VAT"
      },
      {
        id: "valance-clips",
        name: "NexGen Valance Clips (pack of 25)",
        price: 12,
        qty: 1,
        image: D.IMAGES.valanceClips,
        meta: "Velcro strips · inc VAT"
      }
    ],
    quote: null,
    promoValue: "",
    promoMsg: null,
    checkoutMsg: false
  };

  function cartTotals() {
    var subtotal = state.cart.reduce(function (n, i) {
      return n + i.qty * i.price;
    }, 0);
    var pct = state.funding ? state.funding.pct : 0;
    var discount = subtotal * (pct / 100);
    return {
      count: state.cart.reduce(function (n, i) {
        return n + i.qty;
      }, 0),
      subtotal: subtotal,
      discount: discount,
      discountPct: pct,
      total: subtotal - discount
    };
  }

  /* ------------------------------------------------------------------ */
  /* Overlay dialogs                                                     */
  /* ------------------------------------------------------------------ */
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var activeDialog = null;
  var previouslyFocused = null;
  var previousOverflow = "";
  var dialogTimers = {};

  function dialogIdFor(name) {
    return (
      {
        mobile: "mobile-menu-overlay",
        cart: "cart-overlay",
        funding: "funding-overlay",
        quote: "quote-overlay",
        video: "video-overlay"
      }[name] || name
    );
  }

  function clearVideo() {
    var wrap = $("#video-iframe-wrap");
    if (wrap) wrap.innerHTML = "";
  }

  function openDialog(id) {
    var el = typeof id === "string" ? document.getElementById(id) : id;
    if (!el) return;

    if (activeDialog && activeDialog !== el) {
      closeDialog(activeDialog, true, true);
    }
    window.clearTimeout(dialogTimers[el.id]);
    previouslyFocused = document.activeElement;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.style.display = "flex";
    el.classList.remove("is-open");
    void el.offsetWidth;
    el.classList.add("is-open");
    activeDialog = el;

    window.setTimeout(function () {
      if (activeDialog !== el) return;
      var first = el.querySelector("[data-autofocus]") || el.querySelector(FOCUSABLE) || el.querySelector(".nx-dialog");
      if (first) first.focus();
    }, 60);
  }

  function closeDialog(id, instant, skipFocus) {
    var el = typeof id === "string" ? document.getElementById(id) : id;
    if (!el) return;
    el.classList.remove("is-open");
    window.clearTimeout(dialogTimers[el.id]);
    var finish = function () {
      el.style.display = "none";
      if (el.id === "video-overlay") clearVideo();
    };
    if (instant) {
      finish();
    } else {
      dialogTimers[el.id] = window.setTimeout(finish, 330);
    }
    if (activeDialog === el) {
      activeDialog = null;
      document.body.style.overflow = previousOverflow;
      if (!skipFocus && previouslyFocused && document.contains(previouslyFocused)) {
        try {
          previouslyFocused.focus();
        } catch (e) {}
      }
      previouslyFocused = null;
    }
  }

  document.addEventListener("keydown", function (e) {
    if (!activeDialog) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeDialog(activeDialog);
      return;
    }
    if (e.key !== "Tab") return;
    var items = $$(FOCUSABLE, activeDialog).filter(function (x) {
      return x.getClientRects().length > 0 && !x.disabled;
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("click", function (e) {
    var closer = e.target.closest("[data-close]");
    if (closer) {
      var isAnchor = closer.tagName === "A" && closer.getAttribute("href");
      if (!isAnchor) e.preventDefault();
      closeDialog(dialogIdFor(closer.getAttribute("data-close")));
      if (isAnchor) return;
      return;
    }
    var opener = e.target.closest("[data-open-cart]");
    if (opener) {
      e.preventDefault();
      openCart();
      return;
    }
    var funder = e.target.closest("[data-open-funding]");
    if (funder) {
      e.preventDefault();
      closeDialog("mobile-menu-overlay", true, true);
      openFunding();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Generic slide open/close (promo details + mobile shop accordion)    */
  /* ------------------------------------------------------------------ */
  function slideToggle(el, open, onDone) {
    if (!el) return;
    window.clearTimeout(el._nxTimer);
    if (open) {
      el.style.display = "block";
      el.classList.add("nx-collapse");
      el.style.height = "0px";
      el.style.opacity = "0";
      void el.offsetHeight;
      requestAnimationFrame(function () {
        el.style.height = el.scrollHeight + "px";
        el.style.opacity = "1";
      });
      el._nxTimer = window.setTimeout(function () {
        el.style.height = "auto";
        if (onDone) onDone();
      }, reduceMotion() ? 0 : 310);
    } else {
      el.classList.add("nx-collapse");
      el.style.height = el.scrollHeight + "px";
      el.style.opacity = "1";
      void el.offsetHeight;
      requestAnimationFrame(function () {
        el.style.height = "0px";
        el.style.opacity = "0";
      });
      el._nxTimer = window.setTimeout(function () {
        el.style.display = "none";
        if (onDone) onDone();
      }, reduceMotion() ? 0 : 310);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Promo bar                                                           */
  /* ------------------------------------------------------------------ */
  var promoExpanded = false;
  var promoBtn = $("#promo-details-btn");
  var promoDetails = $("#promo-details");
  if (promoBtn && promoDetails) {
    promoBtn.addEventListener("click", function () {
      promoExpanded = !promoExpanded;
      promoBtn.setAttribute("aria-expanded", String(promoExpanded));
      $("#promo-details-label").textContent = promoExpanded ? "Hide" : "Details";
      var chev = promoBtn.querySelector(".lucide-chevron-down");
      if (chev) chev.classList.toggle("rotate-180", promoExpanded);
      slideToggle(promoDetails, promoExpanded);
    });
  }

  function updatePromoLabel() {
    $$("[data-promo-funding-label]").forEach(function (el) {
      el.textContent = state.funding ? D.ECAL_REFERENCE + " applied" : "Get Code";
    });
  }

  /* ------------------------------------------------------------------ */
  /* Header: scroll shadow, account menu, mega menu, mobile menu         */
  /* ------------------------------------------------------------------ */
  var siteHeader = $("#site-header");
  function onScrollHeader() {
    if (!siteHeader) return;
    siteHeader.classList.toggle("shadow-[0_10px_40px_-12px_rgba(6,24,15,0.45)]", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  var accountBtn = $("#account-btn");
  var accountMenu = $("#account-menu");
  var accountWrap = $("#account-wrap");
  function closeAccount() {
    if (!accountMenu) return;
    accountMenu.style.display = "none";
    accountMenu.classList.remove("nx-pop");
    if (accountBtn) accountBtn.setAttribute("aria-expanded", "false");
  }
  if (accountBtn && accountMenu) {
    accountBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = accountMenu.style.display !== "none";
      if (open) closeAccount();
      else {
        accountMenu.style.display = "block";
        accountMenu.classList.add("nx-pop");
        accountBtn.setAttribute("aria-expanded", "true");
      }
    });
    document.addEventListener("mousedown", function (e) {
      if (accountWrap && !accountWrap.contains(e.target)) closeAccount();
    });
    $$("[role=menuitem]", accountMenu).forEach(function (b) {
      b.addEventListener("click", closeAccount);
    });
  }

  var shopNav = $("[data-shop-nav]");
  var mega = $("#shop-mega");
  var megaTimer = null;
  function openMega() {
    if (!mega) return;
    window.clearTimeout(megaTimer);
    mega.style.display = "block";
    mega.classList.add("nx-pop");
    var link = shopNav && shopNav.querySelector("a");
    if (link) link.setAttribute("aria-expanded", "true");
    var chev = link && link.querySelector(".lucide-chevron-down");
    if (chev) chev.classList.add("rotate-180");
    if (link) link.classList.add("text-electric");
    var underline = link && link.querySelector("span.absolute");
    if (underline) underline.classList.add("scale-x-100");
  }
  function closeMegaSoon() {
    window.clearTimeout(megaTimer);
    megaTimer = window.setTimeout(function () {
      if (!mega) return;
      mega.style.display = "none";
      mega.classList.remove("nx-pop");
      var link = shopNav && shopNav.querySelector("a");
      if (link) link.setAttribute("aria-expanded", "false");
      var chev = link && link.querySelector(".lucide-chevron-down");
      if (chev) chev.classList.remove("rotate-180");
      if (link) link.classList.remove("text-electric");
      var underline = link && link.querySelector("span.absolute");
      if (underline) underline.classList.remove("scale-x-100");
    }, 140);
  }
  if (shopNav && mega) {
    shopNav.addEventListener("mouseenter", openMega);
    shopNav.addEventListener("mouseleave", closeMegaSoon);
    shopNav.addEventListener("focusin", openMega);
    mega.addEventListener("mouseenter", openMega);
    mega.addEventListener("mouseleave", closeMegaSoon);
  }

  var mobileMenuBtn = $("#mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      openDialog("mobile-menu-overlay");
    });
  }

  var mobileShopBtn = $("#mobile-shop-btn");
  var mobileShopList = $("#mobile-shop-list");
  if (mobileShopBtn && mobileShopList) {
    mobileShopBtn.addEventListener("click", function () {
      var open = mobileShopList.style.display !== "none";
      mobileShopBtn.setAttribute("aria-expanded", String(!open));
      var chev = mobileShopBtn.querySelector(".lucide-chevron-down");
      if (chev) chev.classList.toggle("rotate-180", !open);
      slideToggle(mobileShopList, !open);
    });
  }

  var mobileOverlay = $("#mobile-menu-overlay");
  if (mobileOverlay) {
    $$("a", mobileOverlay).forEach(function (a) {
      a.addEventListener("click", function () {
        closeDialog("mobile-menu-overlay");
        closeMegaSoon();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Search boxes                                                        */
  /* ------------------------------------------------------------------ */
  function searchMarkup(root, q, active) {
    var hasQuery = q.trim().length > 0;
    if (!hasQuery) {
      return (
        '<div class="p-4"><p class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">' +
        icon("flame", "h-3.5 w-3.5 text-orange-500") +
        ' Popular searches</p><div class="mt-3 flex flex-wrap gap-2">' +
        D.POPULAR_SEARCHES.map(function (s) {
          return (
            '<button type="button" data-popular="' +
            esc(s) +
            '" class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-electric hover:text-forest-900">' +
            esc(s) +
            "</button>"
          );
        }).join("") +
        "</div></div>"
      );
    }
    var words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var results = D.PRODUCTS.filter(function (p) {
      var hay = (p.name + " " + D.CATEGORY_LABEL[p.category] + " " + p.blurb).toLowerCase();
      return words.every(function (w) {
        return hay.indexOf(w) !== -1;
      });
    }).slice(0, 6);

    if (!results.length) {
      return (
        '<div id="' +
        root.getAttribute("data-search-uid") +
        '-list" role="listbox" aria-label="No results" class="flex items-center gap-3 p-5 text-sm text-slate-600">' +
        icon("search-x", "h-6 w-6 shrink-0 text-slate-400") +
        '<p>No matches for “<strong class="text-forest-900">' +
        esc(q) +
        '</strong>”. Try “decks”, “riser” or “ramp” — or <a href="#quote-builder" data-search-quote class="font-bold text-forest-700 underline">build a custom stage quote</a>.</p></div>'
      );
    }

    function highlight(text) {
      var parts = q
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(escRe);
      if (!parts.length) return esc(text);
      var re = new RegExp("(" + parts.join("|") + ")", "ig");
      return text
        .split(re)
        .map(function (part, i) {
          return i % 2 === 1
            ? '<mark class="rounded-sm bg-electric/60 text-forest-900">' + esc(part) + "</mark>"
            : esc(part);
        })
        .join("");
    }

    var uid = root.getAttribute("data-search-uid");
    return (
      '<ul id="' +
      uid +
      '-list" role="listbox" aria-label="Search suggestions" class="max-h-[22rem] overflow-y-auto p-2">' +
      results
        .map(function (p, i) {
          return (
            '<li id="' +
            uid +
            "-opt-" +
            i +
            '" role="option" data-result="' +
            p.id +
            '" aria-selected="' +
            (i === active) +
            '" class="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition ' +
            (i === active ? "bg-forest-50" : "hover:bg-slate-50") +
            '"><img src="' +
            p.image +
            '" alt="" class="h-11 w-11 shrink-0 rounded-lg object-cover" loading="lazy"><span class="min-w-0 flex-1"><span class="block truncate text-sm font-semibold">' +
            highlight(p.name) +
            '</span><span class="block truncate text-xs text-slate-600">' +
            D.CATEGORY_LABEL[p.category] +
            '</span></span><span class="text-sm font-extrabold text-forest-800">' +
            gbp(p.price) +
            "</span></li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function initSearch(root) {
    var input = $("[data-search-input]", root);
    var panel = $("[data-search-panel]", root);
    var shell = $(".nx-search-shell", root);
    var clearBtn = $("[data-search-clear]", root);
    var uid = root.getAttribute("data-search-uid");
    if (!input || !panel) return;
    var q = "";
    var open = false;
    var active = -1;

    function render() {
      panel.innerHTML = searchMarkup(root, q, active);
      panel.classList.remove("nx-pop");
      void panel.offsetWidth;
      panel.classList.add("nx-pop");
      var listId = uid + "-list";
      input.setAttribute("aria-controls", listId);
      input.setAttribute("aria-activedescendant", active >= 0 ? uid + "-opt-" + active : "");
      wire();
    }
    function applyOpen(next) {
      open = next;
      panel.style.display = open ? "block" : "none";
      input.setAttribute("aria-expanded", String(open));
      shell.classList.toggle("is-open", open);
      if (open) render();
    }
    function setActive(i) {
      active = i;
      $$("[role=option]", panel).forEach(function (li, idx) {
        li.setAttribute("aria-selected", String(idx === i));
        li.classList.toggle("bg-forest-50", idx === i);
      });
      input.setAttribute("aria-activedescendant", active >= 0 ? uid + "-opt-" + active : "");
    }
    function choose(p) {
      q = p.name;
      input.value = p.name;
      applyOpen(false);
      scrollToId("shop");
      closeMobileSearch();
    }
    function closeMobileSearch() {
      if (root.getAttribute("data-search-uid") === "nx-search-mobile") {
        var row = $("#mobile-search-row");
        if (row) row.style.display = "none";
        var btn = $("#mobile-search-btn");
        if (btn) {
          btn.setAttribute("aria-expanded", "false");
          var s = $("[data-search-icon]", btn);
          var x = $("[data-search-close-icon]", btn);
          if (s) s.style.display = "";
          if (x) x.style.display = "none";
        }
      }
    }
    function wire() {
      $$("[data-popular]", panel).forEach(function (b) {
        b.addEventListener("click", function () {
          q = b.getAttribute("data-popular");
          input.value = q;
          active = -1;
          input.focus();
          render();
        });
      });
      $$("[role=option]", panel).forEach(function (li, idx) {
        li.addEventListener("mouseenter", function () {
          setActive(idx);
        });
        li.addEventListener("mousedown", function (e) {
          e.preventDefault();
        });
        li.addEventListener("click", function () {
          var p = D.PRODUCTS.filter(function (x) {
            return x.id === li.getAttribute("data-result");
          })[0];
          if (p) choose(p);
        });
      });
      var quoteLink = $("[data-search-quote]", panel);
      if (quoteLink) quoteLink.addEventListener("click", function () {
        applyOpen(false);
      });
    }

    input.addEventListener("input", function () {
      q = input.value;
      active = -1;
      clearBtn.style.display = q.trim() ? "flex" : "none";
      applyOpen(true);
    });
    input.addEventListener("focus", function () {
      applyOpen(true);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        applyOpen(true);
        var count = $$("[role=option]", panel).length;
        if (count) setActive((active + 1) % count);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        var count2 = $$("[role=option]", panel).length;
        if (count2) setActive(active <= 0 ? count2 - 1 : active - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        var opts = $$("[role=option]", panel);
        if (active >= 0 && opts[active]) {
          opts[active].click();
        } else {
          applyOpen(false);
          scrollToId("shop");
          closeMobileSearch();
        }
      } else if (e.key === "Escape") {
        if (open) {
          e.stopPropagation();
          applyOpen(false);
        }
      }
    });
    clearBtn.addEventListener("click", function () {
      q = "";
      input.value = "";
      active = -1;
      clearBtn.style.display = "none";
      input.focus();
      applyOpen(true);
    });
    var form = $("form", root);
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        applyOpen(false);
        scrollToId("shop");
        closeMobileSearch();
      });
    }
    document.addEventListener("mousedown", function (e) {
      if (!root.contains(e.target)) applyOpen(false);
    });
    root._nxSearch = { close: function () { applyOpen(false); } };
  }

  $$("[data-search-root]").forEach(initSearch);

  var mobileSearchBtn = $("#mobile-search-btn");
  var mobileSearchRow = $("#mobile-search-row");
  if (mobileSearchBtn && mobileSearchRow) {
    mobileSearchBtn.addEventListener("click", function () {
      var isOpen = mobileSearchRow.style.display !== "none";
      mobileSearchRow.style.display = isOpen ? "none" : "block";
      mobileSearchBtn.setAttribute("aria-expanded", String(!isOpen));
      var s = $("[data-search-icon]", mobileSearchBtn);
      var x = $("[data-search-close-icon]", mobileSearchBtn);
      if (s) s.style.display = isOpen ? "" : "none";
      if (x) x.style.display = isOpen ? "none" : "";
      if (!isOpen) {
        var inp = $("[data-search-input]", mobileSearchRow);
        if (inp) window.setTimeout(function () { inp.focus(); }, 30);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Hero                                                                */
  /* ------------------------------------------------------------------ */
  var hero = $("#hero");
  var heroSlide = 0;
  var heroUserPaused = false;
  var heroHovering = false;
  var heroTimer = null;
  var heroFeature = 0;

  function renderHeroSlide(index, animate) {
    heroSlide = index;
    $$("[data-hero-slide]").forEach(function (wrap, i) {
      wrap.style.opacity = i === index ? "1" : "0";
      wrap.setAttribute("aria-hidden", String(i !== index));
      var img = $("img", wrap);
      if (img) img.setAttribute("fetchpriority", i === index ? "high" : "auto");
    });
    $$("[data-hero-dot]").forEach(function (d, i) {
      var on = i === index;
      d.setAttribute("aria-current", String(on));
      d.className =
        "h-2 rounded-full transition-all duration-300 " + (on ? "w-8 bg-electric" : "w-2 bg-white/40 hover:bg-white/70");
    });
    var text = $("#hero-slide-text");
    var slide = D.HERO_SLIDES[index];
    function update() {
      $("#hero-slide-title").textContent = slide.title;
      $("#hero-slide-price").textContent = slide.price;
      if (text) text.classList.remove("is-fading");
    }
    if (animate && text) {
      text.classList.add("is-fading");
      window.setTimeout(update, 160);
    } else update();
  }

  function heroPaused() {
    return heroHovering || heroUserPaused || reduceMotion();
  }
  function scheduleHero() {
    window.clearInterval(heroTimer);
    if (heroPaused()) return;
    heroTimer = window.setInterval(function () {
      renderHeroSlide((heroSlide + 1) % D.HERO_SLIDES.length, true);
    }, 5500);
  }

  if (hero) {
    $$("[data-hero-slide]").forEach(function (wrap, i) {
      if (i !== 0) wrap.style.opacity = "0";
      if (i === 0) wrap.style.opacity = "1";
    });
    $$("[data-hero-slide]").forEach(function (wrap, i) {
      wrap.querySelectorAll("img").forEach(function (img) {
        img.style.objectPosition = "50% 55%";
        img.style.transform = "scale(1.1)";
      });
    });

    var showcase = $("#hero-showcase");
    if (showcase) {
      showcase.addEventListener("mouseenter", function () {
        heroHovering = true;
        scheduleHero();
      });
      showcase.addEventListener("mouseleave", function () {
        heroHovering = false;
        scheduleHero();
      });
    }

    $$("[data-hero-dot]").forEach(function (dot) {
      dot.addEventListener("click", function () {
        renderHeroSlide(Number(dot.getAttribute("data-hero-dot")), true);
        scheduleHero();
      });
    });

    var pauseBtn = $("#hero-pause");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        heroUserPaused = !heroUserPaused;
        pauseBtn.setAttribute("aria-label", heroUserPaused ? "Resume showcase autoplay" : "Pause showcase autoplay");
        var pauseIcon = $("[data-hero-pause-icon]", pauseBtn);
        var playIcon = $("[data-hero-play-icon]", pauseBtn);
        if (pauseIcon) pauseIcon.style.display = heroUserPaused ? "none" : "";
        if (playIcon) playIcon.style.display = heroUserPaused ? "" : "none";
        scheduleHero();
      });
    }

    var featureButtons = $$("[data-hero-feature]");
    function setHeroFeature(i) {
      heroFeature = i;
      featureButtons.forEach(function (btn, idx) {
        var on = idx === i;
        btn.setAttribute("aria-pressed", String(on));
        btn.className =
          "group relative flex h-full w-full flex-col items-start gap-2.5 overflow-hidden rounded-2xl border p-3.5 text-left transition duration-300 hover:-translate-y-1 " +
          (on
            ? "border-electric bg-electric/15 shadow-[0_0_0_1px_rgba(163,230,53,0.5),0_12px_36px_-10px_rgba(163,230,53,0.55)]"
            : "border-white/15 bg-white/[0.06] hover:border-electric/60 hover:bg-white/10");
        var iconWrap = $("[data-hero-feature-icon]", btn);
        if (iconWrap)
          iconWrap.className =
            "flex h-10 w-10 items-center justify-center rounded-xl transition duration-300 " +
            (on ? "bg-electric text-forest-900 rotate-[-6deg] scale-110" : "bg-white/10 text-electric");
      });
      $$("[data-hero-detail-icon]").forEach(function (svg, idx) {
        svg.style.display = idx === i ? "" : "none";
      });
      $("#hero-detail-text").textContent = D.HERO_FEATURES[i].detail;
    }
    featureButtons.forEach(function (btn, i) {
      btn.addEventListener("mouseenter", function () { setHeroFeature(i); });
      btn.addEventListener("focus", function () { setHeroFeature(i); });
      btn.addEventListener("click", function () { setHeroFeature(i); });
    });

    // Mouse parallax (same factors as the original springs)
    if (!reduceMotion()) {
      var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;
      function tick() {
        curX += (targetX - curX) * 0.12;
        curY += (targetY - curY) * 0.12;
        $$("[data-hero-img]").forEach(function (img) {
          img.style.transform =
            "translate3d(" + (-14 * curX).toFixed(2) + "px," + (-10 * curY).toFixed(2) + "px,0) scale(1.1)";
        });
        $$("[data-hero-card]").forEach(function (card) {
          card.style.transform = "translate3d(" + (22 * curX).toFixed(2) + "px," + (16 * curY).toFixed(2) + "px,0)";
        });
        var geo = $("[data-hero-geo]");
        if (geo) geo.style.transform = "translate3d(" + (-34 * curX).toFixed(2) + "px," + (-24 * curY).toFixed(2) + "px,0)";
        if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) raf = requestAnimationFrame(tick);
        else raf = null;
      }
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        targetX = (e.clientX - r.left) / r.width - 0.5;
        targetY = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = requestAnimationFrame(tick);
      });
    }

    scheduleHero();
  }

  /* ------------------------------------------------------------------ */
  /* Stage configurator                                                  */
  /* ------------------------------------------------------------------ */
  var PRESETS = [
    { id: "3x2", label: "3 × 2 m", w: 3, d: 2, tag: "6 modules · school favourite" },
    { id: "4x3", label: "4 × 3 m", w: 4, d: 3, tag: "12 modules · Popular" },
    { id: "6x3", label: "6 × 3 m", w: 6, d: 3, tag: "18 modules · full stage" },
    { id: "custom", label: "Custom", w: 0, d: 0, tag: "Your size" }
  ];
  var HEIGHTS = [200, 300, 400, 600, 800, 1000];
  function catalogPrice(id, fallback) {
    var p = D.PRODUCTS.filter(function (x) { return x.id === id; })[0];
    return p ? p.price / 1.2 : fallback;
  }
  var DECKS = [
    { id: "steelcity-1x1", label: "SteelCity 1×1m", price: catalogPrice("steelcity-1x1", 219), area: 1, note: "8.5kg module · deck & riser" },
    { id: "steelcity-1x520", label: "SteelCity 1×520mm", price: catalogPrice("steelcity-1x520", 209), area: 0.52, note: "5kg module · deck & riser" },
    { id: "platinum-1x1", label: "Platinum ECO 1×1m", price: 269, area: 1, note: "7.8kg · recycled core · from" }
  ];
  var EXTRAS = [
    { id: "fascia", label: "Hard fascia valance", note: "£20 +Vat per metre", perMetre: 20 },
    { id: "cloth", label: "Cloth valance", note: "£22 +Vat per metre", perMetre: 22 },
    { id: "ramp", label: "Folding access ramp 5ft", note: "£299 +Vat", flat: 299 },
    { id: "trolley", label: "Storage trolley 300kg", note: "£290 +Vat", flat: 290 }
  ];
  var FLAT_PACKAGE_IDS = { "3x2": "pkg-3x2", "4x3": "pkg-4x3", "6x3": "pkg-6x3" };
  var STANDARD_CHOIR = D.PRODUCTS.filter(function (p) { return p.id === "choir-3t"; })[0];

  var cfg = {
    preset: "4x3",
    cw: 5,
    cd: 4,
    heightMm: 400,
    deckId: "steelcity-1x1",
    flatDeckId: "steelcity-1x1",
    flatHeightMm: 400,
    extras: { fascia: false, cloth: false, ramp: false, trolley: false },
    stageMode: "flat",
    tierRows: 3
  };
  var priceShown = null;
  var priceAnimId = 0;

  function cfgAvailableHeights() {
    if (cfg.stageMode === "flat") return HEIGHTS.slice();
    var max = 1000 - (cfg.tierRows - 1) * 200 - 30;
    return HEIGHTS.filter(function (h) { return h <= max; });
  }
  function cfgHeightGridClass() {
    if (cfg.stageMode === "flat") return "grid-cols-3 sm:grid-cols-6";
    if (cfg.tierRows === 4) return "grid-cols-2 sm:grid-cols-2";
    if (cfg.tierRows === 3) return "grid-cols-3 sm:grid-cols-3";
    if (cfg.tierRows === 2) return "grid-cols-2 sm:grid-cols-4";
    return "grid-cols-3 sm:grid-cols-5";
  }
  function cfgCalc() {
    var p = PRESETS.filter(function (x) { return x.id === cfg.preset; })[0];
    var w = cfg.preset === "custom" ? cfg.cw : p.w;
    var isChoir = cfg.stageMode === "tiered";
    var d = isChoir ? cfg.tierRows * 0.52 : cfg.preset === "custom" ? cfg.cd : p.d;
    var area = w * d;
    var selectedDeckId = isChoir ? "steelcity-1x520" : cfg.deckId;
    var deck = DECKS.filter(function (x) { return x.id === selectedDeckId; })[0];
    var modules = Math.max(1, isChoir ? Math.round(area / deck.area) : Math.ceil(area / deck.area));
    var flatPackage =
      !isChoir && cfg.deckId === "steelcity-1x1" && cfg.preset !== "custom"
        ? D.PRODUCTS.filter(function (x) { return x.id === FLAT_PACKAGE_IDS[cfg.preset]; })[0]
        : undefined;
    var usesStandardChoirPackage =
      isChoir && w === 4 && cfg.tierRows === 3 && cfg.heightMm === 200 && !!STANDARD_CHOIR;
    var usesCatalogPackage = usesStandardChoirPackage || !!flatPackage;
    var catalogPackagePrice = usesStandardChoirPackage ? STANDARD_CHOIR.price : flatPackage ? flatPackage.price : null;
    var base = usesCatalogPackage && catalogPackagePrice != null ? catalogPackagePrice / 1.2 : modules * deck.price;
    var extrasTotal = 0;
    EXTRAS.forEach(function (e) {
      if (!cfg.extras[e.id]) return;
      if (e.perMetre) extrasTotal += 2 * (w + d) * e.perMetre;
      else if (e.flat) extrasTotal += e.flat;
    });
    var subtotal = base + extrasTotal;
    var pct = state.funding ? state.funding.pct : 0;
    var total = subtotal * (1 - pct / 100);
    var tierHeightValues = isChoir
      ? Array.from({ length: cfg.tierRows }, function (_, row) {
          return cfg.heightMm + 30 + (cfg.tierRows - 1 - row) * 200;
        })
      : [cfg.heightMm + 30];
    var heightDetail = isChoir
      ? tierHeightValues.join(" / ") + "mm incl. deck"
      : cfg.heightMm + "mm riser (" + (cfg.heightMm + 30) + "mm incl. deck)";
    var configuration = isChoir
      ? "Tiered choir · " + cfg.tierRows + " " + (cfg.tierRows === 1 ? "row" : "rows")
      : "Flat stage · single level";
    var priceBasis = usesStandardChoirPackage
      ? STANDARD_CHOIR.name + " · live shop package price"
      : flatPackage
        ? flatPackage.name + " · live shop package price"
        : isChoir
          ? modules + " SteelCity 1×520mm modules at " + gbp(deck.price) + " + VAT each"
          : modules + " " + deck.label + " modules at " + gbp(deck.price) + " + VAT each";
    return {
      w: w,
      d: d,
      area: area,
      modules: modules,
      deck: deck,
      base: base,
      extrasTotal: extrasTotal,
      subtotal: subtotal,
      total: total,
      totalIncVat: total * 1.2,
      pct: pct,
      isChoir: isChoir,
      tierRows: isChoir ? cfg.tierRows : 1,
      tierHeightValues: tierHeightValues,
      heightDetail: heightDetail,
      configuration: configuration,
      priceBasis: priceBasis,
      usesStandardChoirPackage: usesStandardChoirPackage,
      usesCatalogPackage: usesCatalogPackage,
      sizeLabel: isChoir
        ? w + "m choir layout · " + cfg.tierRows + " " + (cfg.tierRows === 1 ? "row" : "rows")
        : cfg.preset === "custom"
          ? "Custom " + w + "×" + d + "m"
          : p.label.replace(/\s/g, "")
    };
  }

  function choiceMarkup(opts) {
    return (
      '<label class="relative block cursor-pointer"><input type="' +
      (opts.type || "radio") +
      '" name="' +
      opts.name +
      '" value="' +
      opts.value +
      '" ' +
      (opts.checked ? "checked" : "") +
      ' class="peer sr-only"><span class="block h-full rounded-xl border-2 border-slate-200 bg-white ' +
      opts.extra +
      ' py-2.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-forest-400 hover:shadow-md peer-checked:border-forest-800 peer-checked:bg-forest-50 peer-checked:shadow-[0_0_0_4px_rgba(163,230,53,0.4)] peer-focus-visible:ring-2 peer-focus-visible:ring-forest-800 peer-focus-visible:ring-offset-2">' +
      opts.inner +
      "</span></label>"
    );
  }

  function renderSizeOptions() {
    var el = $("#cfg-size-grid");
    if (!el) return;
    el.innerHTML = PRESETS.map(function (p) {
      var tiered = cfg.stageMode === "tiered";
      var label = tiered ? (p.id === "custom" ? "Custom width" : p.w + "m wide") : p.label;
      var desc = tiered
        ? p.id === "custom"
          ? p.tag
          : p.w * cfg.tierRows + " modules · " + (p.w === 4 && cfg.tierRows === 3 ? "standard choir package" : cfg.tierRows + " " + (cfg.tierRows === 1 ? "row" : "rows"))
        : p.id === "custom"
          ? p.tag
          : p.w * p.d + " m² · " + p.tag;
      return choiceMarkup({
        name: "stage-size",
        value: p.id,
        checked: cfg.preset === p.id,
        extra: "px-3",
        inner:
          '<span class="block text-base font-extrabold text-forest-900">' +
          label +
          '</span><span class="block text-xs text-slate-600">' +
          desc +
          "</span>"
      });
    }).join("");
  }

  function renderHeights() {
    var el = $("#cfg-heights");
    if (!el) return;
    el.className = "grid gap-2 " + cfgHeightGridClass();
    el.innerHTML = cfgAvailableHeights()
      .map(function (h) {
        return choiceMarkup({
          name: "stage-height",
          value: String(h),
          checked: cfg.heightMm === h,
          extra: "px-1 text-center",
          inner:
            '<span class="block text-base font-extrabold text-forest-900">' +
            h +
            '</span><span class="block text-[11px] font-semibold text-slate-600">mm</span>'
        });
      })
      .join("");
  }

  function renderRows() {
    var wrap = $("#cfg-rows");
    var grid = $("#cfg-row-grid");
    if (!wrap || !grid) return;
    var calc = cfgCalc();
    wrap.style.display = cfg.stageMode === "tiered" ? "block" : "none";
    $("#cfg-flat-hint").style.display = cfg.stageMode === "tiered" ? "none" : "flex";
    if (cfg.stageMode !== "tiered") return;
    $("#cfg-rows-meta").textContent = cfg.tierRows * calc.w + " modules · " + calc.area.toFixed(2) + "m² footprint";
    grid.innerHTML = [1, 2, 3, 4]
      .map(function (n) {
        var desc =
          n === 1
            ? "Single level"
            : n === 3 && calc.w === 4
              ? "Standard package · up to 35 singers"
              : calc.w * n + " × 520mm modules";
        return choiceMarkup({
          name: "tier-rows",
          value: String(n),
          checked: cfg.tierRows === n,
          extra: "px-3",
          inner:
            '<span class="flex items-center justify-between gap-1"><span class="text-sm font-extrabold text-forest-900">' +
            n +
            " " +
            (n === 1 ? "row" : "rows") +
            '</span><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-forest-700">' +
            n +
            '</span></span><span class="mt-1 block text-xs leading-snug text-slate-600">' +
            desc +
            "</span>"
        });
      })
      .join("");
  }

  function renderDecks() {
    var el = $("#cfg-decks");
    if (!el) return;
    var calc = cfgCalc();
    var list = DECKS.filter(function (t) {
      return cfg.stageMode === "flat" || t.id === "steelcity-1x520";
    });
    el.innerHTML = list
      .map(function (t) {
        return choiceMarkup({
          name: "deck-type",
          value: t.id,
          checked: calc.deck.id === t.id,
          extra: "px-3",
          inner:
            '<span class="flex items-center justify-between gap-2"><span class="text-sm font-extrabold text-forest-900">' +
            t.label +
            '</span><span class="text-sm font-bold text-forest-700">' +
            gbp(t.price) +
            '</span></span><span class="block text-xs text-slate-600">' +
            t.note +
            " · +Vat</span>"
        });
      })
      .join("");
    $("#cfg-deck-count").textContent = calc.modules + " × module";
  }

  function renderExtras() {
    EXTRAS.forEach(function (e) {
      var input = document.querySelector('input[name="extra-' + e.id + '"][value="' + e.id + '"]');
      if (input) input.checked = !!cfg.extras[e.id];
      var box = $('[data-extra-box="' + e.id + '"]');
      var check = $('[data-extra-check="' + e.id + '"]');
      if (box) {
        box.className =
          "flex h-4 w-4 items-center justify-center rounded border-2 transition " +
          (cfg.extras[e.id] ? "border-forest-800 bg-forest-800 text-electric" : "border-slate-300");
      }
      if (check) check.style.display = cfg.extras[e.id] ? "block" : "none";
    });
  }

  function renderConfig() {
    if (!$("#quote-builder")) return;
    var calc = cfgCalc();

    // Mode / helper text
    var mode = document.querySelector('input[name="stage-mode"][value="' + cfg.stageMode + '"]');
    if (mode) mode.checked = true;
    $("#cfg-size-legend").textContent = cfg.stageMode === "tiered" ? "Choir stage width" : "Stage size";
    $("#cfg-height-legend").textContent = cfg.stageMode === "tiered" ? "Lowest row riser height" : "Stage height";
    $("#cfg-deck-legend").textContent = cfg.stageMode === "tiered" ? "Choir modules" : "Stage modules";
    $("#cfg-height-note").textContent =
      cfg.stageMode === "tiered"
        ? "Each rise adds 200mm. Heights shown in the preview include the 30mm deck (" + calc.heightDetail + ")."
        : "Every module is a deck & riser combo. Choose the riser height that suits your venue.";
    $("#cfg-deck-note").textContent =
      cfg.stageMode === "tiered"
        ? "Choir rows use the 1×520mm SteelCity deck & riser module, matching NexGen’s 3 Tier Choir package."
        : "Choose a module finish and size. The estimate updates by module count; the official quote confirms your final selection.";
    $("#cfg-custom").style.display = cfg.preset === "custom" ? "grid" : "none";
    $("#cfg-depth-stepper").style.display = cfg.stageMode === "tiered" ? "none" : "flex";
    $("#cfg-cw").textContent = cfg.cw + " m";
    $("#cfg-cd").textContent = cfg.cd + " m";

    renderSizeOptions();
    renderHeights();
    renderRows();
    renderDecks();
    renderExtras();

    // Stepper disabled states
    $$("[data-step]").forEach(function (btn) {
      var isW = btn.getAttribute("data-step") === "cw";
      var val = isW ? cfg.cw : cfg.cd;
      var delta = Number(btn.getAttribute("data-delta"));
      var max = isW ? 12 : 8;
      btn.disabled = delta < 0 ? val <= 1 : val >= max;
    });

    // Stats
    $("#cfg-stat-modules").textContent = calc.modules;
    $("#cfg-area-label").textContent = calc.isChoir ? "Footprint" : "Area";
    $("#cfg-stat-area").textContent = calc.area.toFixed(calc.isChoir ? 2 : 0) + " m²";
    $("#cfg-build-label").textContent = calc.isChoir ? "Rows" : "Build";
    $("#cfg-stat-build").textContent = calc.isChoir ? String(calc.tierRows) : "~60 sec";
    $("#cfg-live-label").textContent = calc.isChoir
      ? calc.w + "m wide · " + calc.tierRows + " " + (calc.tierRows === 1 ? "row" : "rows")
      : "Flat stage · " + calc.w + "m × " + calc.d + "m";
    var badge = $("#cfg-choir-badge");
    if (badge) {
      badge.textContent = calc.tierRows + " " + (calc.tierRows === 1 ? "Row" : "Rows") + " · Choir Layout";
      badge.style.display = calc.isChoir ? "block" : "none";
    }

    // Isometric preview
    var iso = $("#cfg-iso");
    if (iso) {
      iso.innerHTML = isoStage({
        w: calc.w,
        d: calc.d,
        heightCm: (cfg.heightMm + 30) / 10,
        valance: cfg.extras.fascia || cfg.extras.cloth,
        steps: false,
        ramp: cfg.extras.ramp,
        tierRows: calc.isChoir ? calc.tierRows : 1
      });
    }

    // Price + breakdown
    animatePrice(calc.total);
    $("#cfg-subtotal").style.display = calc.pct > 0 ? "block" : "none";
    $("#cfg-subtotal").textContent = gbp(calc.subtotal);
    $("#cfg-incvat").textContent = gbp2(calc.totalIncVat) + " inc VAT";
    $("#cfg-height-detail").textContent = calc.heightDetail;
    $("#cfg-price-basis").textContent = calc.priceBasis;
    $("#cfg-funding-note").style.display = calc.pct > 0 ? "block" : "none";
    if (calc.pct > 0)
      $("#cfg-funding-note").textContent =
        "Includes up to " + calc.pct + "% " + D.ECAL_REFERENCE + " funding — final discount confirmed on your official quotation.";

    var rows = "";
    rows +=
      '<div class="flex justify-between gap-3"><dt>' +
      (calc.usesCatalogPackage
        ? calc.isChoir
          ? "3 Tier Choir package"
          : "NexGen stage package"
        : calc.modules + " × " + calc.deck.label) +
      '</dt><dd class="font-semibold tabular-nums">' +
      gbp2(calc.base) +
      "</dd></div>";
    if (calc.extrasTotal > 0)
      rows +=
        '<div class="flex justify-between gap-3"><dt>Selected accessories</dt><dd class="font-semibold tabular-nums">' +
        gbp2(calc.extrasTotal) +
        "</dd></div>";
    rows +=
      '<div class="flex justify-between gap-3 border-t border-white/10 pt-1.5"><dt>Estimate ex. VAT</dt><dd class="font-semibold tabular-nums">' +
      gbp2(calc.subtotal) +
      "</dd></div>";
    if (calc.pct > 0)
      rows +=
        '<div class="flex justify-between gap-3 text-electric"><dt>ECAL funding (' +
        calc.pct +
        '%)</dt><dd class="font-semibold tabular-nums">−' +
        gbp2(calc.subtotal - calc.total) +
        "</dd></div>";
    rows +=
      '<div class="flex justify-between gap-3 border-t border-white/10 pt-1.5 font-bold text-white"><dt>Estimate inc. VAT</dt><dd class="tabular-nums">' +
      gbp2(calc.totalIncVat) +
      "</dd></div>";
    $("#cfg-breakdown").innerHTML = rows;

    var applied = $("#cfg-funding-applied");
    var prompt = $("#cfg-funding-prompt");
    if (state.funding) {
      applied.style.display = "flex";
      prompt.style.display = "none";
      $("#cfg-funding-applied-text").textContent = D.ECAL_REFERENCE + " · up to " + state.funding.pct + "% funding applied";
    } else {
      applied.style.display = "none";
      prompt.style.display = "flex";
    }
  }

  function animatePrice(to) {
    var span = $("#cfg-total .tabular-nums");
    if (!span) return;
    var id = ++priceAnimId;
    if (priceShown === null || Math.abs(priceShown - to) < 0.5 || reduceMotion()) {
      span.textContent = gbp(to);
      priceShown = to;
      return;
    }
    var from = priceShown;
    priceShown = to;
    var start = performance.now();
    function tick(now) {
      if (id !== priceAnimId) return;
      var t = Math.min(1, (now - start) / 550);
      var eased = 1 - Math.pow(1 - t, 3);
      span.textContent = gbp(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
      else span.textContent = gbp(to);
    }
    requestAnimationFrame(tick);
  }

  function changeStageMode(mode) {
    if (mode === cfg.stageMode) return;
    if (mode === "tiered") {
      cfg.flatDeckId = cfg.deckId;
      cfg.stageMode = "tiered";
      cfg.deckId = "steelcity-1x520";
      cfg.heightMm = 200;
    } else {
      cfg.stageMode = "flat";
      cfg.deckId = cfg.flatDeckId;
      cfg.heightMm = cfg.flatHeightMm;
    }
    renderConfig();
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (!t || !t.name) return;
    if (t.name === "stage-size") {
      cfg.preset = t.value;
      renderConfig();
    } else if (t.name === "stage-mode") {
      changeStageMode(t.value);
    } else if (t.name === "stage-height") {
      cfg.heightMm = Number(t.value);
      if (cfg.stageMode === "flat") cfg.flatHeightMm = cfg.heightMm;
      renderConfig();
    } else if (t.name === "deck-type") {
      cfg.deckId = t.value;
      if (cfg.stageMode === "flat") cfg.flatDeckId = cfg.deckId;
      renderConfig();
    } else if (t.name === "tier-rows") {
      cfg.tierRows = Number(t.value);
      var max = 1000 - (cfg.tierRows - 1) * 200 - 30;
      var allowed = HEIGHTS.filter(function (h) { return h <= max; });
      if (cfg.heightMm > max && allowed.length) cfg.heightMm = allowed[allowed.length - 1];
      renderConfig();
    } else if (t.name.indexOf("extra-") === 0) {
      cfg.extras[t.value] = t.checked;
      renderConfig();
    }
  });

  document.addEventListener("click", function (e) {
    var step = e.target.closest("[data-step]");
    if (step) {
      var key = step.getAttribute("data-step");
      var delta = Number(step.getAttribute("data-delta"));
      if (key === "cw") cfg.cw = Math.max(1, Math.min(12, cfg.cw + delta));
      else cfg.cd = Math.max(1, Math.min(8, cfg.cd + delta));
      renderConfig();
    }
  });

  function buildSummary() {
    var calc = cfgCalc();
    return {
      sizeLabel: calc.sizeLabel,
      dims: calc.isChoir ? calc.w + "m wide × " + calc.d.toFixed(2) + "m deep" : calc.w + "m × " + calc.d + "m",
      decks: calc.modules,
      heightCm: cfg.heightMm / 10,
      configuration: calc.configuration,
      heightDetail: calc.heightDetail,
      deckType: calc.deck.label,
      extras: EXTRAS.filter(function (e) { return cfg.extras[e.id]; }).map(function (e) { return e.label; }),
      subtotal: calc.subtotal,
      discountPct: calc.pct,
      code: state.funding ? D.ECAL_REFERENCE : undefined,
      priceBasis: calc.priceBasis,
      total: calc.total,
      totalIncVat: calc.totalIncVat
    };
  }

  function addConfigToBasket() {
    var calc = cfgCalc();
    var chosenExtras = EXTRAS.filter(function (e) { return cfg.extras[e.id]; });
    addItem(
      {
        id:
          "stage-" +
          calc.w +
          "x" +
          calc.d +
          "-" +
          cfg.heightMm +
          "-" +
          calc.deck.id +
          "-" +
          chosenExtras.map(function (e) { return e.id; }).join("+") +
          "-" +
          (calc.isChoir ? "choir-" + cfg.tierRows : "flat"),
        name: (calc.isChoir ? "Choir Stage" : "Custom Stage") + " " + calc.sizeLabel + " · " + calc.deck.label,
        price: Math.round(calc.subtotal * 1.2 * 100) / 100,
        image: calc.isChoir ? D.IMAGES.choirTiers : D.IMAGES.pkg4x3,
        meta:
          calc.configuration +
          " · " +
          calc.modules +
          " modules" +
          (chosenExtras.length ? " + " + chosenExtras.map(function (e) { return e.label; }).join(", ") : "") +
          " · inc VAT"
      },
      1,
      true
    );
  }

  var cfgQuoteBtn = $("#cfg-quote");
  if (cfgQuoteBtn) cfgQuoteBtn.addEventListener("click", function () { openQuote(buildSummary()); });
  var cfgAddBtn = $("#cfg-add");
  if (cfgAddBtn) cfgAddBtn.addEventListener("click", addConfigToBasket);
  var cfgRemoveFunding = $("#cfg-remove-funding");
  if (cfgRemoveFunding) cfgRemoveFunding.addEventListener("click", function () { setFunding(null); });

  /* ------------------------------------------------------------------ */
  /* Isometric stage preview (faithful port of IsoStage.tsx)             */
  /* ------------------------------------------------------------------ */
  function isoStage(opts) {
    var w = opts.w;
    var d = opts.d;
    var heightCm = opts.heightCm;
    var valance = !!opts.valance;
    var steps = !!opts.steps;
    var ramp = !!opts.ramp;
    var tierRows = opts.tierRows || 1;

    var S = 34;
    var COS = Math.cos(Math.PI / 6);
    function proj(x, y, z) {
      return [(x - y) * COS * S, (x + y) * 0.5 * S - z * S];
    }
    function pt(x, y, z) {
      var p = proj(x, y, z);
      return p[0].toFixed(1) + "," + p[1].toFixed(1);
    }
    function poly(a, b, c, e) {
      return [a, b, c, e].map(function (v) { return pt(v[0], v[1], v[2]); }).join(" ");
    }

    var tierCount = Math.max(1, Math.min(4, Math.round(tierRows)));
    var t = 0.03;
    var baseZTop = heightCm / 100;
    function getTierZ(idx) {
      return Math.min(1, (heightCm + (tierCount - 1 - idx) * 20) / 100);
    }
    var zTop = tierCount === 1 ? baseZTop : getTierZ(tierCount - 1);
    var zBase = baseZTop - t;

    var pts = [];
    function add(x, y, z) { pts.push(proj(x, y, z)); }
    if (tierCount === 1) {
      [0, w].forEach(function (x) {
        [0, d].forEach(function (y) {
          add(x, y, 0);
          add(x, y, zTop);
        });
      });
    } else {
      for (var ti = 0; ti < tierCount; ti++) {
        var ty0 = (d * ti) / tierCount;
        var ty1 = (d * (ti + 1)) / tierCount;
        var tz = getTierZ(ti);
        [0, w].forEach(function (x) {
          add(x, ty0, 0);
          add(x, ty0, tz);
          add(x, ty1, 0);
          add(x, ty1, tz);
        });
      }
    }
    add(-1.2, d * 0.3, 0);
    add(-1.2, d * 0.3, 1.95);
    if (steps) add(1.5, d + 0.6, 0);
    if (ramp) add(w + 1.4, d * 0.5, 0);
    var minX = Math.min.apply(null, pts.map(function (p) { return p[0]; })) - 24;
    var maxX = Math.max.apply(null, pts.map(function (p) { return p[0]; })) + 24;
    var minY = Math.min.apply(null, pts.map(function (p) { return p[1]; })) - 20;
    var maxY = Math.max.apply(null, pts.map(function (p) { return p[1]; })) + 26;

    var cells = "";
    if (tierCount === 1) {
      for (var i = 0; i < w; i++) {
        for (var j = 0; j < d; j++) {
          cells +=
            '<polygon points="' +
            poly([i, j, zTop], [i + 1, j, zTop], [i + 1, j + 1, zTop], [i, j + 1, zTop]) +
            '" fill="' + ((i + j) % 2 === 0 ? "#2b3648" : "#334155") +
            '" stroke="#0f172a" stroke-opacity="0.55" stroke-width="0.7"></polygon>';
        }
      }
    } else {
      for (var tii = 0; tii < tierCount; tii++) {
        var cy0 = (d * tii) / tierCount;
        var cy1 = (d * (tii + 1)) / tierCount;
        var czt = getTierZ(tii);
        var baseShade = 0.18 + tii * 0.06;
        for (var ci = 0; ci < w; ci++) {
          var cellPts = poly([ci, cy0, czt], [ci + 1, cy0, czt], [ci + 1, cy1, czt], [ci, cy1, czt]);
          cells +=
            '<g><polygon points="' + cellPts + '" fill="' + (tii % 2 === 0 ? "#2b3648" : "#334155") +
            '" stroke="#0f172a" stroke-opacity="0.55" stroke-width="0.7"></polygon>' +
            '<polygon points="' + cellPts + '" fill="#fff" fill-opacity="' + (baseShade * 0.35).toFixed(3) + '" stroke="none"></polygon>';
          if (ci === 0) {
            var lp = proj((w + ci) / 2, (cy0 + cy1) / 2, czt + 0.02);
            cells +=
              '<text x="' + lp[0].toFixed(1) + '" y="' + lp[1].toFixed(1) +
              '" text-anchor="middle" dominant-baseline="middle" font-size="' + (w > 4 ? 7 : 6) +
              '" font-weight="800" fill="#a3e635" fill-opacity="0.95" paint-order="stroke" stroke="#0a2a1a" stroke-width="2.5" stroke-opacity="0.6">ROW ' +
              (tii + 1) + "</text>";
          }
          cells += "</g>";
        }
      }
    }

    function leg(x, y, zb) {
      var a = proj(x, y, zb);
      var b = proj(x, y, 0);
      return (
        '<g><line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) +
        '" stroke="#15803d" stroke-width="3.2" stroke-linecap="round"></line><line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) +
        '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="#a3e635" stroke-opacity="0.5" stroke-width="1" stroke-linecap="round"></line>' +
        '<ellipse cx="' + b[0].toFixed(1) + '" cy="' + b[1].toFixed(1) + '" rx="4.4" ry="1.8" fill="#cbd5e1"></ellipse></g>'
      );
    }

    var legs = "";
    if (!valance) {
      if (tierCount === 1) {
        for (var lj = 0; lj <= d; lj++) legs += leg(w, lj, zBase);
        for (var li = 0; li < w; li++) legs += leg(li, d, zBase);
      } else {
        for (var lti = 0; lti < tierCount; lti++) {
          var ly0 = (d * lti) / tierCount;
          var ly1 = (d * (lti + 1)) / tierCount;
          var lzb = getTierZ(lti) - t;
          for (var lxi = 0; lxi <= w; lxi++) {
            legs += leg(lxi, ly0, lzb);
            legs += leg(lxi, ly1, lzb);
          }
        }
      }
    }

    var pleatsR = "";
    var pleatsL = "";
    if (valance) {
      if (tierCount === 1) {
        for (var pj = 0; pj <= d * 3; pj++) {
          var yy = pj / 3;
          var r1 = proj(w, yy, zBase);
          var r2 = proj(w, yy, 0);
          pleatsR += '<line x1="' + r1[0].toFixed(1) + '" y1="' + r1[1].toFixed(1) + '" x2="' + r2[0].toFixed(1) + '" y2="' + r2[1].toFixed(1) + '" stroke="#fff" stroke-opacity="0.09" stroke-width="1"></line>';
        }
        for (var qi = 0; qi <= w * 3; qi++) {
          var xx = qi / 3;
          var l1 = proj(xx, d, zBase);
          var l2 = proj(xx, d, 0);
          pleatsL += '<line x1="' + l1[0].toFixed(1) + '" y1="' + l1[1].toFixed(1) + '" x2="' + l2[0].toFixed(1) + '" y2="' + l2[1].toFixed(1) + '" stroke="#fff" stroke-opacity="0.09" stroke-width="1"></line>';
        }
      } else {
        for (var vti = 0; vti < tierCount; vti++) {
          var vy1 = (d * (vti + 1)) / tierCount;
          var vzb = getTierZ(vti) - t;
          var vr1 = proj(w, vy1, vzb);
          var vr2 = proj(w, vy1, 0);
          pleatsR += '<line x1="' + vr1[0].toFixed(1) + '" y1="' + vr1[1].toFixed(1) + '" x2="' + vr2[0].toFixed(1) + '" y2="' + vr2[1].toFixed(1) + '" stroke="#fff" stroke-opacity="0.07" stroke-width="1"></line>';
        }
        for (var wi = 0; wi <= w * 3; wi++) {
          var wxx = wi / 3;
          var wzb = getTierZ(tierCount - 1) - t;
          var wl1 = proj(wxx, d, wzb);
          var wl2 = proj(wxx, d, 0);
          pleatsL += '<line x1="' + wl1[0].toFixed(1) + '" y1="' + wl1[1].toFixed(1) + '" x2="' + wl2[0].toFixed(1) + '" y2="' + wl2[1].toFixed(1) + '" stroke="#fff" stroke-opacity="0.09" stroke-width="1"></line>';
        }
      }
    }

    var person = proj(-1.2, d * 0.3, 0);
    var px = person[0];
    var py = person[1];
    var stepsZ = Math.max(zTop / 2, 0.12);

    var slab = "";
    if (tierCount === 1) {
      slab += '<polygon points="' + poly([0, d, zTop], [w, d, zTop], [w, d, zBase], [0, d, zBase]) + '" fill="#14492e"></polygon>';
      slab += '<polygon points="' + poly([w, 0, zTop], [w, d, zTop], [w, d, zBase], [w, 0, zBase]) + '" fill="#0a2a1a"></polygon>';
      slab += '<polygon points="' + poly([0, d, zTop - t * 0.35], [w, d, zTop - t * 0.35], [w, d, zTop - t * 0.7], [0, d, zTop - t * 0.7]) + '" fill="#a3e635"></polygon>';
      slab += '<polygon points="' + poly([w, 0, zTop - t * 0.35], [w, d, zTop - t * 0.35], [w, d, zTop - t * 0.7], [w, 0, zTop - t * 0.7]) + '" fill="#84cc16"></polygon>';
    } else {
      for (var sti = 0; sti < tierCount; sti++) {
        var idx = tierCount - 1 - sti;
        var sy0 = (d * idx) / tierCount;
        var sy1 = (d * (idx + 1)) / tierCount;
        var szt = getTierZ(idx);
        var szb = szt - t;
        slab +=
          '<g><polygon points="' + poly([0, sy1, szt], [w, sy1, szt], [w, sy1, szb], [0, sy1, szb]) + '" fill="#14492e" fill-opacity="' + (0.95 - idx * 0.08).toFixed(2) + '"></polygon>' +
          '<polygon points="' + poly([w, sy0, szt], [w, sy1, szt], [w, sy1, szb], [w, sy0, szb]) + '" fill="#0a2a1a" fill-opacity="' + (0.95 - idx * 0.08).toFixed(2) + '"></polygon>' +
          (idx === 0 ? '<polygon points="' + poly([0, sy0, szt], [w, sy0, szt], [w, sy0, szb], [0, sy0, szb]) + '" fill="#0f2f1f"></polygon>' : "") +
          '<polygon points="' + poly([0, sy1, szt - t * 0.35], [w, sy1, szt - t * 0.35], [w, sy1, szt - t * 0.7], [0, sy1, szt - t * 0.7]) + '" fill="#a3e635"></polygon>' +
          '<polygon points="' + poly([w, sy0, szt - t * 0.35], [w, sy1, szt - t * 0.35], [w, sy1, szt - t * 0.7], [w, sy0, szt - t * 0.7]) + '" fill="#84cc16"></polygon></g>';
      }
    }

    var val = "";
    if (valance && tierCount === 1) {
      val += '<polygon points="' + poly([0, d, zBase], [w, d, zBase], [w, d, 0], [0, d, 0]) + '" fill="#111827"></polygon>';
      val += '<polygon points="' + poly([w, 0, zBase], [w, d, zBase], [w, d, 0], [w, 0, 0]) + '" fill="#05080c"></polygon>';
      val += pleatsL + pleatsR;
    } else if (valance && tierCount > 1) {
      for (var vai = 0; vai < tierCount; vai++) {
        var vay1 = (d * (vai + 1)) / tierCount;
        var vay0 = (d * vai) / tierCount;
        var vazb = getTierZ(vai) - t;
        val += '<g><polygon points="' + poly([0, vay1, vazb], [w, vay1, vazb], [w, vay1, 0], [0, vay1, 0]) + '" fill="#111827" fill-opacity="0.92"></polygon>';
        if (vai === 0)
          val += '<polygon points="' + poly([w, vay0, vazb], [w, vay1, vazb], [w, vay1, 0], [w, vay0, 0]) + '" fill="#05080c"></polygon>';
        if (vai === tierCount - 1)
          val += '<polygon points="' + poly([w, vay0, vazb], [w, d, vazb], [w, d, 0], [w, vay0, 0]) + '" fill="#05080c"></polygon>';
        val += "</g>";
      }
      val += pleatsL + pleatsR;
    }

    var sheen = "";
    if (tierCount === 1) {
      sheen = '<polygon points="' + poly([0, 0, zTop], [w, 0, zTop], [w, d, zTop], [0, d, zTop]) + '" fill="url(#iso-top-sheen)" pointer-events="none"></polygon>';
    } else {
      for (var shi = 0; shi < tierCount; shi++) {
        var shy0 = (d * shi) / tierCount;
        var shy1 = (d * (shi + 1)) / tierCount;
        var shzt = getTierZ(shi);
        sheen += '<polygon points="' + poly([0, shy0, shzt], [w, shy0, shzt], [w, shy1, shzt], [0, shy1, shzt]) + '" fill="url(#iso-top-sheen)" pointer-events="none"></polygon>';
      }
    }

    var stepsMarkup = "";
    if (steps) {
      stepsMarkup =
        '<g><polygon points="' + poly([0.4, d, stepsZ], [1.4, d, stepsZ], [1.4, d + 0.55, stepsZ], [0.4, d + 0.55, stepsZ]) + '" fill="#cbd5e1" stroke="#64748b" stroke-width="0.8"></polygon>' +
        '<polygon points="' + poly([0.4, d + 0.55, stepsZ], [1.4, d + 0.55, stepsZ], [1.4, d + 0.55, 0], [0.4, d + 0.55, 0]) + '" fill="#64748b"></polygon>' +
        '<polygon points="' + poly([1.4, d, stepsZ], [1.4, d + 0.55, stepsZ], [1.4, d + 0.55, 0], [1.4, d, 0]) + '" fill="#475569"></polygon></g>';
    }

    var rampMarkup = "";
    if (ramp) {
      rampMarkup =
        '<g><polygon points="' + poly([w, d * 0.5 - 0.5, zBase + 0.02], [w, d * 0.5 + 0.5, zBase + 0.02], [w + 1.3, d * 0.5 + 0.5, 0], [w + 1.3, d * 0.5 - 0.5, 0]) + '" fill="#94a3b8" stroke="#475569" stroke-width="0.8"></polygon>' +
        '<polygon points="' + poly([w + 1.3, d * 0.5 + 0.5, 0], [w + 1.3, d * 0.5 - 0.5, 0], [w + 1.3, d * 0.5 - 0.5, 0.03], [w + 1.3, d * 0.5 + 0.5, 0.03]) + '" fill="#64748b"></polygon></g>';
    }

    var label =
      "Isometric preview of a " + w + " by " + d + " metre stage" +
      (tierCount > 1 ? " with " + tierCount + " choir rows stepping up toward the back" : " at " + heightCm + " centimetres high");

    return (
      '<svg viewBox="' + minX.toFixed(1) + " " + minY.toFixed(1) + " " + (maxX - minX).toFixed(1) + " " + (maxY - minY).toFixed(1) +
      '" preserveAspectRatio="xMidYMid meet" class="h-full w-full" role="img" aria-label="' + label + '">' +
      '<defs><filter id="iso-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"></feGaussianBlur></filter>' +
      '<linearGradient id="iso-top-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.16"></stop><stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop></linearGradient></defs>' +
      '<polygon points="' + poly([-0.35, -0.35, 0], [w + 0.5, -0.35, 0], [w + 0.5, d + 0.5, 0], [-0.35, d + 0.5, 0]) + '" fill="#000" fill-opacity="0.45" filter="url(#iso-blur)"></polygon>' +
      legs + rampMarkup + slab + val + cells + sheen + stepsMarkup +
      '<g opacity="0.95" aria-hidden="true"><ellipse cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" rx="9" ry="3.5" fill="#000" fill-opacity="0.35"></ellipse>' +
      '<rect x="' + (px - 6).toFixed(1) + '" y="' + (py - 1.1 * S).toFixed(1) + '" width="12" height="' + (1.1 * S).toFixed(1) + '" rx="5" fill="#a3e635"></rect>' +
      '<rect x="' + (px - 8).toFixed(1) + '" y="' + (py - 1.5 * S).toFixed(1) + '" width="16" height="' + (0.62 * S).toFixed(1) + '" rx="7" fill="#d9f99d"></rect>' +
      '<circle cx="' + px.toFixed(1) + '" cy="' + (py - 1.68 * S).toFixed(1) + '" r="5.2" fill="#ecfccb"></circle></g></svg>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Cart                                                                */
  /* ------------------------------------------------------------------ */
  function updateCartBadges() {
    var totals = cartTotals();
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = totals.count;
    });
    $$("[data-open-cart]").forEach(function (el) {
      el.setAttribute("aria-label", "Open basket, " + totals.count + " item" + (totals.count === 1 ? "" : "s"));
    });
  }

  function renderCart() {
    var content = $("#cart-content");
    if (!content) return;
    var t = cartTotals();
    updateCartBadges();

    if (!state.cart.length) {
      content.innerHTML =
        '<div class="flex flex-1 flex-col items-center justify-center px-8 text-center">' +
        '<span class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">' + icon("shopping-basket", "h-9 w-9") + "</span>" +
        '<p class="mt-5 text-lg font-extrabold text-forest-900">Your basket is empty</p>' +
        '<p class="mt-1 text-sm text-slate-600">Build a stage in 60 seconds or browse our ranges.</p>' +
        '<a href="#quote-builder" data-close="cart" class="mt-6 inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-extrabold text-forest-900 transition hover:bg-lime-300">Build your stage ' + icon("arrow-right", "h-4 w-4") + "</a></div>";
      return;
    }

    var itemsHtml = state.cart
      .map(function (it) {
        return (
          '<li class="overflow-hidden"><div class="flex gap-3.5 py-4">' +
          '<img src="' + it.image + '" alt="" class="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-200">' +
          '<div class="min-w-0 flex-1"><p class="text-sm font-bold leading-snug text-forest-900">' + esc(it.name) + "</p>" +
          (it.meta ? '<p class="mt-0.5 text-xs text-slate-600">' + esc(it.meta) + "</p>" : "") +
          '<div class="mt-2.5 flex items-center justify-between">' +
          '<div class="flex items-center rounded-lg border border-slate-200">' +
          '<button type="button" data-qty-decrease="' + it.id + '" aria-label="Decrease quantity of ' + esc(it.name) + '" class="flex h-8 w-8 items-center justify-center rounded-l-lg text-forest-900 transition hover:bg-slate-100">' + icon("minus", "h-3.5 w-3.5") + "</button>" +
          '<span class="w-8 text-center text-sm font-extrabold tabular-nums" aria-live="polite">' + it.qty + "</span>" +
          '<button type="button" data-qty-increase="' + it.id + '" aria-label="Increase quantity of ' + esc(it.name) + '" class="flex h-8 w-8 items-center justify-center rounded-r-lg text-forest-900 transition hover:bg-slate-100">' + icon("plus", "h-3.5 w-3.5") + "</button>" +
          "</div>" +
          '<p class="text-sm font-extrabold tabular-nums text-forest-900">' + gbp(it.price * it.qty) + "</p></div></div>" +
          '<button type="button" data-remove-item="' + it.id + '" aria-label="Remove ' + esc(it.name) + '" class="self-start rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-700">' + icon("trash-2", "h-4 w-4") + "</button>" +
          "</div></li>"
        );
      })
      .join("");

    var promoMsg = state.promoMsg
      ? '<p role="status" class="mt-2 text-xs font-semibold ' + (state.promoMsg.ok ? "text-forest-600" : "text-red-700") + '">' + esc(state.promoMsg.text) + "</p>"
      : "";

    content.innerHTML =
      '<div class="border-b border-slate-100 bg-slate-50 px-5 py-3">' +
      '<p class="flex items-center gap-2 text-xs font-bold text-forest-900">' + icon("truck", "h-4 w-4 shrink-0 text-forest-600") + "<span>Manufactured in Sheffield &amp; delivered direct to you across the UK · all prices inc VAT</span></p>" +
      '<button type="button" data-cart-funding class="mt-1 flex items-center gap-2 text-left text-xs font-semibold text-forest-700 underline decoration-electric decoration-2 underline-offset-2">' + icon("ticket", "h-4 w-4 shrink-0 text-forest-600") + "<span>ECAL funding accepted — up to 20% off for Education, Charity, Arts &amp; Leisure organisations</span></button></div>" +
      '<ul class="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">' + itemsHtml + "</ul>" +
      '<div class="border-t border-slate-200 bg-white px-5 pb-5 pt-4">' +
      '<form id="promo-form" class="flex gap-2"><label for="promo" class="sr-only">ECAL funding reference</label>' +
      '<div class="relative flex-1">' + icon("tag", "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500") +
      '<input id="promo" value="' + esc(state.promoValue) + '" placeholder="ECAL funding reference" class="h-11 w-full rounded-xl border-2 border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold uppercase text-forest-900 outline-none transition placeholder:normal-case placeholder:font-medium placeholder:text-slate-500 focus:border-forest-700 focus:shadow-[0_0_0_4px_rgba(163,230,53,0.35)]"></div>' +
      '<button type="submit" class="rounded-xl bg-forest-900 px-4 text-sm font-bold text-white transition hover:bg-forest-800">Apply</button></form>' +
      promoMsg +
      '<dl class="mt-4 space-y-1.5 text-sm">' +
      '<div class="flex justify-between text-slate-600"><dt>Subtotal (inc. VAT)</dt><dd class="font-semibold tabular-nums">' + gbp2(t.subtotal) + "</dd></div>" +
      (state.funding
        ? '<div class="flex justify-between font-semibold text-forest-600"><dt class="flex items-center gap-1.5">' + D.ECAL_REFERENCE + " funding (−" + t.discountPct + '%)' +
          '<button type="button" data-remove-funding aria-label="Remove ECAL funding" class="rounded p-0.5 text-slate-500 hover:text-red-700">' + icon("x", "h-3.5 w-3.5") + "</button></dt>" +
          '<dd class="tabular-nums">−' + gbp2(t.discount) + "</dd></div>"
        : "") +
      '<div class="flex justify-between border-t border-slate-200 pt-2.5 text-lg font-extrabold text-forest-900"><dt>Total (inc. VAT)</dt><dd class="tabular-nums">' + gbp2(t.total) + "</dd></div></dl>" +
      '<button type="button" data-checkout class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-electric px-5 py-4 text-base font-extrabold text-forest-900 shadow-[0_10px_30px_-8px_rgba(132,204,22,0.9)] transition hover:bg-lime-300">' + icon("lock", "h-4 w-4") + " Secure checkout</button>" +
      '<p id="cart-checkout-msg" role="status" class="mt-2 min-h-4 text-center text-xs text-slate-600">' + (state.checkoutMsg ? "Design prototype — checkout connects to your live WooCommerce store." : "Totally magnetic · no locks to replace · up to 15-year lifespan") + "</p>" +
      "</div>";

    var input = $("#promo", content);
    if (input) {
      input.addEventListener("input", function () {
        state.promoValue = input.value;
      });
    }
    var promoForm = $("#promo-form", content);
    if (promoForm) {
      promoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var value = input ? input.value : "";
        state.promoValue = value;
        if (value.trim().toUpperCase() !== D.ECAL_REFERENCE) {
          state.promoMsg = { ok: false, text: "Enter your ECAL funding reference — tap “Get Code” in the top bar to unlock it." };
          renderCart();
          return;
        }
        if (!state.funding) {
          state.promoMsg = { ok: false, text: "Choose your organisation type first — tap “Get Code” in the top bar." };
          renderCart();
          return;
        }
        state.promoMsg = {
          ok: true,
          text: D.ECAL_REFERENCE + " funding applied — up to " + state.funding.pct + "% off, confirmed on your official quotation."
        };
        state.promoValue = "";
        renderCart();
      });
    }
  }

  function openCart() {
    renderCart();
    openDialog("cart-overlay");
  }

  function addItem(item, qty, openDrawer) {
    qty = qty || 1;
    var existing = state.cart.filter(function (i) { return i.id === item.id; })[0];
    if (existing) existing.qty += qty;
    else state.cart.push({ id: item.id, name: item.name, price: item.price, qty: qty, image: item.image, meta: item.meta });
    renderCart();
    if (openDrawer !== false) openCart();
  }

  document.addEventListener("click", function (e) {
    var dec = e.target.closest("[data-qty-decrease]");
    if (dec) {
      var id = dec.getAttribute("data-qty-decrease");
      var it = state.cart.filter(function (x) { return x.id === id; })[0];
      if (!it) return;
      if (it.qty <= 1) state.cart = state.cart.filter(function (x) { return x.id !== id; });
      else it.qty -= 1;
      renderCart();
      return;
    }
    var inc = e.target.closest("[data-qty-increase]");
    if (inc) {
      var id2 = inc.getAttribute("data-qty-increase");
      var it2 = state.cart.filter(function (x) { return x.id === id2; })[0];
      if (it2) it2.qty += 1;
      renderCart();
      return;
    }
    var rm = e.target.closest("[data-remove-item]");
    if (rm) {
      state.cart = state.cart.filter(function (x) { return x.id !== rm.getAttribute("data-remove-item"); });
      renderCart();
      return;
    }
    var rf = e.target.closest("[data-remove-funding]");
    if (rf) {
      setFunding(null);
      return;
    }
    var co = e.target.closest("[data-checkout]");
    if (co) {
      state.checkoutMsg = true;
      var msg = $("#cart-checkout-msg");
      if (msg) msg.textContent = "Design prototype — checkout connects to your live WooCommerce store.";
      return;
    }
    var cf = e.target.closest("[data-cart-funding]");
    if (cf) {
      closeDialog("cart-overlay", true, true);
      openFunding();
      return;
    }
    var quick = e.target.closest("[data-quick-add]");
    if (quick) {
      e.preventDefault();
      var p = D.PRODUCTS.filter(function (x) { return x.id === quick.getAttribute("data-quick-add"); })[0];
      if (p) addItem({ id: p.id, name: p.name, price: p.price, image: p.image, meta: p.blurb }, 1, true);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Funding modal                                                       */
  /* ------------------------------------------------------------------ */
  var fundingRef = "ECAL-" + Math.floor(10000 + Math.random() * 89999);
  var fundingRefEl = $("#funding-ref");
  if (fundingRefEl) fundingRefEl.textContent = fundingRef;

  function clearFieldError(input, errorId) {
    if (input) {
      input.setAttribute("aria-invalid", "false");
      input.removeAttribute("aria-describedby");
      input.classList.remove("border-red-400");
    }
    var err = document.getElementById(errorId);
    if (err) {
      err.textContent = "";
      err.style.display = "none";
    }
  }
  function setFieldError(input, errorId, text) {
    if (input) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errorId);
    }
    var err = document.getElementById(errorId);
    if (err) {
      err.textContent = text;
      err.style.display = "block";
    }
  }

  function openFunding() {
    var form = $("#funding-form");
    var formView = $("#funding-form-view");
    var success = $("#funding-success");
    if (formView) formView.style.display = "block";
    if (success) success.style.display = "none";
    if (form) {
      form.reset();
      clearFieldError(document.getElementById("ecal-name"), "ecal-name-err");
      clearFieldError(document.getElementById("ecal-email"), "ecal-email-err");
      clearFieldError(document.getElementById("ecal-org-type"), "ecal-org-err");
    }
    openDialog("funding-overlay");
  }

  function setFunding(tier) {
    state.funding = tier;
    updatePromoLabel();
    renderConfig();
    renderCart();
    updateCartBadges();
  }

  function collectMeta() {
    var nav = navigator || {};
    var scr = typeof screen !== "undefined" ? screen : { width: 0, height: 0 };
    return {
      userAgent: nav.userAgent || "",
      language: nav.language || "",
      platform: nav.platform || "",
      screen: scr.width + "×" + scr.height,
      viewport: window.innerWidth + "×" + window.innerHeight,
      timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || ""),
      referrer: document.referrer,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
  }

  var fundingForm = $("#funding-form");
  if (fundingForm) {
    fundingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = fundingForm.querySelector('[name="name"]');
      var email = fundingForm.querySelector('[name="email"]');
      var org = fundingForm.querySelector('[name="orgType"]');
      var valid = true;
      if (!name.value.trim()) {
        setFieldError(name, "ecal-name-err", "Please enter your full name");
        valid = false;
      } else clearFieldError(name, "ecal-name-err");
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        setFieldError(email, "ecal-email-err", "Please enter a valid email address");
        valid = false;
      } else clearFieldError(email, "ecal-email-err");
      if (!org.value) {
        setFieldError(org, "ecal-org-err", "Please select an organisation type");
        valid = false;
      } else clearFieldError(org, "ecal-org-err");
      if (!valid) return;

      var payload = {
        fullName: name.value.trim(),
        email: email.value.trim(),
        phone: fundingForm.querySelector('[name="phone"]').value.trim(),
        organisationName: fundingForm.querySelector('[name="orgName"]').value.trim(),
        organisationType: org.value,
        stageNotes: fundingForm.querySelector('[name="notes"]').value.trim(),
        source: "ECAL lead modal",
        meta: collectMeta()
      };
      console.info("[ECAL lead]", payload);

      var tier = D.FUNDING_TIERS.filter(function (t) { return t.id === org.value; })[0] || null;
      setFunding(tier);
      $("#funding-form-view").style.display = "none";
      $("#funding-success").style.display = "block";
    });
  }

  /* ------------------------------------------------------------------ */
  /* Quote modal                                                         */
  /* ------------------------------------------------------------------ */
  var quoteRefCounter = 0;
  function quoteSummaryMarkup(q) {
    var out = "";
    function row(label, value, cls) {
      return (
        '<dt class="text-white/70' + (cls ? " " + cls : "") + '">' + esc(label) + '</dt><dd class="text-right font-bold' +
        (cls ? " border-t border-white/15 pt-2" : "") + '">' + value + "</dd>"
      );
    }
    out += row("Stage", esc(q.dims));
    if (q.configuration) out += row("Configuration", esc(q.configuration));
    out += row("Decks", esc(q.decks + " × " + q.deckType));
    if (q.heightDetail) out += row("Stage heights", esc(q.heightDetail));
    if (q.extras && q.extras.length) out += row("Extras", esc(q.extras.join(", ")));
    if (q.discountPct > 0) {
      out +=
        '<dt class="text-white/70">Funding (' + esc(q.code || "") + ')</dt><dd class="text-right font-bold text-electric">−' +
        q.discountPct + "%</dd>";
    }
    if (q.priceBasis) out += row("Estimate based on", esc(q.priceBasis));
    out +=
      '<dt class="border-t border-white/15 pt-2 text-white/70">Estimate ex. VAT</dt><dd class="border-t border-white/15 pt-2 text-right text-xl font-extrabold text-electric">' +
      gbp(q.total) + "</dd>";
    if (q.totalIncVat != null) out += row("Estimate inc. VAT", esc(gbp(q.totalIncVat)));
    return out;
  }

  function openQuote(summary) {
    state.quote = summary;
    var form = $("#quote-form");
    var formView = $("#quote-form-view");
    var success = $("#quote-success");
    if (formView) formView.style.display = "block";
    if (success) success.style.display = "none";
    if (form) {
      form.reset();
      ["q-name", "q-email"].forEach(function (id) {
        clearFieldError(document.getElementById(id), id + "-err");
      });
    }
    quoteRefCounter++;
    var ref = "NG-" + Math.floor(10000 + Math.random() * 89999);
    var refEl = $("#quote-ref");
    if (refEl) refEl.textContent = ref;
    var summaryEl = $("#quote-summary");
    if (summaryEl) summaryEl.innerHTML = quoteSummaryMarkup(summary);
    openDialog("quote-overlay");
  }

  var quoteForm = $("#quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = quoteForm.querySelector('[name="name"]');
      var email = quoteForm.querySelector('[name="email"]');
      var valid = true;
      if (!name.value.trim()) {
        setFieldError(name, "q-name-err", "Please enter your name");
        valid = false;
      } else clearFieldError(name, "q-name-err");
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        setFieldError(email, "q-email-err", "Please enter a valid email address");
        valid = false;
      } else clearFieldError(email, "q-email-err");
      if (!valid) return;
      $("#quote-form-view").style.display = "none";
      $("#quote-success").style.display = "block";
    });
  }

  /* ------------------------------------------------------------------ */
  /* Video showcase                                                      */
  /* ------------------------------------------------------------------ */
  var activeVideoTab = 0;
  function setVideoTab(index) {
    activeVideoTab = index;
    $$("[data-video-tab]").forEach(function (btn, i) {
      var on = i === index;
      btn.setAttribute("aria-selected", String(on));
      btn.setAttribute("tabindex", on ? "0" : "-1");
      btn.classList.toggle("text-forest-900", on);
      btn.classList.toggle("text-white/80", !on);
      btn.classList.toggle("hover:text-white", !on);
      var existing = btn.querySelector("[data-video-pill]");
      if (existing) existing.remove();
      if (on) {
        var pill = document.createElement("span");
        pill.setAttribute("data-video-pill", "");
        pill.className = "absolute inset-0 rounded-xl bg-electric shadow-[0_8px_24px_-6px_rgba(163,230,53,0.7)]";
        btn.insertBefore(pill, btn.firstChild);
      }
    });
    $$("[data-video-panel]").forEach(function (panel, i) {
      panel.style.display = i === index ? "grid" : "none";
    });
  }

  $$("[data-video-tab]").forEach(function (btn, i) {
    btn.addEventListener("click", function () { setVideoTab(i); });
    btn.addEventListener("keydown", function (e) {
      var n = i;
      if (e.key === "ArrowRight") n = (i + 1) % D.VIDEO_TABS.length;
      else if (e.key === "ArrowLeft") n = (i - 1 + D.VIDEO_TABS.length) % D.VIDEO_TABS.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = D.VIDEO_TABS.length - 1;
      else return;
      e.preventDefault();
      setVideoTab(n);
      var next = $$("[data-video-tab]")[n];
      if (next) next.focus();
    });
  });

  function openVideo(index) {
    var tab = D.VIDEO_TABS[index];
    if (!tab) return;
    var wrap = $("#video-iframe-wrap");
    if (wrap) {
      wrap.innerHTML =
        '<iframe src="https://www.youtube.com/embed/' + tab.yt + "?autoplay=1&start=" + tab.start +
        '&rel=0" title="' + esc(tab.title) + '" class="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    }
    $("#video-modal-title").textContent = tab.title;
    var link = $("#video-modal-link");
    if (link) link.href = "https://www.youtube.com/watch?v=" + tab.yt;
    openDialog("video-overlay");
  }
  $$("[data-play-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openVideo(Number(btn.getAttribute("data-play-video")));
    });
  });

  /* ------------------------------------------------------------------ */
  /* Reviews carousel                                                    */
  /* ------------------------------------------------------------------ */
  var scroller = $("#review-scroller");
  if (scroller) {
    var prevBtn = $("#review-prev");
    var nextBtn = $("#review-next");
    var dots = $$("[data-review-dot]");
    function reviewStep() {
      var card = scroller.querySelector("li");
      return card ? card.getBoundingClientRect().width + 20 : 0;
    }
    function updateReviews() {
      var step = reviewStep();
      if (prevBtn) prevBtn.disabled = scroller.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
      var active = step ? Math.min(D.REVIEWS.length - 1, Math.max(0, Math.round(scroller.scrollLeft / step))) : 0;
      dots.forEach(function (d, i) {
        d.setAttribute("aria-current", String(i === active));
        d.className =
          "h-2.5 rounded-full transition-all " + (i === active ? "w-8 bg-forest-800" : "w-2.5 bg-slate-300 hover:bg-slate-400");
      });
    }
    function jumpScroll(left) {
      // CSS scroll-behavior:smooth wins over `behavior:"auto"`, so switch it off briefly.
      var prev = scroller.style.scrollBehavior;
      scroller.style.scrollBehavior = "auto";
      scroller.scrollLeft = left;
      scroller.style.scrollBehavior = prev;
    }
    function scrollByCards(dir) {
      if (reduceMotion()) jumpScroll(scroller.scrollLeft + dir * reviewStep());
      else scroller.scrollBy({ left: dir * reviewStep(), behavior: "smooth" });
    }
    function afterScroll() {
      updateReviews();
      window.setTimeout(updateReviews, 380);
      window.setTimeout(updateReviews, 700);
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCards(-1); afterScroll(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCards(1); afterScroll(); });
    dots.forEach(function (d) {
      d.addEventListener("click", function () {
        var target = Number(d.getAttribute("data-review-dot")) * reviewStep();
        if (reduceMotion()) jumpScroll(target);
        else scroller.scrollTo({ left: target, behavior: "smooth" });
        afterScroll();
      });
    });
    scroller.addEventListener("scroll", updateReviews, { passive: true });
    window.addEventListener("resize", updateReviews);
    window.setTimeout(updateReviews, 60);
  }

  /* ------------------------------------------------------------------ */
  /* FAQ accordion                                                       */
  /* ------------------------------------------------------------------ */
  var faqOpen = { 0: true };
  function syncFaq(i) {
    var item = document.querySelector('[data-faq-item="' + i + '"]');
    if (!item) return;
    var open = !!faqOpen[i];
    var btn = item.querySelector("[data-faq-toggle]");
    var panel = item.querySelector("[data-faq-panel]");
    var num = item.querySelector("[data-faq-number]");
    var chev = item.querySelector("[data-faq-chevron]");
    item.className =
      "overflow-hidden rounded-2xl border-2 bg-white transition duration-300 " +
      (open ? "border-forest-800 shadow-[0_0_0_4px_rgba(163,230,53,0.3)]" : "border-transparent shadow-sm hover:border-forest-300");
    if (btn) btn.setAttribute("aria-expanded", String(open));
    if (num)
      num.className =
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold transition " +
        (open ? "bg-electric text-forest-900" : "bg-forest-900 text-electric");
    if (chev) chev.classList.toggle("rotate-180", open);
    if (panel) {
      panel.className =
        "grid transition-[grid-template-rows] duration-300 ease-out " + (open ? "grid-rows-[1fr]" : "grid-rows-[0fr]");
      panel.toggleAttribute("inert", !open);
    }
  }
  $$("[data-faq-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var i = Number(btn.getAttribute("data-faq-toggle"));
      faqOpen[i] = !faqOpen[i];
      syncFaq(i);
      updateExpandAllLabel();
    });
  });
  function allFaqOpen() {
    return D.FAQS.every(function (_, i) { return !!faqOpen[i]; });
  }
  function updateExpandAllLabel() {
    var btn = $("#faq-expand-all");
    if (btn) btn.textContent = allFaqOpen() ? "Collapse all" : "Expand all";
  }
  var expandAllBtn = $("#faq-expand-all");
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", function () {
      if (allFaqOpen()) {
        D.FAQS.forEach(function (_, i) {
          faqOpen[i] = false;
          syncFaq(i);
        });
      } else {
        D.FAQS.forEach(function (_, i) {
          faqOpen[i] = true;
          syncFaq(i);
        });
      }
      updateExpandAllLabel();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Newsletter                                                          */
  /* ------------------------------------------------------------------ */
  var newsletter = $("#newsletter-form");
  if (newsletter) {
    var emailInput = $("#newsletter-email");
    var errorEl = $("#newsletter-error");
    newsletter.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
        errorEl.style.display = "block";
        emailInput.setAttribute("aria-invalid", "true");
        return;
      }
      errorEl.style.display = "none";
      newsletter.style.display = "none";
      var done = $("#newsletter-done");
      if (done) done.style.display = "flex";
    });
    emailInput.addEventListener("input", function () {
      if (errorEl.style.display !== "none") {
        errorEl.style.display = "none";
        emailInput.setAttribute("aria-invalid", "false");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Back to top                                                         */
  /* ------------------------------------------------------------------ */
  var backTop = $("#back-to-top");
  function onScrollTop() {
    if (!backTop) return;
    var show = window.scrollY > 900;
    if (show && backTop.style.display === "none") {
      backTop.style.display = "flex";
      backTop.classList.remove("nx-visible");
      void backTop.offsetWidth;
      backTop.classList.add("nx-visible");
    } else if (!show && backTop.style.display !== "none") {
      backTop.style.display = "none";
      backTop.classList.remove("nx-visible");
    }
  }
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();
  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                    */
  /* ------------------------------------------------------------------ */
  (function initReveal() {
    var pending = $$("[data-reveal]");
    if (!pending.length) return;
    if (reduceMotion() || !window.requestAnimationFrame) {
      pending.forEach(function (el) {
        el.removeAttribute("data-reveal");
        el.style.transitionDelay = "";
      });
      return;
    }
    var ticking = false;
    function reveal(el) {
      el.classList.add("is-visible");
      // transition-delay is authored in ms ("70ms"); convert to ms for the removal timer.
      var raw = el.style.transitionDelay || "0ms";
      var delayMs = /ms$/.test(raw) ? parseFloat(raw) : (parseFloat(raw) || 0) * 1000;
      window.setTimeout(function () {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-visible");
        el.style.transitionDelay = "";
      }, 650 + (isNaN(delayMs) ? 0 : delayMs));
    }
    function check() {
      ticking = false;
      var threshold = window.innerHeight - 60;
      pending = pending.filter(function (el) {
        var rect = el.getBoundingClientRect();
        // Reveal when any part enters the viewport, or if it has already scrolled past.
        if (rect.top < threshold && rect.bottom > 0) {
          reveal(el);
          return false;
        }
        if (rect.bottom <= 0) {
          reveal(el);
          return false;
        }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    // Safety net: anything still hidden after load (e.g. deep-link jumps) is shown.
    window.setTimeout(check, 1200);
  })();

  /* ------------------------------------------------------------------ */
  /* Image fallback (only fires if a remote asset cannot load)           */
  /* ------------------------------------------------------------------ */
  var FALLBACK_IMG =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#155433"/><stop offset="0.5" stop-color="#0a2a1a"/><stop offset="1" stop-color="#06180f"/>' +
        '</linearGradient><pattern id="p" width="26" height="26" patternUnits="userSpaceOnUse">' +
        '<path d="M26 0H0v26" fill="none" stroke="#a3e635" stroke-opacity="0.12" stroke-width="1"/></pattern></defs>' +
        '<rect width="400" height="300" fill="url(#g)"/><rect width="400" height="300" fill="url(#p)"/>' +
        '<path d="M0 236 400 176v124H0z" fill="#0e3823"/>' +
        '<path d="M0 244 400 184" fill="none" stroke="#a3e635" stroke-opacity="0.7" stroke-width="4"/>' +
        '<path d="M0 254 400 194" fill="none" stroke="#84cc16" stroke-opacity="0.35" stroke-width="2"/>' +
        '<rect x="150" y="118" width="100" height="7" rx="3.5" fill="#DFF26D" fill-opacity="0.9"/>' +
        '<rect x="150" y="136" width="64" height="7" rx="3.5" fill="#DFF26D" fill-opacity="0.55"/>' +
      "</svg>"
    );
  document.addEventListener(
    "error",
    function (e) {
      var img = e.target;
      if (!img || img.tagName !== "IMG" || img.getAttribute("data-fallback") === "1") return;
      img.setAttribute("data-fallback", "1");
      img.src = FALLBACK_IMG;
    },
    true
  );

  /* ------------------------------------------------------------------ */
  /* Misc                                                                */
  /* ------------------------------------------------------------------ */
  var yearEl = $("#footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Init
  updatePromoLabel();
  updateCartBadges();
  renderConfig();
  renderCart();
})();
