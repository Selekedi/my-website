import { collection, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { checkUserAuth, checkIfUserEmailVerified } from "./auth.js";
import { formatPaymentValue } from "./utils.js";

const bookingId = getQueryParam("bookingId")

const dateCell = document.getElementById("date")
const typeCell = document.getElementById("type")
const totalPriceCell = document.getElementById("total-price")
const amountOwingCell = document.getElementById("amount-owing")
const controlsContainer = document.getElementById("controls")
const warningMessage = document.getElementById("warning")

const confirmBtn = `<button onclick="confirmBooking()" id="confirm-btn">Confirm Booking R500</button>`

window.addEventListener("DOMContentLoaded", async e => {
    const bookingData = await getBookingDetails(bookingId)
    populateData(bookingData)
})

function getPayFullAmountOwingBtn(AmountOwing){
    return `<button id="pay-amount-owing" onclick=payFullAmountOwing(${AmountOwing})>Pay Full Amount Owed R${AmountOwing}</button>`
}

function getCancelBtn(bookingId){
    return `<button id="cancel-btn" onclick="cancelBooking(${bookingId})">Cancel Booking</button>`
}

function getPayFullPriceBtn(price){
    return `<button id="pay-full-price" onclick="payFullPrice(${price})" >Pay Full Price R${price}</button>`
}

async function getBookingDetails(bookingId) {
    try {
      // Reference to the specific booking document
      const bookingRef = doc(db, 'bookings', bookingId);
      
      // Get the document data
      const bookingDoc = await getDoc(bookingRef);
      
      if (bookingDoc.exists()) {
        const bookingData = bookingDoc.data();
        console.log('Booking details:', bookingData);
        return bookingData;
      } else {
        console.log('No such booking found');
        return null;
      }
    } catch (error) {
      console.error('Error getting booking details:', error);
      return null;
    }
  }

  function populateData(bookingData){
    dateCell.innerText = bookingData.date;
    typeCell.innerText = bookingData.eventType;
    totalPriceCell.innerText = formatPaymentValue(bookingData.totalPrice);
    amountOwingCell.innerText = formatPaymentValue(parseFloat(bookingData.totalPrice) - parseFloat(bookingData.amount_paid))
    const cancelBtn = getCancelBtn(bookingId)

    if(!bookingData.confirmed && bookingData.confirmable){

        const payFullPriceBtn = getPayFullPriceBtn(formatPaymentValue(bookingData.totalPrice))
        controlsContainer.innerHTML = confirmBtn + payFullPriceBtn + cancelBtn
    }else if(bookingData.confirmed) {
        const payFullAmountBtn = getPayFullAmountOwingBtn(formatPaymentValue(parseFloat(bookingData.totalPrice) - parseFloat(bookingData.amount_paid)))
        controlsContainer.innerHTML = payFullAmountBtn + cancelBtn
    }else if(!bookingData.confirmable){
        warningMessage.textContent = "Sorry, Someone has already secured this date"
        controlsContainer.innerHTML = cancelBtn
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
    const {user,idToken} = await checkUserAuth()
    if(!user){
        return
    }

    const emailVerified = await checkIfUserEmailVerified(user)
    if(!emailVerified){
        return
    }

    processPayment("500.00",bookingId,"confirm")
}

async function payFullAmountOwing(amount){
    const {user,idToken} = await checkUserAuth()
    if(!user){
        return
    }

    const emailVerified = await checkIfUserEmailVerified(user)
    if(!emailVerified){
        return
    }
    processPayment(amount.toString(),bookingId,"payAmountOwing")
}

async function payFullPrice(amount){
    const {user,idToken} = await checkUserAuth()
    if(!user){
        return
    }

    const emailVerified = await checkIfUserEmailVerified(user)
    if(!emailVerified){
        return
    }
    processPayment(amount.toString(),bookingId,"payFullAmount")
}

window.confirmBooking = confirmBooking
window.payFullAmountOwing = payFullAmountOwing
window.payFullPrice = payFullPrice
