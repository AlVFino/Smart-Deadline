/*
 * File login.js
 * Logika untuk halaman login simulasi.
 */
        // Menambahkan partikel animasi
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Posisi acak
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.top = Math.random() * 100 + 'vh';
                
                // Ukuran acak
                const size = Math.random() * 3 + 1;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Animasi dengan durasi acak
                const duration = Math.random() * 10 + 5;
                particle.style.animationDuration = duration + 's';
                particle.style.animationDelay = Math.random() * 5 + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

                // Menambahkan sedikit interaksi untuk meningkatkan UX
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('form-login');
            const inputNama = document.getElementById('input-nama');
            
            // Buat partikel
            createParticles();
            
            // Fokus pada input nama saat halaman dimuat
            setTimeout(() => {
                inputNama.focus();
            }, 800);
        });
        
        
        // Tambahkan animasi shake untuk CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    
    const formLogin = document.getElementById('form-login');
    const inputNama = document.getElementById('input-nama');

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah form refresh halaman
        
        const namaPengguna = inputNama.value.trim();

        if (namaPengguna) {
            // Simpan nama pengguna ke localStorage
            localStorage.setItem('usernameTugasKu', namaPengguna);
            
            // Arahkan pengguna ke halaman utama
            window.location.href = 'index.html';
        } else {
            alert('Nama tidak boleh kosong!');
        }
    });
});

