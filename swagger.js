const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        version: "1.0.0",
        title: "Exam Project",
        description: "Documentation Exam Project",
    },
    host: "localhost:3000",
    definitions: {
        LoginUser: {
            $email: "Mohsen@gmail.com",
            $password: "0000",
        },
        SignupUser: {
            $firstName: "Mohsen",
            $lastName: "Mohammadi",
            $username: "2050",
            $email: "Mohsen@gmail.com",
            $password: "0000",
            $address: "stavanger 4017",
            $phoneNumber: "344556",
        },
        LoginAdmin: {
            $email: "admin@gmail.com",
            $password: "0000",
        },

        CreateRole: {
            $roleName: "User",
        },

        UpdateRole: {
            $newName: "Admin",
        },

        CreateMembership: {
            $membershipName: "Bronze",
            $discount: 0,
        },

        UpdateMembership: {
            $newName: "Silver",
            $newDiscount: 15,
        },

        CreateBrand: {
            $brandName: "IPhone",
        },

        UpdateBrand: {
            $newName: "Samsung",
        },

        CreateCategory: {
            $categoryName: "Tv",
        },

        UpdateCategory: {
            $newName: "Phone",
        },

        CreateProduct: {
            $name: "test-product",
            $imgUrl:
                "http://images.restapi.co.za/products/product-apple-tv.png",
            $description: "a test product",
            $price: 1200,
            $countInStock: 7,
            $brandName: "Apple",
            $categoryName: "phones",
        },

        UpdateProduct: {
            $newName: "new test-product",
            $newImgUrl:
                "http://images.restapi.co.za/products/product-apple-tv.png",
            $newDescription: "a new test product",
            $newPrice: 2200,
            $newCountInStock: 8,
            $newBrandName: "Samsung",
            $newCategoryName: "tablets",
        },

        CreateStatus: {
            $statusName: "In-progress",
        },

        UpdateStatus: {
            $newName: "Completed",
        },

        UpdateQuantityCartItem: {
            $newQuantity: 6,
        },

        AddItemToCart: {
            $quantity: 10,
            $productId: 7,
        },


        UpdateOrder: {
            $statusName: "Completed"
        },

        UpdateUser: {
            $newFirstName: "test1",
            $newLastName: "test",
            $newEmail: "test@gmail.com",
            $newUserName: "test-username",
            $newPhoneNumber: "897664",
            $newAdderss: "Stavanger",
            $newPassword: "4321",
        },

        UpdateAdmin: {
            $newFirstName: "test1",
            $newLastName: "test",
            $newEmail: "test@gmail.com",
            $newUserName: "test-username",
            $newPhoneNumber: "897664",
            $newAdderss: "Stavanger",
            $newPassword: "4321",
        },

        UpdateUserRole: {
            $roleName: "Admin"
        }
    },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require("./bin/www");
});
