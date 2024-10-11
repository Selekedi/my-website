import {addActive } from "./utils.js";
import { navLinks } from "./nav.js";
import { TheMC } from "./the-mc.js";
import { Hero } from "./hero.js";
import { Booking } from "./book.js";

document.addEventListener("DOMContentLoaded", function() {
const logo = document.querySelector('.logo')
const imageContainer = document.querySelector('.logo .image-container');
const logoName = document.querySelector('.logo .name');
let currentpage



const hero = new Hero();
const theMc = new TheMC();
const booking = new Booking()
const functions = [hero, theMc,booking];

logo.addEventListener('click',()=> {
    linkMove(0)
    changePage(0)
})

if(!sessionStorage.getItem('currentpage')){
    sessionStorage.setItem('currentpage',0)
}
currentpage = sessionStorage.getItem('currentpage')



setTimeout(() => {
    addActive(imageContainer);
}, 500);
setTimeout(() => {
    addActive(logoName);
}, 1500);

navLinks.forEach((link, index) => {
    link.addEventListener('click', e => {
        linkMove(index);
    });
});



function linkMove(index) {
    functions.forEach((func, idx) => {
        if (index === idx) {
            if(!func.isActive){
                func.activate();
                changePage(index)
            }
            
        } else {
            func.deactivate();
        }
    });
}

function changePage(index){
    sessionStorage.setItem('currentpage',index)
    currentpage = sessionStorage.getItem('currentpage')
}

linkMove(Number(currentpage))
});