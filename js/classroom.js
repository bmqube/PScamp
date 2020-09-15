const url3 = "http://127.0.0.1:5000/";
const linkClass = url3 + "classroom";
const classList = document.getElementById("classList");

function addList() {
  if (!classList.childNodes.length) {
    fetch(linkClass, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const element = data["classroom_list"];
        for (let i = 0; i < element.length; i++) {
          const elem = element[i]["classroom_name"];

          const a = document.createElement("a");
          a.classList.add("collapse-item");
          a.href = "classroom.html?class=" + elem;
          a.innerText = elem;

          console.log(classList);

          classList.appendChild(a);
        }
      });
  }
}
