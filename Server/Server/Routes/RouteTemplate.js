const {GenericController} = require('../Controllers')

module.exports = (app, db) => {

	const routePrefix = '/generics'

	app.get(`${routePrefix}/test`, (req, res) => {
		GenericController.test();
	})

	app.get(`${routePrefix}/:id`, (req, res) => {
		GenericController.getOne(req, res, db);
	})

	app.get(`${routePrefix}`, (req, res) => {
		GenericController.getAll(req, res, db);
	})

	app.post(`${routePrefix}`, (req, res) => {
		GenericController.post(req, res, db);
	})

	app.put(`${routePrefix}/:id`, (req, res) => {
		GenericController.put(req, res, db);
	})

	app.delete(`${routePrefix}/:id`, (req, res) => {
		GenericController.delete(req, res, db);
	})

	

}
