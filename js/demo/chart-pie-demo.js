import { colorArray } from "../color.js";

// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Pie Chart Example
var ctx = document.getElementById("myPieChart");

fetch(link)
  .then((res) => {
    if (res.status == 401 || res.status == 422) {
      logout();
    }
    return res.json();
  })
  .then((data) => {
    // console.log(data);
    let ojNames = [],
      solved = [];

    for (const oj in data) {
      if (data.hasOwnProperty(oj)) {
        const element = data[oj];
        ojNames.push(oj);
        solved.push(element.length);
      }
    }

    var myPieChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ojNames,
        datasets: [
          {
            data: solved,
            backgroundColor: colorArray.slice(0, ojNames.length),
            hoverBackgroundColor: colorArray.slice(0, ojNames.length),
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

    const displayOjNames = document.getElementById("ojnames");
    for (let i = 0; i < ojNames.length; i++) {
      const element = "  " + ojNames[i] + " ";
      const color = colorArray[i];

      const child = document.createElement("span");
      child.classList.add("mr-2");

      const childOfChild = document.createElement("i");
      childOfChild.classList.add("dot");
      childOfChild.setAttribute("style", `background-color: ${color}`);

      const nameChild = document.createTextNode(element);

      child.appendChild(childOfChild);
      child.appendChild(nameChild);

      displayOjNames.appendChild(child);
    }
  });
