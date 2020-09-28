const linkUpdateScheduler = url + "updatescheduler";
const linkSync = url + "ojupdate";
const linkUser = url + "user";
const linkWhitelistedEmail = url + "whitelist";
const linkAnnouncements = url + "announcements";
const linkTodos = url + "todos";

const nextRunOn = document.getElementById("nextRunOn");
const level = document.getElementById("level");
const interval = document.getElementById("interval");

const emailSelect = document.getElementById("emailSelect");

let whitelistedEmail = [],
  todoList = [],
  announcementList = [],
  lenEmail,
  classes = [];

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
    }
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
    const selectTodo = document.getElementById("selectTodo");
    const selectAnnouncement = document.getElementById("selectAnnouncement");

    const elements = data["classroom_list"];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]["classroom_name"];
      subcategory["classrooms"][element] = [];
      classes.push(element);

      selectTodo.innerHTML += `<option value="${element}">${element.toUpperCase()}</option>`;
      selectAnnouncement.innerHTML += `<option value="${element}">${element.toUpperCase()}</option>`;

      for (let j = 0; j < elements[i]["user_list"].length; j++) {
        const user = elements[i]["user_list"][j];
        subcategory["classrooms"][element].push(user);
      }
    }
  });

fetch(linkAnnouncements, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }

    // console.log(data);

    if (data["announcements_list"]) {
      announcementList = data["announcements_list"];
      const groupList = [];
      // console.log(announcements);

      const announcementBody = document.getElementById("announcements");

      for (let i = 0; i < announcementList.length; i++) {
        const announcement = announcementList[i];
        let time;

        groupList.push(announcement["group"]);

        let options = "";
        for (let i = 0; i < classes.length; i++) {
          const kelash = classes[i];
          options += `<option value="${kelash}">${kelash.toUpperCase()}</option>`;
        }

        time = `${new Date(announcement["expires_on"]).getDate()}/${
          new Date(announcement["expires_on"]).getMonth() + 1
        }/${new Date(announcement["expires_on"]).getFullYear()}`;
        announcementBody.innerHTML += `<div class="list-group-item border border-bottom-primary mb-2 rounded">
      <textarea id="announcement${i}" class="mb-2 form-control-plaintext" disabled>${announcement["announcement"]}</textarea>
      <hr>
      <small class="row">
        <div class="col-md-6 pr-2 mb-2">
          Target Audience: <select id="selectAnnouncement${i}" class="form-control-plaintext" disabled>
            <option value="all">
              All
            </option>
            ${options}
          </select>
        </div>
        <div class="col-md-6 mb-2">
          Expires On: <input id="expiryDateAnnouncement${i}" type="text" class="form-control-plaintext" value="${time}" readonly>
        </div>
      </small>
      <div id="updateAnnouncement${i}" style="cursor:pointer;" class="col-sm text-center text-success border border-success rounded mb-2 d-none" onclick="updateAnnouncement(&quot;announcement${i}&quot;)">
          Update
      </div>
      <div class="row">
        <div style="cursor:pointer;" class="col-sm text-center text-primary border border-primary rounded m-2" onclick="editAnnouncement(&quot;announcement${i}&quot;)">
          Edit
        </div>
        <div style="cursor:pointer;" class="col-sm text-center text-danger border border-danger rounded m-2" onclick="deleteModal(&quot;announcement${i}&quot;, &quot;announcement&quot;)">
          Delete
        </div>
      </div>
    </div>`;
      }
      for (let i = 0; i < groupList.length; i++) {
        const group = groupList[i];
        document.getElementById(`selectAnnouncement${i}`).value = group;
      }
    }
  });

fetch(linkTodos, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }

    if (data["todos_list"]) {
      todoList = data["todos_list"];
      const groupList = [];
      // console.log(data);

      const todoBody = document.getElementById("todos");

      for (let i = 0; i < todoList.length; i++) {
        const todo = todoList[i];

        const time = `${new Date(todo["expires_on"]).getDate()}/${
          new Date(todo["expires_on"]).getMonth() + 1
        }/${new Date(todo["expires_on"]).getFullYear()}`;

        let options = "";
        for (let i = 0; i < classes.length; i++) {
          const kelash = classes[i];
          options += `<option value="${kelash}">${kelash.toUpperCase()}</option>`;
        }

        groupList.push(todo["group"]);

        todoBody.innerHTML += `<div class="list-group-item border border-bottom-primary mb-2 rounded">
        <textarea id="todo${i}" class="mb-2 form-control-plaintext" disabled>${todo["todo"]}</textarea>
        <hr>
        <small class="row">
          <div class="col-md-6 pr-2 mb-2">
            Target Audience: <select id="selectTodo${i}" class="form-control-plaintext" disabled>
              <option value="all">
                All
              </option>
              ${options}
            </select>
          </div>
          <div class="col-md-6 mb-2">
            Expires On: <input id="expiryDateTodo${i}" type="text" class="form-control-plaintext" value="${time}" readonly>
          </div>
        </small>
        <div id="updateTodo${i}" style="cursor:pointer;" class="col-sm text-center text-success border border-success rounded mb-2 d-none" onclick="updateTodo(&quot;todo${i}&quot;)">
          Update
        </div>
        <div class="row">
          <div style="cursor:pointer;" class="col-sm text-center text-primary border border-primary rounded m-2" onclick="editTodo(&quot;todo${i}&quot;)">
            Edit
          </div>
          <div style="cursor:pointer;" class="col-sm text-center text-danger border border-danger rounded m-2" onclick="deleteModal(&quot;todo${i}&quot;, &quot;todo&quot;)">
            Delete
          </div>
        </div>
      </div>`;
      }
      for (let i = 0; i < groupList.length; i++) {
        const group = groupList[i];
        document.getElementById(`selectTodo${i}`).value = group;
      }
    }
  });

fetch(linkWhitelistedEmail, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }

    // console.log(data);
    whitelistedEmail = data["email_list"];

    const tbody = document.getElementById("whiteListedBody");
    for (let i = 0; i < whitelistedEmail.length; i++) {
      const email = whitelistedEmail[i];

      const deleteModalButton = deleteButton(
        `deleteModal("email${i}", "email")`
      );
      // const editButtonMail = editButton(`edit("email${i}")`);

      const tr = document.createElement("tr");
      tr.innerHTML += `
      <th scope="row" class="p-3">${i + 1}</th>
      <td><input type="text" class="form-control-plaintext" id="email${i}" value="${email}" readOnly></td>`;

      // tr.appendChild(editButtonMail);
      const td = document.createElement("td");
      td.appendChild(deleteModalButton);

      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  });

function editTodo(id) {
  const index = parseInt(id.replace(/[^0-9]/g, ""), 10);
  const expiryDate = document.getElementById(`expiryDateTodo${index}`);
  const group = document.getElementById(`selectTodo${index}`);
  const todo = document.getElementById(`todo${index}`);
  const updateTodo = document.getElementById(`updateTodo${index}`);

  if (todo.disabled) {
    updateTodo.classList.remove("d-none");
    todo.className = "form-control";
    todo.disabled = false;

    group.className = "form-control";
    group.disabled = false;

    expiryDate.className = "form-control";
    expiryDate.readOnly = false;
  } else {
    updateTodo.classList.add("d-none");
    todo.className = "form-control-plaintext";
    todo.disabled = true;

    group.className = "form-control-plaintext";
    group.disabled = true;

    expiryDate.className = "form-control-plaintext";
    expiryDate.readOnly = true;
  }
}

function editAnnouncement(id) {
  const index = parseInt(id.replace(/[^0-9]/g, ""), 10);
  const expiryDate = document.getElementById(`expiryDateAnnouncement${index}`);
  const group = document.getElementById(`selectAnnouncement${index}`);
  const announcement = document.getElementById(`announcement${index}`);
  const updateAnnouncement = document.getElementById(
    `updateAnnouncement${index}`
  );

  if (announcement.disabled) {
    updateAnnouncement.classList.remove("d-none");

    announcement.className = "form-control";
    announcement.disabled = false;

    group.className = "form-control";
    group.disabled = false;

    expiryDate.className = "form-control";
    expiryDate.readOnly = false;
  } else {
    updateAnnouncement.classList.add("d-none");
    announcement.className = "form-control-plaintext";
    announcement.disabled = true;

    group.className = "form-control-plaintext";
    group.disabled = true;

    expiryDate.className = "form-control-plaintext";
    expiryDate.readOnly = true;
  }
}

function updateTodo(id) {
  const index = parseInt(id.replace(/[^0-9]/g, ""), 10);
  const expiryDate = document.getElementById(`expiryDateTodo${index}`);
  const expiryDateArray = expiryDate.value.split("/");
  const newExpiryDate = new Date(
    expiryDateArray[2],
    expiryDateArray[1] - 1,
    expiryDateArray[0]
  );
  const timeStamp = newExpiryDate.getTime();

  const group = document.getElementById(`selectTodo${index}`).value;

  todoList[index]["expires_on"] = timeStamp;
  todoList[index]["todo"] = document.getElementById(`todo${index}`).value;
  todoList[index]["group"] = group;

  const sendData = {
    todos_list: todoList,
  };

  // console.log(sendData);

  fetch(linkTodos, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      bootbox.alert(data["message"]);
      setTimeout(() => {
        location.reload();
      }, 2000);
    });
}

function deleteTodo(id) {
  const index = parseInt(id.replace(/[^0-9]/g, ""), 10);
  const sendData = todoList[index];
  // console.log(sendData);

  fetch(linkTodos, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todos_list: [sendData],
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      bootbox.alert(data["message"]);
      setTimeout(() => {
        location.reload();
      }, 2000);
    });
}

function deleteAnnouncement(id) {
  const index = parseInt(id.replace(/[^0-9]/g, ""), 10);
  const sendData = announcementList[index];
  // console.log(sendData);

  fetch(linkAnnouncements, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      announcements_list: [sendData],
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      bootbox.alert(data["message"]);
      setTimeout(() => {
        location.reload();
      }, 2000);
    });
}

function updateAnnouncement(id) {
  const index = parseInt(id.replace(/[^0-9]/g, ""), 10);
  const expiryDate = document.getElementById(`expiryDateAnnouncement${index}`);
  const expiryDateArray = expiryDate.value.split("/");
  const newExpiryDate = new Date(
    expiryDateArray[2],
    expiryDateArray[1] - 1,
    expiryDateArray[0]
  );
  const timeStamp = newExpiryDate.getTime();

  const group = document.getElementById(`selectAnnouncement${index}`).value;

  announcementList[index]["expires_on"] = timeStamp;
  announcementList[index]["announcement"] = document.getElementById(
    `announcement${index}`
  ).value;
  announcementList[index]["group"] = group;

  fetch(linkAnnouncements, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      announcements_list: announcementList,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      bootbox.alert(data["message"]);
      setTimeout(() => {
        location.reload();
      }, 2000);
    });
}

function editButton(msg) {
  const button = document.createElement("button");
  button.classList.add("btn", "btn-sm", "mt-3", "btn-success", "btn-circle");
  button.setAttribute("onclick", msg);

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-edit");
  button.appendChild(icon);

  return button;
}

function edit(id) {
  const elem = document.getElementById(id);
  if (elem.readOnly) {
    elem.setAttribute("class", "form-control");
    elem.readOnly = false;
  } else {
    elem.setAttribute("class", "form-control-plaintext");
    elem.readOnly = true;
  }
}

function deleteButton(msg) {
  const button = document.createElement("button");
  button.classList.add(
    "btn",
    "btn-sm",
    "btn-danger",
    "btn-circle",
    "ml-2",
    "mt-3"
  );
  button.setAttribute("onclick", msg);

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-backspace");
  button.appendChild(icon);
  return button;
}

function deleteModal(id, type) {
  bootbox.confirm({
    title: "Wait..",
    message: `Are you sure? You want to remove <b>${
      document.getElementById(id).value
    }</b>`,
    buttons: {
      confirm: {
        label: "Remove",
        className: "btn-danger",
      },
      cancel: {
        label: "Close",
        className: "btn-secondary",
      },
    },
    callback: function (result) {
      if (result) {
        if (type == "email") {
          deleteEmail(id);
        } else if (type == "todo") {
          deleteTodo(id);
        } else if (type == "announcement") {
          deleteAnnouncement(id);
        }
      }
    },
  });
}

function deleteEmail(id) {
  const index = parseInt(id.replace(/[^0-9]/g, ""), 10);
  whitelistedEmail.splice(index, 1);

  // console.log(whitelistedEmail);

  fetch(linkWhitelistedEmail, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_list: whitelistedEmail,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      bootbox.alert("Email Removed");
    });

  setTimeout(() => {
    const addNewEmailButton = document.getElementById("addNewEmailButton");
    addNewEmailButton.disabled = false;
    addNewEmailButton.innerText = "Add New Email";
    // location.reload();
  }, 2000);
}

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
  const formData = emailText.split(/\s*[,\n]+\s*/);

  let sendData = whitelistedEmail.concat(formData);
  sendData = [...new Set([...whitelistedEmail, ...formData])];

  fetch(linkWhitelistedEmail, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_list: sendData,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      bootbox.alert(data);
    });

  setTimeout(() => {
    const addNewEmailButton = document.getElementById("addNewEmailButton");
    addNewEmailButton.disabled = false;
    addNewEmailButton.innerText = "Add New Email";
    location.reload();
  }, 2000);
}

function sendMail() {
  const linkSendMail = url + "sendmail";
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

  fetch(linkSendMail, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  })
    .then((res) => res.json())
    .then((data) => {
      bootbox.alert(data["message"]);
    });

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

  const group = document.getElementById("selectTodo").value;

  const sendData = {
    added_on: new Date().getTime(),
    expires_on: timeStamp,
    todo: document.getElementById("todoBody").value,
    group: group,
  };

  fetch(linkTodos, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todos_list: [sendData],
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      bootbox.alert(data["message"]);
      setTimeout(() => {
        location.reload();
        // const sendEmailButton = document.getElementById("addTodoButton");
        // sendEmailButton.disabled = false;
        // sendEmailButton.innerText = "Add Todo";
      }, 2000);
    });
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

  const group = document.getElementById("selectAnnouncement").value;

  const sendData = {
    added_on: new Date().getTime(),
    expires_on: timeStamp,
    group: group,
    announcement: document.getElementById("announcementBody").value,
  };

  // console.log(sendData);

  fetch(linkAnnouncements, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      announcements_list: [sendData],
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      bootbox.alert(data["message"]);
      setTimeout(() => {
        location.reload();
        // const sendEmailButton = document.getElementById("addTodoButton");
        // sendEmailButton.disabled = false;
        // sendEmailButton.innerText = "Add Todo";
      }, 2000);
    });
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
