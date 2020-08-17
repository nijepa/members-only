const User = require('../models/user');
const Message = require('../models/message');
const validator = require("express-validator");
const passport = require('passport');
const genPassword = require('../utils/passwordUtils').genPassword;
const moment = require('moment');

// Display home page.
exports.home_page = async (req, res, next) => { 
	try {
		await Message.find({}, 'title text timestamp formated_date user')
			.populate('user')
			.exec(function (err, messages) {
			if (err) { return next(err); }
			//Successful, so render
			if (req.user) {
				res.render("index", { title: 'Members only', user: req.user, isMember: req.user.membership, message: messages });
			} else {
				res.render("index", { title: 'Members only', user: null, isMember: null, message: messages });
			}
		});
	} catch (err) {
		return next(err);
	}
};

/* ----------------------------- SIGNUP -------------------------------- */
// Display user signup form on GET.
exports.signup_get = async (req, res, next) => { 
	try {
		res.render("signup", { title: "Sign Up" });
	} catch (err) {
		return next(err);
	}
};

// Handle user signup on POST.
exports.signup_post = [
	// Validate and sanitize fields.
  validator.body("first_name", "First Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  validator.body("last_name", "Last Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  validator.body("uname", "Name must not be empty.").trim().isLength({ min: 3 }).escape(),
  validator.body("pw", "Password must not be empty.").trim().isLength( { min: 3 }).escape(),
  validator.body("rpw", "Repeat Password must not be empty.").trim().isLength( { min: 3 }).escape(),
  
	async (req, res, next) => {
    //Genereate password
    const saltHash = genPassword(req.body.pw);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

		const errors = validator.validationResult(req);
    
		const newUser = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			uname: req.body.uname,
      hash: hash,
      salt: salt,
      membership: false,
      isAdmin: false
		});
		
		// Check if re-entered passwor is correct.
		if(req.body.pw !== req.body.rpw){
      res.render('signup', {title: "Sign Up", user: newUser, mess: "Password doesn't match", errors: errors.array()});
		}
    
		if (!errors.isEmpty()) {
			// Show errors.
			res.render("signup", { title: "Sign Up", user: newUser, errors: errors.array() });
		} else {
			try {
				// Check if user with entered username exists.
				const result = await User.findOne({ uname: req.body.uname }).exec();
				if (result) {
          res.render('signup', {mess: 'User exists'});
				} else { 
				
          const newU = await newUser.save()
            .then((newUser) => {
              console.log(newUser);
            })
            .catch((err => {
              console.log(err);
            }));
						res.render('login', { title: "Log In", user: newUser });
					}
			} catch (err) {
				return next(err);
			}
		}
  }
];

/* ----------------------------- LOGIN -------------------------------- */
// Display user login form on GET.
exports.login_get = async (req, res, next) => { 
	try {
		res.render("login", { title: "Log In" });
	} catch (err) {
		return next(err);
	}
};

// Handle login on POST.
exports.login_post = (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login?info=' + info);
    }

    req.logIn(user, async function(err) {
      if (err) {
        return next(err);
      }
			return res.redirect('/', );
    });

  })(req, res, next);
};

// Handle successfull login on POST.
exports.success_redirect = async (req, res, next) => { 
	try {
		const result = await User.findOne({ uname: req.body.uname }).exec();
		if (result) {
			//const messages = await Message.find().exec();
			res.redirect('/', );
		}
	} catch (err) {
		return next(err);
	}
};

/* ----------------------------- MEMBERSHIP -------------------------------- */
// Display user membership form on GET.
exports.member_get = async (req, res, next) => { 
	try {
			res.render("member", { title: "Membership" });
	} catch (err) {
		return next(err);
	}
};

// Handle successfull membership on POST.
exports.member_post = async (req, res, next) => { 
		// Check if re-entered passwor is correct.
		if(req.body.membership !== 'djurospiro'){
			res.render('member', {title: "Membership", mess: "Password doesn't match" });
		}
		try {
			User.findByIdAndUpdate(req.user.id, { membership: true }, 
													function (err, docs) { 
				if (err){ 
						//console.log(err) 
				} 
				else{ 
						//console.log("Updated User : ", docs); 
				} 
			}); 
			res.redirect('/');
		} catch (err) {
			return next(err);
		}
		
	}
