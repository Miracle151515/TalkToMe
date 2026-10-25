document.addEventListener('DOMContentLoaded', () => {
  // 1. Membuka dan menutup menu navigasi pada layar kecil
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? '✕' : '☰';
    });
  }

  // 2. Inisialisasi Supabase (Cukup dideklarasikan sekali di sini)
  const PROJECT_ID = 'yomthfsirmdzijczxczu'; 
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbXRoZnNpcm1kemlqY3p4Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MzEwNDYsImV4cCI6MjEwODQwNzA0Nn0.3n9OdAJZEEY_C9o62liBh2l5SrRESTJxalonZuMBmOI'; 
  const SUPABASE_URL = `https://${PROJECT_ID}.supabase.co`;
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 3. Mengirim data form ke Supabase Database
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formNote = document.querySelector('#formNote');

      // Validasi bawaan HTML
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        if (formNote) formNote.textContent = 'Periksa kembali kolom yang belum diisi atau belum sesuai.';
        return;
      }

      // Ambil isian dari input form
      const nameInput = document.querySelector('#name')?.value;
      const emailInput = document.querySelector('#email')?.value;
      const messageInput = document.querySelector('#message')?.value;

      if (formNote) {
        formNote.textContent = 'Sedang mengirim pesan...';
        formNote.style.color = '#007F88';
      }

      // Kirim data ke tabel "Messages" di Supabase
      const { error } = await supabase
        .from('Messages')
        .insert([
          { 
            name: nameInput, 
            email: emailInput, 
            message: messageInput 
          }
        ]);

      if (error) {
        console.error('Error Supabase:', error.message);
        if (formNote) {
          formNote.textContent = 'Gagal mengirim pesan: ' + error.message;
          formNote.style.color = 'red';
        }
      } else {
        // Jika sukses, pindah ke halaman berhasil.html
        window.location.href = 'berhasil.html';
      }
    });
  }
});