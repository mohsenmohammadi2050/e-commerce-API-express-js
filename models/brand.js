module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define("Brand", {
        brandName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    });
    Brand.associate = function(models) {
        Brand.hasMany(models.Product);
    };

    return Brand;
}