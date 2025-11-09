/*
 * File login.js
 * Logika untuk halaman login simulasi.
 */
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