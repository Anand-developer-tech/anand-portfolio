// Theme toggle (persisted)
(function () {
    const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
    if (saved === 'light') { document.documentElement.setAttribute('data-theme', 'light'); }
    const btn = document.getElementById('themeToggle');
    btn?.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
        else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
    });
})();

// Typing animation (reduced-motion friendly)
(function () {
    const typedEl = document.getElementById('typed');
    const roles = ['Full-Stack Developer', 'Graphic Designer', 'Software Developer'];
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!typedEl) return;
    if (reduced) { typedEl.textContent = roles[0]; return; }
    let i = 0, char = 0, dir = 1;
    function type() {
        const w = roles[i];
        char += dir;
        typedEl.textContent = w.slice(0, char);
        if (char === w.length + 2) { dir = -1; }
        if (char <= 0) { dir = 1; i = (i + 1) % roles.length; }
        setTimeout(type, dir === 1 ? 95 : 45);
    }
    setTimeout(type, 400);
})();

// Scroll reveal
(function () {
    const els = document.querySelectorAll('.reveal, .project, .card');
    els.forEach(el => el.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .16 });
    els.forEach(el => io.observe(el));
})();

// Fixed header: set spacer to real height & add scrolled class on scroll
(function () {
    function setSpacer() {
        const h = document.getElementById('siteHeader').offsetHeight || 64;
        document.getElementById('headerSpacer').style.height = h + 'px';
        document.documentElement.style.setProperty('--header-h', h + 'px');
    }
    const header = document.getElementById('siteHeader');
    function onScroll() {
        if (window.scrollY > 8) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    }
    window.addEventListener('load', () => { setSpacer(); onScroll(); });
    window.addEventListener('resize', setSpacer);
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

(function () {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = 'Sending...';
        submitBtn.disabled = true;

        const data = new FormData(form);
        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                form.reset();
                status.textContent = 'Thanks! Your message has been sent.';
            } else {
                const err = await res.json().catch(() => ({}));
                const msg = err?.errors?.[0]?.message || 'Something went wrong. Please try again or email directly.';
                status.textContent = msg;
            }
        } catch {
            status.textContent = 'Network error. Please try again.';
        } finally {
            submitBtn.disabled = false;
        }
    });
})();