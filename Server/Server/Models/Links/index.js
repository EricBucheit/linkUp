
const table = {
	name: "links",
}

module.exports = (sequelize, type) => {
  const Links = sequelize.define(table.name, {
  	name: type.STRING,
  	url: type.STRING,
  });
  return Links;
};


