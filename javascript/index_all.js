import { containsClass } from "./utils.js"
import { logoutUser } from "./auth.js"

const footerDate = document.querySelector("footer .year")
const navLinks = document.querySelectorAll("nav ul li")
const chatMneuIncons = document.querySelectorAll(".chat-menu .menu .svg")
const navToggleBar = document.querySelector("header .toggle .bar")
const navToggle = document.querySelector("header .toggle .toggle-btn")
const nav = document.querySelector("nav")
const navUl = nav.querySelector("ul")
const chatMenu = document.querySelector('.chat-menu .menu')
const chatToggle = chatMenu.querySelector(".toggle")
const chatMenuBtns = chatMenu.querySelectorAll("li")
const headerUtility = document.querySelector("header nav ul.utilities")
const headerUtilityLinks = document.querySelectorAll("header nav ul.utilities li")



//Setting year for the footer
const date = new Date()
footerDate.innerHTML = date.getFullYear()
// LOGIC FOR THE NAV LINKS
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        console.log("clicked");
        
        const relatedToBookings = ["book","my-bookings"]
        const linkId = link.dataset.id
        if(!relatedToBookings.includes(linkId)){
            let section =  document.getElementById(linkId)
            let position = section.offsetTop
            console.log(section);
            window.scrollTo({
                left:0,
                top:position
            })


            
            
        }
        else if(linkId == "book"){
            window.location.href = "booking.html"
        }
        else {
            window.location.href = "manage_bookings.html"
        }
        if(window.innerWidth <= 850){
            navToggle.classList.remove("opened")
            nav.style.height = 0
        }
        
        
    })
})

headerUtilityLinks.forEach(link => {
    link.addEventListener("click", async e => {
        const linkId = e.currentTarget.dataset.id
        switch(linkId){
            case "sign-in":
                window.location.href = "auth.html"
            break
            case "log-out":
                logoutUser()
                window.location.reload()
            break
            case "dash":
                window.location.href = "dashboard.html"
            break
            default:
        }
        if(window.innerWidth <= 850){
            navToggle.classList.remove("opened")
            nav.style.height = 0
        }
    })
})

//LOGIC FOR THE NAV TOGGLE

navToggle.addEventListener("click", e => {
    e.currentTarget.classList.toggle("opened")
    let navUlHeight = navUl.getBoundingClientRect().height
    let navUtilityHeigh = headerUtility.getBoundingClientRect().height
    let navHeight = nav.getBoundingClientRect().height
    if(navHeight === 0){
        nav.style.height = `${navUlHeight + navUtilityHeigh}px`
    }else {
        nav.style.height = '0px'
    }
})

// LOGIC FOR THE CHAT TOGGLE

chatToggle.addEventListener('click',e => {
    console.log('clicked');
    
    e.currentTarget.parentElement.classList.toggle("active")
})

//LOGIC FOR THE CHAT LINKS

chatMenuBtns.forEach(btn => {
    btn.addEventListener('click',e=> {
        let span = btn.querySelector("span")
        
        if(containsClass(span,"call-icon")){
            window.location.href = 'tel:+27822238836'
        }
        else if(containsClass(span,"whatsApp-icon")){
            const phoneNumber = '+27822238836';  // Replace with actual WhatsApp number
            window.location.href = `https://wa.me/${phoneNumber}`;
        }
        else if(containsClass(span,"mail-icon")){
            window.location.href = 'mailto:lepalakgwana@gmail.com'
        }
    })
})

//LOGIC FOR THE CONTACT SOCIAL LINKS

const contactUsLinkBtns = document.querySelectorAll("#contact-us .contact-us-container .links .button")
contactUsLinkBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault()
        if(containsClass(btn,"call-icon")){
            window.location.href = 'tel:+27822238836'
        }
        else if(containsClass(btn,"whatsApp-icon")){
            const phoneNumber = '+27822238836';  // Replace with actual WhatsApp number
            window.location.href = `https://wa.me/${phoneNumber}`;
        }
        else if(containsClass(btn,"mail-icon")){
            window.location.href = 'mailto:lepalakgwana@gmail.com'
        }
    })
})

// UPDATING THE COLORS OF CHATMENU ICONS

window.addEventListener("scroll",() => {
    updateFixedElementColors()
    chatMenuShowHide()
})
updateFixedElementColors()

function updateFixedElementColors(){
    let verticalPosition = window.scrollY
    const aboutSection = document.getElementById("about-us")
    const aboutUsTop = aboutSection.offsetTop
    
    if(verticalPosition >= 100){
        updateChatMenuIcons('#000')
    }else {
        updateChatMenuIcons('#fff')
    } 


}

function updateNavLinks(clr){
    navLinks.forEach(link => {
        link.style.color = clr
        link.style.fill = clr
    })

    navToggle.style.setProperty('--bg-clr',clr)
}


function updateChatMenuIcons(clr){
    chatMneuIncons.forEach(icon => {
        icon.style.color = clr
        icon.style.fill = clr
    })
}

function updateNavBackground(clr){
    const nav = document.querySelector("nav")
    nav.style.setProperty("--nav-bg",clr)
}

function chatMenuShowHide(){
    if(window.innerHeight > 500 && window.innerWidth < 500){
        let scrollPosition = window.scrollY
        let contactUsPageTop = document.getElementById("contact-us").offsetTop
        const chatContainer = document.querySelector('.chat-menu')

        if(scrollPosition > contactUsPageTop - 100){
            chatContainer.classList.add('hide')
        }else {
            chatContainer.classList.remove('hide')
        }
    }
}


