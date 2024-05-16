module.exports = (sequelize, Sequelize) => {
    const Item = sequelize.define("Item", {
        quantity: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        unitPrice: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        },
        isPurchased: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: true
    });
    Item.associate = function(models) {
        Item.belongsTo(models.Product)
        Item.belongsTo(models.Order)
    };


    return Item;
}