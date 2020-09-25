const linkUpdateScheduler = url + "updatescheduler";
const linkSync = url + "ojupdate";
const linkUser = url + "user";

const nextRunOn = document.getElementById("nextRunOn");
const level = document.getElementById("level");
const interval = document.getElementById("interval");

const emailSelect = document.getElementById("emailSelect");

let subcategory = {
  users: [],
  emails: [],
  classrooms: {},
};

fetch(linkUpdateScheduler, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
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

fetch(linkUser, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
})
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }

    for (let i = 0; i < data["user_list"].length; i++) {
      const user = data["user_list"][i]["username"];
      const email = data["user_list"][i]["email"];

      subcategory["users"].push(user);
      subcategory["emails"].push(email);

      // const sendEmails = document.getElementById("sendMailUsers");
      // const todo = document.getElementById("todoUsers");
      // const announcements = document.getElementById("announcementUsers");

      // const option = `<option value="${user}">
      //     ${user} [${email}]
      //   </option>`;

      // sendEmails.innerHTML += option;
      // todo.innerHTML += option;
      // announcements.innerHTML += option;
    }
    // $(function () {
    //   $("#selectEmail").selectpicker();
    //   $("#selectTodo").selectpicker();
    //   $("#selectAnnouncement").selectpicker();
    // });
  });

fetch(linkClass, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
})
  .then((res) => res.json())
  .then((data) => {
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }

    if (!data["edit_access"]) {
      window.location.replace("/dashboard.html");
    }

    // console.log(data);

    const elements = data["classroom_list"];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]["classroom_name"];
      subcategory["classrooms"][element] = [];

      for (let j = 0; j < elements[i]["user_list"].length; j++) {
        const user = elements[i]["user_list"][j];
        subcategory["classrooms"][element].push(user);
      }
      // console.log(subcategory);
      // const len = subcategory["classrooms"].length - 1;
      // users.indexOf(subcategory["classrooms"][len - 1]);
      // console.log(element);

      // const sendEmails = document.getElementById("sendMailClassrooms");
      // const todo = document.getElementById("todoClassrooms");
      // const announcements = document.getElementById("announcementClassrooms");

      // const option = `<option value="${element}">
      //     ${element.charAt(0).toUpperCase() + element.slice(1)}
      //   </option>`;

      // sendEmails.innerHTML += option;
      // todo.innerHTML += option;
      // announcements.innerHTML += option;
    }
  });

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
        bootbox.alert(data["message"]);
        editDB();
      });
  }
}

function addNewEmail() {
  const emailText = document.getElementById("emailText").value;
  const sendData = emailText.split(/\s*[,\n]+\s*/);

  // console.log(sendData);

  setTimeout(() => {
    const addNewEmailButton = document.getElementById("addNewEmailButton");
    addNewEmailButton.disabled = false;
    addNewEmailButton.innerText = "Add New Email";
  }, 2000);
}

function sendMail() {
  const category = document.getElementById("selectEmail").value;
  const subCategory = $("#customEmail").val();

  const sendData = {
    subject: document.getElementById("emailSendSubject").value,
    body: document.getElementById("emailSendBody").value,
    user_list: subcategory["users"],
    email_list: subcategory["emails"],
  };

  if (category == "users") {
    let user_list = [],
      email_list = [];

    for (let i = 0; i < subCategory.length; i++) {
      const element = subCategory[i].split(",");
      user_list.push(element[0]);
      email_list.push(element[1]);
    }

    sendData["user_list"] = user_list;
    sendData["email_list"] = email_list;
  } else if (category == "classrooms") {
    let user_list = [],
      email_list = [];

    for (let i = 0; i < subCategory.length; i++) {
      const classname = subcategory["classrooms"][subCategory[i]];
      for (let j = 0; j < classname.length; j++) {
        const user = classname[j];

        if (!user_list.includes(user)) {
          const ind = subcategory["users"].indexOf(user);
          user_list.push(user);
          email_list.push(subcategory["emails"][ind]);
        }
      }
    }
    sendData["user_list"] = user_list;
    sendData["email_list"] = email_list;
  }

  console.log(sendData);

  setTimeout(() => {
    const sendEmailButton = document.getElementById("sendEmailButton");
    sendEmailButton.disabled = false;
    sendEmailButton.innerText = "Add New Email";
  }, 2000);
}

function addTodo() {
  const expiryDate = document.getElementById("expiryDateTodo");
  const expiryDateArray = expiryDate.value.split("/");
  const newExpiryDate = new Date(
    expiryDateArray[2],
    expiryDateArray[1] - 1,
    expiryDateArray[0]
  );
  const timeStamp = newExpiryDate.getTime();

  const category = document.getElementById("selectTodo").value;
  const subCategory = $("#customTodo").val();

  const sendData = {
    expiry_date: timeStamp,
    todo: document.getElementById("todoBody").value,
    user_list: subcategory["users"],
    email_list: subcategory["emails"],
  };

  if (category == "users") {
    let user_list = [],
      email_list = [];

    for (let i = 0; i < subCategory.length; i++) {
      const element = subCategory[i].split(",");
      user_list.push(element[0]);
      email_list.push(element[1]);
    }

    sendData["user_list"] = user_list;
    sendData["email_list"] = email_list;
  } else if (category == "classrooms") {
    let user_list = [],
      email_list = [];

    for (let i = 0; i < subCategory.length; i++) {
      const classname = subcategory["classrooms"][subCategory[i]];
      for (let j = 0; j < classname.length; j++) {
        const user = classname[j];

        if (!user_list.includes(user)) {
          const ind = subcategory["users"].indexOf(user);
          user_list.push(user);
          email_list.push(subcategory["emails"][ind]);
        }
      }
    }
    sendData["user_list"] = user_list;
    sendData["email_list"] = email_list;
  }

  console.log(sendData);

  setTimeout(() => {
    const sendEmailButton = document.getElementById("addTodoButton");
    sendEmailButton.disabled = false;
    sendEmailButton.innerText = "Add Todo";
  }, 2000);
}

function addAnnouncement() {
  const expiryDate = document.getElementById("expiryDateAnnouncement");
  const expiryDateArray = expiryDate.value.split("/");
  const newExpiryDate = new Date(
    expiryDateArray[2],
    expiryDateArray[1] - 1,
    expiryDateArray[0]
  );
  const timeStamp = newExpiryDate.getTime();

  const category = document.getElementById("selectAnnouncement").value;
  const subCategory = $("#customAnnouncement").val();

  const sendData = {
    expiry_date: timeStamp,
    announcement: document.getElementById("announcementBody").value,
    user_list: subcategory["users"],
    email_list: subcategory["emails"],
  };

  if (category == "users") {
    let user_list = [],
      email_list = [];

    for (let i = 0; i < subCategory.length; i++) {
      const element = subCategory[i].split(",");
      user_list.push(element[0]);
      email_list.push(element[1]);
    }

    sendData["user_list"] = user_list;
    sendData["email_list"] = email_list;
  } else if (category == "classrooms") {
    let user_list = [],
      email_list = [];

    for (let i = 0; i < subCategory.length; i++) {
      const classname = subcategory["classrooms"][subCategory[i]];
      for (let j = 0; j < classname.length; j++) {
        const user = classname[j];

        if (!user_list.includes(user)) {
          const ind = subcategory["users"].indexOf(user);
          user_list.push(user);
          email_list.push(subcategory["emails"][ind]);
        }
      }
    }
    sendData["user_list"] = user_list;
    sendData["email_list"] = email_list;
  }

  console.log(sendData);

  setTimeout(() => {
    const sendEmailButton = document.getElementById("addAnnouncementButton");
    sendEmailButton.disabled = false;
    sendEmailButton.innerText = "Add Announcement";
  }, 2000);
}

function makeSubmenu(id, value) {
  const subId = id.replace("select", "custom");
  const sub = document.getElementById(subId);
  sub.innerHTML = "";
  $(function () {
    $(`#${subId}`).selectpicker("destroy");
  });
  if (value == "all") {
    sub.disabled = true;
    sub.multiple = false;
  } else {
    sub.multiple = true;
    sub.disabled = false;

    if (value == "users") {
      for (let i = 0; i < subcategory[value].length; i++) {
        const username = subcategory[value][i];
        const email = subcategory["emails"][i];

        const option = `<option value="${username},${email}">${username} [${email}]</option>`;
        sub.innerHTML += option;
      }
    } else {
      for (const classname in subcategory[value]) {
        const option = `<option value="${classname}">${classname}</option>`;
        sub.innerHTML += option;
      }
    }
    $(function () {
      $(`#${subId}`).selectpicker();
    });
  }
}
