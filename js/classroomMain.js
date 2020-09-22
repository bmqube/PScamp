const currentLocation = window.location.href;
const currentURL = new URL(currentLocation);
const classname = currentURL.searchParams.get("class");
const linkUser = url + "user";

if (!classname) {
  window.location.replace("/index.html");
}

const classHeading = document.getElementById("classHeading");
classHeading.innerText = `Classroom Name : ${classname.toUpperCase()}`;

const isBootcamp = document.getElementById("is_bootcamp");
const isRated = document.getElementById("is_rated");
const contestBody = document.getElementById("contestBody");
const classUpdateButton = document.getElementById("classUpdateButton");
const contestUpdateButton = document.getElementById("contestUpdateButton");

const userTablesBody = document.getElementById("userTablesBody");
const userTablesHead = document.getElementById("userTablesHead");

let edit_access = false,
  len = 0,
  toBeDeleted = [],
  userList;

function getAlertElement(msg, cls) {
  const alert = document.createElement("div");
  alert.classList.add("alert", cls);
  alert.innerText = msg;
  return alert;
}

function makeContest(contest, i) {
  // Contest Title

  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", `contestName${i}`);
  labelTitle.setAttribute(
    "class",
    "col-4 col-lg-5 font-weight-bold col-form-label"
  );
  labelTitle.innerText = "Contest Title:";

  const inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("id", `contestName${i}`);
  inputTitle.setAttribute("class", "form-control-plaintext");
  inputTitle.setAttribute("value", contest["contest_title"]);
  inputTitle.readOnly = true;

  const colTitle = document.createElement("div");
  colTitle.classList.add("col-4", "col-lg-5");
  colTitle.appendChild(inputTitle);

  const rowTitle = document.createElement("div");
  rowTitle.classList.add("row", "mb-2");
  rowTitle.appendChild(labelTitle);
  rowTitle.appendChild(colTitle);
  if (edit_access) {
    const editContestButton = editButton(`editContest("${i}")`);
    rowTitle.appendChild(editContestButton);

    const deleteContestButton = deleteButton(`deleteContest("${i}")`);
    rowTitle.appendChild(deleteContestButton);
  }

  // Contest ID
  const labelContestId = document.createElement("label");
  labelContestId.setAttribute("for", `contestId${i}`);
  labelContestId.setAttribute(
    "class",
    "col-4 col-lg-5 font-weight-bold col-form-label"
  );
  labelContestId.innerText = "Contest ID:";

  const inputContestId = document.createElement("input");
  inputContestId.setAttribute("type", "number");
  inputContestId.setAttribute("id", `contestId${i}`);
  inputContestId.setAttribute("class", "form-control-plaintext");
  inputContestId.setAttribute("value", contest["contest_id"]);
  inputContestId.readOnly = true;

  const colId = document.createElement("div");
  colId.classList.add("col-4", "col-lg-5");
  colId.appendChild(inputContestId);

  const rowId = document.createElement("div");
  rowId.classList.add("row", "mb-2");
  rowId.appendChild(labelContestId);
  rowId.appendChild(colId);

  // Contest Type
  const labelType = document.createElement("label");
  labelType.setAttribute("for", `contestType${i}`);
  labelType.setAttribute("class", "col-5 font-weight-bold col-form-label");
  labelType.innerText = "Contest Type:";

  const optionType1 = document.createElement("option");
  optionType1.value = "long";
  optionType1.innerText = "Long";

  const optionType2 = document.createElement("option");
  optionType2.value = "weekly";
  optionType2.innerText = "Weekly";

  const optionType3 = document.createElement("option");
  optionType3.value = "individual";
  optionType3.innerText = "Individual";

  const inputType = document.createElement("select");
  inputType.appendChild(optionType1);
  inputType.appendChild(optionType2);
  inputType.appendChild(optionType3);
  inputType.setAttribute("id", `contestType${i}`);
  inputType.setAttribute("class", "form-control-plaintext");
  inputType.value = contest["contest_type"];
  inputType.disabled = true;

  const colType = document.createElement("div");
  colType.classList.add("col-5");
  colType.appendChild(inputType);

  const rowType = document.createElement("div");
  rowType.classList.add("row", "mb-2");
  rowType.appendChild(labelType);
  rowType.appendChild(colType);

  // Total Problems
  const labelTotalProblems = document.createElement("label");
  labelTotalProblems.setAttribute("for", `contestProblems${i}`);
  labelTotalProblems.setAttribute(
    "class",
    "col-4 col-lg-5 font-weight-bold col-form-label"
  );
  labelTotalProblems.innerText = "Total Problems:";

  const inputTotalProblems = document.createElement("input");
  inputTotalProblems.setAttribute("type", "number");
  inputTotalProblems.setAttribute("id", `contestProblems${i}`);
  inputTotalProblems.setAttribute("class", "form-control-plaintext");
  inputTotalProblems.setAttribute("value", contest["total_problems"]);
  inputTotalProblems.readOnly = true;

  const colTotalProblems = document.createElement("div");
  colTotalProblems.classList.add("col-4", "col-lg-5");
  colTotalProblems.appendChild(inputTotalProblems);

  const rowTotalProblems = document.createElement("div");
  rowTotalProblems.classList.add("row", "mb-2");
  rowTotalProblems.appendChild(labelTotalProblems);
  rowTotalProblems.appendChild(colTotalProblems);

  // Required Problems
  const labelMinRequired = document.createElement("label");
  labelMinRequired.setAttribute("for", `minRequired${i}`);
  labelMinRequired.setAttribute(
    "class",
    "col-4 col-lg-5 font-weight-bold col-form-label"
  );
  labelMinRequired.innerText = "Minimum Solve Required:";

  const inputMinRequired = document.createElement("input");
  inputMinRequired.setAttribute("type", "number");
  inputMinRequired.setAttribute("id", `minRequired${i}`);
  inputMinRequired.setAttribute("class", "form-control-plaintext");
  inputMinRequired.setAttribute("value", contest["minimum_solve_required"]);
  inputMinRequired.readOnly = true;

  const colMinRequired = document.createElement("div");
  colMinRequired.classList.add("col-4", "col-lg-5");
  colMinRequired.appendChild(inputMinRequired);

  const rowMinRequired = document.createElement("div");
  rowMinRequired.classList.add("row", "mb-2");
  rowMinRequired.appendChild(labelMinRequired);
  rowMinRequired.appendChild(colMinRequired);

  // Adding to html site
  const card = document.createElement("div");
  card.classList.add("card", "mb-4", "p-3", "border-bottom-primary");
  card.appendChild(rowTitle);
  card.appendChild(rowId);
  card.appendChild(rowType);
  card.appendChild(rowTotalProblems);
  card.appendChild(rowMinRequired);

  return card;
}

function addNewContest() {
  const title = document.getElementById(`contestNameNew`);
  const contestId = document.getElementById(`contestIdNew`);
  const totalProb = document.getElementById(`contestProblemsNew`);
  const minRequired = document.getElementById(`minRequiredNew`);
  const contestType = document.getElementById(`contestTypeNew`);
  if (
    title.value &&
    contestId.value &&
    totalProb.value &&
    minRequired.value &&
    contestType.value &&
    edit_access
  ) {
    const data = {
      contest_title: title.value,
      total_problems: parseInt(totalProb.value, 10),
      minimum_solve_required: parseInt(minRequired.value, 10),
      contest_id: contestId.value,
      contest_type: contestType.value,
    };

    const newContest = makeContest(data, len);
    contestBody.appendChild(newContest);
    len++;

    updateContestInfo();

    const alertNewContest = document.getElementById("alertNewContest");
    const alert = getAlertElement("Contest Added", "alert-success");
    alertNewContest.appendChild(alert);
    setTimeout(() => {
      location.reload();
    }, 1000);
  } else {
    const alertNewContest = document.getElementById("alertNewContest");
    const alert = getAlertElement(
      "Error, A field can not be empty",
      "alert-danger"
    );
    alertNewContest.appendChild(alert);
  }
}

fetch(linkClass, {
  method: "POST",
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
    if (data["edit_access"]) {
      edit_access = true;
    }

    const element = data["classroom_list"];
    // console.log(element);

    let classFound = false;

    for (let i = 0; i < element.length; i++) {
      const elem = element[i];

      if (edit_access) {
        const th = document.createElement("th");
        th.innerText = "Actions";

        userTablesHead.appendChild(th);
      }

      if (elem["classroom_name"] == classname) {
        userList = elem["user_list"];
        // console.log(userList);

        for (let i = 0; i < userList.length; i++) {
          const username = userList[i];

          const tr = document.createElement("tr");
          const th = document.createElement("th");
          th.setAttribute("scope", "row");
          th.innerText = i + 1;

          const td = document.createElement("td");
          const a = document.createElement("a");
          a.href = `dashboard.html?user=${username}`;
          a.target = "_blank";
          a.innerText = username;

          td.appendChild(a);

          tr.appendChild(th);
          tr.appendChild(td);

          if (edit_access) {
            const td = document.createElement("th");
            const deleteUserButton = deleteButton(`deleteUser("${username}")`);
            td.appendChild(deleteUserButton);

            tr.appendChild(td);
          }

          userTablesBody.appendChild(tr);
        }

        classFound = true;
        const contestList = elem["vjudge_contest_list"];
        len = contestList.length;

        isBootcamp.value = elem["is_bootcamp"];
        isRated.value = elem["is_rated"];

        if (edit_access) {
          const buttonBootcamp = editButton(`edit("is_bootcamp")`);
          const buttonRated = editButton(`edit("is_rated")`);

          document.getElementById("addNewPop").classList.remove("d-none");
          document.getElementById("addNewUser").classList.remove("d-none");
          document
            .getElementById("classDeleteButton")
            .classList.remove("d-none");
          isBootcamp.parentElement.parentElement.appendChild(buttonBootcamp);
          isRated.parentElement.parentElement.appendChild(buttonRated);
          contestUpdateButton.classList.remove("d-none");
          classUpdateButton.classList.remove("d-none");
        }

        for (let i = 0; i < len; i++) {
          const contest = contestList[i];
          const card = makeContest(contest, i);

          contestBody.appendChild(card);
        }
      }
    }
    if (!classFound) {
      window.location.replace("/index.html");
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

    const users = data["user_list"];
    const datalist = document.createElement("datalist");
    datalist.setAttribute("id", "users");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (!userList.includes(user)) {
        const option = document.createElement("option");
        option.value = user["username"];
        datalist.appendChild(option);
      }

      document.getElementById("addNewUser").parentElement.appendChild(datalist);
    }
  });

function deleteUser(id) {
  const index = userList.indexOf(id);
  if (index >= 0) {
    userList.splice(index, 1);
  }
  updateClassInfo();
}

function updateClassInfo() {
  fetch(linkClass, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classroom_name: classname,
      is_rated: isRated.value,
      is_bootcamp: isBootcamp.value,
      user_list: userList,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["msg"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      const alertClassInfo = document.getElementById("alertClassInfo");
      if (data["message"] == "data updated") {
        const alert = getAlertElement(data["message"], "alert-success");
        alertClassInfo.appendChild(alert);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        const alert = getAlertElement(data["message"], "alert-danger");
        alertClassInfo.appendChild(alert);
      }
    });
}

function addNewUser() {
  const newUser = document.getElementById("userNameNew").value;
  if (!userList.includes(newUser)) {
    userList.push(newUser);
    updateClassInfo();
  } else {
    const alert = getAlertElement(
      "User already exists in this class",
      "alert-danger"
    );
    document.getElementById("alertNewUser").appendChild(alert);
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

function deleteClass() {
  fetch(linkClass, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classroom_name: classname,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["msg"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      const alertClassInfo = document.getElementById("alertClassInfo");
      if (data["message"] == "classroom deleted") {
        const alert = getAlertElement(data["message"], "alert-success");
        alertClassInfo.appendChild(alert);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        const alert = getAlertElement(data["message"], "alert-danger");
        alertClassInfo.appendChild(alert);
      }
    });
}

function updateContestInfo() {
  const postData = {
    classroom_name: classname,
    vjudge_contest_list: [],
    user_list: userList,
  };
  for (let i = 0; i < len; i++) {
    if (!toBeDeleted.includes(i)) {
      const title = document.getElementById(`contestName${i}`);
      const contestId = document.getElementById(`contestId${i}`);
      const totalProb = document.getElementById(`contestProblems${i}`);
      const minRequired = document.getElementById(`minRequired${i}`);
      const contestType = document.getElementById(`contestType${i}`);
      const data = {
        contest_title: title.value,
        total_problems: parseInt(totalProb.value, 10),
        minimum_solve_required: parseInt(minRequired.value, 10),
        contest_id: contestId.value,
        contest_type: contestType.value,
      };
      postData["vjudge_contest_list"].push(data);
    }
  }

  // console.log(postData);

  fetch(linkClass, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["msg"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      const alertContestInfo = document.getElementById("alertContestInfo");
      if (data["message"] == "data updated") {
        const alert = getAlertElement(data["message"], "alert-success");
        alertContestInfo.appendChild(alert);
        // setTimeout(() => {
        //   location.reload();
        // }, 1000);
      } else {
        const alert = getAlertElement(data["message"], "alert-danger");
        alertContestInfo.appendChild(alert);
      }
    });
}

function editContest(id) {
  const title = document.getElementById(`contestName${id}`);
  const contestId = document.getElementById(`contestId${id}`);
  const totalProb = document.getElementById(`contestProblems${id}`);
  const minRequired = document.getElementById(`minRequired${id}`);
  const contestType = document.getElementById(`contestType${id}`);
  if (title.readOnly) {
    title.readOnly = false;
    title.classList.remove("form-control-plaintext");
    title.classList.add("form-control");

    contestId.readOnly = false;
    contestId.classList.remove("form-control-plaintext");
    contestId.classList.add("form-control");

    contestType.disabled = false;
    contestType.classList.remove("form-control-plaintext");
    contestType.classList.add("form-control");

    totalProb.readOnly = false;
    totalProb.classList.remove("form-control-plaintext");
    totalProb.classList.add("form-control");

    minRequired.readOnly = false;
    minRequired.classList.remove("form-control-plaintext");
    minRequired.classList.add("form-control");
  } else {
    title.readOnly = true;
    title.classList.remove("form-control");
    title.classList.add("form-control-plaintext");

    contestId.readOnly = true;
    contestId.classList.remove("form-control");
    contestId.classList.add("form-control-plaintext");

    contestType.disabled = true;
    contestType.classList.remove("form-control");
    contestType.classList.add("form-control-plaintext");

    totalProb.readOnly = true;
    totalProb.classList.remove("form-control");
    totalProb.classList.add("form-control-plaintext");

    minRequired.readOnly = true;
    minRequired.classList.remove("form-control");
    minRequired.classList.add("form-control-plaintext");
  }
}

function deleteContest(id) {
  toBeDeleted.push(parseInt(id, 10));
  updateContestInfo();
}

function deleteButton(msg) {
  const button = document.createElement("button");
  button.classList.add("btn", "btn-danger", "btn-circle", "ml-2");
  button.setAttribute("onclick", msg);

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-backspace");
  button.appendChild(icon);
  return button;
}

function editButton(msg) {
  const button = document.createElement("button");
  button.classList.add("btn", "btn-success", "btn-circle");
  button.setAttribute("onclick", msg);

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-edit");
  button.appendChild(icon);

  return button;
}

function edit(id) {
  const elem = document.getElementById(id);
  if (elem.disabled) {
    elem.setAttribute("class", "form-control");
    elem.disabled = false;
  } else {
    elem.setAttribute("class", "form-control-plaintext");
    elem.disabled = true;
  }
}
