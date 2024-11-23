let map, marker;
const defaultLocation = { lat: -24.526627030733763, lng: 30.063475070437796 };



function loadGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
      const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDKQh5oq4tkN5rccotcz5A0Fs_xjNhn9g0&v=weekly`;

      // Check if the Google Maps script is already loaded
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src.startsWith(scriptUrl)) {
              console.log("Google Maps API is already loaded.");
              resolve();  // Resolve immediately if the script is already loaded
              return;
          }
      }

      // Script not found, so we dynamically load it using the custom method
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

      // Resolve when script is loaded
      resolve();
  });
}

export async function initMap(mapDiv, input, position) {
  const insidePosition = position !== null && position !== undefined ? position : defaultLocation;

  try {
      // Ensure the Google Maps API is loaded before proceeding
      await loadGoogleMapsAPI();

      // Import Maps and Places libraries
      const { Map } = await google.maps.importLibrary("maps");
      const { Autocomplete, PlacesService } = await google.maps.importLibrary("places");

      // Initialize map and marker
      map = new Map(mapDiv, {
          center: insidePosition, // Replace with actual default coordinates
          zoom: 10,
      });

      marker = new google.maps.Marker({
          position: insidePosition,
          map: map,
          draggable: true,
      });


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


export function getLocation(){
  let position = marker.getPosition()
  return { lat: position.lat(), lng: position.lng()}
}
