const {Users} = require('../../Controllers')

module.exports = (app, db) => {

	const routePrefix = '/users'

	app.post(`${routePrefix}/register`, (req, res) => {
		Users.register(req, res, db);
	})

	app.post(`${routePrefix}/login`, (req, res) => {
		Users.login(req, res, db);
	})

	app.post(`${routePrefix}/logout`, (req, res) => {
		Users.logout(req, res, db);
	})

	app.get(`${routePrefix}/user`, (req, res) => {
		Users.getUser(req, res, db);
	})
	

}
