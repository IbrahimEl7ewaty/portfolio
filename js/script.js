document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        body.classList.add(savedTheme);
        themeToggle.textContent = (savedTheme === "dark-mode") ? "الوضع الفاتح" : "الوضع الداكن";
    } else {
        // Default to light mode
        body.classList.add("light-mode");
        themeToggle.textContent = "الوضع الداكن";
    }

    // Theme toggle click
    themeToggle.addEventListener("click", () => {
        const isLight = body.classList.contains("light-mode");
        body.classList.toggle("light-mode", !isLight);
        body.classList.toggle("dark-mode", isLight);
        themeToggle.textContent = isLight ? "الوضع الفاتح" : "الوضع الداكن";
        localStorage.setItem("theme", isLight ? "dark-mode" : "light-mode");
    });

    // Smooth scroll for nav links
    const navLinks = document.querySelectorAll("header nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href.startsWith("#")) {
                e.preventDefault();
                const target = document.getElementById(href.slice(1));
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // Fade-in on scroll effect
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => observer.observe(el));
});
