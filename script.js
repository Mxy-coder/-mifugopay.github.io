document.addEventListener("DOMContentLoaded", function () {
  // Language switching functionality
  const languageToggleLinks = document.querySelectorAll("[data-lang-toggle]");
  const currentLangDisplay = document.querySelector("#currentLang");
  let currentLang = localStorage.getItem("mifugopay_lang") || "en";

  // Function to update all translatable elements
  function updateLanguage(lang) {
    // Update elements with data-en/data-sw attributes
    document.querySelectorAll("[data-en], [data-sw]").forEach((el) => {
      if (el.hasAttribute(`data-${lang}`)) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          const placeholder =
            el.getAttribute(`data-${lang}-placeholder`) ||
            el.getAttribute(`data-${lang}`);
          if (placeholder) el.placeholder = placeholder;
        } else if (el.tagName === "OPTION" && el.selected) {
          // Handle select options
          const select = el.closest("select");
          if (select) {
            select
              .querySelector("option[selected]")
              ?.removeAttribute("selected");
            el.setAttribute("selected", "selected");
          }
        } else {
          el.textContent = el.getAttribute(`data-${lang}`);
        }
      }
    });

    // Update dropdown display
    currentLangDisplay.textContent = lang === "en" ? "English" : "Swahili";

    // Update page title
    document.title =
      document.querySelector("title").getAttribute(`data-${lang}`) ||
      document.title;

    // Store language preference
    localStorage.setItem("mifugopay_lang", lang);
    currentLang = lang;
  }

  // Initialize language
  updateLanguage(currentLang);

  // Language toggle event listeners
  languageToggleLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const lang = this.getAttribute("data-lang-toggle");
      if (lang !== currentLang) {
        updateLanguage(lang);
      }
    });
  });

  // Form submission handling
  const subsidyForm = document.getElementById("subsidyForm");
  if (subsidyForm) {
    subsidyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const message =
        currentLang === "en"
          ? "Your subsidy application has been submitted successfully! We will contact you soon."
          : "Ombi lako la ruzuku limewasilishwa kikamilifu! Tutawasiliana nawe hivi karibuni.";
      alert(message);
      this.reset();
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth"
        });
      }
    });
  });

  // Add animation class when elements come into view
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(".card, .section-title, .table");
    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementPosition < windowHeight - 100) {
        element.classList.add("fade-in");
      }
    });
  };
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Run once on page load
});
