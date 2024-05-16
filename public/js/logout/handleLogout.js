function handleLogout() {
    fetch("http://localhost:3000/admin/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/auth/login";
        })
        .catch((error) => {
            $("#modalTitleId").text("Error");
            $("#messageBody").text("An error occured!!");
            $("#errorModal").modal("show");
        });
}
