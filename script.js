// --- 1. DOM Selection ---
// We select elements by ID to make it easy for Playwright automation later
const els = {
    roleCandidateBtn: document.getElementById('role-candidate-btn'),
    roleHrBtn: document.getElementById('role-hr-btn'),
    selectedRoleInput: document.getElementById('selected-role'),
    emailInput: document.getElementById('email-input'),
    passwordInput: document.getElementById('password-input'),
    loginForm: document.getElementById('login-form'),
    emailError: document.getElementById('email-error'),
    passwordError: document.getElementById('password-error'),
    toastContainer: document.getElementById('toast-container')
};

// --- 2. State Management ---
// Default role is Candidate
let currentRole = 'candidate';

// --- 3. Event Listeners & Logic ---

// A. Handle Role Switching (Tabs)
els.roleCandidateBtn.addEventListener('click', () => setRole('candidate'));
els.roleHrBtn.addEventListener('click', () => setRole('hr'));

function setRole(role) {
    currentRole = role;
    
    // Update the hidden input value (useful for backend submission later)
    els.selectedRoleInput.value = role;

    // Update UI to show which tab is active
    if (role === 'candidate') {
        els.roleCandidateBtn.classList.add('active');
        els.roleHrBtn.classList.remove('active');
    } else {
        els.roleHrBtn.classList.add('active');
        els.roleCandidateBtn.classList.remove('active');
    }

    // Clear any errors when switching roles (Good UX)
    clearErrors();
}

// B. Handle Form Submission
els.loginForm.addEventListener('submit', function(event) {
    // Stop the page from reloading
    event.preventDefault();

    // Run validations
    if (validateForm()) {
        // If valid, simulate navigation
        simulateNavigation();
    }
});

// --- 4. Validation Logic ---

function validateForm() {
    let isValid = true;
    
    // Clear previous errors first
    clearErrors();

    const emailValue = els.emailInput.value.trim();
    const passwordValue = els.passwordInput.value.trim();

    // --- Validations: EMAIL ---
    
    // 1. Empty Check
    if (emailValue === '') {
        showError(els.emailError, 'Email is required.');
        isValid = false;
    } 
    // 2. Format Check (Regex)
    else if (!isValidEmail(emailValue)) {
        showError(els.emailError, 'Please enter a valid email (e.g., user@domain.com).');
        isValid = false;
    }

    // --- Validations: PASSWORD ---

    // 1. Empty Check
    if (passwordValue === '') {
        showError(els.passwordError, 'Password is required.');
        isValid = false;
    } 
    // 2. Minimum Length Check
    else if (passwordValue.length < 6) {
        showError(els.passwordError, 'Password must be at least 6 characters.');
        isValid = false;
    }

    // --- Validations: ROLE ---
    // (Technically always selected by default, but good to check for logic)
    if (!currentRole) {
        showToast('Please select a role.', 'error');
        isValid = false;
    }

    return isValid;
}

// Helper: Email Regex Check
function isValidEmail(email) {
    // Simple regex: something @ something . something
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Helper: Display Error Message & Style
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    
    // Add the .error class to the corresponding input
    // We find the input by removing '-error' from the ID
    const inputId = element.id.replace('-error', '');
    const inputEl = document.getElementById(inputId);
    if (inputEl) {
        inputEl.classList.add('error');
    }
}

// Helper: Clear Errors
function clearErrors() {
    // Hide error texts
    els.emailError.style.display = 'none';
    els.passwordError.style.display = 'none';
    
    // Remove red borders from inputs
    els.emailInput.classList.remove('error');
    els.passwordInput.classList.remove('error');
}

// --- 5. Simulation Logic (No Real Backend) ---

// --- 5. Simulation Logic (Navigation) ---

function simulateNavigation() {
    // Show success message
    showToast(`Validation Passed! Redirecting...`, 'success');

    // Simulate a short delay before redirecting
    setTimeout(() => {
        if (currentRole === 'candidate') {
            console.log("Navigating to Candidate Application Form...");
            window.location.href = 'candidate-form.html'; 
        } else {
            console.log("Navigating to HR Dashboard...");
            window.location.href = 'admin-dashboard.html';
        }
    }, 1000);
}
// --- 6. UI Utilities ---

// Simple Toast Notification Function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    els.toastContainer.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add 'input' listeners to clear errors as user types
els.emailInput.addEventListener('input', () => {
    if (els.emailInput.classList.contains('error')) clearErrors();
});
els.passwordInput.addEventListener('input', () => {
    if (els.passwordInput.classList.contains('error')) clearErrors();
});