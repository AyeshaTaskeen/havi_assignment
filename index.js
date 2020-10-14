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

function showSignUpButton() {
    document.getElementsByClassName("signupButton")[0].style.display = "block";
    document.getElementsByClassName("signuperror")[0].style.display = "none";
}

//loginForm
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
function getUser() {
    console.log(document.referrer)
    document.getElementsByClassName("userPage_heading")[0].innerHTML = "Welcome " + sessionStorage.getItem("username");
}

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

function logOut() {
    window.location.href = "index.html";
    localStorage.clear();
}