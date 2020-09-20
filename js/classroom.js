const linkClass = url + "classroom";
const classList = document.getElementById("classList");

function addList() {
  if (!classList.childNodes.length) {
    const spinner = document.createElement("div");
    spinner.setAttribute("id", "spinnerClassInfo");
    spinner.setAttribute("class", "spinner-border text-primary");
    spinner.setAttribute("role", "status");

    const sr = document.createElement("span");
    sr.setAttribute("class", "sr-only");
    sr.innerText = "Loading...";
    spinner.appendChild(sr);

    const alignSpinner = document.createElement("div");
    alignSpinner.setAttribute("class", "d-flex justify-content-center");
    alignSpinner.appendChild(spinner);

    classList.appendChild(alignSpinner);
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
        if (
          !document
            .getElementById("spinnerClassInfo")
            .classList.contains("d-none")
        ) {
          document.getElementById("spinnerClassInfo").classList.add("d-none");
        }

        const element = data["classroom_list"];

        if (data["edit_access"]) {
          const header = document.createElement("h6");
          header.classList.add("collapse-header");
          header.innerText = "Admin Access:";
          classList.appendChild(header);

          const a = document.createElement("a");
          a.classList.add("collapse-item");
          a.href = "/addClass.html";
          a.innerText = "Add New";

          classList.appendChild(a);
        }

        for (let i = 0; i < element.length; i++) {
          const elem = element[i]["classroom_name"];

          const header = document.createElement("h6");
          header.classList.add("collapse-header");
          header.innerText = elem;
          classList.appendChild(header);

          const classInfo = document.createElement("a");
          classInfo.classList.add("collapse-item");
          classInfo.href = "classroom.html?class=" + elem;
          classInfo.innerText = "Class Information";

          const studentRank = document.createElement("a");
          studentRank.classList.add("collapse-item");
          studentRank.href = "ranklist.html?class=" + elem;
          studentRank.innerText = "Student Ranklist";

          classList.appendChild(classInfo);
          classList.appendChild(studentRank);
        }
      });
  }
}
