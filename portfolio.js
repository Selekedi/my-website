const chatMenuToggle = document.querySelector('.menu .toggle')
const chatMenu = document.querySelector('.menu')
const chatMenuIcons = chatMenu.querySelectorAll('li ion-icon')
const windowWidth = window.innerWidth
const categoryBtns = document.querySelectorAll('#portfolio > .category-btns .category-btn')
const portfolioContainer = document.querySelector('#portfolio > .portfolio-container')
const copyrightYear = document.getElementById('copyright-year')

// PORTFOLIO ELEMENTS

const portfolio = [
    {
        id:1,
        category:'emceeing',
        link:"https://www.youtube.com/embed/oT3X5cOu1AY?si=QjkulaiyyF1sxk8W",
        type:'video',
        evenType:'Birthday Party',
        date:'02/03/2023',
        organisation:'Mr Pholo'
    },
    {
        id:2,
        category:'radio hosting',
        link:"https://www.youtube.com/embed/oT3X5cOu1AY?si=QjkulaiyyF1sxk8W",
        type:'video',
        evenType:'Radio Show',
        date:'02/04/2023',
        organisation:'Phalafala FM'
    },
    {
        id:3,
        category:'emceeing',
        link:"https://www.youtube.com/embed/oT3X5cOu1AY?si=QjkulaiyyF1sxk8W",
        type:'video',
        evenType:'Wedding',
        date:'02/06/2023',
        organisation:'Mr & Mrs Sechaba'

    },
    {
        id:4,
        category:'refereeing',
        link:"https://www.youtube.com/embed/oT3X5cOu1AY?si=QjkulaiyyF1sxk8W",
        type:'video',
        evenType:'Wedding',
        date:'09/06/2023',
        organisation:'Mr & Mrs Sechaba'

    },
    {
        id:5,
        category:'radio hosting',
        link:"https://www.youtube.com/embed/oT3X5cOu1AY?si=QjkulaiyyF1sxk8W",
        type:'video',
        evenType:'Wedding',
        date:'10/06/2023',
        organisation:'Mr & Mrs Sechaba'

    },
    {
        id:6,
        category:'emceeing',
        link:"https://www.youtube.com/embed/oT3X5cOu1AY?si=QjkulaiyyF1sxk8W",
        type:'video',
        evenType:'Wedding',
        date:'15/06/2023',
        organisation:'Mr & Mrs Sechaba'

    },
    {
        id:7,
        category:'refereeing',
        link:"https://www.youtube.com/embed/oT3X5cOu1AY?si=QjkulaiyyF1sxk8W",
        type:'video',
        evenType:'Wedding',
        date:'19/06/2023',
        organisation:'Mr & Mrs Sechaba'

    },
]

// CHAT MENU TOGGLE FUNCTIONALITY

chatMenuToggle.onclick = () => {
    chatMenu.classList.toggle('active')
}

//CHAT MENU OPTIONS CLICK FUNCTIONALITY

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


// DISPLAYING PORTFOLIO ITEMS ON THE WINDOW
window.addEventListener('DOMContentLoaded',() => {
    displayPortfolio(portfolio)
})

// PORTFOLIO CATEGORY BUTTONS FUNCTIONALITY

categoryBtns.forEach(btn => {
    btn.addEventListener('click',e => {
        if(!e.currentTarget.classList.contains('active')){
        const id = e.currentTarget.dataset.id
            if(!(id === 'all')){
                const category = portfolio.filter(item => {
                    return item.category === id
                })
                displayPortfolio(category)
            }
            else{
                displayPortfolio(portfolio)
            }
            categoryBtns.forEach(btn => {
                btn.classList.remove('active')
            })
            e.currentTarget.classList.add('active')
        }
    })
})

// DISPLAYING ITEMS ON THE SCREEN FUNCTION

function displayPortfolio(port){

const portfolioItems = port.map(item => {
    return `
    <div class="card">
    <div class="visual">
    <iframe src="${item.link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
    <div class="info">
        <div class="type">
            <span>
                ${item.evenType}
            </span>
        </div>
        <div class="date">
            <span>
                ${item.date}
            </span>
        </div>
        <div class="organisation">
            <span>
                ${item.organisation}
            </span>
        </div>
    </div>
</div>
            `
}).join("")

portfolioContainer.innerHTML = portfolioItems

}

// get current year

const currentDate = new Date()
const currentYear = currentDate.getFullYear()

// set copyright year to current year

copyrightYear.textContent = currentYear


