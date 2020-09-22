function updateDB() {
  const linkUpdate = url + "ojupdate";
  fetch(linkUpdate, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      bootbox.alert(data["message"]);
    });
}
