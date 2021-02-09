// this is just a mock template, unused
module.exports = {

	async get(req, res, db) {
		let categories = await db.Categories.findAll({
			where: {
				userId: req.session.user.id,
			},
			order: [['order_number', 'asc']],
			include: db.Links,
		}).catch(err => console.log(err))

		if (categories) {
			res.json({message: "GET SUCCESS", code: 1, categories: categories});
		} else {
			res.json({message: "Couldnt Get categories", code: -1});
		}
	},

	async post(req, res, db) {
		let created = await db.Categories.create({name: req.body.name, userId: req.session.user.id})
		if (created) {
			res.json({message: "CREATE SUCCESS", code: 1});
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
}