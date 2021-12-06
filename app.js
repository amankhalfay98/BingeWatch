const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const { client } = require('./config/mongoConnection');
const users = require('./data/users');
const closeConnection = require('./config/mongoConnection');

const session = require('express-session');
const { getAllUsers } = require('./data/users');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
// 	session({
// 		name: 'AuthCookie',
// 		secret: 'some secret string!',
// 		resave: false,
// 		saveUninitialized: true,
// 	})
// );

// //if user tries to access private route without being authenicated
// app.use('/private', (req, res, next) => {
// 	//console.log(req.session.id);
// 	if (!req.session.user) {
// 		return res.status(403).render('pages/error');
// 	} else {
// 		next();
// 	}
// });

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});
