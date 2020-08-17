const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');
const Message = require('../models/message');

// GET request for home page.
router.get('/', user_controller.home_page );


// GET request for signup.
router.get('/signup', user_controller.signup_get);

// POST request for signup.
router.post('/signup', user_controller.signup_post);

// GET request for clogin. NOTE This must come before routes that display Item (uses id).
router.get('/login', user_controller.login_get);

// POST request for login.
router.post('/login', user_controller.login_post);

// GET request for signup.
router.get('/message', message_controller.message_create_get);

// POST request for signup.
router.post('/message', message_controller.message_create_post);

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

// GET request for membership form.
router.get('/member', user_controller.member_get);

// POST request for membership form.
router.post('/member', user_controller.member_post);

module.exports = router;
