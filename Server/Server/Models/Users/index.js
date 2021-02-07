
const table = {
	name: "users",
}

module.exports = (sequelize, type) => {
  const Users = sequelize.define(table.name, {
  	email: type.STRING,
  	password: type.STRING,
  });
  return Users;
};


