document.addEventListener("DOMContentLoaded", function() {
  // Language switching functionality (keep your existing code)
  const languageToggleLinks = document.querySelectorAll("[data-lang-toggle]");
  const currentLangDisplay = document.querySelector("#currentLang");
  let currentLang = localStorage.getItem("mifugopay_lang") || "en";
  
  function updateLanguage(lang) {
    // Keep your existing language switching code
    document.querySelectorAll("[data-en], [data-sw]").forEach(el => {
      if (el.hasAttribute(`data-${lang}`)) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          const placeholder = el.getAttribute(`data-${lang}-placeholder`) || el.getAttribute(`data-${lang}`);
          if (placeholder) el.placeholder = placeholder;
        } else if (el.tagName === 'OPTION' && el.selected) {
          const select = el.closest('select');
          if (select) {
            select.querySelector('option[selected]')?.removeAttribute('selected');
            el.setAttribute('selected', 'selected');
          }
        } else {
          el.textContent = el.getAttribute(`data-${lang}`);
        }
      }
    });
    currentLangDisplay.textContent = lang === "en" ? "English" : "Swahili";
    document.title = document.querySelector("title").getAttribute(`data-${lang}`) || document.title;
    localStorage.setItem("mifugopay_lang", lang);
    currentLang = lang;
  }
  
  updateLanguage(currentLang);
  
  languageToggleLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const lang = this.getAttribute("data-lang-toggle");
      if (lang !== currentLang) {
        updateLanguage(lang);
      }
    });
  });

  // Enhanced Subsidy Form with M-Pesa integration
  const subsidyForm = document.getElementById("subsidyForm");
  if (subsidyForm) {
    subsidyForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const subsidyType = document.getElementById("subsidyType").value;
      const farmSize = document.getElementById("farmSize").value;
      
      // Show processing message
      const processingMsg = currentLang === "en" 
        ? "Processing your subsidy application..." 
        : "Inashughulikia ombi lako la ruzuku...";
      alert(processingMsg);
      
      // Simulate M-Pesa STK Push
      try {
        // In a real implementation, this would call your backend which interfaces with Safaricom's API
        const response = await simulateMpesaPayment(subsidyType, farmSize);
        
        // Generate blockchain transaction ID
        const txId = generateBlockchainId();
        document.getElementById("blockchainId").value = txId;
        
        // Update subsidy history
        addToSubsidyHistory({
          date: new Date().toLocaleDateString(),
          type: subsidyType,
          amount: calculateSubsidyAmount(subsidyType, farmSize),
          status: "Completed"
        });
        
        // Send SMS notification
        await sendSubsidyNotification(
          "254700000000", // Would use actual user's number in production
          calculateSubsidyAmount(subsidyType, farmSize),
          subsidyType
        );
        
        const successMsg = currentLang === "en"
          ? `Your ${subsidyType} subsidy of KES ${calculateSubsidyAmount(subsidyType, farmSize)} has been approved and sent to your M-Pesa!`
          : `Ruzuku yako ya ${subsidyType} ya KES ${calculateSubsidyAmount(subsidyType, farmSize)} imekubaliwa na kutuma kwa M-Pesa yako!`;
        alert(successMsg);
        
        this.reset();
      } catch (error) {
        console.error("Subsidy processing failed:", error);
        const errorMsg = currentLang === "en"
          ? "Failed to process subsidy. Please try again later."
          : "Imeshindwa kushughulikia ruzuku. Tafadhali jaribu tena baadaye.";
        alert(errorMsg);
      }
    });
  }

  // Farmer Verification Form
  const verificationForm = document.getElementById("verificationForm");
  if (verificationForm) {
    verificationForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const nationalId = document.getElementById("nationalId").value;
      const mpesaNumber = document.getElementById("mpesaNumber").value;
      
      try {
        const verified = await verifyFarmer(nationalId, mpesaNumber);
        if (verified) {
          const message = currentLang === "en"
            ? "Farmer verification successful! You can now receive subsidies directly to your M-Pesa."
            : "Uthibitishaji wa mkulima umefanikiwa! Sasa unaweza kupokea ruzuku moja kwa moja kwa M-Pesa yako.";
          alert(message);
        } else {
          throw new Error("Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        const message = currentLang === "en"
          ? "Verification failed. Please check your details and try again."
          : "Uthibitishaji umeshindwa. Tafadhali angalia maelezo yako na ujaribu tena.";
        alert(message);
      }
    });
  }

  // Location-based tips
  const locationBtn = document.getElementById("getLocationBtn");
  if (locationBtn) {
    locationBtn.addEventListener("click", function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const tips = await getLocationBasedTips(position.coords.latitude, position.coords.longitude);
            const message = currentLang === "en"
              ? `Based on your location, we recommend: ${tips}`
              : `Kulingana na eneo lako, tunapendekeza: ${tips}`;
            alert(message);
          },
          (error) => {
            console.error("Geolocation error:", error);
            const message = currentLang === "en"
              ? "Could not get your location. Please enable location services."
              : "Haiwezi kupata eneo lako. Tafadhali wezesha huduma za eneo.";
            alert(message);
          }
        );
      } else {
        const message = currentLang === "en"
          ? "Geolocation is not supported by your browser."
          : "Kivinjari chako hakitumii huduma za eneo.";
        alert(message);
      }
    });
  }

  // Copy blockchain ID
  const copyBtn = document.getElementById("copyBlockchainId");
  if (copyBtn) {
    copyBtn.addEventListener("click", function() {
      const blockchainId = document.getElementById("blockchainId");
      blockchainId.select();
      document.execCommand("copy");
      
      const message = currentLang === "en"
        ? "Transaction ID copied to clipboard!"
        : "Kitambulisho cha mwenendo kimenakiliwa kwenye ubao wa kunakili!";
      alert(message);
    });
  }

  // Smooth scrolling for anchor links (keep your existing code)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
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

  // Animation (keep your existing code)
  const animateOnScroll = function() {
    const elements = document.querySelectorAll(".card, .section-title, .table");
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementPosition < windowHeight - 100) {
        element.classList.add("fade-in");
      }
    });
  };
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll();

  // Helper functions for the new features
  async function simulateMpesaPayment(subsidyType, farmSize) {
    // In a real implementation, this would call your backend which uses Safaricom's Daraja API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          amount: calculateSubsidyAmount(subsidyType, farmSize),
          mpesaCode: "ML123456789"
        });
      }, 2000);
    });
  }

  function calculateSubsidyAmount(type, size) {
    // Simple calculation - in real app this would be more sophisticated
    const baseAmounts = {
      fertilizer: 1500,
      seed: 2000,
      equipment: 5000,
      vaccination: 800,
      breeding: 3000,
      feed: 1200
    };
    return baseAmounts[type] * (size || 1);
  }

  function generateBlockchainId() {
    // Simulate blockchain transaction ID
    return "0x" + Math.random().toString(16).substr(2, 64);
  }

  function addToSubsidyHistory(record) {
    const historyTable = document.getElementById("subsidyHistory");
    const row = document.createElement("tr");
    
    row.innerHTML = `
      <td>${record.date}</td>
      <td data-en="${record.type}" data-sw="${record.type}">${record.type}</td>
      <td>KES ${record.amount}</td>
      <td data-en="${record.status}" data-sw="${record.status === 'Completed' ? 'Imekamilika' : 'Inashughulikiwa'}">${record.status}</td>
    `;
    
    historyTable.prepend(row);
    updateLanguage(currentLang); // Ensure new content is properly translated
  }

  async function verifyFarmer(nationalId, phoneNumber) {
    // Simulate verification - in real app this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Always return true for demo
      }, 1500);
    });
  }

  async function getLocationBasedTips(lat, lng) {
    // Simulate location-based tips - in real app this would call your backend
    const tips = {
      en: [
        "Plant drought-resistant crops during dry seasons",
        "Rotate between maize and beans to improve soil fertility",
        "Consider drip irrigation to conserve water"
      ],
      sw: [
        "Panda mimea yenye kustahimili ukame wakati wa msimu wa ukame",
        "Zungusha kati ya mahindi na maharage kuboresha rutuba ya udongo",
        "Fikiria umwagiliaji wa tone kwa kuhifadhi maji"
      ]
    };
    
    // Simple logic to vary tips based on rough location
    const tipIndex = Math.floor((lat + lng) % 3);
    return tips[currentLang][tipIndex];
  }

  async function sendSubsidyNotification(phone, amount, type) {
    const message = currentLang === "en"
      ? `Dear farmer, your ${type} subsidy of KES ${amount} has been sent to your M-Pesa. Transaction ID: ${generateBlockchainId()}`
      : `Mkulima mpendwa, ruzuku yako ya ${type} ya KES ${amount} imetumwa kwa M-Pesa yako. Kitambulisho cha mwenendo: ${generateBlockchainId()}`;
    
    // In a real implementation, this would call your SMS gateway
    console.log(`SMS sent to ${phone}: ${message}`);
    return Promise.resolve();
  }
});
