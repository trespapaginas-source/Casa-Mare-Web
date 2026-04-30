// Lógica para revelar elementos al hacer scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
});

function initApp() {
  // Observar todos los elementos con la clase .reveal
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Lógica del acordeón FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  // Lógica de navbar al hacer scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Lógica de "Ver más" para amenidades
  const btnVerMasAmenidades = document.getElementById('btn-ver-mas-amenidades');
  const btnAmenidadesContainer = document.getElementById('btn-amenities-container');
  if (btnVerMasAmenidades && btnAmenidadesContainer) {
    btnVerMasAmenidades.addEventListener('click', () => {
      document.querySelectorAll('.amenity-hidden').forEach(el => {
        el.classList.remove('amenity-hidden');
      });
      // Ocultar el botón después de desplegar
      btnAmenidadesContainer.style.display = 'none';
    });
  }

  // Lógica del Tour 360 Overlay
  const tourOverlay = document.getElementById('tour-overlay');
  if (tourOverlay) {
    tourOverlay.addEventListener('click', () => {
      tourOverlay.classList.add('hidden');
    });
  }

  // Validación estricta del formulario para habilitar el botón
  const nameInput = document.getElementById('res-name');
  const phoneInput = document.getElementById('res-phone');
  const datesInput = document.getElementById('res-dates');
  const submitBtn = document.getElementById('btn-whatsapp');

  function validateForm() {
    if (!nameInput || !phoneInput || !datesInput || !submitBtn) return;

    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const datesVal = datesInput.value.trim();
    
    // Regla estricta: El nombre debe tener ms de 2 caracteres y no contener números
    const hasNumbers = /\d/.test(nameVal);
    const validName = nameVal.length > 2 && !hasNumbers;
    
    // Regla estricta: El celular debe tener al menos 7 dígitos
    const validPhone = phoneVal.replace(/\D/g, '').length >= 7;

    // Regla estricta: Las fechas deben tener algo de contenido significativo (ej. "12 oct")
    const validDates = datesVal.length > 4;

    const isValid = validName && validPhone && validDates;

    if (isValid) {
      submitBtn.classList.remove('btn-disabled');
      submitBtn.removeAttribute('disabled');
    } else {
      submitBtn.classList.add('btn-disabled');
      submitBtn.setAttribute('disabled', 'true');
    }
  }

  // Escuchar eventos de entrada
  if (nameInput && phoneInput && datesInput) {
    nameInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);
    datesInput.addEventListener('input', validateForm);
  }

  // Acción del botón (simulada)
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!submitBtn.hasAttribute('disabled')) {
        const text = encodeURIComponent(`Hola, me interesa reservar Casa Mare.\nNombre: ${nameInput.value}\nCelular: ${phoneInput.value}\nFechas: ${datesInput.value}`);
        window.open(`https://api.whatsapp.com/send/?phone=573015425909&text=${text}`, '_blank');
      }
    });
  }

  // Lógica interactiva del menú móvil
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navbarEl = document.getElementById('navbar');
  
  if (menuToggle && mobileMenu) {
    const toggleMenu = () => {
      const isActive = mobileMenu.classList.contains('is-active');
      if (isActive) {
        mobileMenu.classList.remove('is-active');
        if (navbarEl) navbarEl.classList.remove('menu-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('is-active');
        if (navbarEl) navbarEl.classList.add('menu-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        document.body.style.overflow = 'hidden';
      }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('is-active')) {
          toggleMenu();
        }
      });
    });
  }

  // Lógica interactiva de Hero Gallery (Lightbox)
  const heroThumbs = document.querySelectorAll('.thumb-item');
  const thumbTrack = document.querySelector('.thumb-track');
  const lightbox = document.getElementById('lightbox');
  
  if (thumbTrack && heroThumbs.length) {
    let isPaused = false;
    
    const slideTrack = () => {
      if (isPaused || window.innerWidth < 1024) return;
      
      const first = thumbTrack.firstElementChild;
      if (!first) return;
      
      const itemWidth = first.offsetWidth;
      const gap = window.innerWidth >= 1024 ? 16 : 10;
      
      thumbTrack.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      thumbTrack.style.transform = `translateX(-${itemWidth + gap}px)`;
      
      setTimeout(() => {
        if (!thumbTrack) return;
        thumbTrack.style.transition = 'none';
        thumbTrack.appendChild(first);
        thumbTrack.style.transform = 'translateX(0)';
      }, 400);
    };

    setInterval(slideTrack, 3000);

    const pauseScroll = () => {
      isPaused = true;
      setTimeout(() => { isPaused = false; }, 3000);
    };

    thumbTrack.addEventListener('mouseenter', () => isPaused = true);
    thumbTrack.addEventListener('mouseleave', () => isPaused = false);
    thumbTrack.addEventListener('touchstart', pauseScroll, { passive: true });
    
    if (lightbox) {
      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const lightboxClose = lightbox.querySelector('.lightbox-close');

      if (lightboxImg && lightboxClose) {
        thumbTrack.addEventListener('click', (e) => {
          const btn = e.target.closest('.thumb-item');
          if (btn) {
            pauseScroll();
            const img = btn.querySelector('img');
            if (img) {
              lightboxImg.src = img.src;
              lightbox.classList.add('is-open');
              lightbox.setAttribute('aria-hidden', 'false');
              document.body.style.overflow = 'hidden'; 
            }
          }
        });

        const closeLightbox = () => {
          lightbox.classList.remove('is-open');
          lightbox.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = ''; 
          setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) {
            closeLightbox();
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
          }
        });
      }
    }
  }

  // Hero Mobile Carousel Logic
  const heroTrack = document.getElementById('hero-carousel-track');
  const heroDots = document.querySelectorAll('.carousel-dot');
  if (heroTrack && heroDots.length > 0) {
    let currentSlide = 0;
    const slideCount = heroDots.length;
    let autoPlayInterval;

    const updateDots = (index) => {
      heroDots.forEach(dot => dot.classList.remove('active'));
      if(heroDots[index]) heroDots[index].classList.add('active');
    };

    const goToSlide = (index) => {
      currentSlide = index;
      const slideWidth = heroTrack.clientWidth;
      heroTrack.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      updateDots(index);
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slideCount;
      goToSlide(currentSlide);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, 7000);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };

    // Update active dot on manual scroll
    heroTrack.addEventListener('scroll', () => {
      const scrollLeft = heroTrack.scrollLeft;
      const slideWidth = heroTrack.clientWidth;
      const index = Math.round(scrollLeft / slideWidth);
      if (index !== currentSlide) {
        currentSlide = index;
        updateDots(index);
      }
    }, { passive: true });

    // Stop autoplay when user interacts
    heroTrack.addEventListener('touchstart', stopAutoPlay, { passive: true });
    heroTrack.addEventListener('touchend', startAutoPlay, { passive: true });

    heroDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        startAutoPlay(); // reset timer
      });
    });

    startAutoPlay();
  }

  // ==========================================
  // CONFIGURACIÓN DE DISPONIBILIDAD (iCal)
  // ==========================================
  // Pega aquí los enlaces .ics de tus plataformas. Si pegas más de uno, 
  // el sistema fusionará todas las disponibilidades automáticamente.
  const ICAL_URLS = [
    'https://www.airbnb.com/calendar/ical/1593897700117279414.ics?t=c48fc528d489416088de1cd8728b3c9f&locale=es-419',
    'https://www.airbnb.com/calendar/ical/1555894149196662461.ics?t=c4bdc68c2041484897a021c05f859b0c&locale=es-419',
    'https://www.vrbo.com/icalendar/b44eee6b01da4a3da9ec933c2cc28db2.ics'
  ];

  // Set global para almacenar todas las fechas bloqueadas
  // Inicialización instantánea desde caché (0.01s load)
  const CACHE_KEY = 'casa_mare_cache_fechas';
  let cachedFechas = [];
  try {
    cachedFechas = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
  } catch(e) {
    cachedFechas = [];
  }
  const syncBlockedDates = new Set(cachedFechas);
  
  // Lista de funciones de renderizado de los calendarios para actualizarlos tras el fetch
  const calendarRenderFns = [];

  // Función para sincronizar iCal en segundo plano
  async function fetchICalData() {
    if (ICAL_URLS.length === 0) return;
    
    // Almacenamos temporalmente los nuevos timestamps para comparar
    const newBlockedDates = new Set();
    
    try {
      for (const url of ICAL_URLS) {
        // Usamos tu propio Cloudflare Worker Privado para saltar la restricción CORS
        const response = await fetch(`https://polished-morning-d8aecalendario-casamare.trespa-paginas.workers.dev/?url=${encodeURIComponent(url)}`);
        if (!response.ok) continue;
        const data = await response.text();
        
        // Destruir bloques VTIMEZONE para evitar interferencias
        const dataSinTimezone = data.replace(/BEGIN:VTIMEZONE[\s\S]*?END:VTIMEZONE/g, "");

        // Parsear estrictamente eventos VEVENT
        const events = dataSinTimezone.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
        
        events.forEach(event => {
          const startMatch = event.match(/DTSTART(?:;.*?)?:(\d{8})/);
          const endMatch = event.match(/DTEND(?:;.*?)?:(\d{8})/);
          
          if (startMatch && endMatch) {
            const startYear = parseInt(startMatch[1].substring(0,4));
            const startMonth = parseInt(startMatch[1].substring(4,6)) - 1;
            const startDay = parseInt(startMatch[1].substring(6,8));
            
            const endYear = parseInt(endMatch[1].substring(0,4));
            const endMonth = parseInt(endMatch[1].substring(4,6)) - 1;
            const endDay = parseInt(endMatch[1].substring(6,8));
            
            const startDate = new Date(startYear, startMonth, startDay);
            const endDate = new Date(endYear, endMonth, endDay);
            
            // Marcar todos los días del rango como bloqueados
            for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
              newBlockedDates.add(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime());
            }
          }
        });
      }
      
      // Comparamos el caché con los datos nuevos para ver si hubo cambios (mutación)
      const newCacheStr = JSON.stringify(Array.from(newBlockedDates).sort());
      const oldCacheStr = JSON.stringify(Array.from(syncBlockedDates).sort());
      
      if (newCacheStr !== oldCacheStr) {
        // Actualizamos la variable en RAM
        syncBlockedDates.clear();
        newBlockedDates.forEach(t => syncBlockedDates.add(t));
        
        // Actualizamos localStorage
        localStorage.setItem(CACHE_KEY, newCacheStr);
        
        // Re-renderizar todos los calendarios con las nuevas fechas
        calendarRenderFns.forEach(fn => fn());
      }
      
    } catch (error) {
      console.error("Error crítico sincronizando calendarios iCal:", error);
    }
  }

  // Lanzar la sincronización asíncrona
  fetchICalData();

  // --- Lógica del Calendario Vanilla JS ---
  function initCalendar(rootId, inputId, btnCotizarId) {
    const calRoot = document.getElementById(rootId);
    if (!calRoot) return;

    let currentDate = new Date();
    currentDate.setDate(1); // Set to first day of month
    
    let selectionStart = null;
    let selectionEnd = null;
    let hoverDate = null;

    const btnCotizar = btnCotizarId ? document.getElementById(btnCotizarId) : null;
    const targetInput = inputId ? document.getElementById(inputId) : null;

    const updateButtonState = () => {
      if (btnCotizar) {
        if (selectionStart && selectionEnd) {
          btnCotizar.textContent = 'Solicitar Reserva';
          btnCotizar.style.pointerEvents = 'auto';
          btnCotizar.style.opacity = '1';
          btnCotizar.classList.remove('btn-disabled');
        } else {
          btnCotizar.textContent = 'Selecciona tus fechas';
          btnCotizar.style.pointerEvents = 'none';
          btnCotizar.style.opacity = '0.4';
          btnCotizar.classList.add('btn-disabled');
        }
      }
      
      if (targetInput) {
        if (selectionStart && selectionEnd) {
           const format = (d) => `${d.getDate()} ${monthNames[d.getMonth()].substring(0,3)}`;
           targetInput.value = `${format(selectionStart)} - ${format(selectionEnd)}`;
           // Trigger input event to fire validation
           targetInput.dispatchEvent(new Event('input'));
           // Close popup if inside one
           const popup = targetInput.parentNode.querySelector('.calendar-popup-container');
           if (popup) {
             popup.classList.remove('open');
             setTimeout(() => popup.style.display = 'none', 300);
           }
        } else if (selectionStart) {
           const format = (d) => `${d.getDate()} ${monthNames[d.getMonth()].substring(0,3)}`;
           targetInput.value = `${format(selectionStart)} - ...`;
           targetInput.dispatchEvent(new Event('input'));
        } else {
           targetInput.value = '';
           targetInput.dispatchEvent(new Event('input'));
        }
      }
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

    const updateCalendarSelection = () => {
      const days = calRoot.querySelectorAll('.calendar-day:not(.empty)');
      days.forEach(dayEl => {
        const cellDate = new Date(Number(dayEl.dataset.timestamp));
        
        // Preserve essential classes
        const isPast = dayEl.classList.contains('past');
        const isBlocked = dayEl.classList.contains('blocked');
        const isToday = dayEl.classList.contains('today');
        
        // Reset classes
        dayEl.className = 'calendar-day';
        if (isPast) dayEl.classList.add('past');
        if (isBlocked) dayEl.classList.add('blocked');
        if (isToday) dayEl.classList.add('today');
        
        // Apply visual classes for selection
        if (selectionStart && cellDate.getTime() === selectionStart.getTime()) {
          dayEl.classList.add('selected', 'range-start');
        }
        if (selectionEnd && cellDate.getTime() === selectionEnd.getTime()) {
          dayEl.classList.add('selected', 'range-end');
        }
        if (selectionStart && selectionEnd) {
          if (cellDate.getTime() > selectionStart.getTime() && cellDate.getTime() < selectionEnd.getTime()) {
            dayEl.classList.add('in-range');
          }
        } else if (selectionStart && !selectionEnd && hoverDate) {
          if (cellDate.getTime() > selectionStart.getTime() && cellDate.getTime() <= hoverDate.getTime()) {
            dayEl.classList.add('in-range');
            if (cellDate.getTime() === hoverDate.getTime()) dayEl.classList.add('range-end');
          }
        }
      });
    };

    const renderCalendar = () => {
      calRoot.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-calendar';

      // Header
      const header = document.createElement('div');
      header.className = 'calendar-header';
      
      const prevBtn = document.createElement('button');
      prevBtn.className = 'calendar-nav';
      prevBtn.type = 'button';
      prevBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg>';
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });

      const nextBtn = document.createElement('button');
      nextBtn.className = 'calendar-nav';
      nextBtn.type = 'button';
      nextBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>';
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });

      const title = document.createElement('h3');
      title.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

      header.appendChild(prevBtn);
      header.appendChild(title);
      header.appendChild(nextBtn);
      wrapper.appendChild(header);

      // Grid Header (Days)
      const gridHeader = document.createElement('div');
      gridHeader.className = 'calendar-grid-header';
      dayNames.forEach(day => {
        const d = document.createElement('div');
        d.textContent = day;
        gridHeader.appendChild(d);
      });
      wrapper.appendChild(gridHeader);

      // Grid (Dates)
      const grid = document.createElement('div');
      grid.className = 'calendar-grid';

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();

      // Empty slot for padding
      for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        grid.appendChild(emptyCell);
      }

      // Dates
      const today = new Date();
      today.setHours(0,0,0,0);

      // Simulator: si no hay iCals configurados, simulamos un par de fechas bloqueadas
      if (ICAL_URLS.length === 0 && syncBlockedDates.size === 0) {
        syncBlockedDates.add(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).getTime());
        syncBlockedDates.add(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6).getTime());
        syncBlockedDates.add(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12).getTime());
      }

      // Helper function inside render to attach events
      const attachDayEvents = (dayEl, currentCellDate) => {
        // Current day
        if (currentCellDate.getTime() === today.getTime()) {
          dayEl.classList.add('today');
          dayEl.title = 'Día actual';
        }

        // Past dates
        if (currentCellDate.getTime() < today.getTime()) {
          dayEl.classList.add('past');
          dayEl.title = 'Fecha pasada';
          return;
        }

        // Blocked dates
        if (syncBlockedDates.has(currentCellDate.getTime())) {
          dayEl.classList.add('blocked');
          dayEl.title = 'Fecha reservada';
          return;
        }

        dayEl.addEventListener('click', (e) => {
          e.preventDefault();
          if (!selectionStart || (selectionStart && selectionEnd)) {
            selectionStart = currentCellDate;
            selectionEnd = null;
          } else if (selectionStart && !selectionEnd) {
            if (currentCellDate.getTime() < selectionStart.getTime()) {
              selectionStart = currentCellDate;
            } else if (currentCellDate.getTime() === selectionStart.getTime()) {
              selectionStart = null;
            } else {
              selectionEnd = currentCellDate;
            }
          }
          updateButtonState();
          updateCalendarSelection();
        });

        // Hover handling
        dayEl.addEventListener('mouseenter', () => {
          if (selectionStart && !selectionEnd && currentCellDate.getTime() > selectionStart.getTime()) {
            if (!hoverDate || hoverDate.getTime() !== currentCellDate.getTime()) {
              hoverDate = currentCellDate;
              updateCalendarSelection();
            }
          }
        });
      };

      for (let i = 1; i <= lastDay; i++) {
        const cellDate = new Date(year, month, i);
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = i;
        dayEl.dataset.timestamp = cellDate.getTime();

        attachDayEvents(dayEl, cellDate);
        grid.appendChild(dayEl);
      }

      wrapper.appendChild(grid);

      // Handle leaving the grid while resolving range hover
      grid.addEventListener('mouseleave', () => {
        if (selectionStart && !selectionEnd) {
          hoverDate = null;
          updateCalendarSelection();
        }
      });

      calRoot.appendChild(wrapper);
      // Run once immediately to restore state if navigating months
      updateCalendarSelection();
      
      // Register this render function globally for iCal re-rendering
      if (!calendarRenderFns.includes(renderCalendar)) {
        calendarRenderFns.push(renderCalendar);
      }
    };

    renderCalendar();
  }

  // Initialize both calendars
  initCalendar('custom-calendar-root', null, 'btn-cotizar');
  initCalendar('custom-calendar-cta', 'res-dates', null);

  // Popup toggle logic for CTA calendar
  const resDatesInput = document.getElementById('res-dates');
  const calendarPopup = document.getElementById('calendar-popup');
  
  if (resDatesInput && calendarPopup) {
    resDatesInput.addEventListener('click', () => {
      if (calendarPopup.style.display === 'none') {
        calendarPopup.style.display = 'block';
        // Allow tiny delay to trigger CSS animation
        setTimeout(() => calendarPopup.classList.add('open'), 10);
      } else {
        calendarPopup.classList.remove('open');
        setTimeout(() => calendarPopup.style.display = 'none', 300);
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!resDatesInput.contains(e.target) && !calendarPopup.contains(e.target) && calendarPopup.classList.contains('open')) {
        calendarPopup.classList.remove('open');
        setTimeout(() => calendarPopup.style.display = 'none', 300);
      }
    });
  }

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
