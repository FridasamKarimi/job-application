document.getElementById('jobApplicationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('application-error');
    const successDiv = document.getElementById('application-success');
    errorDiv.textContent = '';
    successDiv.textContent = '';

    // Collect form data
    const fullName = this.fullName.value.trim();
    const region = this.region.value.trim();
    const dateOfBirth = this.dateOfBirth.value;
    const resume = this.resume.files[0];
    const termsConditions = this.termsConditions.checked;

    // Validation
    if (!fullName || fullName.length < 2) {
        errorDiv.textContent = 'Please enter a valid full name (at least 2 characters).';
        return;
    }

    if (!region || region.length < 2) {
        errorDiv.textContent = 'Please enter a valid region.';
        return;
    }

    if (!dateOfBirth) {
        errorDiv.textContent = 'Please select a date of birth.';
        return;
    }

    // Validate date of birth (ensure applicant is at least 18)
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 18) {
        errorDiv.textContent = 'You must be at least 18 years old to apply.';
        return;
    }

    // Validate resume
    if (!resume) {
        errorDiv.textContent = 'Please upload a resume.';
        return;
    }
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resume.type)) {
        errorDiv.textContent = 'Resume must be a PDF, DOC, or DOCX file.';
        return;
    }
    if (resume.size > 5 * 1024 * 1024) {
        errorDiv.textContent = 'Resume file size must not exceed 5MB.';
        return;
    }

    if (!termsConditions) {
        errorDiv.textContent = 'You must agree to the terms and conditions.';
        return;
    }

    // Prepare data for localStorage (store file metadata, not the file itself)
    const formData = {
        fullName,
        region,
        dateOfBirth,
        resume: {
            name: resume.name,
            size: resume.size,
            type: resume.type,
            lastModified: resume.lastModified
        },
        termsConditions,
        timestamp: new Date().toISOString()
    };

    // Store in localStorage
    let applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    applications.push(formData);
    localStorage.setItem('jobApplications', JSON.stringify(applications));

    // Display success message and reset form
    successDiv.textContent = 'Application submitted successfully!';
    this.reset();

    // Clear success message after 3 seconds
    setTimeout(() => {
        successDiv.textContent = '';
    }, 3000);
});