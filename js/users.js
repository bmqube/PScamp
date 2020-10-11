const linkUser = url + "user";
const users = document.getElementById("users");
const usersHead = document.getElementById("usersHead");
const userDeleteAlert = document.getElementById("userDeleteAlert");

function getAlertElement(msg, cls) {
  const alert = document.createElement("div");
  alert.classList.add("alert", cls);
  alert.innerText = msg;
  return alert;
}

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

    if (data["delete_access"]) {
      usersHead.innerHTML += `<th scope="col">Actions</th>`;
    }

    const spinnerUsers = document.getElementById("spinnerUsers");
    if (!spinnerUsers.classList.contains("d-none")) {
      spinnerUsers.classList.add("d-none");
    }
    for (let i = 0; i < data["user_list"].length; i++) {
      const user = data["user_list"][i];

      const th = document.createElement("th");
      th.innerText = i + 1;

      const username = document.createElement("td");
      const a = document.createElement("a");
      a.href = `dashboard.html?user=${user["username"]}`;
      a.className = "text-decoration-none";
      a.innerText = user["username"];
      username.appendChild(a);

      const fullname = document.createElement("td");
      fullname.innerText = `${user["first_name"]} ${user["last_name"]}`;

      const totalSolve = document.createElement("td");

      let solveCount = 0;
      for (const oj in user["oj_info"]) {
        const element = user["oj_info"][oj]["solve_list"];
        if (element) {
          solveCount += element.length;
        }
      }
      totalSolve.innerText = solveCount;

      const tr = document.createElement("tr");
      tr.appendChild(th);
      tr.appendChild(username);
      tr.appendChild(fullname);
      tr.appendChild(totalSolve);

      if (data["delete_access"]) {
        const delButton = document.createElement("td");
        const button = deleteButton(`deleteModal("${user["username"]}")`);
        delButton.appendChild(button);
        tr.appendChild(delButton);
      }

      users.appendChild(tr);
    }
    $(document).ready(function () {
      const dt = $("#dataTable").DataTable({
        order: [[0, "asc"]],
        pageLength: 100,
      });

      dt.on("order.dt search.dt", function () {
        dt.column(0, { search: "applied", order: "applied" })
          .nodes()
          .each(function (cell, i) {
            cell.innerHTML = i + 1;
          });
      }).draw();
    });
  });

function deleteModal(id) {
  bootbox.confirm({
    title: "Wait..",
    message: `Are you sure? You want to delete <b>${id}</b>'s id?`,
    buttons: {
      confirm: {
        label: "Delete",
        className: "btn-danger",
      },
      cancel: {
        label: "Close",
        className: "btn-secondary",
      },
    },
    callback: function (result) {
      if (result) {
        deleteUser(id);
      }
    },
  });
}

function deleteUser(id) {
  const linkDeleteUser = url + "user";
  fetch(linkDeleteUser, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: id,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const alert = getAlertElement(data["message"], "alert-info");
      userDeleteAlert.appendChild(alert);

      setTimeout(() => {
        location.reload();
      }, 2000);
    });
}

function deleteButton(msg) {
  const button = document.createElement("button");
  button.classList.add("btn", "bg-light", "btn-circle", "ml-2");
  button.setAttribute("onclick", msg);

  // const icon = document.createElement("i");
  // icon.classList.add("fas", "fa-backspace");
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
  button.innerHTML += icon;
  return button;
}
