class RoleService {
  constructor(db) {
    this.client = db.sequelize;
    this.Role = db.Role;
  }

  async getOneByName(name) {
    return await this.Role.findOne({
      where: { roleName: name },
    }).catch(function (error){
      return error
    });
  }


  async getOneById(roleId) {
    return await this.Role.findOne({
      where: { id: roleId },
    }).catch(function (error){
      return error
    });
  }


  async getOneNotDeletedById(roleId) {
    return await this.Role.findOne({
      where: {
        id: roleId,
        isDeleted: false
      },
    }).catch(function (error){
      return error
    });
  }


  async getOneNotDeletedByName(roleName) {
    return await this.Role.findOne({
      where: {
        roleName: roleName,
        isDeleted: false
      },
    }).catch(function (error){
      return error
    });
  }


  async getAll(){
    return await this.Role.findAll({
      where: {}
    }).catch((error) => {
      return error
    })
  }

  
  async createRole(roleName) {
    return await this.Role.create({
      roleName
    }).catch(function (error){
      return error
    })
  };


  async updateRole(newName, roleId){
    return await this.Role.update({
      roleName: newName
    }, {
      where: {
        id: roleId
      }
    }).catch(error => error)
  }

}
module.exports = RoleService;