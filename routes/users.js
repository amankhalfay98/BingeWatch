const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let { ObjectId } = require('mongodb');
const usersData = require('../data/users');
const path = require('path');

router.post('/signup', async (req, res) => {
	const newUser = req.body;

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
		//console.log(rev);
		res.status(200).json(rev);
	} catch (e) {
		//console.log(e);
		if (e == 'Internal Server Error') {
			res.status(500).json(e);
		} else {
			res.status(400).json({ error: e });
		}
	}
});

router.post('/login', async (req, res) => {
	const newUser = req.body;

	try {
		const { username, password } = newUser;

		//console.log(newRestaurant);
		const rev = await usersData.checkUser(username, password);
		// if (rev) req.session.user = { username: newUser.username };
		// //console.log(rev.authenticated);
		// //res.status(200).json(rev);
		// res.redirect('/private');
		res.status(200).json(rev);
	} catch (e) {
		//console.log(e);
		res.status(400).json({ error: e });
	}
});

module.exports = router;
