/**
 * CLASEHOY - AUTHENTICATION MODULE (FIREBASE)
 * Fuente única de estado de sesión
 */

const Auth = {
  currentUser: null,

  async init() {
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) {
      console.warn('No se pudo fijar persistencia:', e);
    }

    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        this.currentUser = null;

        if (window.App && App.onAuthChange) {
          App.onAuthChange(null);
        }
        return;
      }

      this.currentUser = user;

      if (window.App && App.onAuthChange) {
        App.onAuthChange(this.currentUser);
      }

      try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
          this.currentUser = {
            uid: user.uid,
            email: user.email,
            ...doc.data()
          };

          if (window.App && App.onAuthChange) {
            App.onAuthChange(this.currentUser);
          }
        }
      } catch (error) {
        console.warn('Perfil Firestore no cargado:', error);
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

  // ✅ FUNCIÓN REGISTER AGREGADA
  async register(email, password, extraData = {}) {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const user = userCredential.user;

      // Guardar perfil en Firestore
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...extraData
      });

      return { success: true };
    } catch (error) {
      let msg = 'Error al registrarse';
      if (error.code === 'auth/email-already-in-use')
        msg = 'El email ya está registrado';
      if (error.code === 'auth/invalid-email')
        msg = 'Email inválido';
      if (error.code === 'auth/weak-password')
        msg = 'La contraseña debe tener al menos 6 caracteres';

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
