import { initializeFromSessionStorage,updateSessionStorage } from "./utils.js";
import { registerUserWithEmail,resetPassword,signInWithGoogle ,handleLogin} from "./auth.js";


const AuthWrapper = document.getElementById("auth-wrapper")

let signUp = initializeFromSessionStorage("signUp",false)

let paragragraph = signUp ? `<p> Sign Up  </p>`: `<p> Log In  </p>`

let links = `
<div id = "links">
    <p>Continue with :</P>
    <div>
    <button class = " google-icon svg"></button>
    <button class = " apple-icon svg"></button>
    </div>
</div>`

let emailandPasswordSection =`
<div id = "emailandpassword">
    <input id = "email" type= "email"/>
    <input id = "password" type= "password"/>
    <button>Submit</button>

    <a href = "#">forgot password</a>

</div>
`
const signInLink = signUp ? `<p>if not registered,<a href = "#" >Sign Up</a></p>` : `<p>if not registered,<a href = "#" >Sign Up</a></p>`


function displayAuthPage(){
    AuthWrapper.innerHTML = paragragraph + emailandPasswordSection + links + signInLink

    const EmailAndPasswordBtn = document.querySelector("#emailandpassword > button")

}

window.addEventListener("DOMContentLoaded", e => {
    displayAuthPage()
})

function handleAuthWithEmailAndPassword(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    if(signUp){
        registerUserWithEmail(email,password)
        handleLogin()

    }

}
