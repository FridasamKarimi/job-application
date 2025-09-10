document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('survey-error');
    const successDiv = document.getElementById('survey-success');
    errorDiv.textContent = '';
    successDiv.textContent = '';
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    // Collect form data
    const fullName = this.fullName.value.trim();
    const rolePreference = this.querySelector('input[name="rolePreference"]:checked')?.value;
    const industry = this.industry.value;
    const experienceLevel = this.querySelector('input[name="experienceLevel"]:checked')?.value;
    const topSkill = this.topSkill.value.trim();
    const motivations = Array.from(this.querySelectorAll('input[name="motivations[]"]:checked')).map(input => input.value);

    // Validation
    if (!fullName || fullName.length < 2) {
        errorDiv.textContent = 'Please enter a valid full name (at least 2 characters).';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (!rolePreference) {
        errorDiv.textContent = 'Please select a role preference.';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (!industry) {
        errorDiv.textContent = 'Please select an industry.';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (!experienceLevel) {
        errorDiv.textContent = 'Please select an experience level.';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (!topSkill || topSkill.length < 2) {
        errorDiv.textContent = 'Please enter a valid skill (at least 2 characters).';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (motivations.length === 0) {
        errorDiv.textContent = 'Please select at least one motivation.';
        errorDiv.classList.remove('hidden');
        return;
    }

    // Prepare data for localStorage
    const formData = {
        fullName,
        rolePreference,
        industry,
        experienceLevel,
        topSkill,
        motivations,
        timestamp: new Date().toISOString()
    };

    // Store in localStorage
    let surveys = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    surveys.push(formData);
    localStorage.setItem('surveyResponses', JSON.stringify(surveys));

    // Display success message and reset form
    successDiv.textContent = 'Survey submitted successfully!';
    successDiv.classList.remove('hidden');
    this.reset();

    // Clear success message after 3 seconds
    setTimeout(() => {
        successDiv.textContent = '';
        successDiv.classList.add('hidden');
    }, 3000);
});