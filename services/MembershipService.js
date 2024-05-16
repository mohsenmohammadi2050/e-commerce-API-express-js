class MembershipService {
    constructor(db) {
      this.client = db.sequelize;
      this.Membership = db.Membership;
    }
  
    async getOneByName(name) {
      return await this.Membership.findOne({
        where: { membershipName: name },
      }).catch(function (error){
        return error
      });
    }

  
    async getOneById(membershipId) {
      return await this.Membership.findOne({
        where: { id: membershipId },
      }).catch(function (error){
        return error
      });
    }

    async getOneNotDeletedById(membershipId) {
      return await this.Membership.findOne({
        where: {
          id: membershipId,
          isDeleted: false
        },
      }).catch(function (error){
        return error
      });
    }


    async getAll(){
      return await this.Membership.findAll({
        where: {}
      }).catch((error) => {
        return error
      })
    }
  
    
    async createMembership(membershipName, discount) {
      return await this.Membership.create({
        membershipName,
        discount
      }).catch(function (error){
        return error
      })
    };


    async updateMembership(newName, newDiscount, membershipId){
      return await this.Membership.update({
        membershipName: newName,
        discount: newDiscount
      }, {
        where: {
          id: membershipId
        }
      }).catch(error => error)
    }
  
  }
  module.exports = MembershipService;