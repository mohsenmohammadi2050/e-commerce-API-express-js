module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        firstName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        },
        encryptedPassword: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false,
        },
        salt: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false,
        },
    },{
        timestamps: false
    });
    User.associate = function(models) {
        User.hasMany(models.Order);
        User.belongsTo(models.Role)
        User.belongsTo(models.Membership)
    };
	return User
}