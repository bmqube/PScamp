const className = document.getElementById("class_name");
const isRated = document.getElementById("is_rated");
const isBootcamp = document.getElementById("is_bootcamp");
const alertClassAdd = document.getElementById("alertClassAdd");

const linkCreateClass = url + "createclass";

function getAlertElement(msg, cls) {
  const alert = document.createElement("div");
  alert.classList.add("alert", cls);
  alert.innerText = msg;
  return alert;
}

function addClass() {
  if (className.value && isRated.value && isBootcamp.value) {
    fetch(linkCreateClass, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classroom_name: className.value,
        is_rated: isRated.value,
        is_bootcamp: isBootcamp.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data["message"] == "Classroom created successfully.") {
          const alert = getAlertElement(data["message"], "alert-success");
          alertClassAdd.appendChild(alert);
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          const alert = getAlertElement(data["message"], "alert-danger");
          alertClassAdd.appendChild(alert);
        }
      });
  } else {
    const alert = getAlertElement("A field can not be empty", "alert-success");
    alertClassAdd.appendChild(alert);
  }
}
