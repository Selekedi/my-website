let map, marker,placesService;
const defaultLocation = { lat: -24.526627030733763, lng: 30.063475070437796 };
const emceeBookingPrice = 1500




export async function initMap(mapDiv, input) {
  try {
    // Import Maps and Places libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { Autocomplete, PlacesService } = await google.maps.importLibrary("places");

    // Initialize map and marker
    const map = new Map(mapDiv, {
      center: defaultLocation, // Replace with actual default coordinates
      zoom: 10,
    });

    const marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
    });

    placesService = new PlacesService(map);

    // Initialize autocomplete
    const autocomplete = new Autocomplete(input);

    // Handle place selection from autocomplete
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        map.setCenter(location);
        map.setZoom(14);
        marker.setPosition(location);
      } else {
        console.error("Place does not have geometry.");
      }
    });

    // Allow the user to drag the marker to fine-tune the location
    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      console.log(`Marker moved to: ${position.lat()}, ${position.lng()}`);
    });

    // Add click event listener on the map to move marker to clicked position
    map.addListener("click", (event) => {
      const clickedLocation = event.latLng;
      marker.setPosition(clickedLocation);
      map.setCenter(clickedLocation);

      console.log(`Map clicked at: ${clickedLocation.lat()}, ${clickedLocation.lng()}`);
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}


// Confirm the final location selected by the user
export function getDistanceAndDuration() {
  const confirmedLocation = marker.getPosition();
  console.log(`Final location: ${confirmedLocation.lat()}, ${confirmedLocation.lng()}`);
  
  // You can now use this location to calculate distance or perform other actions
  return calculateDistance(confirmedLocation);
}


export function calculateDistance(eventLocation) {
  const { DistanceMatrixService } = google.maps;
  const service = new DistanceMatrixService();

  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [defaultLocation], // Emcee's home location
        destinations: [eventLocation], // Event location
        travelMode: 'DRIVING', // You can change to WALKING, BICYCLING, or TRANSIT
        unitSystem: google.maps.UnitSystem.METRIC, // To display distance in kilometers
      },
      (response, status) => {
        if (status === 'OK') {
          const result = response.rows[0].elements[0];

          if (result.status === 'OK') {
            const distance = result.distance.text;
            const duration = result.duration.text;

            console.log(`Distance: ${distance}, Duration: ${duration}`);

            // Resolve the Promise with distance and duration
            resolve({ distance, duration });
          } else {
            reject(`Error with the result: ${result.status}`);
          }
        } else {
          reject(`Distance Matrix failed due to: ${status}`);
        }
      }
    );
  });
}

export function getLocation(){
  return marker.getPosition()
}

export function SuggestHotels( eventLocation) {
  console.log("activated suggested hotels");
  
  // If distance is more than 50km, suggest hotels
    suggestHotelsNearEvent(eventLocation);
}

// Step 2: Search for nearby hotels
function suggestHotelsNearEvent(eventLocation) {
  console.log("inside the search places function");

  const request = {
    location: eventLocation,
    radius: '5000', // 5km radius for hotel search
    type: ['lodging'], // 'lodging' includes hotels
  };

  // Search for nearby hotels
  placesService.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Filter out hotels that don't have a price level
      const hotelsWithPrice = results

      // Display the filtered results
      console.log(results);
      
    } else {
      console.error("Error fetching hotels: " + status);
    }
  });
}

// Step 3: Display hotel options to the user
function displayHotelOptions(hotels) {
  console.log("inside display options");
  console.log(hotels);
  
  
  const hotelListContainer = document.getElementById("hotel-list"); // Assuming there's a container for hotels

  // Clear previous results
  hotelListContainer.innerHTML = "";

  hotels.forEach((hotel) => {
    // Create a list item for each hotel
    const hotelItem = document.createElement("div");
    hotelItem.innerHTML = `
      <p>${hotel.name}</p>
      <p>Rating: ${hotel.rating}</p>
      <p>Address: ${hotel.vicinity}</p>
      <button data-id="${hotel.place_id}">Select</button>
    `;
    hotelListContainer.appendChild(hotelItem);
    
  });
}

// Step 4: Handle hotel selection
export function selectHotel(placeId) {
  console.log("pressed");
  
  // Use PlacesService to get detailed information about the selected hotel
  placesService.getDetails({ placeId: placeId }, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const hotelPrice = calculateHotelPrice(place); // Custom function to get hotel price

      // Add the hotel price to the final booking cost
      addHotelCostToBooking(hotelPrice);

      console.log(`Selected hotel: ${place.name}, Price: ${hotelPrice}`);
    } else {
      console.error("Error fetching hotel details: " + status);
    }
  });
}

// Step 5: Calculate hotel price (you'll need to define this based on your pricing model)
export function calculateHotelPrice(hotel) {
  // Example: You can set up a pricing model or fetch actual hotel prices if available
  let price = 0;

  if (hotel.price_level) {
    // Price level ranges from 0 to 4 (based on Google API)
    price = hotel.price_level * 50; // Example: $50 per price level
  }

  return price;
}

// Step 6: Add the hotel cost to the final booking price
export function addHotelCostToBooking(hotelPrice) {
  let totalPrice = emceeBookingPrice; // Initial booking price for the emcee

  // Add the hotel price
  totalPrice += hotelPrice;

  // Update the booking cost in the UI
  document.getElementById("total-price").innerText = `Total Price: $${totalPrice}`;
}
