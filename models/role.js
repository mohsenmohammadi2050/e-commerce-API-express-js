module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("Role", {
        roleName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Role.associate = function(models) {
        Role.hasMany(models.User);
    };

    return Role;
}