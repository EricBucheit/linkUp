const { Op } = require("sequelize");

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
		let newLink = await db.Links.create({categoryId: req.body.categoryId.toString(), name: req.body.name, url: req.body.url})
		if (newLink) {
			res.json({message: "CREATE SUCCESS", code: 1, link: newLink});
		} else {
			res.json({message: "COULDNT CREATE", code: -1});
		}
	},

	async put(req, res, db) {
		let link = await db.Links.findOne({
			where: {
				categoryId: req.params.categoryId,
				id: req.body.linkId,
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
		db.Links.destroy({
			where: {
				id: req.params.id,
			}
		})
		res.json({message: "Update Success", code: 1})
	},
	
	async updateOrderNumbers(req, res, db) {
		for (let link of req.body) {
			let found = await db.Links.findOne({
				where: {
					// userId: req.session.user.id,
					id: link.id,
				}
			})
			await found.update({order_number: link.order_number}) 
		}

		res.json({code: 1, message: "Update Success"});
	},

	async search(req, res, db) {
		let {search} = req.params
		var options = {
		  where: {
		  	 [Op.or]: [
		      { 'name': { [Op.iLike]: '%' + search + '%' } },
		      { 'url': { [Op.iLike]: '%' + search + '%' } }
		    ]
		  },
		  attributes: ['url', 'name', "id"]
		};
		let result = await db.Links.findAll(options).catch(err => console.log(err))
		if (result) {
			res.json({code: 1, message: "Find Success", search: result});
		} else {
			res.json({code: -1, message: "No Results", search: []});
		}
	},

}