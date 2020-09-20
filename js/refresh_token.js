// const link = url + "refresh";

const userNav = document.getElementById("userNav");
userNav.innerText = window.localStorage.getItem("username");

// fetch(link, {
//   method: "POST",
//   headers: {
//     Authorization: "Bearer " + window.localStorage.getItem("refresh_token"),
//   },
// })
//   .then((res) => res.json())
//   .then((data) => {
//     const new_token = data["access_token"];
//     window.localStorage.removeItem("access_token");
//     window.localStorage.setItem("access_token", new_token);
//   });
