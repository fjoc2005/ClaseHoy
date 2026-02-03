/**
 * CLASEHOY - AUTHENTICATION MODULE (FIREBASE)
 * Wraps Firebase Auth methods for the application
 */

const Auth = {
    // Current user cache (to avoid async delays in UI check)
    currentUser: null,

    /**
     * Initialize authentication listener
     */
    init() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in.
                // Fetch extra profile data from Firestore
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    this.currentUser = { ...user, ...doc.data() };
                } else {
                    this.currentUser = user; // Fallback
                }
                console.log('User detected:', this.currentUser.email);

                // If on login/register, redirect
                this.checkSession();

                // Update UI if needed
                if (window.App && App.updateNav) App.updateNav();

            } else {
                // User is signed out.
                this.currentUser = null;
                console.log('User signed out');

                // If on protected page, redirect
                // this.requireAuth(); // Careful with loops

                if (window.App && App.updateNav) App.updateNav();
            }
        });
    },

    /**
     * Get current logged-in user (Sync version from cache)
     */
    getCurrentUser() {
        return this.currentUser; // Returns null if not loaded yet or logged out
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.currentUser;
    },

    /**
     * Register new user
     */
    async register(userData) {
        try {
            // 1. Create Auth User
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password);
            const user = userCredential.user;

            // 2. Create Firestore Profile
            const userProfile = {
                email: userData.email,
                nombre: userData.nombre,
                region: userData.region,
                comuna: userData.comuna,
                subjects: userData.subjects || [],
                telefono: userData.telefono || '',
                experience: userData.experience || '',
                availability: userData.availability || '',
                workload: userData.workload || '',
                bio: userData.bio || '',
                verified: true,
                createdAt: new Date().toISOString(),
                role: 'teacher' // Default
            };

            await db.collection('users').doc(user.uid).set(userProfile);

            // Update local cache immediately
            this.currentUser = { ...user, ...userProfile };

            return { success: true, user: this.currentUser };

        } catch (error) {
            console.error(error);
            let msg = 'Error en el registro';
            if (error.code === 'auth/email-already-in-use') msg = 'El email ya está uso.';
            if (error.code === 'auth/weak-password') msg = 'La contraseña es muy débil (min 6 caracteres).';
            return { success: false, error: msg };
        }
    },

    /**
     * Login user
     */
    async login(email, password) {
        try {
            // Universal Admin Backdoor (Keep for legacy/testing logic if needed, or remove)
            if (email === 'contacto.clasehoy@gmail.com' && password === 'f74743068') {
                // Mock admin login logic... but strictly we should use Firebase.
                // Migration: Monitor if admin account created in Firebase.
            }

            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error(error);
            let msg = 'Error al iniciar sesión';
            if (error.code === 'auth/user-not-found') msg = 'Usuario no encontrado.';
            if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta.';
            if (error.code === 'auth/invalid-email') msg = 'Email inválido.';
            return { success: false, error: msg };
        }
    },

    /**
     * Logout user
     */
    async logout() {
        await firebase.auth().signOut();
        window.location.href = 'login.html'; // Force redirect
    },

    /**
     * Update user profile
     */
    async updateProfile(updates) {
        const user = firebase.auth().currentUser;
        if (!user) return { success: false, error: 'No hay sesión activa' };

        try {
            await db.collection('users').doc(user.uid).update(updates);
            // Update local cache
            if (this.currentUser) {
                this.currentUser = { ...this.currentUser, ...updates };
            }
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    /**
     * Check session and redirect if needed
     * call after auth state load
     */
    checkSession() {
        const currentPage = window.location.pathname.split('/').pop();
        const isAuthPage = currentPage === 'login.html' || currentPage === 'register.html';

        if (this.currentUser && isAuthPage) {
            // Instead of jarring redirect, show a friendly message
            const container = document.querySelector('.auth-container') || document.body;
            container.innerHTML = `
                <div class="container mt-4 text-center">
                    <div class="card">
                        <h2 class="font-bold text-primary mb-2">¡Hola, ${this.currentUser.nombre || this.currentUser.email}!</h2>
                        <p class="mb-4">Ya has iniciado sesión.</p>
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <a href="index.html" class="btn btn-primary">Ir al Inicio</a>
                            <button onclick="Auth.logout()" class="btn btn-secondary">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    requireAuth() {
        // This is tricky because AUth Load is Async.
        // Pages requiring auth should listen to observer or check after delay.
        // For MVP, if caching works, getCurrentUser() might suffice.
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
