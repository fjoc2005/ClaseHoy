/**
 * CLASEHOY - AUTHENTICATION MODULE (FIREBASE)
 * Fuente única de estado de sesión
 */

const Auth = {
  currentUser: null,

  async init() {
    // 🔒 Persistencia fuerte (importante en Vercel / producción)
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) {
      console.warn('No se pudo fijar persistencia:', e);
    }

    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        // Usuario NO autenticado
        this.currentUser = null;

        if (window.App && App.onAuthChange) {
          App.onAuthChange(null);
        }
        return;
      }

      // ✅ Usuario autenticado (base)
      this.currentUser = user;

      // 🔔 Notificar inmediatamente (desbloquea menú / publicar)
      if (window.App && App.onAuthChange) {
        App.onAuthChange(this.currentUser);
      }

      // 🧩 Enriquecer con perfil Firestore (NO bloqueante)
      try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
          this.currentUser = {
            uid: user.uid,
            email: user.email,
            ...doc.data()
          };

          // 🔔 Notificar nuevamente con perfil completo
          if (window.App && App.onAuthChange) {
            App.onAuthChange(this.currentUser);
          }
        }
      } catch (error) {
        console.warn('Perfil Firestore no cargado:', error);
        // ⚠️ Aun así el usuario sigue logueado
      }
    });
  },

  getCurrentUser() {
    return this.currentUser;
  },

  isAuthenticated() {
    return this.currentUser !== null;
  },

  async login(email, password) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error) {
      let msg = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') msg = 'Usuario no encontrado';
      if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta';
      if (error.code === 'auth/invalid-email') msg = 'Email inválido';
      return { success: false, error: msg };
    }
  },

  async logout() {
    await firebase.auth().signOut();
    window.location.href = 'index.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
