const {Links} = require('../../Controllers')

module.exports = (app, db) => {

	const routePrefix = '/links'

	app.get(`${routePrefix}`, (req, res) => {
		console.log("GETTING Links")
		Links.get(req, res, db).catch(err => console.log(err));
	})

	app.post(`${routePrefix}`, (req, res) => {
		Links.post(req, res, db);
	})

	app.put(`${routePrefix}/:categoryId/:id`, (req, res) => {
		Links.put(req, res, db);
	})

	app.delete(`${routePrefix}/:id`, (req, res) => {
		Links.delete(req, res, db);
	})
	

}
