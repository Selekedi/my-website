export let currentpage

const sections = document.querySelectorAll('main > section');

export function showElement(imageIndex, elements,classesin,classesout) {
    elements.forEach((element, index) => {
        if (index === imageIndex - 1) {
            element.classList.remove(...element.classList);
            element.classList.add(...classesin);
            
        } else if (element.classList.contains('active')) {
            element.classList.remove(...element.classList);
            element.classList.add(...classesout);
            
        }
    });
}

export function showSection(inputIndex) {
    sections.forEach((section, index) => {
        if (index === inputIndex - 1) {
            addActive(section);
        } else if (section.classList.contains('active')) {
            removeActive(section);
        }
    });
}

export function addActive(element) {
    element.classList.add('active');
}

export function removeActive(element) {
    element.classList.remove('active');
}


export function initializeFromSessionStorage(key, defaultValue) {
    // If the item doesn't exist in sessionStorage, set it to the default value
    
    if (sessionStorage.getItem(key) === "undefined" || !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify(defaultValue));
    }
    // Retrieve and parse the value from sessionStorage
    return JSON.parse(sessionStorage.getItem(key));
  }
  
  
  
export function updateSessionStorage(key, newValue) {
    // Update the value in sessionStorage
    sessionStorage.setItem(key, JSON.stringify(newValue));
    // Return the updated value
    return JSON.parse(sessionStorage.getItem(key));
  }

export function containsClass(element,className){
    return element.classList.contains(className)
}

export function changeInnerHtml(element,newContent){
    element.innerHTML = newContent
}