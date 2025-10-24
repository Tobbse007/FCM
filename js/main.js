// Minimal JS: mobile nav + placeholder for Fußball.de widgets
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// News Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('searchInput')) {
    initializeNewsFilter();
  }
  // Wire news modal if on news page
  if (document.querySelector('.news-item')) {
    initializeNewsModal();
  }
  // Chronik page enhancements
  initializeChronikEnhancements();
});

function initializeNewsFilter() {
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsItems = document.querySelectorAll('.news-item');
  const resultsCounter = document.getElementById('resultsCounter');
  const paginationBtns = document.querySelectorAll('.pagination-btn');
  
  let currentFilter = 'all';
  let currentPage = 1;
  const itemsPerPage = 9;

  // Initialize filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-black', 'text-white');
        b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
      });
      this.classList.add('active', 'bg-black', 'text-white');
      this.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
      
      currentFilter = this.dataset.filter;
      currentPage = 1;
      filterAndDisplayNews();
    });
  });

  // Search input listener
  searchInput.addEventListener('input', function() {
    currentPage = 1;
    filterAndDisplayNews();
  });

  // Pagination button listeners
  paginationBtns.forEach(btn => {
    if (!btn.disabled && btn.textContent.trim() && !isNaN(btn.textContent.trim())) {
      btn.addEventListener('click', function() {
        currentPage = parseInt(this.textContent.trim());
        filterAndDisplayNews();
        updatePaginationButtons();
      });
    }
  });

  function filterAndDisplayNews() {
    const searchTerm = searchInput.value.toLowerCase();
    let visibleItems = [];

    newsItems.forEach(item => {
      const title = item.dataset.title.toLowerCase();
      const category = item.dataset.category.toLowerCase();
      const content = item.textContent.toLowerCase();
      
      // Check if item matches search
      const matchesSearch = searchTerm === '' || 
                           title.includes(searchTerm) || 
                           content.includes(searchTerm);
      
      // Check if item matches filter
      const matchesFilter = currentFilter === 'all' || 
                           category.includes(currentFilter);
      
      if (matchesSearch && matchesFilter) {
        visibleItems.push(item);
      }
    });

    // Hide all items first
    newsItems.forEach(item => {
      item.style.display = 'none';
    });

    // Calculate pagination
    const totalItems = visibleItems.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = visibleItems.slice(startIndex, endIndex);

    // Show items for current page
    itemsToShow.forEach(item => {
      item.style.display = 'block';
    });

    // Update results counter
    if (resultsCounter) {
      const displayedCount = itemsToShow.length;
      resultsCounter.innerHTML = `Zeige <span class="font-semibold">${displayedCount}</span> von <span class="font-semibold">${totalItems}</span> Beiträgen`;
    }

    // Update pagination visibility
    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    const searchTerm = searchInput.value.toLowerCase();
    let visibleItems = [];

    newsItems.forEach(item => {
      const title = item.dataset.title.toLowerCase();
      const category = item.dataset.category.toLowerCase();
      const content = item.textContent.toLowerCase();
      
      const matchesSearch = searchTerm === '' || title.includes(searchTerm) || content.includes(searchTerm);
      const matchesFilter = currentFilter === 'all' || category.includes(currentFilter);
      
      if (matchesSearch && matchesFilter) {
        visibleItems.push(item);
      }
    });

    const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
    
    paginationBtns.forEach(btn => {
      if (btn.textContent.trim() && !isNaN(btn.textContent.trim())) {
        const pageNum = parseInt(btn.textContent.trim());
        if (pageNum === currentPage) {
          btn.classList.add('bg-black', 'text-white');
          btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        } else {
          btn.classList.remove('bg-black', 'text-white');
          btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        }
        
        // Hide pagination buttons if page doesn't exist
        if (pageNum > totalPages) {
          btn.style.display = 'none';
        } else {
          btn.style.display = 'inline-block';
        }
      }
    });
  }

  // Initial display
  filterAndDisplayNews();
}

// Animation for news cards on scroll
function initializeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.news-item').forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.news-item')) {
    setTimeout(() => {
      initializeScrollAnimations();
    }, 100);
  }
});

// Placeholder: dynamic fetch of upcoming matches (to integrate with widget/provider)
async function loadMatches(){
  const container = document.getElementById('matches-list');
  if(!container) return;
  container.innerHTML = '<div class="text-gray-500 text-sm">Lade Spiele...</div>';
  // Integration point: embed external widget script or fetch API JSON.
  // For now stub data.
  await new Promise(r=>setTimeout(r,500));
  const demo = [
    {date:'Sa 24.08.2025', opponent:'SV Beispielstadt', time:'15:30', venue:'Heim'},
    {date:'So 31.08.2025', opponent:'FC Muster', time:'13:00', venue:'Auswärts'}
  ];
  container.innerHTML = demo.map(m=>`<li class='flex items-center justify-between py-2 border-b border-gray-100'><span class='font-medium text-sm'>${m.date}</span><span class='text-sm truncate mx-2'>${m.opponent}</span><span class='text-xs text-gray-500'>${m.time}</span><span class='text-xs px-2 py-0.5 rounded bg-gray-200'>${m.venue}</span></li>`).join('');
}
loadMatches();

// Modal: News details
function initializeNewsModal() {
  const modal = document.getElementById('news-modal');
  if (!modal) return;
  const modalTitle = document.getElementById('news-modal-title');
  const modalImage = document.getElementById('news-modal-image');
  const modalImageWrapper = document.getElementById('news-modal-image-wrapper');
  const modalContent = document.getElementById('news-modal-content');
  const closeBtn = document.getElementById('news-modal-close');
  const closeBtnBottom = document.getElementById('news-modal-close-bottom');
  const backdrop = document.getElementById('news-modal-backdrop');

  function openModal() {
    modal.classList.remove('hidden');
    document.documentElement.style.overflow = 'hidden';
    // Animation einblenden
    setTimeout(() => {
      const modalContent = modal.querySelector('.transform');
      if (modalContent) {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
      }
    }, 10);
  }
  
  function closeModal() {
    const modalContent = modal.querySelector('.transform');
    if (modalContent) {
      modalContent.classList.add('scale-95', 'opacity-0');
      modalContent.classList.remove('scale-100', 'opacity-100');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
      document.documentElement.style.overflow = '';
    }, 300);
  }

  closeBtn?.addEventListener('click', closeModal);
  closeBtnBottom?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // Delegate clicks for read-more links or whole article
  document.addEventListener('click', (e) => {
    let article = e.target.closest('.news-item');
    let link = e.target.closest('a');
    const isReadMore = link && /mehr|lesen|bericht/i.test(link.textContent || '');
    if (!article && isReadMore) article = link.closest('.news-item');
    if (!article) return;
    if (isReadMore) e.preventDefault();

    // Extract title
    const titleEl = article.querySelector('h3, h2');
    modalTitle.textContent = titleEl ? titleEl.textContent.trim() : (article.dataset.title || '');

  // No date/category/score in simplified modal

    // Extract main image
    const imgEl = article.querySelector('img');
    if (imgEl) {
      modalImage.src = imgEl.src;
      modalImage.alt = imgEl.alt || '';
      modalImageWrapper.classList.remove('hidden');
    } else {
      modalImageWrapper.classList.add('hidden');
    }

    // Extract content: use paragraph(s) within the article body
    const body = article.querySelector('.p-6, .p-8');
    let paragraphs = [];
    if (body) {
      body.querySelectorAll('p').forEach(p => {
        const text = p.textContent.trim();
        if (text) paragraphs.push(`<p>${escapeHtml(text)}</p>`);
      });
      // If none found, fall back to first 1-2 sentences of article text
      if (paragraphs.length === 0) {
        const text = (body.textContent || '').trim();
        if (text) paragraphs.push(`<p>${escapeHtml(text)}</p>`);
      }
    }
    modalContent.innerHTML = paragraphs.join('') || '<p>Vollständiger Bericht wird demnächst ergänzt.</p>';

    openModal();
  });
}

function escapeHtml(str){
  return str
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

// Chronik: smooth scroll, scrollspy, back-to-top
function initializeChronikEnhancements() {
  const backToTop = document.getElementById('backToTop');
  // Detect if we are on chronik page by presence of key section IDs
  const sectionIds = [
    '1905-1910','1911-1920','1921-1930','1931-1940','1941-1950','1951-1960',
    '1961-1970','1971-1980','1981-1990','1991-2000','2001-2009','aufschwung','ab-2020'
  ];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (sections.length === 0) return; // not on chronik

  // Collect all nav links/chips that point to these sections
  // Limit to sidebar TOC links to avoid catching unrelated anchors
  const toc = document.querySelector('aside nav');
  const eraLinks = toc ? Array.from(toc.querySelectorAll('a[href^="#"]')).filter(a => {
    const hash = a.getAttribute('href') || '';
    return sectionIds.some(id => hash === `#${id}`);
  }) : [];

  // Smooth scroll for those links
  eraLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without jumping
      history.pushState(null, '', hash);
    });
  });

  // Scrollspy to highlight active link
  const setActive = (hash) => {
    eraLinks.forEach(link => {
      const isActive = link.getAttribute('href') === hash;
      // Sidebar links styling without layout shifts
      if (isActive) {
        link.classList.add('text-black','font-semibold');
        link.classList.remove('text-gray-700');
        link.classList.add('border-black');
        link.classList.remove('border-transparent');
      } else {
        link.classList.remove('text-black','font-semibold');
        link.classList.add('text-gray-700');
        link.classList.remove('border-black');
        link.classList.add('border-transparent');
      }
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    // pick the most visible entry
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      const id = `#${visible.target.id}`;
      setActive(id);
    }
  }, {
    root: null,
    rootMargin: '0px 0px -60% 0px',
    threshold: [0.2, 0.5, 0.75]
  });
  sections.forEach(sec => observer.observe(sec));

  // Back to top button
  if (backToTop) {
    const onScroll = () => {
      if (window.scrollY > 400) backToTop.classList.remove('hidden');
      else backToTop.classList.add('hidden');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
