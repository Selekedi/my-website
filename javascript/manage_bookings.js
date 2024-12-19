import { query, collection , where, onSnapshot} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { checkUserAuth } from "./auth.js";
import { db } from "./firebase.js";
import { showSvgs } from "./svgs.js";

const bookingWrapper = document.getElementById("bookings-wrapper")

let unsubscribeManageBookings = null

let userObject,idTokenObject

window.addEventListener("DOMContentLoaded",async e => {
    const Auth = await checkUserAuth()
    if(!Auth){
        sessionStorage.setItem("redirectAfterLogin",window.location.href)
        window.location.href = "auth.html"
        return
    }
    const {user,idToken} = Auth
    userObject = user
    idTokenObject = idToken
    loadManageBookingsPage(user.uid)


})

window.addEventListener("beforeunload", async e => {
    leaveManageBookingsPage()
})


function loadManageBookingsPage(userId) {
  // Clean up any previous listener
  if (unsubscribeManageBookings) {
    unsubscribeManageBookings();
  }

  const bookingsQuery = query(
    collection(db, "bookings"),
    where("userId", "==", userId)
  );

  // Set up the real-time listener
  unsubscribeManageBookings = onSnapshot(bookingsQuery, (snapshot) => {
    const bookings = [];
    snapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    if(bookings.length <= 0){
        populateBookingsWrapper(null)
    }else{
        populateBookingsWrapper(bookings)
    }
    // Update the UI with the bookings
  });
}

function leaveManageBookingsPage() {
  if (unsubscribeManageBookings) {
    unsubscribeManageBookings();
    console.log("Stopped listening to bookings");
  }
}

function populateBookingsWrapper(data){
    if(data == null){
        bookingWrapper.innerHTML = noBookings()
    }
    else {
        let bookings = data.map(item => bookingList(item)).join("")
        bookingWrapper.innerHTML = bookings
    }
    showSvgs()
}

function noBookings(){
    return `<div id = "no-bookings">
        <p>You Have  No Bookings</p>
        <span id = "empty-lsit-icon" class = "svg empty-list"></span>
        <a href = "/booking.html" id = "add-booking"> add booking <span class = "svg add"></span></a>
    </div>`
}

function bookingList(data){
    return `
    <a href = "manage_booking.html?bookingId=${data.id}" class = "booking">
        <div>
           <span class = "date">${data.date}</span>
            <span class = "type">${data.eventType}</span>
            <span class = "svg arrow-right"></span>
        </div>
    </a>`
}



