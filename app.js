const express = require('express');
const session = require('express-session');
const app = express();

const static = express.static(__dirname + "/public");
app.use("/public", static);


const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const { client } = require('./config/mongoConnection');
const users = require('./data/users');
const closeConnection = require('./config/mongoConnection');



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		name: 'AuthCookie',
		secret: 'some secret string!',
		resave: false,
		saveUninitialized: true,
	})
);

//if user tries to access private route without being authenicated
app.use('/private', (req, res, next) => {
	//console.log(req.session.id);
	if (!req.session.user) {
		return res.status(403).render('pages/error');
	} else {
		next();
	}
});

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});
