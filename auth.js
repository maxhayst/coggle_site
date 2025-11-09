// Simple authentication state management
let currentUser = null;

// Initialize authentication check
window.onload = function() {
    checkAuth();
};

// Check if user is authenticated
function checkAuth() {
    const user = sessionStorage.getItem('user');
    const currentPage = window.location.pathname;
    
    // If not on index and not authenticated, redirect to login
    if (!currentPage.includes('index.html') && currentPage !== '/' && !user) {
        window.location.href = 'index.html';
        return;
    }
    
    // If authenticated and on login page, redirect to main
    if (currentPage.includes('index.html') && user) {
        window.location.href = 'main.html';
        return;
    }
    
    // Display user info on authenticated pages
    if (user) {
        const userData = JSON.parse(user);
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `Вітаємо, ${userData.name}`;
        }
    }
}

// Handle Google Sign-In (using Google Identity Services)
function handleCredentialResponse(response) {
    // Decode JWT token to get user info
    const userObject = parseJwt(response.credential);
    
    currentUser = {
        name: userObject.name,
        email: userObject.email,
        picture: userObject.picture
    };
    
    // Store user in session
    sessionStorage.setItem('user', JSON.stringify(currentUser));
    
    // Redirect to mindmap page
    window.location.href = 'main.html';
}

// Alternative simple sign-in for demonstration
function signInWithGoogle() {
    // For demonstration purposes - simulate Google login
    const name = prompt('Введіть ваше ім\'я (Демо режим):');
    if (name) {
        currentUser = {
            name: name,
            email: name.toLowerCase().replace(/\s+/g, '') + '@demo.com',
            picture: ''
        };
        
        sessionStorage.setItem('user', JSON.stringify(currentUser));
        window.location.href = 'main.html';
    }
}

// Sign out function
function signOut() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('language');
    currentUser = null;
    window.location.href = 'index.html';
}

// Parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}
