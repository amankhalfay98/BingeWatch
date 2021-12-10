const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let { ObjectId } = require('mongodb');
const usersData = require('../data/users');
const path = require('path');


//FOR USERS FOLLOWING OTHER USERS (CHANGE IF NEEDED)
router.get('/follow/:id', async(req, res) => {
	try {
		const getUser = await usersData.get(req.params.id);
		const addFollow = await usersData.followUser("royroy", getUser["username"]);
		res.status(200).json(addFollow);
	  } catch (e) {
		res.status(400).render('pages/error',{error:e, title:'Search Error'});
	  }
});

//FOR USERS UNFOLLOWING OTHER USERS
router.get('/unfollow/:id', async(req, res) => {
	try {
		const getUser = await usersData.get(req.params.id);
		const unfollow = await usersData.unfollowUser("royroy", getUser["username"]);
		res.status(200).json(unfollow);
	  } catch (e) {
		res.status(400).render('pages/error',{error:e, title:'Search Error'});
	  }
});

// To go on Landing Page
router.get('/', async (req, res) => {
	//console.log(req.session);
	// if (req.session.user) {

	if (req.session.user) {
		res.redirect('movies/all');
	} else {
		res.render('pages/landing', { title: 'Binge-Watch' });
	}
});

// To go on Login Page
router.get('/login', async (req, res) => {
	if (req.session.user) {
		res.redirect('/movies/all');
	} else {
		res.render('pages/login');
	}
});

// To go on Signup Page
router.get('/signup', async (req, res) => {
	if (req.session.user) {
		res.redirect('/movies/all');
	} else {
		res.render('pages/signup');
	}
});

// To Sign Up a new User
router.post('/signup', async (req, res) => {
	const newUser = req.body;
	//console.log(newUser);
	//req.session.user = newUser;

	// Error handling for name
	if (!newUser.name || newUser.name.trim() == '') {
		res.status(400).render('pages/signup', { error: 'Please provide name' });
		return;
	}
	newUser.name = newUser.name.trim();

	for (let i = 0; i < newUser.name.length; i++) {
		const element = newUser.name[i];

		if (!element.match(/([a-zA-Z])/)) {
			res.status(400).render('pages/signup', {
				error: 'only characters allowed',
			});
			return;
		}
	}

	//Error Handling for DOB
	if (!newUser.date_of_birth || newUser.date_of_birth.trim() == '') {
		res
			.status(400)
			.render('pages/signup', { error: 'Please provide Date of Birth' });
		return;
	}
	newUser.date_of_birth = newUser.date_of_birth.trim();
	// console.log(newUser.date_of_birth);

	if (!newUser.date_of_birth.match(/^\d{4}-\d{2}-\d{2}$/)) {
		res.status(400).render('pages/signup', {
			error: 'Invalid Date of Birth',
		});
		return;
	}

	// Error handling for username
	if (!newUser.username || newUser.username.trim() == '') {
		res
			.status(400)
			.render('pages/signup', { error: 'Please provide username' });
		return;
	}

	newUser.username = newUser.username.trim().toLowerCase();
	if (newUser.username.length < 4) {
		res.status(400).render('pages/signup', {
			error: 'username should be at least 4 characters long',
		});
		return;
	}

	for (let i = 0; i < newUser.username.length; i++) {
		const element = newUser.username[i];
		//console.log(element);
		if (/\s+/g.test(element)) {
			res
				.status(400)
				.render('pages/signup', { error: 'spaces not allowed in username' });
			return;
		}

		if (!element.match(/([a-z0-9])/)) {
			res.status(400).render('pages/signup', {
				error: 'only alphanumeric characters allowed',
			});
			return;
		}
	}

	// Error handling for Email
	if (!newUser.email || newUser.email.trim() == '') {
		res
			.status(400)
			.render('pages/signup', { error: 'Please provide valid emailId' });
		return;
	}
	newUser.email = newUser.email.trim();

	if (
		!newUser.email.match(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	) {
		res.status(400).render('pages/signup', {
			error: 'Invalid Email Address',
		});
		return;
	}

	// Error handling for password

	if (!newUser.password || newUser.password.trim() == '') {
		res
			.status(400)
			.render('pages/signup', { error: 'Please provide password' });
		return;
	}

	if (newUser.password.length < 6) {
		res.status(400).render('pages/signup', {
			error: 'password should be at least 6 characters long',
		});
		return;
	}

	for (let i = 0; i < newUser.password.length; i++) {
		const element = newUser.password[i];
		//console.log(element);
		if (/\s+/g.test(element)) {
			res
				.status(400)
				.render('pages/signup', { error: 'spaces not allowed in password' });
			return;
		}
	}

	try {
		const { name, date_of_birth, username, password, email } = newUser;

		//console.log(newRestaurant);
		const rev = await usersData.createUser(
			name,
			date_of_birth,
			username,
			password,
			email
		);

		//For Sessions
		req.session.user = newUser.username;
		//console.log(req.session);

		//console.log(rev);
		res.status(200).redirect('/');
	} catch (e) {
		//console.log(e);
		if (e == 'Internal Server Error') {
			res.status(500).render('pages/signup', { error: e });
		} else {
			res.status(400).render('pages/signup', { error: e });
		}
	}
});

// To Post Login Information
router.post('/login', async (req, res) => {
	const newUser = req.body;
	//console.log(req.session);

	// Error handling for username
	if (!newUser.username || newUser.username.trim() == '') {
		res.status(400).render('pages/login', { error: 'Please provide username' });
		return;
	}

	newUser.username = newUser.username.trim().toLowerCase();

	if (newUser.username.length < 4) {
		res.status(400).render('pages/login', {
			error: 'username should be at least 4 characters long',
		});
		return;
	}

	for (let i = 0; i < newUser.username.length; i++) {
		const element = newUser.username[i];
		//console.log(element);
		if (/\s+/g.test(element)) {
			res
				.status(400)
				.render('pages/login', { error: 'spaces not allowed in username' });
			return;
		}

		if (!element.match(/([a-z0-9])/)) {
			res.status(400).render('pages/login', {
				error: 'only alphanumeric characters allowed',
			});
			return;
		}
	}

	// Error handling for password

	if (!newUser.password || newUser.password.trim() == '') {
		res.status(400).render('pages/login', { error: 'Please provide password' });
		return;
	}

	if (newUser.password.length < 6) {
		res.status(400).render('pages/login', {
			error: 'password should be at least 6 characters long',
		});
		return;
	}

	for (let i = 0; i < newUser.password.length; i++) {
		const element = newUser.password[i];
		//console.log(element);
		if (/\s+/g.test(element)) {
			res
				.status(400)
				.render('pages/login', { error: 'spaces not allowed in password' });
			return;
		}
	}

	try {
		const { username, password } = newUser;

		//console.log(newUser);
		const rev = await usersData.checkUser(username, password);
		if (rev.authenticated) {

			req.session.user = { username: newUser.username };
			//console.log(req.session);
			res.redirect('/movies/all');
		}
		//res.redirect('/all');
		//console.log(rev.authenticated);
		//res.status(200).json(rev);
		//res.redirect('/private');
	} catch (e) {
		//console.log(e);
		res.status(400).render('pages/login', { error: e });
	}
});

// To Update a User
router.post('/private', async (req, res) => {
	const newUser = req.body;
	// console.log(newUser);

	// Error handling for name
	if (!newUser.name || newUser.name.trim() == '') {
		res.status(400).render('pages/private', { error: 'Please provide name' });
		return;
	}
	newUser.name = newUser.name.trim();

	for (let i = 0; i < newUser.name.length; i++) {
		const element = newUser.name[i];

		if (!element.match(/([a-zA-Z])/)) {
			res.status(400).render('pages/private', {
				error: 'only characters allowed',
			});
			return;
		}
	}

	//Error Handling for DOB
	if (!newUser.date_of_birth || newUser.date_of_birth.trim() == '') {
		res
			.status(400)
			.render('pages/private', { error: 'Please provide Date of Birth' });
		return;
	}
	newUser.date_of_birth = newUser.date_of_birth.trim();
	// console.log(newUser.date_of_birth);

	if (!newUser.date_of_birth.match(/^\d{4}-\d{2}-\d{2}$/)) {
		res.status(400).render('pages/private', {
			error: 'Invalid Date of Birth',
		});
		return;
	}

	// Error handling for password

	if (!newUser.password || newUser.password.trim() == '') {
		res
			.status(400)
			.render('pages/signup', { error: 'Please provide password' });
		return;
	}

	if (newUser.password.length < 6) {
		res.status(400).render('pages/signup', {
			error: 'password should be at least 6 characters long',
		});
		return;
	}

	for (let i = 0; i < newUser.password.length; i++) {
		const element = newUser.password[i];
		//console.log(element);
		if (/\s+/g.test(element)) {
			res
				.status(400)
				.render('pages/signup', { error: 'spaces not allowed in password' });
			return;
		}
	}

	try {
		const { name, date_of_birth, private, password } = newUser;

		//console.log(newUser);
		let current = await usersData.getUser(req.session.user.username);

		let rev = await usersData.update(
			current._id,
			name,
			date_of_birth,
			private,
			password
		);
		//console.log(rev);
		res.status(200).redirect('/');
	} catch (e) {
		//console.log(e);
		if (e == 'Internal Server Error') {
			res.status(500).render('pages/private', { error: e });
		} else {
			res.status(400).render('pages/private', { error: e });
		}
	}
});

// If authenticated go to Private Route
router.get('/private', async (req, res) => {
	let rev = await usersData.getUser(req.session.user.username);
	//console.log(rev._id);

	res.render('pages/private', { username: rev.username, name: rev.name });
});

// To Logout
router.get('/logout', async (req, res) => {
	req.session.destroy();
	res.clearCookie('AuthCookie');
	res.render('pages/logout');
});

module.exports = router;
