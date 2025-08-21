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
