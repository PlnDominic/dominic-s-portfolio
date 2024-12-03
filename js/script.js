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
});
