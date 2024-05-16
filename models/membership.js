module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define("Membership", {
        membershipName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        discount: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false 
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
        
    });
    
    Membership.associate = function(models) {
        Membership.hasMany(models.User);
    };

    return Membership;
}