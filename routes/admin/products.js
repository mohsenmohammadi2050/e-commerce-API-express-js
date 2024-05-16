var express = require("express");
var router = express.Router();
var axios = require("axios");
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn");

router.get("/", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let products;
    let brands;
    let categories;
    let errorMessage;
    let number;
    const productName = req.query?.productName;
    const brandName = req.query?.brandName;
    const categoryName = req.query?.categoryName;
    try {
        if (productName) {
            const response = await axios.post(`http://localhost:3000/search/?productName=${productName}`)
            if (response.status === "error") {
                errorMessage = "Error from server! try later on";
            }else {
                products = response.data?.data.result;
                number = response.data?.data.numberOfFound;
            }
            
        } else if (brandName) {
            const response = await axios.post(`http://localhost:3000/search/?brandName=${brandName}`)
            if (response.status === "error") {
                errorMessage = "Error from server! try later on";
            }else {
                products = response.data?.data.result;
                number = response.data?.data.numberOfFound;
            }
                
        } else if (categoryName) {
            const response = await axios.post(`http://localhost:3000/search/?categoryName=${categoryName}`)
            if (response.status === "error") {
                errorMessage = "Error from server! try later on";
            }else {
                products = response.data?.data.result;
                number = response.data?.data.numberOfFound;
                
            }
                
        } else {
            const response = await axios.get("http://localhost:3000/products/")
            if (response.status === "error") {
                errorMessage = "Error from server! try later on";
            }else {
                products = response.data?.data.result;
            }
        }
        const response_brands = await axios.get("http://localhost:3000/brands/")
        if (response_brands.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            brands = response_brands.data?.data.result;
        }
        const response_categories = await axios.get("http://localhost:3000/categories/")
        if (response_categories.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            categories = response_categories.data?.data.result;
        }
        
        res.render("products", {products: products, brands: brands, categories: categories, number: number, error: errorMessage, user: user});
        
    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("products", {products: products, brands: brands, categories: categories, number: number, error: errorMessage, user: user});
    }
});

module.exports = router;
