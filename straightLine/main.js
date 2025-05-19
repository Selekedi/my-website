import { getEquation, getEquationFromGradient } from "./straightLine.js";
import { inputContainer } from "../utils.js";

const selector = document.getElementById("option")
const inputsContainer = document.getElementById("inputs")
const answerP = document.getElementById("answer")

let selectedOption = selector.value
console.log(selectedOption);


selector.addEventListener("change", e => {
    selectedOption = e.currentTarget.value
    populateForm(selectedOption)
})

populateForm(selectedOption)

// populate form with inputs relating to the method chosen needed
function populateForm(type){
    if(type === "gradient"){
        populateWithGradient()
    }else {
        populateWithNoGradient()
    }
}

function populateWithGradient(){
    inputsContainer.innerHTML = ""
    answerP.textContent = "Answer:"
    const gradientInput = inputContainer("number", "Gradient", "Enter gradient")
    inputsContainer.appendChild(gradientInput)
    const point = inputContainer("text","point","Enter point")
    inputsContainer.appendChild(point)
    const submitButton = document.createElement("button")
    submitButton.textContent = "submit"
    submitButton.onclick = () => {
        const gradient = parseFloat(gradientInput.querySelector("input").value)
        const coordinate = parsePoint(point.querySelector("input").value)
        const equation = getEquationFromGradient(gradient,coordinate)

        answerP.textContent = `Answer: y = ${equation.m}x ${equation.c < 0 ? "-": equation.c == 0 ? "" : "+"} ${equation.c === 0 ? "": equation.c }`
    }
    inputsContainer.appendChild(submitButton)
    
}

function populateWithNoGradient(){
    inputsContainer.innerHTML = ""
    answerP.textContent = "Answer:"
    const firstPoint = inputContainer("text","First point","Enter first point")
    inputsContainer.appendChild(firstPoint)
    const secondPoint = inputContainer("text","Second point","Enter second point")
    inputsContainer.appendChild(secondPoint)
    const submitButton = document.createElement("button")
    submitButton.textContent = "submit"
    submitButton.onclick = () => {
        const points = []
        const firstCoordinate = parsePoint(firstPoint.querySelector("input").value)
        points.push(firstCoordinate)
        const secondCoordinate = parsePoint(secondPoint.querySelector("input").value)
        points.push(secondCoordinate)
        const equation = getEquation(points)
        answerP.textContent = `Answer: y = ${equation.m}x ${equation.c < 0 ? "-": equation.c == 0 ? "" : "+"} ${equation.c === 0 ? "": equation.c }`
    }
    inputsContainer.appendChild(submitButton)


}

function parsePoint(string){
    const points = string.split(",")
    const x = parseFloat(points[0])
    const y = parseFloat(points[1])
    return [x,y]
}