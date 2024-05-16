const { QueryTypes } = require('sequelize');

class SearchService{
    constructor(db){
        this.client = db.sequelize;
    }


    async byProductName(productName) {
        try {
          let result = await this.client.query(`SELECT * FROM products WHERE name LIKE '%${productName}%'`,
            { type: QueryTypes.SELECT }
          );
          return result;
        } catch (error) {
          return error;
        }
      }
    
      async byCategoryName(categoryName) {
        try {
          let result = await this.client.query(`SELECT products.* FROM products JOIN categories ON products.CategoryId = categories.id WHERE categories.categoryName = '${categoryName}'
        `
            ,{ type: QueryTypes.SELECT }
          );
          return result;
        } catch (error) {
          return error;
        }
      }
    
      async byBrandName(brandName) {
        try {
          let result = await this.client.query(`SELECT products.* FROM products JOIN brands ON products.BrandId = brands.id WHERE brands.brandName = '${brandName}'
        `
            ,{ type: QueryTypes.SELECT }
          );
          return result;
        } catch (error) {
          return error;
        }
      }


      async reset() {
        try {
          let result = await this.client.query(`SELECT * FROM products`,
            { type: QueryTypes.SELECT }
          );
          return result;
        } catch (error) {
          return error;
        }
      }
}


module.exports = SearchService;