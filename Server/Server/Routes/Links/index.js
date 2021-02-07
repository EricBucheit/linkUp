const {Links} = require('../../Controllers')

module.exports = (app, db) => {

	const routePrefix = '/links'

	app.get(`${routePrefix}/test`, (req, res) => {
		Links.test();
	})

	app.get(`${routePrefix}/:id`, (req, res) => {
		Links.getOne(req, res, db);
	})

	app.get(`${routePrefix}`, (req, res) => {
		Links.getAll(req, res, db);
	})

	app.post(`${routePrefix}`, (req, res) => {
		Links.post(req, res, db);
	})

	app.put(`${routePrefix}/:id`, (req, res) => {
		Links.put(req, res, db);
	})

	app.delete(`${routePrefix}/:id`, (req, res) => {
		Links.delete(req, res, db);
	})

	

}
