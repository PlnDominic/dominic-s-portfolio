document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const projectsSection = document.getElementById('projects');
    const aboutLink = document.querySelector('a[href="#about"]');
    const projectsLink = document.querySelector('a[href="#projects"]');
    
    // Close sections when clicking outside
    document.addEventListener('click', (e) => {
        if (!aboutSection.contains(e.target) && e.target !== aboutLink) {
            aboutSection.classList.remove('visible');
        }
        if (!projectsSection.contains(e.target) && e.target !== projectsLink) {
            projectsSection.classList.remove('visible');
        }
    });

    // Toggle about section
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        projectsSection.classList.remove('visible');
        aboutSection.classList.toggle('visible');
    });

    // Toggle projects section
    projectsLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutSection.classList.remove('visible');
        projectsSection.classList.toggle('visible');
    });

    // Add intersection observer for project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});
