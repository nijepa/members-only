const User = require('../models/user');
const Message = require('../models/message');
const validator = require("express-validator");
const moment = require('moment');


// Display message create form on GET.
exports.message_create_get = async (req, res, next) => { 
	try {
		const result = await User.findOne({ uname: req.user.uname }).exec();
		const d = new Date();
		res.render("message_form", { title: "Add Message", user: result, dat: moment(d).format('DD-MM-yyyy') });
	} catch (err) {
		return next(err);
	}
};

// Handle message create on POST.
exports.message_create_post = [
	// Validate and sanitize fields
  validator.body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
	validator.body("text", "Description must not be empty.").trim().isLength({ min: 1 }).escape(),

	async (req, res, next) => {
		const errors = validator.validationResult(req);
		const message = new Message({
			title: req.body.title,
			text: req.body.text,
			timestamp: new Date(),
			user: req.user
		});

		if (!errors.isEmpty()) {
			res.render("message_form", { title: "Add Message", message: message, user: message.user, errors: errors.array() });
		} else {
			try {
				const result = await Message.findOne({ title: req.body.title }).exec();
				if (result) {
					
					res.redirect(result.url);
				} else {
					const newMessage = await message.save();
					const messages = await Message.find().exec();
					res.redirect('/');
				}
			} catch (err) {
				return next(err);
			}
		}
  }
];