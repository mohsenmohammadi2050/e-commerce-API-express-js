class UserService {
  constructor(db) {
    this.client = db.sequelize;
    this.User = db.User;
    this.Membership = db.Membership;
    this.Role = db.Role
  }


  async getAll() {
    return await this.User.findAll({
      where: {}, 
      include: [
        {
          model: this.Membership
        }, 
        {
          model: this.Role
        }
      ]
    }).catch(function (error){
      return error
    });
  }


  async getAllDeleted() {
    return await this.User.findAll({
      where: {
        isDeleted: true
      }, 
      include: [
        {
          model: this.Membership
        }, 
        {
          model: this.Role
        }
      ]
    }).catch(function (error){
      return error
    });
  }

  async getOneByEmail(email) {
    return await this.User.findOne({
      where: { email: email }, 
      include: [
        {
          model: this.Membership
        }, 
        {
          model: this.Role
        }
      ]
    }).catch(function (error){
      return error
    });
  }

  async getOneByUsername(username) {
    return await this.User.findOne({
      where: { username: username }, 
      include: [
        {
          model: this.Membership
        }, 
        {
          model: this.Role
        }
      ]
    }).catch(function (error){
      return error
    });
  }


  async getOneByEmailUsername(email, username) {
    return await this.User.findOne({
      where: { email: email, username: username, isDeleted: true }, 
      include: [
        {
          model: this.Membership
        }, 
        {
          model: this.Role
        }
      ]
    }).catch(function (error){
      return error
    });
  }


  async getOneById(userId) {
    return await this.User.findOne({
      where: {
        id: userId
      }, 
      include: [
        {
          model: this.Membership
        }, 
        {
          model: this.Role
        }
      ]
    }).catch(function (error){
      return error
    });
  }


  async getOneByRoleId(roleId) {
    return await this.User.findOne({
      where: {
        RoleId: roleId
      }
    }).catch(function (error){
      return error
    });
  }

  async getOneByMembershipId(membershipId) {
    return await this.User.findOne({
      where: {
        MembershipId: membershipId
      }
    }).catch(function (error){
      return error
    });
  }

  async createUser(firstName, lastName, username, email, hashedPassword, salt, address, phoneNumber, membershipId, roleId) {
    return this.User.create({
      firstName,
      lastName,
      username,
      email,
      encryptedPassword: hashedPassword,
      salt,
      address,
      phoneNumber,
      MembershipId: membershipId,
      RoleId: roleId
    }).catch(function (error){
      return error
    })
};


  async updateMembershipUser(userId, membershipId) {
    return this.User.update({MembershipId: membershipId}, {
      where: {
        id: userId
      }
    }).catch(function (error){
      return error
    })
  }


  async updateUserCredentails(userId, newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress, newPassword, newSalt) {
    const arrayOfFeilds = [newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress, newPassword, newSalt];
    const keys = ["firstName", "lastName", "email", "username", "phoneNumber", "address", "encryptedPassword", "salt"]
        let objectOfFields = {};
        arrayOfFeilds.forEach((element,index) => {
            if (element){
                objectOfFields[keys[index]] = element
            }
        });

        return this.User.update(objectOfFields, {
          where: {
            id: userId,
          }
      }).catch(error => {
          return error
      })
  }


}
module.exports = UserService;