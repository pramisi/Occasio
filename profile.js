// Profile Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".profile-section");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));
      link.classList.add("active");
      const target = document.getElementById(link.dataset.section);
      if (target) target.classList.add("active");
    });
  });

  const editBtn = document.getElementById("edit-profile-btn");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const profileForm = document.getElementById("profile-form");
  const formInputs = profileForm.querySelectorAll("input, textarea, select");
  const formActions = document.querySelector(".form-actions");

  let originalValues = {};
  function storeOriginalValues() {
    formInputs.forEach(input => (originalValues[input.name] = input.value));
  }
  function enableEditMode() {
    storeOriginalValues();
    formInputs.forEach(input => {
      input.removeAttribute("readonly");
      input.removeAttribute("disabled");
      input.style.background = "white";
    });
    editBtn.style.display = "none";
    formActions.style.display = "flex";
  }
  function disableEditMode() {
    formInputs.forEach(input => {
      input.setAttribute("readonly", true);
      if (input.tagName === "SELECT") input.setAttribute("disabled", true);
      input.style.background = "#f8f9fa";
    });
    editBtn.style.display = "inline-flex";
    formActions.style.display = "none";
  }
  function restoreOriginalValues() {
    formInputs.forEach(input => {
      if (originalValues[input.name] !== undefined) {
        input.value = originalValues[input.name];
      }
    });
  }

  editBtn.addEventListener("click", enableEditMode);
  cancelBtn.addEventListener("click", () => {
    restoreOriginalValues();
    disableEditMode();
  });

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const required = ["firstName","lastName","email"];
    let valid = true;
    required.forEach(f => {
      const el = document.getElementById(f);
      if (!el.value.trim()) {
        el.style.borderColor = "#e17055";
        valid = false;
      } else el.style.borderColor = "";
    });
    const emailVal = document.getElementById("email").value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      document.getElementById("email").style.borderColor = "#e17055";
      showNotification("Enter a valid email", "error");
      return;
    }
    if (!valid) {
      showNotification("Please fill in all required fields", "error");
      return;
    }
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    setTimeout(() => {
      localStorage.setItem("occasio_profile", JSON.stringify(Object.fromEntries([...formInputs].map(i => [i.name, i.value]))));
      document.getElementById("user-name").textContent = `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`;
      document.getElementById("user-email").textContent = emailVal;
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      disableEditMode();
      showNotification("Profile updated successfully!", "success");
    }, 1200);
  });

  function showNotification(msg,type="info") {
    const note = document.createElement("div");
    note.className = `notification ${type}`;
    note.textContent = msg;
    Object.assign(note.style,{position:"fixed",top:"20px",right:"20px",background:"#6e45e2",color:"#fff",padding:"0.7rem 1rem",borderRadius:"6px"});
    document.body.appendChild(note);
    setTimeout(()=>note.remove(),2500);
  }

  storeOriginalValues();
});

document.querySelector(".hamburger-icon").addEventListener("click", ()=>{
  const navbar = document.querySelector(".navbar");
  navbar.style.display = navbar.style.display === "block" ? "none":"block";
});
// ==================== DARK MODE FUNCTIONALITY ====================
// Add this at the END of your existing profile.js file

// Dark Mode Toggle Implementation
(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener("DOMContentLoaded", function() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;
        
        // Only proceed if theme toggle exists on this page
        if (!themeToggle || !themeIcon) {
            console.log('Dark mode toggle not found on this page');
            return;
        }
        
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('occasio-theme') || 'light';
        console.log('Current theme:', currentTheme);
        
        // Apply saved theme on page load
        if (currentTheme === 'dark') {
            body.classList.add('dark-mode');
            updateThemeIcon(true);
        }
        
        // Theme toggle event listener
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Theme toggle clicked');
            
            // Toggle dark mode class
            body.classList.toggle('dark-mode');
            
            const isDarkMode = body.classList.contains('dark-mode');
            console.log('Is dark mode:', isDarkMode);
            
            // Save theme preference to localStorage
            localStorage.setItem('occasio-theme', isDarkMode ? 'dark' : 'light');
            
            // Update icon
            updateThemeIcon(isDarkMode);
            
            // Show notification
            showThemeNotification(isDarkMode);
        });
        
        // Update theme icon function
        function updateThemeIcon(isDarkMode) {
            if (isDarkMode) {
                themeIcon.className = 'bi bi-moon-fill';
                themeToggle.title = 'Switch to Light Mode';
            } else {
                themeIcon.className = 'bi bi-brightness-high-fill';
                themeToggle.title = 'Switch to Dark Mode';
            }
        }
        
        // Show theme change notification
        function showThemeNotification(isDarkMode) {
            const message = isDarkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled';
            
            // Remove any existing notifications
            const existingNotification = document.querySelector('.theme-notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'theme-notification';
            notification.textContent = message;
            
            // Style the notification
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${isDarkMode ? '#333' : '#000'};
                color: ${isDarkMode ? '#fff' : '#fff'};
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                z-index: 10001;
                font-size: 0.9rem;
                font-weight: 500;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
                transform: translateX(100%);
                pointer-events: none;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                border: 1px solid ${isDarkMode ? '#555' : '#333'};
            `;
            
            document.body.appendChild(notification);
            
            // Show notification with animation
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Hide and remove notification
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 2500);
        }
        
        // Initialize theme on page load
        console.log('Dark mode initialized');
    });
    
    // Also check theme immediately for faster loading
    const savedTheme = localStorage.getItem('occasio-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();

// ==================== END DARK MODE FUNCTIONALITY ====================