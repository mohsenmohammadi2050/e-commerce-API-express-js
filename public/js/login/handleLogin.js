function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/auth/admin/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.data.statusCode === 200) {
                localStorage.setItem("adminToken", data?.data.token);
                sendToeknToServer(data?.data.token);
            } else {
                $("#modalTitleId").text("Error");
                $("#messageBody").text(data?.data.message);
                $("#errorModal").modal("show");
            }
        })
        .catch((error) => {
            $("#modalTitleId").text("Error");
            $("#messageBody").text(data?.data.message);
            $("#errorModal").modal("show");
        });
}

function sendToeknToServer(token) {
    fetch("http://localhost:3000/admin/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminToken: token }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.statusCode === 200) {
                window.location.href = "/admin/products";
            } else {
              $("#modalTitleId").text("Error");
              $("#messageBody").text("An error occured!!");
              $("#errorModal").modal("show");
            }
        })
        .catch((error) => {
          $("#modalTitleId").text("Error");
          $("#messageBody").text("An error occured!!");
          $("#errorModal").modal("show");
        });
}
