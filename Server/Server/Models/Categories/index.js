
const table = {
	name: "categories",
}

module.exports = (sequelize, type) => {
  const Categories = sequelize.define(table.name, {
  	name: type.STRING,
  	description: type.STRING,
  	order_number: {
  		type: type.INTEGER,
  		defaultValue: 0,
  	},
  });
  return Categories;
};


