/* ==========================================================================
   NexGen Portable Staging — shared data
   Plain browser JavaScript (no framework, no build step).
   All copy, prices, links and image URLs mirror the original React app.
   ========================================================================== */
(function () {
  "use strict";

  var CDN = "https://www.portablestage.co.uk/wp-content/uploads";

  /* ------------------------------------------------------------------
     Images — the product photography lives on the live NexGen site.
     (The old project downloaded these at build time; here they are
     referenced directly so the folder stays 100% static.)
     ------------------------------------------------------------------ */
  var IMAGES = {
    module1x1: CDN + "/2025/11/single_1x1m_400high_side.jpg",
    module1x520: CDN + "/2025/11/single_1x052m_400high_side.jpg",
    platinumDeck: CDN + "/2023/05/1slide-1.png",
    choirTiers: CDN + "/2023/05/how-to-assemble-staging-tiers-scaled-1.jpg",
    pkg3x2: CDN + "/2025/11/3mx2m_300high200mmstep_side.jpg",
    pkg4x3: CDN + "/2025/11/4mx3m_400high_side.jpg",
    pkg6x3: CDN + "/2025/11/6mx3m_400high200mmstep_side.jpg",
    stagingLondon: CDN + "/2025/12/Staging-in-London-NexGen-Staging.jpg",
    podiumConductor: CDN + "/2023/05/Conductor-Podium-NexGen-Staging.jpg",
    podiumWinners: CDN + "/2023/05/winners-podium-with-fascia.png",
    danceKit: CDN + "/2025/08/IMG_1997-rotated.jpg",
    valanceCloth: CDN + "/2023/06/cloth-valance-skirting-nexgen-staging.jpg",
    valanceClips: CDN + "/2026/02/skirting-clips-nexgen-staging-1-rotated.jpeg",
    fasciaHard: CDN + "/2025/11/single_Fascial_header-e1781633268675.jpg",
    handrail: CDN + "/2023/05/P-11-2.png",
    trolleyPanel: CDN + "/2023/05/Staging-Panel-Truck.png",
    trolleyCase: CDN + "/2025/05/IMG_1243-scaled.jpeg",
    rampAccess: CDN + "/2023/05/Nexgen-Staging-Ramp-access-fold.png",
    backdropKit: CDN + "/2024/05/portable-staging-backdrop-curtain-kit-3m-6m-12m.jpg",
    floorPads: CDN + "/2024/10/nexgen-rubber-staging-floor-pads.png",
    floorWedges: CDN + "/2023/05/P-3-1.png",
    ytMagnetic: "https://i.ytimg.com/vi/o94G3BRJB4Q/maxresdefault.jpg",
    ytPlatinum: "https://i.ytimg.com/vi/13Scgq9p2kA/maxresdefault.jpg",
    ytEvents: "https://i.ytimg.com/vi/QtWte86aOso/maxresdefault.jpg",
    steelcityRamp: "https://i.postimg.cc/c1RshnFt/stage-w-2Ramp-side-min.png",
    logoRollsRoyce: CDN + "/2023/05/Rolls-Royce-Logo.png",
    logoBbc: CDN + "/2023/05/bbc-philharmonic.png",
    logoBafta: CDN + "/2023/05/bafta-uses-nexgen-staging-e1633878207934.png",
    logoChivas: CDN + "/2023/05/chivas-bros-1.png",
    logoLloyds: CDN + "/2023/05/lloyds-1.png",
    logoItv: CDN + "/2023/05/ITV-News.jpg",
    logoMarlborough: CDN + "/2023/05/marlborough-college-1.png",
    usp60s: CDN + "/2023/09/OPT-Stage-Assembley.png",
    uspNoLocks: CDN + "/2025/08/cbe4fb15-c929-4e30-9e1a-1d4327c6d72a.jpeg",
    uspUkMade: CDN + "/2025/05/IMG_9885-scaled.jpeg",
    uspEco: CDN + "/2025/08/DanceFloor-Deck-Platforms-2.png",
    uspLifespan: CDN + "/2023/05/IMG_3480-scaled.jpeg"
  };

  var BUSINESS = {
    name: "NexGen Staging Limited",
    altName: "NexGen Portable Staging & Dancefloors",
    street: "SolPro Estate, Unit 12, Royds Mills, Windsor Street",
    city: "Sheffield",
    postcode: "S4 7WB",
    country: "United Kingdom",
    phone: "0114 399 2978",
    phoneHref: "+441143992978",
    email: "enquiries@portablestage.co.uk",
    tagline: "Portable Staging, handcrafted in Sheffield"
  };

  var NAV_LINKS = [
    { label: "Home", href: "#top" },
    { label: "Shop", href: "/shop/", hasMenu: true },
    { label: "Stage Quote Builder", href: "/quote-me/" },
    { label: "Funding", href: "#funding", action: "funding" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Links", href: "#links" }
  ];

  var FUNDING_TIERS = [
    { id: "education", label: "Education", pct: 20, blurb: "Schools, academies, colleges & nurseries", icon: "graduation-cap" },
    { id: "charity", label: "Charity", pct: 20, blurb: "Registered charities & community groups", icon: "heart-handshake" },
    { id: "arts", label: "Arts", pct: 20, blurb: "Theatres, choirs, dance & youth arts", icon: "palette" },
    { id: "leisure", label: "Leisure", pct: 20, blurb: "Venues, clubs, councils & event organisers", icon: "ticket" }
  ];

  var ECAL_FACTS = [
    "No complex application forms or lengthy waiting periods",
    "Guaranteed funding for all eligible organisations",
    "Applies to complete staging systems and accessories",
    "Compatible with other funding sources for maximum savings"
  ];

  var PRODUCTS = [
    { id: "steelcity-1x1", name: "NexGen SteelCity Staging Module 1×1m – Deck & Riser", category: "decks", price: 262.8, image: IMAGES.module1x1, blurb: "8.5kg · totally magnetic · no locks", href: "/product/staging-module-1x1m-deck-riser/" },
    { id: "steelcity-1x520", name: "NexGen SteelCity Staging Module 1×520mm – Deck & Riser", category: "decks", price: 250.8, image: IMAGES.module1x520, blurb: "5kg · value-driven materials", href: "/product/nexgen-steelcity-staging-module-1x520-deck-riser/" },
    { id: "platinum-1x1", name: "NexGen Platinum ECO 1×1m Stage Platform", category: "decks", price: 179, image: IMAGES.platinumDeck, blurb: "7.8kg · recycled core · £179–£189", href: "/product/nexgen-platinum-eco-hb-1x1m-stage-deck/" },
    { id: "platinum-dance", name: "NexGen Platinum ECO 1×1m Dance Floor Platform", category: "decks", price: 209, image: IMAGES.platinumDeck, blurb: "Dance floor deck · £209–£289", href: "/product/nexgen-eco-1x1m-dance-platform/" },
    { id: "plat-1x520", name: "NexGen Portable Stage Platform 1m × 520mm", category: "decks", price: 149, image: IMAGES.platinumDeck, blurb: "Carpet or ABS · £149–£169", href: "/product/nexgen-stage-portable-deck-platform1m-x-520mm/" },
    { id: "pkg-3x2", name: "NexGen Portable Staging Package 3×2m", category: "packages", price: 1579, image: IMAGES.pkg3x2, blurb: "6 SteelCity modules · was £1,999", href: "/product/nexgen-portable-staging-package-3x2m/" },
    { id: "pkg-4x2", name: "Portable Staging Package 4×2m", category: "packages", price: 2102.4, image: IMAGES.stagingLondon, blurb: "8 SteelCity modules · any height", href: "/product/nexgen-portable-staging-package-4x2m/" },
    { id: "pkg-4x3", name: "NexGen Portable Staging Package 4×3m", category: "packages", price: 3153.6, image: IMAGES.pkg4x3, blurb: "12 modules · Popular · any height", href: "/product/nexgen-portable-staging-package-4x3m/" },
    { id: "pkg-5x3", name: "NexGen Portable Staging Package 5×3m", category: "packages", price: 3942, image: IMAGES.pkg4x3, blurb: "15 modules · was £3,999", href: "/product/nexgen-portable-staging-package-5x3m/" },
    { id: "pkg-6x3", name: "NexGen Portable Staging Package 6×3m", category: "packages", price: 4730.4, image: IMAGES.pkg6x3, blurb: "18 modules · was £4,999", href: "/product/nexgen-portable-staging-package-6x3m/" },
    { id: "choir-3t", name: "3 Tier Choir Portable Staging Package", category: "packages", price: 3009, image: IMAGES.choirTiers, blurb: "4m tiers · up to 35 singers · was £4,299", href: "/product/3-tier-choir-portable-staging-package/" },
    { id: "podium-conductor", name: "Speaker Camera Conductors Mobile Podium", category: "packages", price: 289, image: IMAGES.podiumConductor, blurb: "Conductor podium · was £329", href: "/product/speaker-camera-conductors-mobile-podium/" },
    { id: "podium-winners", name: "Winners Podium – Medal Awards Ceremony 1000mm", category: "packages", price: 710, image: IMAGES.podiumWinners, blurb: "1×1m podiums · £710–£899", href: "/product/winners-podium-medal-awards-ceremony-1000mm/" },
    { id: "handrail", name: "NexGen Portable Staging Handrail", category: "accessories", price: 204, image: IMAGES.handrail, blurb: "L or S · 2 G clamps incl.", href: "/product/nexgen-portable-staging-handrail/" },
    { id: "handrail-sleeves", name: "NexGen Handrail Sleeves", category: "accessories", price: 23.5, image: IMAGES.handrail, blurb: "Fabric sleeves for safety rails", href: "/product/nexgen-handrail-sleeves/" },
    { id: "valance-cloth", name: "NexGen Platinum Cloth Valance 1000mm", category: "accessories", price: 26.4, image: IMAGES.valanceCloth, blurb: "£22 per metre, any depth", href: "/product/nexgen-platinum-cloth-valance-1000mm/" },
    { id: "fascia-hard", name: "NexGen Hard Fascia Valance 1000mm", category: "accessories", price: 24, image: IMAGES.fasciaHard, blurb: "£20 per metre, any depth", href: "/product/nexgen-platinum-hard-fascia-valance-1000/" },
    { id: "valance-clips", name: "NexGen Valance Clips (pack of 25)", category: "accessories", price: 12, image: IMAGES.valanceClips, blurb: "Velcro strips · was £25", href: "/product/nexgen-valance-clips/" },
    { id: "trolley-panel", name: "NexGen Panel Trolley 1200×760mm", category: "accessories", price: 295, image: IMAGES.trolleyPanel, blurb: "Stores deck platforms · was £603.07", href: "/product/nexgen-panel-trolley/" },
    { id: "trolley-case", name: "NexGen Panel Case Trolley", category: "accessories", price: 394, image: IMAGES.trolleyCase, blurb: "Hard case storage · was £485", href: "/product/nexgen-panel-trolley-case/" },
    { id: "ramp-5ft", name: "Folding Disabled Access Ramp 5ft", category: "ramps", price: 299, image: IMAGES.rampAccess, blurb: "Wheelchair access · was £749", href: "/product/folding-disabled-access-ramp/" },
    { id: "backdrop-3x3", name: "NexGen Stage Backdrop Kit 3×3m", category: "accessories", price: 439, image: IMAGES.backdropKit, blurb: "Fastfix pipe & drape · was £682.80", href: "/product/nexgen-stage-backdrop-kit-3x3m/" },
    { id: "floor-pads", name: "Staging Floor Pads – Adhesive Rubber", category: "accessories", price: 12, image: IMAGES.floorPads, blurb: "Protects floors · £12–£47", href: "/product/staging-floor-pads-adhesive-rubber/" },
    { id: "floor-wedges", name: "Uneven Floor Staging Wedges", category: "accessories", price: 6.5, image: IMAGES.floorWedges, blurb: "Stops wobbles · £6.50–£30", href: "/product/uneven-floor-staging-wedges/" },
    { id: "dance-kit", name: "NexGen Dance Floor Adaptation Kit", category: "accessories", price: 49, image: IMAGES.danceKit, blurb: "Connect decks · £49–£420", href: "/product/nexgen-dancefloor-kit/" }
  ];

  var CATEGORY_LABEL = {
    decks: "Deck Platforms",
    packages: "Stage Packages",
    accessories: "Accessories",
    ramps: "Access & Safety"
  };

  var POPULAR_SEARCHES = ["SteelCity module", "choir staging", "handrail", "valance", "access ramp"];

  var CATEGORIES = [
    {
      id: "decks",
      title: "Deck Platforms & Modules",
      desc: "Platinum ECO and SteelCity magnetic deck platforms in 1×1m and 1×520mm — deck & riser modules, any surface, any height.",
      image: IMAGES.module1x1,
      from: 149,
      count: 14,
      badge: "2 ranges",
      span: "lg:col-span-7",
      href: "/product-category/deck-platforms/",
      quickAdd: "steelcity-1x1"
    },
    {
      id: "packages",
      title: "Stage Packages & Choir Staging",
      desc: "Pre-designed 3×2m to 6×3m SteelCity packages, the 3-tier choir staging package for up to 35 singers, and award podiums.",
      image: IMAGES.pkg3x2,
      from: 1579,
      count: 9,
      badge: "Sale now on",
      span: "lg:col-span-5",
      href: "/product-category/deck-platforms/stage-packages/",
      quickAdd: "pkg-3x2"
    },
    {
      id: "accessories",
      title: "Fascia, Valance & Handrails",
      desc: "Cloth and hard fascia valance, safety handrails, valance clips, floor pads and storage trolleys to finish your stage.",
      image: IMAGES.valanceCloth,
      from: 6.5,
      count: 16,
      span: "lg:col-span-5",
      href: "/product-category/accessories/",
      quickAdd: "handrail"
    },
    {
      id: "ramps",
      title: "Access Ramps & Backdrops",
      desc: "Folding disabled access ramps for inclusive performances, plus Fastfix pipe & drape backdrop kits in black.",
      image: IMAGES.rampAccess,
      from: 299,
      count: 2,
      badge: "Accessible",
      span: "lg:col-span-7",
      href: "/product-category/accessories/",
      quickAdd: "ramp-5ft"
    }
  ];

  var HERO_FEATURES = [
    { id: "fast", icon: "zap", title: "Fast Assembly", short: "Stage in 60 seconds", detail: "Fast Assembly: your stage in 60 seconds — magnetic deck platforms and riser legs connect with no locks, no tools, no fuss." },
    { id: "eco", icon: "leaf", title: "Eco-Friendly", short: "Recycled materials", detail: "Eco-Friendly: recycled core material, sustainably sourced plywood, recycled carpet and less hazardous adhesives." },
    { id: "uk", icon: "badge-check", title: "UK-Made Quality", short: "Sheffield · 20+ years", detail: "UK-Made Quality: handcrafted in Sheffield by NexGen Staging Limited — over twenty years of stage manufacturing experience." },
    { id: "magnet", icon: "magnet", title: "Magnetic Design", short: "No locks. No keys.", detail: "Magnetic Design: totally magnetic — no locks, no keys, nothing to replace. Ever." }
  ];

  var HERO_SLIDES = [
    {
      id: "steelcity",
      label: "SteelCity Modules",
      title: "SteelCity Module 1×1m — Deck & Riser",
      price: "£219 + VAT · 8.5kg · magnetic deck & riser",
      image: IMAGES.module1x1,
      alt: "NexGen SteelCity 1x1m magnetic staging module — deck platform and riser leg"
    },
    {
      id: "platinum",
      label: "SteelCity 1×1m Stage Platform",
      title: "SteelCity 1×1m Stage Platform",
      price: "£219 + VAT · 8.5kg · magnetic deck & riser",
      image: IMAGES.steelcityRamp,
      alt: "NexGen SteelCity 1x1m stage platform with access ramps, magnetic deck and riser"
    },
    {
      id: "choir",
      label: "Choir Staging",
      title: "3 Tier Choir Staging Package",
      price: "£3,009 inc VAT · up to 35 singers",
      image: IMAGES.choirTiers,
      alt: "NexGen 3 tier choir portable staging package in grey carpet"
    }
  ];

  var USPS = [
    { emoji: "⚡", title: "Stage in 60 Seconds", text: "Fast magnetic assembly — no tools", icon: "zap", image: IMAGES.usp60s, imageAlt: "NexGen stage frame being assembled quickly by hand", caption: "Rapid assembly" },
    { emoji: "🧲", title: "No Locks, No Keys", text: "Totally magnetic — nothing to replace", icon: "magnet", image: IMAGES.uspNoLocks, imageAlt: "Close-up of a NexGen deck edge and tool-free floor connection", caption: "Magnetic connection" },
    { emoji: "🇬🇧", title: "UK Manufactured", text: "Handcrafted in Sheffield", icon: "badge-check", image: IMAGES.uspUkMade, imageAlt: "NexGen staging components and flight case in the Sheffield production environment", caption: "Made in Sheffield" },
    { emoji: "🌿", title: "Eco-Friendly", text: "Recycled core, sustainable plywood & carpet", icon: "leaf", image: IMAGES.uspEco, imageAlt: "NexGen modular deck platforms showing the sustainable deck material finish", caption: "Lower-impact materials" },
    { emoji: "🛡️", title: "Up to 15-Year Lifespan", text: "Lighter, faster, safer & longer lasting", icon: "shield-check", image: IMAGES.uspLifespan, imageAlt: "Heavy-duty NexGen stage installed at a live event venue", caption: "Built for repeat use" }
  ];

  var VIDEO_TABS = [
    {
      id: "magnetic",
      label: "Magnetic Staging",
      short: "Magnetic Staging",
      title: "NexGen magnetic staging",
      description: "See the totally magnetic NexGen system in action — no locks, no keys, no tools. Magnetic deck platforms and spider riser legs connect in seconds.",
      yt: "o94G3BRJB4Q",
      start: 21,
      image: IMAGES.ytMagnetic,
      facts: ["Totally magnetic — no locks to replace, ever", "Your stage in 60 seconds", "Deck platforms & spider riser legs"]
    },
    {
      id: "platinum",
      label: "Platinum & Backdrop",
      short: "Platinum Range",
      title: "NexGen Platinum Portable Staging & Backdrop — Fast Assembly",
      description: "The NexGen Platinum range with Fastfix pipe & drape backdrop — from flat-packed modules to a finished stage, fast.",
      yt: "13Scgq9p2kA",
      start: 6,
      image: IMAGES.ytPlatinum,
      facts: ["Platinum ECO range", "Fastfix backdrop kit", "Carpet or ABS tough black finish"]
    },
    {
      id: "events",
      label: "Events & Installations",
      short: "In The Field",
      title: "NexGen Staging — live events",
      description: "NexGen staging in the field — real events powered by Sheffield-made magnetic portable staging, from schools and choirs to major venues.",
      yt: "QtWte86aOso",
      start: 5,
      image: IMAGES.ytEvents,
      facts: ["UK events & venues", "Schools, choirs & community groups", "NexGen Staging @ Rolls Royce LDC Derby"]
    }
  ];

  var REVIEWS = [
    { id: "r1", name: "Teacher", role: "School", rating: 5, title: "One stage, two shows", text: "Afternoon theatre, evening disco — all using the same stage panels. Brilliant solution.", product: "NexGen stage panels" },
    { id: "r2", name: "Mrs. Jones", role: "Drama Teacher", rating: 5, title: "The students love it", text: "Our school bought a set of stage equipment from you last year and we couldn't be happier with the results. The students love using it for their drama classes and performances. They have become more confident, expressive, and collaborative. The parents and teachers are also impressed by the quality and durability of the equipment.", product: "School stage package" },
    { id: "r3", name: "Mr. Smithe", role: "Parent", rating: 5, title: "A huge hit at the party", text: "We ordered a NexGen staging package from you for our daughter's birthday party, and it was a huge hit. The kids had a blast playing with the props, costumes, lights, and sound effects. They put on a fantastic show for us and their friends. It was a memorable & educational experience for everyone.", product: "NexGen staging package" },
    { id: "r4", name: "Paula Frank", role: "Facilities Team", rating: 5, title: "Set out in under 10 minutes", text: "Thank you for your speedy supply. We are so grateful you managed to help us out with a very urgent delivery. The staging is brilliant. It's so light & easy to assemble. We set it out in under 10 minutes. WOW! The event went perfectly, and the office staff were very impressed. I would highly recommend NexGen equipment to anyone.", product: "Urgent school delivery" },
    { id: "r5", name: "UK School", role: "Case study", rating: 5, title: "Assembly cut from 30 to 10 minutes", text: "Last year we switched to NexGen folding platform riser legs for the winners' podium and for staff presentations. Using the magnetic lock-free system cut assembly time from 30 to 10 minutes. The risers folded flat and stored away in minutes.", product: "Winners' podium & risers" }
  ];

  var CLIENTS = [
    { name: "Rolls Royce", type: "Aerospace", logo: IMAGES.logoRollsRoyce },
    { name: "BBC Philharmonic", type: "Arts", logo: IMAGES.logoBbc },
    { name: "BAFTA", type: "Arts", logo: IMAGES.logoBafta },
    { name: "Chivas Bros", type: "Events", logo: IMAGES.logoChivas },
    { name: "Lloyds", type: "Corporate", logo: IMAGES.logoLloyds },
    { name: "ITV News", type: "Broadcast", logo: IMAGES.logoItv },
    { name: "Marlborough College", type: "Education", logo: IMAGES.logoMarlborough }
  ];

  var FAQS = [
    {
      q: "What is ECAL funding and who qualifies?",
      a: "The Education, Charity, Arts & Leisure (ECAL) Funding programme offers eligible organisations discounts of up to 20% on staging equipment purchases. It is spearheaded by NexGen Staging Limited and applies to complete staging systems and accessories, with no complex application forms or lengthy waiting periods. To get started, use the online quotation tool at portablestage.co.uk/quote-me and select “ECAL Funding”, or call 0114 399 2978."
    },
    {
      q: "What stage heights are available?",
      a: "NexGen riser legs are available in fixed heights of 200mm, 300mm, 400mm, 600mm, 800mm and 1000mm. Every SteelCity module is a deck & riser combination, so you can choose any surface and any height combo — package pricing stays the same across heights."
    },
    {
      q: "How much does a NexGen platform weigh, and how much can it hold?",
      a: "Platforms are light but strong: around 7.2–7.8kg for a Platinum 1×1m platform and 8.5kg for a SteelCity 1×1m module. Load weight is up to 1,500kg per platform, and a NexGen deck with NexGen riser legs can take up to 2+ tons depending on the height — always check the individual height specification."
    },
    {
      q: "Are NexGen stages really lock-free?",
      a: "Yes — NexGen staging is totally magnetic, with no locks and no keys. Other branded platforms such as Revostage, Intellistage, Alustage and Go-Pak can have up to 8 locks that need replacing over time. With NexGen there is nothing to replace, which is why Platinum platforms last up to 15 years and stay 100% functional throughout their lifespan."
    },
    {
      q: "What deck surfaces and finishes can I choose?",
      a: "NexGen platforms are available in carpet — including grey and anthracite rib carpet — or a tough black ABS (HardBlack) non-slip finish. Choir packages are supplied in grey carpet, and fascia is available in cloth valance or hard fascia to any depth."
    },
    {
      q: "Do you deliver across the UK?",
      a: "We manufacture our products in the UK at our Sheffield facility and deliver them directly to you — from schools and churches to theatres and event venues nationwide. Call 0114 399 2978 or email enquiries@portablestage.co.uk and we will arrange delivery for your stage."
    },
    {
      q: "How do I get a quote or place an order?",
      a: "Use the Stage Quote Builder at portablestage.co.uk/quote-me to configure your perfect-sized portable stage or dancefloor and select ECAL Funding if you are an eligible organisation. You can also call our Sheffield team on 0114 399 2978 or email enquiries@portablestage.co.uk — we are here to help with your staging requirements."
    }
  ];

  var FOOTER_LINKS = {
    Shop: [
      { label: "Deck Platforms", href: "/product-category/deck-platforms/" },
      { label: "Stage Packages", href: "/product-category/deck-platforms/stage-packages/" },
      { label: "Riser Legs", href: "/product-category/riser-legs/" },
      { label: "Accessories", href: "/product-category/accessories/" },
      { label: "Spare Parts", href: "/product-category/spare-parts/" }
    ],
    Company: [
      { label: "Stage Quote Builder", href: "/quote-me/" },
      { label: "ECAL Funding", href: "#funding", action: "funding" },
      { label: "About Us", href: "/about/" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact/" }
    ],
    Support: [
      { label: "Get Started Guide", href: "/get-started-building-your-stage/" },
      { label: "Assembly User Guide", href: "/product/nexgen-staging-magnetic-assembly-user-guide/" },
      { label: "Video Guides", href: "#video-showcase" },
      { label: "FAQs", href: "#faq" },
      { label: "Customer Testimonials", href: "#case-studies" }
    ]
  };

  var ECAL_REFERENCE = "ECAL";

  window.NX_DATA = {
    IMAGES: IMAGES,
    BUSINESS: BUSINESS,
    NAV_LINKS: NAV_LINKS,
    FUNDING_TIERS: FUNDING_TIERS,
    ECAL_FACTS: ECAL_FACTS,
    ECAL_REFERENCE: ECAL_REFERENCE,
    PRODUCTS: PRODUCTS,
    CATEGORY_LABEL: CATEGORY_LABEL,
    POPULAR_SEARCHES: POPULAR_SEARCHES,
    CATEGORIES: CATEGORIES,
    HERO_FEATURES: HERO_FEATURES,
    HERO_SLIDES: HERO_SLIDES,
    USPS: USPS,
    VIDEO_TABS: VIDEO_TABS,
    REVIEWS: REVIEWS,
    CLIENTS: CLIENTS,
    FAQS: FAQS,
    FOOTER_LINKS: FOOTER_LINKS
  };
})();
