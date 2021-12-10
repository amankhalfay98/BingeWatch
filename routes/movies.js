const express = require('express');
const { users } = require('../data');
const router = express.Router();
// const data = require('../data');
// const usersData = require('../data/users');
const data = require('../data');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	},
});

const upload = multer({ storage: storage });
// const usersData = require('../data/users');
const moviesData = data.movies;
const usersData = data.users;
const validation = require('../data/validation');

router.get('/all', async (req, res) => {
	try {
		const listRest = await moviesData.getAllMovies();
		res.render('movies/allMovies', {
			movieList: listRest,
			title: 'Characters Found',
		});
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	}
});

// router.post('/all/:genre', async (req, res) => {
//   try {
//     const sorted = await moviesData.getByGenre(req.params.genre);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

// router.post('/all/:year', async (req, res) => {
//   try {
//     const sorted = await moviesData.getReleaseYear(req.params.year);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

// router.post('/all/:service', async (req, res) => {
//   try {
//     const sorted = await moviesData.getStreamingervice(req.params.service);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

// router.post('/all/:rate', async (req, res) => {
//   try {
//     const sorted = await moviesData.getRating(req.params.rate);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

router.post('/all/:value', async (req, res) => {
	try {
		//const sorted = await moviesData.getByGenre(req.params.genre);
		//res.render('movies/allMovies',{movieList:sorted,title:'Characters Found'});
		return sorted;
		//return sorted;
		//res.render('movies/allMovies',{movieList:listRest,title:'Characters Found'});
		const sorted = await moviesData.getSort(req.params.value);
		res.json(sorted);
	} catch (e) {}
});

router.get('/addMovie', async (req, res) => {
	if (req.session.user) {
		try {
			res.render('movies/newMovie', { title: 'Characters Found' });
		} catch (e) {
			res
				.status(400)
				.render('pages/error', { error: e, title: 'Search Error' });
		}
	} else {
		res.redirect('/');
	}
});

router.get('/:id', async (req, res) => {
	//console.log(req.params.id);
	//console.log(req.session);
	if (req.session.user) {
		try {
			const movie = await moviesData.getMovie(req.params.id);
			let rev = await usersData.getUser(req.session.user.username);

			// Getting details from session
			//console.log(movie);
			console.log(rev);

			res.render('movies/individualMovie', {
				movie: movie,
				title: 'Characters Found',
			});
		} catch (e) {
			res
				.status(400)
				.render('pages/error', { error: e, title: 'Search Error' });
		}
	} else {
		res.status(403).render('pages/error');
	}
});

//WIP!!!!!
router.get('/', async (req, res) => {
	try {
		const listRest = await moviesData.getTrending();
		res.status(200).render('movies/allMovies', {
			movieList: listRest,
			title: 'Characters Found',
		});
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	}
});

router.post('/addMovie', async (req, res) => {
	const moviesDataList = req.body;
	console.log(moviesDataList);
	if (
		moviesDataList &&
		moviesDataList.stream_service &&
		moviesDataList.stream_service_url
	) {
		moviesDataList.streaming_services = {
			name: moviesDataList.stream_service,
			link: moviesDataList.stream_service_url,
		};
	}
	if (!moviesDataList.movie_name) {
		res.status(400).json({ error: 'You must provide Name of the Movie' });
		return;
	}
	if (!moviesDataList.director) {
		res
			.status(400)
			.json({ error: 'You must provide the director name of the Movie' });
		return;
	}
	if (!moviesDataList.release_year) {
		res
			.status(400)
			.json({ error: 'You must provide release year of the Movie' });
		return;
	}
	if (!moviesDataList.cast) {
		res.status(400).json({ error: 'You must provide cast of the Movie' });
		return;
	}
	if (!moviesDataList.genre) {
		res.status(400).json({ error: 'You must provide genre of the Movie' });
		return;
	}
	if (!moviesDataList.streaming_services) {
		res
			.status(400)
			.json({ error: 'You must provide streaming services of the Movie' });
		return;
	}
	if (!moviesDataList.movie_img) {
		res
			.status(400)
			.json({ error: 'You must provide poster/image of the Movie' });
		return;
	}
	if (moviesDataList && moviesDataList.cast) {
		moviesDataList.cast = moviesDataList.cast.split('\r\n');
	}
	if (moviesDataList && moviesDataList.genre) {
		moviesDataList.genre = moviesDataList.genre.split();
	}
	moviesDataList.release_year = parseInt(moviesDataList.release_year);
	try {
		const {
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img,
		} = moviesDataList;
		const newMovie = await moviesData.createMovie(
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img
		);
		res.status(200).json(newMovie);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

// //TESTS ALPHABETICAL SORT
// router.get('/alpha', async (req, res) => {
//   try {
//     const listRest = await moviesData.sortAlphabetically();
//     res.status(200).json(listRest);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// //TESTS GENRE FILTER
// router.get('/genre', async (req, res) => {
//   try {
//     const listRest = await moviesData.getByGenre("comedy");
//     res.status(200).json(listRest);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.post('/addMovie', upload.single('movie_img'), async (req, res) => {
	let username =
		req.session.user != undefined || req.session.user != null
			? req.session.user
			: 'temp';
	console.log(req.file);
	const moviesDataList = req.body;
	if (req && req.file && req.file.fieldname === 'movie_img' && moviesDataList) {
		moviesDataList.movie_img = req.file.path;
	}
	if (
		moviesDataList &&
		moviesDataList.stream_service &&
		moviesDataList.stream_service_url
	) {
		moviesDataList.streaming_services = {
			name: moviesDataList.stream_service,
			link: moviesDataList.stream_service_url,
		};
	}
	if (!moviesDataList.movie_name) {
		res.status(400).json({ error: 'You must provide Name of the Movie' });
		return;
	}
	if (!moviesDataList.director) {
		res
			.status(400)
			.json({ error: 'You must provide the director name of the Movie' });
		return;
	}
	if (!moviesDataList.release_year) {
		res
			.status(400)
			.json({ error: 'You must provide release year of the Movie' });
		return;
	}
	if (!moviesDataList.cast) {
		res.status(400).json({ error: 'You must provide cast of the Movie' });
		return;
	}
	if (!moviesDataList.genre) {
		res.status(400).json({ error: 'You must provide genre of the Movie' });
		return;
	}
	if (!moviesDataList.streaming_services) {
		res
			.status(400)
			.json({ error: 'You must provide streaming services of the Movie' });
		return;
	}
	if (!moviesDataList.movie_img) {
		res
			.status(400)
			.json({ error: 'You must provide poster/image of the Movie' });
		return;
	}
	if (moviesDataList && moviesDataList.cast) {
		moviesDataList.cast = moviesDataList.cast.split('\r\n');
	}
	if (moviesDataList && moviesDataList.genre) {
		moviesDataList.genre = moviesDataList.genre.split();
	}
	moviesDataList.release_year = parseInt(moviesDataList.release_year);

	try {
		const {
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img,
		} = moviesDataList;
		const newMovie = await moviesData.createMovie(
			username,
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img
		);
		res.status(200).json(newMovie);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.put('/edit/:id', async (req, res) => {
	const updatedData = req.body;
	if (
		!updatedData.movie_name ||
		!updatedData.director ||
		!updatedData.release_year ||
		!updatedData.cast ||
		!updatedData.genre ||
		!updatedData.streaming_services
	) {
		res.status(400).json({ error: 'You must Supply All fields' });
		return;
	}
	try {
		await moviesData.getMovie(req.params.id);
	} catch (e) {
		res.status(404).json({ error: 'Movie/TV Show not found' });
		return;
	}

	try {
		const {
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img,
		} = updatedData;
		const updatedMovie = await moviesData.updatingMovie(
			req.params.id,
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img
		);
		res.status(200).json(updatedMovie);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

//ADDING MOVIE TO USER'S FAVE LIST
router.get('/favorite/:id', async (req, res) => {
	try {
		const movie = await moviesData.getMovie(req.params.id);
		const user = await usersData.addToFave('royroy', movie['movie_name']);
		res.status(200).json(user);
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	}
});

//ADDING MOVIE TO USER'S WATCHLIST
router.get('/watchlist/:id', async (req, res) => {
	try {
		const movie = await moviesData.getMovie(req.params.id);
		const user = await usersData.addToWatch('royroy', movie['movie_name']);
		res.status(200).json(user);
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	}
});

//MARKING MOVIE AS WATCHED
router.get('/watched/:id', async (req, res) => {
	try {
		const movie = await moviesData.getMovie(req.params.id);
		const watchMovie = await moviesData.movieWatched(
			'royroy',
			movie['movie_name']
		);
		res.status(200).json(watchMovie);
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	}
});

// router.post('/addMovie', async (req, res) => {
//     const moviesDataList = req.body;
//     if (!moviesDataList.movie_name) {
//       res.status(400).json({ error: 'You must provide Name of the Movie' });
//       return;
//     }
//     if (!moviesDataList.director) {
//       res.status(400).json({ error: 'You must provide the director name of the Movie' });
//       return;
//     }
//     if (!moviesDataList.release_year) {
//       res.status(400).json({ error: 'You must provide release year of the Movie' });
//       return;
//     }
//     if (!moviesDataList.cast) {
//       res.status(400).json({ error: 'You must provide cast of the Movie' });
//       return;
//     }
//     if (!moviesDataList.genre) {
//       res.status(400).json({ error: 'You must provide genre of the Movie' });
//       return;
//     }
//     if (!moviesDataList.streaming_services) {
//       res.status(400).json({ error: 'You must provide streaming services of the Movie' });
//       return;
//     }
//     if (!moviesDataList.movie_img) {
//       res.status(400).json({ error: 'You must provide poster/image of the Movie' });
//       return;
//     }

//     try {
//       const { movie_name, director, release_year, cast, streaming_services, genre, movie_img } = moviesDataList;
//       const newMovie = await moviesData.createMovie(movie_name, director, release_year, cast, streaming_services,genre, movie_img);
//       res.status(200).json(newMovie);
//     } catch (e) {
//       res.status(500).json({ error: e });
//     }
//   });

router.put('/edit/:id', async (req, res) => {
	const updatedData = req.body;
	if (
		!updatedData.movie_name ||
		!updatedData.director ||
		!updatedData.release_year ||
		!updatedData.cast ||
		!updatedData.genre ||
		!updatedData.streaming_services
	) {
		res.status(400).json({ error: 'You must Supply All fields' });
		return;
	}
	try {
		await moviesData.getMovie(req.params.id);
	} catch (e) {
		res.status(404).json({ error: 'Movie/TV Show not found' });
		return;
	}

	try {
		const {
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img,
		} = updatedData;
		const updatedMovie = await moviesData.updatingMovie(
			req.params.id,
			movie_name,
			director,
			release_year,
			cast,
			streaming_services,
			genre,
			movie_img
		);
		res.status(200).json(updatedMovie);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

// router.delete('/:id', async (req, res) => {
//     if (!req.params.id) {
//       res.status(400).json({ error: 'You must Supply an ID to delete' });
//       return;
//     }
//     try {
//       await moviesData.get(req.params.id);
//     } catch (e) {
//       res.status(404).json({ error: 'Movie not found' });
//       return;
//     }
//     try {
//       const delmovie = await moviesData.remove(req.params.id);
//       res.status(200).json(delmovie);
//     } catch (e) {
//       res.status(500).json({ error: e });
//     }
//   });

module.exports = router;
