// event listeners

// zip code -> city listener
document.querySelector("#zip").addEventListener("change",displayCity);
// state -> Counties listener
document.querySelector("#state").addEventListener("change",displayCounties);
//username availability listener
document.querySelector("#username").addEventListener("change",checkUsername);
// Sign up form button listener
document.querySelector("#signupForm").addEventListener("submit", function(event){
    validateForm(event);
});

// Load states when page loads
fetchStates();


//---- functions ---- //

async function fetchStates(){
    // State drop down - linking the API
    let url = `https://csumb.space/api/allStatesAPI.php`;
    let response = await fetch(url);
    let data = await response.json();
    let stateList = document.querySelector("#state");
    stateList.innerHTML = "<option value=''>Select State</option>";

    // for loop that drops down all states
    for (let i of data){
        stateList.innerHTML += `<option value="${i.state}">${i.state}</option>`;

    }
}
//display Counties

async function displayCounties(){
        // County drop down - linking the API

    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch (url);
    let data = await response.json();

    let countyList = document.querySelector("#county");
    countyList.innerHTML = "<option>Select County</option>";

    // for of loop that drops down all counties
    for (let i of data){
        countyList.innerHTML += `<option>${i.county}</option>`;
    }
}


//display city from web API after zip code is entered

async function displayCity(){

    let zipCode = document.querySelector("#zip").value;
    //console.log(zipCode);
    //city info web API
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

if(zipCode.length != 5 || !data.city){
    document.querySelector("#city").innerHTML = "Zip code not found";
    document.querySelector("#latitude").innerHTML = "";
    document.querySelector("#longitude").innerHTML = "";
    return;
}

    //display city in the city span
    document.querySelector("#city").innerHTML = data.city;
      //display latitude in the latitude span
    document.querySelector("#latitude").innerHTML = data.latitude;
    //display longitude in the longitude span
    document.querySelector("#longitude").innerHTML = data.longitude;

}


//check if username is available
async function checkUsername(){

    let username = document.querySelector("#username").value;
     const usernameError = document.querySelector("#usernameError");

    //reset status
    usernameError.innerHTML = "";
    usernameError.dataset.available = "";
// check  username
if(!username){
    return; // no username entered
}

// now lets call the API
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

    try{
    let response = await fetch (url);


    let data = await response.json();
   
    if(data.available){
        usernameError.innerHTML = "Username is available";
        usernameError.style.color = "green";
        usernameError.dataset.available = "yes";
    }
    else{
        usernameError.innerHTML = "Username is NOT available";
        usernameError.style.color = "red";
        usernameError.dataset.available = "no";
    }
}
catch(error){
    console.error("Error checking username availability:", error);
    usernameError.innerHTML = "Error checking username availability. Please try again later.";
    usernameError.style.color = "red";
    usernameError.dataset.available = "no";
}
}

// validate form before submission
function validateForm(e){
    e.preventDefault();
    let isValid = true;

    let username = document.querySelector("#username").value.trim();
    let usernameError = document.querySelector("#usernameError");

    // password checks
    const password = document.querySelector("#password").value;
    const retype = document.querySelector("#retypePassword").value;
    const passwordError = document.querySelector("#passwordError");

    // clear previous messages
    usernameError.innerHTML = usernameError.innerHTML || "";
    passwordError.innerHTML = "";

    if(username.length == 0){
        usernameError.innerHTML = "Username is required";
        usernameError.style.color = "red";
        isValid = false;
    } else if (usernameError.dataset.available === "no") {
        // Username is not available
        usernameError.innerHTML = "Username is not available";
        usernameError.style.color = "red";
        isValid = false;
    } else if (usernameError.dataset.available !== "yes") {
        // availability not confirmed yet
        usernameError.innerHTML = "Please wait for username availability check";
        usernameError.style.color = "orange";
        isValid = false;
    }

    // Validate password length
    if (!password || password.length < 6) {
        passwordError.innerHTML = "Password must be at least 6 characters long";
        passwordError.style.color = "red";
        isValid = false;
    }

    // Validate match
    if (password !== retype) {
        passwordError.innerHTML = (passwordError.innerHTML ? passwordError.innerHTML + " " : "") + "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (isValid){
        // allow form to submit
        document.querySelector("#signupForm").submit();
    } else {
        // focus first error input for convenience
        if (!username || usernameError.style.color === "red") {
            document.querySelector("#username").focus();
        } else if (!password || password.length < 6) {
            document.querySelector("#password").focus();
        } else {
            document.querySelector("#retypePassword").focus();
        }
    }
}