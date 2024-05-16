let targetUserId;

function showUpdateRoleModal(element) {
    const divId = $(element).parent().parent().attr("id");
    targetUserId = divId;
    const roleUser = $(`#role-user${divId}`).text().trim();
    $('#roleNameSelect').children("option").each(function () {
        if ($(this).val() == roleUser) {
            $(this).prop("selected", true) ;
        }
    });
    $("#selectRoleModal").modal("show");
}

function updateUser() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const roleName = $("#roleNameSelect").val();
    if (!roleName) {
        $("#modalTitleId").text("Invalid data");
        $("#messageBody").text("Role must be provided!");
        $("#errorModal").modal("show");
        return;
    }
    
    fetch(`http://localhost:3000/users/admin/updateRole/${targetUserId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleName: roleName }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#inputRoleModal").modal("hide");
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

function showUpdateAdminModal(element) {
    const divId = $(element).parent().parent().attr("id");
    let i = 0;
    let textOfFields = [];

    var updateFormChildren = $("#updateForm").find("div :not(label, option)");
    $(`#${divId}`)
        .children("span")
        .each(function () {
            textOfFields.push($(this).text().trim());
        });
    const cleanList = textOfFields.filter((f) => f !== "");
    const newArray = cleanList.slice(1, 7);

    updateFormChildren.each(function () {
        if (
            $(this).attr("id") !== "u-email" &&
            $(this).attr("id") !== "u-username"
        ) {
            $(this).val(newArray[i]);
        }
        i++;
    });

    $("#updateAdminModal").modal("show");
}


function updateAdmin() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    // newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress
    let updatedAdmin = {};
    updatedAdmin.newFirstName = $("#u-firstName").val();
    updatedAdmin.newLastName = $("#u-lastName").val();
    updatedAdmin.newEmail = $("#u-email").val();
    updatedAdmin.newUserName = $("#u-username").val();
    updatedAdmin.newPhoneNumber = $("#u-phoneNumber").val();
    updatedAdmin.newAddress = $("#u-address").val();

    fetch(`http://localhost:3000/users/admin/updateAdmin`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAdmin),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#updateAdminModal").modal("hide");
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
