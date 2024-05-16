require("dotenv").config();
const request = require("supertest");
const URL = "http://localhost:3000";

describe("testing api", () => {
    let token;

    // create TEST_CATEGORY
    test("POST /categories/create - success", async () => {
        // Login as admin. Here we assume the user ran init endpoint before starting test. (init endpoint will add an admin user into the database)
        const adminCredentials = {
            email: process.env.ADMIN_EMAIL_INIT,
            password: process.env.ADMIN_PASSWORD_INIT,
        };
        const response = await request(URL)
            .post("/auth/admin/login")
            .send(adminCredentials);

        token = response.body.data.token;
        const categoryData = {
            categoryName: "TEST_CATEGORY",
        };

        const { body } = await request(URL)
            .post("/categories/create")
            .set("Authorization", "Bearer " + token)
            .send(categoryData);

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toEqual("You created a category.");
        expect(body.data).toHaveProperty("statusCode");
        expect(body.data.statusCode).toEqual(200);
    });

    // get all categories included TEST_CATEGORY
    let testCategoryId;
    test("GET /categories - success", async () => {
        const { body } = await request(URL).get("/categories");

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");

        expect(body.data.result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ categoryName: "TEST_CATEGORY" }),
            ])
        );

        // get id of TEST_CATEGORY
        testCategoryId = body.data.result[body.data.result.length - 1].id;
    });

    // get only TEST_CATEGORY
    test("GET /categories/:id - success", async () => {
        const { body } = await request(URL).get(
            `/categories/${testCategoryId}`
        );

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");

        expect(body.data.result).toEqual(
            expect.objectContaining({
                id: testCategoryId,
                categoryName: "TEST_CATEGORY",
            })
        );
    });

    // update TEST_CATEGORY
    test("PUT /categories/update/:id - success", async () => {
        const updateCredentials = { newName: "TEST_CATEGORY_UPDATED" };
        const { body } = await request(URL)
            .put(`/categories/update/${testCategoryId}`)
            .set("Authorization", "Bearer " + token)
            .send(updateCredentials);

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toEqual("category updated successfully!");

        expect(body.data).toHaveProperty("statusCode");
        expect(body.data.statusCode).toEqual(200);
    });

    // delete TEST_CATEGORY
    test("DELETE /categories/delete/:id - success", async () => {
        const { body } = await request(URL)
            .delete(`/categories/delete/${testCategoryId}`)
            .set("Authorization", "Bearer " + token);

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toEqual("category deleted successfully!");

        expect(body.data).toHaveProperty("statusCode");
        expect(body.data.statusCode).toEqual(200);
    });

    // create TEST_PRODUCT
    test("POST /products/create - success", async () => {
        // The 'TEST_CATEGORY' is deleted since 'delete' method was called above.
        // Here we recreate it by sending a new request.
        // In addition, a new brand called 'TEST_BRAND' will be created since we need also a brandName to create a product.
        const categoryData = {
            categoryName: "TEST_CATEGORY",
        };

        await request(URL)
            .post("/categories/create")
            .set("Authorization", "Bearer " + token)
            .send(categoryData);

        const brandData = {
            brandName: "TEST_BRAND",
        };

        await request(URL)
            .post("/brands/create")
            .set("Authorization", "Bearer " + token)
            .send(brandData);

        const productData = {
            name: "TEST_PRODUCT",
            imgUrl: "http://143.42.108.232/products/product-apple-tv.png",
            description: "test_product desctiption",
            price: 1000,
            countInStock: 10,
            brandName: "TEST_BRAND",
            categoryName: "TEST_CATEGORY",
        };

        const { body } = await request(URL)
            .post("/products/create")
            .set("Authorization", "Bearer " + token)
            .send(productData);

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toEqual("You created a product.");

        expect(body.data).toHaveProperty("statusCode");
        expect(body.data.statusCode).toEqual(200);
    });

    // get all prpducts included TEST_PRODUCT
    let testProductId;
    test("GET /products - success", async () => {
        const { body } = await request(URL).get("/products");

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");

        expect(body.data.result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: "TEST_PRODUCT",
                    brandName: "TEST_BRAND",
                    categoryName: "TEST_CATEGORY",
                    description: "test_product desctiption",
                    imgUrl: "http://143.42.108.232/products/product-apple-tv.png",
                    price: 1000,
                    countInStock: 10,
                    isDeleted: false,
                }),
            ])
        );

        // get id of TEST_PRODUCT
        testProductId = body.data.result[body.data.result.length - 1].id;
    });

    // get only PRODUCT
    test("GET /products/:id - success", async () => {
        const { body } = await request(URL).get(`/products/${testProductId}`);

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");

        expect(body.data.result).toEqual(
            expect.objectContaining({
                name: "TEST_PRODUCT",
                imgUrl: "http://143.42.108.232/products/product-apple-tv.png",
                description: "test_product desctiption",
                price: 1000,
                countInStock: 10,
                isDeleted: false,
                brandName: "TEST_BRAND",
                categoryName: "TEST_CATEGORY",
            })
        );
    });



    // update TEST_PRODUCT
    test("PUT /products/update/:id - success", async () => {
        // newBrandName 'Samsung' and newCategoryName 'tablets' already exist in database.
        // Againg we assume that the user ran 'init' endpoint before starting test. 
        // This endpoint will create some brand and category names included 'Samsung' and 'tablets'

        const updateProductCredentials =  {
            newName: "TEST_PRODUCT_UPDATED",
            newImgUrl:
                "http://images.restapi.co.za/products/product-apple-tv.png",
            newDescription: "test_product description updated",
            newPrice: 2000,
            newCountInStock: 20,
            newBrandName: "Samsung",
            newCategoryName: "tablets",
        }

        const { body } = await request(URL)
            .put(`/products/update/${testProductId}`)
            .set("Authorization", "Bearer " + token)
            .send(updateProductCredentials);

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toEqual("Product updated successfully");

        expect(body.data).toHaveProperty("statusCode");
        expect(body.data.statusCode).toEqual(200);
    });


     // delete TEST_PRODUCT
     test("DELETE /products/delete/:id - success", async () => {
        const { body } = await request(URL)
            .delete(`/products/delete/${testProductId}`)
            .set("Authorization", "Bearer " + token);

        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toEqual("Product deleted successfully");

        expect(body.data).toHaveProperty("statusCode");
        expect(body.data.statusCode).toEqual(200);
    });

    
    // invalid user

    test("POST /auth/login - fail", async () => {
        // create a dummy user
        const userSignupCredentials = {
            firstName: "john",
            lastName: "doe",
            username: "john doe",
            email: "john@gmail.com",
            password: "1234",
            address: "stavanger 1111",
            phoneNumber: "344556"
        }

        await request(URL).post("/auth/register").send(userSignupCredentials)
        


        // with wrong email
        const userLoginCredentials_1 = { email: "john-doe@gmail.com", password: "1234" };
        const response_1 = await request(URL)
            .post("/auth/login")
            .send(userLoginCredentials_1);
       
        expect(response_1.body).toHaveProperty("status");
        expect(response_1.body.status).toEqual("fail");

        expect(response_1.body).toHaveProperty("data");
        expect(response_1.body.data).toHaveProperty("message");
        expect(response_1.body.data.message).toBe("Incorrect email or password");

        expect(response_1.body.data).toHaveProperty("statusCode");
        expect(response_1.body.data.statusCode).toEqual(400);


        // with wrong password
        const userLoginCredentials_2 = { email: "john@gmail.com", password: "0000" };
        const response_2 = await request(URL)
            .post("/auth/login")
            .send(userLoginCredentials_2);
       
        expect(response_2.body).toHaveProperty("status");
        expect(response_2.body.status).toEqual("fail");

        expect(response_2.body).toHaveProperty("data");
        expect(response_2.body.data).toHaveProperty("message");
        expect(response_2.body.data.message).toBe("Incorrect email or password");

        expect(response_2.body.data).toHaveProperty("statusCode");
        expect(response_2.body.data.statusCode).toEqual(400);
    });



    // valid user
    test("POST /auth/login - success", async () => {
    
        const userLoginCredentials = { email: "john@gmail.com", password: "1234" };
        const { body } = await request(URL)
            .post("/auth/login")
            .send(userLoginCredentials);
       
        expect(body).toHaveProperty("status");
        expect(body.status).toEqual("success");

        expect(body).toHaveProperty("data");

        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("You are logged in");

        // check if it has field id
        expect(body.data).toHaveProperty("id");

        // check if it has field token
        expect(body.data).toHaveProperty("token");

        // check if it has statusCode 200
        expect(body.data).toHaveProperty("statusCode");
        expect(body.data.statusCode).toEqual(200);

        // check if it has username
        expect(body.data).toHaveProperty("username");
        expect(body.data.username).toEqual("john doe");

    });

    
});
