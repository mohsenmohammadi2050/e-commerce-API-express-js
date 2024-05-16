class BrandService {
    constructor(db) {
      this.client = db.sequelize;
      this.Brand = db.Brand;
    }
  
    async getOneByName(name) {
      return await this.Brand.findOne({
        where: { brandName: name },
      }).catch(function (error){
        return error
      });
    }
  
  
    async getOneById(brandId) {
      return await this.Brand.findOne({
        where: { id: brandId },
      }).catch(function (error){
        return error
      });
    }
  
  
    async getAll(){
      return await this.Brand.findAll({
        where: {}
      }).catch((error) => {
        return error
      })
    }
  
    
    async createBrand(brandName) {
      return await this.Brand.create({
        brandName
      }).catch(function (error){
        return error
      })
    };
  
  
    async updateBrand(newName, brandId){
      return await this.Brand.update({
        brandName: newName
      }, {
        where: {
          id: brandId
        }
      }).catch(error => error)
    }
  
  
    async deleteBrand(brandId){
      return await this.Brand.destroy({
        where: {
            id: brandId
        }
      }).catch(error => error)
    }
  
  }
  module.exports = BrandService;