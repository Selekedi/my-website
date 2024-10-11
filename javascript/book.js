import { calculateDistance,initMap ,SuggestHotels,selectHotel,getLocation} from "./map.js";
import {auth} from "./thatothemc_firebase.js"
import { showElement,showSection } from "./utils.js";
const numDays = document.getElementById("numDays")
const mapdiv = document.getElementById("map")
const input = document.getElementById("placeSearch")
const prevBtns = document.querySelectorAll("main .book .bookings-container .controls .previous")
const continueBtns = document.querySelectorAll("main .book .bookings-container .controls .continue")
const dateField = document.querySelector("main .book .bookings-container .dates .date-fields")
const bookingsContainerDivs = document.querySelectorAll("main .book .bookings-container > div")
const noLocations = document.getElementById("numLocations")


const classesFowardIn = ["active","ForwardIn"]
const classesForwardOut = ["ForwardOut"]
const classesBackwardIn = ["active","BackwardIn"]
const classesBackwardOut = ["BackwardOut"]
let userId = initializeFromSessionStorage('userId', null),
  noOfDays = Number(initializeFromSessionStorage('noOfDays', 1)),
  dates = initializeFromSessionStorage('dates', []),
  noOfLocations = Number(initializeFromSessionStorage('noOfLocations',1)),
  lat = parseFloat(initializeFromSessionStorage('lat', 0)),
  lng = parseFloat(initializeFromSessionStorage('lng', 0)),
  distance = parseFloat(initializeFromSessionStorage('distance', 0)),
  duration = parseFloat(initializeFromSessionStorage('duration', 0)),
  price = parseFloat(initializeFromSessionStorage('price', 0));

  
  console.log(dates);
  


displayDates()
  
  
  
  
  


// If sessionStorage doesn't already have bookingData, set it to the defaultBookingData



// Retrieve and parse bookingData from sessionStorage


let bookingFlowTracker


if(sessionStorage.getItem("bookingFlowTracker") === "undefined"){
  sessionStorage.setItem("bookingFlowTracker",0)
  console.log("In");
  
}

bookingFlowTracker = Number(sessionStorage.getItem("bookingFlowTracker"))




export class Booking {
  constructor(){
    this.isActive = false
  }
  activate(){
    acticateBooking()
    this.isActive = true
  }
  deactivate(){
    deactivateBooking()
    this.isActive = false

  }
}



initMap(mapdiv,input)

continueBtns.forEach((btn,idx) => {
  btn.addEventListener('click',async e => {
    console.log("clicked");
    
    let flow = bookingFlowTracker
    console.log(flow);
    
    switch(flow){
      case 0:
        console.log(noOfDays);
              
        if(noOfDays > 0 && noOfDays <= 2){
          noOfDays = Number(updateSessionStorage('noOfDays',numDays.value))
          displayDates()
          showElement(flow + 2,bookingsContainerDivs,classesFowardIn,classesForwardOut)
          Move(flow + 1)


        }
        else {
          alert("enter correct number of dates")
        }
      break
      case 1:
        const datesSrc = dateField.querySelectorAll("input")
        const datesArr = []


        const availability = noOfDays === 1 ? await checkAvailability(datesSrc[0].value) : noOfDays === 2 ? await checkAvailability(datesSrc[0].value,datesSrc[1].value): null
        console.log(availability);
        

        if(!availability.available){
          alert("dates not availible")
          return
        }
        console.log(auth);
        

        if(!auth.currentUser){
          alert("register or log in")
          showSection(4)
          return
        }

        userId = updateSessionStorage("userId",auth.currentUser.uid)
        datesSrc.forEach(date => {
          datesArr.push(date.value)
        })
        dates = updateSessionStorage("dates",datesArr)
        showElement(flow + 2,bookingsContainerDivs,["active","ForwardIn"],["ForwardOut"])
        Move(flow + 1)
      break
      case 2:
        noOfLocations = Number(updateSessionStorage("noOfLocations",noLocations.value))
        showElement(flow + 2,bookingsContainerDivs,["active","ForwardIn"],["ForwardOut"])
        Move(flow + 1)
      break
      case 3:
        

      break
      case 4:

      break
      default:
        
    }
  })
})

prevBtns.forEach((btn,idx) => {
  btn.addEventListener("click", e=> {
    console.log("clicked");
    
    let flow = bookingFlowTracker
    console.log(flow);
    
    switch(flow){
      case 1:
        showElement(flow,bookingsContainerDivs,classesBackwardIn,classesBackwardOut)
        Move(flow - 1)
      break
      case 2:
        showElement(flow,bookingsContainerDivs,classesBackwardIn,classesBackwardOut)
        Move(flow - 1)
      break
      case 3:
        showElement(flow,bookingsContainerDivs,classesBackwardIn,classesBackwardOut)
        Move(flow - 1)
      break
      case 4:
        showElement(flow,bookingsContainerDivs,classesBackwardIn,classesBackwardOut)
        Move(flow - 1)
      break
      default:
    }
  })
})

function acticateBooking(){
  showSection(3)
  showElement(bookingFlowTracker + 1,bookingsContainerDivs,classesFowardIn,classesForwardOut)
  console.log("finished");
  
}

function deactivateBooking(){

}

console.log(bookingsContainerDivs);


async function checkAvailability(dateStart, dateEnd) {
    const url = "https://us-central1-thatothemc.cloudfunctions.net/checkDatesAvailability";
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateStart, dateEnd })  // Pass both dates as a JSON object
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      
      return data;  // Return the JSON response from the server
    } catch (error) {
      console.error("Error checking availability:", error);
      throw error;  // Rethrow the error to handle it in the caller
    }
}

async function createBooking(bookingData) {
    const url = "https://us-central1-thatothemc.cloudfunctions.net/createBooking";
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
}

function Move(index){
  sessionStorage.setItem('bookingFlowTracker',index)
  bookingFlowTracker = Number(sessionStorage.getItem('bookingFlowTracker'))
}

function initializeFromSessionStorage(key, defaultValue) {
  // If the item doesn't exist in sessionStorage, set it to the default value
  
  if (sessionStorage.getItem(key) === "undefined") {
    sessionStorage.setItem(key, JSON.stringify(defaultValue));
  }
  // Retrieve and parse the value from sessionStorage
  return JSON.parse(sessionStorage.getItem(key));
}



function updateSessionStorage(key, newValue) {
  // Update the value in sessionStorage
  sessionStorage.setItem(key, JSON.stringify(newValue));
  // Return the updated value
  return JSON.parse(sessionStorage.getItem(key));
}

function displayDates(){
  let input = `<input type = "date" class = "date">`
  let finalInputs = noOfDays === 1 ? input : input + input
  dateField.innerHTML = finalInputs
}


