var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jsend = require("jsend");
const {
    searchByProductName,
    searchByCategoryName,
    searchByBrandName,
    reset,
} = require("../routerFuntions/search/searchFunctions");

router.use(jsend.middleware);

router.post("/", jsonParser, async function (req, res) {
    // #swagger.tags = ['Search']
    /* #swagger.description = "A route to search products either by their name or category or brand. An empty query params will return all products."*/
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['productName'] = {
        "in": "query",
        "description": "Name of product",
        "type": "string"
    }*/
    /* #swagger.parameters['categoryName'] = {
        "in": "query",
        "description": "Name of category",
        "type": "string"
    }*/
    /* #swagger.parameters['brandName'] = {
        "in": "query",
        "description": "Name of brand",
        "type": "string"
    }*/

    if (!Object.keys(req.query).length){
        return res.status(400).jsend({message: "parameters are required!", statusCode: 400})
    }
    let [key, value] = Object.entries(req.query)[0];
    
    const productName = key == "productName" ? value : undefined;
    const categoryName = key == "categoryName" ? value : undefined;
    const brandName = key == "brandName" ? value : undefined;
    if (productName) {
        const response = await searchByProductName(productName);

        if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        }
        return res.status(200).jsend.success({
            result: response.result,
            statusCode: 200,
            numberOfFound: response.number,
        });
    } else if (categoryName) {
        const response = await searchByCategoryName(categoryName);
        if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        }
        return res.status(200).jsend.success({
            result: response.result,
            statusCode: 200,
            numberOfFound: response.number,
        });
    } else if (brandName) {
        const response = await searchByBrandName(brandName);
        if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        }
        return res.status(200).jsend.success({
            result: response.result,
            statusCode: 200,
            numberOfFound: response.number,
        });
    } else {
        const response = await reset();
        if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        }
        return res.status(200).jsend.success({
            result: response.result,
            statusCode: 200,
            numberOfFound: response.number,
        });
    }
});

module.exports = router;
