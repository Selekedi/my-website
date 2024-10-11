import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,sendPasswordResetEmail,GoogleAuthProvider, signInWithPopup } from  "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import { auth } from "./thatothemc_firebase.js";

const provider = new GoogleAuthProvider();

export function registerUserWithEmail(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registered successfully
        console.log("User registered:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  }
  
  // Sign in existing user
export  function loginUserWithEmail(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Logged in successfully
        console.log("User logged in:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error logging in user:", error);
      });
  }
  
export  function logoutUser() {
    signOut(auth)
      .then(() => {
        // Successfully signed out
        console.log("User signed out.");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  
export  function resetPassword(email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent!");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
      });
  }
  
export  function updateUserProfile(name, photoURL) {
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    }).then(() => {
      console.log("User profile updated.");
    }).catch((error) => {
      console.error("Error updating profile:", error);
    });
  }

export  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User is signed in
        const user = result.user;
        console.log("Google sign-in successful:", user);
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
      });
  }


export function handleLogin() {
    // Assume this function is called after a successful login
    const redirectURL = sessionStorage.getItem("redirectAfterLogin");

    if (redirectURL) {
        // Redirect the user back to the stored URL
        window.location.href = redirectURL;

        // Optionally, clear the session storage key so it doesn't redirect again
        sessionStorage.removeItem("redirectAfterLogin");
    } else {
        // If no redirect URL, go to a default page (e.g., dashboard)
        console.log("home");
        
    }
}

  
  
  