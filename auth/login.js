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