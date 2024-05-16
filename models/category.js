module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("Category", {
        categoryName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    });

    Category.associate = function(models) {
        Category.hasMany(models.Product);
    };

    return Category;
}