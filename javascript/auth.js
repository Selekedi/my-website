import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,sendPasswordResetEmail,GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from  "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, doc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { auth,db } from "./firebase.js";

const provider = new GoogleAuthProvider();

export async function createUserAndGetUid(email, password) {
  try {
    // Create the user using email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // If user creation is successful, return the UID
    return userCredential.user.uid;
  } catch (error) {
    console.error("Error creating user:", error);

    // Return false if registration fails
    return false;
  }
}



export async function checkUserAuth() {
  try {
    const user = await new Promise((resolve, reject) => {
      onAuthStateChanged(auth, resolve, reject);
    });

    if (user) {
      // Get ID token if user is signed in
      const idToken = await user.getIdToken(true);
      return { user, idToken };  // Return both user and idToken
    }

    // If no user is signed in
    return null;
  } catch (error) {
    console.error("Error checking user auth:", error);
    throw error;  // Optionally, handle error by throwing or returning an error response
  }
}
  
  // Sign in existing user
  export async function loginUserWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        return true; // Return true if login is successful
    } catch (error) {
        console.error("Error logging in user:", error);
        return false; // Return false if login fails
    }
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

export async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      
      // User is signed in, return the UID
      return result.user.uid;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      
      // Return false if sign-in fails
      return false;
    }
}

async function updateUserCellNumber(uid, cellNumber) {
  try {
    // Reference the user's document in the 'users' collection
    const userRef = doc(db, "users",uid)

    // Update the user's document with the cell number
    await updateDoc(userRef,{
      cellNumber: cellNumber
    })
    console.log("Cell number updated successfully for user:", uid);
    return true;
  } catch (error) {
    console.error("Error updating cell number for user:", uid, error);
    return false; // Return false if the update fails
  }
}

export async function registerUserAndAddCell(email, password, cellNumber) {
  const uid = await createUserAndGetUid(email, password);
  if (!uid) {
    console.log("Failed to create user.");
    return false;
  }

  console.log("User created with UID:", uid);

  // Retry checking for Firestore document creation
  const maxRetries = 5;
  const delay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const userRef = doc(db, "users", uid)

    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists) {
      // Document created, update the cell number
      const success = await updateUserCellNumber(uid, cellNumber);
      if (success) {
        console.log("User created and cell number updated successfully.");
        return true;
      } else {
        console.log("User created, but failed to update cell number.");
        return false;
      }
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  console.log("User document was not created in time.");
  alert("User data was not created on time")
  return false;
}

export async function signInWithGoogleAndAddCell(cellNumber) {
  try {
    const result = await signInWithPopup(auth, provider);

    // User is signed in, get the UID
    const uid = result.user.uid;
    console.log("Google sign-in successful with UID:", uid);

    // Retry checking for Firestore document creation
    const maxRetries = 5;
    const delay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const docSnapshot = await db.collection("users").doc(uid).get();
      if (docSnapshot.exists) {
        // Document created, update the cell number
        const success = await updateUserCellNumber(uid, cellNumber);
        if (success) {
          console.log("User signed in and cell number updated successfully.");
          return true;
        } else {
          console.log("User signed in, but failed to update cell number.");
          return false;
        }
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.log("User document was not created in time.");
    return false;

  } catch (error) {
    console.error("Error during Google sign-in:", error);

    // Return false if sign-in fails
    return false;
  }
}
