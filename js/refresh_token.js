// const link = url + "refresh";

const userNav = document.getElementById("userNav");
userNav.innerText = window.localStorage.getItem("username");

const adminNav = document.getElementById("adminNav");
if (
  window.localStorage.getItem("is_admin") == "yes" &&
  adminNav.classList.contains("d-none")
) {
  adminNav.classList.remove("d-none");
}

$(document).ready(function () {
  $("#sidebar").mCustomScrollbar({
    theme: "minimal",
  });

  $("#sidebarCollapse").on("click", function () {
    if ($("#sidebar").hasClass("active")) {
      $("#sidebar").removeClass("active");
      $(".overlay").removeClass("active");
      $("#sidebarCollapse").removeClass("active");
      $(".container-fluid").removeClass("active");
      $("#content").removeClass("active");
      sidebarCollapse;
    } else {
      $("#sidebar").addClass("active");
      $(".overlay").addClass("active");
      $("#sidebarCollapse").addClass("active");
      $(".container-fluid").addClass("active");
      $("#content").addClass("active");
      $(".collapse.in").toggleClass("in");
      $("a[aria-expanded=true]").attr("aria-expanded", "false");
    }
  });
});

// fetch(link, {
//   method: "POST",
//   headers: {
//     Authorization: "Bearer " + window.localStorage.getItem("refresh_token"),
//   },
// })
//   .then((res) => res.json())
//   .then((data) => {
//     const new_token = data["access_token"];
//     window.localStorage.removeItem("access_token");
//     window.localStorage.setItem("access_token", new_token);
//   });
