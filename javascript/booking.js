const form =  document.getElementById("form")
const date = document.getElementById("date")
const typeOfEvent = document.getElementById("type")
const nearityOptions = document.querySelectorAll('input[name="near"]')
const locationInputContainer = document.querySelector(".location-input-container")
const locationInput = locationInputContainer.querySelector("input")


nearityOptions.forEach(option => {
    option.addEventListener("change", e => {
        updateNearityInput()
    })
})

function updateNearityInput(){
    const checkedNearity = document.querySelector('input[name="near"]:checked').value
    if(checkedNearity === "yes"){
        locationInputContainer.style.height = "0px"
    }else {
        const inputHeight = locationInput.getBoundingClientRect().height + 4
        locationInputContainer.style.height = `${inputHeight}px`
    }
}

updateNearityInput()