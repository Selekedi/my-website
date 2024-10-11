import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "./thatothemc_firebase.js";

export async function checkUserBookings(userId) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        // No bookings found, return false
        return false;
      }
  
      // Collect all the bookings found
      let bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, data: doc.data() });
      });
  
      // Return the bookings array
      return bookings;
    } catch (error) {
      // Log the error if needed
      console.error('Error checking user bookings:', error);
      // Return a specific message for network or other issues
      return 'Sorry, there\'s a network or other issue at play.';
    }
  }
  