
(function(){
  const data = window.__SITE_DATA__ || {projects:[], categories:[], testimonials:[]};
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Icons
  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
  });

  // Mobile menu
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuBtn.innerHTML = isHidden ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    }));
  }

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Filters
  const filters = $('#filters');
  const projectsGrid = $('#projectsGrid');
  let currentCategory = 'todos';

  function renderFilters(){
    filters.innerHTML = '';
    (data.categories.length ? data.categories : [{id:'todos',name:'Todos'}]).forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'rounded-full border px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-600 ' + (cat.id===currentCategory ? 'bg-orange-600 text-white border-orange-600' : '');
      btn.textContent = cat.name;
      btn.dataset.id = cat.id;
      btn.addEventListener('click', () => {
        currentCategory = cat.id;
        renderFilters();
        renderProjects();
      });
      filters.appendChild(btn);
    });
  }

  function renderProjects(){
  const items = data.projects.filter(p => currentCategory==='todos' || p.category===currentCategory);
  projectsGrid.innerHTML = '';
  items.forEach(p => {
    const images = (p.images && p.images.length) ? p.images : [p.thumbnail];
    const card = document.createElement('article');
    card.className = 'group relative overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition cursor-pointer bg-white';
    card.innerHTML = `
      <div class="aspect-[4/3] overflow-hidden bg-gray-100">
        <img data-role="card-img" src="${images[0]}" alt="${p.title}" class="h-full w-full object-cover group-hover:scale-105 transition duration-300" loading="lazy">
        <div class="card-arrows">
          <button class="card-arrow" data-role="prev"><i data-lucide="chevron-left"></i></button>
          <button class="card-arrow" data-role="next"><i data-lucide="chevron-right"></i></button>
        </div>
      </div>
      <div class="p-4 flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold">${p.title}</h3>
          <p class="text-sm text-gray-600 mt-1 capitalize">${p.category}</p>
        </div>
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white">
          <i data-lucide="zoom-in"></i>
        </span>
      </div>
    `;
    // Per-card carousel state
    let idx = 0;
    const imgEl = card.querySelector('[data-role="card-img"]');
    const prevBtn = card.querySelector('[data-role="prev"]');
    const nextBtn = card.querySelector('[data-role="next"]');
    function updateCardImg(){
      imgEl.src = images[idx];
    }
    prevBtn.addEventListener('click', (e)=>{ e.stopPropagation(); idx = (idx - 1 + images.length) % images.length; updateCardImg(); });
    nextBtn.addEventListener('click', (e)=>{ e.stopPropagation(); idx = (idx + 1) % images.length; updateCardImg(); });

    // Open modal on card click (except on arrow clicks)
    card.addEventListener('click', (ev) => {
      if (ev.target.closest('.card-arrow')) return;
      openModal(p);
    });

    projectsGrid.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
}


  // Modal gallery
  const galleryModal = $('#galleryModal');
  const modalTitle = $('#modalTitle');
  const modalImage = $('#modalImage');
  const thumbs = null;
  const closeModal = $('#closeModal');
  const prevImage = $('#prevImage');
  const nextImage = $('#nextImage');
  let modalProject = null;
  let imageIndex = 0;

  function openModal(project){
    modalProject = project;
    imageIndex = 0;
    modalTitle.textContent = project.title;
    updateModalImage();
    renderThumbs();
    galleryModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModalFn(){
    galleryModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function updateModalImage(){
    if (!modalProject) return;
    const url = modalProject.images[imageIndex] || modalProject.thumbnail;
    modalImage.src = url;
    modalImage.alt = modalProject.title + ' imagem ' + (imageIndex+1);
  }

  function renderThumbs(){}

  closeModal?.addEventListener('click', closeModalFn);
  galleryModal?.addEventListener('click', (e) => { if (e.target === galleryModal) closeModalFn(); });
  prevImage?.addEventListener('click', () => {
    if (!modalProject) return;
    imageIndex = (imageIndex - 1 + modalProject.images.length) % modalProject.images.length;
    updateModalImage(); renderThumbs();
  });
  nextImage?.addEventListener('click', () => {
    if (!modalProject) return;
    imageIndex = (imageIndex + 1) % modalProject.images.length;
    updateModalImage(); renderThumbs();
  });

  // Testimonials
  const testimonialsWrap = $('#testimonials');
  function renderTestimonials(){
    testimonialsWrap.innerHTML = '';
    data.testimonials.forEach(t => {
      const el = document.createElement('figure');
      el.className = 'rounded-2xl border p-6 shadow-sm bg-white';
      el.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <i data-lucide="user"></i>
          </span>
          <div>
            <figcaption class="font-medium">${t.name}</figcaption>
            <p class="text-sm text-gray-600">${t.location}</p>
          </div>
        </div>
        <blockquote class="mt-4 text-gray-700">"${t.text}"</blockquote>
        <div class="mt-3 flex gap-1">
          ${'★'.repeat(Math.max(0, Math.min(5, t.rating || 5)))}${'☆'.repeat(Math.max(0, 5 - (t.rating || 5)))}
        </div>
      `;
      testimonialsWrap.appendChild(el);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // Init
  renderFilters();
  renderProjects();
  renderTestimonials();

  // Smooth scroll for nav links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
    });
  });

})();












// ===== Serviços: carrossel 2 páginas com GAP entre páginas =====
(function(){
  const carousel = document.querySelector('#servicos .svc-carousel');
  const viewport = document.querySelector('#servicos .svc-viewport');
  const track = document.getElementById('svcTrack');
  const scroller = viewport;
  const pages = Array.from(track?.querySelectorAll('.svc-page') || []);
  const dotsWrap = document.getElementById('svcDots');
  const prevBtn = document.getElementById('svcPrev');
  const nextBtn = document.getElementById('svcNext');
  if(!carousel || !viewport || !track || !pages.length || !dotsWrap || !prevBtn || !nextBtn) return;

  const pageWidth = () => viewport.clientWidth;
  const pageGap = () => {
    const cs = getComputedStyle(track);
    const raw = parseFloat((cs.columnGap || cs.gap || '0').toString());
    return isNaN(raw) ? 0 : raw;
  };
  const stride = () => pageWidth() + pageGap();

  let dots = [];
  function buildDots(){
    dotsWrap.innerHTML = '';
    dots = pages.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'svc-dot' + (i===0?' is-active':'');
      b.setAttribute('aria-label', 'Ir para página ' + (i+1));
      b.addEventListener('click', ()=> goto(i));
      dotsWrap.appendChild(b);
      return b;
    });
  }

  function currentPage(){
    return Math.round(scroller.scrollLeft / stride());
  }

  function goto(i){
    const maxIndex = pages.length - 1;
    const idx = Math.max(0, Math.min(maxIndex, i));
    scroller.scrollTo({left: Math.round(idx * stride()), behavior: 'smooth'});
  }

  function updateUI(){
    const idx = currentPage();
    dots.forEach((d,k)=>d.classList.toggle('is-active', k===idx));
    prevBtn.classList.toggle('is-disabled', idx === 0);
    nextBtn.classList.toggle('is-disabled', idx === pages.length - 1);
  }

  // Setas
  prevBtn.addEventListener('click', ()=> goto(currentPage() - 1));
  nextBtn.addEventListener('click', ()=> goto(currentPage() + 1));

  // Drag / Wheel
  let down=false, sx=0, sl=0, pid=null;
  viewport.addEventListener('pointerdown', e=>{ down=true; sx=e.clientX; sl=scroller.scrollLeft; pid=e.pointerId; viewport.setPointerCapture(pid); });
  viewport.addEventListener('pointermove', e=>{ if(!down) return; scroller.scrollLeft = sl - (e.clientX - sx); });
  viewport.addEventListener('pointerup', ()=>{ down=false; updateUI(); });
  viewport.addEventListener('pointercancel', ()=>{ down=false; updateUI(); });
  viewport.addEventListener('wheel', e=>{
    if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){ e.preventDefault(); scroller.scrollLeft += e.deltaY; }
  }, {passive:false});

  scroller.addEventListener('scroll', updateUI, {passive:true});
  window.addEventListener('resize', ()=>{ goto(currentPage()); updateUI(); });

  buildDots();
  if (window.lucide) window.lucide.createIcons();
  updateUI();
})();
