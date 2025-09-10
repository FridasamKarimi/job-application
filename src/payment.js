document.addEventListener('DOMContentLoaded', function() {
    // Add error and success divs dynamically
    const form = document.getElementById('paymentPreference');
    const errorDiv = document.createElement('div');
    errorDiv.id = 'payment-error';
    errorDiv.className = 'error';
    errorDiv.setAttribute('role', 'alert');
    const successDiv = document.createElement('div');
    successDiv.id = 'payment-success';
    successDiv.className = 'success';
    successDiv.setAttribute('role', 'alert');
    form.parentNode.insertBefore(errorDiv, form);
    form.parentNode.insertBefore(successDiv, errorDiv);

    // Toggle payment fields based on selection
    window.togglePaymentFields = function(method) {
        const mpesaFields = document.getElementById('mpesaFields');
        const bankFields = document.getElementById('bankFields');
        mpesaFields.classList.toggle('hidden', method !== 'mpesa');
        bankFields.classList.toggle('hidden', method !== 'bank');

        // Update required attributes based on visible fields
        const mpesaInputs = mpesaFields.querySelectorAll('input');
        const bankInputs = bankFields.querySelectorAll('input, select');
        mpesaInputs.forEach(input => input.required = method === 'mpesa');
        bankInputs.forEach(input => input.required = method === 'bank' && input.id !== 'branchName'); // Branch name is optional
    };

    // Form submission handler
    document.getElementById('paymentPreference').addEventListener('submit', function(event) {
        event.preventDefault();

        errorDiv.textContent = '';
        successDiv.textContent = '';

        // Collect form data
        const paymentName = this.paymentName.value.trim();
        const paymentNumber = this.paymentNumber.value.trim();
        const paymentMethod = this.querySelector('input[name="paymentMethod"]:checked')?.value;

        // Basic validation
        if (!paymentName || paymentName.length < 2) {
            errorDiv.textContent = 'Please enter a valid full name (at least 2 characters).';
            return;
        }

        const phoneRegex = /^\+?\d{10,14}$/;
        if (!phoneRegex.test(paymentNumber)) {
            errorDiv.textContent = 'Please enter a valid phone number (10-14 digits).';
            return;
        }

        if (!paymentMethod) {
            errorDiv.textContent = 'Please select a payment method.';
            return;
        }

        const formData = {
            paymentName,
            paymentNumber,
            paymentMethod,
            timestamp: new Date().toISOString()
        };

        // Validate and collect M-Pesa fields
        if (paymentMethod === 'M-Pesa') {
            const mpesaNumber = this.mpesaNumber.value.trim();
            const mpesaName = this.mpesaName.value.trim();

            if (!phoneRegex.test(mpesaNumber)) {
                errorDiv.textContent = 'Please enter a valid M-Pesa phone number (10-14 digits).';
                return;
            }
            if (!mpesaName || mpesaName.length < 2) {
                errorDiv.textContent = 'Please enter a valid M-Pesa registered name (at least 2 characters).';
                return;
            }

            formData.mpesaDetails = { mpesaNumber, mpesaName };
        }

        // Validate and collect Bank Account fields
        if (paymentMethod === 'Bank Account') {
            const bankName = this.bankName.value;
            const accountNumber = this.accountNumber.value.trim();
            const accountName = this.accountName.value.trim();
            const branchName = this.branchName.value.trim();

            if (!bankName) {
                errorDiv.textContent = 'Please select a bank.';
                return;
            }
            if (!accountNumber || accountNumber.length < 5) {
                errorDiv.textContent = 'Please enter a valid bank account number (at least 5 characters).';
                return;
            }
            if (!accountName || accountName.length < 2) {
                errorDiv.textContent = 'Please enter a valid account holder name (at least 2 characters).';
                return;
            }

            formData.bankDetails = { bankName, accountNumber, accountName, branchName: branchName || '' };
        }

        // Store in localStorage
        let payments = JSON.parse(localStorage.getItem('paymentPreferences') || '[]');
        payments.push(formData);
        localStorage.setItem('paymentPreferences', JSON.stringify(payments));

        // Display success message and reset form
        successDiv.textContent = 'Payment preference submitted successfully!';
        this.reset();
        document.getElementById('mpesaFields').classList.add('hidden');
        document.getElementById('bankFields').classList.add('hidden');

        // Clear success message after 3 seconds
        setTimeout(() => {
            successDiv.textContent = '';
        }, 3000);
    });
});