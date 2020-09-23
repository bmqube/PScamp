if (window.localStorage.getItem("access_token")) {
  window.location.replace("/index.html");
}

const link = url + "register";

const form = document.getElementById("form");
const firstname = document.getElementById("firstName");
const lastname = document.getElementById("lastName");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("#errorShow");
  small.className = "mt-5 error";
  small.innerText = message;
}

// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
    return true;
  } else {
    showError(input, "Email is not valid");
    return false;
  }
}

// Check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      return false;
    }
  });
  return true;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  }
  if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
    return false;
  }

  return true;
}

// Check passwords match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    return false;
  }
  return true;
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Event listeners
// form.addEventListener("submit", function (e) {
function tryRegister(e) {
  e.preventDefault();
  const inputData = [username, email, password, password2, firstname, lastname];

  for (let i = 0; i < inputData.length; i++) {
    const input = inputData[i];
    showError(input, "");
  }

  if (
    checkRequired(inputData) &&
    checkLength(firstname, 3, 50) &&
    checkLength(lastname, 3, 50) &&
    checkLength(username, 3, 50) &&
    checkLength(password, 6, 50) &&
    checkEmail(email) &&
    checkPasswordsMatch(password, password2)
  ) {
    fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstname.value,
        last_name: lastname.value,
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data["message"] == "User created successfully.") {
          const userCreated = document.getElementById("userCreated");
          const alert = document.createElement("div");

          alert.classList.add("alert", "alert-success");
          alert.innerText = "Registration completed. ";

          const a = document.createElement("a");
          a.setAttribute("href", "/login.html");
          a.innerText = "Click here";
          alert.appendChild(a);

          const text = document.createTextNode(" to login");
          alert.appendChild(text);

          userCreated.appendChild(alert);
        } else if (
          data["message"] == "A user with that username already exists"
        ) {
          showError(username, data["message"]);
        } else {
          showError(email, data["message"]);
        }
        const registerButton = document.getElementById("registerButton");
        registerButton.disabled = false;
        registerButton.innerText = "Register Account";
      });
  } else {
    const registerButton = document.getElementById("registerButton");
    registerButton.disabled = false;
    registerButton.innerText = "Register Account";
  }
}
