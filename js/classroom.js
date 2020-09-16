const url3 = "http://127.0.0.1:5000/";
const linkClass = url3 + "classroom";
const classList = document.getElementById("classList");

function addList() {
  if (!classList.childNodes.length) {
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

        const header = document.createElement("h6");
        header.classList.add("collapse-header");
        header.innerText = "Existing Classes:";
        classList.appendChild(header);

        for (let i = 0; i < element.length; i++) {
          const elem = element[i]["classroom_name"];

          const a = document.createElement("a");
          a.classList.add("collapse-item");
          a.href = "classroom.html?class=" + elem;
          a.innerText = elem.toUpperCase();

          classList.appendChild(a);
        }
      });
  }
}
