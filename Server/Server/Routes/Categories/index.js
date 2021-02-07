const {Categories} = require('../../Controllers')

module.exports = (app, db) => {

	const routePrefix = '/categories'

	app.get(`${routePrefix}/test`, (req, res) => {
		Categories.test();
	})

	app.get(`${routePrefix}`, (req, res) => {
		Categories.get(req, res, db);
	})

	app.post(`${routePrefix}`, (req, res) => {
		Categories.post(req, res, db);
	})

	app.put(`${routePrefix}/:id`, (req, res) => {
		Categories.put(req, res, db);
	})

	app.delete(`${routePrefix}/:id`, (req, res) => {
		Categories.delete(req, res, db);
	})
	

}
