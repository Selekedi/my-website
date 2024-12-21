import { onSnapshot, doc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { checkUserAuth, checkIfUserEmailVerified,sendVerificationEmail } from "./auth.js";
import { formatPaymentValue, updateSessionStorage } from "./utils.js";

let emailVerified,userObject,idTokenObject
let unsubscribeManageBooking = null;


const bookingId = getQueryParam("bookingId")

const dateCell = document.getElementById("date")
const typeCell = document.getElementById("type")
const totalPriceCell = document.getElementById("total-price")
const amountOwingCell = document.getElementById("amount-owing")
const controlsContainer = document.getElementById("controls")
const warningMessage = document.getElementById("warning")
const emailVerification = document.getElementById("emailVer")
const cancelModal = document.getElementById("cancel-modal")

const confirmBtn = `<button onclick="confirmBooking()" id="confirm-btn">Confirm Booking R500</button>`

window.addEventListener("DOMContentLoaded", async e => {
    console.log("lets go");
    const Auth = await checkUserAuth()
    
    if(!Auth){
        sessionStorage.setItem("redirectAfterLogin",window.location.href)
        window.location.href = "auth.html"
        return
    }

    const {user,idToken} = Auth
    userObject = user
    idTokenObject = idToken
    emailVerified = await checkIfUserEmailVerified(user)
    if(!emailVerified){
        emailVerification.innerHTML = `<button id= "email-ver-btn" onclick="sendVer()" >Resend Verification Email</button>`
    }
    console.log("we are in here");
    
    loadManageBookingPage(bookingId)
})

window.addEventListener("beforeunload", e => {
    leaveManageBookingPage()
})

function getPayFullAmountOwingBtn(AmountOwing){
    return `<button id="pay-amount-owing" onclick=payFullAmountOwing(${AmountOwing})>Pay Full Amount Owed R${AmountOwing}</button>`
}

function getCancelBtn(bookingId){
    return `<button id="cancel-btn" onclick="openCancelModal()">Cancel Booking</button>`
}

function getPayFullPriceBtn(price){
    return `<button id="pay-full-price" onclick="payFullPrice(${price})" >Pay Full Price R${price}</button>`
}



  function populateData(bookingData){
    dateCell.innerText = bookingData.date;
    typeCell.innerText = bookingData.eventType;
    totalPriceCell.innerText = formatPaymentValue(bookingData.totalPrice);
    amountOwingCell.innerText = formatPaymentValue(parseFloat(bookingData.totalPrice) - parseFloat(bookingData.amount_paid))
    const cancelBtn = getCancelBtn(bookingId)

    if(!bookingData.outstanding){
        controlsContainer.innerHTML = cancelBtn    
    }else if(!bookingData.confirmable && !bookingData.confirmed) {
        warningMessage.textContent = "Sorry, Someone has already secured this date"
        controlsContainer.innerHTML = cancelBtn     
    }else if(bookingData.confirmed){
        const payFullAmountBtn = getPayFullAmountOwingBtn(formatPaymentValue(parseFloat(bookingData.totalPrice) - parseFloat(bookingData.amount_paid)))
        controlsContainer.innerHTML = payFullAmountBtn + cancelBtn
    }else {
        const payFullPriceBtn = getPayFullPriceBtn(formatPaymentValue(bookingData.totalPrice))
        controlsContainer.innerHTML = confirmBtn + payFullPriceBtn + cancelBtn
    }
  }

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

async function getPaymentIdentifier(amount,bookingId,type) {
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
        bookingId,
        type // Example amount
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
async function processPayment(amount,bookingId,typeOfPayment) {
    const identifier = await getPaymentIdentifier(amount,bookingId,typeOfPayment);
    
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
        window.payfast_do_onsite_payment({"uuid": identifier},function(result){
            if(result === true){
                alert("payment successful")
            }
            else{
                alert("payment unsuccessful")
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

async function confirmBooking(){
    if(!emailVerified){
        alert("verify email before you proceed.")
        return
    }
    processPayment("500.00",bookingId,"confirm")
}

async function payFullAmountOwing(amount){
    if(!emailVerified){
        alert("verify email before you proceed.")
        return
    }
    processPayment(amount.toString(),bookingId,"payAmountOwing")
}

async function payFullPrice(amount){
    if(!emailVerified){
        alert("verify email before you proceed.")
        return
    }
    processPayment(amount.toString(),bookingId,"payFullAmount")
}

function sendVer(){
    const actionCodeSettings = {
        url: window.location.href, // Redirect back to the page where they initiated the verification
        handleCodeInApp: true,
      };
      
    sendVerificationEmail(userObject,actionCodeSettings)
    alert("verification email sent.")
}

function loadManageBookingPage(bookingId) {
    // Clean up any previous listener
    if (unsubscribeManageBooking) {
      unsubscribeManageBooking();
    }
  
    const bookingRef = doc(db, "bookings", bookingId);
  
    // Set up the real-time listener
    unsubscribeManageBooking = onSnapshot(bookingRef, (doc) => {
      if (doc.exists()) {
        console.log("Booking details:", doc.data());
        // Update the UI with the booking details
        populateData(doc.data())
      } else {
        console.log("No such booking!");
      }
    });
  }

  async function cancelBooking(bookingId,idToken){
    const dataToSend = {
        data:{bookingId}
    }
    const url = "https://us-central1-thatothemc.cloudfunctions.net/cancelBooking"
    
    try {
        const response = await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${idToken}`
            },
            body:JSON.stringify(dataToSend)
        })

        if(response.ok){
            const data = await response.json()
            console.log(data.result);
            
            return data.result.success
        }else {
            alert("couldnt delete try again");
            return false;
        }
    } catch (error) {
        return false
    }
  }

async  function cancelBtn(){
    try {
        const deleted = await cancelBooking(bookingId,idTokenObject)
        console.log(deleted);
        
        if(deleted){
         alert("booking cancelled")
         cancelModal.classList.remove("show")
         window.location.href = "manage_bookings.html"
        }else{
         alert("failed to cancel booking, try again")
        }
     } catch (error) {
         
     }
  }

    function noCancelBtn(){
        cancelModal.classList.remove("show")
    }

  function leaveManageBookingPage() {
    if (unsubscribeManageBooking) {
      unsubscribeManageBooking();
      console.log("Stopped listening to the booking");
    }
  }

function openCancelModal(){
    cancelModal.classList.add("show")
}

window.confirmBooking = confirmBooking
window.payFullAmountOwing = payFullAmountOwing
window.payFullPrice = payFullPrice
window.sendVer = sendVer
window.openCancelModal = openCancelModal
window.cancelBtn = cancelBtn
window.noCancelBtn = noCancelBtn

