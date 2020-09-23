const link = url + "forgetpassword";
const userInfo = document.getElementById("input");

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function forgetPass(e) {
  e.preventDefault();

  let data = {};
  if (userInfo.value) {
    if (validateEmail(userInfo.value)) {
      data = {
        email: userInfo.value,
      };
    } else {
      data = {
        username: userInfo.value,
      };
    }

    fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }
}
