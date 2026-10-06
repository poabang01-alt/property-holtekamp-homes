'use strict';

const PROJECT_PHONE = '081250504842';
const PROJECT_EMAIL = 'ptgiranbumisejahtera01@gmail.com';
const PROJECT_WHATSAPP = '6281250504842';
const SOURCE_URL = 'https://sikumbang.tapera.go.id/lokasi-perumahan/JAP0420062025T003';

const unitData = {
  36: {
    name: 'Tipe 36 / 90',
    tagline: 'Rumah subsidi yang tercantum pada listing publik Giran Residence Holtekamp.',
    price: 'Rp240 Juta',
    icon: 'fa-house',
    specs: [
      ['Luas Bangunan', '36 m²', 'fa-ruler-combined'],
      ['Luas Tanah', '90 m²', 'fa-maximize'],
      ['Kamar Tidur', '2', 'fa-bed'],
      ['Kamar Mandi', '1', 'fa-bath'],
      ['Kategori', 'Subsidi', 'fa-house-circle-check'],
      ['ID Lokasi', 'JAP0420062025T003', 'fa-hashtag']
    ]
  }
};

const galleryData = [
  {
    title: 'Area Perumahan',
    src: 'https://sikumbang.tapera.go.id/public/upload/2025/05/13/file-lokasi-3fed3898-de79-47ad-bbf5-1468d2cd266c.jpg'
  },
  {
    title: 'Rumah Contoh',
    src: 'https://sikumbang.tapera.go.id/public/upload/2025/05/13/file-lokasi-3aff9aac-8e77-4fa4-b4b1-1074c635b8a2.jpg'
  },
  {
    title: 'Posisi Tengah Lokasi',
    src: 'https://sikumbang.tapera.go.id/public/upload/2025/05/13/file-lokasi-efc6a4a6-117e-4554-8c04-0ac65456d927.jpg'
  }
];

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const header = qs('.site-header');
const menuToggle = qs('.menu-toggle');
const mobileMenu = qs('#mobileMenu');
const unitModal = qs('#unitModal');
const galleryModal = qs('#galleryModal');
const toast = qs('#toast');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function setHeaderState() {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
});
qsa('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Navbar active state berdasarkan section yang dominan di viewport.
const navLinks = qsa('.nav-link[href^="#"]');
const sectionMap = new Map(
  qsa('[data-nav-section]').map(section => [section.id, section])
);

function activateNav(id) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

if ('IntersectionObserver' in window && sectionMap.size) {
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) activateNav(visible.target.id);
  }, {
    rootMargin: '-28% 0px -58% 0px',
    threshold: [0.02, 0.15, 0.35]
  });
  sectionMap.forEach(section => navObserver.observe(section));
}

navLinks.forEach(link => link.addEventListener('click', () => {
  const id = link.getAttribute('href').slice(1);
  activateNav(id);
}));

// Sinkronisasi tambahan berbasis posisi scroll menjaga active state stabil
// pada section pendek, anchor navigation, dan viewport mobile.
function syncActiveNavByScroll() {
  if (!sectionMap.size) return;
  const marker = window.scrollY + (header?.offsetHeight || 0) + Math.min(window.innerHeight * 0.24, 220);
  let current = 'home';
  sectionMap.forEach((section, id) => {
    if (section.offsetTop <= marker) current = id;
  });
  activateNav(current);
}

window.addEventListener('scroll', syncActiveNavByScroll, { passive: true });
window.addEventListener('resize', syncActiveNavByScroll);
window.addEventListener('load', syncActiveNavByScroll);
syncActiveNavByScroll();

// Motion (penerus Framer Motion) untuk entrance effects. Fallback tetap tersedia.
function initMotionAnimations() {
  const motion = window.Motion;
  if (!motion?.animate || reducedMotion) return false;

  motion.animate('.hero-copy', { opacity: [0, 1], transform: ['translateY(22px)', 'translateY(0px)'] }, { duration: 0.72, ease: [0.22, 1, 0.36, 1] });
  motion.animate('.hero-visual', { opacity: [0, 1], transform: ['translateY(26px) scale(.985)', 'translateY(0px) scale(1)'] }, { duration: 0.82, delay: 0.08, ease: [0.22, 1, 0.36, 1] });
  motion.animate('.stats-wrap article', { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] }, { duration: 0.5, delay: motion.stagger ? motion.stagger(0.06, { startDelay: 0.22 }) : 0.22 });

  qsa('.hero-copy, .hero-visual, .stats-wrap').forEach(el => el.classList.add('motion-managed'));
  return true;
}

const motionReady = initMotionAnimations();

// Webflow-style scroll interaction menggunakan GSAP + ScrollTrigger (mesin yang didokumentasikan Webflow untuk IX3).
function initWebflowStyleInteractions() {
  if (!window.gsap || !window.ScrollTrigger || reducedMotion) return false;
  window.gsap.registerPlugin(window.ScrollTrigger);
  qsa('.reveal').forEach((el, index) => {
    if (el.classList.contains('motion-managed')) return;
    const delay = Number(el.dataset.delay || 0) / 1000;
    window.gsap.fromTo(el,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      }
    );
  });
  return true;
}

const gsapReady = initWebflowStyleInteractions();

// Fallback reveal jika CDN animasi tidak tersedia/offline.
if (!gsapReady) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  qsa('.reveal').forEach(el => {
    if (motionReady && el.classList.contains('motion-managed')) {
      el.classList.add('visible');
      return;
    }
    const delay = Number(el.dataset.delay || 0);
    el.style.setProperty('--delay', `${delay}ms`);
    revealObserver.observe(el);
  });
} else {
  qsa('.motion-managed').forEach(el => el.classList.add('visible'));
}

// 3D tilt tetap ringan dan dinonaktifkan pada touch/reduced-motion.
const canTilt = window.matchMedia('(pointer: fine)').matches && !reducedMotion;
if (canTilt) {
  qsa('.tilt-card').forEach(card => {
    const strength = Number(card.dataset.tiltStrength || 4);
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

qsa('.open-detail').forEach(btn => btn.addEventListener('click', () => {
  const item = unitData[btn.dataset.type];
  if (!item || !unitModal) return;
  qs('#unitModalContent').innerHTML = `
    <div class="modal-inner">
      <div class="modal-icon"><i class="fa-solid ${item.icon}"></i></div>
      <h2>${item.name}</h2>
      <p>${item.tagline}</p>
      <div class="modal-specs">
        ${item.specs.map(([label, value, icon]) => `<span><i class="fa-solid ${icon}"></i> ${label}: <strong>${value}</strong></span>`).join('')}
      </div>
      <div class="modal-price"><small>Harga pada listing SiKumbang</small><strong>${item.price}</strong><small>Kategori rumah subsidi</small></div>
      <a class="btn btn-primary btn-block" href="https://wa.me/${PROJECT_WHATSAPP}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i> Pesan via WhatsApp</a>
      <a class="modal-source-link" href="${SOURCE_URL}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Lihat data sumber SiKumbang</a>
    </div>`;
  unitModal.showModal();
}));
qs('[data-close-modal]')?.addEventListener('click', () => unitModal.close());
unitModal?.addEventListener('click', event => { if (event.target === unitModal) unitModal.close(); });

qsa('[data-gallery]').forEach(btn => btn.addEventListener('click', () => {
  const item = galleryData[Number(btn.dataset.gallery)];
  if (!item || !galleryModal) return;
  qs('#galleryModalContent').innerHTML = `
    <div class="gallery-modal-photo-wrap">
      <img src="${item.src}" alt="${item.title} Giran Residence Holtekamp" referrerpolicy="no-referrer">
      <p><strong>${item.title}</strong> — foto dari galeri publik SiKumbang Giran Residence Holtekamp.</p>
    </div>`;
  galleryModal.showModal();
}));
qs('[data-close-gallery]')?.addEventListener('click', () => galleryModal.close());
galleryModal?.addEventListener('click', event => { if (event.target === galleryModal) galleryModal.close(); });

qsa('.scroll-consult').forEach(btn => btn.addEventListener('click', () => {
  qs('#konsultasi')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
}));

qs('#consultForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const name = qs('#name')?.value.trim();
  const phone = qs('#phone')?.value.trim();
  const topic = qs('#houseType')?.value;
  const need = qs('#plan')?.value;
  if (!name || !phone) return;

  const body = [
    `Halo PT Giran Bumi Sejahtera,`,
    '',
    `Saya ${name} ingin meminta informasi mengenai Giran Residence Holtekamp.`,
    `Nomor yang bisa dihubungi: ${phone}`,
    `Topik: ${topic}`,
    `Kebutuhan: ${need}`,
    '',
    'Mohon informasi terbaru mengenai ketersediaan unit, harga, pembiayaan, legalitas, dan jadwal survei bila tersedia.'
  ].join('\n');

  window.open(`https://wa.me/${PROJECT_WHATSAPP}?text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
  showToast('WhatsApp sedang dibuka dengan pesan konsultasi yang sudah disiapkan.');
});

qs('#year').textContent = new Date().getFullYear();
