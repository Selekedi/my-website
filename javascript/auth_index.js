import { checkUserAuth, loginUserWithEmail, registerUserAndAddCell, resetPassword } from "./auth.js";
import { initializeFromSessionStorage,updateSessionStorage } from "./utils.js";



const authHeader =  document.getElementById('auth-header')
const cellphoneLabel = document.querySelector('label[for="phoneNumber"]')
const cellphoneInput = document.querySelector("input#phoneNumber")
const authLink = document.getElementById("auth-link")
const form = document.getElementById("form")
const emailPasswordBtn = document.getElementById("emailRegisterButton")
const forgotPasswordBtn = document.getElementById("forgot-password-btn")
const forgotPasswordLink = document.getElementById("forgot-password")

let signUp = initializeFromSessionStorage("signUp",false)
function updateAuthScreen(){
    if(!signUp){
        authHeader.textContent = "Log In"
        cellphoneInput.style.display = "none"
        cellphoneLabel.style.display = "none"
        authLink.innerHTML = `<p id="auth-link">dont have an account? <a href="#" onclick="event.preventDefault(); handleToggle()" id="sign-up">Register Here</a></p>`
        emailPasswordBtn.textContent = "Sign in With Email"
        forgotPasswordBtn.style.display = "block"
    }else {
        authHeader.textContent = "Sign Up"
        cellphoneInput.style.display = "block"
        cellphoneLabel.style.display = "block"
        authLink.innerHTML = `<p id="auth-link">Already have an account? <a href="#" onclick="event.preventDefault(); handleToggle()" id="sign-up">Sign In Here</a></p>`
        emailPasswordBtn.textContent = "Sign Up With Email"
        forgotPasswordBtn.style.display = "none"
    }
}

function handleToggle(){
    signUp = updateSessionStorage("signUp",!signUp)
    updateAuthScreen()
}
window.handleToggle = handleToggle
updateAuthScreen()

emailPasswordBtn.onclick = async () => {
    
    let emailValue = document.getElementById("email").value
    let password = document.getElementById("password").value
    let phoneNumber = document.getElementById("phoneNumber").value

    if(!validateEmail(emailValue)){
        alert("Enter Valid Email")
        return
    }

    

    if(signUp){
        if(!validatePhoneNumber(phoneNumber)){
            alert("Enter Valid Phone Number")
            return
        }

        let createdAccount =  await registerUserAndAddCell(emailValue,password,phoneNumber)
        if(!createdAccount){
            alert("Couldn't Create Acoount, Try Again")
            return
        }
    }else {
        let isSignedIn = await loginUserWithEmail(emailValue,password)
        if(!isSignedIn){
            alert("Couldnt Sign In, Try Again")
            return
        }
    }
    handleRedirect()

}

forgotPasswordLink.addEventListener("click", async e => {
    e.preventDefault()
    const emailValue = document.getElementById("email").value
    if(!validateEmail(emailValue)){
        alert("Enter Email")
        return
    }
    resetPassword(emailValue)
})

function handleRedirect(){
    const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
    if(!redirectUrl || redirectUrl === "undefined"){
        window.location.href = "index.html"
        return
    }
    window.location.href = redirectUrl

    sessionStorage.removeItem("redirectAfterLogin")
}

function validateEmail(email) {
    // Regular expression for validating an email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
}

export function validatePhoneNumber(phone) {
    // Regular expression to validate phone numbers starting with + or 0
    const phoneRegex = /^(\+?\d{1,3})?[0]\d{9}$/;

    // Test the phone number against the regular expression
    return phoneRegex.test(phone);
}
