
const bcrypt = require('bcrypt');
const saltRounds = 10;
var passwordValidator = require('password-validator');
const { uuid } = require('uuidv4');
const moment = require('moment');
const { Op } = require('sequelize')

module.exports = {
	register(req, res, db) {
		var schema = new passwordValidator();
		// Add properties to it
		schema
		.is().min(8)                                    // Minimum length 8
		.is().max(100)                                  // Maximum length 100
		.has().uppercase()                              // Must have uppercase letters
		.has().lowercase()                              // Must have lowercase letters
		.has().digits()                                 // Must have digits
		.has().not().spaces()                           // Should not have spaces
		.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

		if (!req.body.email || !req.body.password) {
			res.json({code : -1, message: "Username and Password Required"});
			return ;
		}

		if (!schema.validate(req.body.password)) {
			let list = schema.validate(req.body.password, { list: true })
			let message = "Invalid Password -\n Minimum length 8,\n Must have uppercase letters,\n Must have lowercase letters,\n Must have digits,\n Should not have spaces"
			res.json({code : -1, message: message});
			return (false)
		}

			bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
				db.Users.findOrCreate({
									where: 
										{
											email: req.body.email,
										},
									defaults : {
										password: hash,
									},
									include: db.UserInfo,
								})
				  .then(([user, created]) => {
		    	if (created) {
		    		user.password = 'hidden';
		    		req.session.loggedIn = true;
					req.session.user = user
		    		res.json({
		    					code : 1, 
		    					message: `Register Successful for ${user.email}`, 
		    					user: user,
		    				})
		    	} else if (user) {
		    		res.json({code : -2, message: "Register Unsuccesful, Email Exists"})
		    	} else {
					res.json({code : -1, message: "Register Unsuccesful, Email Invalid"})
		    	}			
			});
		})
	},

	login(req, res, db) {

		if (req.session.loggedIn === true) {
			res.json({code : -1, message: "Already Logged In!"})
			return;
		}

		db.Users.findOne({
			where : {
				email: req.body.email,
			},
			 attributes: ["id", "password", "email"],
			 include: db.UserInfo,
		}).then(user => {
				if (user) {
					bcrypt.compare(req.body.password, user.password, function(err, response) {
						if (response === true) {
							user.password = 'Hidden';
							req.session.loggedIn = true;
							
							req.session.user = user

				    		res.json({code : 1, 
				    					message: "Login Successful", 
				    					user: user				    						
				    				})
						} else {
							res.json({code : -1, message: "Login Unsuccessful, Please Try Again or Register"})
						}
					});
				} else {
					res.json({code : -1, message: "Login Unsuccessful, Please Try Again or Register"})
				}
			});
	},

	getUser(req, res, db) {
		if (req.session.loggedIn) {
			db.Users.findOne({
				where : {
					id : req.session.user.id
				},
				attributes: ['id', "email"],
				include: db.UserInfo,
			}).then(user => {
				if (user) {
					req.session.user = user;
					req.session.loggedIn = true;
					res.json({code: 1, message: "Get User Successful", user: user})
				} else {
					res.json({code: -1, message: "Could Not Find account"})

				}
			})
		} else {
			res.json({code: -1, message: "Not Logged In Yet"})
		}
	},

	logout(req, res) {
		req.session.regenerate(function(err) {
	  		if (err) {
	  			res.json({code: -1, message: "Could not logout"})
	  		}
	  		res.json({code: 1, message: "Logout Success"})
		})
	},


	async search(req, res, db) {
		let {search} = req.params
		var options = {
		  where: {
		    email: { [Op.iLike]: '%' + search + '%' },
		  },
		  include: {
		  	model: db.Categories,
		  	include: db.Links,
		  },
		  attributes: ['email', 'id']
		};


		let result = await db.Users.findAll(options)
		if (result) {
			res.json({code: 1, message: "Find Success", search: result});
		} else {
			res.json({code: -1, message: "No Results", search: []});
		}
	},

	
}


// Non implemented
function forgotPassword(req, res, db) {
	db.Users.findOne({
		where: {
			email : req.body.email
		}
	}).then(user => {
		if (user) {
			user.update({
				resetPasswordToken: uuid().split('-')[0],
				resetPasswordExpiration: moment().add(5, 'minutes').format(),
			}).then(user => {
				ForgotPasswordEmail.send(user.resetPasswordToken);
				res.json({code: 1, message: "Email Sent"})
			})
		} else {
			res.json({code: -1, message: "No User Found with that email"});
		}
	})
	
}

function changePassword(req, res, db) {
	if (req.session.user.id <= 1) {
		res.json({code: -1, message: "Not Logged In"})
	}

	db.Users.findOne({
		where: {
			email : req.session.user.email,
		}
	}).then(user => {
		if (user) {
			bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
				user.update({password: hash}).then(user => {
					res.json({code: 1, message: "Password Change Successful"})
				})
			});
		} else {
			res.json({code: -1, message: "Token Expired"});
		}
	})
}

function changePasswordWithToken(req, res, db) {
	db.Users.findOne({
		where: {
			email : req.body.email,
			resetPasswordToken : req.body.token,
			resetPasswordExpiration: {
		      [Op.gt]: moment().format()
		    }
		}
	}).then(user => {
		if (user) {
			bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
				user.update({password: hash}).then(user => {
					res.json({code: 1, message: "Password Change Successful"})
				})
			});
		} else {
			res.json({code: -1, message: "Token Expired"});
		}
	})
}