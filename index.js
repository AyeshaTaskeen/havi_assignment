
//This Function is written to handle the signup
//here we do a validation for all the inputs.
//then we check in db whether the data is present or not if it is not present we insert the data
function signupfun(event) {
    event.preventDefault();
    var firstname = document.getElementsByClassName("firstName")[0].value;
    var lastname = document.getElementsByClassName("lastName")[0].value;
    var email = document.getElementsByClassName("signupEmail")[0].value;
    var contact = document.getElementsByClassName("signupContact")[0].value;
    var dob = document.getElementsByClassName("signupDOB")[0].value;
    var password = document.getElementsByClassName("signupPassword")[0].value;
    if (validate_username(firstname, document.getElementsByClassName("firstName")[0])) {
        if (validate_username(lastname, document.getElementsByClassName("lastName")[0])) {
            if (validate_email()) {
                if (validate_password()) {
                    document.getElementsByClassName("signupButton")[0].style.display = "none";
                    fetch("https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user?contact_number=" + contact)
                        .then(response => response.json())
                        .then(result => {
                            if (result.Count == 0) {
                                let newUserDetails =
                                {
                                    contact_number: contact,
                                    first_name: firstname,
                                    last_name: lastname,
                                    DOB: dob,
                                    email_id: email,
                                    password: password
                                }
                                fetch('https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user',
                                    {
                                        method: 'POST',
                                        body: JSON.stringify(newUserDetails)
                                    }).then(response => {
                                        alert("User Registered Successfully!!!")
                                        window.location.href = "index.html";
                                    })
                                document.getElementsByClassName("signupButton")[0].style.display = "block";
                            }
                            else {
                                alert("User with the given contact number already exists!!! Kindly Sign In")
                                document.getElementsByClassName("signupButton")[0].style.display = "none";
                                document.getElementsByClassName("signuperror")[0].style.display = "block";
                            }
                        })
                }
            }
        }
    }
}

//This function is used to validate email
function validate_email() {
    var email = document.getElementsByClassName("signupEmail")[0].value;
    var at_position = email.indexOf("@");
    var dot_position = email.lastIndexOf(".");
    if (at_position < 1 || dot_position < at_position + 2 || dot_position + 2 >= email.length) {
        alert("Not a valid e-mail address");
        event.preventDefault();
        document.getElementsByClassName("signupEmail")[0].focus();
        return false;
    }
    else {
        return true;
    }
}

//This Function is used to validate password
function validate_password() {
    var password = document.getElementsByClassName("signupPassword")[0].value;
    var confirm_password = document.getElementsByClassName("signupconfirmPassword")[0].value;
    if (confirm_password != password) {
        alert("not matching , please enter right passowrd")
        document.getElementsByClassName("signupPassword")[0].value = "";
        document.getElementsByClassName("signupconfirmPassword")[0].value = "";
        document.getElementsByClassName("signupPassword")[0].focus();
        return false;
    }
    else {
        return true;
    }
}

//This Function is used to validate name
function validate_username(name, field) {
    for (i = 0; i < name.length; i++) {
        if (!((name.charAt(i) >= 'a' && name.charAt(i) <= 'z') || (name.charAt(i) >= 'A' && name.charAt(i) <= 'Z'))) {
            alert("enter only alphabets  in name field");
            field.focus();
            return false;
            break;
        }
    }
    return true;
}


//This Function is hit to show the signup button again when number is different from the existing number in db
function showSignUpButton() {
    document.getElementsByClassName("signupButton")[0].style.display = "block";
    document.getElementsByClassName("signuperror")[0].style.display = "none";
}

//loginForm

//This Function handles signin process by sending number accross the api and getting back the user then comparing the password.
function signin(event) {
    event.preventDefault()
    var number = document.getElementsByClassName("loginContact")[0].value;
    var password = document.getElementsByClassName("loginPassword")[0].value;
    fetch("https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user?contact_number=" + number)
        .then(response => response.json())
        .then(result => {
            if (result.Count > 0) {
                if (result.Items[0].password == password) {
                    username = result.Items[0].first_name + " " + result.Items[0].last_name
                    sessionStorage.setItem("username", username)
                    sessionStorage.setItem("contactNumber", result.Items[0].contact_number)
                    sessionStorage.setItem("firstName", result.Items[0].first_name)
                    window.location.href = "userPage.html";
                } else {
                    document.getElementsByClassName("loginContact")[0].value = "";
                    document.getElementsByClassName("loginPassword")[0].value = "";
                    alert("Kindly,Enter Correct Login Credentials")
                }
            }
            else {
                alert("User Not Found Kindly Signup !!!")
            }
        })
}

//This is used to change the type of password field through check box
function togglePassword() {
    var passwordField = document.getElementsByClassName("loginPassword");
    if (passwordField[0].type === "password") {
        passwordField[0].type = "text";
    }
    else {
        passwordField[0].type = "password";
    }
}

//userPage

let list = []

//This Fucntion is used to see if we are getting the index.html as the previous page.so that we can restrict the user from directly accessing the page.
function getUser() {
    if (document.referrer == "") {
        window.location.href = "index.html"
    }
    document.getElementsByClassName("userPage_heading")[0].innerHTML = "Welcome " + sessionStorage.getItem("username");
}


//This Function is used to insert list data into db and then load the data and show inside userPage as a unordered list
function inserToList(event) {
    event.preventDefault()
    var listItem = document.getElementsByClassName("userPage_input")[0].value;
    list.push(listItem)
    document.getElementsByClassName("userPage_input")[0].value = "";
    document.getElementsByClassName("userPage_list")[0].innerHTML = sessionStorage.getItem("firstName") + " entered"
    if (list.length > 0) {
        document.getElementsByClassName("userPage_list")[0].style.display = "block"
        let newList =
        {
            contact_number: sessionStorage.getItem("contactNumber"),
            list: list,
        }
        fetch('https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/list',
            {
                method: 'POST',
                body: JSON.stringify(newList)
            }).then(response => {
                fetch("https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user?contact_number=" + sessionStorage.getItem("contactNumber"))
                    .then(response => response.json())
                    .then(result => {
                        if (result.Count > 0) {
                            for (var i = 0; i < result.Items[0].entered_list.length; i++) {
                                orderedlist = "<li>" + result.Items[0].entered_list[i] + "</li>";
                                document.getElementsByClassName("userPage_list")[0].innerHTML += orderedlist;
                            }
                        }
                    })
            })
    }

}


//This Function is used to logout the user by redirecting him to login page and clearing the local session storage
function logOut() {
    window.location.href = "index.html";
    localStorage.clear();
}

//Admin Grid
let userList = []

//This function is used to get all users from db and show them in a grid when admin watches it.
function getAllUsers() {
    fetch("https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/getallusers")
        .then(response => response.json())
        .then(result => {
            if (result.Count > 0) {
                result.Items.forEach((user) => {
                    userList.push(user.first_name +" "+ user.last_name)
                })
                for (var i = 0; i < userList.length; i++) {
                    AdminGrid = "<div class='grid-item'>" + userList[i] + "</div>";
                    document.getElementsByClassName("grid-container")[0].innerHTML += AdminGrid;
                }
            }
        })
}
