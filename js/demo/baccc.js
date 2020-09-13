import { url } from "../server.js";
// import { labels } from "../userinfo.js";
const link = url + "bmqube";

// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
function createChart(obj) {
  let names = [],
    cnt = [];
  const userDetails = obj.json();
  console.log(userDetails);
  for (const oj in userDetails) {
    if (userDetails.hasOwnProperty(oj)) {
      console.log(oj);
      const element = userDetails[oj];
      names.push(oj);
      cnt.push(element.length);
    }
  }
  var myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: names,
      datasets: [
        {
          data: cnt,
          backgroundColor: ["#4e73df"],
          hoverBackgroundColor: ["#2e59d9"],
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
      },
      legend: {
        display: false,
      },
      cutoutPercentage: 80,
    },
  });
}

fetch(link).then((data) => createChart(data));
