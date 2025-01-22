import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

let app;
let auth;

// Initialize Firebase first
async function initializeFirebase() {
    try {
        const response = await fetch('/firebase-config');
        if (!response.ok) {
            throw new Error('Failed to fetch Firebase configuration');
        }
        const firebaseConfig = await response.json();
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        alert('Failed to initialize the application. Please try again later.');
        return false;
    }
}

// Wait for Firebase to initialize before setting up the form handler
initializeFirebase().then(initialized => {
    if (initialized) {
        setupLoginForm();
    }
});

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
        
        // If this is a field error, add error class to input
        const inputElement = document.getElementById(elementId.replace('Error', ''));
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message, .error-container');
    const inputElements = document.querySelectorAll('input');
    
    errorElements.forEach(element => {
        element.classList.remove('visible');
        element.textContent = '';
    });
    
    inputElements.forEach(input => {
        input.classList.remove('error');
    });
}

function setupLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        clearErrors();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email) {
            showError('emailError', 'Please enter your email address');
            return;
        }

        if (!password) {
            showError('passwordError', 'Please enter your password');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            document.getElementById('successMessage').classList.add('visible');
            setTimeout(() => {
                window.location.href = '/recommend';
            }, 1000);
        } catch (error) {
            let errorMessage = 'Please check Email and Password';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    showError('emailError', 'Invalid email address');
                    break;
                case 'auth/user-not-found':
                    showError('emailError', 'No account found with this email');
                    break;
                case 'auth/wrong-password':
                    showError('passwordError', 'Incorrect password');
                    break;
                default:
                    showError('generalError', errorMessage);
            }
            console.error(error);
        }
    });
}

themeToggle.addEventListener('click', () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'light' ?
        '<i class="fas fa-moon"></i>' :
        '<i class="fas fa-sun"></i>';
});