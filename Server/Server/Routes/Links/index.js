const {Links} = require('../../Controllers')

module.exports = (app, db) => {

	const routePrefix = '/links'

	app.get(`${routePrefix}`, (req, res) => {
		Links.get(req, res, db).catch(err => console.log(err));
	})

	app.post(`${routePrefix}`, (req, res) => {
		Links.post(req, res, db);
	})

	app.put(`${routePrefix}/:categoryId`, (req, res) => {
		Links.put(req, res, db);
	})

	app.delete(`${routePrefix}/:id`, (req, res) => {
		Links.delete(req, res, db);
	})
	
	app.put(`${routePrefix}/update/order_numbers`, (req, res) => {
		Links.updateOrderNumbers(req, res, db);
	})

	app.get(`${routePrefix}/search/:search`, (req, res) => {
		Links.search(req, res, db);
	})
	
}
