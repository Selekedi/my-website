import { createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail, onAuthStateChanged, sendEmailVerification } from  "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { doc, setDoc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { auth,db } from "./firebase.js";


export async function createUserAndGetUid(email, password) {
  try {
    // Create the user using email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // If user creation is successful
    return userCredential.user;
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
        alert("Password reset email sent!")
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        alert("Error sending password reset email, try again.")
      });
  }
  
export async function registerUserAndAddCell(email, password, cellNumber) {
  try {
    // Step 1: Create the user
    const user = await createUserAndGetUid(email, password);
    if (!user) {
      console.log("Failed to create user.");
      return false;
    }

    console.log("User created with UID:", user.uid);

    // Step 2: Create the Firestore document and add cell number
    
    const savedData = await saveUserData(user.uid,email,cellNumber)

    if(savedData){
      sendEmailVerification(user)
      .then(() => {
        console.log("Verification email sent.");
        alert("Verification email sent, Please confirm your email with.")
      })
      .catch((error) => {
        console.error("Error sending email verification:", error);
      });
    }
    

    console.log("User document created and cell number added successfully.");
    return true;
  } catch (error) {
    console.error("Error registering user and adding cell number:", error);
    return false;
  }
}


async function saveUserData(uid,email,cellNumber){
  const url = "https://us-central1-thatothemc.cloudfunctions.net/saveUser"
  const data = {
    uid,
    email,
    cellNumber
  }
  try {
    const response = await fetch(url,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      }
    )
    if(!response.ok){
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

export async function checkIfUserEmailVerified(user){
  if(!user.emailVerified){
    user.reload().then(() => {
      if(!user.emailVerified){
        sendEmailVerification(user).then(() => {
          alert("Email verification has been sent, please verify before proceeding")
        })
        .catch(() => {
          alert("couldnt sent email verification, try again")
        })
        return false
      }
      return true
    })
  }
  return true
}