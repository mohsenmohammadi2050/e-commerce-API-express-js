let targetCategoryId;

function showUpdateCategoryModal(element) {
    const divId = $(element).parent().parent().attr("id");
    targetCategoryId = divId;
    $("#updateCategoryModal").modal("show");
}

function updateCategory() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const newName = $("#updateCategoryNameInput").val();
    if (!newName) {
        $("#modalTitleId").text("Invalid data");
        $("#messageBody").text("New category name must be provided!");
        $("#errorModal").modal("show");
        return;
    }

    fetch(`http://localhost:3000/categories/update/${targetCategoryId}`, {
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
                $("#updateCategoryModal").modal("hide");
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

function showAddCategoryModal() {
    $("#createCategoryModal").modal("show");
}

function addCategory() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const categoryName = $("#createCategoryNameInput").val();
    if (!categoryName) {
        $("#modalTitleId").text("Invalid data");
        $("#messageBody").text("Category name must be provided!");
        $("#errorModal").modal("show");
        return;
    }

    fetch(`http://localhost:3000/categories/create`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: categoryName }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#createCategoryModal").modal("hide");
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

function deleteCategory(element) {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const categoryId = $(element).parent().parent().attr("id");

    fetch(`http://localhost:3000/categories/delete/${categoryId}`, {
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
