/**
 * CLASEHOY - AUTHENTICATION MODULE (FIREBASE)
 * Wraps Firebase Auth methods for the application
 */
const Auth = {
  currentUser: null,

  init() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.currentUser = user;

        // Enriquecer perfil
        try {
          const doc = await db.collection('users').doc(user.uid).get();
          if (doc.exists) {
            this.currentUser = { ...user, ...doc.data() };
          }
        } catch (e) {
          console.warn('Perfil no cargado');
        }
      } else {
        this.currentUser = null;
      }

      // 🔔 UNICA comunicación hacia App
      if (window.App && App.onAuthChange) {
        App.onAuthChange(this.currentUser);
      }
    });
  },

  getCurrentUser() {
    return this.currentUser;
  },

  isAuthenticated() {
    return !!this.currentUser;
  },

  async login(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    return { success: true };
  },

  async logout() {
    await firebase.auth().signOut();
    window.location.href = 'index.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
