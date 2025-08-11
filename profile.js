// Profile Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Navigation functionality
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".profile-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      navLinks.forEach((l) => l.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      this.classList.add("active");

      const targetSection = document.getElementById(this.dataset.section);
      if (targetSection) {
        targetSection.classList.add("active");
      }
    });
  });

  // Profile editing functionality
  const editBtn = document.getElementById("edit-profile-btn");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const profileForm = document.getElementById("profile-form");
  const formInputs = profileForm.querySelectorAll("input, textarea, select");
  const formActions = document.querySelector(".form-actions");

  let originalValues = {};

  // Store original values
  function storeOriginalValues() {
    formInputs.forEach((input) => {
      originalValues[input.name] = input.value;
    });
  }

  // Enable editing mode
  function enableEditMode() {
    storeOriginalValues();

    formInputs.forEach((input) => {
      input.removeAttribute("readonly");
      input.removeAttribute("disabled");
      input.style.background = "white";
    });

    editBtn.style.display = "none";
    formActions.style.display = "flex";
  }

  // Disable editing mode
  function disableEditMode() {
    formInputs.forEach((input) => {
      input.setAttribute("readonly", true);
      if (input.tagName === "SELECT") {
        input.setAttribute("disabled", true);
      }
      input.style.background = "#f8f9fa";
    });

    editBtn.style.display = "inline-flex";
    formActions.style.display = "none";
  }

  // Restore original values
  function restoreOriginalValues() {
    formInputs.forEach((input) => {
      if (originalValues[input.name] !== undefined) {
        input.value = originalValues[input.name];
      }
    });
  }

  editBtn.addEventListener("click", enableEditMode);

  cancelBtn.addEventListener("click", function () {
    restoreOriginalValues();
    disableEditMode();
  });

  // Form submission
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Update profile summary
      const firstNameValue = document.getElementById("firstName").value;
      const lastNameValue = document.getElementById("lastName").value;
      const emailValue = document.getElementById("email").value;

      document.getElementById(
        "user-name"
      ).textContent = `${firstNameValue} ${lastNameValue}`;
      document.getElementById("user-email").textContent = emailValue;

      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Disable edit mode
      disableEditMode();

      // Show success message
      showNotification("Profile updated successfully!", "success");
    }, 1500);
  });

  // Profile picture upload functionality
  const profileImg = document.getElementById("profile-img");
  const profileUpload = document.getElementById("profile-upload");
  const imageContainer = document.querySelector(".profile-image-container");

  imageContainer.addEventListener("click", function () {
    profileUpload.click();
  });

  profileUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImg.src = e.target.result;
        showNotification("Profile picture updated!", "success");
      };
      reader.readAsDataURL(file);
    }
  });

  // Wishlist functionality
  const removeWishlistBtns = document.querySelectorAll(".remove-wishlist-btn");
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

  removeWishlistBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const wishlistItem = this.closest(".wishlist-item");

      wishlistItem.style.transform = "scale(0.8)";
      wishlistItem.style.opacity = "0";

      setTimeout(() => {
        wishlistItem.remove();
        updateWishlistCount();
        showNotification("Item removed from wishlist", "info");
      }, 300);
    });
  });

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
        this.style.background = "#00b894";

        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.background = "";
        }, 2000);

        showNotification("Item added to cart!", "success");
      }, 1000);
    });
  });

  // Order search functionality

  const orderSearch = document.getElementById("order-search");
  if (orderSearch) {
    orderSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const orderCards = document.querySelectorAll(".order-card");

      orderCards.forEach((card) => {
        const searchData = card.dataset.order.toLowerCase();
        if (searchData.includes(searchTerm)) {
          card.style.display = "block";
          card.style.animation = "fadeIn 0.3s ease";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Order action buttons
  const trackOrderBtns = document.querySelectorAll(
    ".order-actions .btn-secondary"
  );
  const reorderBtns = document.querySelectorAll(".order-actions .btn-primary");

  trackOrderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderCard = this.closest(".order-card");
      const orderNumber = orderCard.querySelector(".order-info h4").textContent;
      showNotification(`Tracking ${orderNumber}...`, "info");

      setTimeout(() => {
        showNotification("Tracking information opened in new tab", "success");
      }, 1000);
    });
  });

  reorderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const originalText = this.innerHTML;
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Adding to Cart...';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
        this.style.background = "#00b894";

        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.background = "";
        }, 2000);

        showNotification("Items added to cart for reorder!", "success");
      }, 1500);
    });
  });

  // Settings functionality
  const settingCheckboxes = document.querySelectorAll(
    '.setting-label input[type="checkbox"]'
  );

  settingCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const setting = this.closest(".setting-item")
        .querySelector(".setting-label")
        .textContent.trim();
      const status = this.checked ? "enabled" : "disabled";
      showNotification(`${setting} ${status}`, "info");
    });
  });

  // Utility functions
  function updateWishlistCount() {
    const wishlistItems = document.querySelectorAll(".wishlist-item");
    const wishlistBadge = document.querySelector(
      "#wishlist-section .stat-badge"
    );
    if (wishlistBadge) {
      wishlistBadge.textContent = `${wishlistItems.length} Items`;
    }
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: getNotificationColor(type),
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      zIndex: "10000",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.9rem",
      fontWeight: "500",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  function getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }

  function getNotificationColor(type) {
    const colors = {
      success: "#00b894",
      error: "#e17055",
      warning: "#fdcb6e",
      info: "#6c5ce7",
    };
    return colors[type] || "#6c5ce7";
  }

  // Initialize
  storeOriginalValues();

  // Load saved data from localStorage
  loadProfileData();

  // Save profile data to localStorage
  function saveProfileData() {
    const profileData = {};
    formInputs.forEach((input) => {
      profileData[input.name] = input.value;
    });
    localStorage.setItem("occasio_profile", JSON.stringify(profileData));
  }

  // Load profile data from localStorage
  function loadProfileData() {
    const savedData = localStorage.getItem("occasio_profile");
    if (savedData) {
      try {
        const profileData = JSON.parse(savedData);
        formInputs.forEach((input) => {
          if (profileData[input.name]) {
            input.value = profileData[input.name];
          }
        });

        // Update display elements
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;

        if (firstName && lastName) {
          document.getElementById(
            "user-name"
          ).textContent = `${firstName} ${lastName}`;
        }
        if (email) {
          document.getElementById("user-email").textContent = email;
        }
      } catch (e) {
        console.log("Error loading profile data:", e);
      }
    }
  }

  // Enhanced form submission with data persistence
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    const requiredFields = ["firstName", "lastName", "email"];
    let isValid = true;

    requiredFields.forEach((field) => {
      const input = document.getElementById(field);
      if (!input.value.trim()) {
        input.style.borderColor = "#e17055";
        isValid = false;
      } else {
        input.style.borderColor = "";
      }
    });

    if (!isValid) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    // Email validation
    const email = document.getElementById("email").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById("email").style.borderColor = "#e17055";
      showNotification("Please enter a valid email address", "error");
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Save data
      saveProfileData();

      // Update profile summary
      const firstNameValue = document.getElementById("firstName").value;
      const lastNameValue = document.getElementById("lastName").value;
      const emailValue = document.getElementById("email").value;

      document.getElementById(
        "user-name"
      ).textContent = `${firstNameValue} ${lastNameValue}`;
      document.getElementById("user-email").textContent = emailValue;

      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Disable edit mode
      disableEditMode();

      // Show success message
      showNotification("Profile updated successfully!", "success");
    }, 1500);
  });

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add loading states to buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    if (!button.classList.contains("no-loading")) {
      button.addEventListener("click", function () {
        if (this.type !== "submit" && !this.classList.contains("nav-link")) {
          this.style.transform = "scale(0.95)";
          setTimeout(() => {
            this.style.transform = "";
          }, 150);
        }
      });
    }
  });

  // Keyboard navigation for profile sections
  document.addEventListener("keydown", function (e) {
    if (e.altKey) {
      const currentActive = document.querySelector(".nav-link.active");
      const allNavLinks = Array.from(document.querySelectorAll(".nav-link"));
      const currentIndex = allNavLinks.indexOf(currentActive);

      let nextIndex;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % allNavLinks.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        nextIndex =
          currentIndex === 0 ? allNavLinks.length - 1 : currentIndex - 1;
      }

      if (nextIndex !== undefined) {
        allNavLinks[nextIndex].click();
        allNavLinks[nextIndex].focus();
      }
    }

    // Escape key to cancel editing
    if (e.key === "Escape" && editBtn.style.display === "none") {
      cancelBtn.click();
    }
  });

  // Add focus styles for accessibility
  document
    .querySelectorAll(".nav-link, button, input, select, textarea")
    .forEach((element) => {
      element.addEventListener("focus", function () {
        this.style.outline = "2px solid #6c5ce7";
        this.style.outlineOffset = "2px";
      });

      element.addEventListener("blur", function () {
        this.style.outline = "";
        this.style.outlineOffset = "";
      });
    });

  // Auto-save draft changes
  let autoSaveTimeout;
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (!input.hasAttribute("readonly")) {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
          const draftData = {};
          formInputs.forEach((field) => {
            if (!field.hasAttribute("readonly")) {
              draftData[field.name] = field.value;
            }
          });
          localStorage.setItem(
            "occasio_profile_draft",
            JSON.stringify(draftData)
          );
        }, 1000);
      }
    });
  });

  // Load draft data when entering edit mode
  editBtn.addEventListener("click", function () {
    const draftData = localStorage.getItem("occasio_profile_draft");
    if (draftData) {
      try {
        const draft = JSON.parse(draftData);
        Object.keys(draft).forEach((key) => {
          const input = document.querySelector(`[name="${key}"]`);
          if (input && draft[key] !== originalValues[key]) {
            input.value = draft[key];
            input.style.borderColor = "#fdcb6e"; // Highlight draft changes
          }
        });
        if (Object.keys(draft).length > 0) {
          showNotification("Draft changes restored", "info");
        }
      } catch (e) {
        console.log("Error loading draft:", e);
      }
    }
  });

  // Clear draft on successful save
  profileForm.addEventListener("submit", function () {
    localStorage.removeItem("occasio_profile_draft");
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      if (document.body.classList.contains("dark-mode")) {
        this.textContent = "Enable Light Mode";
      } else {
        this.textContent = "Enable Dark Mode";
      }

      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
      );
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "Enable Light Mode";
    }
  }
});

let hamburgerIcon = document.querySelector(".hamburger-icon");
let navbar = document.querySelector(".navbar");

hamburgerIcon.addEventListener("click", () => {
  if (navbar.style.display === "block") {
    navbar.style.display = "none";
  } else {
    navbar.style.display = "block";
  }
});
