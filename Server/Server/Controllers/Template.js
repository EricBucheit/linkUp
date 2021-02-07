// this is just a mock template, unused

module.exports = {
	test () {
		console.log("TEST CONTROLLER");
	},

	getOne(req, res, db) {
		console.log("TEST GET ONE CONTROLLER");
	},

	getAll(req, res, db) {
		console.log("TEST GET All CONTROLLER");
	},

	post(req, res, db) {
		console.log("TEST POST CONTROLLER");

	},

	put(req, res, db) {
		console.log("TEST PUT CONTROLLER");
	},

	destroy(req, res, db) {
		console.log("TEST DESTROY CONTROLLER");
	},
}