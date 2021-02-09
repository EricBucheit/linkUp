const {Categories} = require('../../Controllers')

module.exports = (app, db) => {

	const routePrefix = '/categories'

	app.get(`${routePrefix}`, (req, res) => {
		console.log("GETTING CATEGORIES")
		Categories.get(req, res, db).catch(err => console.log(err));
	})

	app.post(`${routePrefix}`, (req, res) => {
		Categories.post(req, res, db);
	})

	app.put(`${routePrefix}/:id`, (req, res) => {
		Categories.put(req, res, db);
	})

	app.delete(`${routePrefix}/:id`, (req, res) => {
		console.log(req.params.id)
		Categories.delete(req, res, db);
	})

	app.put(`${routePrefix}/update/order_numbers`, (req, res) => {
		Categories.updateOrderNumbers(req, res, db);
	})
	

}
