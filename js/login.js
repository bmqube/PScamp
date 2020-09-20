const link = url + "login";

const username = document.getElementById("username");
const password = document.getElementById("password");

function tryLogin() {
  fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["access_token"]) {
        window.localStorage.setItem("username", username.value);
        window.localStorage.setItem("access_token", data["access_token"]);
        window.localStorage.setItem("refresh_token", data["refresh_token"]);
        window.location.href = "/index.html";
      } else {
        const invalid = document.getElementById("invalid");
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-danger");
        alert.innerText = "Invalid Credintials";
        invalid.appendChild(alert);
      }
    });
}
