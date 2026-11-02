/* TalkToMe — shared behaviour for the static site. */
(() => {
  'use strict';

  // The live Supabase project currently exposes this table. Change this one
  // constant if the project is migrated to the documented `contact` table.
  const CONTACT_TABLE = 'Messages';

  // Supabase anon keys are public by design in browser applications.
  // Never place a service_role key in this file or anywhere in the repository.
  const SUPABASE_URL = 'https://yomthfsirmdzijczxczu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbXRoZnNpcm1kemlqY3p4Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MzEwNDYsImV4cCI6MjEwODQwNzA0Nn0.3n9OdAJZEEY_C9o62liBh2l5SrRESTJxalonZuMBmOI';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Keep the footer current without requiring a build step.
  const yearElement = $('#year');
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  /* -----------------------------------------------------------------------
     Mobile navigation
     ----------------------------------------------------------------------- */

  const menuToggle = $('.menu-toggle');
  const siteNav = $('#primary-navigation');
  const siteHeader = $('.site-header');

  const setMenuState = (open) => {
    if (!menuToggle || !siteNav) return;

    siteNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    if (!menuToggle || !siteNav) return;

    const wasOpen = siteNav.classList.contains('is-open');
    setMenuState(false);

    if (wasOpen && returnFocus) {
      menuToggle.focus();
    }
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      setMenuState(!siteNav.classList.contains('is-open'));
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu({ returnFocus: true });
      }
    });

    document.addEventListener('click', (event) => {
      if (siteNav.classList.contains('is-open') && siteHeader && !siteHeader.contains(event.target)) {
        closeMenu();
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 781px)');
    const closeAtDesktop = (event) => {
      if (event.matches) closeMenu();
    };

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', closeAtDesktop);
    } else {
      desktopQuery.addListener(closeAtDesktop);
    }
  }

  /* -----------------------------------------------------------------------
     Contact form
     ----------------------------------------------------------------------- */

  const createSupabaseClient = () => {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('Supabase SDK belum tersedia; formulir tidak dapat mengirim pesan.');
      return null;
    }

    try {
      return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
    } catch (error) {
      console.error('Gagal menginisialisasi Supabase:', error);
      return null;
    }
  };

  const contactForm = $('#contactForm');

  if (contactForm) {
    const selectedPartnerBox = $('#selectedPartner');
    const selectedPartnerName = $('#selectedPartnerName');
    const messageField = $('#message');
    const submitButton = $('#submitButton');
    const submitLabel = submitButton ? $('.btn__label', submitButton) : null;
    const formNote = $('#formNote');
    const supabaseClient = createSupabaseClient();

    let isSubmitting = false;

    // Prefill a partner selected on partner.html without overwriting user input.
    const rawPartner = new URLSearchParams(window.location.search).get('partner') || '';
    const partner = rawPartner
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);

    if (partner && selectedPartnerBox && selectedPartnerName && messageField) {
      selectedPartnerName.textContent = partner;
      selectedPartnerBox.hidden = false;

      if (!messageField.value.trim()) {
        messageField.value = `Saya ingin menghubungi ${partner}.\n\n`;
      }
    }

    const fields = [
      {
        input: $('#name'),
        error: $('#nameError'),
        validate: (value) => (value.length >= 2 ? '' : 'Nama minimal 2 karakter.'),
      },
      {
        input: $('#email'),
        error: $('#emailError'),
        validate: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? '' : 'Masukkan alamat email yang valid.'),
      },
      {
        input: $('#message'),
        error: $('#messageError'),
        validate: (value) => (value.length >= 5 ? '' : 'Pesan minimal 5 karakter.'),
      },
    ].filter((field) => field.input && field.error);

    // Custom errors replace the browser's default messages when JS is available.
    contactForm.noValidate = true;

    const setStatus = (message, state = '') => {
      if (!formNote) return;

      formNote.textContent = message;
      formNote.classList.remove('form-status--loading', 'form-status--error', 'form-status--success');

      if (state) {
        formNote.classList.add(`form-status--${state}`);
      }
    };

    const setFieldError = (field, message) => {
      field.error.textContent = message;
      field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
      field.input.closest('.field')?.classList.toggle('has-error', Boolean(message));
    };

    const validateField = (field) => {
      const message = field.validate(field.input.value.trim());
      setFieldError(field, message);
      return !message;
    };

    const setLoading = (loading) => {
      if (!submitButton) return;

      submitButton.disabled = loading;
      submitButton.classList.toggle('is-loading', loading);
      submitButton.setAttribute('aria-busy', String(loading));

      if (submitLabel) {
        submitLabel.textContent = loading ? 'Mengirim...' : 'Kirim Pesan';
      }
    };

    fields.forEach((field) => {
      field.input.addEventListener('blur', () => {
        if (field.input.value.trim()) validateField(field);
      });

      field.input.addEventListener('input', () => {
        if (field.input.getAttribute('aria-invalid') === 'true' && !field.validate(field.input.value.trim())) {
          setFieldError(field, '');
        }
      });
    });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (isSubmitting) return;

      const invalidFields = fields.filter((field) => !validateField(field));

      if (invalidFields.length) {
        setStatus('Periksa kembali kolom yang belum sesuai.', 'error');
        invalidFields[0].input.focus();
        return;
      }

      if (!supabaseClient) {
        setStatus('Layanan pesan sedang tidak tersedia. Silakan coba lagi nanti.', 'error');
        return;
      }

      const name = $('#name')?.value.trim() || '';
      const email = $('#email')?.value.trim() || '';
      const message = $('#message')?.value.trim() || '';

      isSubmitting = true;
      setLoading(true);
      setStatus('Sedang mengirim pesan...', 'loading');

      try {
        const { error } = await supabaseClient
          .from(CONTACT_TABLE)
          .insert([{ name, email, message }]);

        if (error) throw error;

        setStatus('Pesan berhasil dikirim. Mengalihkan...', 'success');
        window.location.assign('berhasil.html');

        // Safety net if navigation is unexpectedly blocked.
        window.setTimeout(() => {
          isSubmitting = false;
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Gagal mengirim pesan ke Supabase:', error);
        setStatus('Pesan belum terkirim. Silakan periksa koneksi dan coba lagi.', 'error');
        isSubmitting = false;
        setLoading(false);
      }
    });
  }
})();
