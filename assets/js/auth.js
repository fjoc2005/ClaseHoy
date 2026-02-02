/**
 * ClaseHoy - Authentication Module
 * Handles user registration, login, and session management
 */

const Auth = {
    // Current user session key
    SESSION_KEY: 'clasehoy_session',
    USERS_KEY: 'clasehoy_users',

    /**
     * Initialize authentication
     */
    init() {
        this.checkSession();
    },

    /**
     * Get current logged-in user
     */
    getCurrentUser() {
        const session = localStorage.getItem(this.SESSION_KEY);
        if (!session) return null;

        const sessionData = JSON.parse(session);
        const user = this.getUserByEmail(sessionData.email);
        return user;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    /**
     * Get all users
     */
    getAllUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    /**
     * Get user by email
     */
    getUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    /**
     * Register new user
     */
    register(userData) {
        // Validate email
        if (!this.validateEmail(userData.email)) {
            return { success: false, error: 'Email inválido' };
        }

        // Check if user already exists
        if (this.getUserByEmail(userData.email)) {
            return { success: false, error: 'Este email ya está registrado' };
        }

        // Create user object
        const newUser = {
            email: userData.email.toLowerCase(),
            nombre: userData.nombre,
            region: userData.region,
            comuna: userData.comuna,
            subjects: userData.subjects || [],
            telefono: userData.telefono || '',
            experience: userData.experience || '',
            availability: userData.availability || '',
            workload: userData.workload || '',
            bio: userData.bio || '',
            verified: true, // For MVP, auto-verify. In production, send verification email
            createdAt: new Date().toISOString(),
            id: Date.now().toString()
        };

        // Save user
        const users = this.getAllUsers();
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        // Auto-login after registration
        this.createSession(newUser.email);

        return { success: true, user: newUser };
    },

    /**
     * Login user
     */
    login(email) {
        const user = this.getUserByEmail(email);
        if (!user) {
            return { success: false, error: 'Usuario no encontrado. Por favor regístrate primero.' };
        }

        this.createSession(email);
        return { success: true, user: user };
    },

    /**
     * Create user session
     */
    createSession(email) {
        const sessionData = {
            email: email.toLowerCase(),
            loginAt: new Date().toISOString()
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'index.html';
    },

    /**
     * Check session and redirect if needed
     */
    checkSession() {
        const currentPage = window.location.pathname.split('/').pop();
        const isAuthPage = currentPage === 'login.html' || currentPage === 'register.html';
        const isAuthenticated = this.isAuthenticated();

        // If on auth page and already logged in, redirect to main
        if (isAuthPage && isAuthenticated) {
            window.location.href = 'index.html';
        }
    },

    /**
     * Require authentication for certain pages
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    /**
     * Update user profile
     */
    updateProfile(updates) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, error: 'No hay sesión activa' };

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.email === currentUser.email);

        if (userIndex === -1) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        // Update user data
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return { success: true, user: users[userIndex] };
    },

    /**
     * Validate email format
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
