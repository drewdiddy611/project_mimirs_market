const getModelWrapper = require('../models/index');
/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {
	/**
   * UserController.index()
   */
	index: function(req, res) {
		let sequelizeWrapper = getModelWrapper();

		sequelizeWrapper.findAllUsers().then(_renderUsersIndex).catch(err => {
			return res.status(500).json({
				message: 'Error when getting User.',
				error: err
			});
		});

		function _renderUsersIndex(users) {
			res.render('users/index/', { users });
		}
	},

	/**
   * UserController.view()
   */
	view: function(req, res) {
		var id = req.params.id;
		User.findOne({ _id: id }, function(err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting User.',
					error: err
				});
			}
			if (!User) {
				return res.status(404).json({
					message: 'No such User'
				});
			}
			return res.json(User);
		});
	},

	/**
   * UserController.create()
   */
	create: function(req, res) {
		var User = new User({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			userTypeId: req.body.userTypeId
		});

		User.save(function(err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating User',
					error: err
				});
			}
			return res.status(201).json(User);
		});
	},

	/**
   * UserController.update()
   */
	update: function(req, res) {
		var id = req.params.id;
		User.findOne({ _id: id }, function(err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting User',
					error: err
				});
			}
			if (!User) {
				return res.status(404).json({
					message: 'No such User'
				});
			}

			User.username = req.body.username ? req.body.username : User.username;
			User.password = req.body.password ? req.body.password : User.password;
			User.email = req.body.email ? req.body.email : User.email;
			User.userTypeId = req.body.userTypeId
				? req.body.userTypeId
				: User.userTypeId;

			User.save(function(err, User) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating User.',
						error: err
					});
				}

				return res.json(User);
			});
		});
	},

	/**
   * UserController.remove()
   */
	remove: function(req, res) {
		var id = req.params.id;
		User.findByIdAndRemove(id, function(err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the User.',
					error: err
				});
			}
			return res.status(204).json();
		});
	}
};