module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("Order", {
        orderNumber: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [8, 8]
            }
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamp: true
    });

    Order.associate = function(models) {
        Order.hasMany(models.Item);
        Order.belongsTo(models.Status)
        Order.belongsTo(models.User)
    };

    return Order;
}