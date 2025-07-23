// ===== GLOBAL VARIABLES =====
let currentLanguage = "en";
let currentTheme = "dark";
let isAnimating = false;
let gsapLoaded = false;

// Portfolio Slider Variables
let currentSlide = 0;
let totalSlides = 23;
let autoplayInterval = null;
let isSliderAnimating = false;

// ===== DOM ELEMENTS CACHE =====
const elements = {};

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  loadUserPreferences();
  initializeApp();
});

function initializeElements() {
  elements.scrollProgress = document.getElementById("scrollProgress");
  elements.body = document.body;
  elements.imageModal = document.getElementById("imageModal");
  elements.modalImage = document.getElementById("modalImage");
  elements.modalClose = document.getElementById("modalClose");
  elements.modalBackdrop = document.getElementById("modalBackdrop");

  // Simple switcher elements
  elements.langBtnEn = document.getElementById("langBtnEn");
  elements.themeBtnDark = document.getElementById("themeBtnDark");
  elements.themeBtnLight = document.getElementById("themeBtnLight");

  // Portfolio slider elements
  elements.portfolioSliderSection = document.getElementById("portfolioSliderSectionEn");
  elements.sliderTrack = document.getElementById("sliderTrackEn");
  elements.navPrev = document.getElementById("navPrevEn");
  elements.navNext = document.getElementById("navNextEn");
}

function initializeApp() {
  initLanguageSwitcher();
  initThemeToggle();
  initScrollProgress();
  initContactFeatures();

  checkGSAPAndInitialize();

  initLazyLoading();
  initSmoothScrolling();
  initKeyboardNavigation();
  initPortfolioSlider();
}

function checkGSAPAndInitialize() {
  if (typeof gsap !== "undefined") {
    gsapLoaded = true;
    gsap.registerPlugin(ScrollTrigger);
    setTimeout(() => {
      initGSAPAnimations();
      initParallaxEffects();
      initInteractiveCards();
      startMainAnimations();

      if (typeof updateSliderPosition === "function") {
        updateSliderPosition(false);
      }
    }, 500);
  } else {
    setTimeout(checkGSAPAndInitialize, 100);
  }
}

// ===== USER PREFERENCES =====
function loadUserPreferences() {
  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  const savedLang = localStorage.getItem("portfolio-language") || "en";

  setTheme(savedTheme, false);
  setLanguage(savedLang, false);
}

function saveUserPreferences() {
  localStorage.setItem("portfolio-theme", currentTheme);
  localStorage.setItem("portfolio-language", currentLanguage);
}

// ===== LANGUAGE SWITCHER =====
function initLanguageSwitcher() {
  if (!elements.langBtnEn) return;

  updateLanguageButtons();

  elements.langBtnEn.addEventListener("click", () => {
    if (currentLanguage !== "en") {
      setLanguage("en", true);
    }
  });
}

function updateLanguageButtons() {
  if (!elements.langBtnEn) return;

  elements.langBtnEn.classList.remove("active");
  elements.langBtnEn.classList.add("active");
}

function setLanguage(lang, animate = true) {
  if (isAnimating && animate) return;

  currentLanguage = lang;
  elements.body.setAttribute("data-lang", lang);
  updateLanguageButtons();
  updateContactLinks();

  // Force slider update with new language direction
  setTimeout(() => {
    if (typeof updateSliderPosition === "function") {
      updateSliderPosition(false);
    }
  }, 20);

  if (animate && gsapLoaded) {
    animateLanguageSwitch();
    animateButtonClick(elements.langBtnEn);
  }

  saveUserPreferences();
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
  if (!elements.themeBtnDark || !elements.themeBtnLight) return;

  updateThemeButtons();

  elements.themeBtnDark.addEventListener("click", () => {
    if (currentTheme !== "dark") {
      setTheme("dark", true);
    }
  });

  elements.themeBtnLight.addEventListener("click", () => {
    if (currentTheme !== "light") {
      setTheme("light", true);
    }
  });
}

function updateThemeButtons() {
  if (!elements.themeBtnDark || !elements.themeBtnLight) return;

  elements.themeBtnDark.classList.remove("active");
  elements.themeBtnLight.classList.remove("active");

  if (currentTheme === "dark") {
    elements.themeBtnDark.classList.add("active");
  } else {
    elements.themeBtnLight.classList.add("active");
  }
}

function setTheme(theme, animate = true) {
  currentTheme = theme;
  elements.body.setAttribute("data-theme", theme);
  updateThemeButtons();

  if (animate && gsapLoaded) {
    animateThemeSwitch();
    animateButtonClick(
      theme === "dark" ? elements.themeBtnDark : elements.themeBtnLight
    );
  }

  saveUserPreferences();
}

function startMainAnimations() {
  if (!gsapLoaded) return;

  const tl = gsap.timeline();
  const profileContainer = document.querySelector(".profile-container");
  const mainTitle = document.querySelector(".main-title");
  const heroDescription = document.querySelector(".hero-description");

  if (profileContainer) {
    tl.from(profileContainer, {
      duration: 1.2,
      scale: 0.8,
      opacity: 0,
      rotation: -10,
      ease: "back.out(1.7)",
    });
  }

  if (mainTitle) {
    tl.from(
      mainTitle,
      {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
      },
      "-=0.5"
    );
  }

  if (heroDescription) {
    tl.from(
      heroDescription,
      {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power2.out",
      },
      "-=0.3"
    );
  }

  const floatingContact = document.querySelector(".floating-contact");
  if (floatingContact) {
    gsap.fromTo(
      floatingContact,
      {
        x: -100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 1,
        ease: "back.out(1.7)",
      }
    );
  }
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
  if (!elements.scrollProgress) return;

  let ticking = false;

  function updateScrollProgress() {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    elements.scrollProgress.style.width = Math.min(scrolled, 100) + "%";
    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
}

// ===== PORTFOLIO SLIDER ===== 
function initPortfolioSlider() {
  fetch('https://lightgreen-bee-340667.hostingersite.com/wp-json/wp/v2/works?slug=gallery')
    .then(response => response.json())
    .then(data => {
      if (data[0]?.acf) {
        const heroData = data[0].acf;

        const titleElement = document.querySelector('#portfolioTitle');
        if (titleElement && heroData.main_title) {
          titleElement.textContent = heroData.main_title;
        } else {
          console.error("main_title is not available in the data.");
        }

        createSliderSlides(heroData);
      }
    })
    .catch(error => {
      console.error("Error fetching portfolio data: ", error);
    });

  initSliderNavigation();
  initSliderEvents();

  setTimeout(() => {
    updateSliderPosition(false);
  }, 50);

  setTimeout(() => {
    startAutoplay();
  }, 1000);

  const sliderContainers = document.querySelectorAll(".portfolio-slider-container");
  sliderContainers.forEach((container) => {
    container.addEventListener("mouseenter", () => {
      stopAutoplay();
    });
    container.addEventListener("mouseleave", () => {
      startAutoplay();
    });
  });
}

function createSliderSlides(heroData) {
  const imageFields = Object.keys(heroData).filter(key => key.startsWith('img'));

  totalSlides = imageFields.length;

  if (elements.sliderTrack) {
    elements.sliderTrack.innerHTML = "";
    imageFields.forEach((field, index) => {
      const imgID = heroData[field];
      if (imgID) {
        fetch(`https://lightgreen-bee-340667.hostingersite.com/wp-json/wp/v2/media/${imgID}`)
          .then(res => res.json())
          .then(media => {
            const slide = document.createElement("div");
            slide.className = "slider-slide";
            slide.dataset.index = index;

            const img = document.createElement("img");
            img.src = media.source_url;
            img.alt = `Project ${index + 1}`;
            img.loading = "lazy";

            slide.appendChild(img);
            slide.addEventListener("click", () => handleSlideClick(media.source_url));

            elements.sliderTrack.appendChild(slide);
          })
          .catch(error => {
            console.error("Error fetching image data:", error);
          });
      }
    });
  }
}

function initSliderNavigation() {
  if (elements.navPrev) {
    elements.navPrev.addEventListener("click", () => {
      stopAutoplay();
      goToPrevSlide();
      setTimeout(startAutoplay, 2000);
    });
  }

  if (elements.navNext) {
    elements.navNext.addEventListener("click", () => {
      stopAutoplay();
      goToNextSlide();
      setTimeout(startAutoplay, 2000);
    });
  }
}

function initSliderEvents() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      stopAutoplay();
      goToPrevSlide();
      setTimeout(startAutoplay, 1500);
    } else if (e.key === "ArrowRight") {
      stopAutoplay();
      goToNextSlide();
      setTimeout(startAutoplay, 1500);
    }
  });

  let startX = 0;
  let endX = 0;

  const sliders = document.querySelectorAll(".portfolio-slider");
  sliders.forEach((slider) => {
    slider.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        stopAutoplay();
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
        setTimeout(startAutoplay, 1500);
      },
      { passive: true }
    );
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToPrevSlide();
      } else {
        goToNextSlide();
      }
    }
  }
}

function goToSlide(index, animate = true) {
  if (isSliderAnimating || index === currentSlide) return;

  currentSlide = index;
  updateSliderPosition(animate);
}

function goToNextSlide() {
  const nextIndex = (currentSlide + 1) % totalSlides;
  goToSlide(nextIndex);
}

function goToPrevSlide() {
  const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  goToSlide(prevIndex);
}

function updateSliderPosition(animate = true) {
  const slides = document.querySelectorAll(".slider-slide");

  if (!slides.length) return;

  isSliderAnimating = true;

  slides.forEach((slide, index) => {
    const slideIndex = parseInt(slide.dataset.index);
    const position = getSlidePosition(slideIndex, currentSlide);

    slide.className = "slider-slide";
    slide.classList.add(position);

    applySlideTransform(slide, position);
  });

  if (gsapLoaded && animate) {
    const activeSlide = document.querySelector(".slider-slide.active");
    if (activeSlide) {
      gsap.fromTo(
        activeSlide,
        { opacity: 0.8 },
        { opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }

  setTimeout(() => {
    isSliderAnimating = false;
  }, 500);
}

function getSlidePosition(slideIndex, currentIndex) {
  if (slideIndex === currentIndex) {
    return "active";
  }

  const diff = slideIndex - currentIndex;
  const totalSlides = 23;

  if (diff === 1 || diff === -(totalSlides - 1)) return "next-1";
  if (diff === 2 || diff === -(totalSlides - 2)) return "next-2";
  if (diff === 3 || diff === -(totalSlides - 3)) return "next-3";
  if (diff === -1 || diff === totalSlides - 1) return "prev-1";
  if (diff === -2 || diff === totalSlides - 2) return "prev-2";
  if (diff === -3 || diff === totalSlides - 3) return "prev-3";

  return "hidden";
}

function applySlideTransform(slide, position) {
  try {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    let transform = "";
    let filter = "";
    let zIndex = "1";
    let opacity = "1";

    const mobileScale = isMobile ? 0.8 : 1;
    const distance1 = isSmallMobile ? 70 : isMobile ? 80 : 120;
    const distance2 = isSmallMobile ? 120 : isMobile ? 140 : 200;
    const distance3 = isSmallMobile ? 170 : isMobile ? 200 : 250;
    const depth1 = isSmallMobile ? -60 : isMobile ? -80 : -100;
    const depth2 = isSmallMobile ? -120 : isMobile ? -160 : -200;
    const depth3 = isSmallMobile ? -180 : isMobile ? -240 : -300;

    switch (position) {
      case "active":
        transform = "translate(-50%, -50%) translateX(0) translateZ(0) rotateY(0deg) scale(1)";
        filter = "blur(0) brightness(1)";
        zIndex = "10";
        break;

      case "prev-1":
        transform = `translate(-50%, -50%) translateX(${-distance1}px) translateZ(${depth1}px) rotateY(${25}deg) scale(${0.9 * mobileScale})`;
        filter = "blur(2px) brightness(0.7)";
        zIndex = "9";
        break;

      case "prev-2":
        transform = `translate(-50%, -50%) translateX(${-distance2}px) translateZ(${depth2}px) rotateY(${35}deg) scale(${0.8 * mobileScale})`;
        filter = "blur(4px) brightness(0.5)";
        zIndex = "8";
        break;

      case "prev-3":
        transform = `translate(-50%, -50%) translateX(${-distance3}px) translateZ(${depth3}px) rotateY(${45}deg) scale(${0.7 * mobileScale})`;
        filter = "blur(6px) brightness(0.3)";
        zIndex = "7";
        break;

      case "next-1":
        transform = `translate(-50%, -50%) translateX(${distance1}px) translateZ(${depth1}px) rotateY(${-25}deg) scale(${0.9 * mobileScale})`;
        filter = "blur(2px) brightness(0.7)";
        zIndex = "9";
        break;

      case "next-2":
        transform = `translate(-50%, -50%) translateX(${distance2}px) translateZ(${depth2}px) rotateY(${-35}deg) scale(${0.8 * mobileScale})`;
        filter = "blur(4px) brightness(0.5)";
        zIndex = "8";
        break;

      case "next-3":
        transform = `translate(-50%, -50%) translateX(${distance3}px) translateZ(${depth3}px) rotateY(${-45}deg) scale(${0.7 * mobileScale})`;
        filter = "blur(6px) brightness(0.3)";
        zIndex = "7";
        break;

      default:
        transform = "translate(-50%, -50%) translateX(0) translateZ(-500px) rotateY(90deg) scale(0.5)";
        filter = "blur(10px)";
        zIndex = "1";
        opacity = "0";
        break;
    }

    slide.style.transform = transform;
    slide.style.filter = filter;
    slide.style.zIndex = zIndex;
    slide.style.opacity = opacity;
  } catch (error) {
    console.error("Error applying slide transform:", error);
  }
}

function handleSlideClick(imageUrl) {
  openImageModal(imageUrl);
}

function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    if (!isSliderAnimating && !document.querySelector(".image-modal.show")) {
      goToNextSlide();
    }
  }, 3000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

// ===== MODAL FUNCTIONS =====
function openImageModal(imageSrc) {
  if (!elements.imageModal || !elements.modalImage) return;

  elements.modalImage.src = imageSrc;
  elements.imageModal.classList.add("show");
  document.body.style.overflow = "hidden";

  stopAutoplay();

  if (gsapLoaded) {
    gsap.fromTo(
      elements.imageModal,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    const modalContent = document.querySelector(".modal-content");
    if (modalContent) {
      gsap.fromTo(
        modalContent,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, delay: 0.1, ease: "back.out(1.7)" }
      );
    }
  }
}

function closeImageModal() {
  if (!elements.imageModal || !elements.modalImage) return;

  if (gsapLoaded) {
    gsap.to(elements.imageModal, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        elements.imageModal.classList.remove("show");
        elements.modalImage.src = "";
        document.body.style.overflow = "";
        startAutoplay();
      }
    });
  } else {
    elements.imageModal.style.opacity = "0";
    setTimeout(() => {
      elements.imageModal.classList.remove("show");
      elements.modalImage.src = "";
      document.body.style.overflow = "";
      startAutoplay();
    }, 300);
  }
}

// ===== MODAL EVENT LISTENERS =====
function initModalEvents() {
  if (elements.modalClose) {
    elements.modalClose.addEventListener("click", closeImageModal);
  }

  if (elements.modalBackdrop) {
    elements.modalBackdrop.addEventListener("click", closeImageModal);
  }

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      elements.imageModal &&
      elements.imageModal.classList.contains("show")
    ) {
      closeImageModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initModalEvents();
});

// ===== GSAP SCROLL ANIMATIONS =====
function initGSAPAnimations() {
  if (!gsapLoaded) return;

  // Section titles
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.fromTo(
      title,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Glass cards
  gsap.utils.toArray(".glass-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 60,
        opacity: 0,
        rotationY: 15,
      },
      {
        y: 0,
        opacity: 1,
        rotationY: 0,
        duration: 1,
        delay: index * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  initSimpleTechnologiesAnimations();
  initPortfolioSliderAnimations();

  // Services
  gsap.utils.toArray(".service-item").forEach((item, index) => {
    const direction = -50;
    gsap.fromTo(
      item,
      {
        x: direction,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // CTA section
  const ctaContent = document.querySelector(".cta-content");
  if (ctaContent) {
    gsap.fromTo(
      ctaContent,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }
}

function initPortfolioSliderAnimations() {
  if (!gsapLoaded) return;

  const sliderContainers = document.querySelectorAll(
    ".portfolio-slider-container"
  );
  sliderContainers.forEach((container) => {
    gsap.fromTo(
      container,
      {
        y: 100,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn, index) => {
    gsap.fromTo(
      btn,
      {
        x: index % 2 === 0 ? -50 : 50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: btn,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
}

function initSimpleTechnologiesAnimations() {
  if (!gsapLoaded) return;

  gsap.utils.toArray(".subsection-title").forEach((title) => {
    gsap.fromTo(
      title,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  gsap.utils.toArray(".skill-item").forEach((item, index) => {
    const direction = -50;
    gsap.fromTo(
      item,
      {
        x: direction,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  gsap.utils.toArray(".platform-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        rotationY: 90,
        opacity: 0,
      },
      {
        rotationY: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  gsap.utils
    .toArray(".skills-section, .platforms-section")
    .forEach((section) => {
      gsap.fromTo(
        section,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
}

// ===== CONTACT FEATURES =====
function initContactFeatures() {
  const floatingButtons = document.querySelectorAll(".contact-btn");

  floatingButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (gsapLoaded) {
        gsap.to(btn, {
          scale: 1.15,
          rotation: 10,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      }
    });

    btn.addEventListener("mouseleave", () => {
      if (gsapLoaded) {
        gsap.to(btn, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      }
    });

    btn.addEventListener("click", () => {
      if (gsapLoaded) {
        gsap.to(btn, {
          scale: 0.9,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
    });
  });

  updateContactLinks();
}

function updateContactLinks() {
  const whatsappBtn = document.getElementById("whatsappBtn");
  const linkedinBtn = document.getElementById("linkedinBtn");

  if (whatsappBtn) {
    whatsappBtn.href =
      "https://api.whatsapp.com/send?phone=201552492512&text=Hello Hossam, I would like to discuss a new project with you";
    whatsappBtn.title = "WhatsApp";
  }

  if (linkedinBtn) {
    linkedinBtn.title = "LinkedIn";
  }
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
  if (!gsapLoaded) return;

  const bgGrid = document.querySelector(".bg-grid");
  if (bgGrid) {
    gsap.to(bgGrid, {
      y: () => window.innerHeight * 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  const profileRing = document.querySelector(".profile-ring");
  if (profileRing) {
    gsap.to(profileRing, {
      rotation: 360,
      ease: "none",
      scrollTrigger: {
        trigger: profileRing,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }
}

// ===== INTERACTIVE CARDS =====
function initInteractiveCards() {
  if (!gsapLoaded) return;

  const cards = document.querySelectorAll(
    ".glass-card, .stat-card, .service-item"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.02,
        rotationY: 5,
        z: 100,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        rotationY: 0,
        z: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
  const images = document.querySelectorAll("img[loading='lazy']");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (gsapLoaded) {
          gsap.fromTo(
            img,
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
          );
        } else {
          img.style.opacity = "1";
        }

        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const targetPosition = target.offsetTop - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ===== KEYBOARD NAVIGATION =====
function initKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "l":
      case "L":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newLang = "en";
          setLanguage(newLang, true);
        }
        break;

      case "t":
      case "T":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newTheme = currentTheme === "dark" ? "light" : "dark";
          setTheme(newTheme, true);
        }
        break;
    }
  });
}

// ===== ANIMATION FUNCTIONS =====
function animateLanguageSwitch() {
  if (!gsapLoaded) return;

  isAnimating = true;
  const contentElements = document.querySelectorAll(".content");

  gsap
    .timeline()
    .to(contentElements, {
      duration: 0.3,
      opacity: 0,
      y: 20,
      stagger: 0.05,
      ease: "power2.out",
    })
    .to(
      contentElements,
      {
        duration: 0.3,
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: () => {
          isAnimating = false;
        },
      },
      "+=0.1"
    );
}

function animateThemeSwitch() {
  if (!gsapLoaded) return;

  gsap
    .timeline()
    .to(elements.body, {
      duration: 0.3,
      scale: 0.95,
      ease: "power2.out",
    })
    .to(elements.body, {
      duration: 0.3,
      scale: 1,
      ease: "power2.out",
    });
}

function animateButtonClick(button) {
  if (!gsapLoaded || !button) return;

  gsap
    .timeline()
    .to(button, {
      scale: 0.9,
      duration: 0.1,
      ease: "power2.out",
    })
    .to(button, {
      scale: 1.1,
      duration: 0.2,
      ease: "back.out(1.7)",
    })
    .to(button, {
      scale: 1,
      duration: 0.1,
      ease: "power2.out",
    });

  createRippleEffect(button);
}

function createRippleEffect(button) {
  if (!gsapLoaded) return;

  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--accent-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${centerX}px;
            top: ${centerY}px;
        `;

    document.body.appendChild(particle);

    const angle = (i / 8) * Math.PI * 2;
    const distance = 40 + Math.random() * 20;
    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;

    gsap.timeline().to(particle, {
      duration: 0.8,
      x: targetX - centerX,
      y: targetY - centerY,
      scale: 0,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      },
    });
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizePerformance() {
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Scroll-based optimizations
      }, 16);
    },
    { passive: true }
  );

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    gsapLoaded
  ) {
    gsap.globalTimeline.timeScale(0.5);
  }
}

// ===== CLEANUP =====
window.addEventListener("beforeunload", () => {
  stopAutoplay();
  if (gsapLoaded) {
    gsap.killTweensOf("*");
  }
});

// ===== VISIBILITY CHANGE HANDLER =====
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoplay();
  } else {
    if (!document.querySelector(".image-modal.show")) {
      setTimeout(startAutoplay, 500);
    }
  }
});

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener("resize", () => {
  if (typeof updateSliderPosition === "function") {
    setTimeout(() => {
      updateSliderPosition(false);
    }, 50);
  }
});

// ===== WINDOW FOCUS HANDLER =====
window.addEventListener("focus", () => {
  if (!document.querySelector(".image-modal.show")) {
    setTimeout(startAutoplay, 300);
  }
});

window.addEventListener("blur", () => {
  stopAutoplay();
});

// ===== INITIALIZE PERFORMANCE =====
optimizePerformance();

// ===== EXPORT API =====
window.PortfolioApp = {
  setLanguage,
  setTheme,
  openImageModal,
  closeImageModal,
  goToSlide,
  goToNextSlide,
  goToPrevSlide,
  currentLanguage: () => currentLanguage,
  currentTheme: () => currentTheme,
  currentSlide: () => currentSlide,
};
