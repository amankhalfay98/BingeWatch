const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let { ObjectId } = require('mongodb');
const usersData = require('../data/users');
const path = require('path');
const movies = require('../data/movies');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'profile/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	},
});

const upload = multer({ storage: storage });

//FOR USERS NOT HAVING SESSION
router.get('/noSession', async (req, res) => {
	res
		.status(400)
		.render('pages/error', { error: 'You are not Logged In', title: 'Error' });
});

//FOR USERS FOLLOWING OTHER USERS (CHANGE IF NEEDED)
router.post('/follow/:username', async (req, res) => {
	const follow = req.body;
	try {
		const { user, username } = follow;
		//const movie = await moviesData.getMovie(req.params.id);
		let userFollow = await usersData.followUser(user, username);
		res.status(200).json(userFollow);
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Error' });
	}

	// try {
	// 	const getUser = await usersData.getUser(req.params.username);
	// 	const addFollow = await usersData.followUser('royroy', getUser['username']);
	// 	res.status(200).json(addFollow);
	// } catch (e) {
	// 	res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	// }
});

//FOR USERS UNFOLLOWING OTHER USERS
router.post('/unfollow/:username', async (req, res) => {
	const unfollow = req.body;
	try {
		const { user, username } = unfollow;
		//const movie = await moviesData.getMovie(req.params.id);
		let userUnfollow = await usersData.unfollowUser(user, username);
		res.status(200).json(userUnfollow);
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Error' });
	}
	// try {
	// 	const getUser = await usersData.get(req.params.username);
	// 	const unfollow = await usersData.unfollowUser(
	// 		'royroy',
	// 		getUser['username']
	// 	);
	// 	res.status(200).json(unfollow);
	// } catch (e) {
	// 	res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	// }
});

//SEARCH BAR WHEN GIVEN USERNAME
// router.get('/private/:username', async (req, res) => {
// 	if (req.session.user) {
// 		try {
// 			let rev = await usersData.getUser(req.params.username);
// 			if (rev.username == req.session.user.username) {
// 				res.render('pages/private', { user: rev });
// 			} else {
// 				res.render('pages/individualUser', { user: rev });
// 			}
// 		} catch (e) {
// 			res
// 				.status(400)
// 				.render('pages/error', { error: e, title: 'Search Error' });
// 		}
// 	} else {
// 		res.status(403).render('pages/error');
// 	}
// });

// To go on Landing Page
router.get('/', async (req, res) => {
	//console.log(req.session);
	// if (req.session.user) {

	if (req.session.user) {
		res.redirect('movies/all');
	} else {
		const trendingMovies = await movies.getTrending();
		res.render('pages/landing', {
			title: 'Binge-Watch',
			trending: trendingMovies,
		});
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
router.post('/signup', upload.single('profile_pic'), async (req, res) => {
	const newUser = req.body;
	if (req && req.file && req.file.fieldname === 'profile_pic' && newUser) {
		newUser.profile_pic = req.file.path;
	}
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
		const { name, date_of_birth, username, password, email, profile_pic } =
			newUser;

		//console.log(newRestaurant);
		const rev = await usersData.createUser(
			name,
			date_of_birth,
			username,
			password,
			email,
			profile_pic
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
	//console.log(newUser);
	//console.log(newUser);

	// // Error handling for name
	// if (!newUser.name || newUser.name.trim() == '') {
	// 	res.status(400).render('pages/private', { error: 'Please provide name' });
	// 	return;
	// }
	// newUser.name = newUser.name.trim();

	// for (let i = 0; i < newUser.name.length; i++) {
	// 	const element = newUser.name[i];

	// 	if (!element.match(/([a-zA-Z])/)) {
	// 		res.status(400).render('pages/private', {
	// 			error: 'only characters allowed',
	// 		});
	// 		return;
	// 	}
	// }

	// //Error Handling for DOB
	// //   if (!newUser.date_of_birth || newUser.date_of_birth.trim() == "") {
	// //     res
	// //       .status(400)
	// //       .render("pages/private", { error: "Please provide Date of Birth" });
	// //     return;
	// //   }
	// //   newUser.date_of_birth = newUser.date_of_birth.trim();
	// //   // console.log(newUser.date_of_birth);

	// //   if (!newUser.date_of_birth.match(/^\d{4}-\d{2}-\d{2}$/)) {
	// //     res.status(400).render("pages/private", {
	// //       error: "Invalid Date of Birth",
	// //     });
	// //     return;
	// //   }

	// // Error handling for password

	// if (!newUser.password || newUser.password.trim() == '') {
	// 	res
	// 		.status(400)
	// 		.render('pages/signup', { error: 'Please provide password' });
	// 	return;
	// }

	// if (newUser.password.length < 6) {
	// 	res.status(400).render('pages/signup', {
	// 		error: 'password should be at least 6 characters long',
	// 	});
	// 	return;
	// }

	// for (let i = 0; i < newUser.password.length; i++) {
	// 	const element = newUser.password[i];
	// 	//console.log(element);
	// 	if (/\s+/g.test(element)) {
	// 		res
	// 			.status(400)
	// 			.render('pages/signup', { error: 'spaces not allowed in password' });
	// 		return;
	// 	}
	// }

	try {
		const { name, newpass, password } = newUser;

		//console.log(newUser);
		let current = await usersData.getUser(req.session.user.username);
		let rev = await usersData.update(current.username, name, newpass, password);
		//console.log(rev);
		res.status(200).redirect('/');
	} catch (e) {
		console.log(e);
		if (e == 'Internal Server Error') {
			res.status(500).render('pages/private', {
				error: e,
				authenticated: req.session.user ? true : false,
				username: req.session.user.username,
			});
		} else {
			res.status(400).render('pages/private', {
				error: e,
				authenticated: req.session.user ? true : false,
				username: req.session.user.username,
			});
		}
	}
});

// If authenticated go to Private Route
router.get('/private', async (req, res) => {
	let rev = await usersData.getUser(req.session.user.username);
	//console.log(rev);
	let checked = ''
	if(rev.private){
		checked = 'checked';
	}

	res.render('pages/private', {
		user: rev,
		authenticated: req.session.user ? true : false,
		username: req.session.user.username,
		checked:checked
	});
});

// Individual User Page Route
router.get('/private/:username', async (req, res) => {
	if (req.session.user) {
	try {
	let rev = await usersData.getUser(req.params.username);
	let hidden = '';
	if (req.params.username == req.session.user.username) {
		hidden = 'hidden';
	}
	let follow = 'Follow';
	if (rev.followers.includes(req.session.user.username)) {
		follow = 'Unfollow';
	} else {
		follow = 'Follow';
	}

	res.render('pages/individualUser', {
		user: rev,
		user1: req.session.user.username,
		hidden: hidden,
		follow: follow,
		authenticated: req.session.user ? true : false,
		username: req.session.user.username,
	});
} catch (e) {
				res
					.status(400)
					.render('pages/error', { error: e, title: 'User Error' });
			}
		} else {
			res.status(403).render('pages/error');
		}
});

router.post('/profile/:username/:checked', async (req, res)=>{
const private = await usersData.setPrivate(req.params.username,req.params.checked);
res.json(private);
});

// To Logout
router.get('/logout', async (req, res) => {
	req.session.destroy();
	res.clearCookie('AuthCookie');
	res.render('pages/logout');
});

module.exports = router;
