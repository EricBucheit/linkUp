
const table = {
	name: "links",
}

module.exports = (sequelize, type) => {
  const Links = sequelize.define(table.name, {
  	name: type.STRING,
  	url: type.STRING,
  	order_number: {
  		type: type.INTEGER,
  		defaultValue: 0,
  	},
  });
  return Links;
};


