export function inputContainer(type,labelName,placeholder){
    const contaner = document.createElement("div")
    contaner.className = "form-group input"
    const label = document.createElement("label")
    label.textContent = labelName
    contaner.appendChild(label)
    const input = document.createElement("input")
    input.type = type
    input.placeholder = placeholder
    contaner.appendChild(input)
    return contaner
}