const linkUpdateScheduler = url + "updatescheduler";
const linkSync = url + "ojupdate";
const linkProfile = url + "user";

const nextRunOn = document.getElementById("nextRunOn");
const level = document.getElementById("level");
const interval = document.getElementById("interval");

function syncDB() {
  fetch(linkSync, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      bootbox.alert(data["message"]);
    });
}

fetch(linkProfile, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (!data["is_admin"]) {
      window.location.replace("/dashboard.html");
    }
  });

fetch(linkUpdateScheduler, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    nextRunOn.innerText += ` ${data["next_run_time"].split(".")[0]}`;

    let len = data["interval"].length;
    const intervalData = data["interval"].slice(9, len - 1).split(":");
    const hours = intervalData[0].split(",");
    const minutes = intervalData[1];
    len = hours.length;

    if (len == 2 && !parseInt(hours[1], 10)) {
      interval.value = parseInt(hours[0], 10);
      level.value = "days";
    } else if (len == 2 && parseInt(hours[1], 10)) {
      interval.value = parseInt(hours[0], 10) * 24 + parseInt(hours[1], 10);
      level.value = "hours";
    } else if (len == 1 && parseInt(hours[0], 10)) {
      interval.value = parseInt(hours[0], 10);
      level.value = "hours";
    } else if (parseInt(minutes, 10)) {
      interval.value = parseInt(minutes, 10);
      level.value = "minutes";
    }
  });

function editDB() {
  if (interval.classList.contains("form-control-plaintext")) {
    document.getElementById("updateBtn").classList.remove("d-none");

    interval.classList.remove("form-control-plaintext");
    interval.classList.add("form-control");
    interval.readOnly = false;

    level.classList.remove("form-control-plaintext");
    level.classList.add("form-control");
    level.disabled = false;
  } else {
    if (!document.getElementById("updateBtn").classList.contains("d-none")) {
      document.getElementById("updateBtn").classList.add("d-none");
    }

    interval.classList.remove("form-control");
    interval.classList.add("form-control-plaintext");
    interval.readOnly = true;

    level.classList.remove("form-control");
    level.classList.add("form-control-plaintext");
    level.disabled = true;
  }
}

function updateDB() {
  if (interval.value && level.value) {
    fetch(linkUpdateScheduler, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: level.value,
        interval: parseInt(interval.value, 10),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          location.reload();
        }, 1500);
      });
  }
}
