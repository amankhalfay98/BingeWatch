let { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 12;

module.exports = {
	//Functions Start here

	async createUser(name, date_of_birth, username, password, email) {
		//Error Handling

		//For Name
		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			throw 'User name is invalid';
		}
		for (let i = 0; i < name.length; i++) {
			const element = name[i];
			//console.log(element);
			if (!element.match(/([a-zA-Z])/)) throw 'only characters allowed';
		}

		// For DOB
		if (
			!date_of_birth ||
			typeof date_of_birth !== 'string' ||
			date_of_birth.trim().length === 0
		) {
			throw 'Please provide Date of Birth';
		}
		date_of_birth = date_of_birth.trim();
		if (!date_of_birth.match(/^\d{2}[/]\d{2}[/]\d{4}$/))
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
		email = email.trim();
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

		const oldUsers = await collectionOfUsers.findOne({ username: username });

		if (oldUsers !== null) throw 'already a user with that username';

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
			profile_pic: '',
			tag: 'user',
		};

		const userInserted = await collectionOfUsers.insertOne(userDetails);

		if (userInserted.insertedCount === 0) {
			throw 'User could not be added';
		}
		let userId = userInserted.insertedId;

		//convert ObjectID to String
		userId = userId.toString();

		const user = await this.get(userId);
		return user;
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

	// async getAll(){
	//   //Error Handeling
	//   if(arguments.length!==0){
	//     throw "Arguments cannot be passed for this function call.";
	//   }
	//   //Get list of data in DB
	//     const collectionOfUsers = await users();
	//     const listOfAllUsers = await collectionOfUsers.find({}).toArray();
	//     //convert ObjectID to String
	//     listOfAllUsers.forEach(user => {
	//       let getIndex = user._id.toString();
	//       user._id = getIndex;
	//     });
	//     return listOfAllUsers;
	// },

	async get(id) {
		//Error Handeling
		if (!id) {
			throw 'Input Id field is required.';
		}

		if (typeof id !== 'string' || id.trim().length === 0) {
			throw 'Id can only be of type String.';
		}

		id = id.trim();

		if (!ObjectId.isValid(id) || ObjectId(id).toString() !== id)
			throw 'Invalid id';

		//Converting String ID to ObjectID
		let objParseID = ObjectId(id);

		const collectionOfUsers = await users();
		const user = await collectionOfUsers.findOne({ _id: objParseID });
		if (!user) {
			throw 'User could not be found with the supplied ID.';
		}
		let getIndex = user._id.toString();
		user._id = getIndex;
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

	async update(id, name, password, private, profile_pic) {
		//Error Handling
		if (!id) throw 'You must provide an id to update';

		if (typeof id !== 'string' || id.trim() === '')
			throw 'Please provide a valid id';

		id = id.trim();

		if (!ObjectId.isValid(id) || ObjectId(id).toString() !== id)
			throw 'Invalid id';

		if (!name || !private || !password || !profile_pic) {
			throw 'One or more Input parameter missing. Please provide valid input for all fields.';
		}
		if (typeof name !== 'string' || name.trim().length === 0) {
			throw 'User name is invalid';
		}
		// if (
		// 	typeof profile_pic !== 'string' ||
		// 	profile_pic.trim().length === 0
		// ) {
		// 	throw 'Please provide Date of Birth';
		// }
		if (!private || typeof private !== 'boolean') {
			throw 'Please provide username';
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

		const fieldValOfUser = await this.get(id);
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
			private: private,
			profile_pic: profile_pic,
			tag: 'user',
		};
		let objParseID = ObjectId(id);
		const userDataUpdate = await collectionOfUsers.updateOne(
			{ _id: objParseID },
			{ $set: updateUser }
		);
		if (userDataUpdate.modifiedCount === 0) {
			throw 'User details could not be updated.';
		}
		return await this.get(id);
	},
};
