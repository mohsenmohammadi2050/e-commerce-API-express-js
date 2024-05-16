let targetOrderId;

function showItems(btn) {
    var btnId = $(btn).attr("id");
    var itemDivId = "items-" + btnId.split("-")[1];

    if ($("#" + itemDivId).hasClass("d-block")) {
        $("#" + itemDivId)
            .removeClass("d-block")
            .addClass("d-none");
    } else if ($("#" + itemDivId).hasClass("d-none")) {
        $("#" + itemDivId)
            .removeClass("d-none")
            .addClass("d-block");
    }
}

function showUpdateOrderModal(element) {
    const divId = $(element).parent().parent().attr("id");
    targetOrderId = divId;
    const statusOrder = $(`#status-order${divId}`).text().trim();
    $('#statusNameSelect').children("option").each(function () {
        if ($(this).val() == statusOrder) {
            $(this).prop("selected", true) ;
        }
    });
    $("#selectStatusModal").modal("show");
}

function updateOrder() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text(
            "Toekn is required!. Please log in again to refresh token!"
        );
        $("#errorModal").modal("show");
        return;
    }

    const statusName = $("#statusNameSelect").val();
    if (!statusName) {
        $("#modalTitleId").text("Invalid data");
        $("#messageBody").text("Status must be provided!");
        $("#errorModal").modal("show");
        return;
    }

    fetch(`http://localhost:3000/orders/admin/update/${targetOrderId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusName: statusName }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#inputStatusModal").modal("hide");
                $("#errorModal").modal("show");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                console.log(data);
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



function deleteOrder(element) {
    
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text("Toekn is required!. Please log in again to refresh token!");
        $("#errorModal").modal("show");
        return;
    }

    const orderId = $(element).parent().parent().attr("id");

    fetch(`http://localhost:3000/orders/admin/delete/${orderId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#errorModal").modal("show");
                setTimeout(function() {
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
