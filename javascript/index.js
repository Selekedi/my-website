import { showSvgs } from "./svgs.js"
import { checkUserAuth,logoutUser } from "./auth.js"
const headerNavList = document.querySelector("header nav ul.navlist")
const HeaderNavUtilities = document.querySelector("header nav ul.utilities")



window.addEventListener('DOMContentLoaded',async function(e){
   const Auth = await checkUserAuth()
   if(Auth){
      const myBookingNavLink = document.createElement("li")
      myBookingNavLink.textContent = 'My Bookings'
      myBookingNavLink.setAttribute("data-id","my-bookings")
      myBookingNavLink.onclick = () => {window.location.href = "manage_bookings.html"}
      headerNavList.append(myBookingNavLink)
      const LogOutBtn = document.createElement("li")
      LogOutBtn.textContent = "Log Out"
      LogOutBtn.setAttribute("data-id","log-out")
      LogOutBtn.onclick = () => {logoutUser();window.location.reload()}
      HeaderNavUtilities.append(LogOutBtn)
      
      const {user,idToken} = Auth
      if(isAdmin(idToken)){
         const dashboardLink = document.createElement("li")
         dashboardLink.textContent = "Admin Dash"
         dashboardLink.setAttribute("data-id","dash")
         dashboardLink.onclick = () => {window.location.href = "dashboard.html"}
         HeaderNavUtilities.append(dashboardLink)
      }
   }else{
      const signInLink =  document.createElement("li")
      signInLink.textContent = "Sign In"
      signInLink.setAttribute("data-id","sign-in")
      signInLink.onclick = () => {window.location.href = "auth.html"}
      HeaderNavUtilities.append(signInLink)
   }
    
   showSvgs() 

})

function isAdmin(idToken){
   const decoded = jwt_decode(idToken);
   return decoded.admin
}