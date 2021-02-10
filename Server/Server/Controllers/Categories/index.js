const { Op } = require("sequelize");

module.exports = {

	async get(req, res, db) {
		let categories = await db.Categories.findAll({
			where: {
				userId: req.session.user.id,
			},
			order: [['order_number', 'asc']],
			include: {model: db.Links, separate: true, order: [['order_number', 'asc']]}
		}).catch(err => console.log(err))

		if (categories) {
			res.json({message: "GET SUCCESS", code: 1, categories: categories});
		} else {
			res.json({message: "Couldnt Get categories", code: -1});
		}
	},

	async post(req, res, db) {
		let newCategory = await db.Categories.create({name: req.body.name, description: req.body.description, userId: req.session.user.id})
		if (newCategory) {
			res.json({message: "CREATE SUCCESS", code: 1, category: newCategory});
		} else {
			res.json({message: "COULDNT CREATE", code: -1});
		}
	},

	async put(req, res, db) {
		let category = await db.Categories.findOne({
			where: {
				userId: req.session.user.id,
				id: req.params.id,
			}
		})

		let updated = await category.update({name: req.body.name})

		if (updated) {
			res.json({message: "Update Success", code: 1})
		} else {
			res.json({message: "Couldnt Update", code: -1});
		}

	},

	async delete(req, res, db) {
		await db.Categories.destroy({
			where: {
				userId: req.session.user.id,
				id: req.params.id,
			}
		})
		res.json({code: 1, message: "deletion Successful"})
	},

	async updateOrderNumbers(req, res, db) {
		for (category of req.body) {
			let found = await db.Categories.findOne({
				where: {
					userId: req.session.user.id,
					id: category.id,
				}
			})
			await found.update({order_number: category.order_number}) 
		}

		res.json({code: 1, message: "Update Success"});
	},

	async search(req, res, db) {
		let {search} = req.params
		var options = {
		  where: {
		    name: { [Op.iLike]: '%' + search + '%' },
		  },
		  include: [{ model: db.Links }]
		};


		let result = await db.Categories.findAll(options)
		console.log(result)
		if (result) {
			res.json({code: 1, message: "Find Success", search: result});
		} else {
			res.json({code: -1, message: "No Results"});
		}
	},
}








