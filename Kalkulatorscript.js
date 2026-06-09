const stickyNavbar = document.getElementById('navbar');
const weightInput = document.getElementById('weight-input');
const resultBox = document.getElementById('result-box');
const targetOutputText = document.getElementById('target-output-text');
const timelineEngine = document.getElementById('timeline-engine');

// 1. STICKY SCROLL DETECTOR FOR NAVBAR
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        stickyNavbar.classList.add('scrolled');
    } else {
        stickyNavbar.classList.remove('scrolled');
    }
});

// Template Master Jadwal
const masterScheduleTemplates = [
    { time: "07:00 WIB", label: "Gelas pertama setelah bangun tidur 🌅" },
    { time: "09:00 WIB", label: "Menemani persiapan aktivitas pagi 🎒" },
    { time: "11:30 WIB", label: "Satu gelas sebelum makan siang 🍲" },
    { time: "14:00 WIB", label: "Fokus booster di sela jam kesibukan 💻" },
    { time: "16:30 WIB", label: "Penyegar tubuh menjelang pulang sore 🌇" },
    { time: "19:00 WIB", label: "Penyeimbang hidrasi saat makan malam 🍽️" },
    { time: "21:00 WIB", label: "Gelas penutup sebelum tidur malam 😴" }
];

// Array untuk menyimpan status true/false checklist box
let checklistState = JSON.parse(localStorage.getItem('waterBuddy_checklistState')) || [];

// 2. OTOMATIS LOAD DATA SAAT HALAMAN DI-REFRESH / DIBUKA
window.addEventListener('DOMContentLoaded', () => {
    const savedWeight = localStorage.getItem('waterBuddy_weight');
    if (savedWeight) {
        weightInput.value = savedWeight;
        executeHydrationCalculation(parseFloat(savedWeight));
    }
});

// 3. EVENT LISTENER DETEKSI INPUT BERAT BADAN
weightInput.addEventListener('input', function() {
    const weightValue = parseFloat(this.value);

    if (!weightValue || weightValue < 10) {
        // Jika kosong, hapus memory lama
        resultBox.className = "result-display-box idled";
        targetOutputText.textContent = "Masukkan berat badan di atas...";
        timelineEngine.innerHTML = `<div class="timeline-empty-state">Silakan isi berat badan terlebih dahulu untuk memunculkan linimasa jadwal minum.</div>`;
        localStorage.removeItem('waterBuddy_weight');
        localStorage.setItem('waterBuddy_dailyGoal', 2000); // balikkan ke default home
        return;
    }

    // Simpan berat badan ke localStorage biar gak ilang pas pindah page
    localStorage.setItem('waterBuddy_weight', weightValue);
    executeHydrationCalculation(weightValue);
});

// 4. FUNGSI HITUNG & SINKRONISASI KE HOME PAGE
function executeHydrationCalculation(weight) {
    const targetMin = Math.round(weight * 30);
    const targetMax = Math.round(weight * 35);

    resultBox.className = "result-display-box calculated";
    targetOutputText.innerHTML = `Target Hidrasi Anda:<br><span style="font-size: 1.8rem; color:#1A0DAB;">${targetMin} ml - ${targetMax} ml</span> <span style="font-size:1rem; color:#718096;">/ Hari</span>`;

    // PENTING: Kirim nilai target air minimum ke halaman HOME lewat localStorage!
    localStorage.setItem('waterBuddy_dailyGoal', targetMin);

    buildDynamicTimeline(targetMin);
}

// 5. FUNCTION PERAKIT TIMELINE JADWAL DINAMIS
function buildDynamicTimeline(totalVolumeNeeded) {
    const sessionCount = masterScheduleTemplates.length;
    const waterPerSession = Math.round(totalVolumeNeeded / sessionCount);

    timelineEngine.innerHTML = ""; 

    masterScheduleTemplates.forEach((slot, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = "timeline-item";
        itemRow.id = `item-node-${index}`;

        // Cek apakah di catatan localStorage status jam ini sudah di-checklist (true)
        const isChecked = checklistState[index] === true ? "checked" : "";
        if (isChecked) {
            itemRow.classList.add('done-state');
        }

        itemRow.innerHTML = `
            <div class="task-info-side">
                <span class="time-badge">${slot.time}</span>
                <span class="task-desc">${slot.label} (${waterPerSession} ml)</span>
            </div>
            <div class="checklist-box">
                <input type="checkbox" ${isChecked} onchange="toggleScheduleState(${index}, this)">
            </div>
        `;
        
        timelineEngine.appendChild(itemRow);
    });
}

// 6. UX FUNCTION: SAVE STATUS CENTANG CHECKLIST
function toggleScheduleState(nodeIndex, checkboxNode) {
    const targetRow = document.getElementById(`item-node-${nodeIndex}`);
    
    // Update status ke dalam array
    checklistState[nodeIndex] = checkboxNode.checked;
    
    // Simpan array status checklist ke localStorage
    localStorage.setItem('waterBuddy_checklistState', JSON.stringify(checklistState));

    if (checkboxNode.checked) {
        targetRow.classList.add('done-state');
    } else {
        targetRow.classList.remove('done-state');
    }
}