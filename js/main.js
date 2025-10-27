// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const body = document.body;

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  navMenu.classList.toggle("active");

  // Animate hamburger
  const spans = hamburger.querySelectorAll("span");
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    body.style.overflow = "hidden";
  } else {
    spans[0].style.transform = "";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "";
    body.style.overflow = "";
  }
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "";
    body.style.overflow = "";
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("active") &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    navMenu.classList.remove("active");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "";
    body.style.overflow = "";
  }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 60;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar Background Change on Scroll
const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageY;

  if (currentScroll > 100) {
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
  } else {
    navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  }

  lastScroll = currentScroll;
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections and cards
document.addEventListener("DOMContentLoaded", () => {
  // Add initial styles for animation
  const animateElements = document.querySelectorAll(
    ".skill-category, .project-card, .stat, .tech-item"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Contact Form Handling
const contactForm = document.getElementById("contactForm");

// EmailJS setup (replace with your own credentials)
const serviceID = "service_dra1hc4"; // replace with your service ID
const templateID = "template_zwpr8l2"; // replace with your template ID
const userID = "F6JrZ3S-tVrYzphaY"; // replace with your EmailJS User ID

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Validate form
  if (!name || !email || !subject || !message) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Show loading bar
  showLoadingBar();
  // Create form data object
  const formData = {
    name: name,
    email: email,
    subject: subject,
    message: message,
    timestamp: new Date().toISOString(),
  };

  // Send email using EmailJS
  emailjs
    .send(serviceID, templateID, formData)
    .then((response) => {
      // Success callback
      hideLoadingBar();
      console.log("Email sent successfully:", response);
      showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
      // Reset form
      contactForm.reset();
    })
    .catch((error) => {
      // Error callback
      console.error("Error sending email:", error);
      showNotification(
        "There was an error sending your message. Please try again later.",
        "error"
      );
    });

  // Log to console (in production, you would send this to a backend)
  console.log("Form submitted:", formData);
});

/* ✅ Loading Bar Functions */
function showLoadingBar() {
  if (document.querySelector(".loading-bar")) return; // Avoid duplicates

  const loadingBar = document.createElement("div");
  loadingBar.className = "loading-bar";
  loadingBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
        z-index: 99999;
        animation: loadingProgress 3s linear forwards;
    `;

  // Add animation keyframes
  if (!document.querySelector("#loadingBarStyles")) {
    const style = document.createElement("style");
    style.id = "loadingBarStyles";
    style.textContent = `
            @keyframes loadingProgress {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(loadingBar);
}

function hideLoadingBar() {
  const bar = document.querySelector(".loading-bar");
  if (bar) {
    bar.style.transition = "opacity 0.3s ease";
    bar.style.opacity = "0";
    setTimeout(() => bar.remove(), 300);
  }
}

// Notification Function
function showNotification(message, type = "success") {
  // Remove any existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        left: 20px;
        background: ${
          type === "success"
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        font-size: 0.95rem;
        text-align: center;
    `;

  // On larger screens, position right only
  if (window.innerWidth > 768) {
    notification.style.left = "auto";
    notification.style.right = "30px";
    notification.style.maxWidth = "350px";
  }

  // Add animation keyframes
  if (!document.querySelector("#notificationStyles")) {
    const style = document.createElement("style");
    style.id = "notificationStyles";
    style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(100px);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }

  // Append to body
  document.body.appendChild(notification);

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// Parallax Effect for Hero Section (disable on mobile for performance)
if (window.innerWidth > 768) {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");

    if (heroContent && heroImage && scrolled < 1000) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  });
}

// Add hover effect to project cards (touch support for mobile)
document.querySelectorAll(".project-card").forEach((card) => {
  // Desktop hover
  card.addEventListener("mouseenter", function () {
    this.style.zIndex = "10";
  });

  card.addEventListener("mouseleave", function () {
    this.style.zIndex = "1";
  });

  // Mobile touch
  card.addEventListener("touchstart", function () {
    this.style.zIndex = "10";
  });
});

// Tech Stack Item Click Handler
document.querySelectorAll(".tech-item").forEach((item) => {
  item.addEventListener("click", function () {
    const techName = this.getAttribute("data-tech");
    showNotification(
      `${techName} - One of my favorite technologies!`,
      "success"
    );
  });
});

// Skill Tag Animation
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.1) rotate(-2deg)";
  });

  tag.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1) rotate(0deg)";
  });

  // Touch support
  tag.addEventListener("touchstart", function () {
    this.style.transform = "scale(1.1) rotate(-2deg)";
    setTimeout(() => {
      this.style.transform = "scale(1) rotate(0deg)";
    }, 200);
  });
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + "+";
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + "+";
    }
  }, 16);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statElement = entry.target.querySelector("h3");
        const text = statElement.textContent;

        if (text.includes("+")) {
          const number = parseInt(text);
          statElement.textContent = "0+";
          animateCounter(statElement, number, 1500);
          statsObserver.unobserve(entry.target);
        } else if (text === "∞") {
          // Keep infinity symbol
          statsObserver.unobserve(entry.target);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat").forEach((stat) => {
  statsObserver.observe(stat);
});

// Reduced cursor trail effect (only on desktop, disabled on mobile for performance)
if (window.innerWidth > 1024 && !("ontouchstart" in window)) {
  let lastTime = 0;
  const throttleDelay = 50; // Only create trail every 50ms

  document.addEventListener("mousemove", (e) => {
    const currentTime = Date.now();
    if (currentTime - lastTime < throttleDelay) return;
    lastTime = currentTime;

    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            z-index: 9999;
            animation: trailFade 0.5s ease-out forwards;
        `;

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.remove();
    }, 500);
  });
}

// Add trail fade animation
if (!document.querySelector("#trailStyles")) {
  const style = document.createElement("style");
  style.id = "trailStyles";
  style.textContent = `
        @keyframes trailFade {
            to {
                opacity: 0;
                transform: scale(2);
            }
        }
    `;
  document.head.appendChild(style);
}

// Handle viewport resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      const spans = hamburger.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "";
      body.style.overflow = "";
    }
  }, 250);
});

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);

// Console Easter Egg
console.log(
  "%c👋 Hello, Developer!",
  "font-size: 20px; font-weight: bold; color: #6366f1;"
);
console.log(
  "%cLooking at my code? I like your curiosity!",
  "font-size: 14px; color: #06b6d4;"
);
console.log(
  "%cFeel free to reach out if you want to collaborate!",
  "font-size: 12px; color: #10b981;"
);

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio website loaded successfully! 🚀");

  // Set proper viewport for mobile
  const viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
    );
  }
});


// Copyright year

let year = new Date().getFullYear();
let setIn=document.getElementById("currentYear");

if(setIn){
  setIn.textContent=year;
}