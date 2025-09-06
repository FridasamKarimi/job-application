// Splash Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const flashpage = document.getElementById('flashpage');
    const skipButton = document.querySelector('.skip-button');

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // Redirect after splash page
    const redirectAfterSplash = () => {
        if (flashpage) {
            flashpage.classList.add('hidden');
        }
        setTimeout(() => {
            window.location.href = isAuthenticated ? '/application.html' : '/signup.html';
        }, 1000);
    };

    // Auto-redirect after 2 seconds
    setTimeout(redirectAfterSplash, 2000);

    // Skip button to redirect immediately
    if (skipButton) {
        skipButton.addEventListener('click', redirectAfterSplash);
    }

    // Protect navigation links for authenticated pages
    const protectedLinks = ['apply-link', 'survey-link', 'payment-link', 'reservation-link'];
    protectedLinks.forEach(linkClass => {
        const link = document.querySelector(`.${linkClass}`);
        if (link) {
            link.addEventListener('click', (e) => {
                if (!isAuthenticated) {
                    e.preventDefault();
                    alert('Please log in to access this page');
                    window.location.href = '/login.html'; // Consistent path
                }
            });
        }
    });
});

// Signup Form Validation
document.getElementById('signupForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('signup-email')?.value.trim();
    const password = document.getElementById('signup-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const errorDiv = document.getElementById('signup-error');
    const successDiv = document.getElementById('signup-success');
    const submitButton = document.querySelector('#signupForm button[type="submit"]');

    // Clear previous errors
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        errorDiv.setAttribute('aria-live', 'polite');
    }

    // Validation
    if (!email || !password || !confirmPassword) {
        if (errorDiv) {
            errorDiv.textContent = 'Please fill in all required fields';
            errorDiv.style.display = 'block';
        }
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errorDiv) {
            errorDiv.textContent = 'Please enter a valid email address';
            errorDiv.style.display = 'block';
        }
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        if (errorDiv) {
            errorDiv.textContent = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
            errorDiv.style.display = 'block';
        }
        return;
    }

    if (password !== confirmPassword) {
        if (errorDiv) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
        }
        return;
    }

    // Disable submit button to prevent multiple submissions
    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        // Check if email already exists in local storage
        let existingUsers = [];
        try {
            existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        } catch (parseError) {
            console.error('Error parsing users from localStorage:', parseError);
        }

        if (existingUsers.some(user => user.email === email)) {
            if (errorDiv) {
                errorDiv.textContent = 'Email already exists';
                errorDiv.style.display = 'block';
            }
            if (submitButton) submitButton.disabled = false;
            return;
        }

        // Add new user
        const newUser = { email, password }; // Note: In production, hash the password
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        // Do NOT set isAuthenticated here; user must log in

        // Show success message and redirect
        if (successDiv) {
            successDiv.textContent = 'Account created successfully! Redirecting to login...';
            successDiv.style.display = 'block';
        }
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500); // Reduced delay for better UX
    } catch (error) {
        console.error('Signup error:', error);
        if (errorDiv) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'block';
        }
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

// Login Form Validation
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    const errorDiv = document.getElementById('login-error');
    const successDiv = document.getElementById('login-success');
    const submitButton = document.querySelector('#loginForm button[type="submit"]');

    // Clear previous errors
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        errorDiv.setAttribute('aria-live', 'polite');
    }

    // Validation
    if (!email || !password) {
        if (errorDiv) {
            errorDiv.textContent = 'Please fill in all required fields';
            errorDiv.style.display = 'block';
        }
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errorDiv) {
            errorDiv.textContent = 'Please enter a valid email address';
            errorDiv.style.display = 'block';
        }
        return;
    }

    // Disable submit button to prevent multiple submissions
    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        // Check credentials against stored users
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('users') || '[]');
        } catch (parseError) {
            console.error('Error parsing users from localStorage:', parseError);
        }

        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            if (errorDiv) {
                errorDiv.textContent = 'Invalid email or password';
                errorDiv.style.display = 'block';
            }
            if (submitButton) submitButton.disabled = false;
            return;
        }

        // Set authentication flag and current user
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', email);

        // Show success message and redirect
        if (successDiv) {
            successDiv.textContent = 'Login successful! Redirecting...';
            successDiv.style.display = 'block';
        }
        setTimeout(() => {
            window.location.href = '/application.html';
        }, 1500); // Reduced delay for better UX
    } catch (error) {
        console.error('Login error:', error);
        if (errorDiv) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'block';
        }
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});