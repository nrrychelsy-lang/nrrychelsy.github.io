// Ambil data dari localStorage. Jika belum ada catatan, gunakan nilai default (0 dan 2000)
let totalWaterDrank = parseInt(localStorage.getItem('waterBuddy_totalDrank')) || 0;
let dailyGoalMl = parseInt(localStorage.getItem('waterBuddy_dailyGoal')) || 2000;

const txtCurrentMl = document.getElementById('current-ml-text');
const txtTargetMl = document.querySelector('.target-grey'); // Mengambil elemen teks target / 2000ml
const elementWaterFill = document.getElementById('water-fill-engine');
const txtFeedbackHeadline = document.getElementById('feedback-headline');
const stickyNavbar = document.getElementById('navbar');

// SCROLL DETECTOR
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        stickyNavbar.classList.add('scrolled');
    } else {
        stickyNavbar.classList.remove('scrolled');
    }
});

// BUTTON ACTION
function hydrateAction(amount) {
    if (totalWaterDrank >= dailyGoalMl) return;

    totalWaterDrank += amount;

    if (totalWaterDrank > dailyGoalMl) {
        totalWaterDrank = dailyGoalMl;
    }

    localStorage.setItem('waterBuddy_totalDrank', totalWaterDrank);

    renderAppUpdates();
}

// RESET BUTTON
function resetHydrationToday() {
    totalWaterDrank = 0;
    
    localStorage.setItem('waterBuddy_totalDrank', 0);
    localStorage.removeItem('waterBuddy_checklistState'); 
    
    renderAppUpdates();
}

// APP UPDATE
function renderAppUpdates() {
    // Tampilkan data air saat ini
    txtCurrentMl.textContent = `${totalWaterDrank} ml`;
    
    // Tampilkan data target
    if (txtTargetMl) {
        txtTargetMl.textContent = ` / ${dailyGoalMl} ml`;
    }

    const fillPercentage = (totalWaterDrank / dailyGoalMl) * 100;
    elementWaterFill.style.height = `${fillPercentage}%`;

    if (totalWaterDrank === 0) {
        txtFeedbackHeadline.textContent = "Ayo Mulai Minum Air!";
    } else if (totalWaterDrank < dailyGoalMl) {
        txtFeedbackHeadline.textContent = "Hore ! Kamu sudah minum";
    } else {
        txtFeedbackHeadline.textContent = "Target Hari Ini Tercapai! 🎉";
    }
}

renderAppUpdates();