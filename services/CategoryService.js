class CategoryService {
    constructor(db) {
      this.client = db.sequelize;
      this.Category = db.Category;
    }
  
    async getOneByName(name) {
      return await this.Category.findOne({
        where: { categoryName: name },
      }).catch(function (error){
        return error
      });
    }
  
  
    async getOneById(categoryId) {
      return await this.Category.findOne({
        where: { id: categoryId },
      }).catch(function (error){
        return error
      });
    }
  
  
    async getAll(){
      return await this.Category.findAll({
        where: {}
      }).catch((error) => {
        return error
      })
    }
  
    
    async createCategory(categoryName) {
      return await this.Category.create({
        categoryName
      }).catch(function (error){
        return error
      })
    };
  
  
    async updateCategory(newName, categoryId){
      return await this.Category.update({
        categoryName: newName
      }, {
        where: {
          id: categoryId
        }
      }).catch(error => error)
    }
  
  
    async deleteCategory(categoryId){
      return await this.Category.destroy({
        where: {
            id: categoryId
        }
      }).catch(error => error)
    }
  
  }
  module.exports = CategoryService;