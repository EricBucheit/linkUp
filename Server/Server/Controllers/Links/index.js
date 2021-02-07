// this is just a mock template, unused

module.exports = {
	test (req, res, db) {
		console.log("TEST CONTROLLER");
		res.json({message: "TEST ROUTE SUCCESS"})
	},

	getOne(req, res, db) {
		console.log("TEST GET ONE CONTROLLER");
		res.json({message: "TEST GET ONE SUCCESS"})

	},

	getAll(req, res, db) {
		console.log("TEST GET All CONTROLLER");
		res.json({message: "TEST GET ALL SUCCESS"})

	},

	post(req, res, db) {
		console.log("TEST POST CONTROLLER");
		res.json({message: "TEST POST CALL SUCCESS"})


	},

	put(req, res, db) {
		console.log("TEST PUT CONTROLLER");
		res.json({message: "TEST PUT CALL SUCCESS"})

	},

	delete(req, res, db) {
		console.log("TEST DESTROY CONTROLLER");
		res.json({message: "TEST DELETE CALL SUCCESS"})
	},
}