/*
 * File script.js (Versi Final: Create, Read, Update/Edit, Delete)
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. OTENTIKASI & PENGALIHAN (Simulasi Login)
    // ==========================================
    const username = localStorage.getItem('usernameTugasKu');
    if (!username) {
        window.location.href = 'login.html';
        return; 
    }

    // 2. SELEKTOR DOM (TAMBAHAN UNTUK EDIT)
    // ==========================================
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

    // Selectors untuk Modal Edit
    const formEditTugas = document.getElementById('form-edit-tugas');
    const editIndexInput = document.getElementById('edit-tugas-index');
    const editMatkulInput = document.getElementById('edit-matkul');
    const editNamaInput = document.getElementById('edit-nama-tugas');
    const editDeadlineInput = document.getElementById('edit-deadline');

    // Objek Modal dari Bootstrap (Wajib untuk mengontrol modal)
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));

    // 3. INISIALISASI HALAMAN
    // ==========================================
    navbarUsername.textContent = username;
    btnLogout.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('usernameTugasKu');
            window.location.href = 'login.html';
        }
    });

    formTugas.addEventListener('submit', tambahTugas);
    formEditTugas.addEventListener('submit', simpanEditTugas); // NEW: Listener untuk form edit
    
    // 4. FUNGSI UTAMA: RENDER TUGAS
    // ==========================================
    const renderTugas = () => {
        
        const tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];
        const tugasSelesai = JSON.parse(localStorage.getItem('tugasSelesai')) || [];

        listContainer.innerHTML = '';
        alertContainer.innerHTML = '';

        let countMerah = 0;
        let countKuning = 0;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        // --- UPDATE SUMMARY BOX ---
        summaryTotal.textContent = tugasAktif.length;
        summarySelesai.textContent = tugasSelesai.length;
        summaryMendesak.textContent = 0; // Reset
        
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
                countMerah++;
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

            // --- MEMBUAT HTML KARTU (dengan tombol Edit & Delete) ---
            const cardHTML = `
                <div class="col-md-4">
                    <div class="card shadow-lg ${statusKelas} ${customKelas} h-100 border-0">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge rounded-pill bg-primary-subtle text-primary-emphasis p-2">${tugas.matkul}</span>
                                <span class="badge rounded-pill bg-secondary text-white p-2">${teksStatus}</span>
                            </div>

                            <h5 class="card-title fw-bold">${tugas.nama}</h5>
                            <p class="card-text text-muted small mb-3">
                                <i class="bi bi-calendar-check-fill"></i> Deadline: ${tugas.deadline}
                            </p>
                            
                            <hr class="mt-auto mb-2 border-secondary-subtle"> 
                            
                            <div class="d-flex justify-content-between gap-2">
                                <div class="btn-group w-50" role="group">
                                    <button class="btn btn-sm btn-outline-primary btn-edit" data-index="${index}" title="Edit Tugas">
                                        <i class="bi bi-pencil-square"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger btn-delete" data-index="${index}" title="Hapus Permanen">
                                        <i class="bi bi-trash-fill"></i> Hapus
                                    </button>
                                </div>
                                
                                <button class="btn btn-sm btn-success w-50 btn-selesai" data-index="${index}" title="Tandai Selesai">
                                    <i class="bi bi-check-circle-fill"></i> Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            listContainer.innerHTML += cardHTML;
        });
        
        // --- UPDATE SUMMARY MENDESAK ---
        summaryMendesak.textContent = countMerah;

        // --- MEMBUAT KOTAK PERINGATAN DINAMIS ---
        if (countMerah > 0 || countKuning > 0) {
            let alertText = '';
            let alertClass = 'alert-warning'; 
            
            if (countMerah > 0) {
                alertText += `Anda punya <strong>${countMerah} tugas Mendesak</strong> (H-2 atau kurang!)`;
                alertClass = 'alert-danger';
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

        // --- EVENT LISTENER BARU ---
        document.querySelectorAll('.btn-selesai').forEach(button => {
            button.addEventListener('click', tandaiSelesai);
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', hapusTugasPermanen); // NEW: Delete Listener
        });
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', showEditModal); // NEW: Edit Listener
        });
    };

    // 5. FUNGSI: HAPUS TUGAS PERMANEN (NEW)
    // ==========================================
    function hapusTugasPermanen(event) {
        const indexTugas = event.target.getAttribute('data-index');

        if (!confirm('Apakah Anda yakin ingin MENGHAPUS PERMANEN tugas ini?')) {
            return;
        }

        let tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];

        // Hapus 1 tugas dari array di posisi 'indexTugas'
        tugasAktif.splice(indexTugas, 1);

        localStorage.setItem('daftarTugas', JSON.stringify(tugasAktif));

        renderTugas();
    };

    // 6. FUNGSI: TAMPILKAN MODAL EDIT (NEW)
    // ==========================================
    function showEditModal(event) {
        const indexTugas = event.target.getAttribute('data-index');
        const tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];
        const tugasYangDiedit = tugasAktif[indexTugas];

        // 1. Isi input tersembunyi dengan index tugas
        editIndexInput.value = indexTugas;

        // 2. Isi form modal dengan data tugas saat ini
        editMatkulInput.value = tugasYangDiedit.matkul;
        editNamaInput.value = tugasYangDiedit.nama;
        editDeadlineInput.value = tugasYangDiedit.deadline;

        // 3. Tampilkan modal
        editModal.show();
    }

    // 7. FUNGSI: SIMPAN EDIT TUGAS (NEW)
    // ==========================================
    function simpanEditTugas(event) {
        event.preventDefault();

        const indexYangDiedit = editIndexInput.value;
        const matkulBaru = editMatkulInput.value.trim();
        const namaBaru = editNamaInput.value.trim();
        const deadlineBaru = editDeadlineInput.value;

        if (!matkulBaru || !namaBaru || !deadlineBaru) {
            alert('Semua field harus diisi!');
            return;
        }

        let tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];

        // Update objek tugas pada index yang benar
        tugasAktif[indexYangDiedit] = {
            matkul: matkulBaru,
            nama: namaBaru,
            deadline: deadlineBaru
        };

        // Simpan kembali ke localStorage
        localStorage.setItem('daftarTugas', JSON.stringify(tugasAktif));

        // Tutup modal dan render ulang
        editModal.hide();
        renderTugas();
    }
    
    // 8. FUNGSI: TAMBAH TUGAS (Tetap Sama)
    // ==========================================
    function tambahTugas(event) {
        event.preventDefault(); 
        const matkul = inputMatkul.value.trim();
        const namaTugas = inputNama.value.trim();
        const deadlineTugas = inputDeadline.value;

        if (!matkul || !namaTugas || !deadlineTugas) {
            alert('Semua field tidak boleh kosong!');
            return;
        }

        const tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];
        
        tugasAktif.push({ 
            matkul: matkul, 
            nama: namaTugas, 
            deadline: deadlineTugas 
        });

        localStorage.setItem('daftarTugas', JSON.stringify(tugasAktif));

        formTugas.reset();

        // Menutup form collapse
        const collapseElement = document.getElementById('form-collapse-container');
        const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, {toggle: false});
        bsCollapse.hide();

        renderTugas();
    };

    // 9. FUNGSI: TANDAI SELESAI (Tetap Sama)
    // ==========================================
    function tandaiSelesai(event) {
        const indexTugas = event.target.getAttribute('data-index');

        let tugasAktif = JSON.parse(localStorage.getItem('daftarTugas')) || [];
        let tugasSelesai = JSON.parse(localStorage.getItem('tugasSelesai')) || [];

        const tugasYangSelesai = tugasAktif.splice(indexTugas, 1)[0]; 

        tugasSelesai.push(tugasYangSelesai);

        localStorage.setItem('daftarTugas', JSON.stringify(tugasAktif));
        localStorage.setItem('tugasSelesai', JSON.stringify(tugasSelesai));

        renderTugas();
    };

    // 10. INISIALISASI AWAL
    // ==========================================
    renderTugas();
});