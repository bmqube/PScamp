const username = document.getElementById("username");
username.value = window.localStorage.getItem("username");

const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const cf = document.getElementById("cf");
const vjudge = document.getElementById("vjudge");
const loj = document.getElementById("loj");
const atc = document.getElementById("atc");

const password = document.getElementById("currentPassword");
const newPassword1 = document.getElementById("newPassword1");
const newPassword2 = document.getElementById("newPassword2");

const linkProfile = url + "user";

function checkEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.trim());
}

function getAlertElement(msg, cls) {
  const alert = document.createElement("div");
  alert.classList.add("alert", cls);
  alert.innerText = msg;
  return alert;
}

function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    const alert = getAlertElement(
      `${getFieldName(input)} must be at least ${min} characters`,
      "alert-danger"
    );
    return alert;
  }
  if (input.value.length > max) {
    const alert = getAlertElement(
      `${getFieldName(input)} must be less than ${max} characters`,
      "alert-danger"
    );
    return alert;
  }

  return false;
}

fetch(linkProfile, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => {
    if (res.status == 401 || res.status == 422) {
      logout();
    }
    return res.json();
  })
  .then((data) => {
    // console.log(data);
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }
    if (data["first_name"]) {
      firstname.value = data["first_name"];
    }

    if (data["last_name"]) {
      lastname.value = data["last_name"];
    }

    if (data["email"]) {
      email.value = data["email"];
    }

    if (data["oj_info"]["CodeForces"]["username"]) {
      cf.value = data["oj_info"]["CodeForces"]["username"];
    }

    if (data["oj_info"]["VJudge"]["username"]) {
      vjudge.value = data["oj_info"]["VJudge"]["username"];
    }

    if (data["oj_info"]["LightOJ"]["username"]) {
      loj.value = data["oj_info"]["LightOJ"]["username"];
    }
    if (data["oj_info"]["AtCoder"]["username"]) {
      atc.value = data["oj_info"]["AtCoder"]["username"];
    }
  });

function updatePersonalInfo() {
  const elem = document.getElementById("personalUpdateAlert");
  elem.innerHTML = "";
  if (checkLength(firstname, 3, 50)) {
    const alert = checkLength(firstname, 3, 50);
    elem.appendChild(alert);
  } else if (checkLength(lastname, 3, 50)) {
    const alert = checkLength(lastname, 3, 50);
    elem.appendChild(alert);
  } else if (!checkEmail(email.value)) {
    const alert = getAlertElement("Invalid Email", "alert-danger");
    elem.appendChild(alert);
  } else {
    fetch(linkProfile, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstname.value,
        last_name: lastname.value,
        email: email.value,
      }),
    })
      .then((res) => {
    if (res.status == 401 || res.status == 422) {
      logout();
    }
    return res.json();
  })
      .then((data) => {
        if (data["msg"] == "Token has expired") {
          window.localStorage.removeItem("access_token");
          window.location.href = "/login.html";
        }
        if (data["message"] == "User data is being updated") {
          const alert = getAlertElement("Profile Updated", "alert-success");
          elem.appendChild(alert);
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          const alert = getAlertElement(data["message"], "alert-danger");
          elem.appendChild(alert);
        }
      });
  }
}

function updateOJInfo() {
  const elem = document.getElementById("OJUpdateAlert");
  elem.innerHTML = "";
  const sendData = {
    oj_info: {
      CodeForces: {
        username: null,
      },
      VJudge: {
        username: null,
      },
      LightOJ: {
        username: null,
      },
      AtCoder: {
        username: null,
      },
    },
  };

  if (cf.value) {
    sendData["oj_info"]["CodeForces"]["username"] = cf.value;
  }

  if (vjudge.value) {
    sendData["oj_info"]["VJudge"]["username"] = vjudge.value;
  }

  if (atc.value) {
    sendData["oj_info"]["AtCoder"]["username"] = atc.value;
  }

  if (loj.value) {
    sendData["oj_info"]["LightOJ"]["username"] = loj.value;
  }

  fetch(linkProfile, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  })
    .then((res) => {
    if (res.status == 401 || res.status == 422) {
      logout();
    }
    return res.json();
  })
    .then((data) => {
      if (data["msg"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      if (data["message"] == "User data is being updated") {
        const alert = getAlertElement("Profile Updated", "alert-success");
        elem.appendChild(alert);
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    });
}

function edit(input) {
  const elem = document.getElementById(input);
  if (elem.classList.contains("form-control-plaintext")) {
    elem.classList.remove("form-control-plaintext");
    elem.classList.add("form-control");
    elem.readOnly = false;
  } else {
    elem.classList.remove("form-control");
    elem.classList.add("form-control-plaintext");
    elem.readOnly = true;
  }
}

function del(input) {
  const elem = document.getElementById(input);
  elem.value = "";
  updateOJInfo();
}

function gotoCF() {
  if (cf.value && cf.readOnly) {
    const url = "https://codeforces.com/profile/" + cf.value;
    const win = window.open(url, "_blank");
    win.focus();
  }
}

function gotoVJudge() {
  if (vjudge.value && vjudge.readOnly) {
    const url = "https://vjudge.net/user/" + vjudge.value;
    const win = window.open(url, "_blank");
    win.focus();
  }
}

function gotoAtCoder() {
  if (atc.value && atc.readOnly) {
    const url = "https://atcoder.jp/users/" + atc.value;
    const win = window.open(url, "_blank");
    win.focus();
  }
}

function gotoLOJ() {
  if (loj.value && loj.readOnly) {
    const url = "http://lightoj.com/volume_userstat.php?user_id=" + loj.value;
    const win = window.open(url, "_blank");
    win.focus();
  }
}

function updatePassword() {
  const elem = document.getElementById("passwordUpdateAlert");
  elem.innerHTML = "";
  if (checkLength(newPassword1, 6, 50)) {
    const alert = checkLength(newPassword1, 6, 50);
    elem.appendChild(alert);
  } else if (newPassword1.value !== newPassword2.value) {
    const alert = getAlertElement("Password did not match", "alert-danger");
    elem.appendChild(alert);
  } else {
    fetch(linkProfile, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: password.value,
        password: newPassword1.value,
      }),
    })
      .then((res) => {
    if (res.status == 401 || res.status == 422) {
      logout();
    }
    return res.json();
  })
      .then((data) => {
        if (data["msg"] == "Token has expired") {
          window.localStorage.removeItem("access_token");
          window.location.href = "/login.html";
        }
        if (data["message"] == "User data is being updated") {
          const alert = getAlertElement("Password Updated", "alert-success");
          elem.appendChild(alert);
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          const alert = getAlertElement(data["message"], "alert-danger");
          elem.appendChild(alert);
        }
      });
  }
  // setTimeout(() => {
  //   location.reload();
  // }, 2000);
}
