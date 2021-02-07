
const table = {
	name: "generic",
}

module.exports = (sequelize, type) => {
  const GenericTableName = sequelize.define(table.name, {
  	//example
  	//title: type.STRING,
  });
  return GenericTableName;
};


