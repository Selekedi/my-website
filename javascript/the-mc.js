import { showSection,addActive,removeActive, showElement } from "./utils.js";
import { navLinks } from "./nav.js";

const imageContainer = document.querySelector('.logo .image-container');
const logoName = document.querySelector('.logo .name');
const theMcBackground = document.querySelector('main .the-mc .background');
const theMCHeader = document.querySelector('main .the-mc .about > h2')
const menuItems = document.querySelectorAll('main .the-mc .about .container .menu-container .menu > li')
const menuItemSpans = document.querySelectorAll('main .the-mc .about .container .menu-container .menu > li > span > span')
const texts = document.querySelectorAll('main .the-mc .about .container .text-container .text')
const paragraphs = document.querySelectorAll('main .the-mc .about .container .text-container .text > p')
const frameContainers = document.querySelectorAll('main .the-mc .about .container .visual-container > div')
const classesin = ["move-in",'active']
const classesout = ['move-out']
const backgroundAmbients = ['#005','#900','#030','#519','#126']

export class TheMC {
    constructor(){
        this.isActive = false
    }
    activate(){
        activateTheMC()
        this.isActive = true
    }
    deactivate(){
        deactivateTheMC()
        this.isActive = false
    }
}

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const numberOfStars = Math.floor((screenWidth * screenHeight) / 4000);

window.addEventListener("DOMContentLoaded", () => {
    paragraphs.forEach(paragraph => {
        const lines = paragraph.innerHTML.split("<br>")
        paragraph.innerHTML = lines.map((line,index) => `<span class="line" style="transition-delay: ${index * 0.3}s">${line}</span>`).join("")
        
    })
})

for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const posX = Math.random() * screenWidth;
    const posY = Math.random() * screenHeight;
    star.style.left = `${posX}px`;
    star.style.top = `${posY}px`;

    const delay = Math.random();
    star.style.animationDelay = `${delay}s`;

    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    theMcBackground.appendChild(star);
}



menuItems.forEach((item,idx) => {
    item.addEventListener('click', e => {
        
        menuItems.forEach((it,i) => {
            it.style.setProperty('--i',sub(menuItems.length,i,idx) + 1)
            
            if(i === idx){
                setTimeout(() => {
                    addActive(it)
                },1000) 
            }else removeActive(it)
        })
        theMcBackground.style.setProperty('--shade-ambient',backgroundAmbients[idx])
        texts.forEach((text,id) => {
            if(id === idx){
                if(text.classList.contains('active')){

                }else addActive(text)
            }else if(text.classList.contains('active')){
                removeActive(text)
            }
        })
        menuItemSpans.forEach((element,index) => {
            if(index === idx){
                element.style.setProperty('--active-border-clr',backgroundAmbients[idx])
            }
        })
        showElement(idx + 1,frameContainers,classesin,classesout)

        
        
    })
})


function activateTheMC() {
    showSection(2)
    logoName.style.color = '#fff'
    imageContainer.style.backgroundColor = '#fff'
    navLinks.forEach((link,indx) => {
        link.style.color = '#fff'
        link.style.setProperty('--bg--li','#fff')
        link.style.setProperty('--clr--li','#000') 
    })
    setTimeout(() => {
        addActive(theMcBackground);
    }, 2500);
    setTimeout(()=>{
        addActive(theMCHeader)
    },3000)
}

function deactivateTheMC() {
    removeActive(theMcBackground);
    removeActive(theMCHeader)
}

function sub(len,i,n){
    let diff = i - n
    if(diff <= 0){
        return len - (-diff)
    }else return diff
}