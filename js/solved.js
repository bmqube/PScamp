const url2 = "http://127.0.0.1:5000/";
const link2 = url2 + "userinfo";

const ojList = document.getElementById("ojList");

fetch(link2, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    const oj_info = data["oj_info"];
    console.log(oj_info);
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("refresh_token");
      window.location.href = "/login.html";
    }
    for (const oj in oj_info) {
      if (oj_info.hasOwnProperty(oj) && oj != "VJudge") {
        const solvedList = oj_info[oj]["solve_list"];

        // OJ Title Starts
        const ojName = document.createElement("h6");
        ojName.classList.add(
          "m-0",
          "font-weight-bold",
          "text-primary",
          "text-center"
        );
        ojName.innerText = oj + " (Total Solved: " + solvedList.length + ")";

        const title = document.createElement("div");
        title.classList.add("card-header", "py-3");
        title.appendChild(ojName);
        // OJ Title Ends

        //OJ Body Starts
        const body = document.createElement("div");
        body.classList.add("card-body", "d-flex", "flex-wrap");

        for (let i = 0; i < solvedList.length; i++) {
          const problemName = solvedList[i];

          const data = document.createElement("p");
          data.classList.add("m-2", "inline");
          data.innerText = problemName;
          body.appendChild(data);
        }

        const card = document.createElement("div");
        card.classList.add("card", "shadow", "mb-4");

        card.appendChild(title);
        card.appendChild(body);

        ojList.appendChild(card);
      }
    }
  });
