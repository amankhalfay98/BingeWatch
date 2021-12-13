const connection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const movies = data.movies;
const reviews = data.reviews;

async function main() {
  const db = await connection.connectToDb();
  await db.dropDatabase();

  const user1 = await users.createUser(
    "Roy Rogers",
    "12/12/1984",
    "royRoy",
    "123456yes",
    "royrogers@gmail.com",
    "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
  );
  const user2 = await users.createUser(
    "Mary Shelley",
    "01/12/1959",
    "MaryLovely",
    "marylamb",
    "shelleylovely@yahoo.com",
    "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
  );
  const user3 = await users.createUser(
    "Rich Jackson",
    "07/19/2000",
    "AllDaMoney",
    "gogogo",
    "richboi@hotmail.com",
    "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
  );
  const user4 = await users.createUser(
    "Mike Jorgan",
    "10/18/2005",
    "MJGoat",
    "forthewin",
    "mjorgan@gmail.com",
    "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
  );
  const user5 = await users.createUser(
    "Lilly Potter",
    "04/13/1997",
    "harryfangirl",
    "abracadabra",
    "potterforlife@yahoo.com",
    "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
  );

  //DON'T DELETE, WILL MANUALLY TEST FAIL CASES LATER
  // const user6 = await users.createUser("Lilly Potter", "08/13/2018", "harryfangirl", "abracadabra", "potterforlife@yahoo.com");

  const avengers = await movies.seedCreate(
    user1.username,
    "Avengers",
    "Joss Whedon",
    2012,
    ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    {
      name: "Disney+",
      link: "https://www.disneyplus.com/movies/marvel-studios-the-avengers/2h6PcHFDbsPy",
    },
    "Action",
    "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg"
  );

  const inception = await movies.seedCreate(
    user2.username,
    "Inception",
    "Christopher Nolan",
    2010,
    ["Leonardo DiCaprio", "Elliot Page", "Joseph Gordon-Levitt"],
    {
      name: "Hulu",
      link: "https://www.hulu.com/movie/inception-5519f425-9b21-48fb-8e67-aef24c76604a?entity_id=5519f425-9b21-48fb-8e67-aef24c76604a",
    },
    "Science-Fiction",
    "https://flxt.tmsimg.com/assets/p7825626_p_v10_af.jpg"
  );

  const forrest = await movies.seedCreate(
    user3.username,
    "Forrest Gump",
    "Robert Zemeckis",
    1994,
    ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    {
      name: "Amazon",
      link: "https://www.amazon.com/gp/video/detail/amzn1.dv.gti.f4a9f7ae-8751-637f-45fe-baf203e8df44?autoplay=1&ref_=atv_cf_strg_wb",
    },
    "Comedy",
    "https://m.media-amazon.com/images/I/81xTx-LxAPL._SL1500_.jpg"
  );

  const ultron = await movies.seedCreate(
    user1.username,
    "Avengers: Age of Ultron",
    "Joss Whedon",
    2015,
    ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    {
      name: "Disney+",
      link: "https://www.disneyplus.com/movies/marvel-studios-avengers-age-of-ultron/76IUxY0rNHzt?irclickid=WD-U-91IHxyITsK194zLNw5PUkGzPYzFo2Su2A0&irgwc=1&cid=DSS-Affiliate-Impact-Content-New%20York%20Post%20Network-564546",
    },
    "Action",
    "https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_FMjpg_UX1000_.jpg"
  );

  const infinity = await movies.seedCreate(
    user4.username,
    "Avengers: Infinity War",
    "Anthony Russo",
    2018,
    ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    {
      name: "Disney+",
      link: "https://www.disneyplus.com/movies/marvel-studios-avengers-infinity-war/1WEuZ7H6y39v",
    },
    "Action",
    "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg"
  );

  const endgame = await movies.seedCreate(
    user5.username,
    "Avengers: Endgame",
    "Anthony Russo",
    2019,
    ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    {
      name: "Disney+",
      link: "https://www.disneyplus.com/movies/marvel-studios-avengers-endgame/aRbVJUb2h2Rf",
    },
    "Action",
    "https://lumiere-a.akamaihd.net/v1/images/p_avengersendgame_19751_e14a0104.jpeg?region=0%2C0%2C540%2C810"
  );

  const chicks = await movies.seedCreate(
    user5.username,
    "White Chicks",
    "Keenan Ivory Wayans",
    2004,
    ["Shawn Wayans", "Marlon Wayans", "Jaime King", "Terry Crews"],
    {
      name: "Amazon",
      link: "https://www.amazon.com/White-Chicks-Shawn-Wayans/dp/B000I9YV62",
    },
    "Comedy",
    "https://flxt.tmsimg.com/assets/p34622_p_v10_at.jpg"
  );

  const us = await movies.seedCreate(
    user4.username,
    "Us",
    "Jordan Peele",
    2019,
    ["Lupita Nyong'o", "Winston Duke", "Elisabeth Moss", "Tim Heidecker"],
    {
      name: "Amazon",
      link: "https://www.amazon.com/Us-Lupita-Nyongo/dp/B07PH2LGM2",
    },
    "Horror",
    "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/us_ver3_480x.progressive.jpg?v=1613582988"
  );

  const after = await movies.seedCreate(
    user2.username,
    "After We Fell",
    "Castille Landon",
    2021,
    ["Josephine Langford", "Hero Fiennes-Tiffin"],
    {
      name: "Amazon",
      link: "https://www.amazon.com/gp/video/detail/amzn1.dv.gti.7ee769a7-9206-4ac7-8f9f-89df37b8483e?autoplay=1&ref_=atv_cf_strg_wb",
    },
    "Romance",
    "https://images2.minutemediacdn.com/image/fetch/w_2000,h_2000,c_fit/https%3A%2F%2Fnetflixlife.com%2Ffiles%2F2021%2F03%2FAFTERWEFELL_27x40_PAYOFF_HOTTUB.jpg"
  );

  const citizen = await movies.seedCreate(
    user3.username,
    "Citizen Kane",
    "Orson Welles",
    1941,
    ["Orson Welles", "Joseph Cotten", "Dorothy Comingore"],
    {
      name: "Amazon",
      link: "https://www.amazon.com/Citizen-Kane-Orson-Welles/dp/B00GJBCMB4",
    },
    "Mystery",
    "https://upload.wikimedia.org/wikipedia/commons/c/c0/Citizen_Kane_poster%2C_1941_%28Style_B%2C_unrestored%29.jpg"
  );

  const review1 = await reviews.create(
    user1.username,
    avengers["_id"].toString(),
    avengers.movie_name,
    "Good Movie!",
    5
  );
  const review2 = await reviews.create(
    user2.username,
    avengers["_id"].toString(),
    avengers.movie_name,
    "Meh Movie!",
    2
  );
  const review3 = await reviews.create(
    user3.username,
    avengers["_id"].toString(),
    avengers.movie_name,
    "Worst Movie!",
    1
  );

  const review4 = await reviews.create(
    user4.username,
    inception["_id"].toString(),
    inception.movie_name,
    "so confusing...",
    2
  );
  const review5 = await reviews.create(
    user5.username,
    inception["_id"].toString(),
    inception.movie_name,
    "Pretty meh.",
    3
  );
  const review6 = await reviews.create(
    user1.username,
    inception["_id"].toString(),
    inception.movie_name,
    "Liked the music, that's it.",
    2
  );

  const review7 = await reviews.create(
    user2.username,
    forrest["_id"].toString(),
    forrest.movie_name,
    "Tom Hanks da Goat!",
    5
  );
  const review8 = await reviews.create(
    user3.username,
    forrest["_id"].toString(),
    forrest.movie_name,
    "Very heartwarming yet soul-crushing :(",
    4
  );
  const review9 = await reviews.create(
    user4.username,
    forrest["_id"].toString(),
    forrest.movie_name,
    "Such an amazing way to tell a story about love!",
    5
  );

  const review10 = await reviews.create(
    user5.username,
    ultron["_id"].toString(),
    ultron.movie_name,
    "WORST ONE IN THE TRILOGY!",
    2
  );
  const review11 = await reviews.create(
    user1.username,
    ultron["_id"].toString(),
    ultron.movie_name,
    "Was ok",
    3
  );
  const review12 = await reviews.create(
    user2.username,
    ultron["_id"].toString(),
    ultron.movie_name,
    "mehhhhhhhhhhhhhhhhhhhhhhh",
    3
  );

  const review13 = await reviews.create(
    user3.username,
    infinity["_id"].toString(),
    infinity.movie_name,
    "Spider-man :(((((((((((((((((((",
    4
  );
  const review14 = await reviews.create(
    user4.username,
    infinity["_id"].toString(),
    infinity.movie_name,
    "FUCK THANOSSSSSS",
    4
  );
  const review15 = await reviews.create(
    user5.username,
    infinity["_id"].toString(),
    infinity.movie_name,
    "Can't wait for part 2 :)))))))))))))))))",
    5
  );

  const review16 = await reviews.create(
    user1.username,
    endgame["_id"].toString(),
    endgame.movie_name,
    "AMAZING ENDING FOR THE TRILOGY!",
    5
  );
  const review17 = await reviews.create(
    user2.username,
    endgame["_id"].toString(),
    endgame.movie_name,
    "Nooooo Iron Man!!!!! :(",
    5
  );
  const review18 = await reviews.create(
    user3.username,
    endgame["_id"].toString(),
    endgame.movie_name,
    "THANK YOU MARVEL!!!!",
    5
  );

  const review19 = await reviews.create(
    user4.username,
    chicks["_id"].toString(),
    chicks.movie_name,
    "Good Movie!",
    5
  );
  const review20 = await reviews.create(
    user5.username,
    chicks["_id"].toString(),
    chicks.movie_name,
    "Meh",
    2
  );
  const review21 = await reviews.create(
    user1.username,
    chicks["_id"].toString(),
    chicks.movie_name,
    "So badddddddddddddddddddddddd",
    2
  );

  const review22 = await reviews.create(
    user2.username,
    us["_id"].toString(),
    us.movie_name,
    "Good Movie!",
    4
  );
  const review23 = await reviews.create(
    user3.username,
    us["_id"].toString(),
    us.movie_name,
    "Meh",
    1
  );
  const review24 = await reviews.create(
    user4.username,
    us["_id"].toString(),
    us.movie_name,
    "So badddddddddddddddddddddddd",
    1
  );

  const review25 = await reviews.create(
    user5.username,
    after["_id"].toString(),
    after.movie_name,
    "Good Movie!",
    4
  );
  const review26 = await reviews.create(
    user1.username,
    after["_id"].toString(),
    after.movie_name,
    "Meh",
    3
  );
  const review27 = await reviews.create(
    user2.username,
    after["_id"].toString(),
    after.movie_name,
    "So badddddddddddddddddddddddd",
    1
  );

  const review28 = await reviews.create(
    user3.username,
    citizen["_id"].toString(),
    citizen.movie_name,
    "Good Movie!",
    5
  );
  const review29 = await reviews.create(
    user4.username,
    citizen["_id"].toString(),
    citizen.movie_name,
    "Meh",
    3
  );
  const review30 = await reviews.create(
    user5.username,
    citizen["_id"].toString(),
    citizen.movie_name,
    "So badddddddddddddddddddddddd",
    2
  );

  // try {
  //   const addFave = await dbFunctions.users.addToFave(
  //     "royroy",
  //     "Avengers"
  //   );
  //   console.log(addFave);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const addFollow = await dbFunctions.users.followUser(
  //     "royroy",
  //     "marylovely"
  //   );
  //   console.log(addFollow);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const watchMovie = await dbFunctions.movies.movieWatched(
  //     "royroy",
  //     "Avengers"
  //   );
  //   console.log(watchMovie);
  // } catch (e) {
  //   console.log(e);
  // }

  await connection.closeConnection();
  console.log("Done!");
}

main().catch((error) => {
  console.log(error);
});
