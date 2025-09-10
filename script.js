document.addEventListener('DOMContentLoaded', () => {
    // Splash page logic (only for index.html)
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        const flashpage = document.getElementById('flashpage');
        const container = document.querySelector('.container');
        const skipButton = document.querySelector('.skip-button');

        // Check if user is authenticated
        let isAuthenticated = false;
        try {
            isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        } catch (e) {
            console.error('Error accessing localStorage:', e);
            const errorDiv = document.getElementById('nav-error') || document.createElement('div');
            errorDiv.id = 'nav-error';
            errorDiv.style.color = 'red';
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Storage error. Please enable local storage.';
            document.querySelector('main').prepend(errorDiv);
        }

        // If authenticated, skip splash page and show container
        if (isAuthenticated) {
            if (flashpage) {
                flashpage.style.display = 'none';
            }
            if (container) {
                container.style.display = 'block';
            }
            // Optionally update welcome message for logged-in user
            const intro = document.querySelector('.intro');
            if (intro) {
                const currentUser = localStorage.getItem('currentUser') || 'User';
                intro.textContent = `Welcome back, ${currentUser}! Explore your job opportunities!`;
            }
        } else {
            // Show splash page for unauthenticated users
            if (container) {
                container.style.display = 'none';
            }

            const redirectAfterSplash = () => {
                if (flashpage) {
                    flashpage.classList.add('hidden');
                }
                setTimeout(() => {
                    if (container) {
                        container.style.display = 'block';
                    }
                    try {
                        const users = JSON.parse(localStorage.getItem('users') || '[]');
                        window.location.href = users.length > 0 ? '/login.html' : '/signup.html';
                    } catch (e) {
                        console.error('Error accessing localStorage for redirect:', e);
                        window.location.href = '/signup.html';
                    }
                }, 1000);
            };

            setTimeout(redirectAfterSplash, 2000);

            if (skipButton) {
                skipButton.addEventListener('click', redirectAfterSplash);
            }
        }
    }

    // Protect navigation links (runs on all pages with nav-menu)
    const protectedLinks = ['apply-link', 'survey-link', 'payment-link', 'reservation-link'];
    protectedLinks.forEach(linkClass => {
        const link = document.querySelector(`.${linkClass}`);
        if (link) {
            link.addEventListener('click', (e) => {
                try {
                    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
                    if (!isAuthenticated) {
                        e.preventDefault();
                        const errorDiv = document.getElementById('nav-error') || document.createElement('div');
                        errorDiv.id = 'nav-error';
                        errorDiv.style.color = 'red';
                        errorDiv.style.display = 'block';
                        errorDiv.setAttribute('aria-live', 'polite');
                        errorDiv.textContent = 'Please log in to access this page.';
                        document.querySelector('main').prepend(errorDiv);
                        setTimeout(() => window.location.href = '/login.html', 2000);
                    }
                } catch (e) {
                    console.error('Error accessing localStorage:', e);
                    e.preventDefault();
                    const errorDiv = document.getElementById('nav-error') || document.createElement('div');
                    errorDiv.id = 'nav-error';
                    errorDiv.style.color = 'red';
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = 'Storage error. Please enable local storage.';
                    document.querySelector('main').prepend(errorDiv);
                }
            });
        }
    });

    // Update nav for authenticated users (hide Login/Sign Up, show Log Out)
    try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            const loginLink = document.querySelector('.login-link');
            const signupLink = document.querySelector('.signup-link');
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
            // Add Log Out link if not already present
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && !document.getElementById('logoutButton')) {
                const logoutButton = document.createElement('button');
                logoutButton.id = 'logoutButton';
                logoutButton.textContent = 'Log Out';
                logoutButton.style.margin = '0 15px';
                logoutButton.style.background = 'none';
                logoutButton.style.border = 'none';
                logoutButton.style.color = 'white';
                logoutButton.style.fontSize = '16px';
                logoutButton.style.cursor = 'pointer';
                logoutButton.addEventListener('click', () => {
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('currentUser');
                    window.location.href = '/login.html';
                });
                navMenu.appendChild(logoutButton);
            }
        }
    } catch (e) {
        console.error('Error accessing localStorage for nav update:', e);
    }
});