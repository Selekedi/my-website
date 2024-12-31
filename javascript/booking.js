import { checkUserAuth } from "./auth.js"
import { initMap, getLocation } from "./map.js"
import { auth } from "./firebase.js"
import { initializeFromSessionStorage, updateSessionStorage } from "./utils.js"


const form =  document.getElementById("form")
const date = document.getElementById("date")
const typeOfEvent = document.getElementById("type")

let dateFromStorage = initializeFromSessionStorage("date",null)
let typeOfEventFromStorage = initializeFromSessionStorage("type",null)
let coords = initializeFromSessionStorage("coords",null)

if(dateFromStorage){
    date.value = dateFromStorage
}

if(typeOfEventFromStorage){
    typeOfEvent.value = typeOfEventFromStorage
}


const mapDiv = document.getElementById("mapDiv")
const autoCompleteInput = document.getElementById("autoComplete")


window.addEventListener("DOMContentLoaded", async () => {
    if(coords){
        initMap(mapDiv,autoCompleteInput,coords)
    }else {
        try {
            // Fetch the user's location (assumed to be an async function)
            const userLocation = await fetchUserLocation(); // Wait for the location to be fetched
            console.log(userLocation);
            
    
            // Initialize the map with the fetched user location
            initMap(mapDiv, autoCompleteInput, userLocation);
        } catch (error) {
            console.error("Error fetching user location:", error);
            initMap(mapDiv, autoCompleteInput, null);
        }
    }
    
});




form.addEventListener("submit",async e => {
    e.preventDefault()
    let dateValue = date.value
    let newDate = new Date(dateValue)
    let currentDate = new Date()
    let userLoc = getLocation()
    console.log(userLoc);
    
        
    if(isNaN(newDate.getTime()) ||currentDate.getTime() >= newDate.getTime()  ){
        alert("invalid date, Enter a new date")
        return
    }

    dateFromStorage = updateSessionStorage("date",dateValue)

    let typeOfEventValue = typeOfEvent.value
    if(typeOfEventValue === ""){
        alert("enter type of event")
        return
    }

    typeOfEventFromStorage = updateSessionStorage("type",typeOfEventValue)
    coords = updateSessionStorage("coords",userLoc)

    let availibility = await checkDateAvailability(dateValue)
    console.log(availibility.available);
    

    if(!availibility.available){
        alert("Sorry, the date has already been booked")
        return
    }

    let Auth = await checkUserAuth()
    if(!Auth){
        sessionStorage.setItem("redirectAfterLogin","booking.html")
        window.location.href = "auth.html"
        return
    }
    const {user,idToken} = Auth
    
    const bookingData = await createBooking(dateValue,typeOfEventValue,userLoc,idToken)
    const bookingId = bookingData.bookingId
    window.location.href = `manage_booking.html?bookingId=${bookingId}`


    
})

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Return an object with lat and lon
                    resolve({ lat: latitude, lng: longitude });
                },
                (error) => {
                    reject(error); // Handle error if user denies location or something goes wrong
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

async function fetchUserLocation() {
    try {
        const location = await getUserLocation();
        return location; // Return the location object
    } catch (error) {
        console.error("Error fetching location:", error.message);
        return null; // Return null or handle the error in another way
    }
}

async function checkDateAvailability(date) {
    try {
        const response = await fetch('https://checkdateavailability-wifkgbqvcq-uc.a.run.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error to handle it in the calling code if needed
    }
}

async function createBooking(date, eventType, userCoordinates, idToken) {
    console.log(idToken);
    
    const url = "https://us-central1-thatothemc.cloudfunctions.net/createBooking";  // Replace with your actual Cloud Function URL
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,  // Include the user's Firebase ID token in the Authorization header
    };
  
    const bookingData = {
      date,
      eventType,
      userCoordinates
    };
  
    try {
      // Send POST request to Firebase Cloud Function
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bookingData),
      });
  
      if (!response.ok) {
        // If the request fails, throw an error
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }
  
      const data = await response.json();
      console.log("Booking created successfully:", data);
      return data;  // Return the booking data or response for further use
  
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error);  // Show error message to the user
    }
  }
  