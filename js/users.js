const currentLocation = window.location.href;
const currentURL = new URL(currentLocation);
const username = currentURL.searchParams.get("user");
console.log(username);

const elem = document.getElementById("param");
elem.innerText = username;
