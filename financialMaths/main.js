import { inputContainer } from "../utils.js";
import FinanceMaths from "./financeMaths.js";

const select = document.getElementById("selector")
const inputs = document.getElementById("inputs")
const answerP = document.getElementById("answer")
const defaulAnswer = "Answer:"

let category = "simple interest"
let method = "future value"

const selectors = {
    "simple interest": ["future value", "interest", "present value", "rate", "no of years"],
    "compound interest": ["future value", "present value", "rate", "no of years"],
    "annuities":["future value", "payments", "rate", "no of years", "present value"],
    "ammortization": ["payments", "balance after k years"]
}

createSelector()
populateForm(category,method)

function createSelector(){
    const selectorOne = document.createElement("select")
    const optionsOne = createOptions(Object.entries(selectors).map(item => item[0]))
    selectorOne.append(...optionsOne)
    const selectTwo = document.createElement("select")
    const optionsTwo = createOptions(selectors[category])
    selectTwo.append(...optionsTwo)
    selectorOne.value = category
    selectTwo.value = method
    selectorOne.onchange = (e) => {
        answerP.textContent = defaulAnswer
        selectTwo.innerHTML = ""
        category = e.currentTarget.value
        selectTwo.append(...createOptions(selectors[category]))
        method = selectors[category][0]
        selectTwo.value = method
        populateForm(category,method)
        
    }
    selectTwo.onchange = (e) => {
        method = e.currentTarget.value
        populateForm(category,method)
        answerP.textContent = defaulAnswer
    }
    select.append(selectorOne,selectTwo)
}

function createOptions(list){
    const options = list.map(item => {
        const option = document.createElement("option")
        option.value = item
        option.textContent = item
        return option
    })
    
    return options
}

function populateForm(category,method){
    inputs.innerHTML = ""
    const presentValue = inputContainer("text","present value","Enter present value")
    const futureValue = inputContainer("text", "future value", "Enter future value")
    const payments = inputContainer("text","payments","Enter payments")
    const rate = inputContainer("text", "rate", "Enter rate")
    const noOfYears = inputContainer("text", "no of years", "Enter no of years")
    const periodsPerYear = inputContainer("text", "periods per year", "Enter periods per year")
    const Kyears = inputContainer("text", "K years", "Enter k years")
    const submitButton = document.createElement("button")
    submitButton.textContent = "submit"
    

    switch(category){
        case "simple interest":
            switch(method){
                case "future value":
                    inputs.append(presentValue,rate,noOfYears)
                    submitButton.onclick = () => {
                        const PV = getValue(presentValue)
                        const r = getValue(rate)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.SimpleInterest.futureValue(PV,r/100,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "interest":
                    inputs.append(presentValue,rate,noOfYears)
                    submitButton.onclick = () => {
                        const PV = getValue(presentValue)
                        const r = getValue(rate)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.SimpleInterest.getInterest(PV,r/100,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "present value":
                    inputs.append(futureValue,rate,noOfYears)
                    submitButton.onclick = () => {
                        const FV = getValue(presentValue)
                        const r = getValue(rate)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.SimpleInterest.presentValue(FV,r/100,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "rate":
                    inputs.append(presentValue,futureValue,noOfYears)
                    submitButton.onclick = () => {
                        const PV = getValue(presentValue)
                        const FV = getValue(futureValue)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.SimpleInterest.getRate(FV,PV,n)
                        answerP.textContent = getAnswer("percent",figure * 100)
                    }
                    inputs.appendChild(submitButton)
                break
                case "no of years":
                    inputs.append(presentValue,futureValue,rate)
                    submitButton.onclick = () => {
                        const PV = getValue(presentValue)
                        const FV = getValue(futureValue)
                        const r = getValue(rate)
                        const figure = FinanceMaths.SimpleInterest.getInterest(FV,PV,r)
                        answerP.textContent = getAnswer("years",figure)
                    }
                    inputs.appendChild(submitButton)
                break
            }
        break
        case "compound interest":
            switch(method){
                case "future value":
                    inputs.append(presentValue,rate,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const PV = getValue(presentValue)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.CompoundInterest.futureValue(PV,r/100,ppy,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "present value":
                    inputs.append(futureValue,rate,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const FV = getValue(futureValue)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.CompoundInterest.presentValue(FV,r/100,ppy,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "rate":
                    inputs.append(futureValue,presentValue,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const PV = getValue(presentValue)
                        const FV = getValue(futureValue)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.CompoundInterest.getRate(FV,PV,ppy,n)
                        answerP.textContent = getAnswer("percent",figure * 100)
                    }
                    inputs.appendChild(submitButton)
                break
                case "no of years":
                    inputs.append(presentValue,futureValue,rate,periodsPerYear)
                    submitButton.onclick = () => {
                        const FV = getValue(futureValue)
                        const PV = getValue(presentValue)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const figure = FinanceMaths.CompoundInterest.getNoOfYears(FV,PV,r/100,ppy)
                        answerP.textContent = getAnswer("years",figure)
                    }
                    inputs.appendChild(submitButton)
                break
            }
        break
        case "annuities":
            switch(method){
                case "future value":
                    inputs.append(payments,rate,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const PM = getValue(payments)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.Annuities.futureValue(PM,r/100,ppy,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "present value":
                    inputs.append(payments,rate,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const PM = getValue(payments)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.Annuities.getPresentValue(PM,r/100,ppy,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "rate":
                    inputs.append(futureValue,payments,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const FV = getValue(futureValue)
                        const PM = getValue(payments)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.Annuities.getRate(FV,PM,ppy,n)
                        answerP.textContent = getAnswer("percent",figure * 100)
                    }
                    inputs.appendChild(submitButton)
                break
                case "no of years":
                    inputs.append(futureValue,payments,rate,periodsPerYear)
                    submitButton.onclick = () => {
                        const FV = getValue(futureValue)
                        const PM = getValue(payments)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const figure = FinanceMaths.Annuities.getNoOfYears(FV,PM,r/100,ppy)
                        answerP.textContent = getAnswer("years",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "payments":
                    inputs.append(futureValue,rate,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const FV = getValue(futureValue)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.Annuities.getPayments(FV,r/100,ppy,n)
                        answerP.textContent = getAnswer("amountnt",figure)
                    }
                    inputs.appendChild(submitButton)
                break
            }
        break
        case "ammortization":
            switch(method){
                case "payments":
                    inputs.append(presentValue,rate,periodsPerYear,noOfYears)
                    submitButton.onclick = () => {
                        const PV = getValue(presentValue)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const n = getValue(noOfYears)
                        const figure = FinanceMaths.Amortisation.getPayments(PV,r/100,ppy,n)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                case "balance after k years":
                    inputs.append(presentValue,payments,periodsPerYear,Kyears)
                    submitButton.onclick = () => {
                        const PV= getValue(presentValue)
                        const PM = getValue(payments)
                        const r = getValue(rate)
                        const ppy = getValue(periodsPerYear)
                        const KY = getValue(Kyears)
                        const figure = FinanceMaths.Amortisation.BalanceAfterKPayments(PV,PM,r/100,ppy,KY)
                        answerP.textContent = getAnswer("amount",figure)
                    }
                    inputs.appendChild(submitButton)
                break
                default:
            }
        break
        default:

    }
}

function getAnswer(type,figure){
    return `Answer: ${type === "amount" ? "R": ""} ${figure} ${type === "percent" ? "%":type === "years"? "years": ""}`
}

function getValue(documentObject){
    return parseFloat(documentObject.querySelector("input").value)
}

