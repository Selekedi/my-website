const  header = document.querySelector('header')
const headerHeight =  header.getBoundingClientRect().height
const nav = header.querySelector('nav')
const navList = nav.querySelector('ul')
const navLinks = navList.querySelectorAll('li a')
const navToggle = header.querySelector('.toggle-btn')
const chatMenuToggle = document.querySelector('.menu .toggle')
const chatMenu = document.querySelector('.menu')
const chatMenuIcons = chatMenu.querySelectorAll('li ion-icon')
const aboutUsAccordion = document.querySelector('main section.about-us .key-highlights-container ul')
const aboutUsAccordionItems = aboutUsAccordion.querySelectorAll('li')
const aboutUsAccordionBtns = aboutUsAccordion.querySelectorAll('li .heading .toggle-btn')




navLinks.forEach(link => {
    link.addEventListener('click',e => {
        e.preventDefault()
        const id = e.currentTarget.dataset.id
        const element = document.getElementById(id)
        let position = element.offsetTop
        window.scrollTo({
            left:0,
            top:position - headerHeight
        })
        if(window.innerWidth < 950){
            nav.style.height = '0px'
        }
    })
    
})

navToggle.addEventListener('click',e => {
    const navListHeight = navList.getBoundingClientRect().height
    const navHeight = nav.getBoundingClientRect().height
    if(navHeight === 0){
        nav.style.height = `${navListHeight}px`
    }
    else {
        nav.style.height = '0px'
    }
    
})


chatMenuIcons.forEach(icon => {
    icon.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id
        switch(id){
            case 'call':
                window.location.href = 'tel:+27791156763';
            break;
            case 'whatsapp':
                window.location.href = 'https://wa.me/27791156763?text=Hello%20there!%20I%20have%20a%20question.';
            break;
            case 'mail':
                window.location.href = 'mailto:selekedimafate@gmail.com?subject=Hello&body=Hi%20there!';
            break;
            default:
                console.log('reached end');
        }
    })
})


chatMenuToggle.onclick = () => {
    chatMenu.classList.toggle('active')
}

aboutUsAccordionBtns.forEach(btn => {
    btn.addEventListener('click',e => {
        const grandParentElement = e.currentTarget.parentElement.parentElement
        console.log(grandParentElement);

        if(!grandParentElement.classList.contains('active')){
            aboutUsAccordionItems.forEach(item => {
                item.classList.remove('active')
                grandParentElement.classList.add('active')
            })
        }
    })
})

console.log(window.innerWidth)
console.log(window.innerHeight)
console.log(headerHeight);