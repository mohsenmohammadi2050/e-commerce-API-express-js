module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Product", {
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        imgUrl: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true,
            }
        },
        description: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false
        },
        countInStock: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: true
    });
    Product.associate = function(models) {
        Product.hasMany(models.Item);
        Product.belongsTo(models.Brand)
        Product.belongsTo(models.Category)
    };

    return Product;
}