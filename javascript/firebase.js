import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { initializeFirestore, enableIndexedDbPersistence} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app-check.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWdTOmnSl2Lcmfxag0SiYey4zDReTXrVU",
    authDomain: "thatothemc.firebaseapp.com",
    projectId: "thatothemc",
    storageBucket: "thatothemc.appspot.com",
    messagingSenderId: "399320708995",
    appId: "1:399320708995:web:e18f7b508b9d18d5a468b6",
    measurementId: "G-93KJ5YEH4J"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
    cacheSizeBytes:10 * 1048576,
    experimentalTabSynchronization: true
})
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfxEmYqAAAAAPpCrqDnHETDY2h56wEsEtLu67qX'),
    isTokenAutoRefreshEnabled: true
})
export const auth = getAuth(app);

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log("Persistence failed due to multiple tabs open");
    } else if (err.code == 'unimplemented') {
      console.log("Persistence is not available in this environment");
    }
  });

