const userRoutes = require('./users');
const reviewsRoutes = require('./reviews');

const constructorMethod = (app) => {
	app.use('/', userRoutes);
	app.use('/reviews', reviewsRoutes);

	app.use('*', (req, res) => {
		res.status(404).json({ error: 'Page Not found' });
	});
};

module.exports = constructorMethod;
