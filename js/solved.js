const linkSolved = url + "user";

const ojList = document.getElementById("ojList");

fetch(linkSolved, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("access_token"),
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const spinnerSolved = document.getElementById("spinnerSolved");
    if (!spinnerSolved.classList.contains("d-none")) {
      spinnerSolved.classList.add("d-none");
    }
    const oj_info = data["oj_info"];
    // console.log(oj_info);
    // <div class="card shadow mb-4">
    //               <a
    //                 href="#collapseCardExample"
    //                 class="d-block card-header py-3"
    //                 data-toggle="collapse"
    //                 role="button"
    //                 aria-expanded="true"
    //                 aria-controls="collapseCardExample"
    //               >
    //                 <h6 class="m-0 font-weight-bold text-primary">
    //                   Collapsable Card Example
    //                 </h6>
    //               </a>
    //               <!-- Card Content - Collapse -->
    //               <div class="collapse" id="collapseCardExample">
    //                 <div class="card-body">
    //                   This is a collapsable card example using Bootstrap's built
    //                   in collapse functionality.
    //                   <strong>Click on the card header</strong> to see the card
    //                   body collapse and expand!
    //                 </div>
    //               </div>
    //             </div>
    if (data["msg"] == "Token has expired") {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login.html";
    }
    let totalSolved = 0;
    for (const oj in oj_info) {
      if (oj_info[oj]["solve_list"]) {
        const solvedList = oj_info[oj]["solve_list"];

        // OJ Title Starts
        const a = document.createElement("a");
        a.setAttribute("class", "d-block card-header py-3");
        a.setAttribute("href", `#${oj}`);
        a.setAttribute("data-toggle", "collapse");
        a.setAttribute("role", "button");
        a.setAttribute("aria-expanded", "true");
        a.setAttribute("aria-controls", oj);

        const ojName = document.createElement("h6");
        ojName.classList.add("m-0", "font-weight-bold", "text-primary");
        ojName.innerText = `${oj} (Total Solved: ${solvedList.length})`;
        totalSolved += solvedList.length;

        a.appendChild(ojName);
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

        const collapsedBody = document.createElement("div");
        collapsedBody.setAttribute("class", "collapse");
        collapsedBody.setAttribute("id", oj);
        collapsedBody.appendChild(body);

        const card = document.createElement("div");
        card.classList.add("card", "shadow", "mb-4");

        card.appendChild(a);
        card.appendChild(collapsedBody);

        ojList.appendChild(card);
      }
    }
    document.getElementById("solvedTotal").innerText = totalSolved;
  });
