import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Remove the incorrect firebaseConfig object
let app;

// Fetch Firebase config before initializing
fetch('/firebase-config')
    .then((response) => response.json())
    .then((firebaseConfig) => {
        // Initialize Firebase with the fetched config
        app = initializeApp(firebaseConfig);
    })
    .catch((error) => {
        console.error('Error fetching Firebase config:', error);
        // Show error message to user
        alert('Failed to initialize the application. Please try again later.');
    });

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    const inputGroup = errorElement.parentElement;
    errorElement.textContent = message;
    errorElement.classList.add('show');
    inputGroup.classList.add('error-state');
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    const inputGroup = errorElement.parentElement;
    errorElement.classList.remove('show');
    inputGroup.classList.remove('error-state');
}

const submit = document.getElementById('submit');
submit.addEventListener('click', async function (event) {
    event.preventDefault();

    if (!app) {
        alert('Application is still initializing. Please try again in a moment.');
        return;
    }

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous errors
    clearError('emailError');
    clearError('passwordError');

    // Validation
    let hasError = false;

    if (!email) {
        showError('emailError', 'Email is required');
        hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        hasError = true;
    }

    if (!password) {
        showError('passwordError', 'Password is required');
        hasError = true;
    } else if (password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        hasError = true;
    }

    if (hasError) return;

    try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    } catch (error) {
        console.error(error);
        if (error.code === 'auth/email-already-in-use') {
            showError('emailError', 'This email is already registered');
        } else if (error.code === 'auth/weak-password') {
            showError('passwordError', 'Password is too weak');
        } else {
            alert(error.message);
        }
    }
});


// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
});



