if (!window.localStorage.getItem("access_token")) {
  window.location.replace("/login.html");
}

const linkLogout = url + "logout";

function logout() {
  fetch(linkLogout, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
    },
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("is_admin");
    window.location.href = "/login.html";
  });
}
