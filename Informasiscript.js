const stickyNavbar = document.getElementById('navbar');
const newsSlider = document.getElementById('news-slider');

// 1. STICKY SCROLL DETECTOR FOR NAVBAR (Konsisten dengan Home)
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        stickyNavbar.classList.add('scrolled');
    } else {
        stickyNavbar.classList.remove('scrolled');
    }
});

// 2. FUNGSI NAVIGASI TOMBOL PANAH SLIDER ARTIKEL
function slideArticles(direction) {
    // Ambil lebar satu card berita dinamis ditambah nilai gap-nya (350px card + 25px gap)
    const scrollAmount = 375; 
    
    if (direction === 'left') {
        // Kurangi posisi geser ke kiri
        newsSlider.scrollLeft -= scrollAmount;
    } else {
        // Tambahkan posisi geser ke kanan
        newsSlider.scrollLeft += scrollAmount;
    }
}