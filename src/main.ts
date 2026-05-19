import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/sections.css";

import { renderHero } from "./hero";

renderHero();

// --- Navigation Logic ---

const navLinks = document.querySelectorAll<HTMLAnchorElement>(".side-nav a, .top-nav a");
const sections = document.querySelectorAll<HTMLElement>(".content-section, #profile");

/**
 * Updates the active state of navigation links
 * @param activeId The ID of the currently active section
 */
function updateActiveNav(activeId: string | null): void {
  if (!activeId) return;

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")?.replace("#", "");
    const isActive = href === activeId;

    // Handle .side-nav class-based styling
    if (isActive) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    }
  });
}

// Intersection Observer for Scroll Spy
const observerOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "-20% 0px -70% 0px",
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateActiveNav(entry.target.id);
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

// Click handler for immediate feedback
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href?.startsWith("#")) {
      const id = href.replace("#", "");
      updateActiveNav(id);
    }
  });
});

// --- Footer Logic ---

const currentYear = document.querySelector<HTMLElement>("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear().toString();
}
