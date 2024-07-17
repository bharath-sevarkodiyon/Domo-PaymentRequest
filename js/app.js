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
    console.log("pushed the named to dropdown");
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
    console.log("received sender name");
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
    console.log("selected currency");
});

// To change the entered number into float
let amount;
    document.getElementById('floatInput').addEventListener('blur', function (e) {
        e.target.value = parseFloat(e.target.value).toFixed(2);
        amount = e.target.value;
        console.log("amount selected and converted to float");
    });

// Getting current date
function currentDate(){
    const today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
}
// let dateCall = currentDate()
const dateInput = document.getElementById('dateInput');
dateInput.min = currentDate();
dateInput.value = currentDate();  // by default it is pointing to current date
let due_date = dateInput.value;  // getting the selected date to store it in database
dateInput.addEventListener('change', function() {
    const selectedDate = dateInput.value;   
    dateInput.value = selectedDate;         // when the date changes, it will update to selected date
    due_date = dateInput.value
    // if (!isNaN(dateCall) && !isNaN(dateInput.value)) {
    //     const diffInMs = dateInput.value - dateCall;
    //     console.log("MS",diffInMs);
    //     const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    //     console.log("Days",diffInDays);
    // }
    console.log("date has been selected")
})

function getCurrentDate() {
    // let dayCal = document.getElementById("dayCalculate");
    const today = new Date(dateInput.value);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
}

// when ever the page loads
window.onload = ()=>{
    document.getElementById("dropdown").value = "";
    document.querySelector(".uniqueSpaceForInput").value="";
}

// To make the dropdown to show company names
const companyWrapper = document.querySelector(".company-wrapper"),
selectCompany = companyWrapper.querySelector(".select-company"),
option = companyWrapper.querySelector(".option");
let companyName = ["GWC", "Domo"]
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
    console.log("company selected");
}
selectCompany.addEventListener("click", () => companyWrapper.classList.toggle("active"));

// To get the entered details
let enteredName = document.querySelector(".name").value;
let enteredmail = document.querySelector(".mail").value;
let selectedAccount;
let account = document.querySelector(".uniqueSpaceForInput");
account.addEventListener("change", ()=>{
    // let temp = this.options[this.selectedIndex].text;
    selectedAccount = account.value;
    console.log("account selected");
})

// To display from current username and id
let currentUserName;
let currentUserId;
    let currentUser = domo.env.userId;
    domo.get(`/domo/users/v1/${currentUser}?includeDetails=true`)
    .then(function(data){
        currentUserName =  data.displayName;
        currentUserId =  data.id;
})

// once clicked the payment request button
let choosedPersonId;
let choosedPersonEmail;
let send = document.getElementById("send"); 
send.addEventListener("click", ()=>{
    const subject = `Payment request from ${selectedCompany}, ${currentUserName}`;
    const emailContent = `
        <h6>Hi ${choosedPerson},</h6>
        <p>${selectedCompany} ${currentUserName}, requested <b><i>${amount}${selectedCurrency}</i></b> payment.</p>
        <p>You need to make a payment before <u>${getCurrentDate()}</u>.</p>
        <p>Thanks,<br>${currentUserName}</p>
    `;
    const startWorkflow = (alias, body) => {
        domo.post(`/domo/workflow/v1/models/${alias}/start`, body) 
    }
    domo.get(`/domo/users/v1?includeDetails=true&limit=137`).then(function(data){  // it will give all the data's from domo
        data.forEach(iterator=>{ 
            if(choosedPerson === iterator.displayName){ 
                choosedPersonId = iterator.id;
                choosedPersonEmail = iterator.detail.email; 
            }
        })
        startWorkflow("sendEmail", { to: choosedPersonId, subject: subject, body: emailContent})
        console.log("Mail send successfully");
    })
// Delaying the process to get all the data before storing it in database
setTimeout(() => {
// Validate the currency to store in DB
let currency = selectedCurrency==="$"? selectedCurrency="USD" : selectedCurrency="INR"
// consolidating the data to store in the database
const details = {
    "content" : {
        "requested_by" : {
            "name" : `${currentUserName}`,
            "user_id": `${currentUserId}`
        },
        "requested_to": {
            "user_id": `${choosedPersonId}`,
            "name":  `${choosedPerson}`,
            "user_email": `${choosedPersonEmail}`
        },
        "contact_details": {
            "name": `${choosedPerson}`,
            "email": `${choosedPersonEmail}`
        },
        "request_details": {
            "amount": {
                "currency": `${currency}`,
                "amount": `${amount}`,
                "due_date": `${due_date}`
            },
            "company_name": `${selectedCompany}`,
            "destination_account": `${selectedAccount}`
        }
}}
// To post the data into the collection
domo.post(`/domo/datastores/v1/collections/paymentDetails/documents/`, details)
    .then(data => console.log(data));
}, 4000);
});