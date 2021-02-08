// this is just a mock template, unused

module.exports = {
	async get(req, res, db) {
		let links = await db.Links.findAll({
			where: {
				categoryId: req.body.categoryId,
				// include: db.Links,
			}
		}).catch(err => console.log(err))

		if (categories) {
			res.json({message: "GET SUCCESS", code: 1, links: links});
		} else {
			res.json({message: "Couldnt Get Links", code: -1});
		}
	},

	async post(req, res, db) {
		let created = await db.Links.create({categoryId: req.body.categoryId.toString(), name: req.body.name, url: req.body.url})
		if (created) {
			res.json({message: "CREATE SUCCESS", code: 1});
		} else {
			res.json({message: "COULDNT CREATE", code: -1});
		}
	},

	async put(req, res, db) {
		let link = await db.Links.findOne({
			where: {
				categoryId: req.params.categoryId,
				id: req.params.id,
			}
		})

		let updated = await link.update({name: req.body.name, url: req.body.url})

		if (updated) {
			res.json({message: "Update Success", code: 1})
		} else {
			res.json({message: "Couldnt Update", code: -1});
		}

	},

	delete(req, res, db) {
		db.Categories.delete({
			where: {
				id: req.params.id,
			}
		})
	},
}