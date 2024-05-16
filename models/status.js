module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("Status", {
        statusName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    })

    Status.associate = function(models) {
        Status.hasMany(models.Order);
    };

    return Status;
}