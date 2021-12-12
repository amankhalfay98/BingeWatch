let { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const movieData = require('./movies');
const bcrypt = require('bcryptjs');
const saltRounds = 12;

module.exports = {
	//Functions Start here

	async getAllUsers() {
		const userCollection = await users();
		const allUsers = await userCollection.find({}).toArray();
		for (let x of allUsers) {
			x._id = x._id.toString();
		}

		return allUsers;
	},

	async createUser(
		name,
		date_of_birth,
		username,
		password,
		email,
		profile_pic
	) {
		//Error Handling

		//For Name
		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			throw 'User name is invalid';
		}

		//REWORK ERROR CHECKS
		// for (let i = 0; i < name.length; i++) {
		// 	const element = name[i];
		// 	//console.log(element);
		// 	if (!element.match(/([a-zA-Z])/)) throw 'only characters allowed';
		// }

		// For DOB
		if (
			!date_of_birth ||
			typeof date_of_birth !== 'string' ||
			date_of_birth.trim().length === 0
		) {
			throw 'Please provide Date of Birth';
		}
		date_of_birth = date_of_birth.trim();
		// console.log('In Data', date_of_birth);
		if (!date_of_birth.match(/^\d{4}-\d{2}-\d{2}$/))
			throw 'Invalid Date of Birth';

		// For Username
		if (
			!username ||
			typeof username !== 'string' ||
			username.trim().length === 0
		) {
			throw 'Please provide username';
		}

		username = username.trim().toLowerCase();
		if (username.length < 4)
			throw 'username should be at least 4 characters long';

		for (let i = 0; i < username.length; i++) {
			const element = username[i];
			//console.log(element);
			if (/\s+/g.test(element)) throw 'spaces not allowed in username';
			if (!element.match(/([a-z0-9])/))
				throw 'only alphanumeric characters allowed';
		}

		// For Email
		if (!email || typeof email !== 'string' || email.trim().length === 0) {
			throw 'User email id is invalid';
		}
		email = email.trim().toLowerCase();
		if (
			!email.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		)
			throw 'Invalid Email Address';

		//For Password
		if (
			!password ||
			typeof password !== 'string' ||
			password.trim().length === 0
		) {
			throw 'Please provide password';
		}

		if (password.length < 6)
			throw 'password should be at least 6 characters long';

		for (let i = 0; i < password.length; i++) {
			const element = password[i];
			//console.log(element);
			if (/\s+/g.test(element)) throw 'spaces not allowed in password';
		}

		// if (typeof private !== 'boolean') {
		// 	throw 'private can only be true or false';
		// }

		//Insert data into Database
		const collectionOfUsers = await users();

		const allUsers = await this.getAllUsers();
		allUsers.forEach((user) => {
			if (user.email == email) throw 'This email is already taken.';
			if (user.username == username) throw 'This username is already taken.';
		});

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		let userDetails = {
			name: name,
			date_of_birth: date_of_birth,
			username: username,
			password: hashedPassword,
			email: email,
			watchlist: [],
			favourites: [],
			followers: [],
			following: [],
			reviewId: [],
			private: false,
			profile_pic: profile_pic,
			tag: 'user',
		};

		const userInserted = await collectionOfUsers.insertOne(userDetails);

		if (userInserted.insertedCount === 0) {
			throw 'User could not be added';
		}

		return `${name} successfully added!`;
		// let userId = userInserted.insertedId;

		// //convert ObjectID to String
		// userId = userId.toString();

		// const user = await this.get(userId);
		// return user;
	},

	async checkUser(username, password) {
		// Error handling for username
		if (!username || username.trim() == '') throw 'Please provide username';

		username = username.trim().toLowerCase();
		if (username.length < 4)
			throw 'username should be at least 4 characters long';

		for (let i = 0; i < username.length; i++) {
			const element = username[i];
			//console.log(element);
			if (/\s+/g.test(element)) throw 'spaces not allowed in username';
			if (!element.match(/([a-z0-9])/))
				throw 'only alphanumeric characters allowed';
		}

		// Error handling for password

		if (!password || password.trim() == '') throw 'Please provide password';

		if (password.length < 6)
			throw 'password should be at least 6 characters long';

		for (let i = 0; i < password.length; i++) {
			const element = password[i];
			//console.log(element);
			if (/\s+/g.test(element)) throw 'spaces not allowed in password';
		}

		const collectionOfUsers = await users();

		const oldUsers = await collectionOfUsers.findOne({ username: username });

		if (oldUsers === null) throw 'Either the username or password is invalid';

		//console.log(oldUsers);

		let compareToMatch = false;

		try {
			compareToMatch = await bcrypt.compare(password, oldUsers.password);
		} catch (e) {
			//no op
		}

		if (compareToMatch) {
			return { authenticated: true };
		} else {
			throw 'Either the username or password is invalid';
		}
	},

	async getUser(username) {
		if (!username || username.trim() == '') throw 'Please provide username';

		username = username.trim().toLowerCase();
		if (username.length < 4)
			throw 'username should be at least 4 characters long';

		for (let i = 0; i < username.length; i++) {
			const element = username[i];
			//console.log(element);
			if (/\s+/g.test(element)) throw 'spaces not allowed in username';
			if (!element.match(/([a-z0-9])/))
				throw 'only alphanumeric characters allowed';
		}
		const collectionOfUsers = await users();

		const user = await collectionOfUsers.findOne({ username: username });

		return user;
	},

	async get(id) {
		//console.log('Inside the ID function');
		//Error Handeling
		if (!id) {
			throw 'Input Id field is required.';
		}

		// if (typeof id !== 'string' || id.trim().length === 0) {
		// 	throw 'Id can only be of type String.';
		// }

		if (!ObjectId.isValid(id)) throw 'Invalid id';

		//Converting String ID to ObjectID
		// let objParseID = ObjectId(id);

		const collectionOfUsers = await users();
		const user = await collectionOfUsers.findOne({ _id: ObjectId(id.trim()) });
		if (!user) {
			throw 'User could not be found with the supplied ID.';
		}
		// let getIndex = user._id.toString();
		// user._id = getIndex;
		return user;
	},

	async remove(id) {
		//Error Handeling
		if (!id) {
			throw 'Input id must be provided.';
		}
		if (typeof id !== 'string' || id.trim().length === 0) {
			throw new 'Id can only be of type String.'();
		}
		//Converting String ID to ObjectID
		let objParseID = ObjectId(id);
		//let delrest = await this.get(id);
		const collectionOfUsers = await users();
		//Delete Supplied Data ID object
		const userToBeDeleted = await collectionOfUsers.deleteOne({
			_id: objParseID,
		});

		if (userToBeDeleted.deletedCount === 0) {
			throw 'User with the supplied id could not be deleted/ does not Exist.';
		}

		let retObj = {};
		(retObj['userId'] = id), (retObj['deleted'] = true);
		return retObj;
	},

	async update(username, name, newpass, password) {
		//console.log('Inside update function');
		//Error Handling
		// if (!id) throw 'You must provide an id to update';

		// if (typeof id !== 'string' || id.trim() === '')
		// 	throw 'Please provide a valid id';

		// id = id.trim();

		// if (!ObjectId.isValid(id) || ObjectId(id).toString() !== id)
		// 	throw 'Invalid id';

		// For Name
		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			throw 'User name is invalid';
		}

		// For DOB
		// if (
		// 	!date_of_birth ||
		// 	typeof date_of_birth !== 'string' ||
		// 	date_of_birth.trim().length === 0
		// ) {
		// 	throw 'Please provide Date of Birth';
		// }
		// date_of_birth = date_of_birth.trim();
		// // console.log('In Data', date_of_birth);
		// if (!date_of_birth.match(/^\d{4}-\d{2}-\d{2}$/))
		// 	throw 'Invalid Date of Birth';

		// if (
		// 	typeof profile_pic !== 'string' ||
		// 	profile_pic.trim().length === 0
		// ) {
		// 	throw 'Please provide Date of Birth';
		// }

		// For Private or Non-Private Account
		// if (!private) {
		// 	private = false;
		// }

		// if (typeof private !== 'boolean') {
		// 	throw 'Please provide privacy setting';
		// }

		if (
			!newpass ||
			typeof newpass !== 'string' ||
			newpass.trim().length === 0
		) {
			throw 'Please provide old password';
		}

		if (newpass.length < 6)
			throw 'old password should be at least 6 characters long';

		for (let i = 0; i < newpass.length; i++) {
			const element = newpass[i];
			//console.log(element);
			if (/\s+/g.test(element)) throw 'spaces not allowed in password';
		}

		if (
			!password ||
			typeof password !== 'string' ||
			password.trim().length === 0
		) {
			throw 'Please provide password';
		}

		if (password.length < 6)
			throw 'password should be at least 6 characters long';

		for (let i = 0; i < password.length; i++) {
			const element = password[i];
			//console.log(element);
			if (/\s+/g.test(element)) throw 'spaces not allowed in password';
		}

		if (newpass != password) throw 'passwords do not match';

		const fieldValOfUser = await this.getUser(username);
		if (!fieldValOfUser) throw 'User does not exist.';

		//Update Data
		const collectionOfUsers = await users();

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const updateUser = {
			name: name,
			date_of_birth: fieldValOfUser.date_of_birth,
			username: fieldValOfUser.username,
			password: hashedPassword,
			email: fieldValOfUser.email,
			watchlist: fieldValOfUser.watchlist,
			favourites: fieldValOfUser.favourites,
			followers: fieldValOfUser.followers,
			following: fieldValOfUser.following,
			reviewId: fieldValOfUser.reviewId,
			private: fieldValOfUser.private,
			profile_pic: fieldValOfUser.profile_pic,
			tag: 'user',
		};
		//console.log(updateUser);
		let objParseID = ObjectId(fieldValOfUser._id);
		const userDataUpdate = await collectionOfUsers.updateOne(
			{ _id: objParseID },
			{ $set: updateUser }
		);
		if (userDataUpdate.modifiedCount === 0) {
			throw 'User details could not be updated.';
		}
		return await this.getUser(username);
	},

	async addToFave(user, movie) {
		if(!user || ! movie)
			{throw "missing input parameters";}
		
		if(typeof user !== 'string' || typeof movie !== 'string')
			{throw "invalid data type";}

		if(user.trim().length === 0 || movie.trim().length === 0)
			{throw "invalid strings";}

		let isFav=false;
		const usersCollection = await users();
		let currUser = await usersCollection.findOne({ username: user.trim() });
		if (currUser === null) throw 'user not found';

		if (currUser.favourites.includes(movie)){
            const updatedUser = await usersCollection.updateOne({ username: user.trim() },{$pull: { favourites: movie.trim() }});
            if (updatedUser.matchedCount && updatedUser.modifiedCount) {isFav = false};
        }
        else{
            const updatedUser = await usersCollection.updateOne(
				{ username: user.trim() },
				{ $addToSet: { favourites: movie.trim() } }
			);
            if (updatedUser.matchedCount && updatedUser.modifiedCount) {isFav = true};
        }
		await movieData.favMovies(user, movie);
		return isFav;
	},

	async removeFromFave(user, movie) {
		if (!user || !movie) throw 'missing input parameters';

		if (typeof user !== 'string' || typeof movie !== 'string')
			throw 'invalid data type';

		if (user.trim().length === 0 || movie.trim().length === 0)
			throw 'invalid strings';

		const usersCollection = await users();
		let currUser = await usersCollection.findOne({ username: user.trim() });
		if (currUser === null) throw 'user not found';

		const updatedUser = await usersCollection.updateOne(
			{ username: user.trim() },
			{ $pull: { favourites: movie.trim() } }
		);

		if (updatedUser.modifiedCount === 0) {
			throw 'nothing was removed from favourites';
		}

		return `${movie} successfully removed from ${user}'s favourites.`;
	},

	async addToWatch(user, movie) {

		if(!user || ! movie)
			{throw "missing input parameters";}
		
		if(typeof user !== 'string' || typeof movie !== 'string')
			{throw "invalid data type";}

		if(user.trim().length === 0 || movie.trim().length === 0)
			{throw "invalid strings";}

			let isWatched=false;
			const usersCollection = await users();
			let currUser = await usersCollection.findOne({ username: user.trim() });
			if(currUser === null) {throw "user not found";}
	
			if (currUser.watchlist.includes(movie)){
				const updatedUser = await usersCollection.updateOne({ username: user.trim() },{$pull: { watchlist: movie.trim() }});
				if (updatedUser.matchedCount && updatedUser.modifiedCount) {isWatched = false};
			}
			else{
				const updatedUser = await usersCollection.updateOne(
					{ username: user.trim() },
					{ $addToSet: { watchlist: movie.trim() } }
				);
				if (updatedUser.matchedCount && updatedUser.modifiedCount) {isWatched = true};
			}
			await movieData.toWatchMovies(user, movie);
			return isWatched;
	},

	async removeFromWatch(user, movie) {
		if (!user || !movie) throw 'missing input parameters';

		if (typeof user !== 'string' || typeof movie !== 'string')
			throw 'invalid data type';

		if (user.trim().length === 0 || movie.trim().length === 0)
			throw 'invalid strings';

		const usersCollection = await users();
		let currUser = await usersCollection.findOne({ username: user.trim() });
		if (currUser === null) throw 'user not found';

		const updatedUser = await usersCollection.updateOne(
			{ username: user.trim() },
			{ $pull: { watchlist: movie.trim() } }
		);

		if (updatedUser.modifiedCount === 0) {
			throw 'nothing was removed from favourites';
		}

		return `${movie} successfully removed from ${user}'s watchlist.`;
	},

	async followUser(user1, user2) {
		if (!user1 || !user2) throw 'no users supplied';

		if (typeof user1 !== 'string' || typeof user2 !== 'string')
			throw 'invalid data type';

		if (typeof user1.trim().length === 0 || typeof user2.trim().length === 0)
			throw 'invalid strings';

		const usersCollection = await users();
		let addToFollower = await usersCollection.findOne({
			username: user1.trim(),
		});
		let addToFollowing = await usersCollection.findOne({
			username: user2.trim(),
		});
		if (addToFollower === null) throw 'user not found';
		if (addToFollowing === null) throw 'user not found';

		const updatedUser1 = await usersCollection.updateOne(
			{ username: user1.trim() },
			{ $push: { following: user2.trim() } }
		);

		const updatedUser2 = await usersCollection.updateOne(
			{ username: user2.trim() },
			{ $push: { followers: user1.trim() } }
		);

		if (updatedUser1.modifiedCount === 0) {
			throw 'no one was added to following';
		}

		if (updatedUser2.modifiedCount === 0) {
			throw 'no one was added to followers';
		}

		return `${user1} successfully following ${user2}.`;
	},

	async unfollowUser(user1, user2) {
		if (!user1 || !user2) throw 'no users supplied';

		if (typeof user1 !== 'string' || typeof user2 !== 'string')
			throw 'invalid data type';

		if (typeof user1.trim().length === 0 || typeof user2.trim().length === 0)
			throw 'invalid strings';

		const usersCollection = await users();
		let removeFromFollower = await usersCollection.findOne({
			username: user1.trim(),
		});
		let removeFromFollowing = await usersCollection.findOne({
			username: user2.trim(),
		});
		if (removeFromFollower === null) throw 'user not found';
		if (removeFromFollowing === null) throw 'user not found';

		const updatedUser1 = await usersCollection.updateOne(
			{ username: user1.trim() },
			{ $pull: { following: user2.trim() } }
		);

		const updatedUser2 = await usersCollection.updateOne(
			{ username: user2.trim() },
			{ $pull: { followers: user1.trim() } }
		);

		if (updatedUser1.modifiedCount === 0) {
			throw 'no one was removed from following';
		}

		if (updatedUser2.modifiedCount === 0) {
			throw 'no one was removed from followers';
		}

		return `${user1} successfully unfollowed ${user2}.`;
	},

	async searchByUsername(user) {
		if (!user) throw 'missing input parameters';

		if (typeof user !== 'string') throw 'invalid data type';

		if (user.trim().length === 0) throw 'invalid strings';

		let regExTerm = new RegExp('.*' + user.trim() + '.*', 'i');
		const usersCollection = await users();
		let matched = await usersCollection.find({ username: regExTerm }).toArray();
		if (matched.length === 0) throw `no users matched to ${user.trim()}.`;

		return matched;
	},
};
