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

        // Add animation to project cards when section becomes visible
        if (projectsSection.classList.contains('visible')) {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });

    // Initialize project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
});
