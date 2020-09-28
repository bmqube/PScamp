const currentLocation = window.location.href;
const currentURL = new URL(currentLocation);
const classname = currentURL.searchParams.get("class");

if (!classname) {
  window.location.replace("/index.html");
}

let len = 0;

const linkRank = url + "classrank";
const dataTable = document.getElementById("dataTable");
const rankHeading = document.getElementById("rankHeading");
rankHeading.innerText = `Ranklist of ${classname.toUpperCase()}`;

const contestType = document.getElementById("contestType");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");

// console.log(data);

function updateRankInfo() {
  const dateFromArray = dateFrom.value.split("/");
  const newDateFrom = new Date(
    dateFromArray[2],
    dateFromArray[1] - 1,
    dateFromArray[0]
  );
  const timeStampFrom = newDateFrom.getTime();

  const dateToArray = dateTo.value.split("/");
  const newDateTo = new Date(
    dateToArray[2],
    dateToArray[1] - 1,
    dateToArray[0]
  );
  const timeStampTo = newDateTo.getTime();

  fetch(linkRank, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classroom_name: classname,
      contest_type: contestType.value,
      start_time: timeStampFrom || 0,
      end_time: timeStampTo || 1000000000000000000000000000000,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["msg"] == "Token has expired") {
        window.localStorage.removeItem("access_token");
        window.location.href = "/login.html";
      }
      console.log(contestType.value);

      const spinner = document.getElementById("spinner");
      if (!spinner.classList.contains("d-none")) {
        spinner.classList.add("d-none");
      }

      const table = $("#dataTable").DataTable();
      table.destroy();
      dataTable.innerHTML = "";
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");

      const th = document.createElement("th");
      th.innerText = "#";

      tr.appendChild(th);

      len = data[0].length;
      for (let i = 0; i < data[0].length; i++) {
        const element = data[0][i];

        const th = document.createElement("th");
        th.innerText = element;

        tr.appendChild(th);
      }
      thead.appendChild(tr);

      const tBody = document.createElement("tbody");
      for (let i = 1; i < data.length; i++) {
        const trBody = document.createElement("tr");
        const td = document.createElement("td");
        td.innerText = i;
        trBody.appendChild(td);

        for (let j = 0; j < data[i].length; j++) {
          const element = data[i][j];

          const td = document.createElement("td");
          if (j) {
            td.innerText = element;
          } else {
            const a = document.createElement("a");
            a.href = `dashboard.html?user=${element}&class=${classname}`;
            a.className = "text-decoration-none";
            a.target = "_blank";
            a.innerText = element;

            td.appendChild(a);
          }

          trBody.appendChild(td);
        }
        tBody.appendChild(trBody);
      }

      dataTable.appendChild(thead);
      dataTable.appendChild(tBody);

      // Data Table
      $(document).ready(function () {
        const dt = $("#dataTable").DataTable({
          order: [[1, "asc"]],
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
}

fetch(linkRank, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    classroom_name: classname,
    contest_type: contestType.value,
    start_time: 0,
    end_time: 1000000000000000000000000000000,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }
    const spinner = document.getElementById("spinner");
    if (!spinner.classList.contains("d-none")) {
      spinner.classList.add("d-none");
    }

    dataTable.innerHTML = "";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    len = data[0].length;

    const th = document.createElement("th");
    th.innerText = "#";

    tr.appendChild(th);
    for (let i = 0; i < data[0].length; i++) {
      const element = data[0][i];

      const th = document.createElement("th");
      th.innerText = element;

      tr.appendChild(th);
    }
    thead.appendChild(tr);

    const tBody = document.createElement("tbody");
    for (let i = 1; i < data.length; i++) {
      const trBody = document.createElement("tr");

      const td = document.createElement("td");
      td.innerText = i;
      trBody.appendChild(td);

      for (let j = 0; j < data[i].length; j++) {
        const element = data[i][j];

        const td = document.createElement("td");
        if (j) {
          td.innerText = element;
        } else {
          const a = document.createElement("a");
          a.href = `dashboard.html?user=${element}&class=${classname}`;
          a.className = "text-decoration-none";
          a.target = "_blank";
          a.innerText = element;

          td.appendChild(a);
        }

        trBody.appendChild(td);
      }
      tBody.appendChild(trBody);
    }

    dataTable.appendChild(thead);
    dataTable.appendChild(tBody);

    // Data Table
    $(document).ready(function () {
      const dt = $("#dataTable").DataTable({
        order: [[1, "asc"]],
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
