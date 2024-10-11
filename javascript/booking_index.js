import { auth,db } from "./thatothemc_firebase.js";
import { checkUserBookings } from "./firebase-firestore.js";
import { initializeFromSessionStorage,updateSessionStorage,containsClass } from "./utils.js";
import { initMap ,getLocation} from "./map.js";


const bookingWrapper = document.getElementById("bookings-wrapper")
console.log(bookingWrapper);
const currentUser = auth.currentUser

let userId = initializeFromSessionStorage('userId', null ),
  noOfDays = Number(initializeFromSessionStorage('noOfDays', 1)),
  dates = initializeFromSessionStorage('dates', []),
  slots = initializeFromSessionStorage('slots',[]),
  frontPage = initializeFromSessionStorage('frontPage',true),
  noOfLocations = Number(initializeFromSessionStorage('noOfLocations',1)),
  locations = initializeFromSessionStorage('locations',[]),
  distances = initializeFromSessionStorage('distance', []),
  durations = initializeFromSessionStorage('duration', []),
  bookingFlowTracker = Number(initializeFromSessionStorage('bookingFlowTracker',0)),
  price = parseFloat(initializeFromSessionStorage('price', 0)),
  locationFlowTracker = Number(initializeFromSessionStorage("locationFlowTracker",0)),
  locationANearityOptions = initializeFromSessionStorage("locationANearityOptions","yes"),
  locationBNearityOptions = initializeFromSessionStorage("locationBNearityOptions","yes"),
  choosingLocationsTracker = Number(initializeFromSessionStorage("choosingLocationsTracker",0));

  console.log(userId,noOfDays,dates,slots,frontPage,noOfLocations,locations,distances,durations,bookingFlowTracker,price);

  if(currentUser){
    userId = updateSessionStorage("userId",currentUser.uid)
  }
  



window.addEventListener('DOMContentLoaded', e => {
    console.log(frontPage);
    
    loadPage()
})

window.onload = function () {
    sessionStorage.removeItem("redirectAfterLogin");
};


function loadPage(){
    if(frontPage){
        displayFristPage()
    }
    else initializeBookings()
}

async function displayFristPage(){
    const firstPage = `
    <div id = "container">
        <div class = "create-booking">
            <p>create new booking</p>
            <span class = "add-icon svg"></span>
        </div>
        <div class = "your-bookings"></div>
    </div>`
    bookingWrapper.innerHTML = firstPage
    const handleAddBtnsClick = () => {
        updateSessionStorage('frontPage',false)
        initializeBookings()
    }

    const addBookingBtns = document.querySelectorAll("#bookings-wrapper > #container .add-icon")
    addBookingBtns.forEach(btn => {
        btn.removeEventListener("click",handleAddBtnsClick)
        btn.addEventListener("click",handleAddBtnsClick)
    })
    const yourBookings = document.querySelector("#bookings-wrapper > #container > .your-bookings")

    const noUser = `
    <div>
        <p>
            Your are not logged in
            <a href = "./auth.html">
            Log in or Sign Up</a> 
        </p>
    </div>`

    const noBookings = `
        <div>
            <p>
                You have no bookings
            </p>
            <div>
                <span>Add new Bookings</span>
                <span class = "add-icon svg"></span>
            </div>
        </div>
    `
    const networkErrorMessage = `
    <div>
        <p>
            Couldnt resolve, reload page
        </p>
    </div>
    `

    if(userId){
        const result = await checkUserBookings(userId)

        if (result === false) {
            yourBookings.innerHTML = noBookings
            // Update the UI to show no bookings message
          } else if (Array.isArray(result)) {
            console.log('Your bookings:', result);
            // Update the UI to display the bookings
          } else {
            yourBookings.innerHTML = networkErrorMessage
          }
    } else yourBookings.innerHTML = noUser

}
function initializeBookings(){
    const boookingContainer =  `
    <div id = "booking container">
        <div id = "section-container></div>
        <div id = "controls">
            <button class = "previous">Previous</button>
            <button class = "continue">Continue</button>
        </div>
    </div>`

    bookingWrapper.innerHTML = boookingContainer

    initializeControls()
}

function initializeControls(){
    const controls = document.getElementById("controls")
    const btns = controls.querySelectorAll("button")
    btns.forEach(btn => {
        btn.addEventListener("click",e => {
            if(containsClass(btn,"previous")){
                switch(bookingFlowTracker){
                    case 0:
                        updateFrontPage(true)
                        loadPage()
                    break
                    case 1:
                        updateBookingFlowTracker(0)
                        manageBookingFlow()

                    break
                    case 2:
                        manageLocationFLow("reverse")
                    break
                    case 3:

                    break
                    case 4:

                    break
                    case 5:

                    break
                    default:
                }
            }
            else if(containsClass(btn,"continue")){
                switch(bookingFlowTracker){
                    case 0:
                        updateNoODays()
                        updateBookingFlowTracker(1)
                        manageBookingFlow()
                    break
                    case 1:
                        updateDates()
                        updateBookingFlowTracker(2)
                        manageBookingFlow()
                    break
                    case 2:
                        manageLocationFLow("forward")
                    break
                    case 3:

                    break
                    case 4:

                    break
                    case 5:

                    break
                    default:
                }
            }
        })
    })

}

function manageBookingFlow(){
    switch(bookingFlowTracker){
        case 0:
            displayNoOfDaysSection()
        break
        case 1:
            displayDateSelection()
        break
        case 2:
            manageLocationDisplay()
        break
        case 3:

        break
    }
}

function displayLocations(){
    const sectionContainer = document.getElementById("section-container")

    const locationSection = `
    <div id = "location-section">
        
    </div>

    `
    sectionContainer.innerHTML = locationSection
}

function displayNoOfDaysSection(){
    const sectionContainer = document.getElementById("section-container")

    const howManyDaysSection = `
        <div >
            <p>
                how many days
            </p>
            <input  id = "no-of-days-selection" type = "number" max = "2" value = "${noOfDays}" />
        </div>
    `
    sectionContainer.innerHTML = howManyDaysSection
}

function displayDateSelection(){
    const sectionContainer = document.getElementById("section-container")
    const container = `
    <div id = "date-selection-fields">
        
    </div>
    `
    sectionContainer.innerHTML = container

    const dateContainer = document.getElementById('date-selection-fields')

    let input = noOfDays === 1 ? `<inpur id = "first-date" type = "date" value = "${dates[0] || getTodayDate()}"/>`: noOfDays === 2? `<input id = "first-date" type = "date" value = "${dates[0] || getTodayDate() }" /><input id = "second-date" type = "date" value = "${dates[1] || getTodayDate() }" />`:'<p>Enter a valid number of days</p>'

    dateContainer.innerHTML = input
}

function updateFrontPage(val){
    frontPage = Boolean(updateSessionStorage("frontPage",val))
}

function updateBookingFlowTracker(val){
    bookingFlowTracker = Number(updateSessionStorage("bookingFlowTracker",Number(val)))
}

function updateNoODays(){
    const noOfDaysInputValue = document.getElementById("no-of-days-selection").value
    noOfDays = Number(updateSessionStorage("noOfDays",Number(noOfDaysInputValue)))
}

function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function updateDates(){
    if(!(noOfDays > 2 || noOfDays < 1)){
        const date = document.getElementById("first-date").value
        switch(noOfDays){
            case 1:
                dates = updateSessionStorage("dates",[date])
            break
            case 2:
                const secondDate = document.getElementById("second-date").value
                dates = updateSessionStorage("dates",[date,secondDate])
            break
            default:
        }
    }
}

async function manageLocationFLow(direction){
    switch(direction){
        case "reverse":
            switch(locationFlowTracker){
                case 0:
                    updateBookingFlowTracker(1)
                    manageBookingFlow()
                break
                case 1:


                break
                case 2:

                break
                case 3:

                break
                case 4:

                break
                default:

            }
        break
        case "forward": 
        switch(locationFlowTracker){
            case 0:
                const nooflocations = document.getElementById("no-of-locations").value
                updateNoOfLocations(nooflocations)
                updateLocationFlowTracker(1)
                manageLocationDisplay()
            break
            case 1:
                updateNearityOptions()
                if(noOfDays === 1 && locationANearityOptions === "yes"){
                    const loc = await fetchUserLocation()
                    updateLocationFlowTracker(3)
                    manageLocationDisplay()
                    locations = updateSessionStorage("locations",[loc])
                }else if(noOfDays === 2 && locationANearityOptions === "yes" && locationBNearityOptions === "yes"){
                    const loc = await fetchUserLocation()
                    locations = updateSessionStorage("locations",[loc,loc])
                    updateLocationFlowTracker(3)
                    manageLocationDisplay()
                }else {
                    updateLocationFlowTracker(2)
                    manageLocationDisplay()

                }
                
            break
            case 2:
                updateLocationsRetrivedFromGoogleMaps()
            break
            case 3:

            break
            case 4:

            break
            default:

        }   
        break
        default:
    }
    
}

function updateLocationFlowTracker(val){
    locationFlowTracker = Number(updateSessionStorage("locationFlowTracker",val))

}

function updateNoOfLocations(val){
    noOfLocations = Number(updateSessionStorage("noOfLocations",val))
}

function manageLocationDisplay(){
    displayLocations()
    switch(locationFlowTracker){
        case 0:
            if(noOfDays === 1){
                updateLocationFlowTracker(1)
                manageLocationDisplay()
            }
            else displayNoOfLocations()    
        break
        case 1:
            displayNearityToLocationEvent()
        break
        case 2:
            displayLocationsSelectionSection()
        break
        case 3:

        break
        case 4:

        break
    }
}

function displayNoOfLocations(){
    const locationContainer = document.getElementById("location-section")

    const noOfLocationsSections = `
        <input id = "no-of-locations" type = "number" max = "2" min = "1" value = "${noOfLocations}" />
    `

    locationContainer.innerHTML = noOfLocationsSections
}

function displayNearityToLocationEvent(){
    const locationContainer = document.getElementById("location-section")
    if(noOfLocations === 1){
        const form = `
        <div>
            <p>Are you within 10 km of Location A?</p>
            <label><input type="radio" name="locationA" value="yes"> Yes</label>
            <label><input type="radio" name="locationA" value="no"> No</label>
            <label><input type="radio" name="locationA" value="not-sure"> Not Sure</label>
        </div>`
        locationContainer.innerHTML = form

    }
    else if(noOfLocations === 2){
        const form = `
            
        <div>
            <p>Are you within 10 km of Location A?</p>
            <label><input type="radio" name="locationA" value="yes"> Yes</label>
            <label><input type="radio" name="locationA" value="no"> No</label>
            <label><input type="radio" name="locationA" value="not-sure"> Not Sure</label>
        </div>

        <div>
            <p>Are you within 10 km of Location B?</p>
            <label><input type="radio" name="locationB" value="yes"> Yes</label>
            <label><input type="radio" name="locationB" value="no"> No</label>
            <label><input type="radio" name="locationB" value="not-sure"> Not Sure</label>
        </div>
        
        `
        locationContainer.innerHTML = form
        
    }
    setCheckedButton()
}

function displayLocationsSelectionSection(){
    manageMapUsageForLocationRetrieval()
}

function manageMapUsageForLocationRetrieval(){
    const locationContainer = document.getElementById("location-section")
    const oneday = noOfDays === 1;
    const bothDays = (locationANearityOptions === "no" || locationANearityOptions === "not-sure") && (locationBNearityOptions === "no" || locationBNearityOptions === "not-sure");
    const onlyLocationA = locationANearityOptions === "no" || locationANearityOptions === "not-sure";
    const onlyLocationB = locationBNearityOptions === "no" || locationBNearityOptions === "not-sure";
    let paragragraph
    loadGoogleMapsAPI()
    if(oneday){
        paragragraph = `<p>Search Or Mark Location</p>`
    }else if(bothDays){
        if(choosingLocationsTracker === 0){
            paragragraph = `<p> Search Or Enter Location A</p>`
        }
        else if(choosingLocationsTracker === 1){
            paragragraph = `<p> Search Or Enter Location B</p>`   
        }
    }else if(onlyLocationA){
        paragragraph = `<p> Search Or Enter Location A</p>`
    
    }else if(onlyLocationB){
        paragragraph = `<p> Search Or Enter Location B</p>` 
    }
    
    const mapDiv = `
        <div id ="map"></div>
    `
    const mapInput = `<input type = "text" id = "map-input" placeholder = "Search Location"/>`
    locationContainer.innerHTML = paragragraph + mapInput + mapDiv

    const mapDivFromHtml = document.getElementById("map")
    const mapInputFromHtml = document.getElementById("map-input")
    initMap(mapDivFromHtml,mapInputFromHtml)
    
    
} 

async function updateLocationsRetrivedFromGoogleMaps(){
    const oneday = noOfDays === 1;
    const bothDays = (locationANearityOptions === "no" || locationANearityOptions === "not-sure") && (locationBNearityOptions === "no" || locationBNearityOptions === "not-sure");
    const onlyLocationA = locationANearityOptions === "no" || locationANearityOptions === "not-sure";
    const onlyLocationB = locationBNearityOptions === "no" || locationBNearityOptions === "not-sure";

    if(oneday){
        locations = updateSessionStorage("locations",[getLocation()])
        updateLocationFlowTracker(3)
        manageLocationDisplay()
    }else if(bothDays){
        if(choosingLocationsTracker === 0){
            locations = updateSessionStorage("locations",[getLocation()])
            choosingLocationsTracker = updateSessionStorage("choosingLocationsTracker",1)
            manageLocationDisplay()
        }
        else if(choosingLocationsTracker === 1){
            locations = updateSessionStorage("locations",[locations,getLocation()])
            updateLocationFlowTracker(3)
            manageLocationDisplay()
        }
    }else if(onlyLocationA){
        locations = updateSessionStorage("locations",[getLocation(), await getUserLocation()])
        updateLocationFlowTracker(3)
        manageLocationDisplay()
    }else if(onlyLocationB){
        locations = updateSessionStorage("locations",[getUserLocation, getLocation()])
        updateLocationFlowTracker(3)
        manageLocationDisplay()
    }


}

function setCheckedButton() {
    const button = document.querySelector(`input[name="locationA"][value="${locationANearityOptions}"]`)
    switch(noOfLocations){
        
        case 1:
            if (button) {
                button.checked = true; // Add class for visual indication
            }
        break
        case 2:
            const button2 = document.querySelector(`input[name="locationB"][value="${locationBNearityOptions}"]`)
            if (button && button2) {
                button.checked = true;
                button2.checked = true // Add class for visual indication
            }
        break
        default:
    }
    // Validate the input
    
    
}

function updateNearityOptions() {
    switch (noOfLocations) {
        case 1:
            // For location A (only one location)
            const selectedOptionA = document.querySelector('input[name="locationA"]:checked');
            if (selectedOptionA) {
                locationANearityOptions = updateSessionStorage("locationANearityOptions",selectedOptionA.value); // Update the nearness option for location A
            }
            break;
        
        case 2:
            // For two locations: location A and location B
            const selectedOptionA2 = document.querySelector('input[name="locationA"]:checked');
            const selectedOptionB2 = document.querySelector('input[name="locationB"]:checked');
            
            if (selectedOptionA2) {
                locationANearityOptions = selectedOptionA2.value; // Update location A nearness
                locationANearityOptions = updateSessionStorage("locationANearityOptions",selectedOptionA2.value);

            }
            if (selectedOptionB2) {
                locationBNearityOptions = selectedOptionB2.value; // Update location B nearness
                locationBNearityOptions = updateSessionStorage("locationBNearityOptions",selectedOptionB2.value);
            }
            break;
        
        default:
            console.error('Invalid number of locations');
    }
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Return an object with lat and lon
                    resolve({ lat: latitude, lon: longitude });
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

function loadGoogleMapsAPI() {
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDKQh5oq4tkN5rccotcz5A0Fs_xjNhn9g0&v=weekly`;

    // Check if the Google Maps script is already loaded
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.startsWith(scriptUrl)) {
            console.log("Google Maps API is already loaded.");
            return;
        }
    }

    // Script not found, so we dynamically load it
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
        console.log("Google Maps API has been loaded.");
        
        // Inline logic for configuring Google Maps API
        (g => {
            var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
            b = b[c] || (b[c] = {});
            var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a);
            }));
            d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
        })({
            key: "AIzaSyDKQh5oq4tkN5rccotcz5A0Fs_xjNhn9g0",
            v: "weekly",
        });
    };
    script.onerror = () => console.error("Error loading the Google Maps API.");

    // Append the script to the document
    document.head.appendChild(script);
}

// Example usage

function checkAuthAndRedirect() {
 // Assume this checks if the user is authenticated

    if (!userId) {
        // Save the current URL in session storage
        const currentURL = window.location.href;
        sessionStorage.setItem("redirectAfterLogin", currentURL);

        // Redirect to login page
        window.location.href = "auth.html";
    }
}

// Example call when loading the restricted page

function finalProcessing(){
    checkAuthAndRedirect()

}