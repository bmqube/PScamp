const linkDashboard = url + "dashboard";
const linkProfile = url + "user";
let sendData = {};

const dashboardText = document.getElementById("dashboardText");
const solvedToday = document.getElementById("solvedToday");
const solvedLastMonth = document.getElementById("solvedLastMonth");
const solvedTotal = document.getElementById("solvedTotal");

const contestDetails = document.getElementById("contestDetails");
const tasksPercentage = document.getElementById("tasksPercentage");
const tasksProgress = document.getElementById("tasksProgress");

const currentLocation = window.location.href;
const currentURL = new URL(currentLocation);
const userName = currentURL.searchParams.get("user");
const classname = currentURL.searchParams.get("class");

if (classname) {
  sendData["classroom_name"] = classname;
}
if (userName) {
  sendData["username"] = userName;
}

// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + "").replace(",", "").replace(" ", "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

fetch(linkProfile, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    if (data["is_admin"]) {
      window.localStorage.setItem("is_admin", true);
      adminNav.className = "dropdown-item";
    }
  });

fetch(linkDashboard, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify(sendData),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    // Dashboard Details
    dashboardText.innerText = `${
      data["username"].charAt(0).toUpperCase() + data["username"].slice(1)
    }'s Dashboard`;
    let len = data["last_30_days_solve"][1].length,
      userSolved = 0,
      minSolved = 0;
    solvedToday.innerText = data["last_day_solve"];
    solvedLastMonth.innerText =
      data["last_30_days_solve"][1][0] - data["last_30_days_solve"][1][len - 1];
    solvedTotal.innerText = data["last_30_days_solve"][1][0];

    // To Do
    const todoList = document.getElementById("todo");
    for (let i = 0; i < data["todo_list"].length; i++) {
      const todo = data["todo_list"][i];
      todoList.innerHTML += `<div class="d-flex align-items-center mb-4">
      <div class="mr-3">
        <div class="icon-circle bg-warning">
          <i class="fas fa-exclamation-triangle text-white"></i>
        </div>
      </div>
      <div>
        ${todo}
      </div>
    </div>`;
    }

    // Announcements
    const announcements = document.getElementById("announcements");
    for (let i = 0; i < data["announcement_list"].length; i++) {
      const announcement = data["announcement_list"][i];
      announcements.innerHTML += `<div class="d-flex align-items-center mb-4">
      <div class="mr-3">
        <div class="icon-circle bg-primary">
          <i class="fas fa-file-alt text-white"></i>
        </div>
      </div>
      <div>
        ${announcement}
      </div>
    </div>`;
    }

    // Progress Bar
    for (let i = 0; i < data["long_contests"].length; i++) {
      const contest = data["long_contests"][i];

      userSolved += Math.min(
        contest["solved_problems"],
        contest["minimum_solve_required"]
      );
      minSolved += contest["minimum_solve_required"];

      const solvePercentage = Math.round(
        (contest["solved_problems"] / contest["total_problems"]) * 100
      );

      const span = document.createElement("span");
      span.setAttribute("class", "float-right");
      span.innerText = solvePercentage + "%";

      const title = document.createElement("h4");
      title.setAttribute("class", "small font-weight-bold");

      const a = document.createElement("a");
      a.href = `https://vjudge.net/contest/${contest["contest_id"]}`;
      a.className = "text-secondary text-decoration-none";
      a.innerText = contest["contest_title"];
      a.target = "_blank";

      title.appendChild(a);
      title.appendChild(span);

      const body = document.createElement("div");
      body.setAttribute("class", "progress mb-4");

      const progress = document.createElement("div");
      progress.setAttribute("class", "progress-bar");
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("style", `width: ${solvePercentage}%`);
      progress.setAttribute("aria-valuenow", solvePercentage);
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", "100");
      if (contest["solved_problems"] < contest["minimum_solve_required"]) {
        progress.classList.add("bg-danger");
      } else if (solvePercentage < 80) {
        progress.classList.add("bg-warning");
      } else {
        progress.classList.add("bg-success");
      }
      body.appendChild(progress);

      const totalProblem = document.createElement("small");
      totalProblem.innerText = `Total: ${contest["total_problems"]}`;

      const solvedProblem = document.createElement("small");
      solvedProblem.innerText = `Solved: ${contest["solved_problems"]}`;

      const minRequired = document.createElement("small");
      minRequired.innerText = `Required: ${contest["minimum_solve_required"]}`;

      const contestInfo = document.createElement("div");
      contestInfo.setAttribute("class", "d-flex justify-content-between");
      contestInfo.appendChild(totalProblem);
      contestInfo.appendChild(solvedProblem);
      contestInfo.appendChild(minRequired);

      contestDetails.appendChild(title);
      contestDetails.appendChild(contestInfo);
      contestDetails.appendChild(body);
    }

    // Tasks
    const minPercentage = Math.round((userSolved / minSolved) * 100);
    tasksPercentage.innerText = `${minPercentage}%`;

    tasksProgress.setAttribute("style", `width: ${minPercentage}%`);
    tasksProgress.setAttribute("aria-valuenow", minPercentage);

    // Pie Chart
    const obj = {};
    for (let i = 0; i < data["last_30_days_solve"][1].length - 1; i++) {
      const today = data["last_30_days_solve"][1][i];
      const yesterday = data["last_30_days_solve"][1][i + 1];
      const solvedToday = today - yesterday;
      if (solvedToday <= 1) {
        obj[solvedToday] = obj[solvedToday] ? obj[solvedToday] + 1 : 1;
      } else if (solvedToday <= 3) {
        obj[`2-3`] = obj[`2-3`] ? obj[`2-3`] + 1 : 1;
      } else {
        obj[`3+`] = obj[`3+`] ? obj[`3+`] + 1 : 1;
      }
    }

    let labels = Object.keys(obj),
      values = [],
      colorArray = [];
    labels.sort();

    document.getElementById(
      "solvePerDayAnalysis"
    ).innerText += ` ${data["last_30_days_solve"][1].length} Days)`;

    for (let i = 0; i < labels.length; i++) {
      const element = labels[i];
      if (element == "0") {
        colorArray.push("#e74a3b");
      } else if (element == "1") {
        colorArray.push("#36b9cc");
      } else if (element === "2-3") {
        colorArray.push("#1cc88a");
      } else {
        colorArray.push("#4e73df");
      }
      values.push(obj[element]);
    }

    const pieChart = document.getElementById("myPieChart");
    const myPieChart = new Chart(pieChart, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colorArray,
            hoverBackgroundColor: colorArray,
            hoverBorderColor: "rgba(234, 236, 244, 1)",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: "#dddfeb",
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          mode: "label",
          callbacks: {
            label: function (tooltipItem, data) {
              var indice = tooltipItem.index;
              return data.datasets[0].data[indice] + " Days";
            },
          },
        },
        legend: {
          display: false,
        },
        cutoutPercentage: 80,
      },
    });

    // Area Chart
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data["last_30_days_solve"][0].reverse(),
        datasets: [
          {
            label: "Solved",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: data["last_30_days_solve"][1].reverse(),
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0,
          },
        },
        scales: {
          xAxes: [
            {
              time: {
                unit: "date",
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                maxTicksLimit: 7,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return number_format(value);
                },
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2],
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: "#6e707e",
          titleFontSize: 14,
          borderColor: "#dddfeb",
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: "index",
          caretPadding: 10,
          callbacks: {
            label: function (tooltipItem, chart) {
              var datasetLabel =
                chart.datasets[tooltipItem.datasetIndex].label || "";
              return datasetLabel + ": " + number_format(tooltipItem.yLabel);
            },
          },
        },
      },
    });
  });
