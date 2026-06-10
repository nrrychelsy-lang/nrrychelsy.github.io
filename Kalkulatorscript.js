const stickyNavbar = document.getElementById('navbar');
const weightInput = document.getElementById('weight-input');
const resultBox = document.getElementById('result-box');
const targetOutputText = document.getElementById('target-output-text');
const timelineEngine = document.getElementById('timeline-engine');

// SCROLL DETECTOR
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        stickyNavbar.classList.add('scrolled');
    } else {
        stickyNavbar.classList.remove('scrolled');
    }
});

// Template Jadwal
const masterScheduleTemplates = [
    { time: "07:00 WIB", label: "Gelas pertama setelah bangun tidur 🌅" },
    { time: "09:00 WIB", label: "Menemani persiapan aktivitas pagi 🎒" },
    { time: "11:30 WIB", label: "Satu gelas sebelum makan siang 🍲" },
    { time: "14:00 WIB", label: "Fokus booster di sela jam kesibukan 💻" },
    { time: "16:30 WIB", label: "Penyegar tubuh menjelang pulang sore 🌇" },
    { time: "19:00 WIB", label: "Penyeimbang hidrasi saat makan malam 🍽️" },
    { time: "21:00 WIB", label: "Gelas penutup sebelum tidur malam 😴" }
];

// Array status true/false checklist box
let checklistState = JSON.parse(localStorage.getItem('waterBuddy_checklistState')) || [];

// LOAD DATA SAAT REFRESH PAGE
window.addEventListener('DOMContentLoaded', () => {
    const savedWeight = localStorage.getItem('waterBuddy_weight');
    if (savedWeight) {
        weightInput.value = savedWeight;
        executeHydrationCalculation(parseFloat(savedWeight));
    }
});

// DETEKSI INPUT BB
weightInput.addEventListener('input', function() {
    const weightValue = parseFloat(this.value);

    if (!weightValue || weightValue < 10) {
        resultBox.className = "result-display-box idled";
        targetOutputText.textContent = "Masukkan berat badan di atas...";
        timelineEngine.innerHTML = `<div class="timeline-empty-state">Silakan isi berat badan terlebih dahulu untuk memunculkan linimasa jadwal minum.</div>`;
        localStorage.removeItem('waterBuddy_weight');
        localStorage.setItem('waterBuddy_dailyGoal', 2000);
        return;
    }

    localStorage.setItem('waterBuddy_weight', weightValue);
    executeHydrationCalculation(weightValue);
});

// HITUNG TARGER
function executeHydrationCalculation(weight) {
    const targetMin = Math.round(weight * 30);
    const targetMax = Math.round(weight * 35);

    resultBox.className = "result-display-box calculated";
    targetOutputText.innerHTML = `Target Hidrasi Anda:<br><span style="font-size: 1.8rem; color:#1A0DAB;">${targetMin} ml - ${targetMax} ml</span> <span style="font-size:1rem; color:#718096;">/ Hari</span>`;

    localStorage.setItem('waterBuddy_dailyGoal', targetMin);

    buildDynamicTimeline(targetMin);
}

// PENGATUR TIMELINE 
function buildDynamicTimeline(totalVolumeNeeded) {
    const sessionCount = masterScheduleTemplates.length;
    const waterPerSession = Math.round(totalVolumeNeeded / sessionCount);

    timelineEngine.innerHTML = ""; 

    masterScheduleTemplates.forEach((slot, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = "timeline-item";
        itemRow.id = `item-node-${index}`;

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

// SAVE STATUS
function toggleScheduleState(nodeIndex, checkboxNode) {
    const targetRow = document.getElementById(`item-node-${nodeIndex}`);
    
    checklistState[nodeIndex] = checkboxNode.checked;
    
    localStorage.setItem('waterBuddy_checklistState', JSON.stringify(checklistState));

    if (checkboxNode.checked) {
        targetRow.classList.add('done-state');
    } else {
        targetRow.classList.remove('done-state');
    }
}