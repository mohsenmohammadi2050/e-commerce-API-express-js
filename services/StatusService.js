class StatusService {
    constructor(db) {
      this.client = db.sequelize;
      this.Status = db.Status;
    }
  
    async getOneByName(name) {
      return await this.Status.findOne({
        where: { statusName: name },
      }).catch(function (error){
        return error
      });
    }
  
  
    async getOneById(statusId) {
      return await this.Status.findOne({
        where: { id: statusId },
      }).catch(function (error){
        return error
      });
    }

    async getOneNotDeletedById(statusId) {
      return await this.Status.findOne({
        where: { id: statusId, isDeleted: false },
      }).catch(function (error){
        return error
      });
    }

    async getOneNotDeletedByName(statusName) {
      return await this.Status.findOne({
        where: {
          statusName: statusName,
          isDeleted: false
        },
      }).catch(function (error){
        return error
      });
    }
  
  
    async getAll(){
      return await this.Status.findAll({
        where: {}
      }).catch((error) => {
        return error
      })
    }
  
    
    async createStatus(statusName) {
      return await this.Status.create({
        statusName
      }).catch(function (error){
        return error
      })
    };
  
  
    async updateStatus(newName, statusId){
      return await this.Status.update({
        statusName: newName
      }, {
        where: {
          id: statusId
        }
      }).catch(error => error)
    }
  
  }
  module.exports = StatusService;