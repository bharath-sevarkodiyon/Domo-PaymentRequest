const wrapper = document.querySelector(".wrapper"),
selectBtn = wrapper.querySelector(".select-btn"),
searchInp = wrapper.querySelector("input"),
options = wrapper.querySelector(".options");

// Storing person name in a list
let personName = [];
domo.get(`/domo/users/v1?includeDetails=true&limit=137`).then(function(data){
    data.forEach(element => {
        personName.push(element.displayName);
        // console.log(personName);
        addPerson();
    });
})
// Adding person name in a li element
function addPerson(selectedPerson) {
    options.innerHTML = "";
    personName.forEach(person => {
        let isSelected = person == selectedPerson ? "selected" : "";
        let li = `<li onclick="updateName(this)" class="${isSelected}">${person}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    });
}
// Toggling the class state
function updateName(selectedLi) {
    searchInp.value = "";
    addPerson(selectedLi.innerText);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

// search the person name
searchInp.addEventListener("keyup", () => {
    let arr = [];
    let searchWord = searchInp.value.toLowerCase();
    arr = personName.filter(data => {
        return data.toLowerCase().startsWith(searchWord);
    }).map(data => {
        let isSelected = data == selectBtn.firstElementChild.innerText ? "selected" : "";
        return `<li onclick="updateName(this)" class="${isSelected}">${data}</li>`;
    }).join("");
    options.innerHTML = arr ? arr : `<p style="margin-top: 10px;">!! Person not found</p>`;
});
selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));



// document.getElementById('floatInput').addEventListener('keypress', function (e) {
//         // Convert the input value to a float and update the input value
//         e.target.value = parseFloat(e.target.value);
//     });

// document.getElementById('floatInput').addEventListener('input', function (e) {
//         // Ensure only digits are entered
//         e.target.value = e.target.value.replace(/[^0-9]/g, '');

//         // Limit to 7 digits
//         if (e.target.value.length > 7) {
//             e.target.value = e.target.value.slice(0, 7);
//         }
//     });

// To change the entered number into float
    document.getElementById('floatInput').addEventListener('blur', function (e) {
            e.target.value = parseFloat(e.target.value).toFixed(2);
    });

// Getting current date
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// Set the current date as the default value for the input element
document.getElementById('dateInput').value = getCurrentDate();

// Toggling the class state
// function companyName() {
//     wrapper.classList.remove("active");
//     selectBtn.firstElementChild.innerText = selectedLi.innerText;
// }
// let companyWrapper = document.querySelector(".company-wrapper");
// document.querySelector(".company-wrapper").addEventListener("click", () => 
//     companyWrapper.classList.toggle("active"));


// let companyWrapper = document.querySelector(".company-wrapper");
// let selectCompany = document.querySelector(".select-company");
// let contents = document.querySelector(".contents");

const companyWrapper = document.querySelector(".company-wrapper"),
selectCompany = companyWrapper.querySelector(".select-company"),
option = companyWrapper.querySelector(".option");
let companyName = ["Global Weconnect", "Domo"]
function addCompany(selectedPerson) {
    option.innerHTML = "";
    companyName.forEach(company => {
        let isSelected = company == selectedPerson ? "selected" : "";
        let li = `<li onclick="updateCompany(this)" class="${isSelected}">${company}</li>`;
        option.insertAdjacentHTML("beforeend", li);
    });
}
addCompany()
function updateCompany(selectedLi) {
    addCompany(selectedLi.innerText);
    companyWrapper.classList.remove("active");
    selectCompany.firstElementChild.innerText = selectedLi.innerText;
}
selectCompany.addEventListener("click", () => companyWrapper.classList.toggle("active"));
