document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70, // Offset for the sticky header
                behavior: 'smooth'
            });
        });
    });
    
    // Animate supply chain steps on scroll
    const steps = document.querySelectorAll('.step');
    
    function checkScroll() {
        steps.forEach(step => {
            const stepTop = step.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (stepTop < windowHeight * 0.8) {
                step.classList.add('visible');
            }
        });
    }
    
    // Initial check in case elements are already in view
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.classList.add('back-to-top');
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTopButton);
});
