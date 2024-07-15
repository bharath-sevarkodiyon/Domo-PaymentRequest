const wrapper = document.querySelector(".wrapper"),
selectBtn = wrapper.querySelector(".select-btn"),
searchInp = wrapper.querySelector("input"),
options = wrapper.querySelector(".options");

// Storing person name in a list
let personName = [];
domo.get(`/domo/users/v1?includeDetails=true&limit=137`).then(function(data){
    data.forEach(element => {
        personName.push(element.displayName);
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
let choosedPerson;
function updateName(selectedLi) {
    searchInp.value = "";
    addPerson(selectedLi.innerText);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
    choosedPerson = selectBtn.firstElementChild.innerText;
}

// search the person name(Requestor name)
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

// To select a currency type
let selectedCurrency;
document.getElementById("dropdown").addEventListener("change", function() {
    selectedCurrency = this.options[this.selectedIndex].text;
});

// To change the entered number into float
let amount;
    document.getElementById('floatInput').addEventListener('blur', function (e) {
        e.target.value = parseFloat(e.target.value).toFixed(2);
        amount = e.target.value;
    });

// Getting current date
function currentDate(){
    const today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
}
function getCurrentDate() {
    const today = new Date(currentDate());
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
}
document.getElementById('dateInput').value = getCurrentDate();

// when ever the page loads
window.onload = ()=>{
    document.getElementById("dropdown").value = "$";
    document.getElementById("dataInput").value = currentDate();
}



// To make the dropdown to show company names
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
let selectedCompany;
function updateCompany(selectedLi) {
    addCompany(selectedLi.innerText);
    companyWrapper.classList.remove("active");
    selectCompany.firstElementChild.innerText = selectedLi.innerText;
    selectedCompany = selectCompany.firstElementChild.innerText;
}
selectCompany.addEventListener("click", () => companyWrapper.classList.toggle("active"));

// To get to know who logged in the card
let enteredName = document.querySelector(".name").value;
let mail = document.querySelector(".mail")
let currentUserName;
    let currentUser = domo.env.userId;
    domo.get(`/domo/users/v1/${currentUser}?includeDetails=true`)
    .then(function(data){
        currentUserName =  data.displayName;
})

let send = document.getElementById("send"); 
send.addEventListener("click", ()=>{        
    const subject = `Payment request from ${selectedCompany}, ${currentUserName}`;
    const emailContent = `
        <h6>Hi ${choosedPerson},</h6>
        <p>${selectedCompany} ${currentUserName}, requested <b><i>${amount}${selectedCurrency}</i></b> payment.</p>
        <p>You need to make a payment before <u>${getCurrentDate()}</u>.</p>
        <p>Thanks,<br>${currentUserName}</p>
    `;
    domo.get(`/domo/users/v1?includeDetails=true`).then(function(data){  // it will give all the data's from domo
        let id = []; // temp variable
        for(let iterator of data){                       //
            if(choosedPerson === iterator.displayName){             // user entered mailid with domo's mail id
                id.push(iterator.id);                   // domo user id stroing in temp variable
            }
        }
        const startWorkflow = (alias, body) => {
        domo.post(`/domo/workflow/v1/models/${alias}/start`, body)  // mail sending api
    }
    startWorkflow("sendEmail", { to: id[0], subject: subject, body: emailContent})
    })
    amount.innerHTML = "";
});



