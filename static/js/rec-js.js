// Theme management functions
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// UI Enhancement: Remove textarea auto-resize code
const input = document.querySelector('.message-input');

// Form validation
const submitButton = document.querySelector('.search-button');

// Initial button state
submitButton.disabled = true;
submitButton.style.opacity = '0.5';
submitButton.style.cursor = 'not-allowed';

// Validate input
input.addEventListener('input', function() {
    const isValid = this.value.trim().length > 0;
    submitButton.disabled = !isValid;
    submitButton.style.opacity = isValid ? '1' : '0.5';
    submitButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
});

// Loading state management
const showLoading = () => {
    document.querySelector('.loading-container').classList.add('active');
    document.querySelector('.products-grid').style.display = 'none';
};

const hideLoading = () => {
    document.querySelector('.loading-container').classList.remove('active');
    document.querySelector('.products-grid').style.display = 'grid';
};

// Event listeners
document.querySelector('form').addEventListener('submit', showLoading);
window.addEventListener('load', hideLoading);

// Logout handling
function handleLogout() {
    // Clear any stored data if needed
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login page and prevent going back
    window.location.replace('/');
}

// Prevent back button after logout
window.history.forward();
function noBack() {
    window.history.forward();
}


