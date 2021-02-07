
const table = {
	name: "categories",
}

module.exports = (sequelize, type) => {
  const Categories = sequelize.define(table.name, {
  	name: type.STRING,
  });
  return Categories;
};


