// these variable will be used for updating a product. (see updateProduct function)
let targetProductId;

$(document).ready(function () {
    let numberOfFound = $("#numberOfFound").text()
    if (numberOfFound){
        $('#toast-number').toast('show');  
    }
});

async function showModal() {
    $("#productModal").modal("show");
}


async function showUpdateModal(element) {
        let i = 0;
        let textOfFields = [];
        const divId = $(element).parent().parent().attr("id");

        // set id for selected product
        targetProductId = divId;

        var updateFormChildren = $("#updateForm").find(
            "div :not(label, option)"
        );
        $(`#${divId}`)
            .children("span")
            .each(function () {
                textOfFields.push($(this).text().trim());
            });
        const cleanList = textOfFields.filter((f) => f !== "");
        const newArray = cleanList.slice(1, 8);

        updateFormChildren.each(function () {
            if ($(this).prop("tagName") === "INPUT") {
                $(this).val(newArray[i]);
            } else if ($(this).prop("tagName") === "SELECT") {
                if (newArray[i] === "Not found"){
                    $(this).find('option[value="Not found"]').remove();
                    var option = $('<option></option>');
                    option.val("Not found");
                    option.text("Not found");
                    $(this).append(option)
                    option.prop("selected", true);
                }else {
                    var optionByValue = $(`#${$(this).attr("id")} option[value=${newArray[i]}]`);
                    $(optionByValue).prop("selected", true);
                }
            }
            i++;
        });
        $("#updateProductModal").modal("show");
}


function addProduct() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text("Toekn is required!. Please log in again to refresh token!");
        $("#errorModal").modal("show");
        return;
    }

    let product = {};
    product.name = $("#name").val();
    product.imgUrl = $("#imgUrl").val();
    product.description = $("#description").val();
    let temp_price = parseFloat($("#price").val());

    if (isNaN(temp_price)) {
        $("#modalTitleId").text("Invalid input");
        $("#messageBody").text("Price must be a number!");
        $("#errorModal").modal("show");
        return;
    } else {
        product.price = temp_price;
    }
    let temp_quantity = parseInt($("#quantity").val());

    if (isNaN(temp_quantity)) {
        $("#modalTitleId").text("Invalid input");
        $("#messageBody").text("Quanity must be integer!");
        $("#errorModal").modal("show");
        return;
    } else {
        product.countInStock = temp_quantity;
    }
    product.brandName = $("#brand").val();
    product.categoryName = $("#category").val();

    fetch("http://localhost:3000/products/create", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#productModal").modal("hide");
                $("#errorModal").modal("show");
                setTimeout(function() {
                    location.reload();
                  }, 3000);
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



function restoreProduct() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text("Toekn is required!. Please log in again to refresh token!");
        $("#errorModal").modal("show");
        return;
    }
    
    fetch(`http://localhost:3000/products/restore/${targetProductId}`, {
        method: "PUT",
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
                $("#updateProductModal").modal("hide");
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



function updateProduct() {
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text("Toekn is required!. Please log in again to refresh token!");
        $("#errorModal").modal("show");
        return;
    }

    let updatedProduct = {};
    updatedProduct.newName = $("#u-name").val();
    updatedProduct.newImgUrl = $("#u-imgUrl").val();
    updatedProduct.newDescription = $("#u-description").val();
    let temp_price = parseFloat($("#u-price").val());

    if (isNaN(temp_price)) {
        $("#modalTitleId").text("Invalid input");
        $("#messageBody").text("Price must be a number!");
        $("#errorModal").modal("show");
        return;
    } else {
        updatedProduct.newPrice = temp_price;
    }
    let temp_quantity = parseInt($("#u-quantity").val());

    if (isNaN(temp_quantity)) {
        $("#modalTitleId").text("Invalid input");
        $("#messageBody").text("Quanity must be integer!");
        $("#errorModal").modal("show");
        return;
    } else {
        updatedProduct.newCountInStock = temp_quantity;
    }
    updatedProduct.newBrandName = $("#u-brand").val();
    updatedProduct.newCategoryName = $("#u-category").val();

    fetch(`http://localhost:3000/products/update/${targetProductId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data?.status === "success") {
                $("#modalTitleId").text("Success");
                $("#messageBody").text(data.data.result);
                $("#updateProductModal").modal("hide");
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




function deleteProduct(element) {
    
    let token = localStorage.getItem("adminToken");
    if (!token) {
        $("#modalTitleId").text("Not Token");
        $("#messageBody").text("Toekn is required!. Please log in again to refresh token!");
        $("#errorModal").modal("show");
        return;
    }

    const productId = $(element).parent().parent().attr("id");

    fetch(`http://localhost:3000/products/delete/${productId}`, {
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



function searchByName() {
    let queryParams = $("#searchName").val();
    let url = `/admin/products?productName=${queryParams}`;
    let a_tag = document.querySelector("#a-searchName");
    a_tag.href = url;
}

function searchByCategory() {
    let queryParams = $("#categorySearch").val();
    if (queryParams.includes("Choose...")) {
        return;
    }

    let url = `/admin/products?categoryName=${queryParams}`;
    let a_tag = document.querySelector("#a-categorySearch");
    a_tag.href = url;
    
}

function searchByBrand() {
    let queryParams = $("#brandSearch").val();
    if (queryParams.includes("Choose...")) {
        return;
    }
    let url = `/admin/products?brandName=${queryParams}`;
    let a_tag = document.querySelector("#a-brandSearch");
    a_tag.href = url;
}


