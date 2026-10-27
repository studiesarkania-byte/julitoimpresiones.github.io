/* ============================================================
   JULITO IMPRESIONES — script.js
   Menú, animaciones, galería, lightbox, contadores, formularios
   ============================================================ */

// >>> CONFIGURACIÓN RÁPIDA — cambia aquí el número de WhatsApp
const WHATSAPP = '573181959737'; // formato internacional sin + ni espacios

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año del footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Enlaces de WhatsApp ---------- */
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
    a.href = 'https://wa.me/' + WHATSAPP;
  });

  /* ---------- Header fijo al hacer scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú hamburguesa ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const closeMenu = () => { nav.classList.remove('is-open'); burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Animaciones al aparecer ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll('.stat__num[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1500; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));

  /* ---------- Filtros de portafolio ---------- */
  const filters = document.querySelectorAll('.filter');
  const shots = document.querySelectorAll('.shot');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    shots.forEach(s => s.classList.toggle('is-hidden', f !== 'all' && s.dataset.cat !== f));
  }));

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  shots.forEach(s => s.addEventListener('click', () => {
    const img = s.querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt;
    lb.hidden = false; document.body.style.overflow = 'hidden';
  }));
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ---------- Video (marcador de posición) ---------- */
  const videoBox = document.getElementById('videoBox');
  if (videoBox) {
    videoBox.querySelector('.video__play').addEventListener('click', () => {
      // Cuando tengas el archivo, reemplaza esto por tu <video> o iframe de YouTube:
      // videoBox.innerHTML = '<video src="IMG/video.mp4" controls autoplay style="width:100%;height:100%"></video>';
      alert('El video se añadirá aquí cuando esté disponible.');
    });
  }

  /* ---------- Validación de formularios ---------- */
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(form) {
    let ok = true;
    form.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.field');
      const err = field.querySelector('.err');
      let msg = '';
      if (!input.value.trim()) msg = 'Este campo es obligatorio.';
      else if (input.type === 'email' && !emailRx.test(input.value)) msg = 'Escribe un correo válido.';
      else if (input.type === 'tel' && input.value.replace(/\D/g, '').length < 7) msg = 'Escribe un número válido.';
      field.classList.toggle('is-error', !!msg);
      if (err) err.textContent = msg;
      if (msg) ok = false;
    });
    return ok;
  }

  const quoteForm = document.getElementById('quoteForm');
  const formOk = document.getElementById('formOk');

  function quoteMessage() {
    if (!quoteForm) return '';
    const d = new FormData(quoteForm);
    const g = k => (d.get(k) || '').toString().trim() || '—';
    return `Hola Julito Impresiones, quiero una cotización:
• Nombre: ${g('nombre')}
• Empresa: ${g('empresa')}
• Teléfono: ${g('whatsapp')}
• Correo: ${g('correo')}
• Tipo de impresión: ${g('tipo')}
• Cantidad: ${g('cantidad')}
• Tamaño: ${g('tamano')}
• Material: ${g('material')}
• Acabado: ${g('acabado')}
• Fecha de entrega: ${g('fecha')}
• Ciudad: ${g('ciudad')}
• ¿Diseño listo?: ${g('diseno')}
• Mensaje: ${g('mensaje')}`;
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(quoteForm)) return;
      formOk.hidden = false;
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(quoteMessage()), '_blank');
    });
    const waQuote = document.getElementById('waQuote');
    waQuote.addEventListener('click', e => {
      e.preventDefault();
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(quoteMessage()), '_blank');
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(contactForm)) return;
      document.getElementById('contactOk').hidden = false;
      const d = new FormData(contactForm);
      const txt = `Hola, soy ${d.get('nombre')}. ${d.get('mensaje')} (Correo: ${d.get('correo')})`;
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(txt), '_blank');
    });
  }
});
