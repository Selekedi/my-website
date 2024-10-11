import { showElement,showSection,addActive,removeActive } from "./utils.js";
import { navLinks } from "./nav.js";

const imageContainer = document.querySelector('.logo .image-container');
const logoName = document.querySelector('.logo .name');
const heroBackground = document.querySelector('main .hero .background');
const heroCarousel = document.querySelector('main .hero #carousel');
const HeroContainer = document.querySelector('main .hero .menu');
const paragraph = document.querySelector(".animated-paragraph");
const specials = document.querySelectorAll('.special');
const specialsContent = document.querySelectorAll('.special > div');
const heroframes = document.querySelectorAll('.special > div iframe')
let specialsIntervalId;
let carouselTimeoutId;
const heroBgColors = ['#999','#A1D6B2','#A02334']
const heroHeadlineSpanColors = ['#ff0','#A1D6CF','#87CEEB']
const classesin = ['active','circularIn']
const classesout = ['circularOut']


export class Hero {
    constructor(){
        this.isActive = false
    }

    activate() {
        activateHero();
        this.isActive = true
    }
    deactivate() {
        deactivateHero();
        this.isActive = false
    }
}

for(let i = 0;i < 3;i++){
    let slide = document.createElement("div")
    slide.style.width = '100px'
    slide.style.height = '100px'
    heroCarousel.append(slide)
}

const heroCarouselbuttons = document.querySelectorAll('main .hero #carousel div')

heroCarouselbuttons.forEach((btn,idx) => {
    btn.addEventListener('click', e => {
        showElement(idx + 1, specials,classesin,classesout);
        showElement(idx + 1, specialsContent,classesin,classesout);
        frameChanges(idx + 1)
        changeHeroBackgroud(idx + 1)
    })
})

function activateHero() {
    showSection(1);
    logoName.style.color = '#000'
    imageContainer.style.backgroundColor = '#000'
    navLinks.forEach((link,indx) => {
        link.style.color = '#000'
        link.style.setProperty('--bg--li','#000')
        link.style.setProperty('--clr--li','#fff') 
    })
    const lines = paragraph.innerHTML.split("<br>");
    paragraph.innerHTML = lines.map((line, index) => `<span class="line" style="transition-delay: ${index * 0.3}s">${line}</span>`).join("");
    const liness = document.querySelectorAll('.line');
    setTimeout(() => {
        liness.forEach(line => {
            addActive(line);
        });
    }, 3500);
    setTimeout(() => {
        addActive(heroBackground);
    }, 2500);
    let specialsTimeoutId = setTimeout(() => {
        let count = 2;
        showElement(1, specials,classesin,classesout);
        showElement(1, specialsContent,classesin,classesout);
        frameChanges(1)

        const specialss = [...specials];
        specialsIntervalId = setInterval(() => {
            showElement(count, specials,classesin,classesout);
            showElement(count, specialsContent,classesin,classesout);
            frameChanges(count)
            changeHeroBackgroud(count)
            if (count < specialss.length) {
                count++;
            } else {
                count = 1;
            }
        }, 5000);
    }, 3500);
    setTimeout(() => {
        clearInterval(specialsIntervalId)
        addActive(heroCarousel)
    },(specials.length + 1) * 5000 +3500)
    carouselTimeoutId = setTimeout(() => {
        addActive(heroCarousel)
    },(specials.length + 1) * 5000 +3500)
}


function deactivateHero() {
    const paragraph = document.querySelector(".animated-paragraph");
    const lines = paragraph.innerHTML.split("<br>");
    paragraph.innerHTML = lines.map((line, index) => `<span class="line" style="transition-delay: ${index * 0.3}s">${line}</span>`).join("<br>");
    const liness = document.querySelectorAll('.line');
    liness.forEach(line => {
        removeActive(line);
    });
    specials.forEach(special => {
        special.classList.add('circularOut');
        special.classList.remove('circularIn');
        special.classList.remove('active');
    })
    removeActive(heroBackground);
    removeActive(heroCarousel)
    clearInterval(specialsIntervalId);
    heroframes.forEach(frame => {
        frameFunctions(frame,'pause')
        frameFunctions(frame,'seekTo',0)
    })
    clearTimeout(carouselTimeoutId)
}

function frameChanges(index){
    setTimeout(() => {
    heroframes.forEach((frame,idx) => {
        if((index - 1) === idx){
            frameFunctions(frame,"mute")
            frameFunctions(frame,"play")
        }else {
            frameFunctions(frame,"pause")
            frameFunctions(frame,"seekTo",0)
        }
    })
    },100)
}

function changeHeroBackgroud(index){
    if(index == 1){
        paragraph.style.setProperty('--color','#fff')
        paragraph.style.setProperty('--spancolor',heroHeadlineSpanColors[0])
        heroBackground.style.setProperty('--background-color',heroBgColors[0])
        heroBackground.style.setProperty('--gradient-color','rgba(50,50,50,0.2)')
    }else {
        paragraph.style.setProperty('--spancolor',heroHeadlineSpanColors[index - 1])
        heroBackground.style.setProperty('--background-color',heroBgColors[index - 1])   
    }
}
function frameFunctions(frame,name,value_s){
    const message = {
        type: name, 
        "x-tiktok-player": true
    }
    if(value_s != undefined){
        message.value = value_s
    }
    console.log(frame,message,name);
    
    frame.contentWindow.postMessage(message,'*')
    console.log('sent');
    

} 