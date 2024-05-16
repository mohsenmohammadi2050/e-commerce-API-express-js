var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {
    getProducts,
    createBrands,
    createCategories,
    createProducts,
    createRoles,
    createMemberships,
    createUserAdmin,
    createStatuses
} = require("../routerFuntions/intitial/initFunctions");
router.use(jsend.middleware);

router.post("/", jsonParser, async function (req, res) {
    // #swagger.tags = ['Init']
    // #swagger.description = "Adds some dummy data into tables: brands, categories, products, roles, memeberships, statuses(status of orders) and users(only one admin user is added)",
    // #swagger.produces = ['application/json']
    const responseFromGetProducts = await getProducts();
    if (responseFromGetProducts.statusCode !== 200) {
        return res.status(responseFromGetProducts.statusCode).jsend.error({
            message: responseFromGetProducts.message,
            statusCode: responseFromGetProducts.statusCode,
        });
    }

    let { brandsArray, categoriesArray, products } =
        responseFromGetProducts.response;

    const responseFromBrand = await createBrands(brandsArray);
    if (responseFromBrand.statusCode !== 200) {
        return res.status(responseFromBrand.statusCode).jsend.error({
            message: responseFromBrand.message,
            statusCode: responseFromBrand.statusCode,
        });
    }

    const responseFromCategory = await createCategories(categoriesArray);
    if (responseFromCategory.statusCode !== 200) {
        return res.status(responseFromCategory.statusCode).jsend.error({
            message: responseFromCategory.message,
            statusCode: responseFromCategory.statusCode,
        });
    }

    const responseFromProduct = await createProducts(products);
    if (responseFromProduct.statusCode !== 200) {
        return res.status(responseFromProduct.statusCode).jsend.error({
            message: responseFromProduct.message,
            statusCode: responseFromProduct.statusCode,
        });
    }

    const responseFromRole = await createRoles();
    if (responseFromRole.statusCode !== 200) {
        return res.status(responseFromRole.statusCode).jsend.error({
            message: responseFromRole.message,
            statusCode: responseFromRole.statusCode,
        });
    }

    const responseFromMembership = await createMemberships();
    if (responseFromMembership.statusCode !== 200) {
        return res.status(responseFromMembership.statusCode).jsend.error({
            message: responseFromMembership.message,
            statusCode: responseFromMembership.statusCode,
        });
    }

    
    const responseFromStatus = await createStatuses();
    if (responseFromStatus.statusCode !== 200) {
        return res.status(responseFromStatus.statusCode).jsend.error({
            message: responseFromStatus.message,
            statusCode: responseFromStatus.statusCode,
        });
    }


    const responseFromAdmin = await createUserAdmin();
    if (responseFromAdmin.statusCode === 400) {
        return res.status(400).jsend.fail({
            message: responseFromAdmin.message,
            statusCode: 400,
        });
    }else if (responseFromAdmin.statusCode === 500) {
        return res.status(500).jsend.error({
            message: responseFromAdmin.message,
            statusCode: 500,
        });
    }

    res.status(200).jsend.success({
        result: "Some dummy data are inserted into brands, categories, products, memberships, roles and users tables.",
        statusCode: 200,
    });
});

module.exports = router;
