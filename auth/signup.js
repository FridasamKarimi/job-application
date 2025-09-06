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