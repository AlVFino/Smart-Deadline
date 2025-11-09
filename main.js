/*
 * File script.js (Versi Upgrade)
 * Logika untuk halaman utama (index.html)
 */

// Menunggu sampai seluruh halaman HTML dimuat
document.addEventListener('DOMContentLoaded', () => {

    // 1. OTENTIKASI (Simulasi Login)
    // ==================
    const username = localStorage.getItem('usernameTugasKu');

    if (!username) {
        // Jika tidak ada username di localStorage, tendang ke halaman login
        alert('Anda harus login terlebih dahulu!');
        window.location.href = 'login.html';
        return; // Hentikan eksekusi sisa script
    }

    // 2. SELEKTOR DOM
    // ==================
    const navbarUsername = document.getElementById('navbar-username');
    const btnLogout = document.getElementById('btn-logout');
    
    const formTugas = document.getElementById('form-tugas');
    const inputMatkul = document.getElementById('input-matkul');
    const inputNama = document.getElementById('input-nama-tugas');
    const inputDeadline = document.getElementById('input-deadline');
    
    const listContainer = document.getElementById('list-tugas-container');
    const alertContainer = document.getElementById('alert-container');
    
    const summaryTotal = document.getElementById('summary-total');
    const summaryMendesak = document.getElementById('summary-mendesak');
    const summarySelesai = document.getElementById('summary-selesai');

    // 3. INISIALISASI HALAMAN
    // ==================
    // Set nama pengguna di Navbar
    navbarUsername.textContent = username;

    // Tambahkan event listener untuk tombol Logout
    btnLogout.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Hapus data login dari localStorage
            localStorage.removeItem('usernameTugasKu');
            // Arahkan kembali ke halaman login
            window.location.href = 'login.html';
        }
    });

    // Tambahkan event listener untuk form submit
    formTugas.addEventListener('submit', tambahTugas);
    
    // 4. FUNGSI UTAMA: RENDER TUGAS
    // ==================
    const renderTugas = () => {
        
        // --- AMBIL DATA ---
        // Kita sekarang punya DUA "database": tugas aktif dan tugas selesai
        const tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];
        const tugasSelesai = JSON.parse(localStorage.getItem('tugasSelesai')) || [];

        // Kosongkan container
        listContainer.innerHTML = '';
        alertContainer.innerHTML = '';

        // --- SIAPKAN COUNTER ---
        let countMerah = 0;
        let countKuning = 0;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        // --- UPDATE SUMMARY BOX ---
        summaryTotal.textContent = tugasAktif.length;
        summarySelesai.textContent = tugasSelesai.length;
        
        if (tugasAktif.length === 0) {
            listContainer.innerHTML = '<p class="text-muted">Belum ada tugas aktif. Selamat!</p>';
        }

        // --- LOOPING TUGAS AKTIF ---
        tugasAktif.forEach((tugas, index) => {
            
            const deadlineDate = new Date(tugas.deadline + 'T00:00:00');
            const diffTime = deadlineDate.getTime() - today.getTime();
            const sisaHari = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            let statusKelas = 'bg-light'; 
            let customKelas = ''; 
            let teksStatus = `Sisa Waktu: ${sisaHari} Hari`;

            if (sisaHari < 0) {
                statusKelas = 'bg-dark text-white'; 
                teksStatus = `SUDAH LEWAT ${Math.abs(sisaHari)} HARI!`;
                countMerah++; // Lewat deadline dihitung mendesak
            } else if (sisaHari <= 2) {
                statusKelas = 'bg-danger-subtle'; 
                customKelas = 'kartu-merah-berkedip'; 
                teksStatus = `Sisa Waktu: ${sisaHari} Hari Lagi! (SEGERA!)`;
                countMerah++;
            } else if (sisaHari <= 5) {
                statusKelas = 'bg-warning-subtle'; 
                teksStatus = `Sisa Waktu: ${sisaHari} Hari Lagi`;
                countKuning++;
            }

            // --- MEMBUAT HTML KARTU (dengan data Matkul) ---
            const cardHTML = `
                <div class="col-md-4">
                    <div class="card shadow-sm ${statusKelas} ${customKelas} h-100">
                        <div class="card-body d-flex flex-column">
                            <span class="badge bg-primary-subtle text-primary-emphasis mb-2 align-self-start">${tugas.matkul}</span>
                            <h5 class="card-title">${tugas.nama}</h5>
                            <p class="card-text mb-2">
                                Deadline: ${tugas.deadline}
                            </p>
                            <h6 class="card-subtitle mb-3">${teksStatus}</h6>
                            
                            <button class="btn btn-sm btn-success mt-auto btn-selesai" data-index="${index}">
                                Tandai Selesai
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            listContainer.innerHTML += cardHTML;
        });
        
        // --- UPDATE SUMMARY MENDESAK (Merah) ---
        summaryMendesak.textContent = countMerah;

        // --- MEMBUAT KOTAK PERINGATAN DINAMIS ---
        if (countMerah > 0 || countKuning > 0) {
            let alertText = '';
            let alertClass = 'alert-warning'; // Default kuning
            
            if (countMerah > 0) {
                alertText += `Anda punya <strong>${countMerah} tugas Mendesak</strong> (H-2 atau kurang!)`;
                alertClass = 'alert-danger'; // Prioritaskan merah
            }
            if (countKuning > 0) {
                alertText += (countMerah > 0 ? ' dan ' : 'Anda punya ') + `<strong>${countKuning} tugas</strong> akan deadline dalam 5 hari.`;
            }
            
            alertContainer.innerHTML = `
                <div class="alert ${alertClass}" role="alert">
                    <strong>PERHATIAN!</strong> ${alertText}
                </div>
            `;
        }

        // --- EVENT LISTENER UNTUK TOMBOL "SELESAI" ---
        document.querySelectorAll('.btn-selesai').forEach(button => {
            button.addEventListener('click', tandaiSelesai);
        });
    };

    // 5. FUNGSI: TAMBAH TUGAS (Versi Upgrade)
    // ==================
    function tambahTugas(event) {
        event.preventDefault(); 

        // Ambil nilai dari 3 input baru
        const matkul = inputMatkul.value.trim();
        const namaTugas = inputNama.value.trim();
        const deadlineTugas = inputDeadline.value;

        if (!matkul || !namaTugas || !deadlineTugas) {
            alert('Semua field tidak boleh kosong!');
            return;
        }

        const tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];
        
        // Simpan sebagai objek yang lebih lengkap
        tugasAktif.push({ 
            matkul: matkul, 
            nama: namaTugas, 
            deadline: deadlineTugas 
        });

        localStorage.setItem('daftarTugas', JSON.stringify(tugasAktif));

        formTugas.reset();

        // Menutup kembali form collapse (jika Anda menggunakan Bootstrap JS)
        const collapseElement = document.getElementById('form-collapse-container');
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: false // Jangan di-toggle, hanya sembunyikan
        });
        bsCollapse.hide();

        renderTugas();
    };

    // 6. FUNGSI: TANDAI SELESAI (Logika Baru)
    // ==================
    // Bukan lagi menghapus, tapi MEMINDAHKAN data
    function tandaiSelesai(event) {
        const indexTugas = event.target.getAttribute('data-index');

        let tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];
        let tugasSelesai = JSON.parse(localStorage.getItem('tugasSelesai')) || [];

        // Ambil tugas yang akan dipindah
        // 'splice' akan mengambil elemen DAN menghapusnya dari array 'tugasAktif'
        const tugasYangSelesai = tugasAktif.splice(indexTugas, 1)[0]; 

        // Tambahkan tugas tersebut ke array 'tugasSelesai'
        tugasSelesai.push(tugasYangSelesai);

        // Simpan KEDUA array yang sudah di-update ke localStorage
        localStorage.setItem('daftarTugas', JSON.stringify(tugasAktif));
        localStorage.setItem('tugasSelesai', JSON.stringify(tugasSelesai));

        renderTugas();
    };

    // 7. INISIALISASI AWAL
    // ==================
    // Render semua tugas saat halaman pertama kali dimuat
    renderTugas();
});