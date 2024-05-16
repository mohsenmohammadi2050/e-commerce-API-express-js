let targetBrandId;

function showUpdateModal(element) {
    const divId = $(element).parent().parent().attr("id");
    targetBrandId = divId;
    $("#updateBrandModal").modal("show");
}

function updateBrand() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const newName = $("#updateBrandNameInput").val();
    if (!newName) {
        $("#modalTitleId").text("Invalid data");
        $("#messageBody").text("New brand name must be provided!");
        $("#errorModal").modal("show");
        return;
    }

    fetch(`http://localhost:3000/brands/update/${targetBrandId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: newName }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#updateBrandModal").modal("hide");
                $("#errorModal").modal("show");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                $("#modalTitleId").text("Error");
                $("#messageBody").text(data.data.message);
                $("#errorModal").modal("show");
            }
        })
        .catch((error) => {
            $("#modalTitleId").text("Error");
            $("#messageBody").text(error?.message);
            $("#errorModal").modal("show");
        });
}

function showAddBrandModal() {
    $("#createBrandModal").modal("show");
}

function addBrand() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const brandName = $("#createBrandNameInput").val();
    if (!brandName) {
        $("#modalTitleId").text("Invalid data");
        $("#messageBody").text("Brand name must be provided!");
        $("#errorModal").modal("show");
        return;
    }

    fetch(`http://localhost:3000/brands/create`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ brandName: brandName }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#createBrandModal").modal("hide");
                $("#errorModal").modal("show");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                $("#modalTitleId").text("Error");
                $("#messageBody").text(data.data.message);
                $("#errorModal").modal("show");
            }
        })
        .catch((error) => {
            $("#modalTitleId").text("Error");
            $("#messageBody").text(error?.message);
            $("#errorModal").modal("show");
        });
}


function deleteBrand(element) {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const brandId = $(element).parent().parent().attr("id");

    fetch(`http://localhost:3000/brands/delete/${brandId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#errorModal").modal("show");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                $("#modalTitleId").text("Error");
                $("#messageBody").text(data.data.message);
                $("#errorModal").modal("show");
            }
        })
        .catch((error) => {
            $("#modalTitleId").text("Error");
            $("#messageBody").text(error?.message);
            $("#errorModal").modal("show");
        });
}
