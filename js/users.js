const linkUser = url + "user";
const users = document.getElementById("users");
const usersHead = document.getElementById("usersHead");

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
    console.log(data);
    const spinnerUsers = document.getElementById("spinnerUsers");
    if (!spinnerUsers.classList.contains("d-none")) {
      spinnerUsers.classList.add("d-none");
    }
    for (let i = 0; i < data.length; i++) {
      const user = data[i];

      const th = document.createElement("th");
      th.innerText = i + 1;

      const username = document.createElement("td");
      username.innerText = user["username"];

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
      tr.appendChild(totalSolve);

      users.appendChild(tr);
    }
  });

function deleteUser(id) {}

function deleteButton(msg) {
  const button = document.createElement("button");
  button.classList.add("btn", "btn-danger", "btn-circle", "ml-2");
  button.setAttribute("onclick", msg);

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-backspace");
  button.appendChild(icon);
  return button;
}
