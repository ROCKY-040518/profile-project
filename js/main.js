/* =============================================================
   Portfolio Template — main.js
   Pure Vanilla JS · No dependencies
   =============================================================

   SECTIONS
   --------
   1. Typing Effect (Hero subtitle)
   2. Navbar: scroll glassmorphism + active link highlight
   3. Mobile Hamburger Menu
   4. Scroll Reveal (IntersectionObserver)
   5. Contact Form (static feedback)
   ============================================================= */


/* ============================================================
   1. TYPING EFFECT
   ✏️ EDIT: roles 배열에 본인 직함/역할 추가
   ============================================================ */
const roles = [
  '풀스택 개발자',
  '백엔드 엔지니어',
  '시스템 아키텍트',
  '오픈소스 기여자',
  '문제 해결사',
];

(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  let roleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, 2000);   /* pause before deleting */
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 48 : 82;
    setTimeout(tick, speed);
  }

  tick();
})();


/* ============================================================
   2. NAVBAR — scroll effect & active section highlight
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections  = document.querySelectorAll('section[id]');

  if (!navbar) return;

  function updateNavbar() {
    /* Glassmorphism on scroll */
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    /* Highlight the currently visible section */
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 130) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); /* run once on load */
})();


/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger      = document.getElementById('hamburger');
  const navLinksEl     = document.getElementById('nav-links');

  if (!hamburger || !navLinksEl) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    navLinksEl.classList.toggle('open', open);
    /* Prevent body scroll when menu is open */
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.contains('open');
    toggleMenu(!isOpen);
  });

  /* Close menu when a nav link is clicked */
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
      toggleMenu(false);
    }
  });
})();


/* ============================================================
   4. SCROLL REVEAL  (IntersectionObserver)
      Elements with class "reveal" fade + slide up when visible
   ============================================================ */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    /* Fallback: show all elements immediately on older browsers */
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* fire once */
        }
      });
    },
    {
      threshold:  0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ============================================================
   5. CONTACT FORM  (static — shows in-page feedback)
      For real email delivery, swap the handler with Formspree,
      EmailJS, or your own backend endpoint.
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* ✏️ EDIT: Formspree 연동 방법
       1. https://formspree.io 에서 폼 생성 후 ID 복사
       2. 아래 주석 해제 후 YOUR_FORM_ID 교체
    */
    /*
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error('Network error');
    } catch {
      submitBtn.textContent = '전송 실패 — 다시 시도해주세요';
      return;
    }
    */

    /* Static success feedback */
    const originalText = submitBtn.textContent;
    submitBtn.textContent  = '메시지가 전송되었습니다!';
    submitBtn.disabled     = true;
    form.classList.add('success');

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled    = false;
      form.classList.remove('success');
    }, 3500);
  });
})();


/* ============================================================
   Smooth scroll for anchor links (fallback for older Safari)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
