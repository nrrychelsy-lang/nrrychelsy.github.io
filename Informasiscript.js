const stickyNavbar = document.getElementById('navbar');
const newsSlider = document.getElementById('news-slider');

// SCROLL DETECTOR
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        stickyNavbar.classList.add('scrolled');
    } else {
        stickyNavbar.classList.remove('scrolled');
    }
});

// PANAH SLIDER
function slideArticles(direction) {
    const scrollAmount = 375; 
    
    if (direction === 'left') {
        newsSlider.scrollLeft -= scrollAmount;
    } else {
        newsSlider.scrollLeft += scrollAmount;
    }
}