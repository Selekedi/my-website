import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection , addDoc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
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
const db = getFirestore(app)
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfxEmYqAAAAAPpCrqDnHETDY2h56wEsEtLu67qX')
})

document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault()
    const cellNumber = document.querySelector('input[name="cellNumber"]').value
    const emailAddress = document.querySelector('input[name="emailAddress"]').value
    const amount = document.querySelector('input[name="amount"]').value
    processPayment(amount,emailAddress,cellNumber)
})

async function getPaymentIdentifier(amount,emailAddress,cellNumber) {
try {
    const response = await fetch(
    "https://us-central1-thatothemc.cloudfunctions.net/getPaymentIdentifier",
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        amount,
        emailAddress,
        cellNumber, // Example amount
         // Replace with actual email
        // other required fields
        }),
    }
    );

    if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(`${response.status} , ${errorMessage.error}`);
    }

    const data = await response.json();
    console.log("Payment Identifier:", data.identifier);
    return data.identifier; // Return the identifier
} catch (error) {
    console.error("Error:", error);
    return null; // Return null if there was an error
}
}

// Use the identifier somewhere else in your code
async function processPayment(amount,emailAddress,cellNumber) {
    const identifier = await getPaymentIdentifier(amount,emailAddress,cellNumber);
    
    if (identifier) {
        // Use the identifier where needed
        console.log("Using Identifier:", identifier);
        // Example of using it in another function
        continuePaymentProcess(identifier);
    } else {
        console.error("Could not retrieve identifier.");
        alert("something went wrong")
    }
}

// Another function that continues with payment processing
function continuePaymentProcess(identifier) {
    // Load the PayFast script and proceed once it's fully loaded
    loadPayfastScript().then(() => {
        // Now you can safely call the on-site payment function
        window.payfast_do_onsite_payment({"uuid": identifier}, function (result) {
            if (result === true) {
                // Payment Completed
                console.log("Payment completed successfully");
            } else {
                // Payment Window Closed
                console.log("Payment window closed without completing payment");
            }
        });
    }).catch(error => {
        console.error("Failed to load PayFast script:", error);
    });
}

function loadPayfastScript() {
    return new Promise((resolve, reject) => {
        if (document.querySelector("script[src='https://sandbox.payfast.co.za/onsite/engine.js']")) {
            resolve(); // Script already loaded
            return;
        }

        const script = document.createElement("script");
        script.src = "https://sandbox.payfast.co.za/onsite/engine.js";

        // Resolve the promise when the script loads successfully
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load the PayFast script."));

        document.head.append(script);
    });
}
